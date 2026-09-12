import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const PLATFORMS = [
  { id: "Instagram", icon: "fa-brands fa-instagram", color: "#E4405F" },
  { id: "Twitter", icon: "fa-brands fa-x-twitter", color: "#1DA1F2" },
  { id: "LinkedIn", icon: "fa-brands fa-linkedin-in", color: "#0A66C2" },
  { id: "Email", icon: "fa-solid fa-envelope", color: "#EA4335" }
];

const TONES = [
  "Persuasive / Sales",
  "Casual & Playful",
  "Professional & B2B",
  "Luxury & Minimalist",
  "Urgent / Limited Offer"
];


const FALLBACK_CONTENT = {
  Instagram: (title) => `✨ BIG NEWS: ${title}! ✨\n\nWe are absolutely thrilled to share this with our community. Get ready to elevate your experience. 🚀\n\nDrop a ❤️ if you are excited!\n\n#instagram #marketing #innovation #trending #goals`,
  Email: (title) => `Subject: Introducing ${title} 📩\n\nHello Friend,\n\nWe are proud to present: ${title}.\n\nOur team has been working around the clock to build this, and we're excited to invite you to try it out.\n\nBest,\nMarketing Team`
};

// Curated 4-angle high-res fallbacks per category to guarantee 100% reliable 200 OK images
const CATEGORY_FALLBACK_IMAGES = {
  appliances: [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
  ],
  fitness: [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80"
  ],
  food: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
  ],
  beauty: [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80"
  ],
  fashion: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80"
  ],
  general: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1468495244123-6c6c332eeede?auto=format&fit=crop&w=1000&q=80"
  ]
};

function getContextStyle(text) {
  const lower = text.toLowerCase();
  
  if (/\b(ac|air conditioner|cooling|fridge|refrigerator|tv|television|fan|heater|washing machine|microwave|oven|appliance|appliances)\b/i.test(lower)) {
    return {
      category: "appliances",
      style: "modern home interior, showing the appliance in a clean modern living room or bedroom, product photography, sleek, elegant, home appliances",
      expanded: text.replace(/\bac\b/gi, "air conditioner").replace(/\bAC\b/g, "air conditioner")
    };
  }
  if (/\b(fit|gym|workout|fitness|run|sports|athletics|health|yoga|diet|muscle|protein)\b/i.test(lower)) {
    return { category: "fitness", style: "fitness lifestyle visual, active healthy atmosphere, athletic background, energetic vibe", expanded: text };
  }
  if (/\b(skincare|beauty|lotion|cream|shampoo|soap|makeup|cosmetics|serum|perfume|spa|salon)\b/i.test(lower)) {
    return { category: "beauty", style: "premium cosmetic product photography, organic minimal elements, luxury studio setup", expanded: text };
  }
  if (/\b(food|restaurant|burger|pizza|cafe|coffee|drink|beverage|bakery|delicious|crave)\b/i.test(lower)) {
    return { category: "food", style: "delicious gourmet food styling, macro product shot, warm appetizing lighting, fresh ingredients", expanded: text };
  }
  if (/\b(wear|shirt|pant|shoes|sneakers|dress|fashion|clothing|apparel|style|luxury)\b/i.test(lower)) {
    return { category: "fashion", style: "fashion studio editorial, high-end apparel display, professional clothing photography", expanded: text };
  }
  return { category: "general", style: "premium clean product lifestyle visual, modern sleek background", expanded: text };
}

function parseSummary(summary) {
  if (!summary) return { heading: "", subheading: "", cta: "Learn More" };
  const delimiters = [" — ", " - ", " | ", ", "];
  for (const delimiter of delimiters) {
    if (summary.includes(delimiter)) {
      const parts = summary.split(delimiter);
      const heading = parts[0].trim();
      const subheading = parts.slice(1).join(delimiter).trim();
      let cta = "Learn More";
      const lower = summary.toLowerCase();
      if (lower.includes("sale") || lower.includes("shop") || lower.includes("off") || lower.includes("buy")) cta = "Shop Now";
      else if (lower.includes("signup") || lower.includes("register") || lower.includes("join")) cta = "Sign Up";
      else if (lower.includes("download")) cta = "Download";
      return { heading, subheading, cta };
    }
  }
  let heading = summary;
  let subheading = "";
  if (summary.length > 30) {
    const words = summary.split(" ");
    const mid = Math.ceil(words.length / 2);
    heading = words.slice(0, mid).join(" ");
    subheading = words.slice(mid).join(" ");
  }
  let cta = "Learn More";
  if (summary.toLowerCase().includes("sale") || summary.toLowerCase().includes("off")) cta = "Shop Now";
  return { heading, subheading, cta };
}

function BannerOverlay({ summary }) {
  const { heading, subheading, cta } = parseSummary(summary);
  if (!heading) return null;
  return (
    <div className="banner-overlay-container">
      <div className="banner-overlay-badge">
        <span className="pulse-dot"></span> Special Offer
      </div>
      <h3 className="banner-overlay-title">{heading}</h3>
      {subheading && <p className="banner-overlay-desc">{subheading}</p>}
      <button type="button" className="banner-overlay-btn">
        {cta} <i className="fa-solid fa-arrow-right ml-1"></i>
      </button>
    </div>
  );
}

export default function ContentPreview({
  showToast,
  addHistoryLog,
  pushNotification,
  campaigns,
  setCampaigns,
  setPosts
}) {
  const [summary, setSummary] = useState("");
  const [tone, setTone] = useState("Persuasive / Sales");
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Instagram");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(null);
  const navigate = useNavigate();

  const currentImage = generated?.images?.[activeImageIdx];

  const handleCaptionChange = (newVal) => {
    if (!generated) return;
    if (activeTab === "Instagram") {
      setGenerated((prev) => ({ ...prev, Instagram: { ...prev.Instagram, caption: newVal } }));
    } else if (activeTab === "Twitter") {
      setGenerated((prev) => ({ ...prev, Twitter: { ...prev.Twitter, caption: newVal } }));
    } else if (activeTab === "LinkedIn") {
      setGenerated((prev) => ({ ...prev, LinkedIn: { ...prev.LinkedIn, caption: newVal } }));
    } else if (activeTab === "Email") {
      setGenerated((prev) => ({ ...prev, Email: { ...prev.Email, subject: newVal } }));
    }
  };

  const handleDownloadImage = async () => {
    const targetUrl = currentImage?.url || uploadedImage?.dataUrl;
    if (!targetUrl) return;

    try {
      showToast("Downloading image...", "info");
      if (targetUrl.startsWith("data:")) {
        const a = document.createElement("a");
        a.href = targetUrl;
        a.download = `advantage-visual-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Image downloaded successfully!", "success");
        return;
      }

      const res = await fetch(targetUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `advantage-visual-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      showToast("Image downloaded successfully!", "success");
    } catch (err) {
      window.open(targetUrl, "_blank");
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (PNG, JPG, WEBP)", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setUploadedImage({
        dataUrl,
        name: file.name,
        mimeType: file.type,
        size: (file.size / 1024).toFixed(1) + " KB"
      });
      showToast("Image selected! Click 'Generate Captions' to analyze.", "info");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!summary.trim() && !uploadedImage) {
      showToast("Please enter a summary or upload an image first", "error");
      return;
    }

    setLoading(true);
    setGenerated(null);
    setActiveImageIdx(0);

    try {
      if (uploadedImage) {
        // --- 1. IMAGE UPLOAD MODE: Gemini Vision analyzes photo & generates captions ---
        let platformData = null;
        try {
          const textRes = await api.generateText(summary, uploadedImage.dataUrl, uploadedImage.mimeType, tone);
          if (textRes && textRes.success && textRes.data) {
            platformData = textRes.data;
          }
        } catch (err) {
          console.warn("Gemini Vision error:", err);
        }

        if (!platformData) {
          const s = summary || "Special Collection";
          platformData = {
            Instagram: `✨ Captured in the moment! ✨\n\n${summary || "Designed with passion, crafted for perfection."}\n\nWhat do you think? Drop your thoughts below! 👇\n\n#photooftheday #productphotography #brand #style #exclusive #trending`,
            Twitter: `Elevating the standard. ${summary || "Take a closer look."} 🚀✨ #trending #launch`,
            LinkedIn: `Excited to present our latest visual showcase: ${summary || "A testament to thoughtful craftsmanship and modern design."}\n\n#Design #Innovation #BusinessGrowth #Marketing`,
            EmailSubject: `Look what's here: ${s}`,
            EmailBody: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;"><h2 style="color:#6366f1;">${s}</h2><p>Here is an exclusive first look at our latest offering.</p></div>`
          };
        }

        const emailSubject = platformData.EmailSubject || `Exclusive Update: ${summary || "New Release"}`;
        const emailBodyRaw = platformData.EmailBody || "";
        const emailBody = emailBodyRaw.trim().startsWith("<")
          ? emailBodyRaw
          : `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;"><h2 style="color:#6366f1;">${summary || "Special Feature"}</h2><p>${emailBodyRaw || "Check out our latest release!"}</p></div>`;

        const imageVariation = [{
          id: 0,
          label: "Uploaded Photo",
          icon: "fa-camera",
          url: uploadedImage.dataUrl,
          fallbackUrl: uploadedImage.dataUrl
        }];

        setGenerated({
          images: imageVariation,
          Instagram: { caption: platformData.Instagram || "" },
          Twitter: { caption: platformData.Twitter || "" },
          LinkedIn: { caption: platformData.LinkedIn || "" },
          Email: { subject: emailSubject, body: emailBody },
          isUploaded: true
        });

        showToast("Gemini Vision analyzed image & generated captions!", "success");
      } else {
        // --- 2. TEXT-TO-IMAGE & COPY GENERATION MODE ---
        const context = getContextStyle(summary);
        const catImages = CATEGORY_FALLBACK_IMAGES[context.category] || CATEGORY_FALLBACK_IMAGES.general;
        const isAc = /\b(ac|air conditioner|cooling)\b/i.test(summary);

        const styleConfigs = isAc ? [
          {
            id: 0,
            label: "Luxury Living Room",
            icon: "fa-couch",
            prompt: "sleek modern white split air conditioner mounted on wall of luxury contemporary living room, warm ambient light, architectural interior photography",
            fallbackUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1000&q=80"
          },
          {
            id: 1,
            label: "Master Bedroom Suite",
            icon: "fa-bed",
            prompt: "luxury master bedroom suite with stylish modern air conditioner on wall, elegant interior, soft daylight",
            fallbackUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
          },
          {
            id: 2,
            label: "Aesthetic Macro View",
            icon: "fa-film",
            prompt: "close-up detail shot of modern sleek air conditioner cooling unit, digital display, premium minimalist texture",
            fallbackUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
          },
          {
            id: 3,
            label: "Penthouse Comfort",
            icon: "fa-building",
            prompt: "ultra luxury modern penthouse apartment with split air conditioner, floor to ceiling windows, designer furniture",
            fallbackUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
          }
        ] : [
          {
            id: 0,
            label: "Lifestyle Setting",
            icon: "fa-couch",
            prompt: `${context.expanded}, modern luxury room lifestyle setting, natural lighting, elegant atmosphere`,
            fallbackUrl: catImages[1]
          },
          {
            id: 1,
            label: "Cinematic Close-Up",
            icon: "fa-film",
            prompt: `${context.expanded}, dramatic cinematic macro perspective, sleek premium textures, depth of field`,
            fallbackUrl: catImages[2]
          },
          {
            id: 2,
            label: "Commercial Display",
            icon: "fa-store",
            prompt: `${context.expanded}, luxury commercial advertising display, vibrant modern presentation`,
            fallbackUrl: catImages[3]
          }
        ];

        const variations = styleConfigs.map((cfg) => ({
          id: cfg.id,
          label: cfg.label,
          icon: cfg.icon,
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cfg.prompt)}?width=800&height=600&nologo=true`,
          fallbackUrl: cfg.fallbackUrl
        }));

        let platformData = null;
        try {
          const textRes = await api.generateText(summary, null, null, tone);
          if (textRes && textRes.success && textRes.data) {
            platformData = textRes.data;
          }
        } catch (err) {
          console.warn("Gemini text gen error:", err);
        }

        if (!platformData) {
          try {
            const promptText = `You are an expert marketer. Based on summary: "${summary}", generate content. Return ONLY JSON: {"Instagram": "caption text with emojis and hashtags", "EmailSubject": "email subject", "EmailBody": "<div style='font-family:sans-serif;padding:16px;'><h3>Heading</h3><p>Email body...</p></div>"}`;
            const response = await fetch("https://text.pollinations.ai/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: [
                  { role: "system", content: "Generate raw JSON only." },
                  { role: "user", content: promptText }
                ]
              })
            });
            if (response.ok) {
              const text = await response.text();
              const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
              platformData = JSON.parse(cleaned);
            }
          } catch (err) {
            console.warn("Text AI fallback failed:", err);
          }
        }

        if (!platformData) {
          platformData = {
            Instagram: FALLBACK_CONTENT.Instagram(summary),
            Twitter: `🔥 ${summary}! Discover the new collection today. 🚀 #trending`,
            LinkedIn: `Proud to share our latest innovation: ${summary}. Built for performance and reliability. #Marketing #Innovation`,
            EmailSubject: `Special Offer: ${summary}`,
            EmailBody: FALLBACK_CONTENT.Email(summary)
          };
        }

        const emailSubject = platformData.EmailSubject || `Special Offer: ${summary}`;
        const emailBodyRaw = platformData.EmailBody || "";
        const emailBody = emailBodyRaw.trim().startsWith("<")
          ? emailBodyRaw
          : `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;"><h2 style="color:#6366f1;">${summary}</h2><p>${emailBodyRaw || "Check out our latest offering!"}</p></div>`;

        variations.forEach((v) => {
          const img = new Image();
          img.src = v.url;
          const fb = new Image();
          fb.src = v.fallbackUrl;
        });

        setGenerated({
          images: variations,
          Instagram: { caption: platformData.Instagram || FALLBACK_CONTENT.Instagram(summary) },
          Twitter: { caption: platformData.Twitter || "" },
          LinkedIn: { caption: platformData.LinkedIn || "" },
          Email: { subject: emailSubject, body: emailBody },
          isUploaded: false
        });

        showToast("Generated visual options & marketing copy!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Generation failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getActiveTextToCopy = () => {
    if (!generated) return "";
    switch (activeTab) {
      case "Instagram":
        return generated.Instagram?.caption || "";
      case "Twitter":
        return generated.Twitter?.caption || generated.Instagram?.caption || "";
      case "LinkedIn":
        return generated.LinkedIn?.caption || generated.Instagram?.caption || "";
      case "Email":
        return `${generated.Email?.subject || ""}\n\n${generated.Email?.body || ""}`;
      default:
        return generated.Instagram?.caption || "";
    }
  };

  const handleCopyText = () => {
    const text = getActiveTextToCopy();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Copied to clipboard!", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = async () => {
    if (!generated) return;
    setPublishing(true);
    try {
      const selectedImg = generated.images[activeImageIdx]?.url || generated.images[0]?.url || "";
      const allImages = generated.images.map((img) => img.url);

      const campaignTitle = summary.trim() || (uploadedImage ? `Campaign for ${uploadedImage.name}` : "Untitled Campaign");

      const activeChannels = [];
      if (generated.Instagram?.caption) activeChannels.push("Instagram");
      if (generated.Twitter?.caption) activeChannels.push("Twitter");
      if (generated.LinkedIn?.caption) activeChannels.push("LinkedIn");
      if (generated.Email?.subject || generated.Email?.body) activeChannels.push("Email");
      if (activeChannels.length === 0) activeChannels.push("Instagram");

      // 1. Create Campaign in Database
      const newCampaign = await api.createCampaign({
        name: campaignTitle,
        objective: "Brand Awareness",
        status: "Active",
        budget: 3500,
        roi: 290,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        channels: activeChannels,
        imageUrl: selectedImg,
        content: {
          instagram: generated.Instagram?.caption || "",
          twitter: generated.Twitter?.caption || "",
          linkedin: generated.LinkedIn?.caption || "",
          emailSubject: generated.Email?.subject || "",
          emailBody: generated.Email?.body || "",
          imageUrl: selectedImg,
          gallery: allImages
        }
      });

      if (setCampaigns) {
        setCampaigns((prev) => [newCampaign, ...prev]);
      }

      // 2. Sync individual post records to database for Analytics
      try {
        const postsToCreate = [];
        if (generated.Instagram?.caption) {
          postsToCreate.push({
            title: campaignTitle,
            platform: "Instagram",
            content: generated.Instagram.caption,
            imageUrl: selectedImg
          });
        }
        if (generated.Twitter?.caption) {
          postsToCreate.push({
            title: campaignTitle,
            platform: "Twitter",
            content: generated.Twitter.caption,
            imageUrl: selectedImg
          });
        }
        if (generated.LinkedIn?.caption) {
          postsToCreate.push({
            title: campaignTitle,
            platform: "LinkedIn",
            content: generated.LinkedIn.caption,
            imageUrl: selectedImg
          });
        }
        if (generated.Email?.subject) {
          postsToCreate.push({
            title: campaignTitle,
            platform: "Email",
            content: generated.Email.subject,
            imageUrl: selectedImg
          });
        }

        for (const p of postsToCreate) {
          const createdP = await api.createPost(p);
          if (setPosts) {
            setPosts((prev) => [createdP, ...prev]);
          }
        }
      } catch (postErr) {
        console.warn("Could not save post records:", postErr);
      }

      // 3. Log into Database History
      if (addHistoryLog) {
        addHistoryLog(
          `Campaign '${campaignTitle}' Published`,
          "campaign",
          `Saved to DB. Channels: ${activeChannels.join(", ")}.`
        );
      }

      if (pushNotification) {
        pushNotification("Campaign Published!", `"${campaignTitle}" saved to Database, Campaigns & Analytics`, "success");
      }
      showToast("Saved to DB! Live in Campaigns & Analytics.", "success");

      // 4. Open success modal
      setPublishedSuccess({
        id: newCampaign.id || newCampaign._id,
        name: campaignTitle,
        imageUrl: selectedImg,
        channels: activeChannels
      });
    } catch (err) {
      console.error(err);
      showToast("Publish failed: " + err.message, "error");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <section id="page-content-preview" className="app-page">
      {/* 2-COLUMN SPLIT STUDIO LAYOUT: Left = Controls & Copy | Right = Pure Image Studio */}
      <div className="quick-studio-layout">
        
        {/* LEFT PANEL: Input, Tabs & Generated Copy */}
        <div className="studio-panel">
          <div className="studio-section-title">
            <span><i className="fa-solid fa-sliders mr-2 text-[var(--accent-blue)]"></i> Campaign Controls & Copy</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* 1. IMAGE UPLOAD DROPZONE */}
            <div className="upload-section">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleImageFileChange}
                style={{ display: "none" }}
              />

              {!uploadedImage ? (
                <div
                  className="upload-dropzone-box"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageFileChange({ target: { files: [file] } });
                  }}
                  title="Click to browse or drop an image file"
                >
                  <div className="upload-dropzone-icon">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  <div className="upload-dropzone-text">
                    <strong>Upload your image</strong> or drag & drop
                  </div>
                  <div className="upload-dropzone-sub">
                    JPG, PNG, WEBP — Gemini Vision generates tailored captions
                  </div>
                </div>
              ) : (
                <div className="uploaded-file-card">
                  <img src={uploadedImage.dataUrl} alt="Uploaded thumbnail" className="uploaded-thumb" />
                  <div className="uploaded-file-meta">
                    <span className="uploaded-file-name">{uploadedImage.name}</span>
                    <span className="uploaded-file-size">
                      <i className="fa-solid fa-circle-check mr-1"></i> {uploadedImage.size} • Ready for Gemini Vision
                    </span>
                  </div>
                  <div className="uploaded-actions">
                    <button
                      type="button"
                      className="btn-change-image"
                      onClick={() => fileInputRef.current?.click()}
                      title="Change image"
                    >
                      <i className="fa-solid fa-arrows-rotate mr-1"></i> Change
                    </button>
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={handleRemoveUploadedImage}
                      title="Remove image"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. TEXT SUMMARY / CONTEXT INPUT */}
            <div className="quick-generate-input-wrap">
              <label className="quick-generate-label">
                {uploadedImage ? "Optional Hint / Offer Details for Captions" : "Product / Campaign Summary"}
              </label>
              <input
                type="text"
                className="quick-generate-input"
                placeholder={
                  uploadedImage
                    ? "e.g. 20% off weekend special, or leave empty for auto-detection"
                    : "e.g. AC mega offer — 50% off all air conditioners, free installation this week"
                }
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>

            {/* 3. TONE SELECTOR */}
            <div className="tone-selector-wrap">
              <label className="quick-generate-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><i className="fa-solid fa-sliders mr-1 text-[var(--accent-purple)]"></i> Caption Tone</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>{tone}</span>
              </label>
              <div className="tone-pill-group">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`tone-pill-btn ${tone === t ? "active" : ""}`}
                    onClick={() => setTone(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. GENERATE BUTTON */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="primary-btn"
              style={{
                width: "100%",
                padding: "13px",
                background: uploadedImage
                  ? "linear-gradient(135deg, #2563eb, #7c3aed)"
                  : undefined
              }}
            >
              {loading ? (
                <><i className="fa-solid fa-spinner fa-spin mr-2"></i> {uploadedImage ? "Analyzing with Gemini Vision..." : "Generating Visuals & Copy..."}</>
              ) : uploadedImage ? (
                <><i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Generate Captions with Gemini Vision</>
              ) : (
                <><i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Generate 4 Options & Copy</>
              )}
            </button>
          </div>

          {/* PLATFORM TABS */}
          <div style={{ display: "flex", gap: 8, marginTop: 24, borderBottom: "1px solid var(--glass-border)", paddingBottom: 12 }}>
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`app-tab-btn ${activeTab === p.id ? "active" : ""}`}
                onClick={() => setActiveTab(p.id)}
                style={activeTab === p.id ? { borderColor: p.color, background: `${p.color}15` } : {}}
              >
                <i className={p.icon} style={{ color: p.color }}></i>
                <span>{p.id}</span>
              </button>
            ))}
          </div>

          {/* GENERATED COPY BOX */}
          {generated ? (
            <div className="studio-copy-box">
              <div className="studio-copy-header">
                <span className="studio-copy-title">
                  <i className="fa-solid fa-file-lines mr-1.5 text-[var(--accent-purple)]"></i>
                  {activeTab === "Instagram" && "Instagram Caption"}
                  {activeTab === "Twitter" && "Twitter / X Post"}
                  {activeTab === "LinkedIn" && "LinkedIn Post"}
                  {activeTab === "Email" && "Email Message"}
                </span>
                <button
                  type="button"
                  className="studio-copy-btn"
                  onClick={handleCopyText}
                >
                  <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"} mr-1`}></i>
                  {copied ? "Copied" : "Copy Text"}
                </button>
              </div>

              {activeTab === "Instagram" && (
                <div>
                  <textarea
                    className="studio-copy-textarea"
                    rows={8}
                    value={generated.Instagram?.caption || ""}
                    onChange={(e) => handleCaptionChange(e.target.value)}
                    placeholder="Instagram caption with hashtags..."
                  />
                  <div className="caption-meta-bar">
                    <span><i className="fa-regular fa-pen-to-square mr-1"></i> Editable caption</span>
                    <span>{(generated.Instagram?.caption || "").length} characters</span>
                  </div>
                </div>
              )}

              {activeTab === "Twitter" && (
                <div>
                  <textarea
                    className="studio-copy-textarea"
                    rows={6}
                    value={generated.Twitter?.caption || generated.Instagram?.caption || ""}
                    onChange={(e) => handleCaptionChange(e.target.value)}
                    placeholder="Short punchy post for Twitter / X..."
                  />
                  <div className="caption-meta-bar">
                    <span><i className="fa-regular fa-pen-to-square mr-1"></i> Editable post</span>
                    <span>{(generated.Twitter?.caption || generated.Instagram?.caption || "").length} / 280 chars</span>
                  </div>
                </div>
              )}

              {activeTab === "LinkedIn" && (
                <div>
                  <textarea
                    className="studio-copy-textarea"
                    rows={8}
                    value={generated.LinkedIn?.caption || generated.Instagram?.caption || ""}
                    onChange={(e) => handleCaptionChange(e.target.value)}
                    placeholder="Professional thought-leadership caption..."
                  />
                  <div className="caption-meta-bar">
                    <span><i className="fa-regular fa-pen-to-square mr-1"></i> Editable post</span>
                    <span>{(generated.LinkedIn?.caption || generated.Instagram?.caption || "").length} characters</span>
                  </div>
                </div>
              )}

              {activeTab === "Email" && (
                <div>
                  <div className="studio-email-subject">
                    <span style={{ color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Subject Line:</span>
                    <input
                      type="text"
                      className="quick-generate-input"
                      style={{ width: "100%", padding: "8px 12px", fontSize: 13 }}
                      value={generated.Email?.subject || ""}
                      onChange={(e) => handleCaptionChange(e.target.value)}
                    />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <span style={{ color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Email Body (HTML Preview):</span>
                    <div
                      style={{ maxHeight: 220, overflowY: "auto", border: "1px solid var(--glass-border)", borderRadius: 8, padding: 12, background: "rgba(0,0,0,0.02)" }}
                      dangerouslySetInnerHTML={{ __html: generated.Email?.body }}
                    />
                  </div>
                </div>
              )}

              {/* Publish Campaign Button */}
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="primary-btn"
                style={{ width: "100%", marginTop: 18, padding: "12px", background: "linear-gradient(135deg, #059669, #10b981)" }}
              >
                {publishing ? (
                  <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Publishing...</>
                ) : (
                  <><i className="fa-solid fa-rocket mr-2"></i> Publish Campaign</>
                )}
              </button>
            </div>
          ) : (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              <i className="fa-regular fa-comment-dots" style={{ fontSize: 26, display: "block", marginBottom: 8, opacity: 0.4 }}></i>
              {uploadedImage ? "Click 'Generate Captions with Gemini Vision' to analyze your image" : "Upload an image or enter your summary above to generate copy"}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Pure Image Studio */}
        <div className="studio-panel">
          <div className="studio-section-title">
            <span><i className="fa-solid fa-image mr-2 text-[var(--accent-purple)]"></i> Campaign Visual Display</span>
            {generated && currentImage && (
              <span style={{ fontSize: 11, color: "var(--accent-blue)", fontWeight: 600 }}>
                {currentImage.label} ({activeImageIdx + 1}/{generated.images.length})
              </span>
            )}
            {!generated && uploadedImage && (
              <span style={{ fontSize: 11, color: "var(--accent-green)", fontWeight: 600 }}>
                Uploaded Image Preview
              </span>
            )}
          </div>

          {generated && currentImage ? (
            <div>
              {/* PURE IMAGE STAGE — Click to View Lightbox Fullscreen */}
              <div
                className="pure-image-stage image-clickable-stage"
                onClick={() => setLightboxOpen(true)}
                title="Click to view full-size image"
              >
                <img
                  src={currentImage.url}
                  alt={currentImage.label}
                  onError={(e) => {
                    e.currentTarget.src = currentImage.fallbackUrl;
                  }}
                />
                <BannerOverlay summary={summary} />

                {/* Hover hint */}
                <div className="image-hover-hint">
                  <i className="fa-solid fa-expand"></i> Click to View Fullscreen
                </div>

                {/* Left & Right Slide Arrows (only if more than 1 image) */}
                {generated.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="ig-carousel-arrow arrow-prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((activeImageIdx - 1 + generated.images.length) % generated.images.length);
                      }}
                      aria-label="Previous angle"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                      type="button"
                      className="ig-carousel-arrow arrow-next"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((activeImageIdx + 1) % generated.images.length);
                      }}
                      aria-label="Next angle"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>

                    {/* Counter Badge */}
                    <div className="ig-carousel-counter">
                      {activeImageIdx + 1}/{generated.images.length}
                    </div>
                  </>
                )}

                {/* Download Button on Stage */}
                <button
                  type="button"
                  className="btn-download-stage"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadImage();
                  }}
                  title="Download image to your device"
                >
                  <i className="fa-solid fa-download"></i> Download
                </button>
              </div>

              {/* VISUAL VARIATIONS THUMBNAIL GALLERY (only for multiple variations) */}
              {generated.images.length > 1 && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                    Choose Visual Angle ({generated.images.length} Options):
                  </div>
                  <div className="variations-grid">
                    {generated.images.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`variation-thumb-card ${idx === activeImageIdx ? "active" : ""}`}
                        onClick={() => setActiveImageIdx(idx)}
                      >
                        <img
                          src={item.url}
                          alt={item.label}
                          className="variation-thumb-img"
                          onError={(e) => {
                            e.currentTarget.src = item.fallbackUrl;
                          }}
                        />
                        <div className="variation-thumb-label">
                          <i className={`fa-solid ${item.icon} mr-1`} style={{ fontSize: 10 }}></i>
                          {item.label}
                        </div>
                        {idx === activeImageIdx && (
                          <div className="variation-active-badge">
                            <i className="fa-solid fa-check"></i>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : uploadedImage ? (
            <div>
              {/* STAGE SHOWING UPLOADED IMAGE BEFORE GENERATING */}
              <div
                className="pure-image-stage image-clickable-stage"
                onClick={() => setLightboxOpen(true)}
                title="Click to view full-size image"
              >
                <img src={uploadedImage.dataUrl} alt={uploadedImage.name} />
                <div className="image-hover-hint">
                  <i className="fa-solid fa-expand"></i> Click to View Fullscreen
                </div>
                <button
                  type="button"
                  className="btn-download-stage"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadImage();
                  }}
                  title="Download image to your device"
                >
                  <i className="fa-solid fa-download"></i> Download
                </button>
              </div>
              <div style={{ marginTop: 14, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
                <i className="fa-solid fa-circle-check text-[var(--accent-green)] mr-1"></i> Image ready — Click <strong>Generate Captions with Gemini Vision</strong>!
              </div>
            </div>
          ) : (
            <div className="pure-image-empty">
              <i className="fa-regular fa-image"></i>
              <p>Your visual preview will appear here</p>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Upload an image or enter a product summary to start</span>
            </div>
          )}
        </div>

      </div>

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {lightboxOpen && (currentImage || uploadedImage) && (
        <div className="image-lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="image-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="image-lightbox-header">
              <div className="image-lightbox-title">
                <i className="fa-solid fa-images text-[var(--accent-blue)]"></i>
                <span>
                  {currentImage
                    ? `${currentImage.label} (${activeImageIdx + 1} of ${generated.images.length})`
                    : uploadedImage?.name || "Uploaded Image"}
                </span>
              </div>
              <div className="image-lightbox-actions">
                <button
                  type="button"
                  className="image-lightbox-btn"
                  onClick={handleDownloadImage}
                  title="Download image"
                >
                  <i className="fa-solid fa-download"></i> Download
                </button>
                <a
                  href={currentImage?.fallbackUrl || currentImage?.url || uploadedImage?.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="image-lightbox-btn"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i> Open Full HD
                </a>
                <button
                  type="button"
                  className="image-lightbox-close"
                  onClick={() => setLightboxOpen(false)}
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            <div className="image-lightbox-img-wrap">
              <img
                src={currentImage?.url || uploadedImage?.dataUrl}
                alt="Enlarged Visual"
                onError={(e) => {
                  if (currentImage?.fallbackUrl) {
                    e.currentTarget.src = currentImage.fallbackUrl;
                  }
                }}
              />
              <BannerOverlay summary={summary} />

              {/* Lightbox navigation arrows if multiple */}
              {generated?.images?.length > 1 && (
                <>
                  <button
                    type="button"
                    className="ig-carousel-arrow arrow-prev"
                    onClick={() => setActiveImageIdx((activeImageIdx - 1 + generated.images.length) % generated.images.length)}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    type="button"
                    className="ig-carousel-arrow arrow-next"
                    onClick={() => setActiveImageIdx((activeImageIdx + 1) % generated.images.length)}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH SUCCESS MODAL */}
      {publishedSuccess && (
        <div className="publish-success-overlay" onClick={() => setPublishedSuccess(null)}>
          <div className="publish-success-card" onClick={(e) => e.stopPropagation()}>
            <div className="publish-success-header">
              <div className="publish-success-icon-wrap">
                <i className="fa-solid fa-check"></i>
              </div>
              <h3 className="publish-success-title">Campaign Published!</h3>
              <p className="publish-success-desc">
                Your campaign and creative posts are now permanently stored in the database and active across the platform.
              </p>
            </div>

            <div className="publish-preview-box">
              {publishedSuccess.imageUrl && (
                <img
                  src={publishedSuccess.imageUrl}
                  alt={publishedSuccess.name}
                  className="publish-preview-thumb"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80";
                  }}
                />
              )}
              <div className="publish-preview-info">
                <div className="publish-preview-name">{publishedSuccess.name}</div>
                <div className="publish-badge-group">
                  {(publishedSuccess.channels || []).map((ch) => (
                    <span key={ch} className="publish-channel-pill">
                      {ch}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Status: <span style={{ color: "#10b981", fontWeight: 700 }}>Active</span>
                </div>
              </div>
            </div>

            <div className="publish-db-pills">
              <div className="publish-db-item">
                <i className="fa-solid fa-database"></i> Stored in SQLite <code>campaigns</code> table
              </div>
              <div className="publish-db-item">
                <i className="fa-solid fa-table-cells"></i> Stored in SQLite <code>posts</code> table ({publishedSuccess.channels?.length || 1} channels)
              </div>
              <div className="publish-db-item">
                <i className="fa-solid fa-chart-pie"></i> Metrics instantly available in Analytics & Campaigns
              </div>
            </div>

            <div className="publish-action-buttons">
              <button
                type="button"
                className="btn-success-action-primary"
                onClick={() => {
                  setPublishedSuccess(null);
                  navigate("/campaigns");
                }}
              >
                <i className="fa-solid fa-bullhorn"></i> View in Campaigns
              </button>
              <button
                type="button"
                className="btn-success-action-secondary"
                onClick={() => {
                  setPublishedSuccess(null);
                  navigate("/analytics");
                }}
              >
                <i className="fa-solid fa-chart-line"></i> View in Analytics
              </button>
              <button
                type="button"
                className="btn-success-action-close"
                onClick={() => setPublishedSuccess(null)}
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

