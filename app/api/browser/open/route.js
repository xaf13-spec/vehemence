export const dynamic = "force-dynamic";

const baseDictionary = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~-";
const shuffledIndicator = "_rhs";

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

function shuffleUrl(value, dictionary) {
  if (!dictionary || value.startsWith(shuffledIndicator)) return value;
  let output = shuffledIndicator;
  for (let i = 0; i < value.length; i += 1) {
    const char = value.charAt(i);
    const index = baseDictionary.indexOf(char);
    if (char === "%" && value.length - i >= 3) {
      output += char + value.charAt(i + 1) + value.charAt(i + 2);
      i += 2;
    } else if (index === -1) {
      output += char;
    } else {
      output += dictionary.charAt((index + i) % baseDictionary.length);
    }
  }
  return output;
}

async function readText(base, pathname, params) {
  const url = new URL(pathname, base);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(12000) });
  const text = (await response.text()).trim();
  if (!response.ok) throw new Error("Rammerhead returned HTTP " + response.status + ".");
  return text;
}

export async function POST(request) {
  const base = getBaseUrl();
  if (!base) return Response.json({ error: "Rammerhead server is not configured. Set RAMMERHEAD_URL in the deployment environment." }, { status: 503 });

  let body = {};
  try { body = await request.json(); } catch {}
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  let target;
  try {
    const raw = typeof body.url === "string" ? body.url.trim() : "";
    target = new URL(/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(raw) ? raw : "https://" + raw);
    if (target.protocol !== "http:" && target.protocol !== "https:") throw new Error("Only HTTP and HTTPS addresses are supported.");
  } catch (error) {
    return Response.json({ error: error.message || "Enter a valid website address." }, { status: 400 });
  }
  if (!sessionId || sessionId.length > 256 || /[\r\n/]/.test(sessionId)) {
    return Response.json({ error: "Create a valid session before opening a page." }, { status: 400 });
  }

  const auth = password ? { pwd: password } : {};
  try {
    const exists = await readText(base, "/sessionexists", { id: sessionId, ...auth });
    if (exists !== "exists") return Response.json({ error: "That session was not found. Create a new session and try again." }, { status: 404 });

    const edited = await readText(base, "/editsession", { id: sessionId, enableShuffling: "1", ...auth });
    if (edited !== "Success") return Response.json({ error: "The browser server could not prepare this session." }, { status: 502 });

    let dictionary = null;
    try {
      const rawDictionary = await readText(base, "/api/shuffleDict", { id: sessionId, ...auth });
      dictionary = JSON.parse(rawDictionary);
    } catch {}

    const normalized = target.href;
    const proxiedPath = dictionary ? shuffleUrl(normalized, dictionary) : normalized;
    return Response.json({ targetUrl: base + "/" + encodeURIComponent(sessionId) + "/" + proxiedPath });
  } catch (error) {
    return Response.json({ error: error.message || "Could not open this page through the browser server." }, { status: 502 });
  }
}
