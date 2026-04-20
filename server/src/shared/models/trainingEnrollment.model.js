import mongoose from "mongoose";

const trainingEnrollmentSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    moduleId: {
      type: String, // String because training modules are currently in-memory/static
      required: true,
      index: true,
    },
    enrolledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["enrolled", "in_progress", "completed", "failed", "certified"],
      default: "enrolled",
    },
    score: {
      type: Number,
      default: null,
    },
    certifiedAt: {
      type: Date,
      default: null,
    },
    enrollmentNote: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

// Compound index to ensure an employee isn't enrolled in the same module twice concurrently
trainingEnrollmentSchema.index({ employeeId: 1, moduleId: 1 }, { unique: true });

export default mongoose.model("TrainingEnrollment", trainingEnrollmentSchema);
