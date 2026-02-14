import { body, validationResult } from "express-validator";
import { ALL_ROLES } from "../../../shared/constants/roles.js";

export const registerValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required").isLength({ max: 120 }),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 8, max: 120 }).withMessage("Password must be 8-120 chars"),
  body("role").optional().isIn(ALL_ROLES).withMessage("Invalid role"),
];

export const loginValidator = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const refreshValidator = [
  body("refreshToken").trim().notEmpty().withMessage("Refresh token is required"),
];

export const logoutValidator = [
  body("refreshToken").trim().notEmpty().withMessage("Refresh token is required"),
];

export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.fail("Validation failed", 422, errors.array());
  }

  return next();
}
