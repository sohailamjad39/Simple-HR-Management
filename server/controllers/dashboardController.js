// server/controllers/dashboardController.js
import asyncHandler from "express-async-handler";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import JobOpening from "../models/JobOpening.js";
import Payroll from "../models/Payroll.js";
import HR from "../models/HR.js";

// Helper: Format time ago (e.g., "2 min ago")
const timeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHr = Math.floor(diffInMin / 60);
  const diffInDay = Math.floor(diffInHr / 24);
  const diffInWeek = Math.floor(diffInDay / 7);

  if (diffInSec < 60) return "Just now";
  if (diffInMin < 60) return `${diffInMin} min ago`;
  if (diffInHr < 24) return `${diffInHr} hr ago`;
  if (diffInDay < 7) return `${diffInDay} day ago`;
  return new Date(date).toLocaleDateString();
};

/**
 * @desc    Get dashboard stats with real recent activity
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: "Active" });
    const inactiveEmployees = totalEmployees - activeEmployees;

    const upcomingLeaves = await Leave.countDocuments({
      status: "Approved",
      startDate: { $gte: new Date() },
    });

    const vacantPositions = await JobOpening.countDocuments({ status: "Open" });
    const urgentVacancies = await JobOpening.countDocuments({
      status: "Open",
      priority: "Urgent",
    });

    // ✅ Get real recent activity from multiple sources
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Recently added employees
    const newEmployees = await Employee.find({ createdAt: { $gte: oneWeekAgo } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName createdAt");

    // 2. Approved leaves
    const approvedLeaves = await Leave.find({ status: "Approved", createdAt: { $gte: oneWeekAgo } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("employee", "fullName")
      .populate("approvedBy", "fullName");

    // 3. New job openings
    const newJobs = await JobOpening.find({ createdAt: { $gte: oneWeekAgo } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title priority createdAt");

    // 4. Generated payslips
    const paidPayrolls = await Payroll.find({ createdAt: { $gte: oneWeekAgo } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("employee", "fullName")
      .populate("generatedBy", "fullName");

    // 5. HR profile updates (lastLogin is updated on login)
    const activeHRs = await HR.find({ lastLogin: { $gte: oneWeekAgo } })
      .sort({ lastLogin: -1 })
      .limit(5)
      .select("fullName lastLogin");

    // Build safe activity list
    const activities = [
      // ✅ New employees
      ...newEmployees.map((emp) => ({
        action: `New employee added: ${emp.fullName || "Unknown"}`,
        user: "HR Team",
        time: timeAgo(emp.createdAt),
        timestamp: emp.createdAt,
      })),

      // ✅ Approved leaves (safe)
      ...approvedLeaves
        .filter((leave) => leave.employee) // Skip if employee is missing
        .map((leave) => ({
          action: `Leave approved for ${leave.employee.fullName || "Unknown"}`,
          user: leave.approvedBy?.fullName || "System",
          time: timeAgo(leave.createdAt),
          timestamp: leave.createdAt,
        })),

      // ✅ New jobs
      ...newJobs.map((job) => ({
        action: `Job posted: ${job.title}`,
        user: "HR Team",
        time: timeAgo(job.createdAt),
        timestamp: job.createdAt,
      })),

      // ✅ Payslips generated (safe)
      ...paidPayrolls
        .filter((pay) => pay.employee) // Skip if employee is missing
        .map((pay) => ({
          action: `Payslip generated for ${pay.employee.fullName || "Unknown"}`,
          user: pay.generatedBy?.fullName || "System",
          time: timeAgo(pay.createdAt),
          timestamp: pay.createdAt,
        })),

      // ✅ HR logins
      ...activeHRs.map((hr) => ({
        action: "Logged in",
        user: hr.fullName || "Unknown HR",
        time: timeAgo(hr.lastLogin),
        timestamp: hr.lastLogin,
      })),
    ];

    // Sort by timestamp and limit to 6
    const recentActivity = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 6);

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
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
});