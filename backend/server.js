import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import Campaign from "./models/Campaign.js";
import Post from "./models/Post.js";
import Profile from "./models/Profile.js";
import Notification from "./models/Notification.js";
import History from "./models/History.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ai-marketing";

// Middleware
app.use(cors());
app.use(express.json({ limit: "15mb" })); // Large limit for avatar base64 uploads

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB at " + MONGO_URI);
    seedDatabase();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Seed default data if collections are empty
async function seedDatabase() {
  try {
    // 1. Seed Campaign
    const campCount = await Campaign.countDocuments();
    if (campCount === 0) {
      const defaultCampaigns = [
        {
          name: "Summer Fitness Kickoff",
          objective: "Lead Generation",
          status: "Active",
          budget: 4500,
          roi: 380,
          startDate: "2026-06-01",
          endDate: "2026-08-31",
          channels: ["Instagram", "Facebook"]
        },
        {
          name: "SaaS Automations Launch",
          objective: "Sales / Conversion",
          status: "Active",
          budget: 12000,
          roi: 490,
          startDate: "2026-05-15",
          endDate: "2026-09-15",
          channels: ["LinkedIn", "Email"]
        },
        {
          name: "Eco-Friendly App Promo",
          objective: "Brand Awareness",
          status: "Paused",
          budget: 3000,
          roi: 180,
          startDate: "2026-07-01",
          endDate: "2026-08-01",
          channels: ["Instagram", "Facebook", "LinkedIn"]
        },
        {
          name: "Gourmet Coffee Launch",
          objective: "Sales / Conversion",
          status: "Completed",
          budget: 6500,
          roi: 420,
          startDate: "2026-04-01",
          endDate: "2026-05-30",
          channels: ["Facebook", "Instagram", "Email"]
        }
      ];
      await Campaign.insertMany(defaultCampaigns);
      console.log("Seeded default campaigns.");
    }

    // 2. Seed Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      const defaultProfile = {
        name: "Sarah Jenkins",
        email: "sarah.j@apexglobal.com",
        company: "Apex Global Digital",
        phone: "+1 (555) 902-3481",
        industry: "Digital Agency / SaaS",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
      };
      await Profile.create(defaultProfile);
      console.log("Seeded default profile.");
    }

    // 3. Seed Notifications
    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      const defaultNotifications = [
        {
          title: "Setup Completed",
          text: "Fullstack system connected and running smoothly.",
          type: "success",
          unread: true
        },
        {
          title: "Database Sync",
          text: "MongoDB Compass collection initialized.",
          type: "info",
          unread: true
        }
      ];
      await Notification.insertMany(defaultNotifications);
      console.log("Seeded default notifications.");
    }

    // 4. Seed History
    const historyCount = await History.countDocuments();
    if (historyCount === 0) {
      const defaultHistory = [
        {
          action: "Database Initialized",
          category: "campaign",
          details: "Created and synced campaign database with MongoDB."
        },
        {
          action: "Campaign 'Summer Fitness Kickoff' Synced",
          category: "campaign",
          details: "Dynamic data binding established."
        }
      ];
      await History.insertMany(defaultHistory);
      console.log("Seeded default history logs.");
    }
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}

// API Routes

// 1. CAMPAIGNS
app.get("/api/campaigns", async (req, res) => {
  try {
    const list = await Campaign.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/campaigns", async (req, res) => {
  try {
    const newCamp = new Campaign(req.body);
    await newCamp.save();
    res.status(201).json(newCamp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/campaigns/:id", async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Campaign not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/campaigns/:id", async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Campaign not found" });
    res.json({ message: "Campaign deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POSTS (Manual social media posts)
app.get("/api/posts", async (req, res) => {
  try {
    const list = await Post.find().sort({ publishedAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. PROFILE
app.get("/api/profile", async (req, res) => {
  try {
    let userProfile = await Profile.findOne();
    if (!userProfile) {
      userProfile = await Profile.create({
        name: "Sarah Jenkins",
        email: "sarah.j@apexglobal.com",
        company: "Apex Global Digital",
        phone: "",
        industry: "",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
      });
    }
    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/profile", async (req, res) => {
  try {
    let userProfile = await Profile.findOne();
    if (!userProfile) {
      userProfile = new Profile(req.body);
      await userProfile.save();
    } else {
      userProfile = await Profile.findByIdAndUpdate(userProfile._id, req.body, { new: true });
    }
    res.json(userProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. NOTIFICATIONS
app.get("/api/notifications", async (req, res) => {
  try {
    const list = await Notification.find().sort({ createdAt: -1 }).limit(10);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/notifications", async (req, res) => {
  try {
    const newNotif = new Notification(req.body);
    await newNotif.save();
    res.status(201).json(newNotif);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/notifications/mark-read", async (req, res) => {
  try {
    await Notification.updateMany({ unread: true }, { $set: { unread: false } });
    res.json({ message: "All notifications marked read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { unread: false }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. LOGIN endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const validEmail = process.env.LOGIN_EMAIL || "admin@brand.com";
  const validPassword = process.env.LOGIN_PASSWORD || "admin123";
  if (email === validEmail && password === validPassword) {
    return res.json({ success: true, message: "Login successful" });
  }
  return res.status(401).json({ success: false, error: "Invalid email or password" });
});

// 7. GEMINI IMAGE GENERATION endpoint (replaces n8n)
app.post("/api/generate-image", async (req, res) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY not set in backend/.env" });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    // Find the inline image part
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart) {
      return res.status(200).json({ imageUrl: null, fallback: true });
    }

    const { mimeType, data: b64 } = imagePart.inlineData;
    const dataUrl = `data:${mimeType};base64,${b64}`;
    return res.json({ imageUrl: dataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. HISTORY
app.get("/api/history", async (req, res) => {
  try {
    const list = await History.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/history", async (req, res) => {
  try {
    const newLog = new History(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
