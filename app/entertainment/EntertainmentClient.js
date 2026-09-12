"use client";

import { useState } from "react";

const entertainment = [
  { name: "StreameX", description: "Movies and shows.", url: "https://streamex.hn/", icon: "▶" },
  { name: "Vidbox", description: "Movies, shows, and more.", url: "https://vidbox.cc/", icon: "▣" },
];

export default function EntertainmentClient() {
  const [active, setActive] = useState(null);

  return (
    <>
      <div className="game-grid">
        {entertainment.map((item) => (
          <article className="game-card" key={item.name}>
            <button type="button" className="game-card-main" onClick={() => setActive(item)}>
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

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name} player`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActive(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            padding: "24px",
            background: "rgba(0,0,0,.78)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "min(1200px, 100%)",
              height: "min(850px, calc(100vh - 48px))",
              background: "#08080c",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,.55)",
            }}
          >
            <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 0 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
              <strong>{active.name}</strong>
              <button type="button" className="vb-button" onClick={() => setActive(null)}>Close</button>
            </div>
            <iframe
              src={active.url}
              title={active.name}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              style={{ width: "100%", height: "calc(100% - 52px)", border: 0, display: "block" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
