"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SHOWS = {
  "Tokyo Ghoul": [
    [2, "https://www.dropbox.com/scl/fi/le0ct19zbddvaehk1pgrd/2.mp4?rlkey=ugane14tnuee7n12ocbqfal17t&st=lbmtz2q4&raw=1"],
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

const MOVIES = [
  { title: "Kingdom of the Planet of the Apes", embed: "https://anonmp4.art/embed/JpOSYXFhQobeCL6" },
  { title: "Despicable Me 3", embed: "https://anonmp4.art/embed/zLFFdhPwEhDPs6T" },
  { title: "Despicable Me 2", embed: "https://anonmp4.art/embed/hhzNXtvx3jK85ss" },
  { title: "Despicable Me", embed: "https://anonmp4.art/embed/BO2bwOOHrdOtVpf" },
];

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
  const [selectedMovie, setSelectedMovie] = useState(null);
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
  const currentEpisode = useMemo(() => episodes.find((episode) => episode.number === selectedEpisode) || episodes[0], [episodes, selectedEpisode]);

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
    setSelectedMovie(null);
    setControlsVisible(true);
    setError("");
  }

  function chooseShow(nextShow) {
    const nextEpisodes = SHOWS[nextShow] || [];
    setCategory("Anime");
    setSelectedMovie(null);
    setShow(nextShow);
    setSelectedEpisode(nextEpisodes[0]?.[0] ?? 1);
    setError("");
    setControlsVisible(true);
  }

  function chooseMovie(movie) {
    setCategory("Movies");
    setSelectedMovie(movie);
    setShow(movie.title);
    setError("");
    setControlsVisible(true);
  }

  function chooseEpisode(number) {
    if (!episodes.some((item) => item.number === number)) return;
    setSelectedEpisode(number);
    setControlsVisible(true);
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

  function handleEnded() {
    const currentIndex = episodes.findIndex((episode) => episode.number === selectedEpisode);
    const nextEpisode = episodes[currentIndex + 1];
    if (nextEpisode) chooseEpisode(nextEpisode.number);
    else setIsPlaying(false);
  }

  const animeNames = Object.keys(SHOWS);

  return (
    <div style={{ width: "100%", maxWidth: expanded ? 1180 : 900, margin: "0 auto", padding: "28px 20px 70px", transition: "max-width .25s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <h2 style={{ margin: 0, flex: 1, fontSize: 24 }}>{category === "Anime" ? show : selectedMovie?.title || "Movies"}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["Anime", "Movies"].map((name) => (
            <button key={name} type="button" onClick={() => chooseCategory(name)} style={{ minWidth: 105, padding: "11px 18px", borderRadius: 10, border: category === name ? "1px solid rgba(255,255,255,.2)" : "1px solid rgba(255,255,255,.07)", background: category === name ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.035)", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>{name}</button>
          ))}
        </div>
      </div>

      {category === "Anime" && currentEpisode ? (
        <>
          <section style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 15, overflow: "hidden", background: "rgba(17,17,24,.82)", boxShadow: "0 12px 40px rgba(0,0,0,.18)" }}>
            <div ref={playerRef} onMouseMove={showControls} onMouseLeave={() => isPlaying && setControlsVisible(false)} style={{ position: "relative", aspectRatio: "16 / 9", background: "#000", cursor: controlsVisible ? "default" : "none" }}>
              <video ref={videoRef} src={currentEpisode.url} controls={false} preload="metadata" onClick={togglePlay} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onPlay={() => { setIsPlaying(true); showControls(); }} onPause={() => { setIsPlaying(false); setControlsVisible(true); }} onEnded={handleEnded} onError={() => setError("This episode could not be loaded from Dropbox. Check the shared link.")} style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }} />
              <div onClick={(event) => event.stopPropagation()} style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "38px 12px 10px", opacity: controlsVisible ? 1 : 0, pointerEvents: controlsVisible ? "auto" : "none", transition: "opacity .2s ease", background: "linear-gradient(transparent, rgba(0,0,0,.88))" }}>
                <input aria-label="Seek" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={seek} style={{ width: "100%", accentColor: "#fff" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <button type="button" onClick={togglePlay} style={controlStyle}>{isPlaying ? "❚❚" : "▶"}</button>
                  <button type="button" onClick={() => chooseEpisode(Math.max(episodes[0]?.number ?? selectedEpisode, selectedEpisode - 1))} style={controlStyle}>⏮</button>
                  <button type="button" onClick={() => chooseEpisode(Math.min(episodes[episodes.length - 1]?.number ?? selectedEpisode, selectedEpisode + 1))} style={controlStyle}>⏭</button>
                  <button type="button" onClick={toggleMute} style={controlStyle}>{muted || volume === 0 ? "🔇" : "🔊"}</button>
                  <input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={changeVolume} style={{ width: 80, accentColor: "#fff" }} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.8)", minWidth: 80 }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  <div style={{ flex: 1 }} />
                  <button type="button" onClick={toggleExpand} style={controlStyle}>{expanded ? "↙" : "↗"}</button>
                  <button type="button" onClick={toggleFullscreen} style={controlStyle}>{fullscreen ? "⛶" : "⛶"}</button>
                </div>
              </div>
              {error && <div style={{ position: "absolute", left: 14, right: 14, top: 14, padding: "10px 12px", borderRadius: 9, background: "rgba(0,0,0,.72)", color: "#fff", fontSize: 12 }}>{error}</div>}
            </div>
          </section>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>Episodes</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
              {episodes.map((episode) => <button key={episode.number} type="button" onClick={() => chooseEpisode(episode.number)} style={{ padding: "10px 12px", borderRadius: 9, border: episode.number === selectedEpisode ? "1px solid rgba(255,255,255,.22)" : "1px solid rgba(255,255,255,.07)", background: episode.number === selectedEpisode ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.035)", color: "#fff", cursor: "pointer", textAlign: "left" }}>Episode {episode.number}</button>)}
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>Available Anime</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
              {animeNames.map((name) => <button key={name} type="button" onClick={() => chooseShow(name)} style={cardStyle}><div style={{ height: 105, background: "linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.025))", display: "grid", placeItems: "center", fontSize: 22, fontWeight: 900 }}>{name === "Chainsaw Man" ? "CSM" : "TG"}</div><div style={{ padding: 12 }}><div style={{ fontWeight: 800 }}>{name}</div><div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,.55)" }}>{SHOWS[name].length} episodes available</div></div></button>)}
            </div>
          </div>
        </>
      ) : category === "Movies" ? (
        <>
          {selectedMovie ? (
            <section style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 15, overflow: "hidden", background: "#000", boxShadow: "0 12px 40px rgba(0,0,0,.18)" }}>
              <div style={{ aspectRatio: "16 / 9", width: "100%" }}>
                <iframe title={selectedMovie.title} src={selectedMovie.embed} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", display: "block", border: 0 }} />
              </div>
            </section>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 14 }}>
              {MOVIES.map((movie) => <button key={movie.embed} type="button" onClick={() => chooseMovie(movie)} style={cardStyle}><div style={{ height: 125, background: "linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.025))", display: "grid", placeItems: "center", padding: 12, textAlign: "center", fontWeight: 900 }}>{movie.title}</div><div style={{ padding: 12, fontWeight: 800 }}>{movie.title}</div></button>)}
            </div>
          )}
          {selectedMovie && <button type="button" onClick={() => setSelectedMovie(null)} style={{ marginTop: 14, padding: "9px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.05)", color: "#fff", cursor: "pointer" }}>← Back to Movies</button>}
        </>
      ) : null}
    </div>
  );
}
