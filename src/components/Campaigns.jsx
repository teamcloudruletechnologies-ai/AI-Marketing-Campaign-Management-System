import React, { useState } from "react";
import { api } from "../api";

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
  const [campaignFormInputs, setCampaignFormInputs] = useState({
    name: "",
    objective: "Lead Generation",
    status: "Active",
    budget: "",
    roi: "",
    startDate: "",
    endDate: "",
    channels: ["Instagram", "Facebook"]
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
      channels: ["Instagram", "Facebook"]
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
      channels: c.channels || []
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
    <section id="page-campaigns" className="app-page">
      <div className="filter-bar glass-card flex flex-wrap items-center justify-between gap-4 p-4 mb-6">
        <div className="filter-group flex items-center gap-4">
          <div className="search-box m-0">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Filter campaigns..."
              value={searchCampaigns}
              onChange={(e) => setSearchCampaigns(e.target.value)}
            />
          </div>

          <div className="select-wrapper relative">
            <select
              className="glass-select py-2 pl-4 pr-10 border border-[var(--glass-border)] bg-[rgba(255,255,255,0.6)] text-[var(--text-primary)] rounded-[var(--radius-md)] text-xs font-semibold appearance-none outline-none cursor-pointer"
              value={filterCampaignStatus}
              onChange={(e) => setFilterCampaignStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <button className="primary-btn" onClick={handleOpenCreateCampaign}>
          <i className="fa-solid fa-plus"></i> Create Campaign
        </button>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="empty-state glass-card p-12 text-center">
          <i className="fa-solid fa-folder-open text-5xl text-[var(--text-muted)] mb-4"></i>
          <h3 className="text-lg font-bold">No campaigns match your query</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Try adjusting your status filters or search spelling.
          </p>
        </div>
      ) : (
        <div className="campaigns-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="campaigns-cards-container">
          {filteredCampaigns.map((c) => (
            <div key={c._id || c.id} className="campaign-card glass-card relative p-6 border border-[var(--glass-border)] rounded-[var(--radius-lg)] shadow-[var(--card-shadow)] transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
              <div className="card-top flex items-start justify-between mb-4">
                <div className="card-top-left">
                  <h3 className="campaign-name text-base font-bold text-[var(--text-primary)]">{c.name}</h3>
                  <span className="objective text-xs font-medium text-[var(--text-muted)]">{c.objective}</span>
                </div>
                <span
                  className={`status-badge px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    c.status === "Active"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : c.status === "Paused"
                      ? "bg-amber-50 text-amber-600 border border-amber-100"
                      : "bg-slate-50 text-slate-600 border border-slate-100"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <div className="card-metrics grid grid-cols-2 gap-4 py-4 my-2 border-y border-[var(--glass-border)]">
                <div className="card-metric">
                  <span className="label text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Budget</span>
                  <span className="val text-lg font-bold text-[var(--text-primary)]">${c.budget.toLocaleString()}</span>
                </div>
                <div className="card-metric text-right">
                  <span className="label text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">Est. ROI</span>
                  <span className="val text-lg font-bold text-[var(--accent-purple)]">+{c.roi || 0}%</span>
                </div>
              </div>

              <div className="card-dates flex items-center justify-between text-xs text-[var(--text-muted)] font-medium my-3">
                <span>Start: {c.startDate}</span>
                <span>End: {c.endDate}</span>
              </div>

              <div className="card-channels flex items-center gap-1.5 mt-3 mb-2">
                {c.channels &&
                  c.channels.map((ch) => (
                    <span
                      key={ch}
                      className="channel-tag px-2.5 py-1 text-[10px] font-bold rounded-[var(--radius-sm)] bg-[rgba(99,102,241,0.06)] text-[var(--accent-purple)] border border-[rgba(99,102,241,0.06)]"
                    >
                      {ch}
                    </span>
                  ))}
              </div>

              <div className="card-actions flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[var(--glass-border)]">
                <button
                  className="card-action-btn edit-btn flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(14,165,233,0.08)] hover:bg-[rgba(14,165,233,0.15)] text-[var(--accent-blue)] border border-transparent transition-all"
                  aria-label="Edit Campaign"
                  onClick={() => handleOpenEditCampaign(c._id || c.id)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className="card-action-btn delete-btn flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(239,68,68,0.08)] hover:bg-[rgba(239,68,68,0.15)] text-[var(--accent-danger)] border border-transparent transition-all"
                  aria-label="Delete Campaign"
                  onClick={() => handleDeleteCampaign(c._id || c.id)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))}
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
    </section>
  );
}
