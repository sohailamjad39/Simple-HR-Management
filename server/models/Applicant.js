// server/models/Applicant.js
import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobOpening",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: String,
    coverLetter: String,
    resumeUrl: String,
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interviewed", "Hired", "Rejected"],
      default: "Applied",
    },
    interviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HR",
    },
    interviewFeedback: {
      rating: Number,
      notes: String,
      recommended: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Applicant", applicantSchema);