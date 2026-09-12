import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";

const entertainment = [
  {
    name: "Spotube",
    description: "An open-source music streaming app from the Spotube project.",
    icon: "♫",
    url: "https://github.com/KRTirtho/spotube"
  }
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
          <p>Music, media, and other stuff outside the game library.</p>
        </div>
      </header>

      <section className="game-section">
        <div className="section-title-row">
          <div>
            <h2>Entertainment</h2>
            <p className="section-subtitle">Stuff to check out when you aren't playing.</p>
          </div>
        </div>

        <div className="game-grid">
          {entertainment.map((item) => (
            <a className="game-card" href={item.url} target="_blank" rel="noreferrer" key={item.name}>
              <div className="game-thumbnail">
                <span style={{ fontSize: 54, letterSpacing: 0 }}>{item.icon}</span>
              </div>
              <div className="game-info">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="game-category">Entertainment</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
