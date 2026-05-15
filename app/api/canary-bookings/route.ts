// Canary API — intentionally public (no auth required by canary contract)
import { NextRequest } from "next/server";
import { db } from "@/db";
import { canaryBookings, canaryAvailabilitySlots } from "@/db/schema";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

const CreateBookingSchema = z.object({
  slot_id: z.string().uuid(),
  customer_email: z.string().email(),
  note: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateBookingSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const { slot_id, customer_email, note } = parsed.data;

    // Transaction with SELECT FOR UPDATE prevents race-condition double-booking
    const result = await db.transaction(async (tx) => {
      const slots = await tx.execute(
        sql`SELECT id, is_booked FROM canary_availability_slots WHERE id = ${slot_id} FOR UPDATE`
      );

      const slot = (slots.rows as Array<{ id: string; is_booked: boolean }>)[0];

      if (!slot) {
        return { error: { code: "SLOT_NOT_FOUND", message: "Slot not found" }, status: 404 };
      }

      if (slot.is_booked) {
        return { error: { code: "SLOT_ALREADY_BOOKED", message: "This slot is already booked" }, status: 409 };
      }

      await tx
        .update(canaryAvailabilitySlots)
        .set({ isBooked: true })
        .where(eq(canaryAvailabilitySlots.id, slot_id));

      const [booking] = await tx
        .insert(canaryBookings)
        .values({
          slotId: slot_id,
          customerEmail: customer_email,
          note: note ?? null,
        })
        .returning();

      return { booking, status: 201 };
    });

    if ("error" in result) {
      return Response.json({ ok: false, error: result.error }, { status: result.status });
    }

    return Response.json({ ok: true, booking: result.booking }, { status: 201 });
  } catch (err) {
    console.error("[canary-bookings POST]", err);
    return Response.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to create booking" } },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await db
      .select({
        id: canaryBookings.id,
        slotId: canaryBookings.slotId,
        customerEmail: canaryBookings.customerEmail,
        note: canaryBookings.note,
        status: canaryBookings.status,
        createdAt: canaryBookings.createdAt,
        slotStartsAt: canaryAvailabilitySlots.startsAt,
        slotEndsAt: canaryAvailabilitySlots.endsAt,
        slotTimezone: canaryAvailabilitySlots.timezone,
        providerEmail: canaryAvailabilitySlots.providerEmail,
      })
      .from(canaryBookings)
      .leftJoin(canaryAvailabilitySlots, eq(canaryBookings.slotId, canaryAvailabilitySlots.id))
      .orderBy(desc(canaryBookings.createdAt))
      .limit(100);

    return Response.json({ ok: true, bookings });
  } catch (err) {
    console.error("[canary-bookings GET]", err);
    return Response.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch bookings" } },
      { status: 500 }
    );
  }
}
