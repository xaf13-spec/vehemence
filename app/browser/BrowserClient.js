"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HOME_URL = "https://html.duckduckgo.com/html/";

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

  return "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(input);
}

export default function BrowserClient() {
  const [serverUrl, setServerUrl] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [address, setAddress] = useState(HOME_URL);
  const [frameUrl, setFrameUrl] = useState("");
  const [frameReloadKey, setFrameReloadKey] = useState(0);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [tabs, setTabs] = useState([{ id: "tab-1", title: "New tab", url: HOME_URL }]);
  const [activeTabId, setActiveTabId] = useState("tab-1");
  const activeTabRef = useRef("tab-1");
  const [bookmarks, setBookmarks] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { activeTabRef.current = activeTabId; }, [activeTabId]);
  useEffect(() => {
    try {
      setBookmarks(JSON.parse(localStorage.getItem("vehemence_browser_bookmarks") || "[]"));
      setHistoryItems(JSON.parse(localStorage.getItem("vehemence_browser_history") || "[]"));
    } catch { setBookmarks([]); setHistoryItems([]); }
  }, []);

  const openPage = useCallback(async (id, targetUrl) => {
    const response = await fetch("/api/browser/open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: id, url: targetUrl }),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok || !data.targetUrl) {
      throw new Error(data.error || "The browser server couldn't open that page.");
    }
    setAddress(targetUrl);
    setFrameUrl(data.targetUrl);
    setTabs((current) => current.map((tab) => tab.id === activeTabRef.current ? { ...tab, url: targetUrl, title: (() => { try { return new URL(targetUrl).hostname.replace(/^www\./, ""); } catch { return "New tab"; } })() } : tab));
    try {
      const prior = JSON.parse(localStorage.getItem("vehemence_browser_history") || "[]");
      const next = [{ url: targetUrl, title: (() => { try { return new URL(targetUrl).hostname.replace(/^www\./, ""); } catch { return targetUrl; } })(), visitedAt: new Date().toISOString() }, ...(Array.isArray(prior) ? prior : []).filter((item) => item.url !== targetUrl)].slice(0, 40);
      localStorage.setItem("vehemence_browser_history", JSON.stringify(next));
      setHistoryItems(next);
    } catch {}
    setStatus("ready");
  }, []);

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

      if (!baseUrl) throw new Error("The browser server URL is missing.");
      setServerUrl(baseUrl);
      setSessionId(data.sessionId);
      await openPage(data.sessionId, HOME_URL);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Could not create a browser session.");
    } finally {
      setBusy(false);
    }
  }, [openPage]);
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
    setMessage("");
    setBusy(true);
    openPage(sessionId, target)
      .catch((error) => { setStatus("error"); setMessage(error.message || "Could not open that page."); })
      .finally(() => setBusy(false));
  }

  function reloadFrame() {
    if (status !== "ready" || !frameUrl) return;
    setFrameReloadKey((key) => key + 1);
  }

  return (
    <main className="browser-shell">
      <header className="browser-heading">
        <div className="browser-heading-copy">
          <p className="eyebrow">VEHEMENCE / WORKSPACE</p>
          <h1>Browser</h1>
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
          <div className="browser-extra-actions">
            <button type="button" onClick={() => { if (!address.trim()) return; const item = { url: address, title: (() => { try { return new URL(address).hostname.replace(/^www\./, ""); } catch { return address; } })() }; const next = [item, ...bookmarks.filter((saved) => saved.url !== item.url)].slice(0, 30); setBookmarks(next); localStorage.setItem("vehemence_browser_bookmarks", JSON.stringify(next)); setShowBookmarks(true); setShowHistory(false); }} title="Bookmark this page" aria-label="Bookmark this page">☆</button>
            <button type="button" onClick={() => { setShowBookmarks((value) => !value); setShowHistory(false); }} title="Bookmarks">Bookmarks</button>
            <button type="button" onClick={() => { setShowHistory((value) => !value); setShowBookmarks(false); }} title="Browsing history">History</button>
          </div>
          <span className="browser-session-status"><i /> {status === "ready" ? "Session active" : busy ? "Connecting" : "Offline"}</span>
        </div>
        <div className="browser-tabbar" role="tablist" aria-label="Browser tabs">
          {tabs.map((tab) => <button type="button" role="tab" aria-selected={tab.id === activeTabId} className={tab.id === activeTabId ? "browser-tab is-active" : "browser-tab"} key={tab.id} onClick={() => { if (tab.id === activeTabId) return; activeTabRef.current = tab.id; setActiveTabId(tab.id); setAddress(tab.url); setMessage(""); setBusy(true); openPage(sessionId, tab.url).catch((error) => { setStatus("error"); setMessage(error.message || "Could not switch tabs."); }).finally(() => setBusy(false)); }}><span>{tab.title || "New tab"}</span>{tabs.length > 1 && <i role="button" tabIndex={0} aria-label={`Close ${tab.title} tab`} onClick={(event) => { event.stopPropagation(); const next = tabs.filter((item) => item.id !== tab.id); if (tab.id === activeTabId) { const fallback = next[Math.max(0, tabs.findIndex((item) => item.id === tab.id) - 1)] || next[0]; activeTabRef.current = fallback.id; setActiveTabId(fallback.id); setTabs(next); setAddress(fallback.url); setBusy(true); openPage(sessionId, fallback.url).catch((error) => { setStatus("error"); setMessage(error.message || "Could not switch tabs."); }).finally(() => setBusy(false)); } else setTabs(next); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }}>×</i>}</button>)}
          <button type="button" className="browser-add-tab" aria-label="New tab" title="New tab" onClick={() => { const id = `tab-${Date.now()}`; const next = [...tabs, { id, title: "New tab", url: HOME_URL }]; activeTabRef.current = id; setActiveTabId(id); setTabs(next); setAddress(HOME_URL); setShowBookmarks(false); setShowHistory(false); setBusy(true); openPage(sessionId, HOME_URL).catch((error) => { setStatus("error"); setMessage(error.message || "Could not open a new tab."); }).finally(() => setBusy(false)); }}>+</button>
        </div>
        {(showBookmarks || showHistory) && <div className="browser-library-panel"><div><strong>{showBookmarks ? "Bookmarks" : "Recent history"}</strong><button type="button" onClick={() => { setShowBookmarks(false); setShowHistory(false); }}>Close ×</button></div>{(showBookmarks ? bookmarks : historyItems).length ? (showBookmarks ? bookmarks : historyItems).slice(0, 12).map((item, index) => <button type="button" className="browser-library-item" key={item.url + index} onClick={() => { setAddress(item.url); setShowBookmarks(false); setShowHistory(false); setBusy(true); openPage(sessionId, item.url).catch((error) => { setStatus("error"); setMessage(error.message || "Could not open that page."); }).finally(() => setBusy(false)); }}><span>{item.title || item.url}</span><small>{item.url}</small></button>) : <p>No {showBookmarks ? "bookmarks" : "history"} yet.</p>}</div>}

        <div className="browser-viewport">
          {status === "ready" && frameUrl ? (
            <iframe
              key={`${sessionId}:${frameReloadKey}`}
              src={frameUrl}
              title="Vehemence web browser"
              allow="fullscreen; autoplay; clipboard-read; clipboard-write"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
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
