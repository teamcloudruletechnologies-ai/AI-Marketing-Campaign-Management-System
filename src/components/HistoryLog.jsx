import React, { useState } from "react";

export default function HistoryLog({ history }) {
  const [searchHistory, setSearchHistory] = useState("");
  const [filterHistoryCategory, setFilterHistoryCategory] = useState("all");

  const filteredHistory = history.filter((h) => {
    const matchesSearch =
      h.action.toLowerCase().includes(searchHistory.toLowerCase()) ||
      h.details.toLowerCase().includes(searchHistory.toLowerCase());
    const matchesCategory =
      filterHistoryCategory === "all" || h.category === filterHistoryCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="page-history" className="app-page">
      <div className="filter-bar glass-card flex flex-wrap items-center justify-between gap-4 p-4 mb-6">
        <div className="filter-group flex items-center gap-4">
          <div className="search-box m-0">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search history log..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
            />
          </div>

          <div className="select-wrapper relative">
            <select
              className="glass-select py-2 pl-4 pr-10 border border-[var(--glass-border)] bg-[rgba(255,255,255,0.6)] text-[var(--text-primary)] rounded-[var(--radius-md)] text-xs font-semibold appearance-none outline-none cursor-pointer"
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
        </div>
      </div>

      <div className="history-table-container glass-card overflow-hidden border border-[var(--glass-border)] rounded-[var(--radius-lg)] shadow-[var(--card-shadow)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[rgba(99,102,241,0.04)] border-b border-[var(--glass-border)] text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              <th className="p-4 pl-6">Timestamp</th>
              <th className="p-4">Action</th>
              <th className="p-4">Category</th>
              <th className="p-4 pr-6">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--glass-border)] text-xs">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-8 text-[var(--text-muted)]">
                  No log entries matching your criteria were found.
                </td>
              </tr>
            ) : (
              filteredHistory.map((h) => (
                <tr key={h._id || h.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-all">
                  <td className="p-4 pl-6 text-[var(--text-muted)] font-medium">
                    {h.createdAt ? new Date(h.createdAt).toLocaleString() : h.timestamp}
                  </td>
                  <td className="p-4 font-bold text-[var(--text-primary)]">{h.action}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                        h.category === "campaign"
                          ? "bg-sky-50 text-sky-600 border border-sky-100"
                          : h.category === "ai-content"
                          ? "bg-purple-50 text-purple-600 border border-purple-100"
                          : h.category === "post"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-slate-50 text-slate-600 border border-slate-100"
                      }`}
                    >
                      {h.category}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-[var(--text-secondary)]">{h.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
