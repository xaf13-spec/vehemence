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
  const [editingBio, setEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [played, setPlayed] = useState(0);
  const [friends, setFriends] = useState([]);

  function load() {
    setBio(localStorage.getItem("vehemence_bio") || "");
    setFavorites(JSON.parse(localStorage.getItem("vehemence_favorites") || "[]"));
    setRecent(JSON.parse(localStorage.getItem("vehemence_recent_games") || "[]"));
    setPlayed(Number(localStorage.getItem("vehemence_games_played") || 0));
    setFriends(JSON.parse(localStorage.getItem("vehemence_friends") || "[]"));
  }

  useEffect(() => {
    load();
    const refresh = load;
    window.addEventListener("vehemence-games-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("vehemence-games-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const unlocked = useMemo(() => new Set([
    ...(played >= 1 ? ["first-game"] : []),
    ...(favorites.length >= 5 ? ["collector"] : []),
    ...(recent.length >= 10 ? ["explorer"] : []),
    ...(played >= 50 ? ["veteran"] : []),
  ]), [played, favorites, recent]);

  function saveBio() {
    const value = draftBio.trim().slice(0, 160);
    localStorage.setItem("vehemence_bio", value);
    setBio(value);
    setEditingBio(false);
  }

  function addFriend() {
    const name = window.prompt("Enter a Vehemence username to add:");
    if (!name?.trim() || name.trim().toLowerCase() === user.username.toLowerCase()) return;
    const next = Array.from(new Set([...friends, name.trim()])).slice(0, 100);
    setFriends(next);
    localStorage.setItem("vehemence_friends", JSON.stringify(next));
  }

  return (
    <main className="profile-page">
      <section className="profile-container">
        <header className="profile-hero">
          <div className="profile-avatar">{user.username.slice(0, 2).toUpperCase()}</div>
          <div className="profile-hero-copy"><span className="settings-eyebrow">PROFILE</span><h1>{user.username}</h1><p>{bio || "No bio yet."}</p></div>
          <button className="secondary-button" onClick={() => { setDraftBio(bio); setEditingBio(true); }}>Edit Profile</button>
        </header>

        {editingBio && <div className="profile-edit-card"><label>Bio<input value={draftBio} onChange={(e) => setDraftBio(e.target.value)} maxLength={160} placeholder="Tell people a little about yourself..." /></label><div><button className="secondary-button" onClick={() => setEditingBio(false)}>Cancel</button><button className="primary-button" onClick={saveBio}>Save Bio</button></div></div>}

        <div className="profile-stats-grid">
          <div className="profile-stat"><strong>{played}</strong><span>Games Played</span></div>
          <div className="profile-stat"><strong>{favorites.length}</strong><span>Favorites</span></div>
          <div className="profile-stat"><strong>{friends.length}</strong><span>Friends</span></div>
          <div className="profile-stat"><strong>{unlocked.size}</strong><span>Achievements</span></div>
        </div>

        <section className="profile-section"><div className="profile-section-header"><h2>Account</h2><p>Your basic Vehemence account information.</p></div><div className="profile-card">
          <div className="profile-row"><div className="profile-row-copy"><h3>Username</h3><p>Your public Vehemence username.</p></div><strong className="profile-value">{user.username}</strong></div>
          <div className="profile-row"><div className="profile-row-copy"><h3>Joined</h3><p>The date this account was created.</p></div><strong className="profile-value">{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(user.created_at))}</strong></div>
          <div className="profile-row"><div className="profile-row-copy"><h3>Status</h3><p>Current availability on Vehemence.</p></div><span className="profile-status"><span className="profile-status-dot" />Online</span></div>
        </div></section>

        <section className="profile-section"><div className="profile-section-header"><h2>Recently Played</h2><p>Games you've opened recently.</p></div><div className="profile-card profile-list-card">{recent.length ? recent.map((name) => <div className="profile-list-item" key={name}><span>{name}</span><span>Played</span></div>) : <p className="profile-empty">No recently played games yet.</p>}</div></section>

        <section className="profile-section"><div className="profile-section-header"><h2>Favorites</h2><p>Your saved games.</p></div><div className="profile-card profile-list-card">{favorites.length ? favorites.map((name) => <div className="profile-list-item" key={name}><span>★ {name}</span><span>Favorite</span></div>) : <p className="profile-empty">No favorite games yet.</p>}</div></section>

        <section className="profile-section"><div className="profile-section-header"><h2>Achievements</h2><p>Milestones you've unlocked. No badges or showcase system.</p></div><div className="achievement-grid">{achievements.map(([id, name, description]) => <div className={`achievement-card ${unlocked.has(id) ? "unlocked" : ""}`} key={id}><div className="achievement-mark">{unlocked.has(id) ? "✓" : "○"}</div><div><h3>{name}</h3><p>{description}</p></div></div>)}</div></section>

        <section className="profile-section"><div className="profile-section-header"><h2>Friends</h2><p>Keep a simple list of people you play with.</p></div><div className="profile-card profile-list-card"><div className="friends-toolbar"><span>{friends.length} {friends.length === 1 ? "friend" : "friends"}</span><button className="secondary-button" onClick={addFriend}>Add Friend</button></div>{friends.length ? friends.map((name) => <div className="profile-list-item" key={name}><span><span className="profile-status-dot" />{name}</span><span>Offline</span></div>) : <p className="profile-empty">No friends added yet.</p>}</div></section>
      </section>
    </main>
  );
}
