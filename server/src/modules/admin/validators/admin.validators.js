import { body, param, query, validationResult } from "express-validator";

import { ALL_ROLES } from "../../../shared/constants/roles.js";

export const listAdminUsersValidator = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("search").optional().isString().trim().escape(),
  query("role").optional().isIn(ALL_ROLES),
  query("isActive").optional().isBoolean().toBoolean(),
];

export const updateAdminUserRoleValidator = [
  param("userId").isMongoId().withMessage("Valid user id required"),
  body("role").isIn(ALL_ROLES).withMessage("Valid role required"),
];

export const updateAdminUserStatusValidator = [
  param("userId").isMongoId().withMessage("Valid user id required"),
  body("isActive").isBoolean().withMessage("isActive must be boolean"),
];

export const listAdminRequestsValidator = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("status").optional().isString().trim().escape(),
  query("priority").optional().isString().trim().escape(),
];

export const updateAdminServiceRequestStatusValidator = [
  param("requestId").isMongoId().withMessage("Valid request id required"),
  body("status")
    .isIn(["submitted", "reviewing", "in_progress", "completed"])
    .withMessage("Valid status required"),
];

export const assignAdminServiceRequestValidator = [
  param("requestId").isMongoId().withMessage("Valid request id required"),
  body("employeeId").isMongoId().withMessage("Valid employee user id required"),
];

export const updateAdminTrainingModuleValidator = [
  param("moduleId").trim().notEmpty().withMessage("moduleId required"),
  body("title").optional().isString().isLength({ min: 3, max: 200 }),
  body("instructor").optional().isString().isLength({ min: 3, max: 120 }),
  body("status").optional().isIn(["in progress", "completed", "planned"]),
  body("progress").optional().isInt({ min: 0, max: 100 }),
];

export const enrollAdminEmployeeTrainingValidator = [
  body("employeeId").isMongoId().withMessage("Valid employee user id required"),
  body("moduleId").trim().notEmpty().withMessage("Module ID required"),
  body("note").optional().isString().isLength({ max: 500 }),
];

export const updateAdminServiceContentValidator = [
  param("slug").trim().notEmpty().withMessage("Service slug required"),
  body("name").optional().isString().isLength({ min: 3, max: 180 }),
  body("category").optional().isString().isLength({ min: 2, max: 120 }),
  body("summary").optional().isString().isLength({ min: 10, max: 600 }),
];

export const updateAdminTrainingContentValidator = [
  body("organization").optional().isString().isLength({ min: 3, max: 180 }),
  body("affiliation").optional().isString().isLength({ min: 3, max: 180 }),
  body("modules").optional().isArray({ min: 1 }),
  body("pathways").optional().isArray({ min: 1 }),
];

export const approvalDecisionValidator = [
  param("workItemId").isMongoId().withMessage("Valid work item id required"),
  body("note").optional().isString().isLength({ min: 2, max: 600 }),
];

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.fail("Validation failed", 422, errors.array());
  }
  return next();
}
