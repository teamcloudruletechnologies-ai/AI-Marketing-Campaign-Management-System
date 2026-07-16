import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Dashboard({ campaigns, history, setActivePage }) {
  const dashboardPerformanceCanvasRef = useRef(null);
  const dashboardChannelsCanvasRef = useRef(null);
  const chartsRef = useRef({});

  // Calculations
  const totalCampaigns = campaigns.length;
  const activeCampaignsCount = campaigns.filter((c) => c.status === "Active").length;
  const avgRoi = campaigns.length
    ? Math.round(campaigns.reduce((acc, c) => acc + (c.roi || 0), 0) / campaigns.length)
    : 380;
  const totalAiGenerations = 140 + history.filter((h) => h.category === "ai-content" || h.category === "post").length;

  const dashboardRecentLogs = [...history]
    .sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp))
    .reverse()
    .slice(0, 5);

  const dashboardHighlightCampaigns = [...campaigns].sort((a, b) => b.roi - a.roi).slice(0, 4);

  useEffect(() => {
    const gridColor = "rgba(0, 0, 0, 0.05)";
    const textColor = "#475569";

    // 1. Performance Chart (Line)
    if (dashboardPerformanceCanvasRef.current) {
      if (chartsRef.current.dashboardPerformance) {
        chartsRef.current.dashboardPerformance.destroy();
      }

      let performanceData = [3500, 4200, 5100, 6800, 8900, 11500];
      if (campaigns.length > 4) {
        performanceData = [4500, 5200, 6300, 8500, 10200, 14200];
      }

      chartsRef.current.dashboardPerformance = new Chart(
        dashboardPerformanceCanvasRef.current.getContext("2d"),
        {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Clicks",
                data: performanceData.map((d) => Math.round(d * 0.08)),
                borderColor: "#0ea5e9",
                backgroundColor: "rgba(14, 165, 233, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4
              },
              {
                label: "Conversions",
                data: performanceData.map((d) => Math.round(d * 0.015)),
                borderColor: "#8b5cf6",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor } } },
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        }
      );
    }

    // 2. Channels Distribution (Doughnut)
    if (dashboardChannelsCanvasRef.current) {
      if (chartsRef.current.dashboardChannels) {
        chartsRef.current.dashboardChannels.destroy();
      }

      const channelCounts = { Instagram: 0, Facebook: 0, LinkedIn: 0, Email: 0 };
      campaigns.forEach((c) => {
        if (c.status === "Active" && c.channels) {
          c.channels.forEach((ch) => {
            if (channelCounts[ch] !== undefined) channelCounts[ch]++;
          });
        }
      });

      const channelLabels = Object.keys(channelCounts);
      let channelValues = Object.values(channelCounts);
      if (channelValues.reduce((a, b) => a + b, 0) === 0) {
        channelValues = [3, 2, 1, 2];
      }

      chartsRef.current.dashboardChannels = new Chart(
        dashboardChannelsCanvasRef.current.getContext("2d"),
        {
          type: "doughnut",
          data: {
            labels: channelLabels,
            datasets: [
              {
                data: channelValues,
                backgroundColor: ["#8b5cf6", "#0ea5e9", "#059669", "#ec4899"],
                borderWidth: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: textColor, padding: 15 }
              }
            },
            cutout: "70%"
          }
        }
      );
    }

    // Clean up
    return () => {
      if (chartsRef.current.dashboardPerformance) chartsRef.current.dashboardPerformance.destroy();
      if (chartsRef.current.dashboardChannels) chartsRef.current.dashboardChannels.destroy();
    };
  }, [campaigns, history]);

  return (
    <section id="page-dashboard" className="app-page">
      <div className="metrics-grid">
        {/* Metric 1 */}
        <div className="metric-card glass-card">
          <div className="metric-icon purple-gradient">
            <i className="fa-solid fa-bullhorn"></i>
          </div>
          <div className="metric-info">
            <h3>Total Campaigns</h3>
            <p className="metric-value">{totalCampaigns}</p>
            <span className="metric-change positive">
              <i className="fa-solid fa-arrow-trend-up"></i> +14% this month
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="metric-card glass-card">
          <div className="metric-icon blue-gradient">
            <i className="fa-solid fa-circle-play"></i>
          </div>
          <div className="metric-info">
            <h3>Active Campaigns</h3>
            <p className="metric-value">{activeCampaignsCount}</p>
            <span className="metric-change positive">
              <i className="fa-solid fa-spinner fa-spin"></i> Running live
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="metric-card glass-card">
          <div className="metric-icon green-gradient">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div className="metric-info">
            <h3>AI/Post Assets</h3>
            <p className="metric-value">{totalAiGenerations}</p>
            <span className="metric-change positive">
              <i className="fa-solid fa-bolt"></i> Saved ~45 hours
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="metric-card glass-card">
          <div className="metric-icon pink-gradient">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <div className="metric-info">
            <h3>Estimated ROI</h3>
            <p className="metric-value">{avgRoi}%</p>
            <span className="metric-change positive">
              <i className="fa-solid fa-arrow-trend-up"></i> +25% vs last Q
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Main Performance line graph */}
        <div className="chart-card glass-card span-two">
          <div className="card-header">
            <h3>Monthly Campaign Performance</h3>
          </div>
          <div className="chart-wrapper">
            <canvas ref={dashboardPerformanceCanvasRef}></canvas>
          </div>
        </div>

        {/* Doughnut channel graph */}
        <div className="chart-card glass-card">
          <div className="card-header">
            <h3>Active Channels</h3>
          </div>
          <div className="chart-wrapper small-chart">
            <canvas ref={dashboardChannelsCanvasRef}></canvas>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-two">
        {/* System Logs Timeline */}
        <div className="dashboard-panel glass-card">
          <div className="card-header">
            <h3>Recent System Logs</h3>
            <a
              href="#history"
              className="text-link"
              onClick={(e) => {
                e.preventDefault();
                setActivePage("history");
              }}
            >
              View all history
            </a>
          </div>
          <div className="activity-timeline" id="recent-activities">
            {dashboardRecentLogs.length === 0 ? (
              <div className="empty-state" style={{ padding: 10 }}>
                <p>No recent activity logs.</p>
              </div>
            ) : (
              dashboardRecentLogs.map((log) => (
                <div key={log._id || log.id} className="timeline-item">
                  <div className="timeline-icon">
                    {log.category === "campaign" && <i className="fa-solid fa-bullhorn"></i>}
                    {log.category === "ai-content" && <i className="fa-solid fa-robot"></i>}
                    {log.category === "post" && <i className="fa-solid fa-paperclip"></i>}
                    {log.category === "profile" && <i className="fa-solid fa-user-pen"></i>}
                  </div>
                  <div className="timeline-content">
                    <p>
                      <strong>{log.action}</strong>: {log.details}
                    </p>
                    <span className="timeline-time">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString()
                        : log.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top campaigns roster */}
        <div className="dashboard-panel glass-card">
          <div className="card-header">
            <h3>Top Performing Campaigns</h3>
            <a
              href="#campaigns"
              className="text-link"
              onClick={(e) => {
                e.preventDefault();
                setActivePage("campaigns");
              }}
            >
              Manage Campaigns
            </a>
          </div>
          <div className="campaign-highlights-list" id="campaign-highlights">
            {dashboardHighlightCampaigns.length === 0 ? (
              <div className="empty-state" style={{ padding: 10 }}>
                <p>No campaigns set.</p>
              </div>
            ) : (
              dashboardHighlightCampaigns.map((c) => (
                <div key={c._id || c.id} className="highlight-card">
                  <div className="highlight-left">
                    <span className="highlight-name">{c.name}</span>
                    <span className="highlight-meta">
                      {c.objective} &bull; ${c.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="highlight-right">
                    <span className="highlight-roi">+{c.roi}% ROI</span>
                    <span
                      className={`highlight-status ${
                        c.status === "Active"
                          ? "status-active"
                          : c.status === "Paused"
                          ? "status-paused"
                          : "status-completed"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
