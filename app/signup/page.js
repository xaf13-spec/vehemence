"use client";

import { useState } from "react";
import { signup } from "./actions";

export default function Signup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    window.location.href = "/games";
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">VEHEMENCE</p>

        <h1>Create Account</h1>

        <p className="auth-description">
          Create your Vehemence account and join the community.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              name="username"
              type="text"
              placeholder="Choose a username"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              required
            />
          </label>

          <label>
            Confirm Password
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </main>
  );
}
