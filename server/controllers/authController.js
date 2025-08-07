// server/controllers/authController.js
import HR from "../models/HR.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

/**
 * @desc    Register a new HR user
 * @route   POST /api/auth/register
 * @access  Public
 */

const registrationAttempts = new Map();

const registerHR = async (req, res, next) => {
  const { fullName, email, phone, password, department, role } = req.body;
  const ip = req.ip || req.socket.remoteAddress;

  try {
    // === Rate Limiting: Max 3 registrations per IP in 24 hours ===
    const now = Date.now();
    const windowMs = 24 * 60 * 60 * 1000; // 24 hours

    const record = registrationAttempts.get(ip);
    if (record) {
      const timeSinceFirst = now - record.firstRequest;

      if (timeSinceFirst > windowMs) {
        // Window expired, reset counter
        registrationAttempts.set(ip, { count: 1, firstRequest: now });
      } else if (record.count >= 3) {
        // Too many attempts
        return res.status(429).json({
          success: false,
          message:
            "You have reached the registration limit. Please try again after 24 hours.",
        });
      } else {
        // Increment counter
        registrationAttempts.set(ip, {
          count: record.count + 1,
          firstRequest: record.firstRequest,
        });
      }
    } else {
      // First request from this IP
      registrationAttempts.set(ip, { count: 1, firstRequest: now });
    }
    // Validation
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check duplicates
    const existingByEmail = await HR.findOne({ email });
    const existingByPhone = await HR.findOne({ phone });

    if (existingByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    if (existingByPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already in use",
      });
    }

    // Create HR
    const hr = await HR.create({
      fullName,
      email,
      phone,
      password,
      department: department || "Human Resources",
      role: role || "HR",
    });

    // Generate token
    const token = generateToken(hr._id);

    // Update lastLogin
    hr.lastLogin = Date.now();
    await hr.save();

    // Exclude password
    const { password: _, ...hrWithoutPassword } = hr.toObject();

    res.status(201).json({
      success: true,
      data: {
        ...hrWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login HR user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginHR = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const hr = await HR.findOne({ email });

    if (!hr) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await hr.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!hr.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const token = generateToken(hr._id);

    hr.lastLogin = Date.now();
    await hr.save();

    const { password: _, ...hrWithoutPassword } = hr.toObject();

    res.json({
      success: true,
      data: {
        ...hrWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in HR profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const hr = await HR.findById(req.user._id).select("-password");

    if (!hr) {
      return res.status(404).json({
        success: false,
        message: "HR not found",
      });
    }

    res.json({
      success: true,
      data: hr,
    });
  } catch (error) {
    next(error);
  }
};

const passwordResetAttempts = new Map();

/**
 * @desc    Send password reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const ip = req.ip || req.socket.remoteAddress;

  try {
    // Rate limiting: 3 attempts per 24 hours per IP
    const now = Date.now();
    const windowMs = 24 * 60 * 60 * 1000; // 24 hours

    const record = passwordResetAttempts.get(ip);
    if (record) {
      if (now - record.firstRequest > windowMs) {
        // Window expired, reset
        passwordResetAttempts.set(ip, { count: 1, firstRequest: now });
      } else if (record.count >= 3) {
        return res.status(429).json({
          success: false,
          message: "Too many reset requests. Please try again after 24 hours.",
        });
      } else {
        passwordResetAttempts.set(ip, {
          count: record.count + 1,
          firstRequest: record.firstRequest,
        });
      }
    } else {
      passwordResetAttempts.set(ip, { count: 1, firstRequest: now });
    }

    // Check if email exists
    const hr = await HR.findOne({ email });
    if (!hr) {
      return res.status(404).json({
        success: false,
        message: "This email is not registered in our system.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

    hr.resetPasswordToken = resetToken;
    hr.resetPasswordExpiry = resetTokenExpiry;
    await hr.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const message = {
      to: hr.email,
      from: `"HR Flow" <${process.env.SMTP_EMAIL}>`,
      subject: "Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Password Reset</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9fafb;
              margin: 0;
              padding: 0;
              color: #4b5563;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #4f46e5, #7c3aed);
              padding: 30px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .header p {
              margin: 8px 0 0;
              font-size: 14px;
              opacity: 0.9;
            }
            .content {
              padding: 30px;
              text-align: center;
            }
            .content h2 {
              color: #1f2937;
              margin-top: 0;
              font-size: 22px;
            }
            .content p {
              color: #4b5563;
              margin: 16px 0;
            }
            .btn {
              display: inline-block;
              padding: 14px 28px;
              margin: 24px 0;
              background: #4f46e5;
              color: white !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
              transition: all 0.2s ease;
            }
            .btn:hover {
              background: #4338ca;
              transform: translateY(-2px);
            }
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              background: #f3f4f6;
              border-top: 1px solid #e5e7eb;
            }
            .footer p {
              margin: 4px 0;
            }
            .small {
              font-size: 12px;
              color: #6b7280;
              margin-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>HR System</h1>
              <p>Secure. Simple. Professional.</p>
            </div>
    
            <!-- Content -->
            <div class="content">
              <h2>Password Reset</h2>
              <p>Hello ${hr.fullName.split(" ")[0]},</p>
              <p>You recently requested to reset your password. Click the button below to set a new one.</p>
    
              <a href="${resetUrl}" class="btn">Reset Password</a>
    
              <p class="small">
                This link will expire in <strong>15 minutes</strong> and can only be used once.
              </p>
              <p class="small">
                If you didn’t request this, you can safely ignore this email.
              </p>
            </div>
    
            <!-- Footer -->
            <div class="footer">
              <p>© ${new Date().getFullYear()} HR Flow. All rights reserved.</p>
              <p>For support, contact your administrator.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(message);

    res.status(200).json({
      success: true,
      message: "A password reset link has been sent to your email.",
    });
  } catch (error) {
    // Clear token on error
    await HR.findOneAndUpdate(
      { email: req.body.email },
      { resetPasswordToken: undefined, resetPasswordExpiry: undefined }
    );
    next(error);
  }
};

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const hr = await HR.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!hr) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link. Please request a new one.",
      });
    }

    if (!hr.resetPasswordExpiry) {
      return res.status(400).json({
        success: false,
        message: "This reset link has already been used.",
      });
    }

    hr.password = password;

    hr.resetPasswordToken = undefined;
    hr.resetPasswordExpiry = undefined;

    await hr.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

export { registerHR, loginHR, getMe, forgotPassword, resetPassword };
