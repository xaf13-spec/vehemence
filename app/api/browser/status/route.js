export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(process.env.RAMMERHEAD_URL);
  return Response.json({ configured });
}
