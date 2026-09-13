"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const defaultNotifications = [
  { id: "welcome", title: "Welcome to Vehemence", text: "Your notification center is ready.", type: "System", read: false },
  { id: "explore", title: "Explore the Games page", text: "Search, filter, favorite, and continue playing games from one place.", type: "System", read: false }
];

const navItems = [
  ["/", "Home"],
  ["/rules", "Rules"],
  ["/games", "Games"],
  ["/browser", "Browser"],
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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!localStorage.getItem("vehemence_notifications")) localStorage.setItem("vehemence_notifications", JSON.stringify(defaultNotifications));
    const update = () => {
      try { setUnread(JSON.parse(localStorage.getItem("vehemence_notifications") || "[]").filter((item) => !item.read).length); } catch { setUnread(0); }
    };
    const updateNav = () => setNavMode(localStorage.getItem("vehemence_nav_mode") || "top");
    update();
    updateNav();
    window.addEventListener("storage", update);
    window.addEventListener("vehemence-notifications-changed", update);
    window.addEventListener("vehemence-navigation-changed", updateNav);
    const timer = setInterval(() => setNow(new Date()), 1000);
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
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(now);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short"
  }).format(now);

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
          <strong>{time}</strong>
          <span>{date} · Ontario / New York</span>
        </div>
      </div>
    </nav>
  );
}
