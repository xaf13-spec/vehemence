"use client";

import { useMemo, useState } from "react";

const navItems = [
  ["/", "Home"],
  ["/music", "Music"],
  ["/entertainment", "Entertainment"],
  ["/soundboard", "Soundboard"],
  ["/marketplace", "Marketplace"],
  ["/profile", "Profile"],
  ["/friends", "Friends"],
  ["/settings", "Settings"],
];

export default function Navbar({ activePath, onNavigate }) {
  const [open, setOpen] = useState(false);
  const items = useMemo(() => navItems, []);

  function navigate(path) {
    setOpen(false);
    onNavigate(path);
  }

  return (
    <nav className="navbar">
      <button className="logo" type="button" onClick={() => navigate("/")}>
        Vehemence
      </button>

      <div className="nav-links">
        {items.map(([path, label]) => (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className="nav-link-button"
            style={activePath === path ? {
              color: "#ffffff",
              background: "rgba(255, 255, 255, 0.07)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.08)"
            } : undefined}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        className="navbar-menu-button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>
    </nav>
  );
}
