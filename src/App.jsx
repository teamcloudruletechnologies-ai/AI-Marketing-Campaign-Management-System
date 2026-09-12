import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { api } from "./api";

// Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import Campaigns from "./components/Campaigns";
import ContentPreview from "./components/ContentPreview";
import Analytics from "./components/Analytics";
import HistoryLog from "./components/HistoryLog";
import Settings from "./components/Settings";
import LoginPage from "./components/LoginPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("loggedIn") === "true");
  const navigate = useNavigate();
  const location = useLocation();

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
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

  const [posts, setPosts] = useState([]);

  // Map path to activePage id
  const pathToPage = {
    "/": "dashboard",
    "/dashboard": "dashboard",
    "/campaigns": "campaigns",
    "/quick-generate": "content-preview",
    "/content-preview": "content-preview",
    "/analytics": "analytics",
    "/history": "history",
    "/settings": "profile",
    "/profile": "profile",
  };

  const pageToPath = {
    dashboard: "/dashboard",
    campaigns: "/campaigns",
    "content-preview": "/quick-generate",
    analytics: "/analytics",
    history: "/history",
    profile: "/settings",
  };

  const activePage = pathToPage[location.pathname] || "dashboard";

  const setActivePage = (page) => {
    const target = pageToPath[page] || `/${page}`;
    navigate(target);
  };

  // Fetch initial data from dynamic MongoDB API
  useEffect(() => {
    if (!isLoggedIn) return;
    async function initData() {
      try {
        setGlobalLoading(true);
        const [camps, logs, userProfile, notifs, postList] = await Promise.all([
          api.getCampaigns(),
          api.getHistory(),
          api.getProfile(),
          api.getNotifications(),
          api.getPosts().catch(() => [])
        ]);
        
        setCampaigns(camps);
        setHistory(logs);
        setProfile(userProfile);
        setNotifications(notifs);
        setPosts(postList || []);
      } catch (err) {
        console.error("Initialization error:", err);
        showToast("Error loading data from MongoDB server", "error");
      } finally {
        setGlobalLoading(false);
      }
    }
    initData();
  }, [isLoggedIn]);

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
    setSearchCampaigns(val);
    if (location.pathname !== "/campaigns") {
      navigate("/campaigns");
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="app-container">
      {/* LOGIN GATE */}
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <>
          {/* GLOBAL LOADING SCREEN */}
          {globalLoading && (
            <div className="global-loader" id="global-loader" style={{ display: "flex" }}>
              <div className="loader-spinner"></div>
              <p>Connecting to backend...</p>
            </div>
          )}

          {/* MOBILE SIDEBAR BACKDROP */}
          {sidebarOpen && (
            <div
              className="sidebar-backdrop"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* SIDEBAR NAVIGATION */}
          <Sidebar
            activePage={activePage}
            setActivePage={(page) => {
              setActivePage(page);
              setSidebarOpen(false);
            }}
            theme={theme}
            toggleTheme={toggleTheme}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onLogout={handleLogout}
          />

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
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onLogout={handleLogout}
            />

            {/* ROUTER CONTENT BODY */}
            <div className="content-body">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/dashboard"
                  element={
                    <Dashboard
                      campaigns={campaigns}
                      history={history}
                      posts={posts}
                      setActivePage={setActivePage}
                    />
                  }
                />
                <Route
                  path="/campaigns"
                  element={
                    <Campaigns
                      campaigns={campaigns}
                      setCampaigns={setCampaigns}
                      searchCampaigns={searchCampaigns}
                      setSearchCampaigns={setSearchCampaigns}
                      showToast={showToast}
                      addHistoryLog={addHistoryLog}
                      pushNotification={pushNotification}
                    />
                  }
                />
                <Route
                  path="/quick-generate"
                  element={
                    <ContentPreview
                      showToast={showToast}
                      addHistoryLog={addHistoryLog}
                      pushNotification={pushNotification}
                      campaigns={campaigns}
                      setCampaigns={setCampaigns}
                      setPosts={setPosts}
                    />
                  }
                />
                <Route
                  path="/content-preview"
                  element={<Navigate to="/quick-generate" replace />}
                />
                <Route
                  path="/analytics"
                  element={<Analytics campaigns={campaigns} posts={posts} />}
                />
                <Route
                  path="/history"
                  element={<HistoryLog history={history} />}
                />
                <Route
                  path="/settings"
                  element={
                    <Settings
                      profile={profile}
                      setProfile={setProfile}
                      showToast={showToast}
                      addHistoryLog={addHistoryLog}
                      pushNotification={pushNotification}
                    />
                  }
                />
                <Route
                  path="/profile"
                  element={<Navigate to="/settings" replace />}
                />
                <Route
                  path="/login"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
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
        </>
      )}
    </div>
  );
}

