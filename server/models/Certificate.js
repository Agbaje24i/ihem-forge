import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    course: {
      type: String,
      required: true,
    },

    completionDate: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "VALID",
      enum: ["VALID", "REVOKED"],
    },

    hash: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Certificate", certificateSchema);