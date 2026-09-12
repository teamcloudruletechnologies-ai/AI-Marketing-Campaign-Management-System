import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

function getCampaignPhoto(c) {
  if (c.imageUrl && typeof c.imageUrl === "string" && c.imageUrl.trim()) {
    return c.imageUrl;
  }
  if (c.content?.imageUrl && typeof c.content.imageUrl === "string" && c.content.imageUrl.trim()) {
    return c.content.imageUrl;
  }
  const text = `${c.name || ""} ${c.objective || ""}`.toLowerCase();
  if (/\b(ac|air conditioner|cooling|appliance)\b/i.test(text)) {
    return "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80";
  }
  if (/\b(fitness|gym|workout|health)\b/i.test(text)) {
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
  }
  if (/\b(saas|tech|automation|ai|software|data)\b/i.test(text)) {
    return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80";
  }
  if (/\b(coffee|cafe|gourmet|food|drink)\b/i.test(text)) {
    return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80";
  }
  if (/\b(eco|green|nature|sustainab)\b/i.test(text)) {
    return "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80";
  }
  if (/\b(fashion|cloth|wear|luxury)\b/i.test(text)) {
    return "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80";
  }
  return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
}

export default function Campaigns({
  campaigns,
  setCampaigns,
  searchCampaigns,
  setSearchCampaigns,
  showToast,
  addHistoryLog,
  pushNotification
}) {
  const [filterCampaignStatus, setFilterCampaignStatus] = useState("all");
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [campaignEditId, setCampaignEditId] = useState(null);
  const [selectedCampaignPhoto, setSelectedCampaignPhoto] = useState(null);
  const [campaignFormInputs, setCampaignFormInputs] = useState({
    name: "",
    objective: "Lead Generation",
    status: "Active",
    budget: "",
    roi: "",
    startDate: "",
    endDate: "",
    channels: ["Instagram", "Facebook"],
    imageUrl: ""
  });

  const handleOpenCreateCampaign = () => {
    setCampaignEditId(null);
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    const pad = (n) => n.toString().padStart(2, "0");

    setCampaignFormInputs({
      name: "",
      objective: "Lead Generation",
      status: "Active",
      budget: "",
      roi: "",
      startDate: `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`,
      endDate: `${nextMonth.getFullYear()}-${pad(nextMonth.getMonth() + 1)}-${pad(nextMonth.getDate())}`,
      channels: ["Instagram", "Facebook"],
      imageUrl: ""
    });
    setCampaignModalOpen(true);
  };

  const handleOpenEditCampaign = (id) => {
    const c = campaigns.find((camp) => camp._id === id || camp.id === id);
    if (!c) return;
    setCampaignEditId(id);
    setCampaignFormInputs({
      name: c.name,
      objective: c.objective,
      status: c.status,
      budget: c.budget,
      roi: c.roi || "",
      startDate: c.startDate,
      endDate: c.endDate,
      channels: c.channels || [],
      imageUrl: c.imageUrl || c.content?.imageUrl || ""
    });
    setCampaignModalOpen(true);
  };

  const handleDeleteCampaign = async (id) => {
    if (confirm("Are you sure you want to delete this campaign? This action is permanent.")) {
      try {
        const camp = campaigns.find((c) => c._id === id || c.id === id);
        await api.deleteCampaign(id);
        setCampaigns((prev) => prev.filter((c) => c._id !== id && c.id !== id));
        addHistoryLog(
          `Campaign '${camp.name}' Deleted`,
          "campaign",
          `Removed campaign configuration with budget $${camp.budget.toLocaleString()}`
        );
        pushNotification(
          "Campaign Removed",
          `Campaign '${camp.name}' has been successfully deleted from records.`,
          "error"
        );
      } catch (err) {
        console.error(err);
        showToast("Failed to delete campaign", "error");
      }
    }
  };

  const handleCampaignFormSubmit = async (e) => {
    e.preventDefault();
    if (campaignFormInputs.channels.length === 0) {
      alert("Please select at least one social media channel.");
      return;
    }

    const budgetVal = parseFloat(campaignFormInputs.budget) || 0;
    const roiVal = parseInt(campaignFormInputs.roi) || 0;
    const campaignData = {
      ...campaignFormInputs,
      budget: budgetVal,
      roi: roiVal
    };

    try {
      if (campaignEditId) {
        // Edit API Call
        const updated = await api.updateCampaign(campaignEditId, campaignData);
        setCampaigns((prev) =>
          prev.map((c) => (c._id === campaignEditId || c.id === campaignEditId ? updated : c))
        );
        addHistoryLog(
          "Campaign Settings Modified",
          "campaign",
          `Updated '${campaignFormInputs.name}' campaign details.`
        );
        pushNotification(
          "Campaign Updated",
          `Campaign '${campaignFormInputs.name}' modifications saved successfully.`,
          "success"
        );
      } else {
        // Create API Call
        const created = await api.createCampaign(campaignData);
        setCampaigns((prev) => [created, ...prev]);
        addHistoryLog(
          `Campaign '${campaignFormInputs.name}' Created`,
          "campaign",
          `Initialized objectives for ${campaignFormInputs.channels.join(", ")} channels.`
        );
        pushNotification(
          "New Campaign Deployed",
          `Campaign '${campaignFormInputs.name}' has been compiled and is now running.`,
          "success"
        );
      }
      setCampaignModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to save campaign", "error");
    }
  };

  const toggleCampaignChannelCheckbox = (ch) => {
    setCampaignFormInputs((prev) => {
      const exists = prev.channels.includes(ch);
      return {
        ...prev,
        channels: exists ? prev.channels.filter((c) => c !== ch) : [...prev.channels, ch]
      };
    });
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchCampaigns.toLowerCase()) ||
      c.objective.toLowerCase().includes(searchCampaigns.toLowerCase());
    const matchesStatus = filterCampaignStatus === "all" || c.status === filterCampaignStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <section id="page-campaigns" className="app-page campaigns-page">
      {/* 1. FILTER & ACTION BAR */}
      <div className="campaigns-filter-bar">
        <div className="filter-controls-left">
          {/* Search Box */}
          <div className="search-box campaign-search-input">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Filter campaigns..."
              value={searchCampaigns}
              onChange={(e) => setSearchCampaigns(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <div className="status-select-wrap">
            <select
              className="status-dropdown-select"
              value={filterCampaignStatus}
              onChange={(e) => setFilterCampaignStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
            <i className="fa-solid fa-chevron-down select-arrow-icon"></i>
          </div>
        </div>

        {/* Create Campaign Button */}
        <button
          type="button"
          className="create-campaign-btn"
          onClick={handleOpenCreateCampaign}
        >
          <i className="fa-solid fa-plus"></i>
          <span>Create Campaign</span>
        </button>
      </div>

      {/* 2. CAMPAIGNS CARDS GRID */}
      {filteredCampaigns.length === 0 ? (
        <div className="empty-state-card">
          <i className="fa-solid fa-folder-open empty-icon"></i>
          <h3 className="empty-title">No campaigns match your query</h3>
          <p className="empty-desc">
            Try adjusting your status filters or search keywords.
          </p>
        </div>
      ) : (
        <div className="campaigns-cards-grid" id="campaigns-cards-container">
          {filteredCampaigns.map((c) => {
            const photoUrl = getCampaignPhoto(c);
            return (
              <div key={c._id || c.id} className="campaign-modern-card">
                {/* 1. Campaign Photo Media Banner */}
                <div
                  className="camp-card-media-banner"
                  onClick={() => setSelectedCampaignPhoto({ url: photoUrl, title: c.name })}
                  title="Click to view full photo"
                >
                  <img
                    src={photoUrl}
                    alt={c.name}
                    className="camp-card-media-img"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="camp-card-media-overlay">
                    <span className="camp-card-view-badge">
                      <i className="fa-solid fa-expand mr-1"></i> View Photo
                    </span>
                  </div>
                  <span
                    className={`camp-media-status-badge ${
                      c.status === "Active"
                        ? "status-badge-active"
                        : c.status === "Paused"
                        ? "status-badge-paused"
                        : "status-badge-completed"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                {/* 2. Card Header */}
                <div className="camp-card-header">
                  <div className="camp-info">
                    <h3 className="camp-title">{c.name}</h3>
                    <span className="camp-objective">{c.objective}</span>
                  </div>
                </div>

              {/* Card Metrics (Budget & Est. ROI) */}
              <div className="camp-metrics-row">
                <div className="camp-metric-col">
                  <span className="camp-metric-label">Budget</span>
                  <span className="camp-metric-val budget-val">
                    ${c.budget ? c.budget.toLocaleString() : "0"}
                  </span>
                </div>
                <div className="camp-metric-col text-right">
                  <span className="camp-metric-label">Est. ROI</span>
                  <span className="camp-metric-val roi-val">
                    +{c.roi || 0}%
                  </span>
                </div>
              </div>

              {/* Schedule Dates */}
              <div className="camp-dates-row">
                <i className="fa-regular fa-calendar camp-date-icon"></i>
                <span className="camp-date-text">
                  {c.startDate || "Active"} {c.endDate ? `→ ${c.endDate}` : "• Ongoing"}
                </span>
              </div>

              {/* Channels & Actions Footer */}
              <div className="camp-footer-row">
                <div className="camp-channels-group">
                  {c.channels &&
                    c.channels.map((ch) => (
                      <span key={ch} className="camp-channel-pill">
                        {ch}
                      </span>
                    ))}
                </div>

                <div className="camp-actions-group">
                  <Link
                    to="/quick-generate"
                    className="camp-action-btn generate-action"
                    aria-label="Generate AI Content"
                    title="Generate AI Content for Campaign"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                  </Link>
                  <button
                    type="button"
                    className="camp-action-btn edit-action"
                    aria-label="Edit Campaign"
                    onClick={() => handleOpenEditCampaign(c._id || c.id)}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    type="button"
                    className="camp-action-btn delete-action"
                    aria-label="Delete Campaign"
                    onClick={() => handleDeleteCampaign(c._id || c.id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Campaigns Modal Dialog */}
      {campaignModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="modal-content glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 rounded-[var(--radius-lg)] shadow-[var(--dropdown-shadow)] border border-[var(--glass-border)] relative">
            <button
              className="close-modal absolute top-5 right-5 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
              onClick={() => setCampaignModalOpen(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]" id="modal-title">
              {campaignEditId ? "Modify Campaign Details" : "Deploy New Marketing Pipeline"}
            </h2>

            <form id="campaign-form" onSubmit={handleCampaignFormSubmit} className="space-y-4">
              <div className="form-group flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Black Friday Promotion"
                  value={campaignFormInputs.name}
                  onChange={(e) => setCampaignFormInputs({ ...campaignFormInputs, name: e.target.value })}
                />
              </div>

              <div className="form-group flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                  Campaign Photo / Image URL <span className="text-[10px] text-[var(--text-muted)] font-normal">(Optional, auto-detected if empty)</span>
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/... or data:image/..."
                  value={campaignFormInputs.imageUrl}
                  onChange={(e) => setCampaignFormInputs({ ...campaignFormInputs, imageUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Objective</label>
                  <select
                    className="glass-select bg-[rgba(255,255,255,0.6)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-[var(--radius-md)] p-3 text-xs font-semibold appearance-none outline-none cursor-pointer"
                    value={campaignFormInputs.objective}
                    onChange={(e) => setCampaignFormInputs({ ...campaignFormInputs, objective: e.target.value })}
                  >
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Sales / Conversion">Sales / Conversion</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                  </select>
                </div>

                <div className="form-group flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Status</label>
                  <select
                    className="glass-select bg-[rgba(255,255,255,0.6)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-[var(--radius-md)] p-3 text-xs font-semibold appearance-none outline-none cursor-pointer"
                    value={campaignFormInputs.status}
                    onChange={(e) => setCampaignFormInputs({ ...campaignFormInputs, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Budget ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5000"
                    value={campaignFormInputs.budget}
                    onChange={(e) => setCampaignFormInputs({ ...campaignFormInputs, budget: e.target.value })}
                  />
                </div>

                <div className="form-group flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Estimated ROI %</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 250"
                    value={campaignFormInputs.roi}
                    onChange={(e) => setCampaignFormInputs({ ...campaignFormInputs, roi: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Start Date</label>
                  <input
                    type="date"
                    required
                    value={campaignFormInputs.startDate}
                    onChange={(e) => setCampaignFormInputs({ ...campaignFormInputs, startDate: e.target.value })}
                  />
                </div>

                <div className="form-group flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">End Date</label>
                  <input
                    type="date"
                    required
                    value={campaignFormInputs.endDate}
                    onChange={(e) => setCampaignFormInputs({ ...campaignFormInputs, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Target Channels</label>
                <div className="channels-checkboxes grid grid-cols-2 gap-3">
                  {["Instagram", "Facebook", "LinkedIn", "Email"].map((ch) => (
                    <label key={ch} className="channel-check flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={campaignFormInputs.channels.includes(ch)}
                        onChange={() => toggleCampaignChannelCheckbox(ch)}
                        className="w-4 h-4 rounded text-[var(--accent-purple)] border-[var(--glass-border)] focus:ring-[var(--accent-purple)]"
                      />
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions flex items-center justify-end gap-3 pt-4 border-t border-[var(--glass-border)]">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-[var(--radius-md)] text-xs font-bold border border-[var(--glass-border)] hover:bg-[rgba(0,0,0,0.03)] text-[var(--text-secondary)] transition-all"
                  onClick={() => setCampaignModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {campaignEditId ? "Save Modifications" : "Launch Active Stream"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {selectedCampaignPhoto && (
        <div className="image-lightbox-overlay" onClick={() => setSelectedCampaignPhoto(null)}>
          <div className="image-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="image-lightbox-header">
              <div className="image-lightbox-title">
                <i className="fa-solid fa-image text-[var(--accent-blue)]"></i>
                <span>{selectedCampaignPhoto.title}</span>
              </div>
              <div className="image-lightbox-actions">
                <a
                  href={selectedCampaignPhoto.url}
                  target="_blank"
                  rel="noreferrer"
                  className="image-lightbox-btn"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i> Open Full HD
                </a>
                <button
                  type="button"
                  className="image-lightbox-close"
                  onClick={() => setSelectedCampaignPhoto(null)}
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            <div className="image-lightbox-img-wrap">
              <img src={selectedCampaignPhoto.url} alt={selectedCampaignPhoto.title} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
