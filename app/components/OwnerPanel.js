"use client";

import { useEffect, useState } from "react";
import { getListings } from "../marketplace/actions";
import { ownerDeleteAccount, ownerDeleteListing, ownerListAccounts } from "./owner-actions";
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
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsTruncated, setAccountsTruncated] = useState(false);
  const [accountSearch, setAccountSearch] = useState("");
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

  async function loadAccounts() {
    setAccountsLoading(true);
    setStatus("");
    try {
      const result = await ownerListAccounts();
      if (result?.error) setStatus(result.error);
      else {
        setAccounts(Array.isArray(result?.accounts) ? result.accounts : []);
        setAccountsTruncated(Boolean(result?.truncated));
      }
    } catch {
      setStatus("Could not load accounts. Try refreshing the list.");
    } finally {
      setAccountsLoading(false);
    }
  }

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
    if (action === "delete-account") {
      setStatus("Deleting account…");
      const result = await ownerDeleteAccount(username);
      if (result?.error) setStatus(result.error);
      else if (result?.success) {
        setStatus(`Account "${result.username}" was deleted and its sessions were revoked.`);
        setUsername("");
      } else setStatus("The server did not confirm account deletion. No success was reported.");
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
          {tab === "users" && <div className="owner-content"><section className="owner-form-card"><span className="owner-kicker">COMMUNITY / MODERATION</span><h2>User controls</h2><p>Choose an account and select the moderation action.</p><label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter exact username" autoComplete="off" /></label><div className="owner-action-grid"><button type="button" onClick={() => queueAction("ban")}><span className="owner-action-icon danger">⊘</span><strong>Ban user</strong><small>Restrict account access</small></button><button type="button" onClick={() => queueAction("mute")}><span className="owner-action-icon">◌</span><strong>Mute user</strong><small>Restrict chat privileges</small></button><button type="button" onClick={() => queueAction("delete-account")}><span className="owner-action-icon danger">×</span><strong>Delete account</strong><small>Permanently remove account</small></button></div></section></div>}
          {tab === "users" && <div className="owner-content"><section className="owner-form-card owner-account-card">
            <div className="owner-account-picker">
              <button className="owner-account-picker-toggle" type="button" aria-expanded={accountsOpen} onClick={() => { const next = !accountsOpen; setAccountsOpen(next); if (next && accounts.length === 0) loadAccounts(); }}>
                <span><strong>Account list</strong><small>Browse registered Vehemence accounts</small></span>
                <span className="owner-account-picker-actions">{accounts.length > 0 && <small>{accounts.length}{accountsTruncated ? "+" : ""} accounts</small>}<b>{accountsOpen ? "−" : "+"}</b></span>
              </button>
              {accountsOpen && <div className="owner-account-list">
                <div className="owner-account-list-head"><input aria-label="Search accounts" value={accountSearch} onChange={(e) => setAccountSearch(e.target.value)} placeholder="Search usernames…" autoComplete="off" /><button type="button" onClick={loadAccounts} disabled={accountsLoading}>{accountsLoading ? "Loading…" : "Refresh"}</button></div>
                {accountsLoading ? <p className="owner-account-empty">Loading accounts…</p> : accounts.filter((account) => String(account.username || "").toLowerCase().includes(accountSearch.trim().toLowerCase())).length === 0 ? <p className="owner-account-empty">{accountSearch.trim() ? "No usernames match your search." : "No accounts found."}</p> : accounts.filter((account) => String(account.username || "").toLowerCase().includes(accountSearch.trim().toLowerCase())).map((account) => <div className="owner-account-row" key={account.id}>
                  <span><strong>{account.username || "Unnamed account"}</strong><small>{account.created_at ? `Joined ${new Date(account.created_at).toLocaleDateString()}` : "Join date unavailable"}</small></span>
                  <button type="button" onClick={() => { setUsername(account.username || ""); setStatus(`Selected ${account.username || "account"}.`); }}>Select</button>
                </div>)}
                {accountsTruncated && <p className="owner-account-hint">Showing the 500 most recently created accounts. Search within this list.</p>}
              </div>}
            </div>
          </section></div>}
          {tab === "listings" && <div className="owner-content"><section className="owner-form-card"><span className="owner-kicker">MARKETPLACE / MODERATION</span><h2>Remove a listing</h2><p>Choose a listing below. Its ID will fill in automatically.</p><label>Listing ID<input value={listingId} onChange={(e) => setListingId(e.target.value)} placeholder="Select a listing below or paste ID" autoComplete="off" /></label><button className="owner-danger-button" type="button" onClick={() => queueAction("delete-listing")}>Delete listing <span>↗</span></button><div className="owner-listing-picker"><div className="owner-listing-picker-head"><strong>Marketplace listings</strong><button type="button" onClick={() => { setListingsLoading(true); getListings().then((result) => { if (result?.error) setStatus(result.error); else setListings(Array.isArray(result?.listings) ? result.listings : []); }).catch(() => setStatus("Could not load marketplace listings.")).finally(() => setListingsLoading(false)); }}>Refresh</button></div>{listingsLoading ? <p>Loading listings…</p> : listings.length === 0 ? <p>No listings returned. Make sure you're logged in and the marketplace is available.</p> : listings.map((item, index) => { const id = item.id ?? item.listing_id ?? item.listingId; const name = item.name ?? item.title ?? item.listing_name ?? "Untitled listing"; return <div className="owner-listing-row" key={String(id ?? index)}><span><strong>{String(name)}</strong><small>ID: {id == null ? "Unavailable" : String(id)}</small></span><button type="button" disabled={id == null} onClick={() => { setListingId(String(id)); setStatus(""); }}>Select</button></div>; })}</div></section></div>}
          {tab === "identity" && <div className="owner-content"><section className="owner-form-card"><span className="owner-kicker">COMMUNITY / BADGES</span><h2>Owner title</h2><p>Set the username that should display the Owner title.</p><label>Username<input value={titleUser} onChange={(e) => setTitleUser(e.target.value)} placeholder="Enter owner username" autoComplete="off" /></label><div className="owner-title-preview"><span className="owner-preview-avatar">V</span><span><strong>{titleUser.trim() || "Username"}</strong><small>Profile title preview</small></span><b>✦ OWNER</b></div><button className="owner-primary-button" type="button" onClick={() => setStatus("The Owner badge needs a persistent profile field and server-side update action before it can be assigned.")}>Assign Owner title <span>↗</span></button></section></div>}
          {status && <div className="owner-status" role="status">{status}</div>}
          {confirm && <div className="owner-confirm-backdrop"><section className="owner-confirm"><span className="owner-kicker">{action === "delete-account" ? "PERMANENT ACCOUNT DELETION" : "CONFIRM MODERATION"}</span><h2>{action === "ban" ? "Ban this user?" : action === "mute" ? "Mute this user?" : action === "delete-account" ? "Permanently delete this account?" : "Delete this listing?"}</h2><p>{action === "delete-listing" ? listingId : username}{action === "delete-account" ? " · This permanently removes the profile and related records configured to cascade. Existing sessions will be revoked." : " · This action will need a connected moderation backend to execute."}</p><div><button type="button" className="owner-secondary-button" onClick={() => setConfirm(false)}>Cancel</button><button type="button" className="owner-danger-button" onClick={runAction}>Confirm action</button></div></section></div>}
          <footer className="owner-footer"><span><i /> PRIVATE WORKSPACE</span><span>VEHEMENCE OWNER TOOLS</span></footer>
        </main>
      </section>
    </div>
  );
}
