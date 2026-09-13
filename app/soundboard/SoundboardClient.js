"use client";

import { useEffect, useRef, useState } from "react";

const sounds = [
  { id: "pump-shotgun-fortnite-loud", name: "pump shotgun fortnite loud", url: "https://www.dropbox.com/scl/fi/cq3z7g7w128l8ggy2s10i/pump-shotgun-fortnite-loud.mp3?rlkey=v7qt3iwkr3as0tqwtm91c4tud&dl=1" },
  { id: "flashbang-cs", name: "flashbang cs", url: "https://www.dropbox.com/scl/fi/t2e5q6wrtrspuhqgeeimi/flashbang-cs_qoRhxLn.mp3?rlkey=fy42gknbi7rw9fu89sbtkrhb4&dl=1" },
  { id: "fahhhhh", name: "fahhhhh", url: "https://www.dropbox.com/scl/fi/u5aa1nn88joc3qpvk4qc8/fahhhhh.mp3?rlkey=c20tk9kg9vuuyrinkjttcdgp1&dl=1" },
  { id: "eagle-rahhh", name: "eagle rahhh", url: "https://www.dropbox.com/scl/fi/quuqg2aldo7srakqnypn7/eagle-rahhh.mp3?rlkey=h9bda1irs1uio0i410l7nh219&dl=1" },
  { id: "homer-lets-the-barts-out", name: "homer lets the barts out", url: "https://www.dropbox.com/scl/fi/qbtwbio6dwaje0sgs5xd4/homer-lets-the-barts-out.mp3?rlkey=cktftpn79dzzwi0tqef3zo0qr&dl=1" },
  { id: "m-e-o-w", name: "m e o w", url: "https://www.dropbox.com/scl/fi/1pc4xvm9ylx1iray97zuj/m-e-o-w.mp3?rlkey=9vvdngitrp1brlyqy30af9dkl&dl=1" },
  { id: "baby-laughing-meme", name: "baby laughing meme", url: "https://www.dropbox.com/scl/fi/w31c1iinjr7ed8xxxcjhn/baby-laughing-meme.mp3?rlkey=d4o7lqxoda21lvot6a4mqlejb&dl=1" },
  { id: "chicken-on-tree-screaming", name: "chicken on tree screaming", url: "https://www.dropbox.com/scl/fi/7ffvv524r9rlwe16eni8l/chicken-on-tree-screaming.mp3?rlkey=fy21xvip2fjv5rxx4f7zwtj2c&dl=1" },
  { id: "smoke-detector-beep", name: "smoke detector beep", url: "https://www.dropbox.com/scl/fi/yfwvxj8bc7jij53w6i5n1/smoke-detector-beep.mp3?rlkey=u3q7l4fhfseerejq740rg0sfg&dl=1" },
  { id: "prowler-sound-effect", name: "prowler sound effect", url: "https://www.dropbox.com/scl/fi/pa2inxkj5c1dx6lnl9u0h/prowler-sound-effect_6bXErot.mp3?rlkey=sjtjjy7cc5dxs7fnemvd5p4so&dl=1" },
  { id: "what-a-good-boy", name: "what a good boy", url: "https://www.dropbox.com/scl/fi/oi3a4or23yjzv9uuh7clr/what-a-good-boy.mp3?rlkey=qxuafr2dcsrl50x77xo88l6lh&dl=1" },
  { id: "bark-fart", name: "bark fart", url: "https://www.dropbox.com/scl/fi/jbzzuswmz9pdg0g3udab4/bark-fart_XRsy1HE.mp3?rlkey=r03b5wc3v9k1j47iov9w3el96&dl=1" },
  { id: "tmp", name: "tmp", url: "https://www.dropbox.com/scl/fi/9i40dc5ino7adr6313lvq/tmp_7901-951678082.mp3?rlkey=nwutyoo8chu8x4exfg4vpy7og&dl=1" }
];

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

  function playSound(sound) {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    if (current?.id === sound.id) {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
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

  const filteredSounds = sounds.filter((sound) =>
    sound.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="soundboard-wrap">
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

      {filteredSounds.length === 0 ? (
        <div className="soundboard-empty">
          <h3>{sounds.length === 0 ? "No sounds added yet" : "No sounds found"}</h3>
          <p>{sounds.length === 0 ? "Send me the sound links and the names you want for them, and they can be added here." : "Try a different search."}</p>
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
                    <span>{isCurrent ? formatTime(duration) : "0:00"}</span>
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
                    max={isCurrent ? duration || 0 : 0}
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
                  <span>{isCurrent ? formatTime(duration) : "0:00"}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
