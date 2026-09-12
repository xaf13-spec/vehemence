"use client";

import { useEffect, useState } from "react";
import { logout, changeUsername, changePassword } from "./actions";

const themes = ["Midnight","Cherry Blossom","Ocean","Aquatic","Lavender","Forest","Sunset","Rose","Cloud","Autumn","Frost","Mocha","Moss","Crimson","Sakura"];
const fonts = ["Arial","Helvetica","Verdana","Tahoma","Trebuchet MS","Georgia","Garamond","Times New Roman","Courier New","Consolas","Lucida Console","Impact","Comic Sans MS","Segoe UI","Calibri","Cambria","Century Gothic","Palatino"];
const tabIcons = ["Google Classroom","Google Docs","Google Slides","Khan Academy"];
const siteNames = ["Vehemence","VEHEMENCE","Vehemence Games","Vehemence Hub"];

const tabIconColors = {
  "Google Classroom": ["#5f6368", "#34a853"],
  "Google Docs": ["#4285f4", "#aecbfa"],
  "Google Slides": ["#fbbc04", "#f29900"],
  "Khan Academy": ["#14bf96", "#0b8f72"]
};

function applyTabIcon(name) {
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

function SearchableSelect({ label, value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  function choose(option) {
    onChange(option);
    setSearch("");
    setOpen(false);
  }

  return (
    <div className="settings-custom-select">
      <button
        type="button"
        className="settings-select-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{value}</span>
        <span className={`settings-select-arrow ${open ? "open" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="settings-select-menu">
          <input
            className="settings-select-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={placeholder || `Search ${label.toLowerCase()}...`}
            autoFocus
          />
          <div className="settings-select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  type="button"
                  className={`settings-select-option ${option === value ? "selected" : ""}`}
                  key={option}
                  onClick={() => choose(option)}
                >
                  <span>{option}</span>
                  {option === value && <span className="settings-select-check">✓</span>}
                </button>
              ))
            ) : (
              <div className="settings-select-empty">No results found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
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
  const [siteName, setSiteName] = useState("Vehemence");

  useEffect(() => {
    const savedTheme = localStorage.getItem("vehemence_theme");
    const savedFont = localStorage.getItem("vehemence_font");
    const savedTabIcon = localStorage.getItem("vehemence_tab_icon");
    const savedSiteName = localStorage.getItem("vehemence_site_name");

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
    applyTabIcon(selectedIcon);

    const selectedSiteName = savedSiteName && siteNames.includes(savedSiteName) ? savedSiteName : "Vehemence";
    setSiteName(selectedSiteName);
    document.title = selectedSiteName;
  }, []);

  function handleThemeChange(selectedTheme) {
    setTheme(selectedTheme);
    localStorage.setItem("vehemence_theme", selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme.toLowerCase().replaceAll(" ", "-"));
  }

  function handleFontChange(selectedFont) {
    setFont(selectedFont);
    localStorage.setItem("vehemence_font", selectedFont);
    document.documentElement.style.setProperty("--site-font", selectedFont);
  }

  function handleTabIconChange(selectedIcon) {
    setTabIconChoice(selectedIcon);
    localStorage.setItem("vehemence_tab_icon", selectedIcon);
    applyTabIcon(selectedIcon);
  }

  function handleSiteNameChange(selectedName) {
    setSiteName(selectedName);
    localStorage.setItem("vehemence_site_name", selectedName);
    document.title = selectedName;
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
              <SearchableSelect label="Theme" value={theme} options={themes} onChange={handleThemeChange} />
            </div>
            <div className="settings-row">
              <div><h3>Font</h3><p>Choose the font used throughout Vehemence.</p></div>
              <SearchableSelect label="Font" value={font} options={fonts} onChange={handleFontChange} />
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-header"><h2>Browser / Site</h2><p>Customize how Vehemence appears in your browser.</p></div>
          <div className="settings-card">
            <div className="settings-row">
              <div><h3>Site Name</h3><p>Change the name shown in your browser tab.</p></div>
              <SearchableSelect label="Site name" value={siteName} options={siteNames} onChange={handleSiteNameChange} />
            </div>
            <div className="settings-row">
              <div><h3>Tab Icon</h3><p>Choose the icon shown next to the site name.</p></div>
              <SearchableSelect label="Tab icon" value={tabIcon} options={tabIcons} onChange={handleTabIconChange} />
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
