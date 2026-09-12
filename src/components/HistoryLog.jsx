import React, { useState } from "react";

export default function HistoryLog({ history }) {
  const [searchHistory, setSearchHistory] = useState("");
  const [filterHistoryCategory, setFilterHistoryCategory] = useState("all");

  // Completely filter out any Quick Generate logs as requested
  const filteredHistory = history.filter((h) => {
    if (h.action && h.action.toLowerCase().includes("quick generate")) {
      return false;
    }
    const matchesSearch =
      (h.action || "").toLowerCase().includes(searchHistory.toLowerCase()) ||
      (h.details || "").toLowerCase().includes(searchHistory.toLowerCase());
    const matchesCategory =
      filterHistoryCategory === "all" || h.category === filterHistoryCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case "campaign":
        return "cat-badge-campaign";
      case "ai-content":
        return "cat-badge-ai";
      case "post":
        return "cat-badge-post";
      case "profile":
        return "cat-badge-profile";
      default:
        return "cat-badge-campaign";
    }
  };

  return (
    <section id="page-history" className="app-page history-page-container">
      {/* FILTER & SEARCH CARD */}
      <div className="history-filter-card">
        <div className="history-filter-left">
          <div className="history-search-input-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search history log..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
            />
          </div>

          <select
            className="history-category-select"
            value={filterHistoryCategory}
            onChange={(e) => setFilterHistoryCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="campaign">Campaign Logs</option>
            <option value="ai-content">AI Copy Generation</option>
            <option value="post">Published Posts</option>
            <option value="profile">Profile Changes</option>
          </select>
        </div>

        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Showing <strong>{filteredHistory.length}</strong> log {filteredHistory.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      {/* FULL RESPONSIVE TABLE CARD */}
      <div className="history-table-card">
        <div className="history-table-scroll">
          <table className="history-full-table">
            <thead>
              <tr>
                <th className="th-timestamp">Timestamp</th>
                <th className="th-action">Action</th>
                <th className="th-category">Category</th>
                <th className="th-details">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "48px 24px", color: "var(--text-muted)" }}>
                    <i className="fa-regular fa-folder-open" style={{ fontSize: 28, marginBottom: 10, display: "block", opacity: 0.5 }}></i>
                    No history log entries found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((h) => (
                  <tr key={h._id || h.id}>
                    <td className="td-timestamp">
                      {h.createdAt ? new Date(h.createdAt).toLocaleString() : h.timestamp || "Just now"}
                    </td>
                    <td style={{ fontWeight: 700 }}>{h.action}</td>
                    <td>
                      <span className={`cat-badge ${getCategoryBadgeClass(h.category)}`}>
                        {h.category}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{h.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
