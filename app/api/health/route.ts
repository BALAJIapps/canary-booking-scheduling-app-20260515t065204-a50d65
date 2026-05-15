import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return Response.json({ ok: true, checks: { db: "ok" } });
  } catch (err) {
    console.error("[health] db check failed", err);
    return Response.json({ ok: false, checks: { db: "error" } }, { status: 503 });
  }
}
