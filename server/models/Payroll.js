// server/models/Payroll.js
import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    basicSalary: Number,
    allowances: Number,
    bonuses: Number,
    deductions: Number,
    tax: Number,
    netSalary: Number,
    status: {
      type: String,
      enum: ["Generated", "Paid", "Pending"],
      default: "Generated",
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HR",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate payroll for same month/year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model("Payroll", payrollSchema);