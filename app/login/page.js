"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "./actions";
import { requestEmailLogin } from "../signup/email-actions";

export default function Login() {
  const [method, setMethod] = useState("username");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    try {
      if (method === "email") {
        const result = await requestEmailLogin(formData);
        if (result?.error) {
          setError(result.error);
          setLoading(false);
          return;
        }
        setEmailSent(true);
        setLoading(false);
        return;
      }
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      window.location.href = "/";
    } catch (err) {
      console.error("Login request failed:", err);
      setError("couldn't complete the login request. please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">VEHEMENCE</p>
        <h1>welcome back</h1>
        {emailSent ? <>
          <p className="auth-footer">if that email has a verified account, a sign-in link has been sent. check your inbox and spam folder.</p>
          <button type="button" className="secondary-button" onClick={() => setEmailSent(false)}>back to login</button>
        </> : <>
          <div className="auth-form auth-methods">
            <button type="button" className={method === "username" ? "primary-button" : "secondary-button"} onClick={() => { setMethod("username"); setError(""); }}>username + password</button>
            <button type="button" className={method === "email" ? "primary-button" : "secondary-button"} onClick={() => { setMethod("email"); setError(""); }}>email link</button>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {method === "username" ? <>
              <label>username<input name="username" type="text" autoComplete="username" placeholder="enter your username" required /></label>
              <label>password<input name="password" type="password" autoComplete="current-password" placeholder="enter your password" required /></label>
            </> : <label>email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>}
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="primary-button" disabled={loading}>{loading ? "please wait..." : method === "email" ? "send sign-in link" : "log in"}</button>
          </form>
        </>}
        <p className="auth-footer">forgot your password? <Link href="/recover">recover account</Link></p>
        <p className="auth-footer">don't have an account? <Link href="/signup?rules=accepted">create one</Link></p>
      </div>
    </main>
  );
}
