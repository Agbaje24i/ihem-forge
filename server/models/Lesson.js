import mongoose from "mongoose";

// A lesson belongs either to one cohort (a live class, an assignment with a
// due date) or to a whole track (course material every cohort of that track
// sees). Exactly one of `cohort` / `track` is set.
const lessonSchema = new mongoose.Schema(
  {
    cohort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cohort",
      index: true,
    },
    track: { type: String, trim: true, index: true }, // track name, for course content
    module: { type: String, default: "", trim: true }, // section heading, e.g. "Week 1: Basics"
    content: { type: String, default: "" }, // lesson text shown in the course player
    videoUrl: { type: String, default: "", trim: true },
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

lessonSchema.pre("validate", function (next) {
  if (!this.cohort && !this.track) {
    return next(new Error("A lesson needs a cohort or a track"));
  }
  next();
});

export default mongoose.model("Lesson", lessonSchema);
