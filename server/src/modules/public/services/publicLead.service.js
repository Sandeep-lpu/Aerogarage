import {
  createCareerApplication,
  createContactInquiry,
} from "../repositories/public.repository.js";

export async function submitContactInquiry(payload) {
  return createContactInquiry(payload);
}

export async function submitCareerApplication(payload) {
  return createCareerApplication(payload);
}
