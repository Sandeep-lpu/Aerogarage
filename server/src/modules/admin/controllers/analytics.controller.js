import ClientRequest from "../../../shared/models/clientRequest.model.js";
import EmployeeWorkItem from "../../../shared/models/employeeWorkItem.model.js";
import TrainingEnrollment from "../../../shared/models/trainingEnrollment.model.js";
import User from "../../../shared/models/user.model.js";

/**
 * getAnalyticsDashboard — aggregates multiple KPIs in parallel.
 * Endpoints:
 * - Request Trends (by month)
 * - Service Category Breakdown
 * - Training Funnel (pass/fail/in-progress)
 * - Average Approval SLA (ms)
 */
export async function getAnalyticsDashboard(req, res, next) {
  try {
    const [
      totalUsers,
      pendingRequests,
      totalApprovalsPending,
      requestTrends,
      serviceBreakdown,
      trainingFunnel,
      approvalSlAs
    ] = await Promise.all([
      // Top Level KPIs
      User.countDocuments({ isActive: true }),
      ClientRequest.countDocuments({ status: { $in: ["submitted", "reviewing"] } }),
      EmployeeWorkItem.countDocuments({ status: "pending_admin_approval" }),

      // 1. Request trends over time (group by YYYY-MM)
      ClientRequest.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            volume: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // 2. Client activity heatmap / breakdown by type
      ClientRequest.aggregate([
        {
          $group: {
            _id: "$serviceType",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // 3. Training completion funnels
      TrainingEnrollment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // 4. Employee productivity SLA (cycle time from submission to approval/rejection)
      EmployeeWorkItem.aggregate([
        {
          $match: { adminDecisionAt: { $ne: null } },
        },
        {
          $project: {
            cycleTimeMs: { $subtract: ["$adminDecisionAt", "$createdAt"] },
          },
        },
        {
          $group: {
            _id: null,
            averageCycleTimeMs: { $avg: "$cycleTimeMs" },
          },
        },
      ]),
    ]);

    // Format Data
    const formattedTrends = requestTrends.map(t => ({ month: t._id, volume: t.volume }));
    const formattedBreakdown = serviceBreakdown.map(b => ({ name: b._id, value: b.count }));
    const formattedTraining = trainingFunnel.map(t => ({ status: t._id, count: t.count }));
    const slas = approvalSlAs[0]?.averageCycleTimeMs || 0;

    return res.success({
      kpis: {
        totalUsers,
        pendingRequests,
        totalApprovalsPending,
      },
      trends: formattedTrends,
      breakdown: formattedBreakdown,
      training: formattedTraining,
      slas,
    }, "Analytics data aggregated successfully");
  } catch (err) {
    return next(err);
  }
}
