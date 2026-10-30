import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SharedNotePage({ params }) {
  const { token } = await params;
  if (!/^[a-f0-9]{48}$/i.test(token || "")) notFound();
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data } = await db.from("note_shares").select("note_id").eq("share_token", token).maybeSingle();
  if (!data) notFound();
  const { data: note } = await db.from("notes").select("title,content,updated_at").eq("id", data.note_id).maybeSingle();
  if (!note) notFound();
  return <main className="shared-note-page"><article><p className="eyebrow">shared note · vehemence</p><h1>{note.title || "untitled"}</h1><div>{note.content}</div><footer>shared privately by link</footer></article></main>;
}
