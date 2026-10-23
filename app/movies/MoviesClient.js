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
  { id: "movie-16", title: "Holes", src: "https://fembed.co/embed/kaV-4mhXw_ILS" }
];

const shows = [
  {
    id: "simpsons",
    title: "The Simpsons",
    seasons: [{
      number: 1,
      episodes: [
        { number: 1, title: "Simpsons Roasting on an Open Fire", src: "https://fembed.co/embed/2_gmUY-MueDFy" },
        { number: 2, title: "Bart the Genius", src: "https://fembed.co/embed/PNgB-TEfk_odN" },
        { number: 4, title: "There's No Disgrace Like Home", src: "https://fembed.co/embed/Mle0_JP4n-Wyx" },
        { number: 6, title: "Moaning Lisa", src: "https://fembed.co/embed/yoH-b_PZvcsPv" },
        { number: 7, title: "The Call of the Simpsons", src: "https://fembed.co/embed/w_nKIS8yfn-AW" },
        { number: 8, title: "The Telltale Head", src: "https://fembed.co/embed/bdwcW2-Z_bs8Q" },
        { number: 9, title: "Life on the Fast Lane", src: "https://fembed.co/embed/w_EJ-afK69BLz" },
        { number: 10, title: "Homer's Night Out", src: "https://fembed.co/embed/n-0gHVNh_3ZRc" }
      ]
    }]
  },
  {
    id: "south-park",
    title: "South Park",
    seasons: [{
      number: 1,
      episodes: [
        { number: 1, title: "Cartman Gets an Anal Probe", src: "https://fembed.co/embed/ok6-t8vyP_YI7" },
        { number: 3, title: "Weight Gain 4000", src: "https://fembed.co/embed/VQJQm_D-HbTTs" },
        { number: 4, title: "Big Gay Al's Big Gay Boat Ride", src: "https://fembed.co/embed/R6_uGrqZKm-0x" },
        { number: 5, title: "An Elephant Makes Love to a Pig", src: "https://fembed.co/embed/b-Sdzo_1E5W5H" },
        { number: 6, title: "Death", src: "https://fembed.co/embed/3ToPvuN-h_Qp9" },
        { number: 7, title: "Pinkeye", src: "https://fembed.co/embed/4PH_jm-avuCcY" },
        { number: 8, title: "Starvin' Marvin", src: "https://fembed.co/embed/QDm55uT-kl_KX" },
        { number: 9, title: "Mr. Hankey, the Christmas Poo", src: "https://fembed.co/embed/0XdYjtr4-S_Yx" },
        { number: 10, title: "Damien", src: "https://fembed.co/embed/E-Xu0RL_o6GiQ" }
      ]
    }]
  },
  {
    id: "family-guy",
    title: "Family Guy",
    seasons: [{
      number: 1,
      episodes: [
        { number: 5, title: "A Hero Sits Next Door", src: "https://fembed.co/embed/Wy-tAF_9kZonl" },
        { number: 6, title: "The Son Also Draws", src: "https://fembed.co/embed/pCH-c_kN4FLMZ" },
        { number: 7, title: "Brian: Portrait of a Dog", src: "https://fembed.co/embed/Fogrj-n7_6xqI" }
      ]
    }]
  },
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    seasons: [{
      number: 1,
      episodes: [
        { number: 4, title: "Cancer Man", src: "https://fembed.co/embed/S-OglOqj_3FQd" },
        { number: 5, title: "Gray Matter", src: "https://fembed.co/embed/N5q34bz-A_TqC" }
      ]
    }]
  }
];

const cardStyle = {
  textAlign: "left",
  padding: 18,
  minHeight: 112,
  borderRadius: 14,
  border: "1px solid var(--border-color, rgba(255,255,255,.12))",
  background: "var(--card-bg, rgba(255,255,255,.035))",
  color: "inherit",
  cursor: "pointer"
};

export default function MoviesClient() {
  const [section, setSection] = useState("movies");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [seasonNumber, setSeasonNumber] = useState(1);

  const activeItem = section === "movies" ? selectedMovie : selectedEpisode;
  const activeTitle = section === "movies"
    ? selectedMovie?.title
    : selectedEpisode
      ? `${selectedShow?.title} · S${String(seasonNumber).padStart(2, "0")} E${String(selectedEpisode.number).padStart(2, "0")} — ${selectedEpisode.title}`
      : null;

  function openShow(show) {
    setSelectedShow(show);
    setSelectedEpisode(null);
    setSeasonNumber(show.seasons[0]?.number ?? 1);
  }

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "34px 24px 60px", color: "var(--text-primary, #f4f2ff)" }}>
      <p style={{ color: "#a99aff", fontSize: 11, fontWeight: 800, letterSpacing: ".18em" }}>VEHEMENCE · WATCH</p>
      <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)", margin: "8px 0" }}>Movies / TV Shows</h1>
      <p style={{ color: "var(--text-secondary, #a6a3b5)", marginBottom: 24 }}>Movies on one side, full shows and their episodes on the other.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { id: "movies", label: "Movies" },
          { id: "shows", label: "TV Shows" }
        ].map((item) => (
          <button key={item.id} type="button" onClick={() => setSection(item.id)} style={{
            padding: "10px 18px",
            borderRadius: 999,
            border: section === item.id ? "1px solid #a99aff" : "1px solid var(--border-color, rgba(255,255,255,.12))",
            background: section === item.id ? "rgba(169,154,255,.15)" : "transparent",
            color: "inherit",
            cursor: "pointer",
            fontWeight: 700
          }}>{item.label}</button>
        ))}
      </div>

      {activeItem && (
        <section style={{ border: "1px solid var(--border-color, rgba(255,255,255,.12))", borderRadius: 16, overflow: "hidden", background: "#08080d", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 18px", flexWrap: "wrap" }}>
            <strong>{activeTitle}</strong>
            <button type="button" onClick={() => section === "movies" ? setSelectedMovie(null) : setSelectedEpisode(null)} style={{ cursor: "pointer" }}>Close player ✕</button>
          </div>
          <div style={{ position: "relative", aspectRatio: "16 / 9", background: "#050507" }}>
            <iframe key={activeItem.id ?? `${selectedShow?.id}-s${seasonNumber}-e${selectedEpisode?.number}`} src={activeItem.src} title={activeTitle} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
          </div>
        </section>
      )}

      {section === "movies" && (
        <section>
          <h2 style={{ fontSize: 22, margin: "0 0 14px" }}>Movies</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
            {movies.map((movie, index) => (
              <button key={movie.id} type="button" onClick={() => setSelectedMovie(movie)} style={{ ...cardStyle, border: selectedMovie?.id === movie.id ? "1px solid #a99aff" : cardStyle.border }}>
                <span style={{ display: "block", color: "#bcb0ff", marginBottom: 14 }}>▶ · {String(index + 1).padStart(2, "0")}</span>
                <strong>{movie.title}</strong>
                <span style={{ display: "block", marginTop: 8, color: "var(--text-secondary, #a6a3b5)", fontSize: 12 }}>Play movie</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {section === "shows" && (
        <section>
          {!selectedShow ? (
            <>
              <h2 style={{ fontSize: 22, margin: "0 0 14px" }}>TV Shows</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
                {shows.map((show) => (
                  <button key={show.id} type="button" onClick={() => openShow(show)} style={cardStyle}>
                    <span style={{ display: "block", color: "#bcb0ff", marginBottom: 14 }}>TV SERIES</span>
                    <strong style={{ fontSize: 18 }}>{show.title}</strong>
                    <span style={{ display: "block", marginTop: 8, color: "var(--text-secondary, #a6a3b5)", fontSize: 12 }}>{show.seasons.reduce((total, season) => total + season.episodes.length, 0)} available episodes</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                <div>
                  <button type="button" onClick={() => { setSelectedShow(null); setSelectedEpisode(null); }} style={{ background: "transparent", border: 0, color: "#bcb0ff", cursor: "pointer", padding: "0 0 8px" }}>← All TV Shows</button>
                  <h2 style={{ fontSize: 26, margin: 0 }}>{selectedShow.title}</h2>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary, #a6a3b5)" }}>
                  Season
                  <select value={seasonNumber} onChange={(event) => { setSeasonNumber(Number(event.target.value)); setSelectedEpisode(null); }} style={{ padding: "9px 12px", borderRadius: 9, color: "inherit", background: "#17151f", border: "1px solid var(--border-color, rgba(255,255,255,.12))" }}>
                    {selectedShow.seasons.map((season) => <option key={season.number} value={season.number}>Season {season.number}</option>)}
                  </select>
                </label>
              </div>
              <h3 style={{ fontSize: 17, margin: "0 0 12px" }}>Season {seasonNumber} · Episodes</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
                {(selectedShow.seasons.find((season) => season.number === seasonNumber)?.episodes ?? []).map((episode) => (
                  <button key={episode.number} type="button" onClick={() => setSelectedEpisode({ ...episode, id: `${selectedShow.id}-s${seasonNumber}-e${episode.number}` })} style={{
                    ...cardStyle,
                    minHeight: 88,
                    border: selectedEpisode?.number === episode.number ? "1px solid #a99aff" : cardStyle.border
                  }}>
                    <span style={{ display: "block", color: "#bcb0ff", fontSize: 12, marginBottom: 8 }}>S{String(seasonNumber).padStart(2, "0")} · E{String(episode.number).padStart(2, "0")}</span>
                    <strong>{episode.title}</strong>
                    <span style={{ display: "block", marginTop: 7, color: "var(--text-secondary, #a6a3b5)", fontSize: 12 }}>{selectedEpisode?.number === episode.number ? "Selected" : "Play episode"}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
