import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { Calendar, Users, Shield, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar nav */}
      <div className="fixed inset-y-0 left-0 z-40 w-56 border-r border-neutral-200 bg-white">
        <div className="flex h-14 items-center border-b border-neutral-100 px-4">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-neutral-900" />
            <span className="text-sm font-semibold text-neutral-900">BookSlot</span>
          </Link>
        </div>
        <nav className="space-y-0.5 p-3">
          <Link
            href="/app"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/app/availability"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Calendar className="h-4 w-4" />
            Availability
          </Link>
          <Link
            href="/app/bookings"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Users className="h-4 w-4" />
            Bookings
          </Link>
          <Link
            href="/app/admin"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Shield className="h-4 w-4" />
            Admin queue
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-100 p-3">
          <form action="/api/auth/sign-out" method="POST">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-neutral-500 hover:text-neutral-900"
            >
              Sign out
            </Button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-56">
        <main className="mx-auto max-w-5xl px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
