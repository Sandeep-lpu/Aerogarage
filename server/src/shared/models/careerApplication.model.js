import mongoose from "mongoose";

const careerApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    position: { type: String, required: true, trim: true, maxlength: 120 },
    yearsOfExperience: { type: Number, required: true, min: 0, max: 60 },
    linkedInUrl: { type: String, trim: true, maxlength: 400, default: "" },
    coverLetter: { type: String, trim: true, maxlength: 5000, default: "" },
    status: {
      type: String,
      enum: ["new", "screening", "interview", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export default mongoose.model("CareerApplication", careerApplicationSchema);
