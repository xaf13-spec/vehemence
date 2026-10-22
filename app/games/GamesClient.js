"use client";

import { useEffect, useMemo, useState } from "react";

const games = [
  {
    id: "2048",
    name: "2048",
    category: "Puzzle",
    description: "The original open-source number-merging puzzle.",
    playUrl: "/games/2048/index.html"
  },
  {
    id: "eaglercraft-26-2",
    name: "Eaglercraft 26.2",
    category: "Sandbox",
    description: "Play the Eaglercraft 26.2 browser client.",
    playUrl: "https://vehemence.neocities.org/eaglercraft26-2"
  },
  {
    id: "cookie-clicker",
    name: "Cookie Clicker",
    category: "Idle",
    description: "Grow your cookie empire in the classic incremental game.",
    playUrl: "https://ozh.github.io/cookieclicker/"
  },
  {
    id: "moto-x3m",
    name: "Moto X3M",
    category: "Racing",
    description: "Race through obstacle-filled tracks on a stunt bike.",
    playUrl: "/games/moto-x3m.html"
  },
  {
    id: "moto-x3m-winter",
    name: "Moto X3M Winter",
    category: "Racing",
    description: "Race through snowy tracks in this winter stunt-bike game.",
    playUrl: "/games/moto-x3m-winter.html"
  },
  {
    id: "moto-x3m-pool-party",
    name: "Moto X3M Pool Party",
    category: "Racing",
    description: "Take on stunt-bike tracks with a summer pool-party theme.",
    playUrl: "/games/moto-x3m-pool-party.html"
  },
  {
    id: "moto-x3m-spooky-land",
    name: "Moto X3M Spooky Land",
    category: "Racing",
    description: "Race through spooky themed stunt-bike levels.",
    playUrl: "/games/moto-x3m-spooky-land.html"
  },
  {
    id: "monkey-mart",
    name: "Monkey Mart",
    category: "Simulation",
    description: "Run a busy little supermarket as a monkey.",
    playUrl: "/games/monkey-mart.html"
  },
  {
    id: "run-3",
    name: "Run 3",
    category: "Platformer",
    description: "Run and jump through twisting tunnels in space.",
    playUrl: "/games/run-3.html"
  },
  {
    id: "tetris",
    name: "Tetris",
    category: "Puzzle",
    description: "Fit falling blocks together to clear lines.",
    playUrl: "/games/tetris.html"
  },
  {
    id: "bubble-shooter",
    name: "Bubble Shooter",
    category: "Puzzle",
    description: "Match colorful bubbles to clear the board.",
    playUrl: "/games/bubble-shooter.html"
  },
  {
    id: "open-snake",
    name: "Snake",
    category: "Classic",
    description: "The classic snake game, using upstream open-source code.",
    playUrl: "/games/classic-snake/index.html"
  },
  {
    id: "open-breakout",
    name: "Breakout",
    category: "Arcade",
    description: "The classic brick-breaker game, using upstream open-source code.",
    playUrl: "/games/classic-breakout/index.html"
  }
];

const categories = ["All", ...new Set(games.map((game) => game.category))];

const symbols = {
  "pacman": "◉", "2048": "▦", "air-hockey": "◉", "ant-flap": "✳", "ant-jump": "↗",
  "battleship": "▤", "block-drop": "▦", "breakout": "▥", "bubble-shooter": "◌",
  "connect-four": "⊞", "cookie-clicker": "🍪", "cross-road": "↗", "dino-run": "♞", "fruit-slice": "✳",
  "gem-match": "◆", "helix-drop": "◉", "lights-out": "✦", "maze-muncher": "⌘",
  "memory-match": "▧", "moto-x3m": "🏍", "moto-x3m-winter": "🏍", "moto-x3m-pool-party": "🏍", "moto-x3m-spooky-land": "🏍", "monkey-mart": "🐒", "run-3": "🏃", "tetris": "▦", "merge-drop": "◉", "minesweeper": "▦", "paddle-duel": "◉",
  "piano-tap": "▥", "reversi": "◉", "slide-puzzle": "▦", "snake": "〰",
  "sokoban": "▣", "stack-tower": "▤", "star-defender": "✦", "sudoku": "▦",
  "tic-tac-toe": "×", "water-sort": "◍", "whack-a-mole": "✹"
};
const artThemes = ["violet", "blue", "mint", "amber", "rose"];

export default function GamesClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedGame, setSelectedGame] = useState(null);
  const featuredGame = games.find((game) => game.id === "2048") || games[0];

  useEffect(() => {
    function openRequestedGame() {
      try {
        const requested = JSON.parse(localStorage.getItem("vehemence_featured_pick") || "null");
        if (!requested) return;
        localStorage.removeItem("vehemence_featured_pick");
        const match = games.find((game) => game.id === requested.id || game.name === requested.name);
        if (match) setSelectedGame(match);
      } catch {}
    }
    openRequestedGame();
    window.addEventListener("vehemence-open-game", openRequestedGame);
    return () => window.removeEventListener("vehemence-open-game", openRequestedGame);
  }, []);

  const filteredGames = useMemo(() => games.filter((game) =>
    (category === "All" || game.category === category) &&
    (game.name + " " + game.description + " " + game.category).toLowerCase().includes(query.toLowerCase().trim())
  ), [query, category]);

  function playGame(game) {
    setSelectedGame(game);
    try { const entry = { name: game.name, type: "game", id: game.id, playedAt: new Date().toISOString() }; localStorage.setItem("vehemence_last_played", JSON.stringify(entry)); const prior = JSON.parse(localStorage.getItem("vehemence_game_history") || "[]"); const history = Array.isArray(prior) ? prior : []; localStorage.setItem("vehemence_game_history", JSON.stringify([entry, ...history.filter((item) => item.id !== game.id)].slice(0, 50))); } catch {}
    window.dispatchEvent(new Event("vehemence-game-last-played"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="games-page games-redesign">
      {!selectedGame && (
        <section className="games-spotlight">
          <div className="games-spotlight-copy">
            <span className="games-overline"><span className="games-live-dot" /> THE ARCADE</span>
            <h1>Find your<br /><span>next obsession.</span></h1>
            
            <div className="games-spotlight-actions">
              <button type="button" className="games-spotlight-play" onClick={() => playGame(featuredGame)}><span>▶</span> Play 2048</button>
              <span className="games-spotlight-meta">{games.length} games <i /> no downloads</span>
            </div>
          </div>
          <div className="games-spotlight-art" aria-hidden="true">
            <div className="spotlight-orbit spotlight-orbit-one" />
            <div className="spotlight-orbit spotlight-orbit-two" />
            <div className="spotlight-game-symbol">◉</div>
            <div className="spotlight-dot spotlight-dot-one" />
            <div className="spotlight-dot spotlight-dot-two" />
            <div className="spotlight-dot spotlight-dot-three" />
            <div className="spotlight-caption"><span>FEATURED GAME</span><strong>2048</strong><small>CLASSIC · ARCADE</small></div>
          </div>
          <div className="games-spotlight-index">01 <span>/</span> {String(games.length).padStart(2, "0")}</div>
        </section>
      )}

      {selectedGame && (
        <header className="games-playing-heading">
          <div><span className="games-overline">NOW PLAYING</span><h1>{selectedGame.name}</h1></div>
          <button type="button" className="games-back-button" onClick={() => setSelectedGame(null)}>← Back to games</button>
        </header>
      )}

      <section className="game-section games-library">
        <div className="games-library-heading">
          <div><span className="games-overline">THE COLLECTION</span><h2>{selectedGame ? "Keep exploring" : "Browse games"}</h2></div>
          <span className="games-count"><b>{filteredGames.length}</b> / {games.length}</span>
        </div>
        <div className="games-toolbar">
          <label className="games-search">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a game..." aria-label="Search games" />
            {query && <button type="button" className="games-clear-search" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
          </label>
        </div>
        <div className="games-category-row" aria-label="Game categories">
          {categories.map((item) => <button key={item} type="button" className={category === item ? "games-category-chip active" : "games-category-chip"} onClick={() => setCategory(item)}>{item}</button>)}
        </div>

        {selectedGame && (
          <section className="games-player" aria-label={`Playing ${selectedGame.name}`}>
            <div className="games-player-header">
              <div><span className="games-player-live" /> <h2>{selectedGame.name}</h2></div>
              <div className="games-player-header-actions">
                <button type="button" onClick={() => setSelectedGame(null)} aria-label="Close game">Close ✕</button>
              </div>
            </div>
            <iframe className="games-player-frame" src={selectedGame.playUrl} title={selectedGame.name} allow="fullscreen; autoplay; gamepad" allowFullScreen />
          </section>
        )}

        <div className="games-grid">
          {filteredGames.map((game, index) => (
            <article className={`game-card games-card-modern theme-${artThemes[index % artThemes.length]}`} key={game.id}>
              <button type="button" className="games-card-open" onClick={() => playGame(game)} aria-label={`Play ${game.name}`}>
                <div className="games-card-art">
                  <span className="games-card-category">{game.category}</span>
                  <span className="games-card-symbol" aria-hidden="true">{symbols[game.id] || "✦"}</span>
                  <span className="games-card-arrow" aria-hidden="true">↗</span>
                  <span className="games-card-art-line" />
                </div>
                <div className="games-card-copy">
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                </div>
                <div className="games-card-footer"><span>PLAY GAME</span><span>↗</span></div>
              </button>
            </article>
          ))}
        </div>
        {filteredGames.length === 0 && <div className="games-empty-modern"><span>⌕</span><h3>No games found</h3><p>Try another search or category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
      </section>
    </main>
  );
}
