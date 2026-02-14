import ContactInquiry from "../../../shared/models/contactInquiry.model.js";
import CareerApplication from "../../../shared/models/careerApplication.model.js";

export async function createContactInquiry(payload) {
  return ContactInquiry.create(payload);
}

export async function createCareerApplication(payload) {
  return CareerApplication.create(payload);
}
