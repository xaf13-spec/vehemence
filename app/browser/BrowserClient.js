"use client";

import { useState } from "react";

const HOME_URL = "https://www.google.com/";

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return HOME_URL;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

export default function BrowserClient() {
  const [address, setAddress] = useState(HOME_URL);
  const [loadedUrl, setLoadedUrl] = useState(HOME_URL);
  const [history, setHistory] = useState([HOME_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  function navigate(value, push = true) {
    const nextUrl = normalizeUrl(value);
    setAddress(nextUrl);
    setLoadedUrl(nextUrl);
    if (!push) return;

    setHistory((current) => {
      const trimmed = current.slice(0, historyIndex + 1);
      const last = trimmed[trimmed.length - 1];
      if (last === nextUrl) return trimmed;
      const next = [...trimmed, nextUrl].slice(-20);
      setHistoryIndex(next.length - 1);
      return next;
    });
  }

  function goBack() {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    const nextUrl = history[nextIndex];
    setHistoryIndex(nextIndex);
    setLoadedUrl(nextUrl);
    setAddress(nextUrl);
  }

  function goForward() {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const nextUrl = history[nextIndex];
    setHistoryIndex(nextIndex);
    setLoadedUrl(nextUrl);
    setAddress(nextUrl);
  }

  return (
    <main className="browser-shell">
      <header className="browser-heading">
        <div className="browser-heading-copy">
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Browser</h1>
          <p>A clean browser workspace inside Vehemence.</p>
        </div>
      </header>

      <section className="browser-window">
        <div className="browser-toolbar">
          <button type="button" className="browser-toolbar-button" onClick={goBack} disabled={historyIndex === 0} aria-label="Back">‹</button>
          <button type="button" className="browser-toolbar-button" onClick={goForward} disabled={historyIndex >= history.length - 1} aria-label="Forward">›</button>
          <button type="button" className="browser-toolbar-button" onClick={() => setReloadKey((value) => value + 1)} aria-label="Reload">↻</button>
          <input
            className="browser-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") navigate(event.currentTarget.value);
            }}
            aria-label="Web address"
            spellCheck={false}
          />
          <button type="button" className="browser-go" onClick={() => navigate(address)}>Go</button>
        </div>

        <div className="browser-warning">
          <strong>Note:</strong> Some websites do not allow themselves to be displayed inside another website. Those sites can still refuse this frame even though the browser itself is working.
        </div>

        <div className="browser-body">
          <iframe
            key={`${loadedUrl}-${reloadKey}`}
            src={loadedUrl}
            title="Vehemence Browser"
            allow="autoplay; fullscreen; gamepad; pointer-lock; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div className="browser-status">
          <span><span className="browser-dot" />Connected to {new URL(loadedUrl).hostname}</span>
          <span>Vehemence Browser</span>
        </div>
      </section>

      <p className="browser-help">Enter a URL or a search term above. Vehemence does not route traffic through a proxy or bypass a site's own framing restrictions.</p>
    </main>
  );
}
