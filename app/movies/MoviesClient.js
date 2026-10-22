"use client";

export default function MoviesClient() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px", color: "var(--text-primary, #f4f2ff)" }}>
      <p style={{ color: "#a99aff", fontSize: 11, fontWeight: 800, letterSpacing: ".18em" }}>VEHEMENCE · WATCH</p>
      <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)", margin: "8px 0 12px" }}>Movies</h1>
      <p style={{ color: "var(--text-secondary, #a6a3b5)", lineHeight: 1.6 }}>The movie players are temporarily disabled because the previous embed links did not reliably open the intended movies. No external player will load from this page until the links can be verified.</p>
      <div style={{ marginTop: 24, padding: 20, border: "1px solid var(--border-color, rgba(255,255,255,.12))", borderRadius: 14, background: "var(--card-bg, rgba(255,255,255,.035))" }}>
        <strong>Movie library temporarily unavailable</strong>
        <p style={{ marginBottom: 0, color: "var(--text-secondary, #a6a3b5)" }}>The six unverified embeds have been removed for safety.</p>
      </div>
    </main>
  );
}
