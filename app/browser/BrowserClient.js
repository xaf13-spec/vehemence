"use client";

import { useEffect, useState } from "react";

export default function BrowserClient() {
  const [serverUrl, setServerUrl] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadBrowserConfig() {
      try {
        const response = await fetch("/api/browser/status", {
          cache: "no-store",
        });
        const data = await response.json();

        if (cancelled) return;

        if (response.ok && data.configured && typeof data.url === "string") {
          setServerUrl(data.url);
          setStatus("ready");
        } else {
          setStatus("unconfigured");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    loadBrowserConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="browser-shell browser-iframe-shell">
      <header className="browser-heading">
        <div className="browser-heading-copy">
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Browser</h1>
          <p>Browse the web without leaving Vehemence.</p>
        </div>
      </header>
      <section className="browser-window browser-iframe-window">
        {status === "ready" ? (
          <iframe
            src={serverUrl}
            title="Rammerhead browser"
            allow="fullscreen; autoplay; clipboard-read; clipboard-write"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="browser-empty">
            <div className="browser-empty-icon" aria-hidden="true">
              {status === "loading" ? "…" : "🌐"}
            </div>
            <h2>
              {status === "loading"
                ? "Connecting to browser"
                : status === "unconfigured"
                  ? "Browser server not configured"
                  : "Could not connect to browser"}
            </h2>
            <p>
              {status === "loading"
                ? "Checking the Rammerhead server configuration."
                : status === "unconfigured"
                  ? "Set RAMMERHEAD_URL in your Vercel environment variables to the URL of your Rammerhead server, then redeploy Vehemence."
                  : "Vehemence could not load the browser configuration. Refresh the page and try again."}
            </p>
            {status !== "loading" && (
              <button
                type="button"
                className="browser-session-button"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            )}
          </div>
        )}
      </section>
      {status === "ready" && (
        <p className="browser-help">
          If the browser area stays blank or says the page was blocked, the
          configured Rammerhead server may prevent iframe embedding. That must
          be fixed on the Rammerhead server itself.
        </p>
      )}
    </main>
  );
}
