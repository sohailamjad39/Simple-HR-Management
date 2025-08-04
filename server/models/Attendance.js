// server/models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    // 🔹 Employee
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // 🔹 Date
    date: {
      type: Date,
      required: true,
      unique: true,
    },

    // 🔹 Time
    inTime: {
      type: Date,
    },
    outTime: {
      type: Date,
    },

    // 🔹 Status
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Half-Day"],
      default: "Absent",
    },

    // 🔹 Late mark
    isLate: {
      type: Boolean,
      default: false,
    },

    // 🔹 Remarks
    remarks: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // 🔹 Recorded by HR
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HR",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔸 Prevent duplicate attendance for same date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);