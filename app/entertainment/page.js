import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";

const entertainment = [
  {
    name: "StreameX",
    description: "Watch movies and shows inside Vehemence.",
    url: "https://streamex.hn/",
  },
  {
    name: "Vidbox",
    description: "Browse movies and shows without leaving Vehemence.",
    url: "https://vidbox.cc",
  },
];

export default async function EntertainmentPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/rules");

  return (
    <main className="games-page">
      <header className="games-header">
        <div>
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Entertainment</h1>
          <p>Movies, shows, and other stuff outside the game library.</p>
        </div>
      </header>

      <section className="game-section">
        <div className="section-title-row">
          <div>
            <h2>Entertainment</h2>
            <p className="section-subtitle">Watch without leaving Vehemence.</p>
          </div>
        </div>

        <div className="game-grid">
          {entertainment.map((item) => (
            <article className="game-card" key={item.name}>
              <div className="game-thumbnail">
                <span>{item.name}</span>
              </div>
              <div className="game-card-body">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          {entertainment.map((item) => (
            <section key={`${item.name}-player`} style={{ marginBottom: 28 }}>
              <div className="section-title-row">
                <div>
                  <h2>{item.name}</h2>
                  <p className="section-subtitle">Embedded directly into Vehemence.</p>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  minHeight: 700,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,.08)",
                  background: "#08080c",
                }}
              >
                <iframe
                  src={item.url}
                  title={item.name}
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  allowFullScreen
                  style={{ width: "100%", height: 700, border: 0, display: "block" }}
                />
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
