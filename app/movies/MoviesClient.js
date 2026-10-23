"use client";

import { useState } from "react";

const movies = [
  { id: "movie-1", title: "The Odyssey", src: "https://fembed.co/embed/G1iHDR_zy3-ts" },
  { id: "movie-2", title: "Mortal Kombat II", src: "https://fembed.co/embed/W3cisxy_Pk-s3" },
  { id: "movie-3", title: "Michael", src: "https://fembed.co/embed/V1-GZM_PZf2em" },
  { id: "movie-4", title: "Obsession", src: "https://fembed.co/embed/tAH-19Ez_9NkK" },
  { id: "movie-5", title: "Backrooms", src: "https://fembed.co/embed/Cz_bWDK8-6Av2" },
  { id: "movie-6", title: "Minecraft", src: "https://fembed.co/embed/nQH2i-V_7Uhfn" },
  { id: "movie-7", title: "The Dark Knight", src: "https://fembed.co/embed/IbUzL-YQ_rSHQ" },
  { id: "movie-8", title: "Spider-Man: Brand New Day", src: "https://fembed.co/embed/Le-Tzbs_rZ2mb" },
  { id: "movie-9", title: "The Super Mario Bros. Movie", src: "https://fembed.co/embed/u2U_PQKz-0X8E" },
  { id: "movie-10", title: "Avengers: Endgame", src: "https://fembed.co/embed/hzrH_M4-1GuJb" },
  { id: "movie-11", title: "Max", src: "https://fembed.co/embed/4xnm6-rrwU_Ks" },
  { id: "movie-12", title: "Paul Blart: Mall Cop 2", src: "https://fembed.co/embed/22Oc_RM3-EYX3" },
  { id: "movie-13", title: "Street Fighter", src: "https://fembed.co/embed/db54_Qqe3-epd" },
  { id: "movie-14", title: "Super Mario Galaxy", src: "https://fembed.co/embed/xxa3p-HY1d_e7" },
  { id: "movie-15", title: "Top Gun: Maverick", src: "https://fembed.co/embed/qNe_gpny-m7PM" },
  { id: "movie-16", title: "Holes", src: "https://fembed.co/embed/kaV-4mhXw_ILS" },
  { id: "simpsons-s1-e4", title: "The Simpsons — S1 E4: There's No Disgrace Like Home", src: "https://fembed.co/embed/Mle0_JP4n-Wyx" },
  { id: "south-park-s1-e6", title: "South Park — S1 E6: Death", src: "https://fembed.co/embed/3ToPvuN-h_Qp9" }
];

export default function MoviesClient() {
  const [selected, setSelected] = useState(null);

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "34px 24px 60px", color: "var(--text-primary, #f4f2ff)" }}>
      <p style={{ color: "#a99aff", fontSize: 11, fontWeight: 800, letterSpacing: ".18em" }}>VEHEMENCE · WATCH</p>
      <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)", margin: "8px 0" }}>Movies / TV Shows</h1>
      <p style={{ color: "var(--text-secondary, #a6a3b5)", marginBottom: 24 }}>Choose a movie or TV episode to play it here.</p>
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
