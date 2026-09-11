export default function Signup() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">VEHEMENCE</p>

        <h1>Create Account</h1>

        <p className="auth-description">
          Create your Vehemence account and join the community.
        </p>

        <form className="auth-form">
          <label>
            Username
            <input type="text" placeholder="Choose a username" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Create a password" />
          </label>

          <label>
            Confirm Password
            <input type="password" placeholder="Confirm your password" />
          </label>

          <button type="submit" className="primary-button">
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </main>
  );
}
