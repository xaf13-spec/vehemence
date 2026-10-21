"use client";

import { useEffect, useMemo, useState } from "react";

const FILTERS = ["all", "unread", "friends", "messages", "system"];

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem("vehemence_notifications") || "[]");
    return Array.isArray(saved) ? saved.filter((item) => item && item.id) : [];
  } catch { return []; }
}

function category(item) {
  const value = String(item.type || "").toLowerCase();
  if (value.includes("friend")) return "friends";
  if (value.includes("message") || value.includes("chat")) return "messages";
  return "system";
}

function relativeTime(item) {
  const date = new Date(item.createdAt || item.timestamp || "");
  if (Number.isNaN(date.getTime())) return "recent";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric" }).format(date);
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const sync = () => setNotifications(readSaved());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("vehemence-notifications-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vehemence-notifications-changed", sync);
    };
  }, []);

  function persist(next) {
    setNotifications(next);
    localStorage.setItem("vehemence_notifications", JSON.stringify(next));
    window.dispatchEvent(new Event("vehemence-notifications-changed"));
  }

  function markRead(id) {
    persist(notifications.map((item) => item.id === id ? { ...item, read: true } : item));
  }

  function markAllRead() {
    persist(notifications.map((item) => ({ ...item, read: true })));
  }

  function removeOne(id) {
    persist(notifications.filter((item) => item.id !== id));
  }

  function clearRead() {
    persist(notifications.filter((item) => !item.read));
  }

  const unreadCount = notifications.filter((item) => !item.read).length;
  const visible = useMemo(() => notifications.filter((item) => {
    if (filter === "unread" && item.read) return false;
    if (!["all", "unread"].includes(filter) && category(item) !== filter) return false;
    const search = query.trim().toLowerCase();
    return !search || `${item.title || ""} ${item.text || ""} ${item.type || ""}`.toLowerCase().includes(search);
  }), [notifications, filter, query]);

  return <main className="notifications-page">
    <div className="notifications-container">
      <header className="notifications-header">
        <div><p className="eyebrow">VEHEMENCE / INBOX</p><h1>Notifications</h1><p className="notifications-subtitle">{unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}` : "you're all caught up"}</p></div>
        <div className="notifications-actions">
          <button className="secondary-button" onClick={markAllRead} disabled={!unreadCount}>mark all read</button>
          <button className="secondary-button" onClick={clearRead} disabled={!notifications.some((item) => item.read)}>clear read</button>
        </div>
      </header>
      <section className="notifications-toolbar">
        <div className="notification-filters" role="tablist" aria-label="Filter notifications">
          {FILTERS.map((item) => <button type="button" role="tab" aria-selected={filter === item} className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}{item === "unread" && unreadCount > 0 ? ` · ${unreadCount}` : ""}</button>)}
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="search notifications" aria-label="Search notifications" />
      </section>
      <section className="notifications-card">
        {visible.length ? visible.map((item) => <article className={`notification-item ${item.read ? "read" : "unread"}`} key={item.id}>
          <span className="notification-dot" aria-hidden="true" />
          <div className="notification-content">
            <div className="notification-top"><h2>{item.title || "Notification"}</h2><span>{item.type || "System"}</span></div>
            <p>{item.text || ""}</p>
            <div className="notification-meta"><time>{relativeTime(item)}</time>{!item.read && <button type="button" onClick={() => markRead(item.id)}>mark read</button>}<button type="button" onClick={() => removeOne(item.id)}>dismiss</button></div>
          </div>
        </article>) : <div className="notification-empty"><h2>{query ? "no matching notifications" : filter === "unread" ? "nothing unread" : "you're all caught up"}</h2><p>{query ? "try a different search." : "new messages and account updates will show up here."}</p></div>}
      </section>
    </div>
  </main>;
}
