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
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(null);

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    updateClock();
    const timer = setInterval(updateClock, 1000);
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
      setDuration(0);
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

  const formattedDate = now ? new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(now) : "Loading date...";

  const parts = now ? new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).formatToParts(now) : [];
  const amPm = parts.find((part) => part.type === "dayPeriod")?.value || "--";
  const hour = parts.find((part) => part.type === "hour")?.value || "--";
  const minute = parts.find((part) => part.type === "minute")?.value || "--";
  const second = parts.find((part) => part.type === "second")?.value || "--";

  const filteredSounds = sounds.filter((sound) =>
    sound.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="soundboard-wrap">
      <div className="soundboard-time-card">
        <div>
          <span className="soundboard-time-period">{amPm}</span>
          <span className="soundboard-time">{hour}:{minute}:{second}</span>
        </div>
        <span className="soundboard-date">{formattedDate} · Ontario / New York</span>
      </div>

      <div className="soundboard-search-card">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search sounds..."
          aria-label="Search sounds"
          className="soundboard-search"
        />
      </div>

      {sounds.length === 0 ? (
        <div className="soundboard-empty">
          <h3>No sounds added yet</h3>
          <p>Send me your sound links and the names you want for them, and they can be added here.</p>
        </div>
      ) : filteredSounds.length === 0 ? (
        <div className="soundboard-empty">
          <h3>No sounds found</h3>
          <p>Try a different search.</p>
        </div>
      ) : (
        <div className="soundboard-grid">
          {filteredSounds.map((sound) => {
            const isCurrent = current?.id === sound.id;
            const isPlaying = isCurrent && !audioRef.current?.paused;
            return (
              <article className="sound-card" key={sound.id}>
                <div className="sound-card-top">
                  <div>
                    <h3>{sound.name}</h3>
                    <span>{formatTime(sound.duration)}</span>
                  </div>
                  <button className="primary-button" type="button" onClick={() => playSound(sound)}>
                    {isPlaying ? "Pause" : "Play"}
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
