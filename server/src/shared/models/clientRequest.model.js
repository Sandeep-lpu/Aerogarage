import mongoose from "mongoose";

const clientRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    serviceType: { type: String, required: true, trim: true, maxlength: 120 },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    status: {
      type: String,
      enum: ["submitted", "reviewing", "in_progress", "completed"],
      default: "submitted",
    },
  },
  { timestamps: true },
);

export default mongoose.model("ClientRequest", clientRequestSchema);
