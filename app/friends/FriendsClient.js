"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSocialData, respondToFriendRequest, removeFriend, searchUsers, sendFriendRequest } from "./actions";
import StartCallButton from "../components/StartCallButton";
import DirectChatClient from "../chat/[username]/DirectChatClient";

export default function FriendsClient() {
  const [data, setData] = useState({ friends: [], incoming: [], outgoing: [] });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatUsername, setChatUsername] = useState(null);

  async function refresh() {
    setLoading(true);
    const result = await getSocialData();
    if (result?.error) setMessage(result.error); else setData(result);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 30000);
    const openChat = (event) => {
      const username = event.detail?.username?.toString().trim();
      if (username) setChatUsername(username);
    };
    window.addEventListener("vehemence-open-chat", openChat);
    return () => { clearInterval(timer); window.removeEventListener("vehemence-open-chat", openChat); };
  }, []);

  async function handleSearch(event) {
    event.preventDefault(); setMessage("");
    const result = await searchUsers(query);
    if (result?.error) setMessage(result.error); else setResults(result.users || []);
  }

  async function add(username) {
    setMessage("");
    const result = await sendFriendRequest(username);
    setMessage(result?.error || (result?.accepted ? "Friend request accepted." : "Friend request sent."));
    if (!result?.error) { setResults((items) => items.filter((item) => item.username !== username)); refresh(); }
  }

  async function respond(id, accept) { setMessage(""); const result = await respondToFriendRequest(id, accept); if (result?.error) setMessage(result.error); else refresh(); }
  async function remove(id) { setMessage(""); const result = await removeFriend(id); if (result?.error) setMessage(result.error); else refresh(); }

  const UserRow = ({ item, action }) => (
    <div className="friend-row">
      <Link href={`/profile/${encodeURIComponent(item.username)}`} className="friend-person"><span className={`friend-dot ${item.online ? "online" : ""}`} /><span><strong>{item.username}</strong><small>{item.online ? "Online" : "Offline"}</small></span></Link>
      <div className="friend-actions">{action}</div>
    </div>
  );

  if (chatUsername) {
    return (
      <main className="friends-page">
        <section className="friends-container">
          <DirectChatClient username={chatUsername} currentUserId={null} embedded onBack={() => setChatUsername(null)} />
        </section>
      </main>
    );
  }

  return (
    <main className="friends-page">
      <section className="friends-container">
        <header className="friends-header"><div><p className="eyebrow">VEHEMENCE</p><h1>Friends</h1></div></header>
        <section className="friends-search-card">
          <form onSubmit={handleSearch} className="friends-search-form"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search usernames..." aria-label="Search usernames" /><button className="primary-button" type="submit">Search</button></form>
          {message && <p className="friends-message">{message}</p>}
          {results.length > 0 && <div className="friends-results">{results.map((item) => <UserRow key={item.id} item={item} action={<button className="secondary-button" onClick={() => add(item.username)}>Send Friend Request</button>} />)}</div>}
        </section>
        <section className="friends-section"><div className="friends-section-header"><h2>Friend Requests</h2><p>{data.incoming.length} incoming · {data.outgoing.length} outgoing</p></div><div className="friends-card">{data.incoming.length ? data.incoming.map((item) => <UserRow key={item.id} item={item} action={<><button className="primary-button" onClick={() => respond(item.id, true)}>Accept</button><button className="secondary-button" onClick={() => respond(item.id, false)}>Decline</button></>} />) : <div className="friends-empty">No incoming friend requests.</div>}{data.outgoing.length > 0 && <div className="friends-subsection">{data.outgoing.map((item) => <UserRow key={item.id} item={item} action={<span className="friends-pending">Pending</span>} />)}</div>}</div></section>
        <section className="friends-section"><div className="friends-section-header"><h2>Your Friends</h2><p>{loading ? "Loading..." : `${data.friends.length} ${data.friends.length === 1 ? "friend" : "friends"}`}</p></div><div className="friends-card">{data.friends.length ? data.friends.map((item) => <UserRow key={item.id} item={item} action={<><button type="button" className="secondary-button friend-action-link" onClick={() => setChatUsername(item.username)}>Chat</button><StartCallButton calleeUsername={item.username} /><button className="secondary-button" onClick={() => remove(item.id)}>Remove</button></>} />) : <div className="friends-empty">You don't have any friends yet.</div>}</div></section>
      </section>
    </main>
  );
}
