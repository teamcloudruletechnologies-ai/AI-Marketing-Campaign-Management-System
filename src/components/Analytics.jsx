import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Analytics({ campaigns }) {
  const analyticsEngagementCanvasRef = useRef(null);
  const analyticsRoiCanvasRef = useRef(null);
  const analyticsLeadSourceCanvasRef = useRef(null);
  const chartsRef = useRef({});

  useEffect(() => {
    const gridColor = "rgba(0, 0, 0, 0.05)";
    const textColor = "#475569";

    // 1. Engagement Vs Clicks (Line)
    if (analyticsEngagementCanvasRef.current) {
      if (chartsRef.current.analyticsEngagement) {
        chartsRef.current.analyticsEngagement.destroy();
      }

      chartsRef.current.analyticsEngagement = new Chart(
        analyticsEngagementCanvasRef.current.getContext("2d"),
        {
          type: "line",
          data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
            datasets: [
              {
                label: "Total Engagement",
                data: [12000, 19000, 15000, 28000, 32000, 42500],
                borderColor: "#8b5cf6",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.35
              },
              {
                label: "Clicks",
                data: [2500, 4800, 3100, 5400, 6800, 9200],
                borderColor: "#0ea5e9",
                backgroundColor: "rgba(14, 165, 233, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.35
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

    // 2. ROI Breakdown (Bar)
    if (analyticsRoiCanvasRef.current) {
      if (chartsRef.current.analyticsRoi) {
        chartsRef.current.analyticsRoi.destroy();
      }

      const roiLabels = campaigns.map((c) => c.name.split(" ")[0]);
      const roiValues = campaigns.map((c) => c.roi || 0);
      const budgetValues = campaigns.map((c) => (c.budget || 0) / 10);

      chartsRef.current.analyticsRoi = new Chart(
        analyticsRoiCanvasRef.current.getContext("2d"),
        {
          type: "bar",
          data: {
            labels: roiLabels.length > 0 ? roiLabels : ["Promo", "Launch", "Awareness"],
            datasets: [
              {
                label: "Budget ($ x10)",
                data: budgetValues.length > 0 ? budgetValues : [450, 1200, 300],
                backgroundColor: "#0ea5e9",
                borderRadius: 5
              },
              {
                label: "ROI %",
                data: roiValues.length > 0 ? roiValues : [380, 490, 180],
                backgroundColor: "#8b5cf6",
                borderRadius: 5
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

    // 3. Lead breakdown (PolarArea)
    if (analyticsLeadSourceCanvasRef.current) {
      if (chartsRef.current.analyticsLeadSource) {
        chartsRef.current.analyticsLeadSource.destroy();
      }

      chartsRef.current.analyticsLeadSource = new Chart(
        analyticsLeadSourceCanvasRef.current.getContext("2d"),
        {
          type: "polarArea",
          data: {
            labels: ["Google Ads", "Instagram Organic", "LinkedIn Paid", "Newsletter"],
            datasets: [
              {
                data: [35, 45, 12, 28],
                backgroundColor: [
                  "rgba(14, 165, 233, 0.7)",
                  "rgba(139, 92, 246, 0.7)",
                  "rgba(5, 150, 105, 0.7)",
                  "rgba(236, 72, 153, 0.7)"
                ],
                borderWidth: 1,
                borderColor: gridColor
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom", labels: { color: textColor } } },
            scales: { r: { grid: { color: gridColor }, ticks: { display: false } } }
          }
        }
      );
    }

    // Clean up
    return () => {
      if (chartsRef.current.analyticsEngagement) chartsRef.current.analyticsEngagement.destroy();
      if (chartsRef.current.analyticsRoi) chartsRef.current.analyticsRoi.destroy();
      if (chartsRef.current.analyticsLeadSource) chartsRef.current.analyticsLeadSource.destroy();
    };
  }, [campaigns]);

  return (
    <section id="page-analytics" className="app-page">
      <div className="analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Engagement Trend */}
        <div className="chart-card glass-card p-6 rounded-[var(--radius-lg)] border border-[var(--glass-border)] shadow-[var(--card-shadow)]">
          <div className="card-header mb-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">User Engagement Trends</h3>
          </div>
          <div className="chart-wrapper h-72">
            <canvas ref={analyticsEngagementCanvasRef}></canvas>
          </div>
        </div>

        {/* ROI Breakdown */}
        <div className="chart-card glass-card p-6 rounded-[var(--radius-lg)] border border-[var(--glass-border)] shadow-[var(--card-shadow)]">
          <div className="card-header mb-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Campaign Budget vs. ROI Breakdown</h3>
          </div>
          <div className="chart-wrapper h-72">
            <canvas ref={analyticsRoiCanvasRef}></canvas>
          </div>
        </div>

        {/* Lead Source Distribution */}
        <div className="chart-card glass-card p-6 rounded-[var(--radius-lg)] border border-[var(--glass-border)] shadow-[var(--card-shadow)] lg:col-span-2 max-w-xl mx-auto w-full">
          <div className="card-header mb-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Acquisition Channels Distribution</h3>
          </div>
          <div className="chart-wrapper h-80">
            <canvas ref={analyticsLeadSourceCanvasRef}></canvas>
          </div>
        </div>

      </div>
    </section>
  );
}
