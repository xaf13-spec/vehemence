"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const EPISODES = [
  [2, "https://www.dropbox.com/scl/fi/le0ct19zbddvaehk1pgrd/2.mp4?rlkey=ugane14tnue0po2czk6r2ba6y&st=lbmtz2q4&raw=1"],
  [3, "https://www.dropbox.com/scl/fi/t8xyrh4o8lhoxck2tvmwd/3.mp4?rlkey=qramzc1huee7n12ocbqfal17t&st=2t9llmwa&raw=1"],
  [4, "https://www.dropbox.com/scl/fi/fg31a37k6x2m31hco564v/4.mp4?rlkey=ike0z9qp0oocr2gchouyi0ggv&st=1ikvtyri&raw=1"],
  [5, "https://www.dropbox.com/scl/fi/92w6w0ind7irhq0nimzvg/5.mp4?rlkey=htujdf8b6o36p53gpxf8ahelr&st=k0o0hzvw&raw=1"],
  [6, "https://www.dropbox.com/scl/fi/gcuyp4cp4ud3yejj8bq3x/6.mp4?rlkey=sfn47kitkrpty3ga9tz5vrjjg&st=kxcxplcb&raw=1"],
  [7, "https://www.dropbox.com/scl/fi/16tjg8g23zz4vifcduvve/7.mp4?rlkey=da2esh1yx1c9prly3n0t420ba&st=2anr9hom&raw=1"],
  [8, "https://www.dropbox.com/scl/fi/k5bfp3b6sm4ngx37jd2b1/8.mp4?rlkey=looncmesdtqbghx967ag4ukkt&st=c6h0bne2&raw=1"],
  [9, "https://www.dropbox.com/scl/fi/hsmvwu05s39mamatbu70h/9.mp4?rlkey=nr882nj6h4d75gp1fpa2coczw&st=0258p21j&raw=1"],
  [10, "https://www.dropbox.com/scl/fi/x8fmx276vj2zk2s30gje4/10.mp4?rlkey=6f4zr993stmuhywmw2vchcwa7&st=rwc4wwhq&raw=1"],
  [11, "https://www.dropbox.com/scl/fi/8fjfftqfuz7bjepi7yohx/11.mp4?rlkey=6dxys92sm4kqfnn946nr236m4&st=u3a9z68g&raw=1"],
  [12, "https://www.dropbox.com/scl/fi/cgvp82t0r8xe1llkro8rd/12.mp4?rlkey=6ie7y0742zsn8lhc9fb0ni156&st=vqg8eqqd&raw=1"],
  [13, "https://www.dropbox.com/scl/fi/iuieok928d2q240lh33pq/13.mp4?rlkey=6265rhuh9ujcwehk80zw9uz96&st=boxbw192&raw=1"],
].map(([number, url]) => ({
  number,
  title: `Episode ${number}`,
  url,
}));

export default function EntertainmentClient() {
  const videoRef = useRef(null);
  const [selectedEpisode, setSelectedEpisode] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState("");

  const currentEpisode = useMemo(
    () => EPISODES.find((episode) => episode.number === selectedEpisode) || EPISODES[0],
    [selectedEpisode]
  );

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
    const episode = EPISODES.find((item) => item.number === number);
    if (!episode) return;
    setSelectedEpisode(number);
    requestAnimationFrame(() => videoRef.current?.load());
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
    if (EPISODES.some((episode) => episode.number === number)) chooseEpisode(number);
  }

  function handleEnded() {
    const currentIndex = EPISODES.findIndex((episode) => episode.number === selectedEpisode);
    const nextEpisode = EPISODES[currentIndex + 1];
    if (nextEpisode) {
      chooseEpisode(nextEpisode.number);
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
            <video
              ref={videoRef}
              className="entertainment-video"
              src={currentEpisode.url}
              controls={false}
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleEnded}
              onError={() => setError("This episode could not be loaded from Dropbox. Check the shared link.")}
            />
          </div>

          <div className="entertainment-controls">
            <div className="entertainment-main-controls">
              <button type="button" onClick={() => goToEpisode(selectedEpisode - 1)} disabled={selectedEpisode === 2} aria-label="Previous episode">
                ⏮
              </button>
              <button type="button" className="entertainment-play-button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? "❚❚" : "▶"}
              </button>
              <button type="button" onClick={() => goToEpisode(selectedEpisode + 1)} disabled={selectedEpisode === 13} aria-label="Next episode">
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
