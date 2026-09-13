"use client";

import { useEffect, useMemo, useState } from "react";
import { createListing, deleteListing, getListings } from "./actions";

const inputStyle = { width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: 10, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.045)", color: "#fff", outline: "none" };
const buttonStyle = { border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "10px 14px", color: "#fff", background: "rgba(255,255,255,.07)", cursor: "pointer", fontWeight: 700 };

export default function MarketplaceClient({ user, onNavigate }) {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", image_url: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadListings() {
    setLoading(true);
    const result = await getListings();
    if (result?.error) setMessage(result.error); else setListings(result.listings || []);
    setLoading(false);
  }

  useEffect(() => { loadListings(); }, []);
  const filtered = useMemo(() => { const query = search.trim().toLowerCase(); if (!query) return listings; return listings.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(query)); }, [listings, search]);
  function updateForm(key, value) { setForm((current) => ({ ...current, [key]: value })); }

  async function submitListing(event) {
    event.preventDefault(); setMessage(""); const price = Number(form.price);
    if (!form.name.trim() || !form.description.trim() || form.price === "") return setMessage("Fill out the name, description, and price.");
    if (!Number.isFinite(price) || price < 0) return setMessage("Enter a valid price.");
    setSaving(true); const result = await createListing({ ...form, price });
    if (result?.error) setMessage(result.error); else { setListings((current) => [result.listing, ...current]); setForm({ name: "", description: "", price: "", image_url: "" }); setCreating(false); setSelected(result.listing); }
    setSaving(false);
  }

  async function handleDelete(listing) {
    if (listing.seller_id !== user?.id || !window.confirm("Delete this listing?")) return;
    setMessage(""); const result = await deleteListing(listing.id);
    if (result?.error) setMessage(result.error); else { setListings((current) => current.filter((item) => item.id !== listing.id)); setSelected(null); }
  }

  function messageSeller(username) {
    window.dispatchEvent(new CustomEvent("vehemence-open-chat", { detail: { username } }));
    onNavigate?.("/friends");
  }

  if (selected) {
    const own = selected.seller_id === user?.id;
    return (
      <main className="games-page">
        <header className="games-header"><div><p className="eyebrow">VEHEMENCE</p><h1>Marketplace</h1></div></header>
        <section className="game-section">
          <button type="button" onClick={() => setSelected(null)} style={{ ...buttonStyle, marginBottom: 14 }}>← Back to Marketplace</button>
          <div style={{ maxWidth: 850, margin: "0 auto", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: 24, background: "rgba(17,17,24,.82)" }}>
            {selected.image_url && <img src={selected.image_url} alt="" style={{ width: "100%", maxHeight: 430, objectFit: "contain", borderRadius: 12, marginBottom: 20, background: "#08080c" }} />}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}><div><h2 style={{ margin: 0, fontSize: 28 }}>{selected.name}</h2><p style={{ margin: "8px 0 0", opacity: .55 }}>Seller: {selected.seller_username}</p></div><strong style={{ fontSize: 24 }}>${Number(selected.price).toFixed(2)}</strong></div>
            <p style={{ marginTop: 24, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selected.description}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              {selected.seller_id !== user?.id && <button type="button" style={buttonStyle} onClick={() => messageSeller(selected.seller_username)}>Message Seller</button>}
              {own && <button type="button" onClick={() => handleDelete(selected)} style={{ ...buttonStyle, borderColor: "rgba(255,80,80,.3)", background: "rgba(255,60,60,.08)" }}>Delete Listing</button>}
            </div>
            {message && <p style={{ marginTop: 14, opacity: .7 }}>{message}</p>}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="games-page">
      <header className="games-header"><div><p className="eyebrow">VEHEMENCE</p><h1>Marketplace</h1></div></header>
      <section className="game-section">
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search listings..." aria-label="Search listings" style={{ ...inputStyle, flex: 1, minWidth: 220 }} /><button type="button" className="primary-button" onClick={() => { setCreating(true); setMessage(""); }}>Create Listing</button></div>
        {creating && <form onSubmit={submitListing} style={{ marginBottom: 22, padding: 20, borderRadius: 15, border: "1px solid rgba(255,255,255,.08)", background: "rgba(17,17,24,.82)" }}><h2 style={{ marginTop: 0 }}>Create Listing</h2><div style={{ display: "grid", gap: 12 }}><input required value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Item name" style={inputStyle} /><textarea required value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Description" rows={5} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} /><input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateForm("price", e.target.value)} placeholder="Price" style={inputStyle} /><input type="url" value={form.image_url} onChange={(e) => updateForm("image_url", e.target.value)} placeholder="Image URL (optional)" style={inputStyle} /><div style={{ display: "flex", gap: 10 }}><button className="primary-button" type="submit" disabled={saving}>{saving ? "Posting..." : "Post Listing"}</button><button type="button" style={buttonStyle} onClick={() => setCreating(false)}>Cancel</button></div></div></form>}
        {message && <p style={{ opacity: .7 }}>{message}</p>}
        {loading ? <p style={{ opacity: .6 }}>Loading listings...</p> : filtered.length === 0 ? <p style={{ opacity: .6 }}>No listings found.</p> : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>{filtered.map((listing) => <button key={listing.id} type="button" onClick={() => { setSelected(listing); setMessage(""); }} style={{ textAlign: "left", padding: 18, minHeight: 145, borderRadius: 14, border: "1px solid rgba(255,255,255,.08)", background: "rgba(17,17,24,.82)", color: "#fff", cursor: "pointer" }}>{listing.image_url && <img src={listing.image_url} alt="" style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 10, marginBottom: 12 }} />}<div style={{ fontSize: 16, fontWeight: 800 }}>{listing.name}</div><div style={{ marginTop: 7, fontSize: 13, opacity: .6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{listing.description}</div><div style={{ marginTop: 12, fontWeight: 800 }}>${Number(listing.price).toFixed(2)}</div></button>)}</div>}
      </section>
    </main>
  );
}
