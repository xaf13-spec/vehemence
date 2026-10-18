"use client";

import { useEffect, useState } from "react";
import { getListings } from "../marketplace/actions";
import { ownerDeleteListing } from "./owner-actions";
import "./owner-panel.css";

const tabs = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "users", label: "User controls", icon: "◎" },
  { id: "listings", label: "Listings", icon: "◇" },
  { id: "identity", label: "Owner title", icon: "✦" },
];

export default function OwnerPanel({ onClose }) {
  const [tab, setTab] = useState("overview");
  const [username, setUsername] = useState("");
  const [listingId, setListingId] = useState("");
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [titleUser, setTitleUser] = useState("");
  const [status, setStatus] = useState("");
  const [action, setAction] = useState("");
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const keydown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", keydown);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", keydown); document.body.style.overflow = ""; };
  }, [onClose]);

  useEffect(() => {
    if (tab !== "listings") return;
    let cancelled = false;
    setListingsLoading(true);
    getListings().then((result) => {
      if (cancelled) return;
      if (result?.error) setStatus(result.error);
      else setListings(Array.isArray(result?.listings) ? result.listings : []);
    }).catch(() => {
      if (!cancelled) setStatus("Could not load marketplace listings.");
    }).finally(() => {
      if (!cancelled) setListingsLoading(false);
    });
    return () => { cancelled = true; };
  }, [tab]);

  function queueAction(kind) {
    setStatus("");
    if (kind === "delete-listing" && !listingId.trim()) return setStatus("Enter the listing ID first.");
    if (kind !== "delete-listing" && !username.trim()) return setStatus("Enter a username first.");
    setAction(kind);
    setConfirm(true);
  }

  async function runAction() {
    setConfirm(false);
    setStatus("");
    if (action === "delete-listing") {
      setStatus("Deleting listing…");
      const result = await ownerDeleteListing(listingId.trim());
      if (result?.error) {
        setStatus(result.error);
      } else if (result?.success || result?.listing || result?.data) {
        setStatus("Listing deletion request completed.");
      } else {
        setStatus("The server did not confirm deletion. Check the listing ID and database permissions.");
      }
      return;
    }
    setStatus("Ban and mute still need moderation RPCs in Supabase before they can safely change accounts.");
  }

  return (
    <div className="owner-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="owner-window" role="dialog" aria-modal="true" aria-label="Vehemence owner panel">
        <aside className="owner-sidebar">
          <div className="owner-brand"><span className="owner-brand-mark">V</span><div><strong>VEHEMENCE</strong><small>CONTROL CENTER</small></div></div>
          <div className="owner-sidebar-label">WORKSPACE</div>
          <nav className="owner-tabs">{tabs.map((item) => <button key={item.id} type="button" className={tab === item.id ? "owner-tab active" : "owner-tab"} onClick={() => { setTab(item.id); setStatus(""); setConfirm(false); }}><span>{item.icon}</span>{item.label}{tab === item.id && <i />}</button>)}</nav>
          <div className="owner-sidebar-bottom"><span className="owner-live-dot" /> LOCAL PANEL <span>·</span> v1.0</div>
        </aside>
        <main className="owner-main">
          <header className="owner-topbar"><div><span className="owner-crumb">VEHEMENCE <span>/</span> OWNER</span><h1>{tabs.find((item) => item.id === tab)?.label}</h1></div><button className="owner-close" onClick={onClose} aria-label="Close owner panel" type="button">×</button></header>
          {tab === "overview" && <div className="owner-content">
            <section className="owner-welcome"><div><span className="owner-kicker">OWNER WORKSPACE</span><h2>Good to have you here.</h2><p>Quick access to community moderation and marketplace management.</p></div><div className="owner-orbit"><span>V</span></div></section>
            <div className="owner-stat-grid"><article><span>01 / COMMUNITY</span><strong>User controls</strong><p>Manage access and chat privileges.</p><button onClick={() => setTab("users")} type="button">Open controls <span>↗</span></button></article><article><span>02 / MARKETPLACE</span><strong>Listing tools</strong><p>Review and remove marketplace content.</p><button onClick={() => setTab("listings")} type="button">Manage listings <span>↗</span></button></article><article><span>03 / IDENTITY</span><strong>Owner title</strong><p>Manage the visible owner badge.</p><button onClick={() => setTab("identity")} type="button">Edit title <span>↗</span></button></article></div>
            <div className="owner-note"><span>i</span><p>Owner access is assigned automatically to the configured owner account. Owner-only actions are verified on the server before they run.</p></div>
          </div>}
          {tab === "users" && <div className="owner-content"><section className="owner-form-card"><span className="owner-kicker">COMMUNITY / MODERATION</span><h2>User controls</h2><p>Choose an account and select the moderation action.</p><label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter exact username" autoComplete="off" /></label><div className="owner-action-grid"><button type="button" onClick={() => queueAction("ban")}><span className="owner-action-icon danger">⊘</span><strong>Ban user</strong><small>Restrict account access</small></button><button type="button" onClick={() => queueAction("mute")}><span className="owner-action-icon">◌</span><strong>Mute user</strong><small>Restrict chat privileges</small></button></div></section></div>}
          {tab === "listings" && <div className="owner-content"><section className="owner-form-card"><span className="owner-kicker">MARKETPLACE / MODERATION</span><h2>Remove a listing</h2><p>Choose a listing below. Its ID will fill in automatically.</p><label>Listing ID<input value={listingId} onChange={(e) => setListingId(e.target.value)} placeholder="Select a listing below or paste ID" autoComplete="off" /></label><button className="owner-danger-button" type="button" onClick={() => queueAction("delete-listing")}>Delete listing <span>↗</span></button><div className="owner-listing-picker"><div className="owner-listing-picker-head"><strong>Marketplace listings</strong><button type="button" onClick={() => { setListingsLoading(true); getListings().then((result) => { if (result?.error) setStatus(result.error); else setListings(Array.isArray(result?.listings) ? result.listings : []); }).catch(() => setStatus("Could not load marketplace listings.")).finally(() => setListingsLoading(false)); }}>Refresh</button></div>{listingsLoading ? <p>Loading listings…</p> : listings.length === 0 ? <p>No listings returned. Make sure you're logged in and the marketplace is available.</p> : listings.map((item, index) => { const id = item.id ?? item.listing_id ?? item.listingId; const name = item.name ?? item.title ?? item.listing_name ?? "Untitled listing"; return <div className="owner-listing-row" key={String(id ?? index)}><span><strong>{String(name)}</strong><small>ID: {id == null ? "Unavailable" : String(id)}</small></span><button type="button" disabled={id == null} onClick={() => { setListingId(String(id)); setStatus(""); }}>Select</button></div>; })}</div></section></div>}
          {tab === "identity" && <div className="owner-content"><section className="owner-form-card"><span className="owner-kicker">COMMUNITY / BADGES</span><h2>Owner title</h2><p>Set the username that should display the Owner title.</p><label>Username<input value={titleUser} onChange={(e) => setTitleUser(e.target.value)} placeholder="Enter owner username" autoComplete="off" /></label><div className="owner-title-preview"><span className="owner-preview-avatar">V</span><span><strong>{titleUser.trim() || "Username"}</strong><small>Profile title preview</small></span><b>✦ OWNER</b></div><button className="owner-primary-button" type="button" onClick={() => setStatus("The Owner badge needs a persistent profile field and server-side update action before it can be assigned.")}>Assign Owner title <span>↗</span></button></section></div>}
          {status && <div className="owner-status" role="status">{status}</div>}
          {confirm && <div className="owner-confirm-backdrop"><section className="owner-confirm"><span className="owner-kicker">CONFIRM MODERATION</span><h2>{action === "ban" ? "Ban this user?" : action === "mute" ? "Mute this user?" : "Delete this listing?"}</h2><p>{action === "delete-listing" ? listingId : username} · This action will need a connected moderation backend to execute.</p><div><button type="button" className="owner-secondary-button" onClick={() => setConfirm(false)}>Cancel</button><button type="button" className="owner-danger-button" onClick={runAction}>Confirm action</button></div></section></div>}
          <footer className="owner-footer"><span><i /> PRIVATE WORKSPACE</span><span>VEHEMENCE OWNER TOOLS</span></footer>
        </main>
      </section>
    </div>
  );
}
