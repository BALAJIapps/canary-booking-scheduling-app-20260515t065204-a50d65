# BookSlot — Availability-First Scheduling App

A booking and scheduling app with availability slots, duplicate-book prevention, customer booking flow, and admin booking queue.

## Features
- Availability slot management (POST/GET /api/canary-availability)
- Booking creation with duplicate prevention (POST/GET /api/canary-bookings)
- Server-side row-lock double-booking prevention
- Customer and admin views with status badges
- Health check at /api/health

## Stack
- Next.js 15 + Shadcn/ui + Tailwind 4
- Neon Postgres + Drizzle ORM
- Better Auth

## Env vars required
- DATABASE_URL
- BETTER_AUTH_SECRET
- BETTER_AUTH_URL
- NEXT_PUBLIC_APP_URL
- NODE_ENV=production
