import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Department", departmentSchema);