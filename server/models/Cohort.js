import mongoose from "mongoose";

// A cohort is one intake of a track, e.g. "Data Analytics - March 2027".
const cohortSchema = new mongoose.Schema(
  {
    track: { type: String, required: true, trim: true }, // matches a track name
    name: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    mode: {
      type: String,
      enum: ["online", "in-person", "hybrid", "any"],
      default: "any",
    },
    seats: { type: Number, required: true, min: 1 },
    tuition: { type: Number, default: 0, min: 0 }, // full fee, in naira
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  },
  { timestamps: true }
);

export default mongoose.model("Cohort", cohortSchema);
