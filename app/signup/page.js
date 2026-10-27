"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signup } from "./actions";

export default function Signup() {
  const searchParams = useSearchParams();
  const rulesAccepted = searchParams.get("rules") === "accepted";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rulesAccepted) window.location.replace("/rules");
  }, [rulesAccepted]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      window.location.href = "/";
    } catch (err) {
      console.error("Signup request failed:", err);
      setError("The signup request failed before the server returned a response. Check the Vercel deployment logs.");
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">VEHEMENCE</p>
        <h1>Create Account</h1>
        
        {!rulesAccepted ? <p className="auth-footer">redirecting to the rules...</p> : <form className="auth-form" onSubmit={handleSubmit}>
          <input type="hidden" name="rulesAccepted" value="accepted" />
          <label>Username<input name="username" type="text" placeholder="Choose a username" required /></label>
          <label>Password<input name="password" type="password" placeholder="Create a password" required /></label>
          <label>Confirm Password<input name="confirmPassword" type="password" placeholder="Confirm your password" required /></label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="primary-button" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
        </form>}
        <p className="auth-footer">Already have an account? <Link href="/login">Log in</Link></p>
      </div>
    </main>
  );
}
