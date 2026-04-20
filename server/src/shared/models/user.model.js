import mongoose from "mongoose";
import { ALL_ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 160 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ALL_ROLES, default: "client" },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false, index: true },
    department: { type: String, trim: true, maxlength: 120 },
    designation: { type: String, trim: true, maxlength: 120 },
    shift: { type: String, trim: true, maxlength: 80 },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
