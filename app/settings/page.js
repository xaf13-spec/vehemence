"use client";

import { useEffect, useState } from "react";
import { logout, changeUsername, changePassword } from "./actions";

const themes = [
  "Midnight",
  "Cherry Blossom",
  "Ocean",
  "Aquatic",
  "Lavender",
  "Forest",
  "Sunset",
  "Rose",
  "Cloud",
  "Autumn",
  "Frost",
  "Mocha",
  "Moss",
  "Crimson",
  "Sakura"
];

export default function Settings() {
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [theme, setTheme] = useState("Midnight");

  useEffect(() => {
    const savedTheme = localStorage.getItem("vehemence_theme");

    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute(
        "data-theme",
        savedTheme.toLowerCase().replaceAll(" ", "-")
      );
    }
  }, []);

  function handleThemeChange(event) {
    const selectedTheme = event.target.value;

    setTheme(selectedTheme);

    localStorage.setItem("vehemence_theme", selectedTheme);

    document.documentElement.setAttribute(
      "data-theme",
      selectedTheme.toLowerCase().replaceAll(" ", "-")
    );
  }

  async function handleLogout() {
    await logout();
    window.location.href = "/";
  }

  async function handleUsernameChange(event) {
    event.preventDefault();
    setUsernameError("");
    setUsernameSuccess("");
    setUsernameLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await changeUsername(formData);

    if (result?.error) {
      setUsernameError(result.error);
      setUsernameLoading(false);
      return;
    }

    setUsernameSuccess("Username changed successfully.");
    setUsernameLoading(false);
    event.currentTarget.reset();
  }

  async function handlePasswordChange(event) {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await changePassword(formData);

    if (result?.error) {
      setPasswordError(result.error);
      setPasswordLoading(false);
      return;
    }

    setPasswordSuccess("Password changed successfully.");
    setPasswordLoading(false);
    event.currentTarget.reset();
  }

  return (
    <main className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Settings</h1>
          <p>Customize your Vehemence experience.</p>
        </div>

        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Account</h2>
            <p>Manage your account information.</p>
          </div>

          <div className="settings-card">
            <div className="settings-row">
              <div>
                <h3>Username</h3>
                <p>Change your username once every 24 hours.</p>
              </div>

              <button
                className="secondary-button"
                onClick={() => {
                  setShowUsername(!showUsername);
                  setUsernameError("");
                  setUsernameSuccess("");
                }}
              >
                {showUsername ? "Cancel" : "Change Username"}
              </button>
            </div>

            {showUsername && (
              <form
                className="settings-form"
                onSubmit={handleUsernameChange}
              >
                <label>
                  New Username
                  <input
                    name="username"
                    type="text"
                    placeholder="Enter your new username"
                    minLength={3}
                    maxLength={20}
                    required
                  />
                </label>

                {usernameError && (
                  <p className="auth-error">{usernameError}</p>
                )}

                {usernameSuccess && (
                  <p className="settings-success">{usernameSuccess}</p>
                )}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={usernameLoading}
                >
                  {usernameLoading ? "Changing..." : "Save Username"}
                </button>
              </form>
            )}

            <div className="settings-row">
              <div>
                <h3>Password</h3>
                <p>Change your password whenever you want.</p>
              </div>

              <button
                className="secondary-button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
              >
                {showPassword ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showPassword && (
              <form
                className="settings-form"
                onSubmit={handlePasswordChange}
              >
                <label>
                  Current Password
                  <input
                    name="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                    required
                  />
                </label>

                <label>
                  New Password
                  <input
                    name="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    minLength={8}
                    required
                  />
                </label>

                <label>
                  Confirm New Password
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    minLength={8}
                    required
                  />
                </label>

                {passwordError && (
                  <p className="auth-error">{passwordError}</p>
                )}

                {passwordSuccess && (
                  <p className="settings-success">{passwordSuccess}</p>
                )}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Changing..." : "Save Password"}
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Appearance</h2>
            <p>Customize how Vehemence looks.</p>
          </div>

          <div className="settings-card">
            <div className="settings-row">
              <div>
                <h3>Theme</h3>
                <p>Choose the look and colors of the site.</p>
              </div>

              <select
                className="settings-select"
                value={theme}
                onChange={handleThemeChange}
              >
                {themes.map((themeName) => (
                  <option key={themeName} value={themeName}>
                    {themeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="settings-row">
              <div>
                <h3>Font</h3>
                <p>Choose the font used throughout Vehemence.</p>
              </div>

              <button className="secondary-button">
                Choose Font
              </button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Browser / Site</h2>
            <p>Customize how Vehemence appears in your browser.</p>
          </div>

          <div className="settings-card">
            <div className="settings-row">
              <div>
                <h3>Site Name</h3>
                <p>Change the name shown in your browser tab.</p>
              </div>

              <button className="secondary-button">
                Change Name
              </button>
            </div>

            <div className="settings-row">
              <div>
                <h3>Tab Icon</h3>
                <p>Change the icon shown next to the site name.</p>
              </div>

              <button className="secondary-button">
                Change Icon
              </button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Danger Zone</h2>
            <p>Actions that affect your account session.</p>
          </div>

          <div className="settings-card danger-card">
            <div className="settings-row">
              <div>
                <h3>Sign Out</h3>
                <p>Sign out of your Vehemence account on this device.</p>
              </div>

              <button
                className="secondary-button danger-button"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
