import Link from "next/link";
import { Calendar, Clock, Shield, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-neutral-900" />
            <span className="text-base font-semibold tracking-tight text-neutral-900">BookSlot</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-900">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-neutral-900 text-white hover:bg-neutral-700">
                Book a slot
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — left-aligned with visual anchor */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24">
        <div className="grid gap-16 md:grid-cols-[1fr_420px]">
          <div>
            <Badge variant="outline" className="mb-6 border-neutral-300 text-neutral-500 text-xs font-medium">
              Availability-first scheduling
            </Badge>
            <h1
              className="text-5xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-6xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.02em" }}
            >
              Book the exact slot<br />you need.
            </h1>
            <p className="mt-6 max-w-lg text-lg font-light leading-relaxed text-neutral-500">
              Providers publish availability windows. Customers pick a time and confirm in seconds. No back-and-forth.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="bg-neutral-900 text-white hover:bg-neutral-700 px-8">
                  Reserve a slot
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                  Admin view
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-col gap-2">
              {[
                "Duplicate-booking prevention — one slot, one customer",
                "Separate customer and admin queues",
                "Real-time availability status badges",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-neutral-500">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Slot picker preview card */}
          <div
            className="rounded-xl border border-neutral-200 bg-white p-6"
            style={{ boxShadow: "rgba(19,19,22,0.7) 0px 1px 5px -4px, rgba(34,42,53,0.08) 0px 0px 0px 1px, rgba(34,42,53,0.05) 0px 4px 8px 0px" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-900">Available slots</span>
              <span className="text-xs text-neutral-400">UTC</span>
            </div>
            <div className="space-y-2">
              {[
                { time: "10:00 – 10:30", status: "available", label: "Open" },
                { time: "11:00 – 11:30", status: "booked", label: "Booked" },
                { time: "14:00 – 14:30", status: "available", label: "Open" },
                { time: "15:00 – 15:30", status: "available", label: "Open" },
              ].map(({ time, status, label }) => (
                <div
                  key={time}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm ${
                    status === "available"
                      ? "bg-neutral-50 border border-neutral-200 text-neutral-900"
                      : "bg-neutral-100 border border-neutral-200 text-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-medium">{time}</span>
                  </div>
                  <Badge
                    variant={status === "available" ? "outline" : "secondary"}
                    className="text-xs"
                  >
                    {label}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-neutral-100 pt-4">
              <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-700" size="sm">
                Book selected slot
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Status flow — unconventional section: process steps */}
      <section className="border-t border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-12 text-2xl font-semibold tracking-tight text-neutral-900">
            How it works
          </h2>
          <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
            <div className="rounded-xl border border-neutral-200 bg-white p-8" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <Calendar className="h-5 w-5 text-neutral-700" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-neutral-900">Provider sets availability</h3>
              <p className="text-sm leading-relaxed text-neutral-500">
                Providers define open time windows with a start, end, and timezone. Each slot is independent and can be managed separately.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-8" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <Clock className="h-5 w-5 text-neutral-700" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-neutral-900">Customer books</h3>
              <p className="text-sm leading-relaxed text-neutral-500">
                Customers browse open slots and confirm with their email. The slot locks immediately on first confirmation.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-8" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <Shield className="h-5 w-5 text-neutral-700" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-neutral-900">No double-booking</h3>
              <p className="text-sm leading-relaxed text-neutral-500">
                Server-side row-locking prevents two customers from booking the same slot simultaneously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin queue preview */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Admin booking queue</h2>
          <Link href="/sign-in">
            <Button variant="outline" size="sm" className="border-neutral-300 text-neutral-700">
              View full queue
            </Button>
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-neutral-200" style={{ boxShadow: "rgba(34,42,53,0.05) 0px 4px 8px" }}>
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Provider</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Time</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { customer: "alice@example.com", provider: "coach@example.com", time: "Jan 2 · 10:00", status: "confirmed" },
                { customer: "bob@example.com", provider: "coach@example.com", time: "Jan 2 · 14:00", status: "confirmed" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 text-neutral-900">{row.customer}</td>
                  <td className="px-4 py-3 text-neutral-500">{row.provider}</td>
                  <td className="px-4 py-3 text-neutral-500">{row.time}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="border-neutral-300 text-neutral-600 text-xs">{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t border-neutral-100 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-neutral-400">
          <span>BookSlot — availability-first scheduling</span>
          <span>Built on Next.js · Neon · Better Auth</span>
        </div>
      </footer>
    </main>
  );
}
