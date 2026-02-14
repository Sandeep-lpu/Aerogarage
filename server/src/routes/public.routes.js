import { Router } from "express";
import {
  createCareerApplicationController,
  createContactInquiryController,
  getServicesContentController,
  getTrainingContentController,
} from "../modules/public/controllers/public.controller.js";
import {
  createCareerApplicationValidator,
  createContactInquiryValidator,
  validateRequest,
} from "../modules/public/validators/public.validators.js";

const publicRouter = Router();

publicRouter.get("/health", (req, res) => {
  res.success({ module: "public" }, "Public module healthy");
});

publicRouter.get("/content/services", getServicesContentController);
publicRouter.get("/content/training", getTrainingContentController);

publicRouter.post(
  "/inquiries/contact",
  createContactInquiryValidator,
  validateRequest,
  createContactInquiryController,
);

publicRouter.post(
  "/applications/careers",
  createCareerApplicationValidator,
  validateRequest,
  createCareerApplicationController,
);

export default publicRouter;
