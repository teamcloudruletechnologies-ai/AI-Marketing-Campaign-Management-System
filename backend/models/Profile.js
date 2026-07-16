import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    phone: { type: String, default: "" },
    industry: { type: String, default: "" },
    avatar: { type: String, default: "" }
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
