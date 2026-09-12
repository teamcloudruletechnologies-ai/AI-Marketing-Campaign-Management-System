import React, { useState } from "react";
import { api } from "../api";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await api.login({ email, password });
      if (result.success) {
        sessionStorage.setItem("loggedIn", "true");
        onLogin();
      } else {
        setError(result.error || "Invalid credentials.");
      }
    } catch (err) {
      setError("Server error. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand Logo */}
        <div className="login-brand">
          <div className="brand-logo-icon" style={{ width: 44, height: 44 }}>
            <svg width="44" height="44" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lgLogin1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <linearGradient id="lgLogin2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <path d="M10 32L21 8C21.5 7 23 7 23.5 8L34 32C34.5 33 33.7 34 32.5 34H26.5C25.8 34 25.2 33.6 24.9 33L22.2 26.5H14.5L10 32Z" fill="url(#lgLogin1)" />
              <path d="M6 31.5L16.5 9.5C17.2 8 18.5 7.5 19.8 8.2L24.5 11L12.5 33.5C11.8 34.8 9.5 34.5 8.5 33.5L6 31.5Z" fill="url(#lgLogin2)" opacity="0.95" />
              <circle cx="20" cy="21" r="3.2" fill="#60a5fa" />
            </svg>
          </div>
          <div>
            <div className="login-brand-name">
              <span style={{ color: "var(--accent-blue)", fontWeight: 800, fontSize: 22 }}>AdVantage</span>
              <span style={{ color: "var(--accent-purple)", fontWeight: 800, fontSize: 22, marginLeft: 4 }}>AI</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Smarter Campaigns. Better Results.</p>
          </div>
        </div>

        <h2 className="login-title">Welcome back</h2>
        <p className="login-subtitle">Sign in to your marketing dashboard</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Email Address</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                placeholder="admin@brand.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPass((p) => !p)}
                tabIndex={-1}
              >
                <i className={showPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              <i className="fa-solid fa-circle-exclamation"></i> {error}
            </div>
          )}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Signing in...</>
            ) : (
              <><i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In</>
            )}
          </button>
        </form>

        <p className="login-hint">
          <i className="fa-solid fa-circle-info"></i> Default: <strong>admin@brand.com</strong> / <strong>admin123</strong>
        </p>
      </div>

      {/* Background decoration */}
      <div className="login-bg-blob login-blob-1"></div>
      <div className="login-bg-blob login-blob-2"></div>
    </div>
  );
}
