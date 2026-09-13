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
  "Jujutsu Kaisen - Season 2": [
    [25, "https://www.dropbox.com/scl/fi/3z2ry6m15ay0r22b6ufzk/25.mp4?rlkey=lb6nxq5oevqghosb0kd6630ez&st=5gfohur7&raw=1"],
    [26, "https://www.dropbox.com/scl/fi/jqurhgt70o7fn2tl1fpel/26.mp4?rlkey=fg60eqbk8uopp62gonwyolrn9&st=5ql9fjzb&raw=1"],
    [27, "https://www.dropbox.com/scl/fi/tilw0lmc6ulmxqveprh3w/27.mp4?rlkey=f7kcp3pp3udx5mlqt592w2dp2&st=wyipcm1s&raw=1"],
    [28, "https://www.dropbox.com/scl/fi/xnqso6jq43ywly80u7ph7/28.mp4?rlkey=snzj2cgid3yoyrkv500yvt2qw&st=98939pb4&raw=1"],
    [29, "https://www.dropbox.com/scl/fi/quknjk72lxvesee2irghx/29.mp4?rlkey=q21jp0poy08i9q4mf4bot0j6f&st=l8amqwwi&raw=1"],
    [30, "https://www.dropbox.com/scl/fi/4ek5uw1xl0k1wtwn59j4s/30.mp4?rlkey=q2oax0zs7it5ntlq5g9we1qh0&st=oelrtuxs&raw=1"],
    [31, "https://www.dropbox.com/scl/fi/g6vhfp2w69mi5b2iw5tai/31.mp4?rlkey=gsrnoq37szedh95ispda4w22h&st=muvojww7&raw=1"],
    [32, "https://www.dropbox.com/scl/fi/0quvi9fox0bew1230hnhi/32.mp4?rlkey=8a7kw97mkei9aqggm77zysoia&st=k3oc373r&raw=1"],
    [33, "https://www.dropbox.com/scl/fi/e48w12nozt5i7pq6uu697/33.mp4?rlkey=5s4qg3j1stw3fwffgwyysi01l&st=m6hf4ntq&raw=1"],
    [34, "https://www.dropbox.com/scl/fi/82aaicb29xum2ghmb3h3k/34.mp4?rlkey=0s73vscqu5wlgyzalfsiiyfgm&st=ggbvxljn&raw=1"],
    [35, "https://www.dropbox.com/scl/fi/0mqqidf0znbyqy5mgb8hh/35.mp4?rlkey=kiyufdk1761516gildprvxtu1&st=tnsymt2n&raw=1"],
    [36, "https://www.dropbox.com/scl/fi/28w1ozwq6kp3av5vfg4am/36.mp4?rlkey=eqe4e1yohybk43ht5i9e9wbcw&st=xeptilnx&raw=1"],
    [37, "https://www.dropbox.com/scl/fi/j3clhzjak5arq9bd9p7bp/37.mp4?rlkey=blxl5aai8jl2uxws9dbdnmdk3&st=wzva03dr&raw=1"],
    [38, "https://www.dropbox.com/scl/fi/bkemhzqdgc40ip0vk2r7y/38.mp4?rlkey=k08rezuwoddqmhxf9q0mo30l0&st=houriot4&raw=1"],
    [39, "https://www.dropbox.com/scl/fi/928hxgloum22ryn0ujpdo/39.mp4?rlkey=edk397v0for7o8ap0l8sbp4x8&st=g13e45fx&raw=1"],
    [40, "https://www.dropbox.com/scl/fi/8t3zpvmjc0v8umwlwtxfn/40.mp4?rlkey=awqy6i0rupcv8r84sujtjryou&st=v3nss5km&raw=1"],
    [41, "https://www.dropbox.com/scl/fi/p5vye03s70huiinlrm7bl/41.mp4?rlkey=ntzo04grs1txx3ksbkx5a3m2v&st=t5f34z2w&raw=1"],
  ],
};

const MOVIES = [
  { title: "Kingdom of the Planet of the Apes", url: "https://anonmp4.art/embed/JpOSYXFhQobeCL6", type: "embed" },
  { title: "Despicable Me 3", url: "https://anonmp4.art/embed/zLFFdhPwEhDPs6T", type: "embed" },
  { title: "Despicable Me 2", url: "https://anonmp4.art/embed/hhzNXtvx3jK85ss", type: "embed" },
  { title: "Despicable Me", url: "https://anonmp4.art/embed/BO2bwOOHrdOtVpf", type: "embed" },
  { title: "SpongeBob Movie: Sponge on the Run", url: "https://dl.dropboxusercontent.com/scl/fi/nbadlujqjccn6h4bvxnbb/SpongeBob-Movie-Sponge-on-the-Run-full-movie.mp4?rlkey=13h63756fwhy1ytbwreg0m68a&st=5thzmpsj&raw=1", type: "video" },
  { title: "Despicable Me 4", url: "https://dl.dropboxusercontent.com/scl/fi/4gjqovym5depxl6kvkgux/Despicable-Me-4-2024-Awafim.tv.mp4?rlkey=1b41xmd5dhk0z1weo0ohra3wm&st=eue6y2a0&raw=1", type: "video" },
];

function makeEpisodes(items) {
  return items.map(([number, url]) => ({ number, title: `Episode ${number}`, url }));
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

const controlStyle = { border: 0, background: "transparent", color: "#fff", width: 30, height: 30, padding: 0, display: "grid", placeItems: "center", cursor: "pointer", fontSize: 15 };
const cardStyle = { border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, overflow: "hidden", background: "rgba(17,17,24,.82)", color: "#fff", cursor: "pointer", textAlign: "left", padding: 0, transition: "transform .18s ease, border-color .18s ease, background .18s ease" };

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
    setError("");
    setControlsVisible(true);
  }

  function chooseShow(nextShow) {
    const nextEpisodes = SHOWS[nextShow] || [];
    setCategory("Anime");
    setSelectedMovie(null);
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

  function chooseEpisode(number) {
    if (!episodes.some((item) => item.number === number)) return;
    setSelectedEpisode(number);
    setSelectedMovie(null);
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
    setSelectedMovie(movie);
    setError("");
    setIsPlaying(false);
    setControlsVisible(true);
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setError("This video could not be played."));
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
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, flex: 1, minWidth: 220, fontSize: 24 }}>{category === "Anime" ? show : selectedMovie?.title || "Movies"}</h2>
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
              <video ref={videoRef} className="entertainment-video" src={currentEpisode.url} controls={false} preload="metadata" onClick={togglePlay} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onPlay={() => { setIsPlaying(true); showControls(); }} onPause={() => { setIsPlaying(false); setControlsVisible(true); }} onEnded={handleEnded} onError={() => setError("This episode could not be loaded. Check the shared link.")} style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }} />
              <div onClick={(event) => event.stopPropagation()} style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "38px 12px 10px", opacity: controlsVisible ? 1 : 0, pointerEvents: controlsVisible ? "auto" : "none", transition: "opacity .2s ease", background: "linear-gradient(transparent, rgba(0,0,0,.88))" }}>
                <input aria-label="Seek" type="range" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={seek} style={{ width: "100%", height: 3, accentColor: "#ff0000", marginBottom: 8, display: "block", cursor: "pointer" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#fff" }}>
                  <button type="button" onClick={() => goToEpisode(selectedEpisode - 1)} disabled={selectedEpisode === firstEpisode} aria-label="Previous episode" style={{ ...controlStyle, opacity: selectedEpisode === firstEpisode ? .35 : 1 }}>⏮</button>
                  <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} style={{ ...controlStyle, width: 34, height: 34 }}>{isPlaying ? "❚❚" : "▶"}</button>
                  <button type="button" onClick={() => goToEpisode(selectedEpisode + 1)} disabled={selectedEpisode === lastEpisode} aria-label="Next episode" style={{ ...controlStyle, opacity: selectedEpisode === lastEpisode ? .35 : 1 }}>⏭</button>
                  <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} style={controlStyle}>{muted || volume === 0 ? "🔇" : "🔊"}</button>
                  <input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={changeVolume} style={{ width: 70, accentColor: "#fff", cursor: "pointer" }} />
                  <span style={{ fontSize: 12, minWidth: 82 }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  <div style={{ flex: 1 }} />
                  <button type="button" onClick={toggleExpand} aria-label={expanded ? "Shrink player" : "Expand player"} style={controlStyle}>{expanded ? "↙" : "↗"}</button>
                  <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen" style={controlStyle}>{fullscreen ? "⤢" : "⛶"}</button>
                </div>
              </div>
              {error && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: 20, background: "rgba(0,0,0,.62)", color: "#fff", textAlign: "center", fontSize: 14 }}>{error}</div>}
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))", gap: 10, marginTop: 18 }}>
            {animeNames.map((name) => (
              <button key={name} type="button" onClick={() => chooseShow(name)} style={{ ...cardStyle, padding: 16, borderColor: show === name ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.08)" }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{name}</div>
                <div style={{ marginTop: 5, fontSize: 12, opacity: .55 }}>{SHOWS[name].length} episodes available</div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>Episodes</h3>
              <span style={{ fontSize: 12, opacity: .55 }}>Episode {selectedEpisode}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 8 }}>
              {episodes.map((episode) => (
                <button key={episode.number} type="button" onClick={() => chooseEpisode(episode.number)} style={{ ...cardStyle, padding: "12px 13px", borderColor: selectedEpisode === episode.number ? "rgba(255,255,255,.28)" : "rgba(255,255,255,.08)", background: selectedEpisode === episode.number ? "rgba(255,255,255,.12)" : "rgba(17,17,24,.82)" }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>Episode {episode.number}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : category === "Movies" && selectedMovie ? (
        <>
          <button type="button" onClick={() => setSelectedMovie(null)} style={{ marginBottom: 12, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.05)", color: "#fff", borderRadius: 9, padding: "9px 13px", cursor: "pointer", fontWeight: 700 }}>← Back to Movies</button>
          <section style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 15, overflow: "hidden", background: "#000", boxShadow: "0 12px 40px rgba(0,0,0,.18)" }}>
            <div ref={playerRef} style={{ position: "relative", aspectRatio: "16 / 9", background: "#000" }}>
              {selectedMovie.type === "embed" ? (
                <iframe title={selectedMovie.title} src={selectedMovie.url} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
              ) : (
                <video key={selectedMovie.url} className="entertainment-video" src={selectedMovie.url} controls preload="metadata" playsInline onError={() => setError("This movie could not be loaded. The video host is refusing the browser request.")} style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }} />
              )}
              {error && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: 20, background: "rgba(0,0,0,.62)", color: "#fff", textAlign: "center", fontSize: 14 }}>{error}</div>}
            </div>
          </section>
        </>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 }}>
          {MOVIES.map((movie) => (
            <button key={movie.title} type="button" onClick={() => chooseMovie(movie)} style={{ ...cardStyle, padding: 18, minHeight: 125 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{movie.title}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
