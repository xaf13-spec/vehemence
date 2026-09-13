"use client";

import { useState } from "react";
import { login } from "./actions";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    window.location.href = "/";
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">VEHEMENCE</p>
        <h1>Welcome Back</h1>
        <p className="auth-description">Log in to your Vehemence account.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Username<input name="username" type="text" placeholder="Enter your username" required /></label>
          <label>Password<input name="password" type="password" placeholder="Enter your password" required /></label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="primary-button" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
        </form>
        <p className="auth-footer">Don't have an account? <a href="/signup">Create one</a></p>
      </div>
    </main>
  );
}
