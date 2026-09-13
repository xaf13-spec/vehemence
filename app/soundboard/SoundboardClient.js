"use client";

import { useEffect, useRef, useState } from "react";

const sounds = [];

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const value = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(value / 60);
  const remaining = value % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export default function SoundboardClient() {
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function playSound(sound) {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    if (current?.id === sound.id && !audio.paused) {
      audio.pause();
      setPosition(audio.currentTime);
      return;
    }

    audio.src = sound.url;
    audio.currentTime = 0;
    setCurrent(sound);
    setPosition(0);
    setDuration(0);
    audio.play().catch(() => {});
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const update = () => {
      setPosition(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };
    const ended = () => {
      setPosition(0);
      setCurrent(null);
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);
    audio.addEventListener("durationchange", update);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
      audio.removeEventListener("durationchange", update);
      audio.removeEventListener("ended", ended);
    };
  }, [current]);

  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(now);

  const formattedClock = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short"
  }).format(now);

  return (
    <div className="soundboard-wrap">
      <div className="soundboard-time-card">
        <span className="soundboard-time">{formattedClock}</span>
        <span className="soundboard-date">{formattedDate}</span>
      </div>

      {sounds.length === 0 ? (
        <div className="soundboard-empty">
          <h3>No sounds added yet</h3>
          <p>Send me your sound links and the names you want for them, and they can be added here.</p>
        </div>
      ) : (
        <div className="soundboard-grid">
          {sounds.map((sound) => {
            const isCurrent = current?.id === sound.id;
            return (
              <article className="sound-card" key={sound.id}>
                <div className="sound-card-top">
                  <div>
                    <h3>{sound.name}</h3>
                    <span>{formatTime(sound.duration)}</span>
                  </div>
                  <button className="primary-button" type="button" onClick={() => playSound(sound)}>
                    {isCurrent && !audioRef.current?.paused ? "Pause" : "Play"}
                  </button>
                </div>
                <div className="sound-progress-row">
                  <span>{isCurrent ? formatTime(position) : "0:00"}</span>
                  <input
                    type="range"
                    min="0"
                    max={isCurrent ? duration || 0 : sound.duration || 0}
                    step="0.01"
                    value={isCurrent ? Math.min(position, duration || position) : 0}
                    onChange={(event) => {
                      if (!isCurrent || !audioRef.current) return;
                      const next = Number(event.target.value);
                      audioRef.current.currentTime = next;
                      setPosition(next);
                    }}
                    aria-label={`${sound.name} progress`}
                  />
                  <span>{formatTime(isCurrent ? duration : sound.duration)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
