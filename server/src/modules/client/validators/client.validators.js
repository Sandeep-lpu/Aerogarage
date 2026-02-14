import { body, validationResult } from "express-validator";

export const createClientRequestValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 180 }),
  body("serviceType").trim().notEmpty().withMessage("Service type is required").isLength({ max: 120 }),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20, max: 4000 })
    .withMessage("Description must be 20-4000 characters"),
];

export const updateClientProfileValidator = [
  body("fullName").optional().trim().isLength({ min: 2, max: 120 }).withMessage("Full name must be 2-120 chars"),
];

export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.fail("Validation failed", 422, errors.array());
  }

  return next();
}
