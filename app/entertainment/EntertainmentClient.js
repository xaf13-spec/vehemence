"use client";

import { useRef, useState } from "react";

const entertainment = [
  { name: "StreameX", description: "Open StreameX inside Vehemence.", url: "https://www.streamex.sh/", icon: "▶" },
];

function StreameXEmbed({ item, onClose }) {
  const frameRef = useRef(null);
  const shellRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  async function goFullscreen() {
    const target = shellRef.current || frameRef.current;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (target?.requestFullscreen) {
        await target.requestFullscreen();
      }
    } catch {
      // Some browsers block programmatic fullscreen until a user gesture.
    }
  }

  function reload() {
    setFailed(false);
    setLoading(true);

    if (frameRef.current) {
      const currentSrc = frameRef.current.src;
      frameRef.current.src = "about:blank";
      window.setTimeout(() => {
        if (frameRef.current) frameRef.current.src = currentSrc;
      }, 30);
    }
  }

  return (
    <div
      ref={shellRef}
      className="stream-ex-player"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: "var(--surface, #111116)"
      }}
    >
      <div
        className="stream-ex-toolbar"
        style={{
          minHeight: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "0 14px",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          background: "rgba(10,10,14,.96)",
          position: "relative",
          zIndex: 5
        }}
      >
        <div style={{ minWidth: 0 }}>
          <strong style={{ display: "block", fontSize: 13 }}>StreameX</strong>
          <span style={{ display: "block", marginTop: 2, color: "var(--muted, #777782)", fontSize: 10 }}>
            {loading ? "Loading…" : "Playing inside Vehemence"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <button type="button" className="vb-button" onClick={reload} aria-label="Reload StreameX">
            Reload
          </button>
          <button type="button" className="vb-button" onClick={goFullscreen} aria-label="Fullscreen StreameX">
            Fullscreen
          </button>
          <button type="button" className="vb-button" onClick={onClose} aria-label="Close StreameX">
            Close
          </button>
        </div>
      </div>

      <div
        className="stream-ex-frame-wrap"
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          background: "#050507"
        }}
      >
        <iframe
          ref={frameRef}
          src={item.url}
          title={item.name}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-read; clipboard-write"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => {
            setLoading(false);
            setFailed(false);
          }}
          onError={() => {
            setLoading(false);
            setFailed(true);
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
            display: "block",
            pointerEvents: "auto",
            background: "#050507"
          }}
        />

        {failed && (
          <div
            className="vb-center"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              padding: 32,
              background: "rgba(10,10,14,.96)",
              pointerEvents: "auto"
            }}
          >
            <span className="settings-eyebrow">ENTERTAINMENT</span>
            <h2>StreameX couldn't be loaded</h2>
            <p>The StreameX address is unchanged. Try Reload, or open StreameX directly in your browser.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" className="vb-button" onClick={reload}>Reload</button>
              <button type="button" className="vb-button" onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}>
                Open StreameX
              </button>
            </div>
          </div>
        )}
      </div>
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
            <button
              type="button"
              className="game-card-main"
              onClick={() => setOpen(true)}
              style={{ width: "100%", textAlign: "left", border: 0, background: "transparent", cursor: "pointer" }}
            >
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
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            padding: 20,
            background: "rgba(0,0,0,.78)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            style={{
              width: "min(1400px, 100%)",
              height: "min(900px, 94vh)",
              minHeight: 0,
              position: "relative",
              borderRadius: 22,
              overflow: "hidden",
              background: "var(--surface, #111116)",
              boxShadow: "0 24px 80px rgba(0,0,0,.45)",
              pointerEvents: "auto"
            }}
          >
            <StreameXEmbed item={entertainment[0]} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
