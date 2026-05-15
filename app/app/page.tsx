import { requireSession } from "@/lib/session";
import { db } from "@/db";
import { canaryAvailabilitySlots, canaryBookings } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  await requireSession();

  const [totalSlots] = await db
    .select({ count: count() })
    .from(canaryAvailabilitySlots);

  const [totalBookings] = await db
    .select({ count: count() })
    .from(canaryBookings);

  const recentBookings = await db
    .select({
      id: canaryBookings.id,
      customerEmail: canaryBookings.customerEmail,
      status: canaryBookings.status,
      createdAt: canaryBookings.createdAt,
      slotStartsAt: canaryAvailabilitySlots.startsAt,
      providerEmail: canaryAvailabilitySlots.providerEmail,
    })
    .from(canaryBookings)
    .leftJoin(canaryAvailabilitySlots, eq(canaryBookings.slotId, canaryAvailabilitySlots.id))
    .orderBy(desc(canaryBookings.createdAt))
    .limit(10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Overview of slots and bookings</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_2fr]">
        <div className="rounded-xl border border-neutral-200 bg-white p-6" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
              <Calendar className="h-4 w-4 text-neutral-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Total slots</p>
              <p className="text-2xl font-semibold text-neutral-900">{totalSlots?.count ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
              <Users className="h-4 w-4 text-neutral-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Total bookings</p>
              <p className="text-2xl font-semibold text-neutral-900">{totalBookings?.count ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
              <Clock className="h-4 w-4 text-neutral-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Quick actions</p>
              <div className="mt-2 flex gap-2">
                <Link href="/app/availability">
                  <Button size="sm" className="bg-neutral-900 text-white hover:bg-neutral-700 text-xs">Add slot</Button>
                </Link>
                <Link href="/app/bookings">
                  <Button size="sm" variant="outline" className="text-xs">View bookings</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Recent bookings</h2>
        {recentBookings.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
            <p className="text-sm text-neutral-500">No bookings yet. Add an availability slot to get started.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Provider</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Slot time</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-900">{b.customerEmail}</td>
                    <td className="px-4 py-3 text-neutral-500">{b.providerEmail ?? "—"}</td>
                    <td className="px-4 py-3 text-neutral-500">
                      {b.slotStartsAt ? new Date(b.slotStartsAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-neutral-300 text-neutral-600 text-xs">
                        {b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
