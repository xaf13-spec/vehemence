"use client";

import { useEffect, useState } from "react";
import { logout, changeUsername, changePassword } from "./actions";

const themes = ["Midnight","Cherry Blossom","Ocean","Aquatic","Lavender","Forest","Sunset","Rose","Cloud","Autumn","Frost","Mocha","Moss","Crimson","Sakura"];
const fonts = ["Arial","Helvetica","Verdana","Tahoma","Trebuchet MS","Georgia","Garamond","Times New Roman","Courier New","Consolas","Lucida Console","Impact","Comic Sans MS","Segoe UI","Calibri","Cambria","Century Gothic","Palatino"];
const tabIcons = ["Google Classroom","Google Docs","Google Slides","Khan Academy"];

const tabIconColors = {
  "Google Classroom": ["#5f6368", "#34a853"],
  "Google Docs": ["#4285f4", "#aecbfa"],
  "Google Slides": ["#fbbc04", "#f29900"],
  "Khan Academy": ["#14bf96", "#0b8f72"]
};

function setTabIcon(name) {
  const [primary, secondary] = tabIconColors[name];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${primary}"/><circle cx="32" cy="27" r="13" fill="white" opacity=".95"/><path d="M18 48c4-10 24-10 28 0" fill="${secondary}"/></svg>`;
  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

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
  const [font, setFont] = useState("Arial");
  const [tabIcon, setTabIconChoice] = useState("Google Classroom");

  useEffect(() => {
    const savedTheme = localStorage.getItem("vehemence_theme");
    const savedFont = localStorage.getItem("vehemence_font");
    const savedTabIcon = localStorage.getItem("vehemence_tab_icon");

    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme.toLowerCase().replaceAll(" ", "-"));
    }
    if (savedFont && fonts.includes(savedFont)) {
      setFont(savedFont);
      document.documentElement.style.setProperty("--site-font", savedFont);
    }
    const selectedIcon = savedTabIcon && tabIcons.includes(savedTabIcon) ? savedTabIcon : "Google Classroom";
    setTabIconChoice(selectedIcon);
    setTabIcon(selectedIcon);
  }, []);

  function handleThemeChange(event) {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    localStorage.setItem("vehemence_theme", selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme.toLowerCase().replaceAll(" ", "-"));
  }

  function handleFontChange(event) {
    const selectedFont = event.target.value;
    setFont(selectedFont);
    localStorage.setItem("vehemence_font", selectedFont);
    document.documentElement.style.setProperty("--site-font", selectedFont);
  }

  function handleTabIconChange(event) {
    const selectedIcon = event.target.value;
    setTabIconChoice(selectedIcon);
    localStorage.setItem("vehemence_tab_icon", selectedIcon);
    setTabIcon(selectedIcon);
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
    const result = await changeUsername(new FormData(event.currentTarget));
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
    const result = await changePassword(new FormData(event.currentTarget));
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
          <div className="settings-section-header"><h2>Account</h2><p>Manage your account information.</p></div>
          <div className="settings-card">
            <div className="settings-row">
              <div><h3>Username</h3><p>Change your username once every 24 hours.</p></div>
              <button className="secondary-button" onClick={() => { setShowUsername(!showUsername); setUsernameError(""); setUsernameSuccess(""); }}>{showUsername ? "Cancel" : "Change Username"}</button>
            </div>
            {showUsername && <form className="settings-form" onSubmit={handleUsernameChange}>
              <label>New Username<input name="username" type="text" placeholder="Enter your new username" minLength={3} maxLength={20} required /></label>
              {usernameError && <p className="auth-error">{usernameError}</p>}
              {usernameSuccess && <p className="settings-success">{usernameSuccess}</p>}
              <button type="submit" className="primary-button" disabled={usernameLoading}>{usernameLoading ? "Changing..." : "Save Username"}</button>
            </form>}
            <div className="settings-row">
              <div><h3>Password</h3><p>Change your password whenever you want.</p></div>
              <button className="secondary-button" onClick={() => { setShowPassword(!showPassword); setPasswordError(""); setPasswordSuccess(""); }}>{showPassword ? "Cancel" : "Change Password"}</button>
            </div>
            {showPassword && <form className="settings-form" onSubmit={handlePasswordChange}>
              <label>Current Password<input name="currentPassword" type="password" placeholder="Enter your current password" required /></label>
              <label>New Password<input name="newPassword" type="password" placeholder="Enter your new password" minLength={8} required /></label>
              <label>Confirm New Password<input name="confirmPassword" type="password" placeholder="Confirm your new password" minLength={8} required /></label>
              {passwordError && <p className="auth-error">{passwordError}</p>}
              {passwordSuccess && <p className="settings-success">{passwordSuccess}</p>}
              <button type="submit" className="primary-button" disabled={passwordLoading}>{passwordLoading ? "Changing..." : "Save Password"}</button>
            </form>}
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-header"><h2>Appearance</h2><p>Customize how Vehemence looks.</p></div>
          <div className="settings-card">
            <div className="settings-row">
              <div><h3>Theme</h3><p>Choose the look and colors of the site.</p></div>
              <select className="settings-select" value={theme} onChange={handleThemeChange}>{themes.map((themeName) => <option key={themeName} value={themeName}>{themeName}</option>)}</select>
            </div>
            <div className="settings-row">
              <div><h3>Font</h3><p>Choose the font used throughout Vehemence.</p></div>
              <select className="settings-select" value={font} onChange={handleFontChange}>{fonts.map((fontName) => <option key={fontName} value={fontName}>{fontName}</option>)}</select>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-header"><h2>Browser / Site</h2><p>Customize how Vehemence appears in your browser.</p></div>
          <div className="settings-card">
            <div className="settings-row">
              <div><h3>Site Name</h3><p>Change the name shown in your browser tab.</p></div>
              <button className="secondary-button">Change Name</button>
            </div>
            <div className="settings-row">
              <div><h3>Tab Icon</h3><p>Choose the icon shown next to the site name.</p></div>
              <select className="settings-select" value={tabIcon} onChange={handleTabIconChange}>{tabIcons.map((iconName) => <option key={iconName} value={iconName}>{iconName}</option>)}</select>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-header"><h2>Danger Zone</h2><p>Actions that affect your account session.</p></div>
          <div className="settings-card danger-card">
            <div className="settings-row">
              <div><h3>Sign Out</h3><p>Sign out of your Vehemence account on this device.</p></div>
              <button className="secondary-button danger-button" onClick={handleLogout}>Sign Out</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
