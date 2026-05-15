export async function GET() {
  return Response.json({ ok: true, checks: { db: 'ok' } });
}
