import React, { useState } from "react";
import { api } from "../api";

const PLATFORMS = [
  { id: "Instagram", icon: "fa-brands fa-instagram", color: "#E4405F", gradient: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" },
  { id: "LinkedIn", icon: "fa-brands fa-linkedin", color: "#0A66C2", gradient: "linear-gradient(135deg, #0077B5, #0A66C2)" },
  { id: "Twitter", icon: "fa-brands fa-x-twitter", color: "#000000", gradient: "linear-gradient(135deg, #14171A, #657786)" },
  { id: "Facebook", icon: "fa-brands fa-facebook", color: "#1877F2", gradient: "linear-gradient(135deg, #1877F2, #42A5F5)" },
  { id: "Email", icon: "fa-solid fa-envelope", color: "#EA4335", gradient: "linear-gradient(135deg, #EA4335, #FBBC04)" }
];

const FALLBACK_CONTENT = {
  Instagram: (title, theme) => `✨ BIG NEWS: ${title}! ✨\n\nWe are absolutely thrilled to share this with our community. ${theme ? `Theme: ${theme}.` : "Get ready to elevate your experience."} 🚀\n\nDrop a ❤️ if you are excited!\n\n#instagram #marketing #innovation #trending #goals`,
  LinkedIn: (title, theme) => `We're excited to announce: ${title}.\n\nThis milestone represents a major step forward for our team and customers. ${theme ? `Focusing on: ${theme}.` : "By streamlining our core operations, we're enabling businesses to scale more efficiently."}\n\nWhat are your thoughts on this trend? Let's discuss below. 💬\n\n#corporate #leadership #innovation #linkedin`,
  Twitter: (title, theme) => `🚀 Exciting news: ${title}!\n\n${theme ? `${theme}` : "We are pushing boundaries and delivering top-tier performance."} Check it out now! 💥\n\n#tech #announcement #twitter`,
  Facebook: (title, theme) => `📢 Announcement: ${title}!\n\n${theme ? `Special Update: ${theme}.` : "We're launching something special and wanted you to be the first to know."} 🔥\n\nLike and share to spread the word!\n\n#announce #business #updates #facebook`,
  Email: (title, theme) => `Subject: Introducing ${title} 📩\n\nHello Friend,\n\nWe are proud to present: ${title}.\n\n${theme ? `Highlight: ${theme}.` : "Our team has been working around the clock to build this feature, and we're excited to invite you to try it out."}\n\nBest,\nMarketing Team`
};

function getImageUrl(title, theme) {
  const prompt = encodeURIComponent(`${title} ${theme || "marketing"} professional social media post`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600`;
}

function PhoneMockup({ children }) {
  return (
    <div className="phone-frame">
      <div className="phone-notch"></div>
      <div className="phone-screen">
        {children}
      </div>
      <div className="phone-home-bar"></div>
    </div>
  );
}

function InstagramPreview({ post, imageUrl }) {
  return (
    <PhoneMockup platform="Instagram">
      <div className="ig-header">
        <div className="ig-avatar"></div>
        <div className="ig-user-info">
          <span className="ig-username">your_brand</span>
          <span className="ig-location">Sponsored</span>
        </div>
        <i className="fa-solid fa-ellipsis"></i>
      </div>
      <div className="ig-image-container">
        <img src={imageUrl} alt="Post" />
      </div>
      <div className="ig-actions">
        <div className="ig-actions-left">
          <i className="fa-solid fa-heart"></i>
          <i className="fa-regular fa-comment"></i>
          <i className="fa-regular fa-paper-plane"></i>
        </div>
        <i className="fa-regular fa-bookmark"></i>
      </div>
      <div className="ig-likes">1,247 likes</div>
      <div className="ig-caption">
        <span className="ig-cap-user">your_brand</span> {post}
      </div>
      <div className="ig-comments">View all 89 comments</div>
      <div className="ig-time">2 hours ago</div>
    </PhoneMockup>
  );
}

function LinkedInPreview({ post, imageUrl }) {
  return (
    <PhoneMockup platform="LinkedIn">
      <div className="li-header">
        <div className="li-avatar"></div>
        <div className="li-user-info">
          <span className="li-name">Your Brand</span>
          <span className="li-subtitle">Marketing Team · 2h</span>
        </div>
        <i className="fa-solid fa-ellipsis"></i>
      </div>
      <div className="li-content">{post}</div>
      {imageUrl && (
        <div className="li-image">
          <img src={imageUrl} alt="Post" />
        </div>
      )}
      <div className="li-reactions">
        <div className="li-reactions-icons">
          <span className="li-react-icon" style={{ background: "#0A66C2" }}><i className="fa-solid fa-thumbs-up"></i></span>
          <span className="li-react-icon" style={{ background: "#DF704D" }}><i className="fa-solid fa-heart"></i></span>
        </div>
        <span>248</span>
      </div>
      <div className="li-divider"></div>
      <div className="li-actions">
        <div className="li-action-btn"><i className="fa-regular fa-thumbs-up"></i> Like</div>
        <div className="li-action-btn"><i className="fa-regular fa-comment"></i> Comment</div>
        <div className="li-action-btn"><i className="fa-solid fa-retweet"></i> Repost</div>
        <div className="li-action-btn"><i className="fa-regular fa-paper-plane"></i> Send</div>
      </div>
    </PhoneMockup>
  );
}

function TwitterPreview({ post, imageUrl }) {
  return (
    <PhoneMockup platform="Twitter">
      <div className="tw-header">
        <div className="tw-avatar"></div>
        <div className="tw-user-info">
          <span className="tw-name">Your Brand</span>
          <span className="tw-handle">@yourbrand</span>
        </div>
        <i className="fa-solid fa-ellipsis"></i>
      </div>
      <div className="tw-content">{post}</div>
      {imageUrl && (
        <div className="tw-image">
          <img src={imageUrl} alt="Post" />
        </div>
      )}
      <div className="tw-time">2:30 PM · Jul 16, 2026</div>
      <div className="tw-divider"></div>
      <div className="tw-stats">
        <span><strong>124</strong> Reposts</span>
        <span><strong>48</strong> Quotes</span>
        <span><strong>1.2K</strong> Likes</span>
        <span><strong>89</strong> Views</span>
      </div>
      <div className="tw-divider"></div>
      <div className="tw-actions">
        <i className="fa-regular fa-comment"></i>
        <i className="fa-solid fa-retweet tw-green"></i>
        <i className="fa-regular fa-heart"></i>
        <i className="fa-solid fa-arrow-up-from-bracket"></i>
      </div>
    </PhoneMockup>
  );
}

function FacebookPreview({ post, imageUrl }) {
  return (
    <PhoneMockup platform="Facebook">
      <div className="fb-header">
        <div className="fb-avatar"></div>
        <div className="fb-user-info">
          <span className="fb-name">Your Brand</span>
          <span className="fb-meta"><i className="fa-solid fa-earth-americas"></i> · 2h</span>
        </div>
        <i className="fa-solid fa-ellipsis"></i>
      </div>
      <div className="fb-text">{post}</div>
      {imageUrl && (
        <div className="fb-image">
          <img src={imageUrl} alt="Post" />
        </div>
      )}
      <div className="fb-reactions">
        <div className="fb-reactions-left">
          <span className="fb-react-circle" style={{ background: "#1877F2" }}><i className="fa-solid fa-thumbs-up"></i></span>
          <span className="fb-react-circle" style={{ background: "#F33E58" }}><i className="fa-solid fa-heart"></i></span>
        </div>
        <span>1.4K</span>
      </div>
      <div className="fb-divider"></div>
      <div className="fb-actions">
        <div className="fb-action-btn"><i className="fa-regular fa-thumbs-up"></i> Like</div>
        <div className="fb-action-btn"><i className="fa-regular fa-comment"></i> Comment</div>
        <div className="fb-action-btn"><i className="fa-solid fa-share"></i> Share</div>
      </div>
    </PhoneMockup>
  );
}

function EmailPreview({ subject, body }) {
  return (
    <div className="email-mockup-frame">
      <div className="email-mockup-toolbar">
        <div className="email-dots">
          <span className="browser-dot red"></span>
          <span className="browser-dot yellow"></span>
          <span className="browser-dot green"></span>
        </div>
        <div className="email-address-bar">
          <i className="fa-solid fa-lock"></i> mail.google.com
        </div>
      </div>
      <div className="email-mockup-body">
        <div className="email-mockup-header">
          <div className="email-mockup-from">
            <div className="email-mockup-avatar"></div>
            <div>
              <strong>Your Brand</strong>
              <span>&lt;noreply@yourbrand.com&gt;</span>
            </div>
          </div>
          <span className="email-mockup-date">Jul 16, 2026</span>
        </div>
        <div className="email-mockup-subject">{subject}</div>
        <div className="email-mockup-content" dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
}

export default function ContentPreview({ showToast, addHistoryLog, pushNotification }) {
  const [summary, setSummary] = useState("");
  const [activeTab, setActiveTab] = useState("Instagram");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);

  const handleGenerate = async () => {
    if (!summary.trim()) {
      showToast("Enter a product summary first", "error");
      return;
    }

    setLoading(true);
    try {
      const promptText = `You are an expert social media copywriter. Based on this product/brand summary: "${summary}", generate content for each platform. Return ONLY valid JSON with this exact structure: {"Instagram": "caption text", "LinkedIn": "caption text", "Twitter": "caption text", "Facebook": "caption text", "EmailBody": "full email HTML body", "EmailSubject": "email subject line"}`;

      let platformData = null;

      try {
        const response = await fetch("https://text.pollinations.ai/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "You are an expert marketer. Generate ONLY valid JSON. No markdown, no code fences, just raw JSON." },
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
        console.warn("Pollinations AI failed, using fallback:", err);
      }

      if (!platformData) {
        platformData = {
          Instagram: FALLBACK_CONTENT.Instagram(summary, ""),
          LinkedIn: FALLBACK_CONTENT.LinkedIn(summary, ""),
          Twitter: FALLBACK_CONTENT.Twitter(summary, ""),
          Facebook: FALLBACK_CONTENT.Facebook(summary, ""),
          EmailSubject: `Introducing ${summary}`,
          EmailBody: FALLBACK_CONTENT.Email(summary, "")
        };
      }

      const imageUrl = getImageUrl(summary, "");
      const emailSubject = platformData.EmailSubject || `Introducing ${summary}`;
      const emailBody = platformData.EmailBody || `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;"><h2 style="color:#6366f1;">${summary}</h2><p>${platformData.EmailBody || "Check out our latest offering!"}</p></div>`;

      const posts = {
        Instagram: { caption: platformData.Instagram || FALLBACK_CONTENT.Instagram(summary, ""), imageUrl },
        LinkedIn: { caption: platformData.LinkedIn || FALLBACK_CONTENT.LinkedIn(summary, ""), imageUrl },
        Twitter: { caption: platformData.Twitter || FALLBACK_CONTENT.Twitter(summary, ""), imageUrl },
        Facebook: { caption: platformData.Facebook || FALLBACK_CONTENT.Facebook(summary, ""), imageUrl },
        Email: { subject: emailSubject, body: emailBody }
      };

      setGenerated(posts);

      for (const [platform, data] of Object.entries(posts)) {
        if (platform === "Email") continue;
        await api.createPost({
          title: summary,
          platform,
          content: data.caption,
          imageUrl: data.imageUrl,
          source: "quick-generate"
        });
      }

      await api.createHistory({
        action: "Quick Generate — All Platforms",
        category: "ai-content",
        details: `Generated content for "${summary}" across Instagram, LinkedIn, Twitter, Facebook, and Email`
      });

      addHistoryLog("Quick Generate — All Platforms", "ai-content", `Generated content for "${summary}"`);
      pushNotification("Content Generated", `Posts for "${summary}" created across 5 platforms`, "success");
      showToast("Content generated for all platforms!", "success");
    } catch (err) {
      console.error(err);
      showToast("Generation failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!generated) {
      return (
        <div className="app-preview-empty">
          <i className="fa-solid fa-mobile-screen-button empty-icon"></i>
          <h3>Real App Preview</h3>
          <p>Type your product summary and hit Generate to see how your post looks in real apps</p>
        </div>
      );
    }

    const postData = generated[activeTab];
    if (!postData) return null;

    if (activeTab === "Email") {
      return <EmailPreview subject={postData.subject} body={postData.body} />;
    }

    const props = { post: postData.caption, imageUrl: postData.imageUrl };

    switch (activeTab) {
      case "Instagram": return <InstagramPreview {...props} />;
      case "LinkedIn": return <LinkedInPreview {...props} />;
      case "Twitter": return <TwitterPreview {...props} />;
      case "Facebook": return <FacebookPreview {...props} />;
      default: return null;
    }
  };

  return (
    <section id="page-content-preview" className="app-page">
      <div className="glass-card p-6 rounded-[var(--radius-lg)] border border-[var(--glass-border)] shadow-[var(--card-shadow)] mb-6">
        <div className="flex items-center gap-3 mb-5 border-b border-[var(--glass-border)] pb-4">
          <div className="p-2.5 rounded-lg bg-[rgba(99,102,241,0.08)] text-[var(--accent-purple)]">
            <i className="fa-solid fa-bolt text-xl"></i>
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Quick Generate — All Platforms</h2>
            <p className="text-xs text-[var(--text-muted)]">Type one summary, get posts for Instagram, LinkedIn, Twitter, Facebook & Email instantly</p>
          </div>
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Product / Brand Summary</label>
            <input
              type="text"
              placeholder="e.g. Summer fitness sale — 30% off all gym equipment, free shipping this week"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="text-sm"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="primary-btn whitespace-nowrap"
            style={{ padding: "12px 28px" }}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Generating...
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles"></i> Generate All
              </>
            )}
          </button>
        </div>
      </div>

      <div className="app-preview-layout">
        <div className="app-preview-tabs-bar">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              className={`app-tab-btn ${activeTab === p.id ? "active" : ""}`}
              onClick={() => setActiveTab(p.id)}
              style={activeTab === p.id ? { borderColor: p.color, background: `${p.color}15` } : {}}
            >
              <i className={p.icon} style={{ color: p.color }}></i>
              <span>{p.id}</span>
            </button>
          ))}
        </div>

        <div className="app-preview-viewport">
          {loading ? (
            <div className="app-preview-loading">
              <div className="shimmer-icon-wrap">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <p>Generating content for all platforms...</p>
              <div className="shimmer-bar-wrap"><div className="shimmer-bar"></div></div>
            </div>
          ) : (
            renderPreview()
          )}
        </div>

        {generated && (
          <div className="app-preview-caption-bar">
            <div className="caption-bar-label">
              <i className="fa-solid fa-align-left"></i>
              <span>Caption / Content</span>
            </div>
            <div className="caption-bar-text">
              {activeTab === "Email" ? generated.Email.subject : generated[activeTab]?.caption}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
