export default function Login() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">VEHEMENCE</p>

        <h1>Welcome Back</h1>

        <p className="auth-description">
          Log in to your Vehemence account.
        </p>

        <form className="auth-form">
          <label>
            Username
            <input type="text" placeholder="Enter your username" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Enter your password" />
          </label>

          <button type="submit" className="primary-button">
            Log In
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <a href="/signup">Create one</a>
        </p>
      </div>
    </main>
  );
}
