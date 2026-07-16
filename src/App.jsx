import React, { useState, useEffect } from "react";
import { api } from "./api";

// Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import Campaigns from "./components/Campaigns";
import EmailCreator from "./components/EmailCreator";
import ContentPreview from "./components/ContentPreview";
import Analytics from "./components/Analytics";
import HistoryLog from "./components/HistoryLog";
import Settings from "./components/Settings";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [campaigns, setCampaigns] = useState([]);
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({
    name: "Sarah Jenkins",
    email: "sarah.j@apexglobal.com",
    company: "Apex Global Digital",
    phone: "",
    industry: "",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  });
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [searchCampaigns, setSearchCampaigns] = useState("");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Sync theme with body class and localStorage
  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch initial data from dynamic MongoDB API
  useEffect(() => {
    async function initData() {
      try {
        setGlobalLoading(true);
        const [camps, logs, userProfile, notifs] = await Promise.all([
          api.getCampaigns(),
          api.getHistory(),
          api.getProfile(),
          api.getNotifications()
        ]);
        
        setCampaigns(camps);
        setHistory(logs);
        setProfile(userProfile);
        setNotifications(notifs);
      } catch (err) {
        console.error("Initialization error:", err);
        showToast("Error loading data from MongoDB server", "error");
      } finally {
        setGlobalLoading(false);
      }
    }
    initData();
  }, []);

  // Toast trigger helper
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Push notification helper (syncs to MongoDB)
  const pushNotification = async (title, text, type = "info") => {
    try {
      const created = await api.createNotification({ title, text, type, unread: true });
      setNotifications((prev) => [created, ...prev.slice(0, 8)]);
      showToast(title, type);
    } catch (err) {
      console.error(err);
    }
  };

  // Add Log to history helper (syncs to MongoDB)
  const addHistoryLog = async (action, category, details) => {
    try {
      const created = await api.createHistory({ action, category, details });
      setHistory((prev) => [created, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGlobalSearch = (val) => {
    setActivePage("campaigns");
    setSearchCampaigns(val);
  };

  return (
    <div className="app-container">
      {/* GLOBAL LOADING SCREEN */}
      {globalLoading && (
        <div className="global-loader" id="global-loader" style={{ display: "flex" }}>
          <div className="loader-spinner"></div>
          <p>Connecting to Express & MongoDB Compass streams...</p>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} theme={theme} toggleTheme={toggleTheme} />

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        
        {/* GLOBAL HEADER */}
        <Topbar
          activePage={activePage}
          setActivePage={setActivePage}
          profile={profile}
          notifications={notifications}
          setNotifications={setNotifications}
          onGlobalSearch={handleGlobalSearch}
          showToast={showToast}
        />

        {/* COMPONENT ROUTER BODY */}
        <div className="content-body">
          {activePage === "dashboard" && (
            <Dashboard
              campaigns={campaigns}
              history={history}
              setActivePage={setActivePage}
            />
          )}

          {activePage === "campaigns" && (
            <Campaigns
              campaigns={campaigns}
              setCampaigns={setCampaigns}
              searchCampaigns={searchCampaigns}
              setSearchCampaigns={setSearchCampaigns}
              showToast={showToast}
              addHistoryLog={addHistoryLog}
              pushNotification={pushNotification}
            />
          )}

          {activePage === "content-preview" && (
            <ContentPreview
              showToast={showToast}
              addHistoryLog={addHistoryLog}
              pushNotification={pushNotification}
            />
          )}

          {activePage === "email-generator" && (
            <EmailCreator
              profile={profile}
              showToast={showToast}
              addHistoryLog={addHistoryLog}
              pushNotification={pushNotification}
            />
          )}

          {activePage === "analytics" && (
            <Analytics campaigns={campaigns} />
          )}

          {activePage === "history" && (
            <HistoryLog history={history} />
          )}

          {activePage === "profile" && (
            <Settings
              profile={profile}
              setProfile={setProfile}
              showToast={showToast}
              addHistoryLog={addHistoryLog}
              pushNotification={pushNotification}
            />
          )}
        </div>

      </main>

      {/* TOAST SYSTEM ALERTS */}
      <div className="toast-container" id="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-alert show ${
              t.type === "success" ? "toast-success" : t.type === "error" ? "toast-danger" : "toast-info"
            }`}
          >
            <i
              className={`fa-solid ${
                t.type === "success"
                  ? "fa-circle-check"
                  : t.type === "error"
                  ? "fa-circle-exclamation"
                  : "fa-circle-info"
              }`}
            ></i>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
