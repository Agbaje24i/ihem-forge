import mongoose from "mongoose";

// Records that a student (identified by email) completed a lesson.
const lessonProgressSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

lessonProgressSchema.index({ email: 1, lesson: 1 }, { unique: true });

export default mongoose.model("LessonProgress", lessonProgressSchema);
