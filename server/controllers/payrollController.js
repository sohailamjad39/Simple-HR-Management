// server/controllers/payrollController.js
import asyncHandler from "express-async-handler";
import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";

/**
 * @desc    Get employee salary details
 * @route   GET /api/payroll/salary/:id
 * @access  Private
 */
export const getSalaryDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await Employee.findById(id, "fullName employeeId department");
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  const payroll = await Payroll.findOne({ employee: id })
    .populate("generatedBy", "fullName")
    .sort({ year: -1, month: -1 });

  res.json({
    success: true,
     data: {
      employee,
      current: payroll || null,
    },
  });
});

/**
 * @desc    Generate payslip for a month
 * @route   POST /api/payroll/generate
 * @access  Private
 */
export const generatePayslip = asyncHandler(async (req, res, next) => {
  const {
    employee,
    month,
    year,
    basicSalary,
    allowances, // now plain object
    deductions, // now plain object
  } = req.body;

  try {
    const emp = await Employee.findById(employee);
    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existing = await Payroll.findOne({ employee, month, year });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Payslip already generated for this month",
      });
    }

    const totalAllowances = Object.values(allowances || {}).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(deductions || {}).reduce((a, b) => a + b, 0);
    const grossSalary = basicSalary + totalAllowances;
    const netSalary = grossSalary - totalDeductions;

    const payroll = await Payroll.create({
      employee,
      month,
      year,
      basicSalary,
      allowances: { ...allowances }, 
      deductions: { ...deductions },
      grossSalary,
      netSalary,
      generatedBy: req.user._id,
      status: "Generated",
    });

    await payroll.populate("employee", "fullName employeeId department");
    await payroll.populate("generatedBy", "fullName");

    res.status(201).json({
      success: true,
       payroll,
    });
  } catch (error) {
    console.error("Payroll generation failed:", error);
    next(error);
  }
});

/**
 * @desc    Get payslip history for employee
 * @route   GET /api/payroll/history/:id
 * @access  Private
 */
export const getPayslipHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await Employee.findById(id);
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  const history = await Payroll.find({ employee: id })
    .sort({ year: -1, month: -1 })
    .populate("generatedBy", "fullName");

  res.json({
    success: true,
     history,
  });
});