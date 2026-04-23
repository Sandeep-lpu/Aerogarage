import mongoose from "mongoose";

/**
 * AuditLog — immutable record of admin/staff write actions.
 * Documents are never updated or deleted; they are append-only for compliance.
 *
 * Written by: createAuditLog() in auditLog.service.js
 * Indexed for efficient querying by actor, target, and action.
 */
const auditLogSchema = new mongoose.Schema(
  {
    // Who performed the action
    actorId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    actorEmail: { type: String, required: true },
    actorRole:  { type: String, required: true },

    // What was done (e.g. "USER_ROLE_CHANGED", "REQUEST_STATUS_UPDATED")
    action: { type: String, required: true, index: true },

    // What entity was affected
    targetId:   { type: mongoose.Schema.Types.ObjectId, index: true },
    targetType: { type: String }, // e.g. "User", "ClientRequest", "WorkItem"

    // Human-readable context (stored as plain object, no schema enforcement)
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

    // When the action happened (set by Mongoose timestamps: createdAt)
  },
  {
    timestamps: true,
    // Prevent any accidental updates — audit logs are write-once
    strict: true,
  },
);

// Compound index for the admin panel audit trail view (most recent first, filtered by actor)
auditLogSchema.index({ actorId: 1, createdAt: -1 });
// Compound index for investigating a specific target entity
auditLogSchema.index({ targetId: 1, createdAt: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
