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
  function navigate(path) { setOpen(false); onNavigate(path); }
  return (
    <nav className="navbar">
      <button className="navbar-brand" type="button" onClick={() => navigate("/")}>Vehemence</button>
      <div className={`navbar-links ${open ? "navbar-links-open" : ""}`}>
        {items.map(([path, label]) => <button key={path} className={`navbar-link ${activePath === path ? "navbar-link-active" : ""}`} type="button" onClick={() => navigate(path)}>{label}</button>)}
      </div>
      <button className="navbar-menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">☰</button>
    </nav>
  );
}
