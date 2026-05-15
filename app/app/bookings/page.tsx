"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus } from "lucide-react";
import { toast } from "sonner";

interface Slot {
  id: string;
  providerEmail: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  isBooked: boolean;
}

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

export default function BookingsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);
  const [form, setForm] = useState({
    slot_id: "",
    customer_email: "",
    note: "",
  });

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => { isMounted.current = false; };
  }, []);

  async function fetchData() {
    try {
      const [slotsRes, bookingsRes] = await Promise.all([
        fetch("/api/canary-availability"),
        fetch("/api/canary-bookings"),
      ]);
      const slotsData = await slotsRes.json();
      const bookingsData = await bookingsRes.json();
      if (!isMounted.current) return;
      if (slotsData.ok) setSlots(slotsData.slots.filter((s: Slot) => !s.isBooked));
      if (bookingsData.ok) setBookings(bookingsData.bookings);
    } catch {
      if (isMounted.current) toast.error("Failed to load data");
    }
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/canary-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message ?? "Booking failed");
        return;
      }
      toast.success("Booking confirmed");
      setForm({ slot_id: "", customer_email: "", note: "" });
      await fetchData();
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Bookings</h1>
        <p className="mt-1 text-sm text-neutral-500">Reserve a slot and view booking history</p>
      </div>

      {/* Book form */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Book a slot</h2>
        <form onSubmit={handleBook} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="slot_id">Available slot</Label>
            <select
              id="slot_id"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.slot_id}
              onChange={(e) => setForm((f) => ({ ...f, slot_id: e.target.value }))}
              required
            >
              <option value="">Select a slot...</option>
              {slots.map((s) => (
                <option key={s.id} value={s.id}>
                  {new Date(s.startsAt).toLocaleString()} – {new Date(s.endsAt).toLocaleTimeString()} ({s.timezone}) · {s.providerEmail}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customer_email">Your email</Label>
            <Input
              id="customer_email"
              type="email"
              placeholder="you@example.com"
              value={form.customer_email}
              onChange={(e) => setForm((f) => ({ ...f, customer_email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Anything the provider should know..."
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-neutral-900 text-white hover:bg-neutral-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              {loading ? "Booking..." : "Reserve slot"}
            </Button>
          </div>
        </form>
      </div>

      {/* Bookings list */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">All bookings</h2>
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
            <p className="text-sm text-neutral-500">No bookings yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Provider</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Slot</th>
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
