import mongoose from "mongoose";
import { ALL_ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 160 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ALL_ROLES, default: "client" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
