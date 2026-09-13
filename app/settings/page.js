"use client";

import { useEffect, useState } from "react";
import { logout, logoutEverywhere, changeUsername, changePassword, deleteAccount } from "./actions";

const themes = ["Midnight", "Cherry Blossom", "Ocean", "Aquatic", "Lavender", "Forest", "Sunset", "Rose", "Cloud", "Autumn", "Frost", "Mocha", "Moss", "Crimson", "Sakura"];
const fonts = ["Arial", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS", "Georgia", "Garamond", "Times New Roman", "Courier New", "Consolas", "Lucida Console", "Impact", "Comic Sans MS", "Segoe UI", "Calibri", "Cambria", "Century Gothic", "Palatino"];

function save(key, value, notify = false) {
  localStorage.setItem(key, String(value));
  if (notify) window.dispatchEvent(new Event("vehemence-settings-changed"));
}

function applyAppearance({ theme, font, uiScale, compact, animations, blur, backgroundEffects }) {
  const root = document.documentElement;
  if (theme) root.setAttribute("data-theme", theme.toLowerCase().replaceAll(" ", "-"));
  if (font) root.style.setProperty("--site-font", font);
  root.setAttribute("data-ui-scale", (uiScale || "Normal").toLowerCase());
  root.setAttribute("data-compact", String(Boolean(compact)));
  root.setAttribute("data-animations", String(Boolean(animations)));
  root.setAttribute("data-blur", String(Boolean(blur)));
  root.setAttribute("data-background-effects", String(Boolean(backgroundEffects)));
}

function CustomSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = e => { if (!e.target.closest(".settings-custom-select")) setOpen(false); };
    const key = e => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return <div className="settings-custom-select">
    <button type="button" className="settings-select-button" onClick={() => setOpen(v => !v)} aria-expanded={open}>
      <span>{value}</span><span className={`settings-select-arrow ${open ? "open" : ""}`}>⌄</span>
    </button>
    {open && <div className="settings-select-menu">{options.map(option => <button type="button" key={option} className={`settings-select-option ${option === value ? "selected" : ""}`} onClick={() => { onChange(option); setOpen(false); }}><span>{option}</span>{option === value && <span className="settings-select-check">✓</span>}</button>)}</div>}
  </div>;
}

function Toggle({ checked, onChange }) {
  return <button type="button" className={`settings-toggle ${checked ? "active" : ""}`} onClick={() => onChange(!checked)} aria-pressed={checked}><span className="settings-toggle-knob" /></button>;
}

function SettingRow({ title, description, children }) {
  return <div className="settings-row"><div><h3>{title}</h3><p>{description}</p></div>{children}</div>;
}

export default function Settings() {
  const [showUsername, setShowUsername] = useState(false), [showPassword, setShowPassword] = useState(false), [usernameError, setUsernameError] = useState(""), [usernameSuccess, setUsernameSuccess] = useState(""), [usernameLoading, setUsernameLoading] = useState(false), [passwordError, setPasswordError] = useState(""), [passwordSuccess, setPasswordSuccess] = useState(""), [passwordLoading, setPasswordLoading] = useState(false);
  const [theme, setTheme] = useState("Midnight"), [font, setFont] = useState("Arial"), [uiScale, setUiScale] = useState("Normal"), [compact, setCompact] = useState(false), [animations, setAnimations] = useState(true), [blur, setBlur] = useState(true), [backgroundEffects, setBackgroundEffects] = useState(true), [volume, setVolume] = useState(80), [autoFullscreen, setAutoFullscreen] = useState(false), [rememberLastGame, setRememberLastGame] = useState(true), [friendNotifications, setFriendNotifications] = useState(true), [siteNotifications, setSiteNotifications] = useState(true), [achievementNotifications, setAchievementNotifications] = useState(true), [deleteConfirm, setDeleteConfirm] = useState(false), [deleteLoading, setDeleteLoading] = useState(false), [deleteError, setDeleteError] = useState(""), [accountMessage, setAccountMessage] = useState("");

  useEffect(() => {
    const get = (k, f) => localStorage.getItem(k) ?? f;
    const loaded = { theme: get("vehemence_theme", "Midnight"), font: get("vehemence_font", "Arial"), uiScale: get("vehemence_ui_scale", "Normal"), compact: get("vehemence_compact", "false") === "true", animations: get("vehemence_animations", "true") === "true", blur: get("vehemence_blur", "true") === "true", backgroundEffects: get("vehemence_background", "true") === "true" };
    setTheme(loaded.theme); setFont(loaded.font); setUiScale(loaded.uiScale); setCompact(loaded.compact); setAnimations(loaded.animations); setBlur(loaded.blur); setBackgroundEffects(loaded.backgroundEffects); setVolume(Number(get("vehemence_volume", "80"))); setAutoFullscreen(get("vehemence_auto_fullscreen", "false") === "true"); setRememberLastGame(get("vehemence_remember_game", "true") === "true"); setFriendNotifications(get("vehemence_notify_friends", "true") === "true"); setSiteNotifications(get("vehemence_notify_site", "true") === "true"); setAchievementNotifications(get("vehemence_notify_achievements", "true") === "true");
    applyAppearance(loaded);
  }, []);

  function update(k, v, setter) { setter(v); save(k, v, false); }
  function changeAppearance(k, v, setter) {
    setter(v); save(k, v, true);
    applyAppearance({ theme, font, uiScale, compact, animations, blur, backgroundEffects, [k]: v });
  }
  function handleThemeChange(v) { changeAppearance("theme", v, setTheme); }
  function handleFontChange(v) { changeAppearance("font", v, setFont); }
  function handleScaleChange(v) { changeAppearance("uiScale", v, setUiScale); }
  function handleToggle(k, v, setter) { changeAppearance(k, v, setter); }
  async function handleLogout() { await logout(); window.location.href = "/"; }
  async function handleLogoutEverywhere() { const result = await logoutEverywhere(); if (result?.error) { setAccountMessage(result.error); return; } window.location.href = "/"; }
  async function handleUsernameChange(e) { e.preventDefault(); setUsernameError(""); setUsernameSuccess(""); setUsernameLoading(true); const result = await changeUsername(new FormData(e.currentTarget)); if (result?.error) { setUsernameError(result.error); setUsernameLoading(false); return; } setUsernameSuccess("Username changed successfully."); setUsernameLoading(false); e.currentTarget.reset(); }
  async function handlePasswordChange(e) { e.preventDefault(); setPasswordError(""); setPasswordSuccess(""); setPasswordLoading(true); const result = await changePassword(new FormData(e.currentTarget)); if (result?.error) { setPasswordError(result.error); setPasswordLoading(false); return; } setPasswordSuccess("Password changed successfully."); setPasswordLoading(false); e.currentTarget.reset(); }
  async function handleDeleteAccount() {
    setDeleteError(""); setDeleteLoading(true);
    const result = await deleteAccount();
    if (result?.error) { setDeleteError(result.error); setDeleteLoading(false); return; }
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  }

  return <main className="settings-page"><div className="settings-container"><div className="settings-header"><p className="eyebrow">VEHEMENCE</p><h1>Settings</h1><p>Customize your Vehemence experience.</p></div>
    <section className="settings-section"><div className="settings-section-header"><h2>Account</h2><p>Manage your account information.</p></div><div className="settings-card"><SettingRow title="Username" description="Change your username once every 24 hours."><button className="secondary-button" onClick={() => { setShowUsername(!showUsername); setUsernameError(""); setUsernameSuccess(""); }}>{showUsername ? "Cancel" : "Change Username"}</button></SettingRow>{showUsername && <form className="settings-form" onSubmit={handleUsernameChange}><label>New Username<input name="username" type="text" placeholder="Enter your new username" minLength={3} maxLength={20} required /></label>{usernameError && <p className="auth-error">{usernameError}</p>}{usernameSuccess && <p className="settings-success">{usernameSuccess}</p>}<button type="submit" className="primary-button" disabled={usernameLoading}>{usernameLoading ? "Changing..." : "Save Username"}</button></form>}<SettingRow title="Password" description="Change your password whenever you want."><button className="secondary-button" onClick={() => { setShowPassword(!showPassword); setPasswordError(""); setPasswordSuccess(""); }}>{showPassword ? "Cancel" : "Change Password"}</button></SettingRow>{showPassword && <form className="settings-form" onSubmit={handlePasswordChange}><label>Current Password<input name="currentPassword" type="password" required /></label><label>New Password<input name="newPassword" type="password" minLength={8} required /></label><label>Confirm New Password<input name="confirmPassword" type="password" minLength={8} required /></label>{passwordError && <p className="auth-error">{passwordError}</p>}{passwordSuccess && <p className="settings-success">{passwordSuccess}</p>}<button type="submit" className="primary-button" disabled={passwordLoading}>{passwordLoading ? "Changing..." : "Save Password"}</button></form>}<SettingRow title="Active Sessions" description="Your current signed-in session."><span className="settings-status">This device · Active</span></SettingRow><SettingRow title="Sign Out Everywhere" description="End all active sessions for this account."><button className="secondary-button" onClick={handleLogoutEverywhere}>Sign Out Everywhere</button></SettingRow></div></section>
    <section className="settings-section"><div className="settings-section-header"><h2>Appearance</h2><p>Control the look and feel of Vehemence.</p></div><div className="settings-card"><SettingRow title="Theme" description="Choose the look and colors of the site."><CustomSelect value={theme} options={themes} onChange={handleThemeChange} /></SettingRow><SettingRow title="Font" description="Choose the font used throughout Vehemence."><CustomSelect value={font} options={fonts} onChange={handleFontChange} /></SettingRow><SettingRow title="UI Scale" description="Adjust the overall size of interface elements."><CustomSelect value={uiScale} options={["Small", "Normal", "Large"]} onChange={handleScaleChange} /></SettingRow><SettingRow title="Compact Mode" description="Reduce spacing to fit more content on screen."><Toggle checked={compact} onChange={v => handleToggle("compact", v, setCompact)} /></SettingRow><SettingRow title="Animations" description="Enable interface motion and transitions."><Toggle checked={animations} onChange={v => handleToggle("animations", v, setAnimations)} /></SettingRow><SettingRow title="Blur Effects" description="Use glass and backdrop blur effects throughout the site."><Toggle checked={blur} onChange={v => handleToggle("blur", v, setBlur)} /></SettingRow><SettingRow title="Background Effects" description="Show the subtle background lighting effects."><Toggle checked={backgroundEffects} onChange={v => handleToggle("backgroundEffects", v, setBackgroundEffects)} /></SettingRow></div></section>
    <section className="settings-section"><div className="settings-section-header"><h2>Games</h2><p>Set your default game behavior.</p></div><div className="settings-card"><SettingRow title="Default Game Volume" description="Set the starting volume for games that support audio."><div className="settings-range-wrap"><input className="settings-range" type="range" min="0" max="100" value={volume} onChange={e => update("vehemence_volume", e.target.value, setVolume)} /><span>{volume}%</span></div></SettingRow><SettingRow title="Auto Fullscreen" description="Enter fullscreen automatically when a game supports it."><Toggle checked={autoFullscreen} onChange={v => update("vehemence_auto_fullscreen", v, setAutoFullscreen)} /></SettingRow><SettingRow title="Remember Last Game" description="Keep track of the last game you opened for quick access."><Toggle checked={rememberLastGame} onChange={v => update("vehemence_remember_game", v, setRememberLastGame)} /></SettingRow></div></section>
    <section className="settings-section"><div className="settings-section-header"><h2>Notifications</h2><p>Choose which updates appear in your notification center.</p></div><div className="settings-card"><SettingRow title="Friend Requests" description="Get notified when someone sends you a friend request."><Toggle checked={friendNotifications} onChange={v => update("vehemence_notify_friends", v, setFriendNotifications)} /></SettingRow><SettingRow title="Site Announcements" description="Get important announcements from Vehemence."><Toggle checked={siteNotifications} onChange={v => update("vehemence_notify_site", v, setSiteNotifications)} /></SettingRow><SettingRow title="Achievements" description="Get notified when you unlock an achievement."><Toggle checked={achievementNotifications} onChange={v => update("vehemence_notify_achievements", v, setAchievementNotifications)} /></SettingRow></div></section>
    <section className="settings-section"><div className="settings-section-header"><h2>Danger Zone</h2><p>Actions that affect your account.</p></div><div className="settings-card danger-card"><SettingRow title="Sign Out" description="Sign out of your Vehemence account on this device."><button className="secondary-button danger-button" onClick={handleLogout}>Sign Out</button></SettingRow><SettingRow title="Delete Account" description="Permanently delete your Vehemence account and its data."><button className="secondary-button danger-button" onClick={() => { setDeleteError(""); setDeleteConfirm(true); }}>Delete Account</button></SettingRow></div>{deleteConfirm && <div className="settings-delete-warning"><strong>Delete your account?</strong><p>This permanently removes your Vehemence account and signed-in sessions. This cannot be undone.</p>{deleteError && <p className="auth-error">{deleteError}</p>}<div className="settings-delete-actions"><button className="secondary-button" onClick={() => setDeleteConfirm(false)} disabled={deleteLoading}>Cancel</button><button className="secondary-button danger-button" onClick={handleDeleteAccount} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Yes, Delete Account"}</button></div></div>}{accountMessage && <p className="settings-note">{accountMessage}</p>}</section>
  </div></main>;
}
