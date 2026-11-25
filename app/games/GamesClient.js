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
    playUrl: "/games/eaglercraft/index.html"
  },
  {
    id: "cookie-clicker",
    name: "Cookie Clicker",
    category: "Idle",
    description: "Grow your cookie empire in the classic incremental game.",
    playUrl: "/games/cookie-clicker/index.html"
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
  },
  { id: "air-hockey", name: "Air Hockey", category: "Sports", description: "Play table hockey against the computer.", playUrl: "/games/air-hockey/index.html" },
  { id: "battleship", name: "Battleship", category: "Board", description: "Place your fleet and hunt the computer's hidden ships.", playUrl: "/games/battleship/index.html" },
  { id: "block-drop", name: "Block Drop", category: "Puzzle", description: "Fit falling blocks and clear the board.", playUrl: "/games/block-drop/index.html" },
  { id: "click-circle", name: "Click Circle", category: "Arcade", description: "Test your speed and accuracy against the clock.", playUrl: "/games/click-circle/index.html" },
  { id: "connect-four", name: "Connect Four", category: "Board", description: "Line up four pieces before the computer does.", playUrl: "/games/connect-four/index.html" },
  { id: "cross-road", name: "Cross Road", category: "Arcade", description: "Dodge traffic and see how far you can get.", playUrl: "/games/cross-road/index.html" },
  { id: "dino-run", name: "Dino Run", category: "Arcade", description: "Jump over obstacles in an endless runner.", playUrl: "/games/dino-run/index.html" },
  { id: "fruit-slice", name: "Fruit Slice", category: "Arcade", description: "Slice flying fruit and avoid the hazards.", playUrl: "/games/fruit-slice/index.html" },
  { id: "gem-match", name: "Gem Match", category: "Puzzle", description: "Match gems and chain together combos.", playUrl: "/games/gem-match/index.html" },
  { id: "helix-drop", name: "Helix Drop", category: "Arcade", description: "Rotate the tower and guide the ball through gaps.", playUrl: "/games/helix-drop/index.html" },
  { id: "lights-out", name: "Lights Out", category: "Puzzle", description: "Turn off every light with the fewest moves.", playUrl: "/games/lights-out/index.html" },
  { id: "maze-muncher", name: "Maze Muncher", category: "Arcade", description: "Clear the maze while avoiding the ghosts.", playUrl: "/games/maze-muncher/index.html" },
  { id: "memory-match", name: "Memory Match", category: "Puzzle", description: "Flip cards and find every matching pair.", playUrl: "/games/memory-match/index.html" },
  { id: "merge-drop", name: "Merge Drop", category: "Puzzle", description: "Drop matching pieces together to make bigger ones.", playUrl: "/games/merge-drop/index.html" },
  { id: "minesweeper", name: "Minesweeper", category: "Puzzle", description: "Clear the grid without hitting a mine.", playUrl: "/games/minesweeper/index.html" },
  { id: "pacman", name: "Pac-Man", category: "Arcade", description: "Clear the maze, collect dots and avoid ghosts.", playUrl: "/games/pacman/index.html" },
  { id: "paddle-duel", name: "Paddle Duel", category: "Sports", description: "Play a fast paddle match against the computer.", playUrl: "/games/paddle-duel/index.html" },
  { id: "piano-tap", name: "Piano Tap", category: "Music", description: "Hit the keys in time and keep the streak alive.", playUrl: "/games/piano-tap/index.html" },
  { id: "reversi", name: "Reversi", category: "Board", description: "Flip your opponent's pieces and control the board.", playUrl: "/games/reversi/index.html" },
  { id: "slide-puzzle", name: "Slide Puzzle", category: "Puzzle", description: "Put the numbered tiles back in order.", playUrl: "/games/slide-puzzle/index.html" },
  { id: "sokoban", name: "Sokoban", category: "Puzzle", description: "Push every crate onto its target.", playUrl: "/games/sokoban/index.html" },
  { id: "stack-tower", name: "Stack Tower", category: "Arcade", description: "Stack blocks as accurately and as high as you can.", playUrl: "/games/stack-tower/index.html" },
  { id: "star-defender", name: "Star Defender", category: "Shooter", description: "Take on waves of enemies in a space shooter.", playUrl: "/games/star-defender/index.html" },
  { id: "sudoku", name: "Sudoku", category: "Puzzle", description: "Fill the grid without repeating numbers.", playUrl: "/games/sudoku/index.html" },
  { id: "tic-tac-toe", name: "Tic Tac Toe", category: "Board", description: "Play the classic against the computer or a friend.", playUrl: "/games/tic-tac-toe/index.html" },
  { id: "water-sort", name: "Water Sort", category: "Puzzle", description: "Sort the colored liquid into matching tubes.", playUrl: "/games/water-sort/index.html" },
  { id: "whack-a-mole", name: "Whack-a-Mole", category: "Arcade", description: "Test your reflexes and hit the moles before time runs out.", playUrl: "/games/whack-a-mole/index.html" },
  { id: "bowling", name: "Bowling", category: "Sports", description: "Line up your shot, add spin and chase a perfect game.", playUrl: "/games/bowling/index.html" },
  { id: "checkers", name: "Checkers", category: "Board", description: "Capture pieces and crown your kings against the computer.", playUrl: "/games/checkers/index.html" },
  { id: "gomoku", name: "Gomoku", category: "Board", description: "Get five in a row before your opponent.", playUrl: "/games/gomoku/index.html" },
  { id: "hoop-shot", name: "Hoop Shot", category: "Sports", description: "Take timed basketball shots and build a scoring streak.", playUrl: "/games/hoop-shot/index.html" },
  { id: "mini-golf", name: "Mini Golf", category: "Sports", description: "Play nine holes and putt around obstacles.", playUrl: "/games/mini-golf/index.html" },
  { id: "penalty-kick", name: "Penalty Kick", category: "Sports", description: "Take penalty shots and try to beat the keeper.", playUrl: "/games/penalty-kick/index.html" },
  { id: "mancala", name: "Mancala", category: "Board", description: "Sow the stones, capture pits and outscore the computer.", playUrl: "/games/mancala/index.html" },
  { id: "rush-hour", name: "Rush Hour", category: "Puzzle", description: "Move the traffic and clear a path for the red car.", playUrl: "/games/rush-hour/index.html" },
  { id: "mahjong-link", name: "Mahjong Link", category: "Puzzle", description: "Match tiles with a path that makes no more than two turns.", playUrl: "/games/mahjong-link/index.html" },
  { id: "hanoi", name: "Tower of Hanoi", category: "Puzzle", description: "Move the disks to the final peg without breaking the rules.", playUrl: "/games/hanoi/index.html" }
];

const categories = ["All", ...new Set(games.map((game) => game.category))];

const symbols = {
  "pacman": "◉", "2048": "▦", "bowling": "🎳", "checkers": "🔵", "gomoku": "⚫", "hoop-shot": "🏀", "mini-golf": "⛳", "penalty-kick": "⚽", "mancala": "🫘", "rush-hour": "🚗", "mahjong-link": "🀄", "hanoi": "🗼", "air-hockey": "◉", "ant-flap": "✳", "ant-jump": "↗",
  "battleship": "▤", "block-drop": "▦", "breakout": "▥", "bubble-shooter": "◌",
  "connect-four": "⊞", "cookie-clicker": "🍪", "retro-bowl": "🏈", "cross-road": "↗", "dino-run": "♞", "fruit-slice": "✳",
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
