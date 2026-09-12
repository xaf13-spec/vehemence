"use client";

import { useEffect, useRef, useState } from "react";
import GameBuild from "./GameBuild";

export default function GamePlayer({ game, onClose }) {
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    const saved = Number(localStorage.getItem("vehemence_volume") || 80);
    setVolume(Math.max(0, Math.min(100, saved)));
    if (localStorage.getItem("vehemence_auto_fullscreen") === "true") {
      const timer = setTimeout(() => playerRef.current?.requestFullscreen?.().catch(() => {}), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(event) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: "vehemence-volume", volume: volume / 100 }, "*");
    localStorage.setItem("vehemence_volume", String(volume));
  }, [volume]);

  async function toggleFullscreen() {
    if (!playerRef.current) return;
    if (document.fullscreenElement) { await document.exitFullscreen(); return; }
    await playerRef.current.requestFullscreen();
  }

  return <div className="game-player-overlay" role="dialog" aria-modal="true"><div className="game-player" ref={playerRef}>
    <div className="game-player-topbar"><div className="game-player-title"><span className="game-player-eyebrow">PLAYING</span><strong>{game.name}</strong></div><div className="game-player-controls">
      {game.hasSound && <label className="game-volume"><span>Volume</span><input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} aria-label="Game volume" /></label>}
      <button type="button" className="game-player-button" onClick={toggleFullscreen}>Fullscreen</button><button type="button" className="game-player-close" onClick={onClose} aria-label="Close game">×</button>
    </div></div>
    <div className="game-player-content"><GameBuild game={game} /></div>
  </div></div>;
}
