import { NextResponse } from "next/server";

export async function GET(request) {
  const apiKey = process.env.VOICY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Voicy API is not configured yet. Add VOICY_API_KEY in Vercel after obtaining an API key from Voicy." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") || "").trim().slice(0, 100);
  const index = Math.max(0, Number.parseInt(searchParams.get("index") || "0", 10) || 0);

  if (!search) {
    return NextResponse.json({ clips: [], error: null });
  }

  const url = new URL("https://api.voicy.network/v1/clips");
  url.searchParams.set("search", search);
  url.searchParams.set("quantity", "30");
  url.searchParams.set("index", String(index));
  url.searchParams.set("rating", "0");
  url.searchParams.set("sort", "1");

  try {
    const response = await fetch(url, {
      headers: { "X-API-KEY": apiKey },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: response.status === 401 || response.status === 403
          ? "Voicy rejected the API key. Check VOICY_API_KEY in Vercel."
          : "Voicy search is temporarily unavailable." },
        { status: response.status === 401 || response.status === 403 ? 502 : 502 }
      );
    }

    const payload = await response.json();
    const clips = Array.isArray(payload.clips) ? payload.clips : [];
    return NextResponse.json({
      clips: clips
        .filter((clip) => clip && typeof clip.sound === "string" && /^https?:\/\//i.test(clip.sound))
        .map((clip) => ({
          id: String(clip.id || clip.sound),
          name: String(clip.name || "Untitled sound"),
          url: clip.sound,
          tags: Array.isArray(clip.tags) ? clip.tags : [],
          source: "Voicy",
        })),
      error: payload.error ? String(payload.errorMessage || "Voicy search failed.") : null,
    });
  } catch {
    return NextResponse.json({ error: "Couldn't reach Voicy right now." }, { status: 502 });
  }
}
