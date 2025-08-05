import mongoose from "mongoose";

const leaveTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    daysPerYear: { type: Number, default: 12 },
    paid: { type: Boolean, default: true },
    carryForward: { type: Boolean, default: false },
  });
  
  export default mongoose.model("LeaveType", leaveTypeSchema);