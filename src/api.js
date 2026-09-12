// Local dev: Vite proxies /api -> http://localhost:5000
// Production/ngrok: set VITE_API_URL=https://your-tunnel.ngrok-free.dev/api
const API_BASE = import.meta.env.VITE_API_URL || "/api";

function apiFetch(path, options = {}) {
  const headers = { ...options.headers };
  if (API_BASE.includes("ngrok")) {
    headers["ngrok-skip-browser-warning"] = "true";
  }
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

export const api = {
  // Campaigns
  async getCampaigns() {
    const res = await apiFetch("/campaigns");
    if (!res.ok) throw new Error("Failed to fetch campaigns");
    return res.json();
  },
  async createCampaign(data) {
    const res = await apiFetch("/campaigns", {
      method: "POST",
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create campaign");
    return res.json();
  },
  async updateCampaign(id, data) {
    const res = await apiFetch(`/campaigns/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update campaign");
    return res.json();
  },
  async deleteCampaign(id) {
    const res = await apiFetch(`/campaigns/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete campaign");
    return res.json();
  },

  // Posts
  async getPosts() {
    const res = await apiFetch("/posts");
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  },
  async createPost(data) {
    const res = await apiFetch("/posts", {
      method: "POST",
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create post");
    return res.json();
  },
  async deletePost(id) {
    const res = await apiFetch(`/posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete post");
    return res.json();
  },

  // Profile
  async getProfile() {
    const res = await apiFetch("/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },
  async updateProfile(data) {
    const res = await apiFetch("/profile", {
      method: "PUT",
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await apiFetch("/notifications");
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  },
  async createNotification(data) {
    const res = await apiFetch("/notifications", {
      method: "POST",
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create notification");
    return res.json();
  },
  async markNotificationsRead() {
    const res = await apiFetch("/notifications/mark-read", { method: "PUT" });
    if (!res.ok) throw new Error("Failed to mark notifications read");
    return res.json();
  },
  async markNotificationRead(id) {
    const res = await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
    if (!res.ok) throw new Error("Failed to mark notification read");
    return res.json();
  },

  // History Log
  async getHistory() {
    const res = await apiFetch("/history");
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
  },
  async createHistory(data) {
    const res = await apiFetch("/history", {
      method: "POST",
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create history entry");
    return res.json();
  },

  // Login
  async login({ email, password }) {
    const res = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  // Gemini Text & Image-to-Caption Generation
  async generateText(summary, imageBase64 = null, mimeType = "image/jpeg", tone = "Engaging & Persuasive") {
    const payload = { summary, tone };
    if (imageBase64) {
      payload.image_base64 = imageBase64;
      payload.mime_type = mimeType;
    }
    const res = await apiFetch("/generate-text", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Gemini Image Generation (replaces n8n)
  async generateImage(prompt) {
    const res = await apiFetch("/generate-image", {
      method: "POST",
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Image generation failed");
    }
    return res.json();
  }
};
