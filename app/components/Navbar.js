"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const update = () => {
      try {
        const items = JSON.parse(localStorage.getItem("vehemence_notifications") || "[]");
        setUnread(items.filter((item) => !item.read).length);
      } catch {
        setUnread(0);
      }
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  return (
    <nav className="navbar">
      <a href="/" className="logo">VEHEMENCE</a>
      <div className="nav-links">
        <a href="/">Home</a><a href="/rules">Rules</a><a href="/games">Games</a><a href="/profile">Profile</a><a href="/settings">Settings</a>
      </div>
      <a href="/notifications" className="notification-nav" aria-label="Notifications"><span className="notification-bell">♢</span>{unread > 0 && <span className="notification-count">{unread > 9 ? "9+" : unread}</span>}</a>
    </nav>
  );
}
