export default function Home() {
  return (
    <main className="home">
      <nav className="navbar">
        <div className="logo">VEHEMENCE</div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/rules">Rules</a>
          <a href="/games">Games</a>
          <a href="/chat">Online Chat</a>
          <a href="/clans">Clans</a>
          <a href="/profile">Profile</a>
        </div>

        <a className="login-button" href="/login">
          Log In
        </a>
      </nav>

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
