import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    platform: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
