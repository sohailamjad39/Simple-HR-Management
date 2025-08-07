// server/controllers/leaveController.js
import asyncHandler from "express-async-handler";
import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

/**
 * @desc    Get all leaves created by the logged-in HR
 * @route   GET /api/leaves
 * @access  Private
 */
export const getLeaves = asyncHandler(async (req, res) => {
  const { search, employee, leaveType, status, startDate, endDate } = req.query;

  // Build query: only HR's own leaves
  let query = {};

  // Search by employee name, email, or ID
  if (search) {
    const empMatches = await Employee.find({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
      ],
    });
    const empIds = empMatches.map((e) => e._id);
    query.employee = { $in: empIds };
  }

  if (employee) query.employee = employee;
  if (leaveType) query.leaveType = leaveType;
  if (status) query.status = status;

  // Date filtering
  if (startDate || endDate) {
    query.startDate = {};
    if (startDate) query.startDate.$gte = new Date(startDate);
    if (endDate) query.startDate.$lte = new Date(endDate);
  }

  const leaves = await Leave.find(query)
    .populate("employee", "fullName email employeeId department")
    .populate("coveredBy", "fullName")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    leaves,
  });
});

/**
 * @desc    Create a new leave record (by HR)
 * @route   POST /api/leaves
 * @access  Private
 */
export const createLeave = asyncHandler(async (req, res) => {
  const {
    employee,
    leaveType,
    startDate,
    endDate,
    reason,
    remarks,
    coveredBy,
    status,  
  } = req.body;

  // Validate required fields
  if (!employee || !leaveType || !startDate || !endDate || !reason) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // Check if employee exists
  const emp = await Employee.findById(employee);
  if (!emp) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    res.status(400);
    throw new Error("Invalid date format");
  }
  if (end < start) {
    res.status(400);
    throw new Error("End date cannot be before start date");
  }

  const validStatuses = ["Pending", "Approved", "Rejected", "Cancelled"];
  const finalStatus = validStatuses.includes(status) ? status : "Pending";

  // Create leave
  const leave = await Leave.create({
    employee,
    leaveType,
    startDate: start,
    endDate: end,
    reason,
    remarks: remarks || undefined,
    coveredBy: coveredBy || undefined,
    createdBy: req.user._id,
    status: finalStatus, 
    ...(finalStatus === "Approved" && { approvedBy: req.user._id }), 
  });

  const populatedLeave = await Leave.findById(leave._id)
    .populate("employee", "fullName email employeeId department")
    .populate("coveredBy", "fullName");

  res.status(201).json({
    success: true,
    leave: populatedLeave,
  });
});

/**
 * @desc    Update leave (Edit)
 * @route   PATCH /api/leaves/:id
 * @access  Private
 */
export const updateLeave = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { leaveType, startDate, endDate, reason, remarks, coveredBy, status } =
    req.body;

  const leave = await Leave.findById(id);
  if (!leave) {
    res.status(404);
    throw new Error("Leave not found");
  }

  if (leave.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  // Update fields
  if (leaveType) leave.leaveType = leaveType;
  if (startDate) leave.startDate = new Date(startDate);
  if (endDate) leave.endDate = new Date(endDate);
  if (reason) leave.reason = reason;
  if (remarks !== undefined) leave.remarks = remarks;
  if (coveredBy) leave.coveredBy = coveredBy;

  // Allow HR to set status directly
  if (["Pending", "Approved", "Rejected", "Cancelled"].includes(status)) {
    leave.status = status;
    if (status === "Approved") {
      leave.approvedBy = req.user._id;
    }
  }

  const updated = await leave.save();
  res.json({ success: true, updated });
});

/**
 * @desc    Delete a leave
 * @route   DELETE /api/leaves/:id
 * @access  Private
 */
export const deleteLeave = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const leave = await Leave.findById(id);
  if (!leave) {
    res.status(404);
    throw new Error("Leave not found");
  }

  if (leave.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await Leave.deleteOne({ _id: id });
  res.json({ success: true, message: "Leave deleted successfully" });
});

/**
 * @desc    Update leave status (Approve/Reject)
 * @route   PATCH /api/leaves/:id/status
 * @access  Private
 */
export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  // Validate status
  if (!["Pending", "Approved", "Rejected", "Cancelled"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const leave = await Leave.findById(id);
  if (!leave) {
    res.status(404);
    throw new Error("Leave not found");
  }

  // Only HR who created can update
  if (leave.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this leave");
  }

  // Update status
  leave.status = status;
  if (status === "Approved") {
    leave.approvedBy = req.user._id;
  }
  if (remarks) {
    leave.remarks = remarks;
  }

  const updated = await leave.save();

  res.json({
    success: true,
    leave: updated,
  });
});
