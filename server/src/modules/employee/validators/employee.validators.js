import { body, param, validationResult } from "express-validator";

export const createEmployeeRequestValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 180 }),
  body("type").trim().notEmpty().withMessage("Type is required").isLength({ max: 120 }),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20, max: 4000 })
    .withMessage("Description must be 20-4000 characters"),
  body("approvalRequired").optional().isBoolean().withMessage("approvalRequired must be boolean"),
  body("dueDate").optional().isISO8601().withMessage("dueDate must be a valid date"),
];

export const submitEmployeeRequestValidator = [
  param("workItemId").isMongoId().withMessage("Valid work item id required"),
];

export const updateEmployeeTaskValidator = [
  param("workItemId").isMongoId().withMessage("Valid work item id required"),
  body("status")
    .optional()
    .isIn(["approved", "executed", "closed"])
    .withMessage("Status must be approved, executed, or closed"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("description").optional().isString().isLength({ min: 10, max: 4000 }),
  body("note").optional().isString().isLength({ min: 2, max: 600 }),
];

export const updateEmployeeProfileValidator = [
  body("fullName").optional().trim().isLength({ min: 2, max: 120 }).withMessage("Full name must be 2-120 chars"),
  body("department").optional().trim().isLength({ min: 2, max: 120 }),
  body("designation").optional().trim().isLength({ min: 2, max: 120 }),
  body("shift").optional().trim().isLength({ min: 2, max: 80 }),
];

export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.fail("Validation failed", 422, errors.array());
  }

  return next();
}
