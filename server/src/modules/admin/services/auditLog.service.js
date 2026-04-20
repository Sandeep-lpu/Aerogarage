import AuditLog from "../../../shared/models/auditLog.model.js";
import { emitToRole } from "../../../shared/socketContext.js";

/**
 * createAuditLog — writes a single, immutable audit record.
 *
 * Call this from admin controllers after any successful write operation.
 *
 * @param {object} actor   - The req.user object from requireAuth middleware
 * @param {string} action  - Uppercase action string, e.g. "USER_ROLE_CHANGED"
 * @param {object} [opts]  - Optional { targetId, targetType, metadata }
 *
 * @example
 *   await createAuditLog(req.user, "USER_STATUS_CHANGED", {
 *     targetId: userId,
 *     targetType: "User",
 *     metadata: { previousStatus: "active", newStatus: "suspended" },
 *   });
 */
export async function createAuditLog(actor, action, { targetId, targetType, metadata = {} } = {}) {
  try {
    const log = await AuditLog.create({
      actorId:    actor.id || actor._id,
      actorEmail: actor.email,
      actorRole:  actor.role,
      action,
      targetId,
      targetType,
      metadata,
    });
    
    emitToRole("admin", "new_activity", log);
  } catch (err) {
    // Audit log failure must NEVER crash the main request — log and swallow
    console.error("[AuditLog] Failed to write audit record:", err.message);
  }
}

/**
 * getAuditLogsForActor — returns audit history for a specific admin user.
 * @param {string} actorId
 * @param {object} [opts] - { page = 1, limit = 25 }
 */
export async function getAuditLogsForActor(actorId, { page = 1, limit = 25 } = {}) {
  const skip = (page - 1) * limit;
  return AuditLog.find({ actorId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
}

/**
 * getAuditLogsForTarget — returns audit history for a specific entity.
 * @param {string} targetId
 * @param {object} [opts] - { page = 1, limit = 25 }
 */
export async function getAuditLogsForTarget(targetId, { page = 1, limit = 25 } = {}) {
  const skip = (page - 1) * limit;
  return AuditLog.find({ targetId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
}

/**
 * getAllAuditLogs — returns global audit history for the admin feed.
 */
export async function getAllAuditLogs({ page = 1, limit = 50 } = {}) {
  const skip = (page - 1) * limit;
  return AuditLog.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
}
