"use client";

import { useState } from "react";

const movies = [
  { id: "movie-1", title: "Movie 1", src: "https://fembed.co/embed/G1iHDR_zy3-ts" },
  { id: "movie-2", title: "Movie 2", src: "https://fembed.co/embed/W3cisxy_Pk-s3" },
  { id: "movie-3", title: "Movie 3", src: "https://fembed.co/embed/V1-GZM_PZf2em" },
  { id: "movie-4", title: "Movie 4", src: "https://fembed.co/embed/tAH-19Ez_9NkK" },
  { id: "movie-5", title: "Movie 5", src: "https://fembed.co/embed/Cz_bWDK8-6Av2" },
  { id: "movie-6", title: "Movie 6", src: "https://fembed.co/embed/nQH2i-V_7Uhfn" }
];

export default function MoviesClient() {
  const [selected, setSelected] = useState(movies[0]);

  return (
    <main className="movies-page">
      <style jsx>{`
        .movies-page { width: min(1180px, 100%); margin: 0 auto; padding: 34px 24px 60px; color: var(--text-primary, #f4f2ff); }
        .eyebrow { color: #a99aff; font-size: 11px; letter-spacing: .18em; font-weight: 800; text-transform: uppercase; }
        .heading { display:flex; align-items:end; justify-content:space-between; gap:18px; margin: 8px 0 24px; }
        h1 { font-size: clamp(30px, 5vw, 48px); letter-spacing:-.045em; margin:0; }
        .sub { color:var(--text-secondary, #a6a3b5); margin:8px 0 0; }
        .player-shell { overflow:hidden; border:1px solid var(--border-color, rgba(255,255,255,.12)); border-radius:18px; background:#08080d; box-shadow:0 18px 60px rgba(0,0,0,.24); }
        .player-top { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:15px 18px; border-bottom:1px solid rgba(255,255,255,.09); }
        .player-top h2 { margin:0; font-size:16px; }
        .player-label { color:#9c98aa; font-size:11px; letter-spacing:.12em; text-transform:uppercase; }
        .frame-wrap { position:relative; width:100%; aspect-ratio:16/9; background:#050507; }
        iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
        .library-head { display:flex; justify-content:space-between; align-items:center; margin:30px 0 14px; gap:12px; }
        .library-head h2 { margin:0; font-size:20px; }
        .count { color:#a6a3b5; font-size:13px; }
        .grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
        .movie-card { display:flex; flex-direction:column; align-items:stretch; gap:10px; min-height:116px; padding:16px; text-align:left; color:inherit; background:var(--card-bg, rgba(255,255,255,.035)); border:1px solid var(--border-color, rgba(255,255,255,.1)); border-radius:14px; cursor:pointer; transition:border-color .15s, transform .15s, background .15s; }
        .movie-card:hover { transform:translateY(-2px); border-color:rgba(169,154,255,.55); }
        .movie-card.active { border-color:#a99aff; background:rgba(169,154,255,.1); }
        .movie-icon { display:grid; place-items:center; width:35px; height:35px; border-radius:10px; color:#c4b9ff; background:rgba(169,154,255,.13); font-size:17px; }
        .movie-name { font-weight:750; }
        .movie-action { color:#a6a3b5; font-size:12px; }
        @media(max-width:760px) { .movies-page { padding:24px 14px 42px; } .grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .heading { align-items:start; flex-direction:column; } }
        @media(max-width:460px) { .grid { grid-template-columns:1fr; } }
      `}</style>
      <div className="eyebrow">VEHEMENCE · WATCH</div>
      <div className="heading">
        <div><h1>Movies</h1><p className="sub">Pick a movie and watch it right here.</p></div>
      </div>
      <section className="player-shell" aria-label={`Player for ${selected.title}`}>
        <div className="player-top"><h2>{selected.title}</h2><span className="player-label">Now playing</span></div>
        <div className="frame-wrap">
          <iframe key={selected.id} src={selected.src} title={selected.title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        </div>
      </section>
      <div className="library-head"><h2>Movie library</h2><span className="count">{movies.length} videos</span></div>
      <section className="grid" aria-label="Choose a movie">
        {movies.map((movie, index) => <button type="button" key={movie.id} className={`movie-card ${selected.id === movie.id ? "active" : ""}`} onClick={() => setSelected(movie)} aria-pressed={selected.id === movie.id}>
          <span className="movie-icon">▶</span><span className="movie-name">{movie.title}</span><span className="movie-action">{selected.id === movie.id ? "Currently selected" : "Play in player"} · {String(index + 1).padStart(2, "0")}</span>
        </button>)}
      </section>
    </main>
  );
}
