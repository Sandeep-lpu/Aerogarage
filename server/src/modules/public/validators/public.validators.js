import { body, validationResult } from "express-validator";

export const createContactInquiryValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required").isLength({ max: 120 }),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required").isLength({ max: 40 }),
  body("company").optional().trim().isLength({ max: 160 }),
  body("inquiryType").isIn(["sales", "careers", "contact"]).withMessage("Invalid inquiry type"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 20, max: 4000 })
    .withMessage("Message must be 20-4000 characters"),
];

export const createCareerApplicationValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required").isLength({ max: 120 }),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required").isLength({ max: 40 }),
  body("position").trim().notEmpty().withMessage("Position is required").isLength({ max: 120 }),
  body("yearsOfExperience")
    .notEmpty()
    .withMessage("Years of experience is required")
    .isFloat({ min: 0, max: 60 })
    .withMessage("Years of experience must be between 0 and 60"),
  body("linkedInUrl").optional({ values: "falsy" }).isURL().withMessage("LinkedIn URL must be valid"),
  body("coverLetter").optional().trim().isLength({ max: 5000 }),
];

export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.fail("Validation failed", 422, errors.array());
  }

  return next();
}
