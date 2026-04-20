import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, trim: true, maxlength: 600 },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const clientRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    serviceType: { type: String, required: true, trim: true, maxlength: 120 },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    status: {
      type: String,
      enum: ["submitted", "reviewing", "in_progress", "completed", "cancelled"],
      default: "submitted",
    },
    // Canonical linkages for redesign
    assignedEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    workItemId: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeWorkItem", default: null },
    completionReportUrl: { type: String, default: null },
    statusHistory: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("ClientRequest", clientRequestSchema);
