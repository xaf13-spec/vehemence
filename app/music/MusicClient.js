"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const spotifyPlaylists = [];

const localTracks = [];

export default function MusicClient() {
  const audioRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);

  const activeTrack = useMemo(() => localTracks.find((track) => track.id === selected) || null, [selected]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [activeTrack]);

  async function toggleTrack(track) {
    if (selected !== track.id) {
      setSelected(track.id);
      setProgress(0);
      requestAnimationFrame(async () => {
        if (!audioRef.current) return;
        try { await audioRef.current.play(); setPlaying(true); } catch { setPlaying(false); }
      });
      return;
    }
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setPlaying(true);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  }

  return (
    <main className="music-page">
      <section className="music-hero">
        <div>
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Music</h1>
          <p>Play your playlists and music without leaving Vehemence.</p>
        </div>
        <div className="music-now-card">
          <span className="music-status">NOW PLAYING</span>
          <strong>{activeTrack?.title || "Nothing playing"}</strong>
          <span>{activeTrack?.artist || "Choose a track to get started"}</span>
        </div>
      </section>

      <section className="music-section">
        <div className="music-section-heading">
          <div><h2>Your Music</h2><p>Local MP3s hosted by Vehemence.</p></div>
        </div>
        {localTracks.length ? (
          <div className="music-track-list">
            {localTracks.map((track, index) => (
              <button type="button" className={`music-track ${selected === track.id ? "active" : ""}`} key={track.id} onClick={() => toggleTrack(track)}>
                <span className="music-track-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="music-track-copy"><strong>{track.title}</strong><small>{track.artist}</small></span>
                <span className="music-track-action">{selected === track.id && playing ? "Pause" : "Play"}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="music-empty"><strong>Your MP3 library is ready.</strong><span>Add your licensed MP3 files to the Music library and they will show up here as playlists.</span></div>
        )}
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

      <div className="music-player">
        <div className="music-player-info"><span className="music-player-label">PLAYER</span><strong>{activeTrack?.title || "Select a track"}</strong><small>{activeTrack?.artist || "Vehemence Music"}</small></div>
        <div className="music-player-center">
          <button type="button" className="music-control" disabled={!activeTrack} onClick={() => toggleTrack(activeTrack)}>{playing ? "Pause" : "Play"}</button>
          <input className="music-progress" type="range" min="0" max="100" value={progress} disabled={!activeTrack} onChange={(event) => { setProgress(Number(event.target.value)); if (audioRef.current?.duration) audioRef.current.currentTime = (Number(event.target.value) / 100) * audioRef.current.duration; }} aria-label="Track progress" />
        </div>
        <label className="music-volume"><span>Volume</span><input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>
      </div>

      {activeTrack && <audio ref={audioRef} src={activeTrack.url} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />}
    </main>
  );
}
