"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import OwnerPanel from "./OwnerPanel";
import { isOwnerAccount } from "./owner-actions";

const defaultNotifications = [{ id: "welcome", title: "Welcome to Vehemence", text: "Your notification center is ready.", type: "System", read: false }];
const navItems = [["/", "Home"], ["/games", "Games"], ["/browser", "Browser"], ["/soundboard", "Soundboard"], ["/marketplace", "Marketplace"], ["/profile", "Profile"], ["/friends", "Friends"], ["/settings", "Settings"], ["/notifications", "Notifications"]];
const commandItems = navItems.map(([path, label]) => ({ id: path, label, detail: `Go to ${label}`, path, icon: ({ Home: "⌂", Games: "▦", Browser: "◫", Soundboard: "♫", Marketplace: "◇", Profile: "◎", Friends: "♧", Settings: "⚙", Notifications: "◌" })[label] }));

export default function Navbar({ activePath = "/", onNavigate }) {
  const [unread, setUnread] = useState(0);
  const [navMode, setNavMode] = useState("top");
  const [now, setNow] = useState(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const commandInput = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("vehemence_notifications")) localStorage.setItem("vehemence_notifications", JSON.stringify(defaultNotifications));
    const updateNotifications = () => { try { const items = JSON.parse(localStorage.getItem("vehemence_notifications") || "[]"); setUnread(items.filter((item) => !item.read).length); } catch { setUnread(0); } };
    const updateNav = () => setNavMode(localStorage.getItem("vehemence_nav_mode") || "top");
    const updateClock = () => setNow(new Date());

    const openPalette = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(true); }
      if (event.key === "Escape") setCommandOpen(false);

    };
    updateNotifications(); updateNav(); updateClock();
    window.addEventListener("storage", updateNotifications);
    window.addEventListener("vehemence-notifications-changed", updateNotifications);
    window.addEventListener("vehemence-navigation-changed", updateNav);
    window.addEventListener("keydown", openPalette);
    const timer = setInterval(updateClock, 1000);
    return () => { window.removeEventListener("storage", updateNotifications); window.removeEventListener("vehemence-notifications-changed", updateNotifications); window.removeEventListener("vehemence-navigation-changed", updateNav); window.removeEventListener("keydown", openPalette); clearInterval(timer); };
  }, []);

  useEffect(() => { document.documentElement.setAttribute("data-nav-mode", navMode); }, [navMode]);
  useEffect(() => {
    let cancelled = false;
    isOwnerAccount().then((result) => {
      if (!cancelled) setIsOwner(Boolean(result?.isOwner));
    }).catch(() => {
      if (!cancelled) setIsOwner(false);
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (commandOpen) {
      setCommandQuery("");
      setCommandIndex(0);
      requestAnimationFrame(() => commandInput.current?.focus());
    }
  }, [commandOpen]);

  const side = navMode === "side";
  const parts = now ? new Intl.DateTimeFormat("en-US", { timeZone: "America/Toronto", hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }).formatToParts(now) : [];
  const amPm = parts.find((part) => part.type === "dayPeriod")?.value || "--";
  const hour = parts.find((part) => part.type === "hour")?.value || "--";
  const minute = parts.find((part) => part.type === "minute")?.value || "--";
  const second = parts.find((part) => part.type === "second")?.value || "--";
  const date = now ? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(now) : "Loading date...";
  const handle = (event, path) => { event.preventDefault(); onNavigate?.(path); setCommandOpen(false); };
  const filteredCommands = useMemo(() => commandItems.filter((item) => `${item.label} ${item.detail} ${item.path}`.toLowerCase().includes(commandQuery.trim().toLowerCase())), [commandQuery]);
  useEffect(() => { setCommandIndex(0); }, [commandQuery]);
  const runCommand = (item) => { if (!item) return; onNavigate?.(item.path); setCommandOpen(false); };

  return <>
    <nav className={`navbar ${side ? "navbar-side" : ""}`}>
      <a href="/" className="logo" onClick={(event) => handle(event, "/")}>VEHEMENCE</a>
      <div className="nav-links">
        {navItems.slice(0, 8).map(([href, label]) => { const active = activePath === href; return <a href={href} className={`nav-link ${active ? "active" : ""}`} key={href} onClick={(event) => handle(event, href)} aria-current={active ? "page" : undefined}><span>{label}</span>{active && <span className="nav-active-bubble" aria-hidden="true" />}</a>; })}
      </div>
      <div className="navbar-status">\n        {isOwner && <button type="button" className="command-trigger" onClick={() => setOwnerOpen(true)} title="Open owner control center">Owner Panel</button>}
        <button type="button" className="command-trigger" onClick={() => setCommandOpen(true)} aria-label="Open command menu" title="Command menu (Ctrl+K)"><span>⌕</span><kbd>Ctrl K</kbd></button>
        <a href="/notifications" onClick={(event) => handle(event, "/notifications")} className={`notification-nav ${activePath === "/notifications" ? "active" : ""}`} aria-label="Notifications"><span className="notification-bell">♧</span>{unread > 0 && <span className="notification-count">{unread > 9 ? "9+" : unread}</span>}</a>
        <div className="navbar-clock" aria-label="Ontario time and date"><span className="navbar-clock-period">{amPm}</span><strong>{hour}:{minute}:{second}</strong><span>{date} · Ontario / New York</span></div>
      </div>
    </nav>
    {ownerOpen && <OwnerPanel onClose={() => setOwnerOpen(false)} />}
    {commandOpen && <div className="command-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCommandOpen(false); }}>
      <section className="command-panel" role="dialog" aria-modal="true" aria-label="Vehemence command menu">
        <div className="command-search-row"><span aria-hidden="true">⌕</span><input ref={commandInput} value={commandQuery} onChange={(event) => setCommandQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setCommandIndex((index) => Math.min(index + 1, Math.max(0, filteredCommands.length - 1))); } else if (event.key === "ArrowUp") { event.preventDefault(); setCommandIndex((index) => Math.max(0, index - 1)); } else if (event.key === "Enter") { event.preventDefault(); runCommand(filteredCommands[commandIndex]); } }} placeholder="Search pages and actions..." aria-label="Search commands" /><kbd>ESC</kbd></div>
        <div className="command-section-label">{commandQuery ? "MATCHING DESTINATIONS" : "QUICK NAVIGATION"}</div>
        <div className="command-results">
          {filteredCommands.map((item) => <button type="button" className={`command-result ${activePath === item.path ? "is-current" : ""} ${filteredCommands[commandIndex]?.id === item.id ? "is-selected" : ""}`} key={item.id} onMouseEnter={() => setCommandIndex(filteredCommands.findIndex((candidate) => candidate.id === item.id))} onClick={() => runCommand(item)}><span className="command-result-icon">{item.icon}</span><span className="command-result-copy"><strong>{item.label}</strong><small>{item.detail}</small></span>{activePath === item.path ? <span className="command-current">CURRENT</span> : <span className="command-enter">↵</span>}</button>)}
          {filteredCommands.length === 0 && <div className="command-empty"><strong>No matching destination</strong><span>Try “games”, “friends”, or “settings”.</span></div>}
        </div>
        <footer className="command-footer"><span><kbd>↵</kbd> Open destination</span><span><kbd>ESC</kbd> Close menu</span><span className="command-brand">VEHEMENCE / COMMAND</span></footer>
      </section>
    </div>}
  </>;
}
