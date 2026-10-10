"use client";

import { useMemo, useState } from "react";

const games = [
  { id: "eaglercraft", name: "Eaglercraft", category: "Sandbox", description: "Minecraft in your browser.", icon: "⛏️", url: "https://g.deev.is/eaglercraft/", source: "https://github.com/lDEVinux/eaglercraft", featured: true },
  { id: "retro-bowl", name: "Retro Bowl", category: "Sports", description: "Build a team and lead them to the championship.", icon: "🏈", source: "https://github.com/aaronliuwu/retro-bowl", featured: true },
  { id: "cookie-clicker", name: "Cookie Clicker", category: "Idle", description: "Grow a cookie empire, one click at a time.", icon: "🍪", url: "https://orteil.dashnet.org/cookieclicker/", source: "https://github.com/fym35/OpenCookieClicker", featured: true },
  { id: "moto-x3m", name: "Moto X3M", category: "Racing", description: "Stunts, hazards, and time trials.", icon: "🏍️", source: "https://github.com/AnonymousBirb5100/moto-x3m", featured: true },
  { id: "moto-x3m-winter", name: "Moto X3M Winter", category: "Racing", description: "A winter-themed Moto X3M ride.", icon: "❄️", source: "https://github.com/search?q=moto-x3m-winter&type=repositories" },
  { id: "moto-x3m-pool", name: "Moto X3M Pool Party", category: "Racing", description: "Poolside levels and stunt courses.", icon: "🌊", source: "https://github.com/search?q=moto-x3m-pool-party&type=repositories" },
  { id: "moto-x3m-spooky", name: "Moto X3M Spooky Land", category: "Racing", description: "Spooky levels and tricky obstacles.", icon: "🎃", source: "https://github.com/search?q=moto-x3m-spooky-land&type=repositories" },
  { id: "tiny-fishing", name: "Tiny Fishing", category: "Casual", description: "Cast your line and see what you can catch.", icon: "🎣", url: "https://majesticwafer.github.io/tiny-fishing/", source: "https://github.com/MajesticWafer/tiny-fishing" },
  { id: "geoguessr", name: "GeoGuessr", category: "Puzzle", description: "Guess where you are from a street view.", icon: "🌎", url: "https://www.geoguessr.com/", source: "https://github.com/search?q=geoguessr+clone&type=repositories" },
  { id: "chess", name: "Chess", category: "Puzzle", description: "A classic game of strategy.", icon: "♟️", url: "https://lichess.org/", source: "https://github.com/lichess-org/lila" },
  { id: "snake", name: "Snake", category: "Arcade", description: "Eat, grow, and avoid your tail.", icon: "🐍", url: "https://kyroskoh.github.io/snake-game/", source: "https://github.com/kyroskoh/snake-game" },
  { id: "hill-climb", name: "Hill Climb Racing", category: "Racing", description: "Drive over hills without flipping.", icon: "🚙", source: "https://github.com/mannuking/Hill-Climb-Racing" },
  { id: "hill-climb-2", name: "Hill Climb Racing 2", category: "Racing", description: "More tracks, vehicles, and races.", icon: "🏁", source: "https://github.com/search?q=hill+climb+racing+2&type=repositories" },
  { id: "dino", name: "Dino Run", category: "Arcade", description: "The classic offline dinosaur runner.", icon: "🦖", url: "https://chromedino.com/", source: "https://github.com/wayou/t-rex-runner" },
  { id: "2048", name: "2048", category: "Puzzle", description: "Combine tiles to reach 2048.", icon: "🔢", url: "https://play2048.co/", source: "https://github.com/gabrielecirulli/2048" },
  { id: "tetris", name: "Tetris", category: "Arcade", description: "Fit the falling blocks together.", icon: "🧱", url: "https://tetris.com/play-tetris", source: "https://github.com/search?q=tetris+javascript+game&type=repositories" }
];

const categories = ["All games", ...new Set(games.map((game) => game.category))];

export default function GamesClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All games");
  const [activeGame, setActiveGame] = useState(null);
  const filteredGames = useMemo(() => games.filter((game) => (category === "All games" || game.category === category) && (game.name + " " + game.description).toLowerCase().includes(query.toLowerCase())), [query, category]);

  function launch(game) {
    try {
      const saved = { id: game.id, name: game.name, type: "game", playedAt: new Date().toISOString() };
      localStorage.setItem("vehemence_last_played", JSON.stringify(saved));
      window.dispatchEvent(new Event("vehemence-game-last-played"));
    } catch {}
    if (game.url) setActiveGame(game);
    else window.open(game.source, "_blank", "noopener,noreferrer");
  }

  return <main className="games-page">
    <header className="games-header">
      <div><p className="eyebrow">VEHEMENCE ARCADE</p><h1>Games</h1><p className="games-intro">Your games, all in one place.</p></div>
      <div className="games-count">{games.length} games</div>
    </header>
    <section className="game-section">
      <div className="games-toolbar">
        <label className="games-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games..." aria-label="Search games" /></label>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </div>
      {activeGame && <section className="game-player">
        <div className="game-player-heading"><div><span>{activeGame.icon}</span><strong>{activeGame.name}</strong></div><div className="game-player-actions"><a href={activeGame.url} target="_blank" rel="noreferrer">Open in new tab ↗</a><button type="button" onClick={() => setActiveGame(null)} aria-label="Close game">✕</button></div></div>
        <iframe title={activeGame.name} src={activeGame.url} allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      </section>}
      <div className="games-grid">{filteredGames.map((game) => <article className={`game-card ${game.featured ? "game-card-featured" : ""}`} key={game.id}>
        <div className="game-card-art"><span>{game.icon}</span>{game.featured && <small>FEATURED</small>}</div>
        <div className="game-card-copy"><p>{game.category}</p><h2>{game.name}</h2><span>{game.description}</span></div>
        <div className="game-card-actions"><button type="button" className="primary-button" onClick={() => launch(game)}>{game.url ? "Play now" : "Find game"} <span>↗</span></button><a href={game.source} target="_blank" rel="noreferrer" title="View source on GitHub">Source ↗</a></div>
      </article>)}</div>
      {filteredGames.length === 0 && <p className="games-empty">No games match that search.</p>}
      <p className="games-footnote">Some publishers prevent their games from being embedded. If a game does not load here, use “Open in new tab”. GitHub source links are provided where found; check each repository’s license before redistributing its files.</p>
    </section>
  </main>;
}
