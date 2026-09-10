import React from "react";

export default function Sidebar({
  activePage,
  setActivePage,
  theme,
  toggleTheme,
  sidebarOpen,
  setSidebarOpen
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "fa-solid fa-house" },
    { id: "campaigns", label: "Campaigns", icon: "fa-solid fa-bullhorn" },
    { id: "content-preview", label: "Quick Generate", icon: "fa-solid fa-bolt" },
    { id: "email-generator", label: "Email Creator", icon: "fa-solid fa-envelope" },
    { id: "analytics", label: "Analytics", icon: "fa-solid fa-chart-simple" },
    { id: "history", label: "History Log", icon: "fa-solid fa-clock-rotate-left" },
    { id: "profile", label: "Settings", icon: "fa-solid fa-gear" }
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* SIDEBAR HEADER / BRAND LOGO */}
      <div className="sidebar-header">
        <div className="logo">
          {/* Folded ribbon geometric 'A' Brand Icon */}
          <div className="brand-logo-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="logo-svg"
            >
              <defs>
                <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <linearGradient id="logoGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <path
                d="M10 32L21 8C21.5 7 23 7 23.5 8L34 32C34.5 33 33.7 34 32.5 34H26.5C25.8 34 25.2 33.6 24.9 33L22.2 26.5H14.5L10 32Z"
                fill="url(#logoGrad1)"
              />
              <path
                d="M6 31.5L16.5 9.5C17.2 8 18.5 7.5 19.8 8.2L24.5 11L12.5 33.5C11.8 34.8 9.5 34.5 8.5 33.5L6 31.5Z"
                fill="url(#logoGrad2)"
                opacity="0.95"
              />
              <circle cx="20" cy="21" r="3.2" fill="#60a5fa" />
            </svg>
          </div>
          <div className="logo-text-group">
            <div className="logo-title">
              <span className="logo-name">AdVantage</span>
              <span className="logo-ai">AI</span>
            </div>
            <span className="logo-tagline">Smarter Campaigns. Better Results.</span>
          </div>
        </div>

        {/* Mobile close button */}
        {setSidebarOpen && (
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {/* SIDEBAR NAVIGATION MENU */}
      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <li key={item.id} className="menu-item-wrapper">
                <button
                  type="button"
                  className={`menu-item-btn ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setActivePage(item.id);
                  }}
                >
                  <span className="menu-icon-wrap">
                    <i className={item.icon}></i>
                  </span>
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* SIDEBAR FOOTER / THEME TOGGLE */}
      <div className="sidebar-footer">
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-pill"
          aria-label="Toggle Light / Dark Mode"
        >
          {theme === "light" ? (
            <>
              <span className="theme-icon-sun">
                <i className="fa-solid fa-sun"></i>
              </span>
              <span className="theme-text">Light Mode</span>
            </>
          ) : (
            <>
              <span className="theme-icon-moon">
                <i className="fa-solid fa-moon"></i>
              </span>
              <span className="theme-text">Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
