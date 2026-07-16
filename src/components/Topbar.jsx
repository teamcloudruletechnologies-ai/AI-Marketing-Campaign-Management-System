import React from "react";
import { api } from "../api";

export default function Topbar({
  activePage,
  setActivePage,
  profile,
  notifications,
  setNotifications,
  onGlobalSearch,
  showToast
}) {
  const [notifDropdownOpen, setNotifDropdownOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const getPageInfo = () => {
    switch (activePage) {
      case "dashboard":
        return {
          title: "Dashboard Overview",
          subtitle: "Welcome back, marketer! Here's your campaign digest."
        };
      case "campaigns":
        return {
          title: "Campaign Management",
          subtitle: "Configure, edit, and track active marketing pipelines."
        };
      case "post-creator":
        return {
          title: "Post Creator & Feed",
          subtitle: "Draft and publish social media marketing posts dynamically."
        };
      case "email-generator":
        return {
          title: "AI Email Creator",
          subtitle: "Draft newsletters and promotional email campaigns."
        };
      case "analytics":
        return {
          title: "Analytics Dashboard",
          subtitle: "Deep dive into engagement rates, ROI metrics, and audience conversion."
        };
      case "history":
        return {
          title: "History Log",
          subtitle: "Browse generated AI copy and system configurations."
        };
      case "profile":
        return {
          title: "User Profile Settings",
          subtitle: "Manage account, company credentials, and tier subscriptions."
        };
      default:
        return {
          title: "Campaign Management System",
          subtitle: "AdVantage AI Admin Panel"
        };
    }
  };

  const info = getPageInfo();

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await api.markNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      showToast("All notifications marked read", "info");
    } catch (err) {
      console.error(err);
      showToast("Failed to mark notifications read", "error");
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      await api.markNotificationRead(notif._id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === notif._id ? { ...item, unread: false } : item))
      );
      setActivePage("history");
      setNotifDropdownOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    alert("Demo Session ended. All data is preserved dynamically in MongoDB!");
  };

  // Close dropdowns on window click
  React.useEffect(() => {
    const closeAll = () => {
      setNotifDropdownOpen(false);
      setProfileDropdownOpen(false);
    };
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 id="page-title">{info.title}</h1>
        <p className="page-subtitle" id="page-subtitle">
          {info.subtitle}
        </p>
      </div>

      <div className="topbar-right">
        {/* Global Search box */}
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            id="global-search"
            placeholder="Search campaigns..."
            onChange={(e) => onGlobalSearch(e.target.value)}
          />
        </div>

        {/* Notifications Dropdown */}
        <div
          className="notification-container"
          onClick={(e) => {
            e.stopPropagation();
            setNotifDropdownOpen(!notifDropdownOpen);
            setProfileDropdownOpen(false);
          }}
        >
          <button className="icon-btn" id="notification-btn" aria-label="Notifications">
            <i className="fa-solid fa-bell"></i>
            {unreadCount > 0 && (
              <span className="badge" id="notification-badge">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div
              className="notification-dropdown glass-card"
              id="notification-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dropdown-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button id="mark-all-read" onClick={handleMarkAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="dropdown-body" id="notification-list">
                {notifications.length === 0 ? (
                  <div className="empty-state" style={{ padding: 20 }}>
                    <p>No notifications.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id || n.id}
                      className={`notification-item ${n.unread ? "unread" : ""}`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div
                        className="notification-item-icon"
                        style={{
                          background:
                            n.type === "success"
                              ? "rgba(16, 185, 129, 0.15)"
                              : "rgba(14, 165, 233, 0.15)",
                          color:
                            n.type === "success"
                              ? "var(--accent-green)"
                              : "var(--accent-blue)"
                        }}
                      >
                        <i className={n.type === "success" ? "fa-solid fa-check" : "fa-solid fa-bell"}></i>
                      </div>
                      <div className="notification-item-content">
                        <p>
                          <strong>{n.title}</strong>: {n.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="dropdown-footer">
                <a
                  href="#history"
                  className="view-all-history"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage("history");
                    setNotifDropdownOpen(false);
                  }}
                >
                  View History Log
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div
          className="user-profile-menu"
          onClick={(e) => {
            e.stopPropagation();
            setProfileDropdownOpen(!profileDropdownOpen);
            setNotifDropdownOpen(false);
          }}
        >
          <div className="user-trigger" id="profile-dropdown-btn">
            <img src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} alt="User Avatar" className="avatar" id="header-avatar" />
            <div className="user-meta">
              <span className="user-name" id="header-username">
                {profile.name}
              </span>
              <span className="user-role">Marketing Director</span>
            </div>
            {/* Standard FontAwesome chevron-down arrow, styled beautifully */}
            <i className="fa-solid fa-chevron-down text-slate-500 text-[10px] ml-1"></i>
          </div>

          {profileDropdownOpen && (
            <div
              className="profile-dropdown glass-card"
              id="profile-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dropdown-user-header">
                <img src={profile.avatar} alt="User Avatar" className="avatar-large" id="dropdown-avatar" />
                <div className="dropdown-user-info">
                  <h4 id="dropdown-username">{profile.name}</h4>
                  <p id="dropdown-company">{profile.company}</p>
                </div>
              </div>
              <hr className="dropdown-divider" />
              <ul>
                <li>
                  <a
                    href="#profile"
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePage("profile");
                      setProfileDropdownOpen(false);
                    }}
                  >
                    <i className="fa-solid fa-user"></i> My Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#profile"
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePage("profile");
                      setProfileDropdownOpen(false);
                    }}
                  >
                    <i className="fa-solid fa-sliders"></i> Preferences
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleLogout} className="text-danger" id="dropdown-logout">
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
