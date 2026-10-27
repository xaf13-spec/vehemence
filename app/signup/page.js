"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signup } from "./actions";
import { signupEmail } from "./email-actions";

export default function Signup() {
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [method, setMethod] = useState("username");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const accepted = new URLSearchParams(window.location.search).get("rules") === "accepted";
    if (accepted) setRulesAccepted(true);
    else window.location.replace("/rules");
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const result = method === "email" ? await signupEmail(formData) : await signup(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      if (method === "email") {
        setEmailSent(true);
        setLoading(false);
        return;
      }
      window.location.href = "/";
    } catch (err) {
      console.error("Signup request failed:", err);
      setError("the signup request failed. please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">VEHEMENCE</p>
        <h1>create account</h1>
        {!rulesAccepted ? <p className="auth-footer">redirecting to the rules...</p> : emailSent ? <>
          <p className="auth-footer">if email sending is configured, a verification link is on its way. check your inbox and spam folder.</p>
          <p className="auth-footer"><Link href="/login">back to login</Link></p>
        </> : <>
          <div className="auth-form">
            <div className="auth-methods">
              <button type="button" className={method === "username" ? "primary-button" : "secondary-button"} onClick={() => { setMethod("username"); setError(""); }}>username + password</button>
              <button type="button" className={method === "email" ? "primary-button" : "secondary-button"} onClick={() => { setMethod("email"); setError(""); }}>email + verification</button>
            </div>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input type="hidden" name="rulesAccepted" value="accepted" />
            {method === "username" ? <>
              <label>username<input name="username" type="text" placeholder="choose a username" minLength={3} maxLength={20} required /></label>
              <label>password<input name="password" type="password" placeholder="create a password" required /></label>
              <label>confirm password<input name="confirmPassword" type="password" placeholder="confirm your password" required /></label>
            </> : <label>email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>}
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="primary-button" disabled={loading}>{loading ? "please wait..." : method === "email" ? "send verification link" : "create account"}</button>
          </form>
        </>}
        <p className="auth-footer">already have an account? <Link href="/login">log in</Link></p>
      </div>
    </main>
  );
}
