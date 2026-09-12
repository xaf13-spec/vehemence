"use client";

import { logout } from "./actions";

export default function Settings() {
async function handleLogout() {
await logout();
window.location.href = "/";
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

          <button className="secondary-button">
            Change Username
          </button>
        </div>

        <div className="settings-row">
          <div>
            <h3>Password</h3>
            <p>Change your password whenever you want.</p>
          </div>

          <button className="secondary-button">
            Change Password
          </button>
        </div>
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

          <button className="secondary-button">
            Customize
          </button>
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
