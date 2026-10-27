"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { verifyEmailLink } from "./actions";

export default function VerifyEmail() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("checking your link...");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || "";
    const email = params.get("email") || "";
    const mode = params.get("mode") === "login" ? "login" : "verify";
    if (!token || !email) {
      setStatus("error");
      setMessage("this link is invalid or incomplete.");
      return;
    }
    const data = new FormData();
    data.set("token", token);
    data.set("email", email);
    data.set("mode", mode);
    verifyEmailLink(data).then((result) => {
      if (result?.error) {
        setStatus("error");
        setMessage(result.error);
      } else {
        setStatus("success");
        setMessage(mode === "login" ? "you're signed in." : "email verified. you're signed in.");
        window.setTimeout(() => { window.location.href = "/"; }, 900);
      }
    }).catch(() => {
      setStatus("error");
      setMessage("couldn't verify this link. please try again.");
    });
  }, []);
  return <main className="auth-page"><div className="auth-card"><p className="eyebrow">VEHEMENCE</p><h1>{status === "success" ? "you're all set" : status === "error" ? "link problem" : "verifying email"}</h1><p className={status === "error" ? "auth-error" : "auth-footer"}>{message}</p>{status === "error" && <p className="auth-footer"><Link href="/login">back to login</Link> · <Link href="/signup?rules=accepted">sign up again</Link></p>}</div></main>;
}
