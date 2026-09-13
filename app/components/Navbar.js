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
  ["/profile", "Profile"],
  ["/settings", "Settings"]
];

export default function Navbar() {
  const pathname = usePathname();
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

  const currentPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  return (
    <nav className="navbar">
      <Link href="/" className="logo">VEHEMENCE</Link>
      <div className="nav-links">
        {navItems.map(([href, label]) => (
          <Link href={href} className={`nav-link ${currentPath === href ? "active" : ""}`} key={href} aria-current={currentPath === href ? "page" : undefined}>
            <span>{label}</span>
            {currentPath === href && <span className="nav-active-bubble" aria-hidden="true" />}
          </Link>
        ))}
      </div>
      <Link href="/notifications" className={`notification-nav ${currentPath === "/notifications" ? "active" : ""}`} aria-label="Notifications">
        <span className="notification-bell">🔔</span>
        {unread > 0 && <span className="notification-count">{unread > 9 ? "9+" : unread}</span>}
      </Link>
    </nav>
  );
}
