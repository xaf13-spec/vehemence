"use client";

import { useMemo, useState } from "react";

const games = [
  {
    "id": "pacman",
    "name": "Pac-Man",
    "category": "Arcade",
    "description": "Clear the maze, collect dots, and avoid the ghosts.",
    "playUrl": "/games/pacman/index.html",
  },
  {
    "id": "2048",
    "name": "2048",
    "category": "Puzzle",
    "description": "Merge number tiles to reach 2048.",
    "playUrl": "/games/2048/index.html",
  },
  {
    "id": "air-hockey",
    "name": "Air Hockey",
    "category": "Sports",
    "description": "Play a quick air-hockey match against the computer.",
    "playUrl": "/games/air-hockey/index.html",
  },
  {
    "id": "ant-flap",
    "name": "Ant Flap",
    "category": "Arcade",
    "description": "Keep the ant flying through the gaps.",
    "playUrl": "/games/ant-flap/index.html",
  },
  {
    "id": "ant-jump",
    "name": "Ant Jump",
    "category": "Arcade",
    "description": "Jump across obstacles and keep moving.",
    "playUrl": "/games/ant-jump/index.html",
  },
  {
    "id": "battleship",
    "name": "Battleship",
    "category": "Board",
    "description": "Place your fleet and try to find the opponent's ships.",
    "playUrl": "/games/battleship/index.html",
  },
  {
    "id": "block-drop",
    "name": "Block Drop",
    "category": "Puzzle",
    "description": "Fit falling blocks together and clear lines.",
    "playUrl": "/games/block-drop/index.html",
  },
  {
    "id": "breakout",
    "name": "Breakout",
    "category": "Arcade",
    "description": "Bounce the ball and clear the bricks.",
    "playUrl": "/games/breakout/index.html",
  },
  {
    "id": "bubble-shooter",
    "name": "Bubble Shooter",
    "category": "Puzzle",
    "description": "Match bubbles to clear the board.",
    "playUrl": "/games/bubble-shooter/index.html",
  },
  {
    "id": "connect-four",
    "name": "Connect Four",
    "category": "Board",
    "description": "Connect four discs before your opponent.",
    "playUrl": "/games/connect-four/index.html",
  },
  {
    "id": "cross-road",
    "name": "Cross Road",
    "category": "Arcade",
    "description": "Navigate across busy lanes without getting hit.",
    "playUrl": "/games/cross-road/index.html",
  },
  {
    "id": "dino-run",
    "name": "Dino Run",
    "category": "Arcade",
    "description": "Jump over obstacles and survive as long as possible.",
    "playUrl": "/games/dino-run/index.html",
  },
  {
    "id": "fruit-slice",
    "name": "Fruit Slice",
    "category": "Arcade",
    "description": "Slice the flying fruit and avoid mistakes.",
    "playUrl": "/games/fruit-slice/index.html",
  },
  {
    "id": "gem-match",
    "name": "Gem Match",
    "category": "Puzzle",
    "description": "Match gems to make combos and clear the board.",
    "playUrl": "/games/gem-match/index.html",
  },
  {
    "id": "helix-drop",
    "name": "Helix Drop",
    "category": "Arcade",
    "description": "Guide the ball down through the rotating tower.",
    "playUrl": "/games/helix-drop/index.html",
  },
  {
    "id": "lights-out",
    "name": "Lights Out",
    "category": "Puzzle",
    "description": "Turn off every light by solving the tile puzzle.",
    "playUrl": "/games/lights-out/index.html",
  },
  {
    "id": "maze-muncher",
    "name": "Maze Muncher",
    "category": "Arcade",
    "description": "Find your way through the maze and collect items.",
    "playUrl": "/games/maze-muncher/index.html",
  },
  {
    "id": "memory-match",
    "name": "Memory Match",
    "category": "Puzzle",
    "description": "Flip cards and find matching pairs.",
    "playUrl": "/games/memory-match/index.html",
  },
  {
    "id": "merge-drop",
    "name": "Merge Drop",
    "category": "Puzzle",
    "description": "Drop and combine matching pieces to build bigger values.",
    "playUrl": "/games/merge-drop/index.html",
  },
  {
    "id": "minesweeper",
    "name": "Minesweeper",
    "category": "Puzzle",
    "description": "Clear the grid using clues to avoid hidden mines.",
    "playUrl": "/games/minesweeper/index.html",
  },
  {
    "id": "paddle-duel",
    "name": "Paddle Duel",
    "category": "Arcade",
    "description": "Keep the ball in play and outscore the other paddle.",
    "playUrl": "/games/paddle-duel/index.html",
  },
  {
    "id": "piano-tap",
    "name": "Piano Tap",
    "category": "Casual",
    "description": "Tap the notes in time and keep your streak going.",
    "playUrl": "/games/piano-tap/index.html",
  },
  {
    "id": "reversi",
    "name": "Reversi",
    "category": "Board",
    "description": "Flip discs and finish with more of your color on the board.",
    "playUrl": "/games/reversi/index.html",
  },
  {
    "id": "slide-puzzle",
    "name": "Slide Puzzle",
    "category": "Puzzle",
    "description": "Slide tiles into the correct order.",
    "playUrl": "/games/slide-puzzle/index.html",
  },
  {
    "id": "snake",
    "name": "Snake",
    "category": "Classic",
    "description": "Eat the dots, grow longer, and avoid crashing.",
    "playUrl": "/games/snake/index.html",
  },
  {
    "id": "sokoban",
    "name": "Sokoban",
    "category": "Puzzle",
    "description": "Push crates onto the target spaces.",
    "playUrl": "/games/sokoban/index.html",
  },
  {
    "id": "stack-tower",
    "name": "Stack Tower",
    "category": "Arcade",
    "description": "Stack moving platforms as high as you can.",
    "playUrl": "/games/stack-tower/index.html",
  },
  {
    "id": "star-defender",
    "name": "Star Defender",
    "category": "Arcade",
    "description": "Defend against waves of incoming space enemies.",
    "playUrl": "/games/star-defender/index.html",
  },
  {
    "id": "sudoku",
    "name": "Sudoku",
    "category": "Puzzle",
    "description": "Fill the grid with numbers using logic.",
    "playUrl": "/games/sudoku/index.html",
  },
  {
    "id": "tic-tac-toe",
    "name": "Tic-Tac-Toe",
    "category": "Board",
    "description": "Get three marks in a row to win.",
    "playUrl": "/games/tic-tac-toe/index.html",
  },
  {
    "id": "water-sort",
    "name": "Water Sort",
    "category": "Puzzle",
    "description": "Sort the colored liquid into matching tubes.",
    "playUrl": "/games/water-sort/index.html",
  },
  {
    "id": "whack-a-mole",
    "name": "Whack-a-Mole",
    "category": "Arcade",
    "description": "Hit the targets before time runs out.",
    "playUrl": "/games/whack-a-mole/index.html",
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

  const filteredGames = useMemo(() => games.filter((game) =>
    (category === "All" || game.category === category) &&
    (game.name + " " + game.description + " " + game.category).toLowerCase().includes(query.toLowerCase().trim())
  ), [query, category]);

  function playGame(game) {
    setSelectedGame(game);
    try { localStorage.setItem("vehemence_last_played", JSON.stringify({ name: game.name, type: "game", id: game.id })); } catch {}
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
            <p>A little break, a quick match, one more round. Pick something and get into it.</p>
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
          <div className="games-spotlight-index">01 <span>/</span> 32</div>
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
                <a href={selectedGame.playUrl} target="_blank" rel="noreferrer">Open separately ↗</a>
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
