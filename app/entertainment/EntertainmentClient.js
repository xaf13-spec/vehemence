"use client";

import { useState } from "react";

const entertainment = [
  { name: "StreameX", description: "Open StreameX inside Vehemence.", url: "https://www.streamex.sh/", icon: "▶" },
];

function StreameXEmbed({ item }) {
  const [failed, setFailed] = useState(false);

  return (
    <div style={{ width: "100%", minHeight: "70vh", borderRadius: 18, overflow: "hidden", position: "relative", background: "var(--surface, #111116)" }}>
      <iframe
        src={item.url}
        title={item.name}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setFailed(false)}
        onError={() => setFailed(true)}
        style={{ width: "100%", minHeight: "70vh", border: 0, display: "block" }}
      />
      {failed && (
        <div className="vb-center" style={{ position: "absolute", inset: 0, padding: 32, background: "rgba(10,10,14,.96)" }}>
          <span className="settings-eyebrow">ENTERTAINMENT</span>
          <h2>StreameX couldn't be framed</h2>
          <p>The StreameX address is unchanged. If its server blocks iframe embedding, Vehemence can't override that browser security rule.</p>
          <button type="button" className="vb-button" onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}>
            Open StreameX
          </button>
        </div>
      )}
    </div>
  );
}

export default function EntertainmentClient() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="game-grid">
        {entertainment.map((item) => (
          <article className="game-card" key={item.name}>
            <button type="button" className="game-card-main" onClick={() => setOpen(true)} style={{ width: "100%", textAlign: "left", border: 0, background: "transparent", cursor: "pointer" }}>
              <div className="game-thumbnail">
                <div className="game-thumb-shine" />
                <span className="game-thumb-icon">{item.icon}</span>
                <span className="game-thumb-name">{item.name}</span>
              </div>
              <div className="game-info">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="game-category">Entertainment</span>
              </div>
            </button>
          </article>
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="StreameX"
          style={{ position: "fixed", inset: 0, zIndex: 1000, padding: 20, background: "rgba(0,0,0,.78)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
        >
          <div style={{ width: "min(1400px, 100%)", height: "min(900px, 94vh)", position: "relative", borderRadius: 22, overflow: "hidden", background: "var(--surface, #111116)", boxShadow: "0 24px 80px rgba(0,0,0,.45)" }}>
            <button type="button" className="vb-button" onClick={() => setOpen(false)} style={{ position: "absolute", top: 12, right: 12, zIndex: 2, background: "rgba(10,10,14,.9)" }}>
              Close
            </button>
            <StreameXEmbed item={entertainment[0]} />
          </div>
        </div>
      )}
    </>
  );
}
