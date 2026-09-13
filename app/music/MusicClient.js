"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const spotifyPlaylists = [];

const localTracks = [];

export default function MusicClient() {
  const audioRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);

  const activeIndex = useMemo(() => localTracks.findIndex((track) => track.id === selected), [selected]);
  const activeTrack = activeIndex >= 0 ? localTracks[activeIndex] : null;

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    const onEnd = () => {
      setPlaying(false);
      if (activeIndex >= 0 && activeIndex < localTracks.length - 1) {
        setSelected(localTracks[activeIndex + 1].id);
        setProgress(0);
        requestAnimationFrame(() => audioRef.current?.play().catch(() => {}));
      }
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (!audioRef.current || !activeTrack) return;
    audioRef.current.load();
    setProgress(0);
  }, [selected, activeTrack]);

  function playTrack(track) {
    if (!track) return;
    if (selected !== track.id) {
      setSelected(track.id);
      setProgress(0);
      requestAnimationFrame(() => {
        audioRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      });
      return;
    }
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  }

  function goToTrack(direction) {
    if (!localTracks.length) return;
    const nextIndex = Math.max(0, Math.min(localTracks.length - 1, activeIndex + direction));
    if (nextIndex === activeIndex) return;
    const next = localTracks[nextIndex];
    setSelected(next.id);
    setProgress(0);
    requestAnimationFrame(() => {
      audioRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    });
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remaining}`;
  }

  const remainingTime = audioRef.current?.duration
    ? audioRef.current.duration - audioRef.current.currentTime
    : 0;

  return (
    <main className="music-page">
      <section className="music-hero">
        <div>
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Music</h1>
          <p>Play your playlists and music without leaving Vehemence.</p>
        </div>

        <div className="music-now-card">
          <div className="music-now-art">
            {activeTrack?.image ? (
              <img src={activeTrack.image} alt="" />
            ) : (
              <div className="music-art-fallback">♪</div>
            )}
          </div>

          <div className="music-now-details">
            <span className="music-status">NOW PLAYING</span>
            <strong>{activeTrack?.title || "Nothing playing"}</strong>
            <span>{activeTrack?.artist || "Choose a track to get started"}</span>
          </div>

          <div className="music-now-controls">
            <button type="button" className="music-control-icon" disabled={!activeTrack || activeIndex <= 0} onClick={() => goToTrack(-1)} aria-label="Previous song" title="Previous song">⏮</button>
            <button type="button" className="music-control-icon music-control-main" disabled={!activeTrack} onClick={() => playTrack(activeTrack)} aria-label={playing ? "Pause" : "Play"} title={playing ? "Pause" : "Play"}>{playing ? "Ⅱ" : "▶"}</button>
            <button type="button" className="music-control-icon" disabled={!activeTrack || activeIndex >= localTracks.length - 1} onClick={() => goToTrack(1)} aria-label="Next song" title="Next song">⏭</button>
            <button type="button" className={`music-control-icon ${muted ? "active" : ""}`} disabled={!activeTrack} onClick={() => setMuted((value) => !value)} aria-label={muted ? "Unmute" : "Mute"} title={muted ? "Unmute" : "Mute"}>{muted ? "🔇" : "🔊"}</button>
          </div>

          <div className="music-now-time">
            <span>{formatTime(remainingTime)} left</span>
            <input
              className="music-progress"
              type="range"
              min="0"
              max="100"
              value={progress}
              disabled={!activeTrack}
              onChange={(event) => {
                const value = Number(event.target.value);
                setProgress(value);
                if (audioRef.current?.duration) audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
              }}
              aria-label="Track progress"
            />
          </div>
        </div>
      </section>

      <section className="music-section">
        <div className="music-section-heading">
          <div><h2>Spotify</h2><p>Embedded playlists will appear here.</p></div>
        </div>
        {spotifyPlaylists.length ? spotifyPlaylists.map((playlist) => (
          <article className="spotify-card" key={playlist.id}>
            <div className="spotify-card-heading"><div><span className="music-status">SPOTIFY</span><h3>{playlist.name}</h3></div></div>
            <iframe src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator`} title={playlist.name} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
          </article>
        )) : (
          <div className="music-empty"><strong>Spotify playlists go here.</strong><span>Send me the playlist links and I’ll wire them into these embeds.</span></div>
        )}
      </section>

      {activeTrack && <audio ref={audioRef} src={activeTrack.url} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />}
    </main>
  );
}
