import React from "react";

export default function Sidebar({ activePage, setActivePage, theme, toggleTheme }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "fa-chart-pie" },
    { id: "campaigns", label: "Campaigns", icon: "fa-rectangle-list" },
    { id: "content-preview", label: "Quick Generate", icon: "fa-bolt" },
    { id: "email-generator", label: "Email Creator", icon: "fa-paper-plane" },
    { id: "analytics", label: "Analytics", icon: "fa-chart-line" },
    { id: "history", label: "History Log", icon: "fa-history" },
    { id: "profile", label: "Settings", icon: "fa-user-gear" }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </span>
          <span className="logo-text">
            AdVantage<span className="logo-accent">AI</span>
          </span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`menu-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <a href={`#${item.id}`}>
                <i className={`fa-solid ${item.icon}`}></i>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === "light" ? (
            <>
              <i className="fa-solid fa-sun text-amber-500"></i>
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-moon text-indigo-400"></i>
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
