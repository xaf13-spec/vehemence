"use client";

import { useMemo, useState } from "react";

const pages = [
  { name: "Google", url: "https://www.google.com/", host: "www.google.com" },
  { name: "Google Snake", url: "https://www.google.com/search?q=snake+game", host: "www.google.com" },
  { name: "Google Pac-Man", url: "https://www.google.com/logos/2010/pacman10-i.html", host: "www.google.com" },
  { name: "Google Baseball", url: "https://www.google.com/doodles/fourth-of-july-2019", host: "www.google.com" },
  { name: "Retro Bowl", url: "https://www.miniplay.com/embed/retro-bowl", host: "www.miniplay.com" },
  { name: "Tomb of the Mask", url: "https://www.miniplay.com/embed/tomb-of-the-mask", host: "www.miniplay.com" },
  { name: "Rocket Goal", url: "https://www.miniplay.com/embed/rocket-goal", host: "www.miniplay.com" },
  { name: "Minesweeper", url: "https://play-minesweeper.games/embed/?size=beginner&theme=dark", host: "play-minesweeper.games" },
  { name: "StreameX", url: "https://www.streamex.sh/", host: "www.streamex.sh" },
];

export default function BrowserClient() {
  const [selected, setSelected] = useState(pages[0].name);
  const [reloadKey, setReloadKey] = useState(0);
  const page = useMemo(() => pages.find((item) => item.name === selected) || pages[0], [selected]);

  return (
    <main className="games-page">
      <div className="games-header">
        <div>
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Browser</h1>
          <p>Launch supported web experiences inside Vehemence.</p>
        </div>
        <div className="game-toolbar" style={{ margin: 0 }}>
          <select className="game-sort" value={selected} onChange={(e) => setSelected(e.target.value)} aria-label="Choose a browser page">
            {pages.map((item) => <option key={item.name}>{item.name}</option>)}
          </select>
          <button type="button" className="secondary-button" onClick={() => setReloadKey((value) => value + 1)}>Reload</button>
        </div>
      </div>

      <section className="game-section">
        <div className="section-title-row">
          <div>
            <h2>{page.name}</h2>
            <p className="section-subtitle">Embedded from {page.host}</p>
          </div>
        </div>
        <div className="vb-center" style={{ padding: 0, gap: 0, minHeight: "72vh", overflow: "hidden" }}>
          <iframe
            key={`${page.url}-${reloadKey}`}
            src={page.url}
            title={page.name}
            allow="autoplay; fullscreen; gamepad; pointer-lock; clipboard-write"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            style={{ width: "100%", flex: 1, minHeight: "72vh", border: 0, display: "block" }}
          />
        </div>
      </section>
    </main>
  );
}
