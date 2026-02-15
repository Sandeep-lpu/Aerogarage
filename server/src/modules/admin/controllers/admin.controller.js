import {
  changeUserRole,
  changeUserStatus,
  getAdminPublicContent,
  getAdminServiceRequests,
  getAdminTrainingModules,
  getAdminUsers,
  patchAdminServiceContent,
  patchAdminTrainingContent,
  patchAdminTrainingModule,
  updateAdminServiceRequestStatus,
} from "../services/admin.service.js";

export async function listAdminUsersController(req, res, next) {
  try {
    const users = await getAdminUsers({
      search: req.query.search,
      role: req.query.role,
      isActive:
        req.query.isActive === undefined ? undefined : req.query.isActive === "true",
    });
    return res.success({ users }, "Users fetched");
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminUserRoleController(req, res, next) {
  try {
    const user = await changeUserRole(req.params.userId, req.body.role);
    return res.success({ user }, "User role updated");
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminUserStatusController(req, res, next) {
  try {
    const user = await changeUserStatus(req.params.userId, req.body.isActive);
    return res.success({ user }, "User status updated");
  } catch (error) {
    return next(error);
  }
}

export async function listAdminServiceRequestsController(req, res, next) {
  try {
    const requests = await getAdminServiceRequests({
      status: req.query.status,
      priority: req.query.priority,
    });
    return res.success({ requests }, "Service requests fetched");
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminServiceRequestStatusController(req, res, next) {
  try {
    const request = await updateAdminServiceRequestStatus(req.params.requestId, req.body.status);
    return res.success({ request }, "Service request updated");
  } catch (error) {
    return next(error);
  }
}

export function listAdminTrainingModulesController(req, res, next) {
  try {
    const modules = getAdminTrainingModules();
    return res.success({ modules }, "Training modules fetched");
  } catch (error) {
    return next(error);
  }
}

export function updateAdminTrainingModuleController(req, res, next) {
  try {
    const module = patchAdminTrainingModule(req.params.moduleId, req.body);
    return res.success({ module }, "Training module updated");
  } catch (error) {
    return next(error);
  }
}

export function getAdminPublicContentController(req, res, next) {
  try {
    const content = getAdminPublicContent();
    return res.success({ content }, "Public content fetched");
  } catch (error) {
    return next(error);
  }
}

export function updateAdminServiceContentController(req, res, next) {
  try {
    const service = patchAdminServiceContent(req.params.slug, req.body);
    return res.success({ service }, "Service content updated");
  } catch (error) {
    return next(error);
  }
}

export function updateAdminTrainingContentController(req, res, next) {
  try {
    const training = patchAdminTrainingContent(req.body);
    return res.success({ training }, "Training content updated");
  } catch (error) {
    return next(error);
  }
}
