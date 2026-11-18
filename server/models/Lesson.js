import mongoose from "mongoose";

// A class session, assignment or resource that belongs to one cohort.
const lessonSchema = new mongoose.Schema(
  {
    cohort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cohort",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    kind: {
      type: String,
      enum: ["class", "assignment", "resource"],
      default: "class",
    },
    date: { type: Date }, // class time, or assignment due date
    link: { type: String, default: "", trim: true }, // meeting, recording or material URL
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
