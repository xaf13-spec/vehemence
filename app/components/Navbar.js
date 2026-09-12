export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="logo">
        VEHEMENCE
      </a>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/rules">Rules</a>
        <a href="/games">Games</a>
        <a href="/clans">Clans</a>
        <a href="/profile">Profile</a>
        <a href="/report">Report</a>
        <a href="/settings">Settings</a>
      </div>
    </nav>
  );
}
