"use client";

import { useEffect, useMemo, useState } from "react";

const achievements = [
  ["first-game", "First Game", "Play your first game."],
  ["collector", "Collector", "Favorite 5 games."],
  ["regular", "Regular", "Play games on 7 different days."],
  ["explorer", "Explorer", "Play 10 different games."],
  ["veteran", "Veteran", "Play 50 games."],
];

export default function ProfileClient({ user }) {
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [draftBio, setDraftBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");
  const [draftAvatar, setDraftAvatar] = useState("");
  const [draftBanner, setDraftBanner] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [played, setPlayed] = useState(0);
  const [activeDays, setActiveDays] = useState([]);
  const [online, setOnline] = useState(true);

  function load() {
    const savedBio = localStorage.getItem("vehemence_bio") || "";
    const savedAvatar = localStorage.getItem("vehemence_profile_avatar") || "";
    const savedBanner = localStorage.getItem("vehemence_profile_banner") || "";
    setBio(savedBio);
    setAvatar(savedAvatar);
    setBanner(savedBanner);
    setFavorites(JSON.parse(localStorage.getItem("vehemence_favorites") || "[]"));
    setRecent(JSON.parse(localStorage.getItem("vehemence_recent_games") || "[]"));
    setPlayed(Number(localStorage.getItem("vehemence_games_played") || 0));
    setActiveDays(JSON.parse(localStorage.getItem("vehemence_active_days") || "[]"));
  }

  useEffect(() => {
    load();
    const refresh = load;
    const visibility = () => setOnline(document.visibilityState === "visible");
    window.addEventListener("vehemence-games-changed", refresh);
    window.addEventListener("storage", refresh);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("vehemence-games-changed", refresh);
      window.removeEventListener("storage", refresh);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  const unlocked = useMemo(() => new Set([
    ...(played >= 1 ? ["first-game"] : []),
    ...(favorites.length >= 5 ? ["collector"] : []),
    ...(activeDays.length >= 7 ? ["regular"] : []),
    ...(recent.length >= 10 ? ["explorer"] : []),
    ...(played >= 50 ? ["veteran"] : []),
  ]), [played, favorites, recent, activeDays]);

  function startEditing() {
    setDraftBio(bio);
    setDraftAvatar(avatar);
    setDraftBanner(banner);
    setEditing(true);
  }

  function cancelEditing() {
    setDraftBio(bio);
    setDraftAvatar(avatar);
    setDraftBanner(banner);
    setEditing(false);
  }

  function saveProfile() {
    const value = draftBio.trim().slice(0, 160);
    localStorage.setItem("vehemence_bio", value);
    if (draftAvatar) localStorage.setItem("vehemence_profile_avatar", draftAvatar);
    else localStorage.removeItem("vehemence_profile_avatar");
    if (draftBanner) localStorage.setItem("vehemence_profile_banner", draftBanner);
    else localStorage.removeItem("vehemence_profile_banner");
    setBio(value);
    setAvatar(draftAvatar);
    setBanner(draftBanner);
    setEditing(false);
  }

  function handleImage(event, setter) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setter(String(reader.result || ""));
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <main className="profile-page">
      <section className="profile-container">
        <header className="profile-hero" style={banner ? { backgroundImage: `url(${banner})` } : undefined}>
          <div className="profile-avatar" style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: "cover", backgroundPosition: "center", color: "transparent" } : undefined}>{avatar ? "" : user.username.slice(0, 2).toUpperCase()}</div>
          <div className="profile-hero-copy"><span className="settings-eyebrow">PROFILE</span><h1>{user.username}</h1><p>{bio || "No bio yet."}</p></div>
          <button className="secondary-button" onClick={startEditing}>Edit Profile</button>
        </header>

        {editing && <div className="profile-edit-card">
          <div className="profile-edit-bio">
            <div className="profile-edit-bio-heading"><div><span className="profile-edit-kicker">EDIT PROFILE</span><h2>Bio</h2><p>Write something people can actually read without the field feeling cramped.</p></div><span className="profile-bio-count">{draftBio.length}/160</span></div>
            <textarea value={draftBio} onChange={(e) => setDraftBio(e.target.value)} maxLength={160} placeholder="Tell people a little about yourself..." rows={6} />
          </div>
          <div className="profile-customization-grid">
            <label>Profile Picture<input type="file" accept="image/*" onChange={(e) => handleImage(e, setDraftAvatar)} /></label>
            <label>Profile Banner<input type="file" accept="image/*" onChange={(e) => handleImage(e, setDraftBanner)} /></label>
          </div>
          <p className="profile-edit-note">Changes stay local to this browser until you press Save Profile.</p>
          <div className="profile-edit-actions"><button className="secondary-button" onClick={cancelEditing}>Cancel</button><button className="primary-button" onClick={saveProfile}>Save Profile</button></div>
        </div>}

        <div className="profile-stats-grid">
          <div className="profile-stat"><strong>{played}</strong><span>Games Played</span></div>
          <div className="profile-stat"><strong>{favorites.length}</strong><span>Favorites</span></div>
          <div className="profile-stat"><strong>{unlocked.size}</strong><span>Achievements</span></div>
        </div>

        <section className="profile-section"><div className="profile-section-header"><h2>Account</h2><p>Your basic Vehemence account information.</p></div><div className="profile-card">
          <div className="profile-row"><div className="profile-row-copy"><h3>Username</h3><p>Your public Vehemence username.</p></div><strong className="profile-value">{user.username}</strong></div>
          <div className="profile-row"><div className="profile-row-copy"><h3>Joined</h3><p>The date this account was created.</p></div><strong className="profile-value">{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(user.created_at))}</strong></div>
          <div className="profile-row"><div className="profile-row-copy"><h3>Status</h3><p>Current availability on this device.</p></div><span className="profile-status"><span className="profile-status-dot" />{online ? "Online" : "Away"}</span></div>
        </div></section>

        <section className="profile-section"><div className="profile-section-header"><h2>Recently Played</h2><p>Games you've opened recently.</p></div><div className="profile-card profile-list-card">{recent.length ? recent.map((name) => <div className="profile-list-item" key={name}><span>{name}</span><span>Played</span></div>) : <p className="profile-empty">No recently played games yet.</p>}</div></section>

        <section className="profile-section"><div className="profile-section-header"><h2>Favorites</h2><p>Your saved games.</p></div><div className="profile-card profile-list-card">{favorites.length ? favorites.map((name) => <div className="profile-list-item" key={name}><span>★ {name}</span><span>Favorite</span></div>) : <p className="profile-empty">No favorite games yet.</p>}</div></section>

        <section className="profile-section"><div className="profile-section-header"><h2>Achievements</h2><p>Milestones you've unlocked. No badges or showcase system.</p></div><div className="achievement-grid">{achievements.map(([id, name, description]) => <div className={`achievement-card ${unlocked.has(id) ? "unlocked" : ""}`} key={id}><div className="achievement-mark">{unlocked.has(id) ? "✓" : "○"}</div><div><h3>{name}</h3><p>{description}</p></div></div>)}</div></section>
      </section>
    </main>
  );
}
