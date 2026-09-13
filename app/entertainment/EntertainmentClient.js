"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const EPISODES = Array.from({ length: 24 }, (_, index) => ({
  number: index + 1,
  title: `Episode ${index + 1}`,
  path: `entertainment/tokyo-ghoul/${index + 1}.mp4`,
}));

function getStorageUrl(path) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return "";
  return `${base}/storage/v1/object/public/${path}`;
}

export default function EntertainmentClient() {
  const videoRef = useRef(null);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState("");

  const currentEpisode = useMemo(
    () => EPISODES.find((episode) => episode.number === selectedEpisode) || EPISODES[0],
    [selectedEpisode]
  );

  const videoUrl = getStorageUrl(currentEpisode.path);
  const storageConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
  }, [volume, selectedEpisode]);

  useEffect(() => {
    setIsPlaying(false);
    setError("");
  }, [selectedEpisode]);

  function chooseEpisode(number) {
    setSelectedEpisode(number);
    requestAnimationFrame(() => {
      videoRef.current?.load();
    });
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => setError("The episode could not be played."));
    } else {
      video.pause();
    }
  }

  function goToEpisode(number) {
    if (number < 1 || number > EPISODES.length) return;
    chooseEpisode(number);
  }

  function handleEnded() {
    if (selectedEpisode < EPISODES.length) {
      chooseEpisode(selectedEpisode + 1);
    } else {
      setIsPlaying(false);
    }
  }

  return (
    <div className="entertainment-player-shell">
      <div className="entertainment-player-header">
        <div>
          <span className="entertainment-kicker">NOW PLAYING</span>
          <h2>Tokyo Ghoul</h2>
        </div>
        <button className="entertainment-close" type="button" aria-label="Close player">
          ×
        </button>
      </div>

      <div className="entertainment-player-layout">
        <section className="entertainment-video-panel">
          <div className="entertainment-video-wrap">
            {storageConfigured ? (
              <video
                ref={videoRef}
                className="entertainment-video"
                src={videoUrl}
                controls={false}
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleEnded}
                onError={() => setError("This episode could not be loaded. Check the Supabase Storage file path.")}
              />
            ) : (
              <div className="entertainment-video-placeholder">
                <span>▶</span>
                <strong>Player ready</strong>
                <p>Add your public Supabase URL to NEXT_PUBLIC_SUPABASE_URL to connect the episodes.</p>
              </div>
            )}
          </div>

          <div className="entertainment-controls">
            <div className="entertainment-main-controls">
              <button type="button" onClick={() => goToEpisode(selectedEpisode - 1)} disabled={selectedEpisode === 1} aria-label="Previous episode">
                ⏮
              </button>
              <button type="button" className="entertainment-play-button" onClick={togglePlay} disabled={!storageConfigured} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? "❚❚" : "▶"}
              </button>
              <button type="button" onClick={() => goToEpisode(selectedEpisode + 1)} disabled={selectedEpisode === EPISODES.length} aria-label="Next episode">
                ⏭
              </button>
            </div>

            <label className="entertainment-volume" htmlFor="entertainment-volume">
              <span aria-hidden="true">🔊</span>
              <input
                id="entertainment-volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                aria-label="Volume"
              />
            </label>
          </div>

          {error && <p className="entertainment-player-error">{error}</p>}
        </section>

        <aside className="entertainment-episodes">
          <div className="entertainment-episodes-heading">
            <div>
              <span className="entertainment-kicker">TOKYO GHOUL</span>
              <h3>Episodes</h3>
            </div>
            <span>{EPISODES.length}</span>
          </div>

          <div className="entertainment-episode-list">
            {EPISODES.map((episode) => (
              <button
                key={episode.number}
                type="button"
                className={`entertainment-episode ${episode.number === selectedEpisode ? "entertainment-episode-active" : ""}`}
                onClick={() => chooseEpisode(episode.number)}
              >
                <span className="entertainment-episode-number">{String(episode.number).padStart(2, "0")}</span>
                <span className="entertainment-episode-info">
                  <strong>{episode.title}</strong>
                  <small>{episode.number === selectedEpisode ? "Playing" : "Watch episode"}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
