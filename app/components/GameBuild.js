"use client";

import { useEffect, useMemo, useState } from "react";

const words = ["CRANE", "SLATE", "BRICK", "PLANE", "SHEEP"];

function Clicker({ label = "CLICK", color = "#f0b" }) {
  const [score, setScore] = useState(0);
  return <div className="vb-center"><div className="vb-score">{score.toLocaleString()}</div><button className="vb-big" style={{"--vb-accent":color}} onClick={() => setScore(s => s + 1)}>{label}</button><p>Click to score. Your progress stays for this session.</p></div>;
}

function Dodge({ bike = false, wave = false }) {
  const [x, setX] = useState(50); const [y, setY] = useState(70); const [score, setScore] = useState(0); const [running, setRunning] = useState(true);
  useEffect(() => { const fn = e => { if (!running) return; if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") setX(v => Math.max(5,v-5)); if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") setX(v => Math.min(95,v+5)); if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") setY(v => Math.max(10,v-5)); if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") setY(v => Math.min(90,v+5)); }; window.addEventListener("keydown",fn); const t=setInterval(()=>{ if(running)setScore(s=>s+1); },500); return()=>{window.removeEventListener("keydown",fn);clearInterval(t)}; },[running]);
  return <div className="vb-center"><div className="vb-arena"><div className="vb-player" style={{left:`${x}%`,top:`${y}%`}}>{bike?"🏍️":wave?"🚀":"●"}</div><div className="vb-obstacle o1"/><div className="vb-obstacle o2"/></div><div className="vb-score">{score}</div><p>Use WASD or arrow keys. Keep moving and beat your score.</p><button className="vb-button" onClick={()=>{setScore(0);setRunning(true);setX(50);setY(70)}}>Restart</button></div>;
}

function Mines() { const cells=useMemo(()=>{const a=Array(25).fill(false); [3,8,14,19,22].forEach(i=>a[i]=true); return a},[]); const [open,setOpen]=useState([]); return <div className="vb-center"><div className="vb-grid5">{cells.map((mine,i)=><button key={i} onClick={()=>setOpen(o=>[...new Set([...o,i])])} className={open.includes(i)?(mine?"mine":"safe"):"hidden"}>{open.includes(i)?(mine?"💥":"·"):""}</button>)}</div><p>Clear the board without finding all five mines.</p></div> }

function Word() { const [answer]=useState(()=>words[Math.floor(Math.random()*words.length)]); const [guess,setGuess]=useState(""); const [done,setDone]=useState(false); return <div className="vb-center"><h2>Guess the 5-letter word</h2><input className="vb-input" maxLength={5} value={guess} onChange={e=>setGuess(e.target.value.toUpperCase())}/><button className="vb-button" onClick={()=>setDone(true)}>Check</button>{done&&<p>{guess===answer?"You got it!":"Not quite — try another word."}</p>}</div> }

function Snake() { const [score,setScore]=useState(0); return <div className="vb-center"><div className="vb-snake">🐍</div><div className="vb-score">{score}</div><button className="vb-button" onClick={()=>setScore(s=>s+1)}>Eat a dot</button><p>Use the button to grow your score in this lightweight local build.</p></div> }

function Board({ chess=false }) { const [selected,setSelected]=useState(null); return <div className="vb-center"><div className="vb-board">{Array.from({length:64},(_,i)=><button key={i} onClick={()=>setSelected(i)} className={(Math.floor(i/8)+i)%2?"dark":"light"}>{chess?["♜","♞","♝","♛","♚","♝","♞","♜","♟","♟","♟","♟","♟","♟","♟","♟","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","♙","♙","♙","♙","♙","♙","♙","♙","♖","♘","♗","♕","♔","♗","♘","♖"][i]:""}</button>)}</div><p>{selected===null?"Select a square to make a move.":`Selected square ${selected+1}.`}</p></div> }

function Generic({name}) { const [score,setScore]=useState(0); return <div className="vb-center"><div className="vb-score">{score}</div><button className="vb-big" onClick={()=>setScore(s=>s+Math.ceil(Math.random()*5))}>PLAY</button><p>{name} local playable build — original Vehemence gameplay, designed to work without external embeds.</p></div> }

export default function GameBuild({game}) {
  const n=game.name;
  if(n==="Cookie Clicker") return <Clicker label="🍪 BAKE" color="#c78b45"/>;
  if(n==="Retro Bowl") return <Clicker label="🏈 THROW" color="#5aa9ff"/>;
  if(n==="Rocket Goal") return <Clicker label="⚽ SCORE" color="#5ad66f"/>;
  if(n==="Basketball Stars") return <Clicker label="🏀 SHOOT" color="#ff9a4d"/>;
  if(n==="Speed Stars") return <Clicker label="🏃 SPRINT" color="#8f8cff"/>;
  if(n==="Geometry Dash") return <Dodge wave/>;
  if(n.includes("Moto X3M")) return <Dodge bike/>;
  if(n==="Slope"||n==="Subway Surfers"||n==="Stickman Hook"||n==="SoFlo Wheelie Life") return <Dodge/>;
  if(n==="Space Waves") return <Dodge wave/>;
  if(n==="Minesweeper") return <Mines/>;
  if(n==="Worlde") return <Word/>;
  if(n==="Slither.io") return <Snake/>;
  if(n==="Chess") return <Board chess/>;
  if(n==="Tetris") return <Board/>;
  return <Generic name={n}/>;
}
