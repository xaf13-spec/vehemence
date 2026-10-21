"use client";

import { useEffect, useMemo, useState } from "react";

const games = [
  {
    id: "2048",
    name: "2048",
    category: "Puzzle",
    description: "Slide matching tiles and build larger numbers.",
    playUrl: "/games/2048/index.html"
  },
  {
    id: "cookie-clicker",
    name: "Cookie Clicker",
    category: "Clicker",
    description: "Grow your cookie count with clicks and upgrades.",
    playUrl: "/games/cookie-clicker/index.html"
  },
  {
    id: "open-breakout",
    name: "HTML5 Breakout",
    category: "Arcade",
    description: "Clear the brick field with a paddle and bouncing ball.",
    playUrl: "/games/classic-breakout/index.html"
  },
  {
    id: "open-snake",
    name: "Classic Snake",
    category: "Classic",
    description: "Collect food, grow longer, and avoid your tail.",
    playUrl: "/games/classic-snake/index.html"
  },
  {
    id: "netris",
    name: "Netris",
    category: "Puzzle",
    description: "A fast block-stacking puzzle game.",
    playUrl: "/games/netris/index.html"
  },
  {
    id: "eaglercraft",
    name: "Eaglercraft",
    category: "Sandbox",
    description: "Play the open-source browser sandbox client.",
    playUrl: "/games/eaglercraft/index.html"
  },
  {
    id: "hextris-open",
    name: "Hextris",
    category: "Puzzle",
    description: "Rotate the hexagon and match falling blocks.",
    playUrl: "/games/hextris-open/index.html"
  },
  {
    id: "klondike",
    name: "Klondike Solitaire",
    category: "Board",
    description: "Arrange the cards into the four foundation piles.",
    playUrl: "/games/klondike/index.html"
  },
  {
    id: "for-science",
    name: "For Science!",
    category: "Puzzle",
    description: "Play the original open-source puzzle game.",
    playUrl: "/games/for-science/index.html"
  },
  {
    id: "donkey-bolonkey",
    name: "Donkey Bolonkey",
    category: "Arcade",
    description: "Play the original open-source arcade game.",
    playUrl: "/games/donkey-bolonkey/index.html"
  },
  {
    id: "psypong3d",
    name: "Psy Pong 3D",
    category: "Sports",
    description: "A 3D take on paddle-and-ball sports.",
    playUrl: "/games/psypong3d/index.html"
  },
  {
    id: "wok-open",
    name: "Wok",
    category: "Arcade",
    description: "Play the original open-source arcade game.",
    playUrl: "/games/wok-open/index.html"
  },
  {
    id: "yanoid",
    name: "Yanoid",
    category: "Arcade",
    description: "A brick-breaking arcade game.",
    playUrl: "/games/yanoid/index.html"
  },
  {
    id: "glparchis",
    name: "glParchis",
    category: "Board",
    description: "A digital version of the classic board game.",
    playUrl: "/games/glparchis/index.html"
  },
  {
    id: "bubble-train",
    name: "Bubble Train",
    category: "Puzzle",
    description: "Match bubbles and clear the track.",
    playUrl: "/games/bubble-train/index.html"
  },
  {
    id: "nova-pinball",
    name: "Nova Pinball",
    category: "Arcade",
    description: "Play a full pinball table in your browser.",
    playUrl: "/games/nova-pinball/index.html"
  },
  {
    id: "mechanical-night-pinball",
    name: "Mechanical Night Pinball",
    category: "Arcade",
    description: "A mechanical-themed pinball game.",
    playUrl: "/games/mechanical-night-pinball/index.html"
  },
  {
    id: "comet-pinball",
    name: "Comet Pinball",
    category: "Arcade",
    description: "Launch the ball and keep the pinball run going.",
    playUrl: "/games/comet-pinball/index.html"
  },
  {
    id: "disk-field",
    name: "Disk Field",
    category: "Puzzle",
    description: "Play the original open-source puzzle game.",
    playUrl: "/games/disk-field/index.html"
  },
  {
    id: "the-lost-path",
    name: "The Lost Path",
    category: "Puzzle",
    description: "Find your way through a puzzle path.",
    playUrl: "/games/the-lost-path/index.html"
  }
];

const categories = ["All", ...new Set(games.map((game) => game.category))];

const symbols = {
  "pacman": "◉", "2048": "▦", "air-hockey": "◉", "ant-flap": "✳", "ant-jump": "↗",
  "battleship": "▤", "block-drop": "▦", "breakout": "▥", "bubble-shooter": "◌",
  "connect-four": "⊞", "cross-road": "↗", "dino-run": "♞", "fruit-slice": "✳",
  "gem-match": "◆", "helix-drop": "◉", "lights-out": "✦", "maze-muncher": "⌘",
  "memory-match": "▧", "merge-drop": "◉", "minesweeper": "▦", "paddle-duel": "◉",
  "piano-tap": "▥", "reversi": "◉", "slide-puzzle": "▦", "snake": "〰",
  "sokoban": "▣", "stack-tower": "▤", "star-defender": "✦", "sudoku": "▦",
  "tic-tac-toe": "×", "water-sort": "◍", "whack-a-mole": "✹"
};
const artThemes = ["violet", "blue", "mint", "amber", "rose"];

export default function GamesClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedGame, setSelectedGame] = useState(null);
  const featuredGame = games.find((game) => game.id === "pacman") || games[0];

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
              <button type="button" className="games-spotlight-play" onClick={() => playGame(featuredGame)}><span>▶</span> Play Pac-Man</button>
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
            <div className="spotlight-caption"><span>FEATURED GAME</span><strong>Pac-Man</strong><small>CLASSIC · ARCADE</small></div>
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
