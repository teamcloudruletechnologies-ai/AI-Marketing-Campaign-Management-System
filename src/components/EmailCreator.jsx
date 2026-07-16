import React, { useState, useEffect } from "react";
import { api } from "../api";

const emailTemplates = {
  promotional: {
    subject: "Exclusive Offer: Save Big on {brand} today! 🎉",
    body: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; background-color: #ffffff; color: #333;">
            <div style="text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="color: #6366f1; margin: 0;">{brand}</h2>
            </div>
            <p>Hello there,</p>
            <p>We've got some incredible news for you. For a limited time only, we are offering an exclusive discount on our entire catalog.</p>
            <div style="background-color: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0; text-align: center;">
                <h3 style="margin: 0; color: #8b5cf6;">🚀 {discount}</h3>
                <p style="margin: 5px 0 0 0; font-size: 13px;">Use coupon code <strong>SAVE25</strong> at checkout.</p>
            </div>
            <p>Unlock premium experiences, scale your workflows, and access premium updates today. Don't wait—this offer is running out fast.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Shop The Sale Now</a>
            </div>
            <p style="font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
                You are receiving this email because you registered at {brand}.<br>
                123 SaaS Way, Suite 400, San Francisco, CA.
            </p>
        </div>
    `
  },
  welcome: {
    subject: "Welcome to the family! Here is your access key 🗝️",
    body: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; background-color: #ffffff; color: #333;">
            <div style="text-align: center; border-bottom: 2px solid #0ea5e9; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="color: #0ea5e9; margin: 0;">Welcome to {brand}</h2>
            </div>
            <p>Hi there,</p>
            <p>We are absolutely thrilled to welcome you to <strong>{brand}</strong>. Our mission is to help you streamline marketing workflows and deploy high-converting campaigns instantly.</p>
            <p>To help you get started, we've prepared a brief walkthrough guides dashboard:</p>
            <ul style="padding-left: 20px; line-height: 1.8;">
                <li><strong>Step 1</strong>: Create your first campaign from the Admin Tab.</li>
                <li><strong>Step 2</strong>: Run the AI Content Generator for Instagram & Email copy.</li>
                <li><strong>Step 3</strong>: Track your engagement metrics in Analytics.</li>
              </ul>
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Access Workspace Dashboard</a>
            </div>
            <p>If you have any questions or feedback, simply reply directly to this email. We're here to help!</p>
            <p>Best regards,<br>The {brand} Success Team</p>
        </div>
    `
  },
  launch: {
    subject: "It's officially here. Say hello to {discount}! 🚀",
    body: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; background-color: #ffffff; color: #333;">
            <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="color: #10b981; margin: 0;">New Release Announcement</h2>
            </div>
            <p>Hello Innovator,</p>
            <p>After months of development and rigorous user feedback, we are proud to officially launch our newest product iteration: <strong>{discount}</strong>.</p>
            <p>This release introduces next-generation parameters designed to maximize efficiency:</p>
            <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #047857;">Key Features of {discount}:</p>
                <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13.5px; line-height: 1.6;">
                    <li><strong>Next-Gen Engine</strong>: 3x faster processing times.</li>
                    <li><strong>Custom Workflows</strong>: Configure visual boards in seconds.</li>
                    <li><strong>Smart Sync</strong>: Full integration with local databases.</li>
                </ul>
            </div>
            <p>Be among the first to experience the future. All active users of {brand} receive instant access starting today.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Activate {discount} Now</a>
            </div>
            <p style="font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
                Cheers,<br>The engineering team at {brand}
            </p>
        </div>
    `
  }
};

export default function EmailCreator({
  profile,
  showToast,
  addHistoryLog,
  pushNotification
}) {
  const [selectedTemplate, setSelectedTemplate] = useState("promotional");
  const [emailInputs, setEmailInputs] = useState({
    brandName: "",
    discountValue: ""
  });
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const brand = emailInputs.brandName || profile.company;
    const discount = emailInputs.discountValue || "25% OFF Storewide";
    const templateDb = emailTemplates[selectedTemplate];

    if (templateDb) {
      const compiledSubject = templateDb.subject
        .replace(/{brand}/g, brand)
        .replace(/{discount}/g, discount);
      const compiledBody = templateDb.body
        .replace(/{brand}/g, brand)
        .replace(/{discount}/g, discount);

      setSubject(compiledSubject);
      setHtmlContent(compiledBody);
    }
  }, [selectedTemplate, emailInputs, profile]);

  const handleCompile = async () => {
    try {
      showToast("Email Draft compiled successfully", "success");
      
      const logData = {
        action: `Drafted AI Email Template`,
        category: "ai-content",
        details: `Created ${selectedTemplate} email draft for brand: ${emailInputs.brandName || profile.company}`
      };
      
      await api.createHistory(logData);
      addHistoryLog(logData.action, logData.category, logData.details);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async () => {
    try {
      const logData = {
        action: `Published Email Template`,
        category: "campaign",
        details: `Posted ${selectedTemplate} email campaign draft to brand newsletter list.`
      };

      await api.createHistory(logData);
      addHistoryLog(logData.action, logData.category, logData.details);

      await api.createNotification({
        title: "Email Campaign Posted",
        text: `Welcome/Newsletter email design posted to active campaigns successfully!`,
        type: "success"
      });

      pushNotification(
        "Email Campaign Posted",
        `Welcome/Newsletter email design posted to active campaigns successfully!`,
        "success"
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="page-email-generator" className="app-page">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings Panel */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 rounded-[var(--radius-lg)] border border-[var(--glass-border)] shadow-[var(--card-shadow)] space-y-5">
            <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-3">
              Email Builder Settings
            </h2>

            <div className="form-group flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Campaign Template</label>
              <select
                className="glass-select bg-[rgba(255,255,255,0.6)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-[var(--radius-md)] p-3 text-xs font-semibold appearance-none outline-none cursor-pointer"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="promotional">Promotional Offer</option>
                <option value="welcome">Welcome Onboarding</option>
                <option value="launch">Product Launch Announcement</option>
              </select>
            </div>

            <div className="form-group flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Brand Name Override</label>
              <input
                type="text"
                placeholder={profile.company || "Your Brand"}
                value={emailInputs.brandName}
                onChange={(e) => setEmailInputs({ ...emailInputs, brandName: e.target.value })}
              />
            </div>

            <div className="form-group flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Offer / Highlight Text</label>
              <input
                type="text"
                placeholder="e.g. 25% OFF Storewide"
                value={emailInputs.discountValue}
                onChange={(e) => setEmailInputs({ ...emailInputs, discountValue: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[var(--glass-border)]">
              <button className="px-5 py-2.5 rounded-[var(--radius-md)] text-xs font-bold border border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-[rgba(0,0,0,0.03)] transition-all flex-1" onClick={handleCompile}>
                Recompile Draft
              </button>
              <button className="primary-btn flex-1" onClick={handlePublish}>
                Publish Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 rounded-[var(--radius-lg)] border border-[var(--glass-border)] shadow-[var(--card-shadow)] flex flex-col h-full min-h-[500px]">
            <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-3 mb-4">
              Compiled Subject & HTML Preview
            </h2>

            <div className="subject-preview mb-4 bg-slate-50 border border-slate-100 rounded-lg p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Subject Line</span>
              <p className="text-xs font-semibold text-slate-700">{subject}</p>
            </div>

            <div className="html-preview-frame flex-1 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-4 min-h-[300px]">
              <div 
                className="email-render-content bg-white p-2 rounded shadow-sm max-w-full overflow-x-auto" 
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
