// server/models/LeaveRequest.js
import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
      enum: ["Sick", "Casual", "Earned", "Maternity", "Paternity", "Unpaid"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HR",
    },
    remarks: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LeaveRequest", leaveRequestSchema);