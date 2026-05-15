import { NextRequest } from "next/server";
import { db } from "@/db";
import { canaryAvailabilitySlots } from "@/db/schema";
import { z } from "zod";
import { desc } from "drizzle-orm";

const CreateSlotSchema = z.object({
  provider_email: z.string().email(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  timezone: z.string().default("UTC"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateSlotSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const { provider_email, starts_at, ends_at, timezone } = parsed.data;

    const [slot] = await db
      .insert(canaryAvailabilitySlots)
      .values({
        providerEmail: provider_email,
        startsAt: new Date(starts_at),
        endsAt: new Date(ends_at),
        timezone,
      })
      .returning();

    return Response.json({ ok: true, slot }, { status: 201 });
  } catch (err) {
    console.error("[canary-availability POST]", err);
    return Response.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to create slot" } },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const slots = await db
      .select()
      .from(canaryAvailabilitySlots)
      .orderBy(desc(canaryAvailabilitySlots.startsAt))
      .limit(100);

    return Response.json({ ok: true, slots });
  } catch (err) {
    console.error("[canary-availability GET]", err);
    return Response.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch slots" } },
      { status: 500 }
    );
  }
}
