// server/controllers/leaveController.js
import asyncHandler from "express-async-handler";
import LeaveRequest from "../models/LeaveRequest.js";

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private
export const getLeaveRequests = asyncHandler(async (req, res) => {
  const leaves = await LeaveRequest.find({}).populate("employee", "fullName");
  res.json({ success: true,  leaves });
});

// @desc    Create a new leave request
// @route   POST /api/leaves
// @access  Private
export const createLeaveRequest = asyncHandler(async (req, res) => {
  const { employee, leaveType, startDate, endDate, reason } = req.body;

  const leave = await LeaveRequest.create({
    employee,
    leaveType,
    startDate,
    endDate,
    reason,
  });

  res.status(201).json({ success: true,  leave });
});

// @desc    Update leave status (approve/reject)
// @route   PATCH /api/leaves/:id
// @access  Private
export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const leave = await LeaveRequest.findById(id);
  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  leave.status = status;
  leave.approvedBy = req.user._id;
  leave.remarks = req.body.remarks;

  const updated = await leave.save();
  res.json({ success: true,  updated });
});