"use client";

import { useEffect, useState } from "react";

const defaultNotifications = [
  { id: "welcome", title: "Welcome to Vehemence", text: "Your notification center is ready.", type: "System", read: false },
  { id: "explore", title: "Explore the Games page", text: "Search, filter, favorite, and continue playing games from one place.", type: "System", read: false }
];

export default function Navbar() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("vehemence_notifications")) localStorage.setItem("vehemence_notifications", JSON.stringify(defaultNotifications));
    const update = () => {
      try { setUnread(JSON.parse(localStorage.getItem("vehemence_notifications") || "[]").filter((item) => !item.read).length); } catch { setUnread(0); }
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("vehemence-notifications-changed", update);
    return () => { window.removeEventListener("storage", update); window.removeEventListener("vehemence-notifications-changed", update); };
  }, []);

  return <nav className="navbar"><a href="/" className="logo">VEHEMENCE</a><div className="nav-links"><a href="/">Home</a><a href="/rules">Rules</a><a href="/games">Games</a><a href="/profile">Profile</a><a href="/settings">Settings</a></div><a href="/notifications" className="notification-nav" aria-label="Notifications"><span className="notification-bell">🔔</span>{unread > 0 && <span className="notification-count">{unread > 9 ? "9+" : unread}</span>}</a></nav>;
}
