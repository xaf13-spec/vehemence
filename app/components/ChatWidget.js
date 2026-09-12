"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function formatTime(dateString) {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();

  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const previousLatestId = useRef(null);

  async function loadMessages(isInitial = false) {
    try {
      const response = await fetch("/api/chat", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load chat.");
        return;
      }

      const nextMessages = data.messages || [];
      const previousId = previousLatestId.current;
      const latestId = nextMessages[nextMessages.length - 1]?.id || null;

      setCurrentUserId(data.currentUserId);
      setMessages(nextMessages);
      setError("");

      if (!isInitial && previousId && latestId && previousId !== latestId && !open) {
        const index = nextMessages.findIndex((item) => item.id === previousId);
        const newMessages = index === -1 ? nextMessages : nextMessages.slice(index + 1);
        setUnreadCount((count) => count + newMessages.length);
      }

      previousLatestId.current = latestId;
    } catch {
      setError("Could not connect to chat.");
    } finally {
      if (isInitial) setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages(true);

    const interval = setInterval(() => loadMessages(false), 2000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages.length]);

  async function handleSubmit(event) {
    event.preventDefault();
    const text = message.trim();

    if (!text || sending) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not send your message.");
        return;
      }

      setMessages((current) => {
        if (current.some((item) => item.id === data.message.id)) return current;
        return [...current, data.message];
      });
      setMessage("");
    } catch {
      setError("Could not send your message.");
    } finally {
      setSending(false);
    }
  }

  const latest = messages[messages.length - 1];
  const latestPreview = useMemo(() => {
    if (!latest) return null;
    return {
      username: latest.username,
      message: latest.message,
      time: formatTime(latest.createdAt)
    };
  }, [latest]);

  return (
    <div className={`chat-widget ${open ? "chat-widget-open" : ""}`}>
      {open ? (
        <section className="chat-window">
          <header className="chat-window-header">
            <div>
              <strong>Online Chat</strong>
              <span>Community chat</span>
            </div>
            <button
              type="button"
              className="chat-close"
              onClick={() => setOpen(false)}
              aria-label="Minimize chat"
            >
              −
            </button>
          </header>

          <div className="chat-messages">
            {loading ? (
              <div className="chat-empty">Loading chat...</div>
            ) : messages.length === 0 ? (
              <div className="chat-empty">No messages yet. Start the conversation.</div>
            ) : (
              messages.map((item) => (
                <div className="chat-message" key={item.id}>
                  <div className="chat-message-top">
                    <a
                      href={`/profile/${encodeURIComponent(item.username)}`}
                      className="chat-username"
                    >
                      {item.username}
                    </a>
                    <span>{formatTime(item.createdAt)}</span>
                  </div>
                  <div className={`chat-bubble ${item.userId === currentUserId ? "chat-bubble-own" : ""}`}>
                    {item.message}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && <div className="chat-error">{error}</div>}

          <form className="chat-input-area" onSubmit={handleSubmit}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              type="text"
              placeholder="Type a message..."
              maxLength={500}
              disabled={sending}
            />
            <button type="submit" className="chat-send" disabled={sending || !message.trim()}>
              {sending ? "..." : "Send"}
            </button>
          </form>
        </section>
      ) : (
        <div className="chat-minimized-wrap">
          {latestPreview && (
            <div className="chat-preview">
              <strong>{latestPreview.username}</strong>
              <span>{latestPreview.message}</span>
              <small>{latestPreview.time}</small>
            </div>
          )}

          <button
            type="button"
            className="chat-launcher"
            onClick={() => {
              setOpen(true);
              setUnreadCount(0);
            }}
            aria-label="Open online chat"
          >
            <span className="chat-icon">💬</span>
            {unreadCount > 0 && (
              <span className="chat-notification">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
