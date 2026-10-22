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
  const [selected, setSelected] = useState(null);

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "34px 24px 60px", color: "var(--text-primary, #f4f2ff)" }}>
      <p style={{ color: "#a99aff", fontSize: 11, fontWeight: 800, letterSpacing: ".18em" }}>VEHEMENCE · WATCH</p>
      <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)", margin: "8px 0" }}>Movies</h1>
      <p style={{ color: "var(--text-secondary, #a6a3b5)", marginBottom: 24 }}>Choose a movie to play it here.</p>
      {selected && <section style={{ border: "1px solid var(--border-color, rgba(255,255,255,.12))", borderRadius: 16, overflow: "hidden", background: "#08080d", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 18px" }}>
          <strong>{selected.title}</strong>
          <button type="button" onClick={() => setSelected(null)} style={{ cursor: "pointer" }}>Close player ✕</button>
        </div>
        <div style={{ position: "relative", aspectRatio: "16 / 9", background: "#050507" }}>
          <iframe key={selected.id} src={selected.src} title={selected.title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
        </div>
      </section>}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
        {movies.map((movie, index) => <button key={movie.id} type="button" onClick={() => setSelected(movie)} style={{ textAlign: "left", padding: 18, minHeight: 116, borderRadius: 14, border: selected?.id === movie.id ? "1px solid #a99aff" : "1px solid var(--border-color, rgba(255,255,255,.12))", background: selected?.id === movie.id ? "rgba(169,154,255,.1)" : "var(--card-bg, rgba(255,255,255,.035))", color: "inherit", cursor: "pointer" }}>
          <span style={{ display: "block", color: "#bcb0ff", marginBottom: 14 }}>▶ · {String(index + 1).padStart(2, "0")}</span>
          <strong>{movie.title}</strong>
          <span style={{ display: "block", marginTop: 8, color: "var(--text-secondary, #a6a3b5)", fontSize: 12 }}>{selected?.id === movie.id ? "Selected" : "Play in Vehemence"}</span>
        </button>)}
      </section>
    </main>
  );
}
