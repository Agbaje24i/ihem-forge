import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    course: {
      type: String,
    },
    qualification: {
      type: String,
      default: "",
    },
    learningMode: {
      type: String,
      default: "",
    },
    experienceLevel: {
      type: String,
      default: "",
    },
    supportNeeded: {
      type: String,
      default: "",
    },
    cohort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cohort",
    },
    cohortName: {
      type: String,
      default: "",
    },
    scholarshipPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    reviewNote: {
      type: String,
      default: "",
    },
    reviewedAt: {
      type: Date,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Application", applicationSchema);
