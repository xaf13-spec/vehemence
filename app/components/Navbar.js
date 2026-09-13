"use client";

import { useEffect, useState } from "react";

const defaultNotifications = [
  { id: "welcome", title: "Welcome to Vehemence", text: "Your notification center is ready.", type: "System", read: false }
];

const navItems = [
  ["/", "Home"],
  ["/music", "Music"],
  ["/entertainment", "Entertainment"],
  ["/soundboard", "Soundboard"],
  ["/marketplace", "Marketplace"],
  ["/profile", "Profile"],
  ["/friends", "Friends"],
  ["/settings", "Settings"]
];

export default function Navbar({ activePath = "/", onNavigate }) {
  const [unread, setUnread] = useState(0);
  const [navMode, setNavMode] = useState("top");
  const [now, setNow] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("vehemence_notifications")) localStorage.setItem("vehemence_notifications", JSON.stringify(defaultNotifications));
    const updateNotifications = () => {
      try {
        const items = JSON.parse(localStorage.getItem("vehemence_notifications") || "[]");
        setUnread(items.filter((item) => !item.read).length);
      } catch { setUnread(0); }
    };
    const updateNav = () => setNavMode(localStorage.getItem("vehemence_nav_mode") || "top");
    const updateClock = () => setNow(new Date());
    updateNotifications(); updateNav(); updateClock();
    window.addEventListener("storage", updateNotifications);
    window.addEventListener("vehemence-notifications-changed", updateNotifications);
    window.addEventListener("vehemence-navigation-changed", updateNav);
    const timer = setInterval(updateClock, 1000);
    return () => {
      window.removeEventListener("storage", updateNotifications);
      window.removeEventListener("vehemence-notifications-changed", updateNotifications);
      window.removeEventListener("vehemence-navigation-changed", updateNav);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => { document.documentElement.setAttribute("data-nav-mode", navMode); }, [navMode]);

  const side = navMode === "side";
  const parts = now ? new Intl.DateTimeFormat("en-US", { timeZone: "America/Toronto", hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }).formatToParts(now) : [];
  const amPm = parts.find((part) => part.type === "dayPeriod")?.value || "--";
  const hour = parts.find((part) => part.type === "hour")?.value || "--";
  const minute = parts.find((part) => part.type === "minute")?.value || "--";
  const second = parts.find((part) => part.type === "second")?.value || "--";
  const date = now ? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(now) : "Loading date...";

  return (
    <nav className={`navbar ${side ? "navbar-side" : ""}`}>
      <button type="button" className="logo" onClick={() => onNavigate?.("/")}>VEHEMENCE</button>
      <div className="nav-links">
        {navItems.map(([href, label]) => {
          const active = activePath === href;
          return <button type="button" className={`nav-link ${active ? "active" : ""}`} key={href} onClick={() => onNavigate?.(href)} aria-current={active ? "page" : undefined}><span>{label}</span>{active && <span className="nav-active-bubble" aria-hidden="true" />}</button>;
        })}
      </div>
      <div className="navbar-status">
        <button type="button" onClick={() => onNavigate?.("/notifications")} className={`notification-nav ${activePath === "/notifications" ? "active" : ""}`} aria-label="Notifications"><span className="notification-bell">🔔</span>{unread > 0 && <span className="notification-count">{unread > 9 ? "9+" : unread}</span>}</button>
        <div className="navbar-clock" aria-label="Ontario time and date"><span className="navbar-clock-period">{amPm}</span><strong>{hour}:{minute}:{second}</strong><span>{date} · Ontario / New York</span></div>
      </div>
    </nav>
  );
}
