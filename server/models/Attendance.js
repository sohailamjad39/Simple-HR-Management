// server/models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Late"],
      required: true,
    },
    inTime: {
      type: String,
    },
    outTime: {
      type: String,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Ensure one attendance per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);