"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function formatTime(dateString) { return new Intl.DateTimeFormat("en-CA", { hour: "numeric", minute: "2-digit" }).format(new Date(dateString)); }

export default function DirectChatClient({ username, currentUserId, embedded = false, onBack }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [viewerId, setViewerId] = useState(currentUserId || null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  async function loadMessages(showLoading = false) {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(`/api/direct-chat?username=${encodeURIComponent(username)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Could not load this chat."); return; }
      setMessages(data.messages || []);
      if (data.currentUserId) setViewerId(data.currentUserId);
      setError("");
    } catch { setError("Could not connect to chat."); }
    finally { if (showLoading) setLoading(false); }
  }

  useEffect(() => {
    loadMessages(true);
    const interval = setInterval(() => loadMessages(false), 2000);
    return () => clearInterval(interval);
  }, [username]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  async function handleSubmit(event) {
    event.preventDefault(); const text = message.trim(); if (!text || sending) return;
    setSending(true); setError("");
    try {
      const response = await fetch("/api/direct-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, message: text }) });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Could not send the message."); return; }
      if (data.message) setMessages((current) => current.some((item) => item.id === data.message.id) ? current : [...current, data.message]);
      setMessage("");
    } catch { setError("Could not send the message."); }
    finally { setSending(false); }
  }

  return (
    <main className={embedded ? "direct-chat-page direct-chat-embedded" : "friends-page"}>
      <section className={embedded ? "direct-chat-card" : "friends-container direct-chat-page"}>
        <header className="friends-header direct-chat-header">
          <div>
            {embedded ? <button type="button" className="friends-back-link" onClick={onBack}>← Back to Friends</button> : <Link href="/friends" className="friends-back-link">← Back to Friends</Link>}
            <p className="eyebrow">VEHEMENCE</p>
            <h1>Chat with {username}</h1>
            <p>Private conversation between you and {username}.</p>
          </div>
        </header>

        <div className="direct-chat-warning">You have not friended each other, be careful.</div>

        <div className="direct-chat-messages">
          {loading ? <div className="friends-empty">Loading conversation...</div> : messages.length === 0 ? <div className="friends-empty">No messages yet. Start the conversation.</div> : messages.map((item) => {
            const own = item.senderId === viewerId;
            return <div key={item.id} className={`direct-message ${own ? "direct-message-own" : ""}`}><div className="direct-message-meta"><strong>{own ? "You" : item.senderUsername}</strong><span>{formatTime(item.createdAt)}</span></div><div className="direct-message-bubble">{item.message}</div></div>;
          })}
          <div ref={messagesEndRef} />
        </div>
        {error && <div className="direct-chat-error">{error}</div>}
        <form className="direct-chat-input" onSubmit={handleSubmit}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={`Message ${username}...`} maxLength={500} disabled={sending} autoComplete="off" /><button type="submit" className="primary-button" disabled={sending || !message.trim()}>{sending ? "Sending..." : "Send"}</button></form>
      </section>
    </main>
  );
}
