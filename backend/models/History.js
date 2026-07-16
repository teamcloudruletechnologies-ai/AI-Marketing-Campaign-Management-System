import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    category: { type: String, required: true }, // 'campaign', 'post', 'profile', 'email'
    details: { type: String, required: true }
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);
export default History;
