// server/models/HR.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const hrSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^[\+]?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    department: {
      type: String,
      default: "Human Resources",
    },
    role: {
      type: String,
      enum: ["HR", "SuperHR", "Admin"],
      default: "HR",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    profileImage: {
      type: String,
    },
    address: {
      city: String,
      state: String,
      country: String,
      postalCode: String,
      street: String,
    },
    metadata: {
      type: Map,
      of: String,
    },

    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Hash password before save
hrSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
hrSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const HR = mongoose.model("HR", hrSchema);

export default HR;