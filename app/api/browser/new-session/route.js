export const dynamic = "force-dynamic";

function getBaseUrl() {
  const value = process.env.RAMMERHEAD_URL;
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
    return Response.json({ sessionId });
  } catch {
    return Response.json({ error: "Could not reach the configured Rammerhead server." }, { status: 502 });
  }
}
