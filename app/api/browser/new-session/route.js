export const dynamic = "force-dynamic";

function getBaseUrl() {
  const value = process.env.RAMMERHEAD_URL || "https://rammerhead-production-9349.up.railway.app";
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export async function POST(request) {
  const base = getBaseUrl();
  if (!base) return Response.json({ error: "Rammerhead server is not configured. Set RAMMERHEAD_URL in the deployment environment." }, { status: 503 });

  let body = {};
  try { body = await request.json(); } catch {}
  const password = typeof body.password === "string" ? body.password : "";
  const endpoint = new URL("/newsession", base);
  if (password) endpoint.searchParams.set("pwd", password);

  try {
    const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(12000) });
    const sessionId = (await response.text()).trim();
    if (!response.ok || !sessionId || /error|unauthorized|forbidden/i.test(sessionId)) {
      return Response.json({ error: "The browser server rejected the session request. Check its password and server logs." }, { status: 502 });
    }
    // Configure URL handling once per session instead of repeating this
    // request on every navigation.
    const editUrl = new URL("/editsession", base);
    editUrl.searchParams.set("id", sessionId);
    editUrl.searchParams.set("enableShuffling", "0");
    if (password) editUrl.searchParams.set("pwd", password);
    const editResponse = await fetch(editUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const editResult = (await editResponse.text()).trim();
    if (!editResponse.ok || editResult !== "Success") {
      return Response.json({ error: "The browser server created a session but couldn't prepare it. Please try a new session." }, { status: 502 });
    }

    return Response.json({ sessionId });
  } catch {
    return Response.json({ error: "Could not reach the configured Rammerhead server." }, { status: 502 });
  }
}
