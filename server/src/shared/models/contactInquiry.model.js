import mongoose from "mongoose";

const contactInquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    company: { type: String, trim: true, maxlength: 160, default: "" },
    inquiryType: {
      type: String,
      required: true,
      enum: ["sales", "careers", "contact"],
      default: "sales",
    },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    status: {
      type: String,
      enum: ["new", "reviewing", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export default mongoose.model("ContactInquiry", contactInquirySchema);
