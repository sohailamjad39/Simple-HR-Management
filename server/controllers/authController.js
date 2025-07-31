// server/controllers/authController.js
import HR from "../models/HR.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Register a new HR user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerHR = async (req, res) => {
  const { fullName, email, phone, password, department, role } = req.body;

  try {
    // 1. Validation: Required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Check duplicates (email/phone)
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

    // 3. Create HR
    const hr = await HR.create({
      fullName,
      email,
      phone,
      password,
      department: department || "Human Resources",
      role: role || "HR",
    });

    // 4. Generate token
    const token = generateToken(hr._id);

    // 5. Update lastLogin
    hr.lastLogin = Date.now();
    await hr.save();

    // 6. Response (exclude password)
    const { password: _, ...hrWithoutPassword } = hr.toObject();

    res.status(201).json({
      success: true,
      data: {
        ...hrWithoutPassword,
        token,
      },
    });
  } catch (error) {
    // Delegate to global error handler
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

export { registerHR, loginHR, getMe };