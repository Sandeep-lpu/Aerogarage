import {
  getServicesContent,
  getTrainingContent,
} from "../services/publicContent.service.js";
import {
  submitCareerApplication,
  submitContactInquiry,
} from "../services/publicLead.service.js";

export async function createContactInquiryController(req, res, next) {
  try {
    const inquiry = await submitContactInquiry(req.body);

    return res.success(
      {
        id: inquiry._id,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      },
      "Contact inquiry submitted",
      201,
    );
  } catch (error) {
    return next(error);
  }
}

export async function createCareerApplicationController(req, res, next) {
  try {
    const application = await submitCareerApplication(req.body);

    return res.success(
      {
        id: application._id,
        status: application.status,
        createdAt: application.createdAt,
      },
      "Career application submitted",
      201,
    );
  } catch (error) {
    return next(error);
  }
}

export function getServicesContentController(req, res) {
  return res.success({ services: getServicesContent() }, "Services content fetched");
}

export function getTrainingContentController(req, res) {
  return res.success({ training: getTrainingContent() }, "Training content fetched");
}
