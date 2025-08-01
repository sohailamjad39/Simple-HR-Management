// server/models/JobOpening.js
import mongoose from "mongoose";

const jobOpeningSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    location: String,
    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Remote"],
    },
    salaryRange: String,
    description: String,
    requirements: [String],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HR",
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Filled"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("JobOpening", jobOpeningSchema);