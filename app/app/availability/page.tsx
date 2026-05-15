"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import { toast } from "sonner";

interface Slot {
  id: string;
  providerEmail: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  isBooked: boolean;
}

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    provider_email: "",
    starts_at: "",
    ends_at: "",
    timezone: "UTC",
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    try {
      const res = await fetch("/api/canary-availability");
      const data = await res.json();
      if (data.ok) setSlots(data.slots);
    } catch {
      toast.error("Failed to load slots");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/canary-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message ?? "Failed to create slot");
        return;
      }
      toast.success("Slot created");
      setSlots((prev) => [data.slot, ...prev]);
      setForm({ provider_email: "", starts_at: "", ends_at: "", timezone: "UTC" });
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Availability</h1>
        <p className="mt-1 text-sm text-neutral-500">Add and manage open time slots</p>
      </div>

      {/* Create form */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Add availability slot</h2>
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="provider_email">Provider email</Label>
            <Input
              id="provider_email"
              type="email"
              placeholder="coach@example.com"
              value={form.provider_email}
              onChange={(e) => setForm((f) => ({ ...f, provider_email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              placeholder="UTC"
              value={form.timezone}
              onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="starts_at">Start time</Label>
            <Input
              id="starts_at"
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  starts_at: e.target.value ? new Date(e.target.value).toISOString() : "",
                }))
              }
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ends_at">End time</Label>
            <Input
              id="ends_at"
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  ends_at: e.target.value ? new Date(e.target.value).toISOString() : "",
                }))
              }
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-neutral-900 text-white hover:bg-neutral-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              {loading ? "Creating..." : "Create slot"}
            </Button>
          </div>
        </form>
      </div>

      {/* Slots list */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">All slots</h2>
        {slots.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
            <Calendar className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
            <p className="text-sm text-neutral-500">No slots yet. Add one above.</p>
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
                {slots.map((slot) => (
                  <tr key={slot.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-900">{slot.providerEmail}</td>
                    <td className="px-4 py-3 text-neutral-500">{new Date(slot.startsAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-neutral-500">{new Date(slot.endsAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-neutral-500">{slot.timezone}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={slot.isBooked ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {slot.isBooked ? "Booked" : "Available"}
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
