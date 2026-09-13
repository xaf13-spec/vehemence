"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const defaultNotifications = [
  { id: "welcome", title: "Welcome to Vehemence", text: "Your notification center is ready.", type: "System", read: false }
];

const navItems = [
  ["/", "Home"],
  ["/rules", "Rules"],
  ["/music", "Music"],
  ["/entertainment", "Entertainment"],
  ["/soundboard", "Soundboard"],
  ["/profile", "Profile"],
  ["/friends", "Friends"],
  ["/settings", "Settings"]
];

export default function Navbar() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);
  const [navMode, setNavMode] = useState("top");
  const [now, setNow] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("vehemence_notifications")) localStorage.setItem("vehemence_notifications", JSON.stringify(defaultNotifications));
    const update = () => {
      try { setUnread(JSON.parse(localStorage.getItem("vehemence_notifications") || "[]").filter((item) => !item.read).length); } catch { setUnread(0); }
    };
    const updateNav = () => setNavMode(localStorage.getItem("vehemence_nav_mode") || "top");
    const updateClock = () => setNow(new Date());
    update();
    updateNav();
    updateClock();
    window.addEventListener("storage", update);
    window.addEventListener("vehemence-notifications-changed", update);
    window.addEventListener("vehemence-navigation-changed", updateNav);
    const timer = setInterval(updateClock, 1000);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("vehemence-notifications-changed", update);
      window.removeEventListener("vehemence-navigation-changed", updateNav);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-nav-mode", navMode);
  }, [navMode]);

  const currentPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const side = navMode === "side";
  const parts = now ? new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).formatToParts(now) : [];
  const amPm = parts.find((part) => part.type === "dayPeriod")?.value || "--";
  const hour = parts.find((part) => part.type === "hour")?.value || "--";
  const minute = parts.find((part) => part.type === "minute")?.value || "--";
  const second = parts.find((part) => part.type === "second")?.value || "--";
  const date = now ? new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(now) : "Loading date...";

  return (
    <nav className={`navbar ${side ? "navbar-side" : ""}`}>
      <Link href="/" className="logo">VEHEMENCE</Link>
      <div className="nav-links">
        {navItems.map(([href, label]) => (
          <Link href={href} className={`nav-link ${currentPath === href ? "active" : ""}`} key={href} aria-current={currentPath === href ? "page" : undefined}>
            <span>{label}</span>
            {currentPath === href && <span className="nav-active-bubble" aria-hidden="true" />}
          </Link>
        ))}
      </div>
      <div className="navbar-status">
        <Link href="/notifications" className={`notification-nav ${currentPath === "/notifications" ? "active" : ""}`} aria-label="Notifications">
          <span className="notification-bell">🔔</span>
          {unread > 0 && <span className="notification-count">{unread > 9 ? "9+" : unread}</span>}
        </Link>
        <div className="navbar-clock" aria-label="Ontario time and date">
          <span className="navbar-clock-period">{amPm}</span>
          <strong>{hour}:{minute}:{second}</strong>
          <span>{date} · Ontario / New York</span>
        </div>
      </div>
    </nav>
  );
}
