"use client";

import { useEffect, useMemo, useState } from "react";

const words = ["CRANE", "SLATE", "BRICK", "PLANE", "SHEEP"];

const realGames = {
  "Cookie Clicker": "https://cookieclicker.com/",
  "Retro Bowl": "https://retrobowl.me/",
  "Slope": "https://www.crazygames.com/game/slope",
  "Rocket Goal": "https://rocket-goal.io/",
  "Basketball Stars": "https://playcutegames.com/game/basketball-stars",
  "Minesweeper": "https://minesweeper.online/",
  "Worlde": "https://www.nytimes.com/games/wordle/index.html",
  "Slither.io": "https://slither.io/",
  "Chess": "https://lichess.org/",
  "Tetris": "https://play.tetris.com/",
  "FNAF": "https://www.gameflare.com/search/five%20nights%20at%20freddy%27s/",
  "Subway Surfers": "https://subwaysurfers.com/",
  "Among Us": "https://cards.crazygames.to/game-among-us",
  "Space Waves": "https://www.crazygames.com/game/space-waves",
  "Speed Stars": "https://speedstars.ai/",
  "Stickman Hook": "https://www.crazygames.com/game/stickman-hook",
  "Eaglercraft": "https://g.deev.is/eaglercraft/",
  "Level Devil": "https://playleveldevil.com/",
  "Geometry Dash": "https://gdbrowser.com/",
};

function ExternalGame({ name, url }) {
  return (
    <div className="vb-center" style={{ padding: 0, gap: 10 }}>
      <iframe
        src={url}
        title={name}
        style={{ width: "100%", height: "100%", minHeight: 500, border: 0, display: "block" }}
        allow="autoplay; fullscreen; gamepad"
      />
      <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <button
          type="button"
          className="vb-button"
          style={{ pointerEvents: "auto", background: "rgba(10,10,14,.92)" }}
          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
        >
          Open game directly
        </button>
      </div>
    </div>
  );
}

function Clicker({ label = "CLICK", color = "#f0b" }) {
  const [score, setScore] = useState(0);
  return <div className="vb-center"><div className="vb-score">{score.toLocaleString()}</div><button className="vb-big" style={{ "--vb-accent": color }} onClick={() => setScore(s => s + 1)}>{label}</button><p>Click to score. Your progress stays for this session.</p></div>;
}

function Dodge({ bike = false, wave = false }) {
  const [x, setX] = useState(50); const [y, setY] = useState(70); const [score, setScore] = useState(0); const [running, setRunning] = useState(true);
  useEffect(() => { const fn = e => { if (!running) return; if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") setX(v => Math.max(5, v - 5)); if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") setX(v => Math.min(95, v + 5)); if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") setY(v => Math.max(10, v - 5)); if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") setY(v => Math.min(90, v + 5)); }; window.addEventListener("keydown", fn); const t = setInterval(() => { if (running) setScore(s => s + 1); }, 500); return () => { window.removeEventListener("keydown", fn); clearInterval(t); }; }, [running]);
  return <div className="vb-center"><div className="vb-arena"><div className="vb-player" style={{ left: `${x}%`, top: `${y}%` }}>{bike ? "🏍️" : wave ? "🚀" : "●"}</div><div className="vb-obstacle o1"/><div className="vb-obstacle o2"/></div><div className="vb-score">{score}</div><p>Use WASD or arrow keys. Keep moving and beat your score.</p><button className="vb-button" onClick={() => { setScore(0); setRunning(true); setX(50); setY(70); }}>Restart</button></div>;
}

function Mines() { const cells = useMemo(() => { const a = Array(25).fill(false); [3, 8, 14, 19, 22].forEach(i => a[i] = true); return a; }, []); const [open, setOpen] = useState([]); return <div className="vb-center"><div className="vb-grid5">{cells.map((mine, i) => <button key={i} onClick={() => setOpen(o => [...new Set([...o, i])])} className={open.includes(i) ? (mine ? "mine" : "safe") : "hidden"}>{open.includes(i) ? (mine ? "💥" : "·") : ""}</button>)}</div><p>Clear the board without finding all five mines.</p></div>; }

function Word() { const [answer] = useState(() => words[Math.floor(Math.random() * words.length)]); const [guess, setGuess] = useState(""); const [done, setDone] = useState(false); return <div className="vb-center"><h2>Guess the 5-letter word</h2><input className="vb-input" maxLength={5} value={guess} onChange={e => setGuess(e.target.value.toUpperCase())}/><button className="vb-button" onClick={() => setDone(true)}>Check</button>{done && <p>{guess === answer ? "You got it!" : "Not quite — try another word."}</p>}</div>; }

function Snake() { const [score, setScore] = useState(0); return <div className="vb-center"><div className="vb-snake">🐍</div><div className="vb-score">{score}</div><button className="vb-button" onClick={() => setScore(s => s + 1)}>Eat a dot</button><p>Use the button to grow your score in this lightweight local build.</p></div>; }

function Board({ chess = false }) { const [selected, setSelected] = useState(null); return <div className="vb-center"><div className="vb-board">{Array.from({ length: 64 }, (_, i) => <button key={i} onClick={() => setSelected(i)} className={(Math.floor(i / 8) + i) % 2 ? "dark" : "light"}>{chess ? ["♜","♞","♝","♛","♚","♝","♞","♜","♟","♟","♟","♟","♟","♟","♟","♟","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","♙","♙","♙","♙","♙","♙","♙","♖","♘","♗","♕","♔","♗","♘","♖"][i] : ""}</button>)}</div><p>{selected === null ? "Select a square to make a move." : `Selected square ${selected + 1}.`}</p></div>; }

function Generic({ name }) { const [score, setScore] = useState(0); return <div className="vb-center"><div className="vb-score">{score}</div><button className="vb-big" onClick={() => setScore(s => s + Math.ceil(Math.random() * 5))}>PLAY</button><p>{name} does not currently have a legitimate browser build that I can embed here.</p></div>; }

export default function GameBuild({ game }) {
  const n = game.name;
  if (realGames[n]) return <ExternalGame name={n} url={realGames[n]} />;
  if (n === "Minesweeper") return <Mines />;
  if (n === "Worlde") return <Word />;
  if (n === "Slither.io") return <Snake />;
  if (n === "Chess") return <Board chess />;
  if (n === "Tetris") return <Board />;
  return <Generic name={n} />;
}
