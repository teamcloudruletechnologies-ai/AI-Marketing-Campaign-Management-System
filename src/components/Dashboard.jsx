import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function Dashboard({ campaigns = [], history = [], setActivePage }) {
  const dashboardPerformanceCanvasRef = useRef(null);
  const dashboardChannelsCanvasRef = useRef(null);
  const chartsRef = useRef({});
  const [selectedMonth, setSelectedMonth] = useState("May 2025");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Dynamic values or defaults matching the design screenshot
  const totalCampaigns = campaigns.length > 0 ? campaigns.length : 4;
  const activeCampaignsCount = campaigns.filter((c) => c.status === "Active").length || 2;
  const avgRoi = campaigns.length
    ? Math.round(campaigns.reduce((acc, c) => acc + (c.roi || 0), 0) / campaigns.length)
    : 368;
  const totalAiGenerations = 146;

  // Static reference logs if empty or merge with dynamic logs
  const defaultLogs = [
    {
      id: "log-1",
      icon: "fa-database",
      iconBg: "blue",
      title: "Database Initialized",
      details: "Created and synced campaign database with MySQL.",
      time: "9/2/2026, 8:16:18 AM",
      status: "Success"
    },
    {
      id: "log-2",
      icon: "fa-rocket",
      iconBg: "purple",
      title: 'Campaign "Summer Fitness Kickoff" Synced',
      details: "Dynamic data binding established.",
      time: "9/2/2026, 8:16:18 AM",
      status: "Success"
    },
    {
      id: "log-3",
      icon: "fa-envelope",
      iconBg: "pink",
      title: "Email Campaign Sent",
      details: "2,345 recipients reached.",
      time: "9/2/2026, 8:12:03 AM",
      status: "Success"
    }
  ];

  // Top campaigns reference list matching image
  const defaultTopCampaigns = [
    {
      id: "camp-1",
      name: "SaaS Automations Launch",
      objective: "Sales / Conversion",
      budget: 12000,
      roi: 490,
      status: "Active",
      platform: "instagram"
    },
    {
      id: "camp-2",
      name: "Gourmet Coffee Launch",
      objective: "Brand Awareness",
      budget: 8500,
      roi: 420,
      status: "Active",
      platform: "facebook"
    },
    {
      id: "camp-3",
      name: "Spring Collection 2025",
      objective: "Lead Generation",
      budget: 6750,
      roi: 310,
      status: "Paused",
      platform: "linkedin"
    }
  ];

  // Channel distribution data
  const channelData = [
    { name: "Instagram", percent: 32, count: 47, color: "#8b5cf6", dotClass: "dot-instagram" },
    { name: "Facebook", percent: 28, count: 41, color: "#0ea5e9", dotClass: "dot-facebook" },
    { name: "LinkedIn", percent: 22, count: 32, color: "#059669", dotClass: "dot-linkedin" },
    { name: "Email", percent: 18, count: 26, color: "#ec4899", dotClass: "dot-email" }
  ];

  useEffect(() => {
    // Determine theme mode (light/dark) for chart colors
    const isLightMode = document.body.classList.contains("light-mode") || !document.body.classList.contains("dark-mode");
    const gridColor = isLightMode ? "rgba(226, 232, 240, 0.6)" : "rgba(255, 255, 255, 0.06)";
    const textColor = isLightMode ? "#64748b" : "#94a3b8";

    // 1. Monthly Campaign Performance (Line Chart)
    if (dashboardPerformanceCanvasRef.current) {
      if (chartsRef.current.dashboardPerformance) {
        chartsRef.current.dashboardPerformance.destroy();
      }

      const ctx = dashboardPerformanceCanvasRef.current.getContext("2d");

      // Clicks line gradient
      const clicksGradient = ctx.createLinearGradient(0, 0, 0, 300);
      clicksGradient.addColorStop(0, "rgba(14, 165, 233, 0.15)");
      clicksGradient.addColorStop(1, "rgba(14, 165, 233, 0.0)");

      // Conversions line gradient
      const convGradient = ctx.createLinearGradient(0, 0, 0, 300);
      convGradient.addColorStop(0, "rgba(139, 92, 246, 0.12)");
      convGradient.addColorStop(1, "rgba(139, 92, 246, 0.0)");

      // Exact data curves matching the image: Clicks (200 -> 900), Conversions (50 -> 170)
      const clicksData = [220, 290, 380, 530, 690, 890];
      const conversionsData = [45, 55, 78, 112, 138, 172];

      chartsRef.current.dashboardPerformance = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Clicks",
              data: clicksData,
              borderColor: "#0ea5e9",
              backgroundColor: clicksGradient,
              borderWidth: 2.5,
              pointBackgroundColor: "#0ea5e9",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 4.5,
              pointHoverRadius: 6.5,
              tension: 0.35,
              fill: true
            },
            {
              label: "Conversions",
              data: conversionsData,
              borderColor: "#8b5cf6",
              backgroundColor: convGradient,
              borderWidth: 2.5,
              pointBackgroundColor: "#8b5cf6",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 4.5,
              pointHoverRadius: 6.5,
              tension: 0.35,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false
          },
          plugins: {
            legend: {
              display: false // Using custom styled header legend
            },
            tooltip: {
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              padding: 10,
              borderRadius: 8,
              boxPadding: 6,
              usePointStyle: true
            }
          },
          scales: {
            x: {
              grid: {
                color: gridColor,
                drawBorder: false
              },
              ticks: {
                color: textColor,
                font: { size: 12, family: "'Plus Jakarta Sans', sans-serif" }
              }
            },
            y: {
              min: 0,
              max: 1000,
              grid: {
                color: gridColor,
                drawBorder: false
              },
              ticks: {
                stepSize: 200,
                color: textColor,
                font: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
                callback: function (value) {
                  return value === 1000 ? "1,000" : value;
                }
              }
            }
          }
        }
      });
    }

    // 2. Active Channels (Doughnut Chart)
    if (dashboardChannelsCanvasRef.current) {
      if (chartsRef.current.dashboardChannels) {
        chartsRef.current.dashboardChannels.destroy();
      }

      const ctxChannels = dashboardChannelsCanvasRef.current.getContext("2d");

      chartsRef.current.dashboardChannels = new Chart(ctxChannels, {
        type: "doughnut",
        data: {
          labels: ["Instagram", "Facebook", "LinkedIn", "Email"],
          datasets: [
            {
              data: [47, 41, 32, 26],
              backgroundColor: ["#8b5cf6", "#0ea5e9", "#059669", "#ec4899"],
              borderWidth: 2,
              borderColor: isLightMode ? "#ffffff" : "#0f172a",
              hoverOffset: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "74%",
          plugins: {
            legend: {
              display: false // Using custom styled side table
            },
            tooltip: {
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              padding: 10,
              borderRadius: 8
            }
          }
        }
      });
    }

    const currentCharts = chartsRef.current;
    return () => {
      if (currentCharts.dashboardPerformance) {
        currentCharts.dashboardPerformance.destroy();
      }
      if (currentCharts.dashboardChannels) {
        currentCharts.dashboardChannels.destroy();
      }
    };
  }, [campaigns, history]);

  return (
    <section id="page-dashboard" className="app-page dashboard-page-container">
      {/* -------------------------------------------------------------------
          1. TOP 4 METRIC CARDS
         ------------------------------------------------------------------- */}
      <div className="metrics-grid">
        {/* Metric 1: Total Campaigns (Blue) */}
        <div className="metric-card metric-card-blue">
          <div className="metric-icon-wrap icon-blue">
            <i className="fa-solid fa-bullhorn"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Total Campaigns</h3>
            <div className="metric-value">{totalCampaigns}</div>
            <div className="metric-subtext positive-green">
              <i className="fa-solid fa-arrow-up"></i> +14% this month
            </div>
          </div>
        </div>

        {/* Metric 2: Active Campaigns (Green) */}
        <div className="metric-card metric-card-green">
          <div className="metric-icon-wrap icon-green">
            <i className="fa-solid fa-user-group"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Active Campaigns</h3>
            <div className="metric-value">{activeCampaignsCount}</div>
            <div className="metric-subtext positive-green">
              <span className="live-dot">●</span> Running live
            </div>
          </div>
        </div>

        {/* Metric 3: AI/Post Assets (Purple) */}
        <div className="metric-card metric-card-purple">
          <div className="metric-icon-wrap icon-purple">
            <i className="fa-solid fa-arrow-trend-up"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">AI/Post Assets</h3>
            <div className="metric-value">{totalAiGenerations}</div>
            <div className="metric-subtext positive-green">
              <i className="fa-solid fa-arrow-up"></i> Saved ~45 hours
            </div>
          </div>
        </div>

        {/* Metric 4: Estimated ROI (Pink) */}
        <div className="metric-card metric-card-pink">
          <div className="metric-icon-wrap icon-pink">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Estimated ROI</h3>
            <div className="metric-value">{avgRoi}%</div>
            <div className="metric-subtext positive-green">
              <i className="fa-solid fa-arrow-up"></i> +25% vs last Q
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          2. MIDDLE CHARTS ROW
         ------------------------------------------------------------------- */}
      <div className="dashboard-charts-grid">
        {/* Left: Monthly Campaign Performance */}
        <div className="dashboard-card performance-chart-card">
          <div className="card-header-flex">
            <h3 className="card-title">Monthly Campaign Performance</h3>

            {/* Custom Legend (Clicks & Conversions) */}
            <div className="chart-legend-custom">
              <div className="legend-pill-item">
                <span className="legend-line-dot blue-dot"></span>
                <span className="legend-label">Clicks</span>
              </div>
              <div className="legend-pill-item">
                <span className="legend-line-dot purple-dot"></span>
                <span className="legend-label">Conversions</span>
              </div>
            </div>

            {/* Date filter dropdown */}
            <div className="date-select-container">
              <button
                type="button"
                className="date-pill-btn"
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              >
                <i className="fa-regular fa-calendar"></i>
                <span>{selectedMonth}</span>
                <i className="fa-solid fa-chevron-down"></i>
              </button>
              {dateDropdownOpen && (
                <div className="date-dropdown-menu">
                  {["May 2025", "Jun 2025", "Q2 2025", "Year 2025"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`date-option ${selectedMonth === m ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedMonth(m);
                        setDateDropdownOpen(false);
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="performance-chart-wrapper">
            <canvas ref={dashboardPerformanceCanvasRef}></canvas>
          </div>
        </div>

        {/* Right: Active Channels */}
        <div className="dashboard-card active-channels-card">
          <div className="card-header-flex">
            <h3 className="card-title">Active Channels</h3>
          </div>

          <div className="channels-body-layout">
            {/* Doughnut Chart with Center Assets Counter */}
            <div className="donut-chart-container">
              <div className="donut-canvas-wrap">
                <canvas ref={dashboardChannelsCanvasRef}></canvas>
                <div className="donut-center-info">
                  <span className="donut-number">146</span>
                  <span className="donut-label">Total Assets</span>
                </div>
              </div>
            </div>

            {/* Side breakdown list */}
            <div className="channels-legend-table">
              {channelData.map((ch) => (
                <div key={ch.name} className="channel-legend-row">
                  <div className="channel-col-name">
                    <span className={`channel-bullet ${ch.dotClass}`}>●</span>
                    <span className="channel-name-text">{ch.name}</span>
                  </div>
                  <div className="channel-col-percent">{ch.percent}%</div>
                  <div className="channel-col-count">{ch.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          3. BOTTOM TWO PANELS (Recent System Logs & Top Performing Campaigns)
         ------------------------------------------------------------------- */}
      <div className="dashboard-bottom-grid">
        {/* Left: Recent System Logs */}
        <div className="dashboard-card system-logs-card">
          <div className="card-header-flex">
            <h3 className="card-title">Recent System Logs</h3>
            <button
              type="button"
              className="action-link-btn"
              onClick={() => setActivePage("history")}
            >
              View all history <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div className="system-logs-list">
            {defaultLogs.map((log) => (
              <div key={log.id} className="log-item-row">
                <div className={`log-icon-circle bg-${log.iconBg}`}>
                  <i className={`fa-solid ${log.icon}`}></i>
                </div>
                <div className="log-text-content">
                  <p className="log-main-line">
                    <strong className="log-bold-title">{log.title}:</strong>{" "}
                    <span className="log-details-desc">{log.details}</span>
                  </p>
                  <span className="log-timestamp">{log.time}</span>
                </div>
                <div className="log-status-badge">
                  <span className="badge-success">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Top Performing Campaigns */}
        <div className="dashboard-card top-campaigns-card">
          <div className="card-header-flex">
            <h3 className="card-title">Top Performing Campaigns</h3>
            <button
              type="button"
              className="action-link-btn"
              onClick={() => setActivePage("campaigns")}
            >
              Manage Campaigns <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div className="top-campaigns-list">
            {defaultTopCampaigns.map((camp) => (
              <div key={camp.id} className="campaign-row-item">
                {/* Platform Icon */}
                <div className={`campaign-platform-icon platform-${camp.platform}`}>
                  {camp.platform === "instagram" && <i className="fa-brands fa-instagram"></i>}
                  {camp.platform === "facebook" && <i className="fa-brands fa-facebook-f"></i>}
                  {camp.platform === "linkedin" && <i className="fa-brands fa-linkedin-in"></i>}
                </div>

                {/* Campaign Meta */}
                <div className="campaign-meta-content">
                  <h4 className="campaign-title-text">{camp.name}</h4>
                  <p className="campaign-sub-text">
                    {camp.objective} &bull; ${camp.budget.toLocaleString()}
                  </p>
                </div>

                {/* Badges on Right */}
                <div className="campaign-badges-group">
                  <span
                    className={`roi-badge ${
                      camp.roi >= 400 ? "roi-high" : "roi-mid"
                    }`}
                  >
                    +{camp.roi}% ROI
                  </span>
                  <span
                    className={`campaign-status-pill ${
                      camp.status === "Active" ? "status-live" : "status-paused"
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
