// server/controllers/employeeController.js
import asyncHandler from "express-async-handler";
import Employee from "../models/Employee.js";
import HR from "../models/HR.js";

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({}).populate("createdBy", "fullName email");
  res.json({ success: true, data: employees });
});

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate("createdBy", "fullName");
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  res.json({ success: true, data: employee });
});

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    employeeId,
    department,
    designation,
    joiningDate,
    dateOfBirth,
    gender,
    employmentType,
    address,
    emergencyContact,
  } = req.body;

  // Check for required fields
  if (!fullName || !email || !phone || !employeeId || !department || !designation || !joiningDate) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // Check duplicates
  const emailExists = await Employee.findOne({ email });
  const phoneExists = await Employee.findOne({ phone });
  const idExists = await Employee.findOne({ employeeId });

  if (emailExists) {
    res.status(400);
    throw new Error("Email already in use");
  }
  if (phoneExists) {
    res.status(400);
    throw new Error("Phone number already in use");
  }
  if (idExists) {
    res.status(400);
    throw new Error("Employee ID already exists");
  }

  // Create employee
  const employee = await Employee.create({
    employeeId: employeeId.toUpperCase(),
    fullName,
    email,
    phone,
    department,
    designation,
    joiningDate: new Date(joiningDate),
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    gender,
    employmentType: employmentType || "Full-Time",
    address,
    emergencyContact,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: employee,
  });
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  Object.assign(employee, req.body);
  const updated = await employee.save();

  res.json({ success: true, data: updated });
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  await employee.remove();
  res.json({ success: true, message: "Employee removed" });
});

export {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};