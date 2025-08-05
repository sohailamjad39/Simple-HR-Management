import asyncHandler from "express-async-handler";
import Department from "../models/Department.js";
import Designation from "../models/Designation.js";
import LeaveType from "../models/LeaveType.js";

import bcrypt from "bcryptjs";
import HR from "../models/HR.js";

// --- DEPARTMENTS ---
export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find();
  res.json({ success: true, data: departments });
});

export const addDepartment = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const exists = await Department.findOne({ name });
  if (exists) return res.status(400).json({ message: "Already exists" });

  const dept = await Department.create({ name, description });
  res.status(201).json({ success: true, data: dept });
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dept = await Department.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ success: true, data: dept });
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted" });
});

// --- DESIGNATIONS ---
export const getDesignations = asyncHandler(async (req, res) => {
  const designations = await Designation.find().populate("department", "name");
  res.json({ success: true, data: designations });
});

// (Add, Update, Delete similar)

// --- LEAVE TYPES ---
export const getLeaveTypes = asyncHandler(async (req, res) => {
  const types = await LeaveType.find();
  res.json({ success: true, data: types });
});

export const addLeaveType = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const exists = await LeaveType.findOne({ name });
  if (exists) return res.status(400).json({ message: "Already exists" });

  const type = await LeaveType.create(req.body);
  res.status(201).json({ success: true, data: type });
});

// --- DESIGNATIONS ---
export const addDesignation = asyncHandler(async (req, res) => {
  const { title, department, level } = req.body;

  const exists = await Designation.findOne({
    title: new RegExp(`^${title}$`, "i"),
  });
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Designation already exists",
    });
  }

  const designation = await Designation.create({ title, department, level });

  await designation.populate("department", "name");

  res.status(201).json({
    success: true,
    designation,
  });
});

export const updateDesignation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const designation = await Designation.findByIdAndUpdate(id, req.body, {
    new: true,
  }).populate("department", "name");

  res.json({
    success: true,
    designation,
  });
});

export const deleteDesignation = asyncHandler(async (req, res) => {
  await Designation.findByIdAndDelete(req.params.id);
  res.json({
    success: true,
    message: "Designation deleted",
  });
});

/**
 * @desc    Change HR password
 * @route   POST /api/settings/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const hr = await HR.findById(req.user._id);
  
    if (!hr) {
      return res.status(404).json({
        success: false,
        message: "HR not found",
      });
    }
  
    const isMatch = await hr.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }
  
    hr.password = newPassword; 
    await hr.save();
  
    res.json({
      success: true,
      message: "Password updated successfully",
    });
  });
