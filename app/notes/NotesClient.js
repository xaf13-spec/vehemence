"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createNote, createNoteShare, deleteNote, getNotes, revokeNoteShare, toggleNotePin, updateNote } from "./actions";

export default function NotesClient() {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const saveTimer = useRef(null);
  const selected = notes.find(note => note.id === selectedId) || null;

  const refresh = useCallback(async () => {
    const result = await getNotes();
    if (result.error) { setStatus(result.error); return; }
    setNotes(result.notes);
    setSelectedId(current => current && result.notes.some(note => note.id === current) ? current : result.notes[0]?.id || null);
    setStatus("");
  }, []);

  useEffect(() => { refresh(); return () => clearTimeout(saveTimer.current); }, [refresh]);

  const visible = useMemo(() => notes.filter(note => `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => Number(b.pinned)-Number(a.pinned) || new Date(b.updated_at)-new Date(a.updated_at)), [notes, query]);

  async function addNote() {
    const result = await createNote();
    if (result.error) { setMessage(result.error); return; }
    setNotes(current => [result.note, ...current]);
    setSelectedId(result.note.id);
    setShareUrl("");
    setMessage("");
  }

  function edit(field, value) {
    if (!selected) return;
    const next = { ...selected, [field]: value, updated_at: new Date().toISOString() };
    setNotes(current => current.map(note => note.id === selected.id ? next : note));
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const result = await updateNote(selected.id, { title: next.title, content: next.content });
      setMessage(result.error || "saved");
    }, 550);
  }

  async function share() {
    if (!selected) return;
    const result = await createNoteShare(selected.id);
    if (result.error) { setMessage(result.error); return; }
    const full = `${window.location.origin}${result.url}`;
    setShareUrl(full);
    try { await navigator.clipboard.writeText(full); setMessage("share link copied"); } catch { setMessage("share link ready"); }
  }

  async function stopSharing() {
    if (!selected) return;
    const result = await revokeNoteShare(selected.id);
    setShareUrl("");
    setMessage(result.error || "sharing turned off");
  }

  async function pin() {
    if (!selected) return;
    const next = !selected.pinned;
    setNotes(current => current.map(note => note.id === selected.id ? { ...note, pinned: next } : note));
    const result = await toggleNotePin(selected.id, next);
    if (result.error) setMessage(result.error);
  }

  async function remove() {
    if (!selected || !window.confirm("delete this note?")) return;
    const id = selected.id;
    const result = await deleteNote(id);
    if (result.error) { setMessage(result.error); return; }
    setNotes(current => current.filter(note => note.id !== id));
    setSelectedId(notes.find(note => note.id !== id)?.id || null);
    setShareUrl("");
    setMessage("");
  }

  return <main className="notes-page">
    <header className="notes-heading"><div><p className="eyebrow">your workspace</p><h1>notes</h1><p>private by default. share only when you choose.</p></div><button className="primary-button" onClick={addNote}>＋ new note</button></header>
    {status ? <div className="notes-empty">{status}</div> : <section className="notes-workspace">
      <aside className="notes-sidebar"><div className="notes-search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="search notes..." /></div><div className="notes-list">{visible.map(note=><button key={note.id} className={`notes-list-item ${selectedId===note.id?"active":""}`} onClick={()=>{setSelectedId(note.id);setShareUrl("");setMessage("");}}><span className="notes-list-title">{note.pinned?"◆ ":""}{note.title || "untitled"}</span><span className="notes-list-preview">{note.content?.trim().slice(0,72) || "no additional text"}</span><time>{new Date(note.updated_at).toLocaleDateString()}</time></button>)}{visible.length===0&&<p className="notes-empty-small">no notes found</p>}</div></aside>
      <section className="notes-editor">{selected ? <>
        <div className="notes-toolbar"><span className="notes-save-state">{message || "private note"}</span><div><button className="secondary-button" onClick={pin}>{selected.pinned?"unpin":"pin"}</button><button className="secondary-button" onClick={share}>share</button><button className="secondary-button" onClick={remove}>delete</button></div></div>
        <input className="notes-title-input" value={selected.title} onChange={e=>edit("title",e.target.value)} placeholder="untitled" maxLength={160}/>
        <textarea className="notes-content-input" value={selected.content} onChange={e=>edit("content",e.target.value)} placeholder="start writing..."/>
        {shareUrl&&<div className="notes-share-panel"><span>{shareUrl}</span><button className="secondary-button" onClick={stopSharing}>turn off link</button></div>}
      </> : <div className="notes-no-selection"><span>✎</span><h2>your notes, all in one place</h2><p>create a note to get started.</p><button className="primary-button" onClick={addNote}>create a note</button></div>}</section>
    </section>}
  </main>;
}
