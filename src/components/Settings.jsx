import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function Settings({
  profile,
  setProfile,
  showToast,
  addHistoryLog,
  pushNotification
}) {
  const [profileInputs, setProfileInputs] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    industry: "",
    avatar: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileInputs({
        name: profile.name || "",
        email: profile.email || "",
        company: profile.company || "",
        phone: profile.phone || "",
        industry: profile.industry || "",
        avatar: profile.avatar || ""
      });
    }
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateProfile(profileInputs);
      setProfile(updated);

      await api.createHistory({
        action: "Account Settings Modified",
        category: "profile",
        details: `Changed credentials for name: "${profileInputs.name}", company: "${profileInputs.company}"`
      });

      addHistoryLog(
        "Account Settings Modified",
        "profile",
        `Changed credentials for name: "${profileInputs.name}", company: "${profileInputs.company}"`
      );

      pushNotification(
        "Profile Config Saved",
        "Your profile details have been synced to MongoDB.",
        "success"
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to save profile settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result;
      setProfileInputs((prev) => ({
        ...prev,
        avatar: base64Data
      }));

      try {
        const updated = await api.updateProfile({
          ...profileInputs,
          avatar: base64Data
        });
        setProfile(updated);
        showToast("Avatar image updated!", "success");
        addHistoryLog("Uploaded brand image asset", "profile", "Modified user avatar picture.");
      } catch (err) {
        console.error(err);
        showToast("Failed to save avatar image", "error");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="page-profile" className="app-page">
      <div className="profile-settings-wrapper max-w-4xl mx-auto">
        <div className="glass-card grid grid-cols-1 md:grid-cols-12 gap-8 p-8 rounded-[var(--radius-lg)] border border-[var(--glass-border)] shadow-[var(--card-shadow)]">
          
          {/* Avatar side */}
          <div className="md:col-span-4 flex flex-col items-center justify-center border-r border-[var(--glass-border)] pr-0 md:pr-8 py-4">
            <div className="avatar-preview-container relative w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--accent-purple)] shadow-md group">
              <img
                src={profileInputs.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fa-solid fa-camera text-xl mb-1"></i>
                <span className="text-[10px] font-bold uppercase tracking-wider">Change photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mt-4">{profileInputs.name}</h3>
            <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mt-0.5">
              Marketing Director
            </p>
          </div>

          {/* Form details side */}
          <div className="md:col-span-8 space-y-6">
            <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--glass-border)] pb-3">
              Profile Configuration
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileInputs.name}
                    onChange={(e) => setProfileInputs({ ...profileInputs, name: e.target.value })}
                  />
                </div>

                <div className="form-group flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileInputs.email}
                    onChange={(e) => setProfileInputs({ ...profileInputs, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Company Name</label>
                  <input
                    type="text"
                    required
                    value={profileInputs.company}
                    onChange={(e) => setProfileInputs({ ...profileInputs, company: e.target.value })}
                  />
                </div>

                <div className="form-group flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Phone Number</label>
                  <input
                    type="text"
                    value={profileInputs.phone}
                    onChange={(e) => setProfileInputs({ ...profileInputs, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Industry / Niche</label>
                <select
                  className="glass-select bg-[rgba(255,255,255,0.6)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-[var(--radius-md)] p-3 text-xs font-semibold appearance-none outline-none cursor-pointer"
                  value={profileInputs.industry}
                  onChange={(e) => setProfileInputs({ ...profileInputs, industry: e.target.value })}
                >
                  <option value="Digital Agency / SaaS">Digital Agency / SaaS</option>
                  <option value="Fitness & Health">Fitness & Health</option>
                  <option value="E-Commerce / Fashion">E-Commerce / Fashion</option>
                  <option value="Food & Beverages">Food & Beverages</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div className="flex justify-end pt-4 border-t border-[var(--glass-border)]">
                <button type="submit" disabled={saving} className="primary-btn px-8">
                  {saving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i> Saving Settings...
                    </>
                  ) : (
                    "Save Credentials"
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
