"use client";

import { useEffect, useRef, useState } from "react";

function normalizeAddress(value) {
  const input = String(value || "").trim();
  if (!input) return "";
  const candidate = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(input) ? input : "https://" + input;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.href;
  } catch {
    return "";
  }
}

export default function BrowserClient() {
  const [configured, setConfigured] = useState(null);
  const [address, setAddress] = useState("https://example.com/");
  const [sessionId, setSessionId] = useState("");
  const [password, setPassword] = useState("");
  const [frameUrl, setFrameUrl] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const addressRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetch("/api/browser/status", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => { if (active) setConfigured(Boolean(data.configured)); })
      .catch(() => { if (active) setConfigured(false); });
    try {
      const saved = localStorage.getItem("vehemence_browser_session");
      if (saved) setSessionId(saved);
    } catch {}
    return () => { active = false; };
  }, []);

  async function createSession() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/browser/new-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (!response.ok || !data.sessionId) throw new Error(data.error || "Could not create a browser session.");
      setSessionId(data.sessionId);
      try { localStorage.setItem("vehemence_browser_session", data.sessionId); } catch {}
    } catch (cause) {
      setError(cause.message || "Could not connect to the browser server.");
    } finally {
      setBusy(false);
    }
  }

  async function openAddress(event, targetAddress, addToHistory = true) {
    if (event) event.preventDefault();
    const normalized = normalizeAddress(targetAddress || address);
    if (!normalized) {
      setError("Enter a valid website address starting with http:// or https://.");
      addressRef.current?.focus();
      return;
    }
    if (!sessionId) {
      setError("Create a private session first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/browser/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, url: normalized, password })
      });
      const data = await response.json();
      if (!response.ok || !data.targetUrl) throw new Error(data.error || "The browser server could not open this page.");
      setAddress(normalized);
      setFrameUrl(data.targetUrl);
      setReloadKey((value) => value + 1);
      if (addToHistory) {
        const next = history.slice(0, historyIndex + 1);
        next.push({ address: normalized, targetUrl: data.targetUrl });
        setHistory(next);
        setHistoryIndex(next.length - 1);
      }
    } catch (cause) {
      setError(cause.message || "Could not open this address.");
    } finally {
      setBusy(false);
    }
  }

  function moveHistory(nextIndex) {
    const item = history[nextIndex];
    if (!item) return;
    setHistoryIndex(nextIndex);
    setAddress(item.address);
    setFrameUrl(item.targetUrl);
    setReloadKey((value) => value + 1);
    setError("");
  }

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex >= 0 && historyIndex < history.length - 1;

  return (
    <main className="browser-shell">
      <header className="browser-heading">
        <div className="browser-heading-copy">
          <p className="eyebrow">VEHEMENCE · PRIVATE BROWSING</p>
          <h1>Browser</h1>
          <p>A minimal browser workspace powered by your configured Rammerhead server.</p>
        </div>
        <span className={"browser-connection-pill " + (configured ? "is-connected" : "is-disconnected")}>
          <span className="browser-dot" />{configured === null ? "Checking server" : configured ? "Server connected" : "Server not configured"}
        </span>
      </header>

      {!configured && configured !== null && (
        <section className="browser-warning browser-setup-card">
          <strong>One setup step is still needed.</strong>
          <p>Deploy your own Rammerhead server, then set the server-side <code>RAMMERHEAD_URL</code> environment variable in Vercel to its HTTPS origin. This page does not send your browsing traffic to a public third-party proxy.</p>
          <a href="https://github.com/binary-person/rammerhead" target="_blank" rel="noreferrer">View the open-source project ↗</a>
        </section>
      )}

      <section className="browser-window">
        <form className="browser-toolbar" onSubmit={(event) => openAddress(event)}>
          <button className="browser-toolbar-button" type="button" disabled={!canGoBack || busy} onClick={() => moveHistory(historyIndex - 1)} aria-label="Go back" title="Back">←</button>
          <button className="browser-toolbar-button" type="button" disabled={!canGoForward || busy} onClick={() => moveHistory(historyIndex + 1)} aria-label="Go forward" title="Forward">→</button>
          <button className="browser-toolbar-button" type="button" disabled={!frameUrl || busy} onClick={() => setReloadKey((value) => value + 1)} aria-label="Reload page" title="Reload">↻</button>
          <input ref={addressRef} className="browser-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Enter a website address" aria-label="Website address" />
          <button className="browser-go" type="submit" disabled={!configured || !sessionId || busy}>{busy ? "Loading…" : "Go"}</button>
        </form>

        <div className="browser-session-row">
          <div className="browser-session-info">
            <span className="browser-session-icon">◈</span>
            <div><strong>{sessionId ? "Private session ready" : "Create a session"}</strong><span>{sessionId ? "This session keeps its own site data." : "A session is required before opening a page."}</span></div>
          </div>
          <div className="browser-session-actions">
            <label className="browser-password-wrap">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Server password (if required)" aria-label="Rammerhead server password" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
            </label>
            <button className="browser-session-button" type="button" disabled={!configured || busy} onClick={createSession}>{busy ? "Please wait…" : sessionId ? "New session" : "Create session"}</button>
          </div>
        </div>

        {error && <div className="browser-error" role="alert">{error}</div>}

        <div className="browser-body">
          {frameUrl ? (
            <iframe key={reloadKey} src={frameUrl} title="Vehemence Browser page" allow="fullscreen; autoplay; clipboard-read; clipboard-write" allowFullScreen referrerPolicy="no-referrer" />
          ) : (
            <div className="browser-empty">
              <div className="browser-empty-icon">↗</div>
              <h2>{configured ? "Your browser, your session." : "Browser is waiting for its server."}</h2>
              <p>{configured ? "Create a session, enter a website above, and press Go. Pages open inside this workspace when the server is ready." : "The interface is in place, but it will not proxy pages until a Rammerhead server is configured."}</p>
              {configured && <button className="browser-session-button" type="button" disabled={busy} onClick={createSession}>{busy ? "Creating…" : "Create private session"}</button>}
            </div>
          )}
        </div>
        <footer className="browser-status">
          <span><span className="browser-dot" />{busy ? "Working…" : frameUrl ? "Ready" : "Waiting for a page"}</span>
          <span>{sessionId ? "Session ID saved on this device" : "No session selected"}</span>
        </footer>
      </section>

      <p className="browser-help">Privacy note: the server you choose can process website requests and may store session data such as cookies. Keep your session ID private, use a server you trust, and avoid signing into sensitive accounts on servers you do not control.</p>
    </main>
  );
}
