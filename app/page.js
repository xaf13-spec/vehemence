import { getCurrentUser } from "../lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">WELCOME TO VEHEMENCE</p>

          <h1>VEHEMENCE</h1>

          <p className="hero-description">
            Your new home for games, competition, and community.
          </p>

          <div className="hero-buttons">
            <a
              className="primary-button"
              href={user ? "/games" : "/rules"}
            >
              {user ? "Enter Vehemence" : "Sign Up / Log In"}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
