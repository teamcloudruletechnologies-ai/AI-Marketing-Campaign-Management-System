import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    objective: { type: String, required: true },
    status: { type: String, default: "Active" },
    budget: { type: Number, required: true },
    roi: { type: Number, default: 0 },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    channels: [{ type: String }]
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
