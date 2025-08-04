// server/models/Payroll.js
import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: Number,
    year: Number,
    basicSalary: Number,

    allowances: {
      type: Object,
      default: {
        HRA: 0,
        Travel: 0,
        Medical: 0,
      },
    },

    deductions: {
      type: Object,
      default: {
        Tax: 0,
        PF: 0,
        Leaves: 0,
      },
    },

    grossSalary: Number,
    netSalary: Number,
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HR",
    },
    status: {
      type: String,
      enum: ["Draft", "Generated", "Paid"],
      default: "Generated",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate payroll for same month/year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model("Payroll", payrollSchema);
