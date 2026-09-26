import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
