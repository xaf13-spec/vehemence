"use client";

import { useState } from "react";
import Link from "next/link";
import { recoverAccount } from "./actions";

export default function RecoverAccount() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await recoverAccount(new FormData(event.currentTarget));
    if (result?.error) { setError(result.error); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  }
  return <main className="auth-page"><div className="auth-card"><h1>recover account</h1>{success ? <><p className="settings-success">password updated. log in with your new password.</p><p className="auth-footer"><Link href="/login">log in</Link></p></> : <form className="auth-form" onSubmit={handleSubmit}><label>username<input name="username" autoComplete="username" required /></label><label>recovery code<input name="recoveryCode" autoComplete="off" required /></label><label>new password<input name="newPassword" type="password" autoComplete="new-password" minLength={8} required /></label><label>confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></label>{error && <p className="auth-error">{error}</p>}<button className="primary-button" type="submit" disabled={loading}>{loading ? "updating..." : "reset password"}</button></form>}<p className="auth-footer"><Link href="/login">back to login</Link></p></div></main>;
}
