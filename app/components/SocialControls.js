"use client";

import { useEffect, useState } from "react";

export default function SocialControls() {
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [statusResponse, blocksResponse] = await Promise.all([
        fetch("/api/custom-status", { cache: "no-store" }),
        fetch("/api/blocks", { cache: "no-store" })
      ]);
      const statusData = await statusResponse.json();
      const blockData = await blocksResponse.json();
      if (statusResponse.ok) { setStatus(statusData.status || ""); setDraft(statusData.status || ""); }
      if (blocksResponse.ok) setBlocks(blockData.blocks || []);
    } catch { setError("Could not load social settings."); }
  }

  useEffect(() => { load(); }, []);

  async function saveStatus(event) {
    event.preventDefault();
    setSaving(true); setNotice(""); setError("");
    try {
      const response = await fetch("/api/custom-status", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: draft })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save status.");
      setStatus(data.status); setDraft(data.status); setNotice(data.status ? "status saved." : "status cleared.");
      window.dispatchEvent(new Event("vehemence-status-changed"));
    } catch (err) { setError(err.message || "Could not save status."); }
    finally { setSaving(false); }
  }

  async function unblock(userId) {
    setError(""); setNotice("");
    try {
      const response = await fetch("/api/blocks", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unblock", userId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not unblock user.");
      setBlocks((items) => items.filter((item) => item.userId !== userId));
      window.dispatchEvent(new Event("vehemence-blocks-changed"));
      setNotice("user unblocked.");
    } catch (err) { setError(err.message || "Could not unblock user."); }
  }

  return <section className="settings-section">
    <div className="settings-section-header"><h2>social</h2></div>
    <div className="settings-card social-controls-card">
      <form className="social-status-form" onSubmit={saveStatus}>
        <div><h3>custom status</h3><p>let people know what you're up to. max 80 characters.</p></div>
        <div className="social-status-controls">
          <input value={draft} maxLength={80} onChange={(event) => setDraft(event.target.value)} placeholder="e.g. playing games" aria-label="Custom status" />
          <button className="secondary-button" type="submit" disabled={saving || draft.trim() === status}>{saving ? "saving..." : "save status"}</button>
          <button className="secondary-button" type="button" onClick={() => setDraft("")} disabled={!draft}>clear</button>
        </div>
        <span className="social-status-count">{draft.length}/80</span>
      </form>
      <div className="social-block-list">
        <div><h3>blocked users</h3><p>their online chat messages stay hidden from you, and their group voice audio stays muted for you.</p></div>
        {blocks.length ? blocks.map((item) => <div className="social-block-row" key={item.userId}><span>{item.username}</span><button className="secondary-button" type="button" onClick={() => unblock(item.userId)}>unblock</button></div>) : <p className="social-block-empty">you haven't blocked anyone.</p>}
      </div>
      {error && <p className="auth-error social-controls-message">{error}</p>}
      {notice && <p className="settings-success social-controls-message">{notice}</p>}
    </div>
  </section>;
}
