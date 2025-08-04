// server/controllers/hrController.js
import asyncHandler from "express-async-handler";
import HR from "../models/HR.js";

/**
 * @desc    Get HR profile
 * @route   GET /api/hr/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const hr = await HR.findById(req.user._id).select("-password");

  if (!hr) {
    return res.status(404).json({
      success: false,
      message: "HR not found",
    });
  }

  res.json({
    success: true,
     hr,
  });
});

/**
 * @desc    Update HR profile
 * @route   PUT /api/hr/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const {
      fullName,
      email,
      phone,
      department,
      role,
      address,
      metadata, // This is a plain object
    } = req.body;
  
    const hr = await HR.findById(req.user._id);
    if (!hr) {
      return res.status(404).json({
        success: false,
        message: "HR not found",
      });
    }
  
    if (email && email !== hr.email) {
      const exists = await HR.findOne({ email });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }
  
    if (phone && phone !== hr.phone) {
      const exists = await HR.findOne({ phone });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use",
        });
      }
    }
  
    // Update fields
    hr.fullName = fullName || hr.fullName;
    hr.email = email || hr.email;
    hr.phone = phone || hr.phone;
    hr.department = department || hr.department;
    hr.role = role || hr.role;
    hr.address = { ...hr.address, ...address };
  
    if (metadata) {
      hr.metadata = new Map(Object.entries(metadata));
    }
  
    const updated = await hr.save();
  
    res.json({
      success: true,
       hr: updated,
    });
  });