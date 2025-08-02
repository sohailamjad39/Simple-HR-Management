// server/models/Leave.js
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    // 🔹 Employee
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // 🔹 Leave Type
    leaveType: {
      type: String,
      required: true,
      enum: ["Sick", "Casual", "Earned", "Maternity", "Paternity", "Unpaid", "Bereavement", "Study", "Work From Home"],
    },

    // 🔹 Dates
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },

    // 🔹 Reason
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // 🔹 Status (HR managed)
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },

    // 🔹 Remarks
    remarks: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // 🔹 Created & Approved by HR
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HR",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HR",
    },

    // 🔹 Optional: Work coverage
    coveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Leave", leaveSchema);