"use client";

export default function BrowserClient() {
  return (
    <main className="browser-shell browser-iframe-shell">
      <header className="browser-heading">
        <div className="browser-heading-copy">
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Browser</h1>
          <p>Browse from inside Vehemence.</p>
        </div>
      </header>
      <section className="browser-window browser-iframe-window">
        <iframe
          src="https://demo-opensource.rammerhead.org/"
          title="Rammerhead browser"
          allow="fullscreen; autoplay; clipboard-read; clipboard-write"
          allowFullScreen
          referrerPolicy="no-referrer"
        />
      </section>
    </main>
  );
}
