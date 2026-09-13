"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SHOWS = {
  "Tokyo Ghoul": [
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
  ],
  "Chainsaw Man": [
    [1, "https://www.dropbox.com/scl/fi/i8hckffvgnzvzv8p5is5d/1.mp4?rlkey=2ztslm3qc250zmwnfxbowpphx&st=jdkphkg2&raw=1"],
    [2, "https://www.dropbox.com/scl/fi/nxpgyc2xgunom8udadrjb/2.mp4?rlkey=nbki93x811zud7xwvbvb5g85i&st=qpc466qp&raw=1"],
    [3, "https://www.dropbox.com/scl/fi/zvkwdi1ti634yta91r75d/3.mp4?rlkey=sxinbcerl0a8f0p8avf6bar0k&st=j72buypy&raw=1"],
    [4, "https://www.dropbox.com/scl/fi/fqc8bmmebrt7gsh4eascy/4.mp4?rlkey=x85vrzvvi9mi01sim0no2y9ab&st=ta8k9q2e&raw=1"],
    [5, "https://www.dropbox.com/scl/fi/no1oza0g9270tl3cqwbop/5.mp4?rlkey=8lfwdtllhd6xnqao0bg0kh96f&st=79edfmxa&raw=1"],
    [6, "https://www.dropbox.com/scl/fi/xhn045vzxsahgrrbbhtmi/6.mp4?rlkey=afp9dc1v4qeg4fiu9l1pz7fo9&st=vuxybc6p&raw=1"],
    [7, "https://www.dropbox.com/scl/fi/t9jc1p4dbdf313a772zyk/7.mp4?rlkey=cz1iwv9j3333bs8mlhppuuykt&st=osf11tmy&raw=1"],
    [8, "https://www.dropbox.com/scl/fi/41ccdxlpx1ytfvbonbq73/8.mp4?rlkey=47a21w561efohuxmnuuuxsnja&st=z0o2br55&raw=1"],
    [9, "https://www.dropbox.com/scl/fi/6fedw56coppiq183fqo1m/9.mp4?rlkey=zbuz6gm9cnrfnzyxmjat369en&st=y7nxls2e&raw=1"],
    [10, "https://www.dropbox.com/scl/fi/mhct6uwhsoet5hqze6qwv/10.mp4?rlkey=xrbsluakuttxywwwheebyqhfj&st=jcd84rht&raw=1"],
    [11, "https://www.dropbox.com/scl/fi/2uewgbyy6nntp79dx6avf/11.mp4?rlkey=583ebdni64t2jsdl0ojyblekm&st=mln5sihw&raw=1"],
    [12, "https://www.dropbox.com/scl/fi/vj5ks45012npp7jd40uu3/12.mp4?rlkey=64apetb0m5wmunqt27ut2bgp1&st=qh0vfqsk&raw=1"],
  ],
};

const MOVIES = [];

function makeEpisodes(items) {
  return items.map(([number, url]) => ({ number, title: `Episode ${number}`, url }));
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

const controlStyle = {
  border: 0,
  background: "transparent",
  color: "#fff",
  width: 30,
  height: 30,
  padding: 0,
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  fontSize: 15,
};

const cardStyle = {
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 14,
  overflow: "hidden",
  background: "rgba(17,17,24,.82)",
  color: "#fff",
  cursor: "pointer",
  textAlign: "left",
  padding: 0,
  transition: "transform .18s ease, border-color .18s ease, background .18s ease",
};

export default function EntertainmentClient() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const [category, setCategory] = useState("Anime");
  const [show, setShow] = useState("Tokyo Ghoul");
  const [selectedEpisode, setSelectedEpisode] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const episodes = useMemo(() => makeEpisodes(SHOWS[show] || []), [show]);
  const currentEpisode = useMemo(
    () => episodes.find((episode) => episode.number === selectedEpisode) || episodes[0],
    [episodes, selectedEpisode]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = muted;
  }, [volume, muted, selectedEpisode, show]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError("");
  }, [selectedEpisode, show]);

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function showControls() {
    setControlsVisible(true);
    clearTimeout(hideTimerRef.current);
    if (isPlaying) hideTimerRef.current = setTimeout(() => setControlsVisible(false), 2600);
  }

  function chooseCategory(nextCategory) {
    setCategory(nextCategory);
    setControlsVisible(true);
  }

  function chooseShow(nextShow) {
    const nextEpisodes = SHOWS[nextShow] || [];
    setCategory("Anime");
    setShow(nextShow);
    setSelectedEpisode(nextEpisodes[0]?.[0] ?? 1);
    setError("");
    setControlsVisible(true);
    requestAnimationFrame(() => {
      const video = videoRef.current;
      if (!video) return;
      video.load();
      video.play().catch(() => {});
    });
  }

  function chooseMovie(movie) {
    setCategory("Movies");
    setShow(movie.title);
    setSelectedEpisode(0);
    setError("");
    setControlsVisible(true);
  }

  function chooseEpisode(number) {
    if (!episodes.some((item) => item.number === number)) return;
    setSelectedEpisode(number);
    setControlsVisible(true);
    requestAnimationFrame(() => {
      const video = videoRef.current;
      if (!video) return;
      video.load();
      video.play().catch(() => {});
    });
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setError("The episode could not be played."));
    else video.pause();
    showControls();
  }

  function seek(event) {
    const value = Number(event.target.value);
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = value;
    setCurrentTime(value);
  }

  function changeVolume(event) {
    const value = Number(event.target.value);
    setVolume(value);
    setMuted(value === 0);
    showControls();
  }

  function toggleMute() {
    setMuted((value) => !value);
    showControls();
  }

  function toggleExpand() {
    setExpanded((value) => !value);
    showControls();
  }

  async function toggleFullscreen() {
    const element = playerRef.current;
    if (!element) return;
    try {
      if (!document.fullscreenElement) await element.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      toggleExpand();
    }
  }

  function goToEpisode(number) {
    if (episodes.some((episode) => episode.number === number)) chooseEpisode(number);
  }

  function handleEnded() {
    const currentIndex = episodes.findIndex((episode) => episode.number === selectedEpisode);
    const nextEpisode = episodes[currentIndex + 1];
    if (nextEpisode) chooseEpisode(nextEpisode.number);
    else setIsPlaying(false);
  }

  const firstEpisode = episodes[0]?.number;
  const lastEpisode = episodes[episodes.length - 1]?.number;
  const animeNames = Object.keys(SHOWS);

  return (
    <div style={{ width: "100%", maxWidth: expanded ? 1180 : 900, margin: "0 auto", padding: "28px 20px 70px", transition: "max-width .25s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <h2 style={{ margin: 0, flex: 1, fontSize: 24 }}>{category === "Anime" ? show : "Movies"}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["Anime", "Movies"].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => chooseCategory(name)}
              style={{
                minWidth: 105,
                padding: "11px 18px",
                borderRadius: 10,
                border: category === name ? "1px solid rgba(255,255,255,.2)" : "1px solid rgba(255,255,255,.07)",
                background: category === name ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.035)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {category === "Anime" && currentEpisode ? (
        <>
          <section style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 15, overflow: "hidden", background: "rgba(17,17,24,.82)", boxShadow: "0 12px 40px rgba(0,0,0,.18)" }}>
            <div ref={playerRef} onMouseMove={showControls} onMouseLeave={() => isPlaying && setControlsVisible(false)} style={{ position: "relative", aspectRatio: "16 / 9", background: "#000", cursor: controlsVisible ? "default" : "none" }}>
              <video
                ref={videoRef}
                className="entertainment-video"
                src={currentEpisode.url}
                controls={false}
                preload="metadata"
                onClick={togglePlay}
                onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onPlay={() => { setIsPlaying(true); showControls(); }}
                onPause={() => { setIsPlaying(false); setControlsVisible(true); }}
                onEnded={handleEnded}
                onError={() => setError("This episode could not be loaded from Dropbox. Check the shared link.")}
                style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }}
              />

              <div onClick={(event) => event.stopPropagation()} style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "38px 12px 10px", opacity: controlsVisible ? 1 : 0, pointerEvents: controlsVisible ? "auto" : "none", transition: "opacity .2s ease", background: "linear-gradient(transparent, rgba(0,0,0,.88))" }}>
                <input aria-label="Seek" type="range" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={seek} style={{ width: "100%", height: 3, accentColor: "#ff0000", marginBottom: 8, display: "block", cursor: "pointer" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#fff" }}>
                  <button type="button" onClick={() => goToEpisode(selectedEpisode - 1)} disabled={selectedEpisode === firstEpisode} aria-label="Previous episode" style={{ ...controlStyle, opacity: selectedEpisode === firstEpisode ? .35 : 1 }}>⏮</button>
                  <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} style={{ ...controlStyle, width: 34, height: 34, fontSize: 14 }}>{isPlaying ? "❚❚" : "▶"}</button>
                  <button type="button" onClick={() => goToEpisode(selectedEpisode + 1)} disabled={selectedEpisode === lastEpisode} aria-label="Next episode" style={{ ...controlStyle, opacity: selectedEpisode === lastEpisode ? .35 : 1 }}>⏭</button>
                  <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} style={controlStyle}>{muted || volume === 0 ? "🔇" : "🔊"}</button>
                  <input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={changeVolume} style={{ width: 70, accentColor: "#fff", cursor: "pointer" }} />
                  <span style={{ fontSize: 12, opacity: .9, minWidth: 75 }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  <div style={{ flex: 1 }} />
                  <button type="button" onClick={toggleExpand} aria-label={expanded ? "Shrink" : "Expand"} style={controlStyle}>{expanded ? "↙" : "↗"}</button>
                  <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"} style={controlStyle}>{fullscreen ? "⛶" : "⛶"}</button>
                </div>
              </div>
            </div>
          </section>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 15 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>{show}</div>
              <div style={{ fontSize: 13, opacity: .55, marginTop: 3 }}>Episode {selectedEpisode}</div>
            </div>
          </div>

          {error && <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "rgba(255,70,70,.1)", border: "1px solid rgba(255,70,70,.2)", color: "#ffb0b0", fontSize: 13 }}>{error}</div>}

          <section style={{ marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Episodes</h3>
              <span style={{ fontSize: 12, opacity: .5 }}>{episodes.length} available</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
              {episodes.map((episode) => (
                <button key={episode.number} type="button" onClick={() => chooseEpisode(episode.number)} style={{ padding: "12px 10px", borderRadius: 9, border: episode.number === selectedEpisode ? "1px solid rgba(255,255,255,.25)" : "1px solid rgba(255,255,255,.07)", background: episode.number === selectedEpisode ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.035)", color: "#fff", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ fontSize: 12, opacity: .55 }}>EP {episode.number}</div>
                  <div style={{ fontSize: 13, fontWeight: 750, marginTop: 3 }}>{episode.title}</div>
                </button>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 30 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>Anime</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {animeNames.map((name) => (
                <button key={name} type="button" onClick={() => chooseShow(name)} style={{ ...cardStyle, borderColor: name === show ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.08)" }}>
                  <div style={{ height: 105, display: "grid", placeItems: "center", background: "linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.025))", fontSize: 30, fontWeight: 900 }}>
                    {name.split(" ").map((part) => part[0]).join("")}
                  </div>
                  <div style={{ padding: "12px 13px 14px" }}>
                    <div style={{ fontSize: 14, fontWeight: 850 }}>{name}</div>
                    <div style={{ fontSize: 11, opacity: .5, marginTop: 5 }}>{SHOWS[name].length} episodes</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section>
          <div style={{ marginBottom: 14, fontSize: 16, fontWeight: 800 }}>Movies</div>
          {MOVIES.length === 0 ? (
            <div style={{ padding: "42px 20px", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, background: "rgba(17,17,24,.55)", textAlign: "center", opacity: .65 }}>
              No movies added yet.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {MOVIES.map((movie) => (
                <button key={movie.title} type="button" onClick={() => chooseMovie(movie)} style={cardStyle}>
                  <div style={{ height: 105, display: "grid", placeItems: "center", background: "linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.025))", fontSize: 30, fontWeight: 900 }}>{movie.title.slice(0, 2).toUpperCase()}</div>
                  <div style={{ padding: "12px 13px 14px", fontSize: 14, fontWeight: 850 }}>{movie.title}</div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
