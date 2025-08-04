// server/controllers/attendanceController.js
import asyncHandler from "express-async-handler";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

/**
 * @desc    Get daily attendance for a date
 * @route   GET /api/attendance/daily
 * @access  Private
 */
export const getDailyAttendance = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Date is required",
    });
  }

  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  const startOfDay = new Date(
    Date.UTC(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      0,
      0,
      0
    )
  );

  const endOfDay = new Date(
    Date.UTC(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      23,
      59,
      59,
      999
    )
  );

  const query = { date: { $gte: startOfDay, $lte: endOfDay } };

  if (req.query.status) query.status = req.query.status;
  if (req.query.isLate !== undefined)
    query.isLate = req.query.isLate === "true";
  if (req.query.search) {
    const empMatches = await Employee.find({
      $or: [
        { fullName: { $regex: req.query.search, $options: "i" } },
        { employeeId: { $regex: req.query.search, $options: "i" } },
        { department: { $regex: req.query.search, $options: "i" } },
      ],
    });
    query.employee = { $in: empMatches.map((e) => e._id) };
  }

  const attendance = await Attendance.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  })
    .populate("employee", "fullName employeeId department")
    .populate("recordedBy", "fullName");

  // Get all active employees
  const employees = await Employee.find(
    { status: "Active" },
    "fullName employeeId department"
  );

  const employeeMap = new Map(
    employees.map((emp) => [emp._id.toString(), emp])
  );
  const attendanceMap = new Map(
    attendance.map((att) => [att.employee._id.toString(), att])
  );

  const fullAttendance = employees.map((emp) => {
    const att = attendanceMap.get(emp._id.toString());
    return (
      att || {
        employee: emp,
        date: targetDate,
        status: "Absent",
        isLate: false,
      }
    );
  });

  res.json({
    success: true,
    fullAttendance,
  });
});

/**
 * @desc    Add or update manual attendance
 * @route   POST /api/attendance/manual
 * @access  Private
 */
export const addManualAttendance = asyncHandler(async (req, res) => {
  const { employee, date, inTime, outTime, status, isLate, remarks } = req.body;

  if (!employee || !date || !status) {
    return res.status(400).json({
      success: false,
      message: "Employee, date, and status are required",
    });
  }

  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  const emp = await Employee.findById(employee);
  if (!emp) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  let inTimeDate, outTimeDate;
  if (inTime) {
    inTimeDate = new Date(`${date}T${inTime}`);
  }
  if (outTime) {
    outTimeDate = new Date(`${date}T${outTime}`);
  }

  if (inTimeDate && outTimeDate && outTimeDate < inTimeDate) {
    return res.status(400).json({
      success: false,
      message: "Out time cannot be before in time",
    });
  }

  let attendance = await Attendance.findOne({ employee, date: targetDate });

  if (attendance) {
    // Update
    attendance.inTime = inTimeDate || attendance.inTime;
    attendance.outTime = outTimeDate || attendance.outTime;
    attendance.status = status;
    attendance.isLate = isLate || false;
    attendance.remarks = remarks || attendance.remarks;
  } else {
    // Create
    attendance = await Attendance.create({
      employee,
      date: targetDate,
      inTime: inTimeDate,
      outTime: outTimeDate,
      status,
      isLate: isLate || false,
      remarks,
      recordedBy: req.user._id,
    });
  }

  await attendance.populate("employee", "fullName employeeId");
  await attendance.populate("recordedBy", "fullName");

  res.status(201).json({
    success: true,
    attendance,
  });
});

/**
 * @desc    Get monthly summary report
 * @route   GET /api/attendance/monthly
 * @access  Private
 */
export const getMonthlyReport = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const targetMonth = parseInt(month, 10);
  const targetYear = parseInt(year, 10);

  if (isNaN(targetMonth) || isNaN(targetYear)) {
    return res.status(400).json({
      success: false,
      message: "Valid month and year are required",
    });
  }

  const start = new Date(targetYear, targetMonth - 1, 1);
  const end = new Date(targetYear, targetMonth, 0, 23, 59, 59);

  const attendance = await Attendance.find({
    date: { $gte: start, $lte: end },
  })
    .populate("employee", "fullName employeeId")
    .sort({ date: 1 });

  const report = {};

  attendance.forEach((att) => {
    const empId = att.employee._id.toString();
    if (!report[empId]) {
      report[empId] = {
        employee: att.employee,
        totalDays: 0,
        present: 0,
        late: 0,
        leave: 0,
      };
    }
    report[empId].totalDays++;
    if (att.status === "Present" || att.status === "Half-Day")
      report[empId].present++;
    if (att.isLate) report[empId].late++;
    if (att.status === "Leave") report[empId].leave++;
  });

  res.json({
    success: true,
    data: {
      startDate: start,
      endDate: end,
      data: Object.values(report),
    },
  });
});

/**
 * @desc    Update attendance (Edit)
 * @route   PATCH /api/attendance/:id
 * @access  Private
 */
export const updateAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { inTime, outTime, status, isLate, remarks } = req.body;

  const attendance = await Attendance.findById(id);
  if (!attendance) {
    return res.status(404).json({
      success: false,
      message: "Attendance not found",
    });
  }

  // Only HR who recorded can update
  if (attendance.recordedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized",
    });
  }

  // Update fields
  if (inTime)
    attendance.inTime = new Date(
      `${attendance.date.toISOString().split("T")[0]}T${inTime}`
    );
  if (outTime)
    attendance.outTime = new Date(
      `${attendance.date.toISOString().split("T")[0]}T${outTime}`
    );
  if (status) attendance.status = status;
  attendance.isLate = Boolean(isLate);
  if (remarks !== undefined) attendance.remarks = remarks;

  const updated = await attendance.save();
  await updated.populate("employee", "fullName employeeId");
  await updated.populate("recordedBy", "fullName");

  res.json({
    success: true,
    attendance: updated,
  });
});

/**
 * @desc    Delete attendance
 * @route   DELETE /api/attendance/:id
 * @access  Private
 */
export const deleteAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const attendance = await Attendance.findById(id);
  if (!attendance) {
    return res.status(404).json({
      success: false,
      message: "Attendance not found",
    });
  }

  if (attendance.recordedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized",
    });
  }

  await Attendance.deleteOne({ _id: id });
  res.json({
    success: true,
    message: "Attendance deleted successfully",
  });
});
