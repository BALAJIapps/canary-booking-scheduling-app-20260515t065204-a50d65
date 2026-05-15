"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Calendar, Users, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  slotId: string;
  customerEmail: string;
  note: string | null;
  status: string;
  createdAt: string;
  slotStartsAt: string | null;
  slotEndsAt: string | null;
  slotTimezone: string | null;
  providerEmail: string | null;
}

interface Slot {
  id: string;
  providerEmail: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  isBooked: boolean;
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setRefreshing(true);
    try {
      const [bookingsRes, slotsRes] = await Promise.all([
        fetch("/api/canary-bookings"),
        fetch("/api/canary-availability"),
      ]);
      const bookingsData = await bookingsRes.json();
      const slotsData = await slotsRes.json();
      if (bookingsData.ok) setBookings(bookingsData.bookings);
      if (slotsData.ok) setSlots(slotsData.slots);
    } catch {
      toast.error("Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  }

  const availableSlots = slots.filter((s) => !s.isBooked);
  const bookedSlots = slots.filter((s) => s.isBooked);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Admin queue</h1>
          <p className="mt-1 text-sm text-neutral-500">All bookings and availability slots</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={refreshing}
          className="border-neutral-300 text-neutral-700"
        >
          <RefreshCw className={`mr-2 h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
        <div className="rounded-xl border border-neutral-200 bg-white p-5" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-500">Total bookings</p>
              <p className="text-xl font-semibold text-neutral-900">{bookings.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-500">Available slots</p>
              <p className="text-xl font-semibold text-neutral-900">{availableSlots.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-500">Booked slots</p>
              <p className="text-xl font-semibold text-neutral-900">{bookedSlots.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking queue */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Booking queue</h2>
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
            <p className="text-sm text-neutral-500">No bookings yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Provider</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Time</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Note</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-900">{b.customerEmail}</td>
                    <td className="px-4 py-3 text-neutral-500">{b.providerEmail ?? "—"}</td>
                    <td className="px-4 py-3 text-neutral-500">
                      {b.slotStartsAt ? new Date(b.slotStartsAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-400 max-w-xs truncate">{b.note ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={b.status === "confirmed" ? "outline" : "secondary"}
                        className="text-xs"
                      >
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

      {/* Slots table */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">All availability slots</h2>
        {slots.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
            <p className="text-sm text-neutral-500">No slots yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Provider</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Start</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">End</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Timezone</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((s) => (
                  <tr key={s.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-900">{s.providerEmail}</td>
                    <td className="px-4 py-3 text-neutral-500">{new Date(s.startsAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-neutral-500">{new Date(s.endsAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-neutral-500">{s.timezone}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={s.isBooked ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {s.isBooked ? "Booked" : "Available"}
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
