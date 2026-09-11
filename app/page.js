export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">WELCOME TO VEHEMENCE</p>

          <h1>
            PLAY.
            <br />
            CONNECT.
            <br />
            <span>COMPETE.</span>
          </h1>

          <p className="hero-description">
            Your new home for games, competition, and community.
          </p>

          <div className="hero-buttons">
            <a className="primary-button" href="/rules">
              Join Vehemence
            </a>

            <a className="secondary-button" href="/games">
              Browse Games
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
