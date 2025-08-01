// server/controllers/dashboardController.js
import asyncHandler from "express-async-handler";
import Employee from "../models/Employee.js";
import LeaveRequest from "../models/LeaveRequest.js";
import JobOpening from "../models/JobOpening.js";

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalEmployees = await Employee.countDocuments();
  const activeEmployees = await Employee.countDocuments({ status: "Active" });
  const inactiveEmployees = totalEmployees - activeEmployees;

  const upcomingLeaves = await LeaveRequest.countDocuments({
    status: "Approved",
    startDate: { $gte: new Date() },
  });

  const vacantPositions = await JobOpening.countDocuments({ status: "Open" });

  const urgentVacancies = await JobOpening.countDocuments({
    status: "Open",
    priority: "Urgent", // Optional: add priority field later
  });

  // Mock recent activity (you can replace with real logs later)
  const recentActivity = [
    {
      action: "New employee added",
      user: "John Doe",
      time: "2 min ago",
    },
    {
      action: "Leave approved",
      user: "Alice Smith",
      time: "15 min ago",
    },
    {
      action: "Interview scheduled",
      user: "Bob Lee",
      time: "1 hour ago",
    },
    {
      action: "Job posted",
      user: "HR Team",
      time: "3 hours ago",
    },
  ];

  res.json({
    success: true,
    data: {
      totalEmployees,
      activeInactive: { active: activeEmployees, inactive: inactiveEmployees },
      upcomingLeaves,
      vacantPositions,
      urgentVacancies,
      recentActivity,
    },
  });
});