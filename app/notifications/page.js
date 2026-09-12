"use client";

import { useEffect, useState } from "react";

const defaults = [
  { id: "welcome", title: "Welcome to Vehemence", text: "Your notification center is ready.", type: "System", read: false },
  { id: "explore", title: "Explore the Games page", text: "Search, filter, favorite, and continue playing games from one place.", type: "System", read: false }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(defaults);
  useEffect(() => { const saved = localStorage.getItem("vehemence_notifications"); if (saved) setNotifications(JSON.parse(saved)); }, []);
  function persist(next) { setNotifications(next); localStorage.setItem("vehemence_notifications", JSON.stringify(next)); window.dispatchEvent(new Event("vehemence-notifications-changed")); }
  function markAllRead() { persist(notifications.map((item) => ({ ...item, read: true }))); }
  function clearAll() { persist([]); }
  return <main className="notifications-page"><div className="notifications-container"><header className="notifications-header"><div><p className="eyebrow">VEHEMENCE</p><h1>Notifications</h1><p>Keep up with your Vehemence activity.</p></div><div className="notifications-actions"><button className="secondary-button" onClick={markAllRead}>Mark all read</button><button className="secondary-button" onClick={clearAll}>Clear all</button></div></header><section className="notifications-card">{notifications.length ? notifications.map((item) => <article className={`notification-item ${item.read ? "read" : ""}`} key={item.id}><span className="notification-dot" /><div><div className="notification-top"><h2>{item.title}</h2><span>{item.type}</span></div><p>{item.text}</p></div></article>) : <div className="notification-empty"><h2>You’re all caught up</h2><p>New notifications will appear here.</p></div>}</section></div></main>;
}
