import { body, param, validationResult } from "express-validator";
import { ALL_ROLES } from "../../../shared/constants/roles.js";

export const updateAdminUserRoleValidator = [
  param("userId").isMongoId().withMessage("Valid user id required"),
  body("role").isIn(ALL_ROLES).withMessage("Valid role required"),
];

export const updateAdminUserStatusValidator = [
  param("userId").isMongoId().withMessage("Valid user id required"),
  body("isActive").isBoolean().withMessage("isActive must be boolean"),
];

export const updateAdminServiceRequestStatusValidator = [
  param("requestId").isMongoId().withMessage("Valid request id required"),
  body("status")
    .isIn(["submitted", "reviewing", "in_progress", "completed"])
    .withMessage("Valid status required"),
];

export const updateAdminTrainingModuleValidator = [
  param("moduleId").trim().notEmpty().withMessage("moduleId required"),
  body("title").optional().isString().isLength({ min: 3, max: 200 }),
  body("instructor").optional().isString().isLength({ min: 3, max: 120 }),
  body("status").optional().isIn(["in progress", "completed", "planned"]),
  body("progress").optional().isInt({ min: 0, max: 100 }),
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

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.fail("Validation failed", 422, errors.array());
  }
  return next();
}
