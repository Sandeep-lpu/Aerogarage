import {
  getClientDocuments,
  getClientProfile,
  getClientRequests,
  saveClientProfile,
  submitClientRequest,
} from "../services/client.service.js";

export async function createClientRequestController(req, res, next) {
  try {
    const request = await submitClientRequest({
      userId: req.user.id,
      title: req.body.title,
      serviceType: req.body.serviceType,
      priority: req.body.priority || "medium",
      description: req.body.description,
    });

    return res.success(
      {
        id: request._id,
        status: request.status,
        createdAt: request.createdAt,
      },
      "Request submitted",
      201,
    );
  } catch (error) {
    return next(error);
  }
}

export async function listClientRequestsController(req, res, next) {
  try {
    const requests = await getClientRequests(req.user.id);
    return res.success({ requests }, "Requests fetched");
  } catch (error) {
    return next(error);
  }
}

export async function getClientProfileController(req, res, next) {
  try {
    const profile = await getClientProfile(req.user.id);
    return res.success({ profile }, "Profile fetched");
  } catch (error) {
    return next(error);
  }
}

export async function updateClientProfileController(req, res, next) {
  try {
    const updates = {};
    if (typeof req.body.fullName === "string") updates.fullName = req.body.fullName;

    const profile = await saveClientProfile(req.user.id, updates);
    return res.success({ profile }, "Profile updated");
  } catch (error) {
    return next(error);
  }
}

export function listClientDocumentsController(req, res) {
  const documents = getClientDocuments(req.user);
  return res.success({ documents }, "Documents fetched");
}
