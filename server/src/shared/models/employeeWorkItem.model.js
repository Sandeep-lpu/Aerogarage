import mongoose from "mongoose";

const auditEventSchema = new mongoose.Schema(
  {
    event: { type: String, required: true, trim: true, maxlength: 120 },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, trim: true, maxlength: 600 },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const employeeWorkItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    type: { type: String, required: true, trim: true, maxlength: 120 },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected", "executed", "closed"],
      default: "draft",
      index: true,
    },
    approvalRequired: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvalNote: { type: String, trim: true, maxlength: 600 },
    adminDecisionAt: { type: Date, default: null },
    clientRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "ClientRequest", default: null, index: true },
    dueDate: { type: Date, default: null },
    auditTrail: { type: [auditEventSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("EmployeeWorkItem", employeeWorkItemSchema);
