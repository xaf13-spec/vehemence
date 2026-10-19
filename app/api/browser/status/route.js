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

export async function GET() {
  const url = getBaseUrl();
  return Response.json({ configured: Boolean(url), url });
}
