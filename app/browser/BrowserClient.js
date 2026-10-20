"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HOME_URL = "https://www.google.com/";

function normalizeAddress(value) {
  const input = value.trim();
  if (!input) return HOME_URL;

  // Treat domain-like input as a website, and other plain text as a search.
  if (/^(https?:\/\/|about:blank)/i.test(input)) {
    try {
      return new URL(input).href;
    } catch {
      return HOME_URL;
    }
  }

  if (/^(localhost|\d{1,3}(?:\.\d{1,3}){3})(:\d+)?(?:\/|$)/i.test(input) || /^[\w-]+(\.[\w-]+)+(?:\/|$)/i.test(input)) {
    return "https://" + input;
  }

  return "https://www.google.com/search?q=" + encodeURIComponent(input);
}

export default function BrowserClient() {
  const [serverUrl, setServerUrl] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [address, setAddress] = useState(HOME_URL);
  const [frameUrl, setFrameUrl] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const frameRef = useRef(null);

  const createSession = useCallback(async (baseUrl) => {
    setBusy(true);
    setMessage("");
    setStatus("creating");

    try {
      const response = await fetch("/api/browser/new-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !data.sessionId) {
        throw new Error(data.error || "The browser server couldn't create a session.");
      }

      const start = normalizeAddress(HOME_URL);
      const target = baseUrl || serverUrl;
      if (!target) throw new Error("The browser server URL is missing.");

      setSessionId(data.sessionId);
      setAddress(start);
      setFrameUrl(`${target.replace(/\/$/, "")}/${encodeURIComponent(data.sessionId)}/${start}`);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Could not create a browser session.");
    } finally {
      setBusy(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const response = await fetch("/api/browser/status", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.configured || typeof data.url !== "string") {
          throw new Error("The Rammerhead server isn't configured.");
        }
        if (cancelled) return;
        const base = data.url.replace(/\/$/, "");
        setServerUrl(base);
        await createSession(base);
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(error.message || "Could not connect to the browser server.");
        }
      }
    }

    initialize();
    return () => { cancelled = true; };
  }, [createSession]);

  function navigate(event) {
    event.preventDefault();
    if (!serverUrl || !sessionId) return;
    const target = normalizeAddress(address);
    setAddress(target);
    setMessage("");
    setFrameUrl(`${serverUrl}/${encodeURIComponent(sessionId)}/${target}`);
  }

  function reloadFrame() {
    if (!frameRef.current) return;
    try {
      frameRef.current.contentWindow.location.reload();
    } catch {
      setFrameUrl((current) => current);
    }
  }

  return (
    <main className="browser-shell">
      <header className="browser-heading">
        <div className="browser-heading-copy">
          <p className="eyebrow">VEHEMENCE / WORKSPACE</p>
          <h1>Browser</h1>
          <p>Your web session, right inside Vehemence.</p>
        </div>
        <button
          type="button"
          className="browser-new-session"
          onClick={() => createSession(serverUrl)}
          disabled={!serverUrl || busy}
        >
          {busy ? "Connecting…" : "New session"}
        </button>
      </header>

      <section className="browser-window">
        <div className="browser-toolbar">
          <div className="browser-window-dots" aria-hidden="true">
            <span /><span /><span />
          </div>
          <button type="button" className="browser-tool-button" aria-label="Reload page" onClick={reloadFrame} disabled={status !== "ready"}>↻</button>
          <form className="browser-address-form" onSubmit={navigate}>
            <span className="browser-lock" aria-hidden="true">⌁</span>
            <input
              aria-label="Website address or search"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Search or enter a website"
              autoComplete="off"
              spellCheck="false"
              disabled={status !== "ready"}
            />
            <button type="submit" disabled={status !== "ready"}>Go</button>
          </form>
          <span className="browser-session-status"><i /> {status === "ready" ? "Session active" : busy ? "Connecting" : "Offline"}</span>
        </div>

        <div className="browser-viewport">
          {status === "ready" && frameUrl ? (
            <iframe
              ref={frameRef}
              key={sessionId}
              src={frameUrl}
              title="Vehemence web browser"
              allow="fullscreen; autoplay; clipboard-read; clipboard-write"
              allowFullScreen
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="browser-empty">
              <div className="browser-empty-icon" aria-hidden="true">{busy || status === "loading" || status === "creating" ? "…" : "◉"}</div>
              <h2>{busy || status === "loading" || status === "creating" ? "Starting your browser" : "Couldn't start the browser"}</h2>
              <p>{busy || status === "loading" || status === "creating" ? "Creating a private Rammerhead session. This usually only takes a moment." : message || "Check the server connection and try again."}</p>
              {status === "error" && <button type="button" className="browser-new-session" onClick={() => createSession(serverUrl)} disabled={!serverUrl || busy}>Try again</button>}
            </div>
          )}
        </div>
      </section>
      <p className="browser-help">Each session is separate. Keep its session link private, especially if you sign in to websites.</p>
    </main>
  );
}
