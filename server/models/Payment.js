import mongoose from "mongoose";

// A payment the academy has received and recorded against an application.
const paymentSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    method: {
      type: String,
      enum: ["Bank transfer", "Cash", "Card / online", "Other"],
      default: "Bank transfer",
    },
    reference: { type: String, default: "", trim: true },
    note: { type: String, default: "", trim: true },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
