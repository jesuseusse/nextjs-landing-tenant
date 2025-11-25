# Context for Agents (Codex, etc.)

Quick guide to the multi-tenant clinic/services project decisions. All documentation will be maintained in English.

## Goals and scope

- Per-tenant landing page with customizable colors, borders, and typography using Tailwind mapped to CSS variables.
- Tenants resolved by subdomain/domain (future); for now, path-based `/:tenant`.
- Clients share a single account and can book in any tenant; no fixed `tenantId` on the client user.
- Owners/Staff are tied to a tenant via memberships and manage their landing/services.

## Routes (Next.js App Router)

- Public landing: `app/(public)/[tenant]/page.tsx`.
- Unified client login: `app/(auth)/login`.
- Global admin: `app/(dashboard)/admin/*`.
- Middleware `middleware.ts` will resolve host→tenant and/or path→tenant, rewriting to `/:tenant`.

## Theming

- `globals.css` defines base tokens; Tailwind maps to CSS vars.
- In `app/(public)/[tenant]/layout.tsx`, fetch tenant theme and set variables on `<html>`/`<body>` (colors, radii, font).
- Fonts via `next/font` mapped to CSS vars; switch per tenant without recompiling Tailwind.

## Suggested modeling

- `Tenant { id, slug, domain?, theme { colors, radius, fontId }, settings }`
- `User { id, email, role: ['admin','owner','staff','client'] }`
- `Membership { userId, tenantId, role }` (for owner/staff; clients have no fixed tenant)
- `Service { id, tenantId, ... }`
- `Booking { id, tenantId, clientId, serviceId, ... }` → always store `tenantId`
- `LandingSection { id, tenantId, type, content, order }`

## Auth

- Auth provider (e.g., NextAuth) with role and membership claims.
- Dashboard middleware/layouts validate role + membership for `[tenant]`.
- Clients: role `client` without fixed `tenantId`; `tenantId` comes from booking flow context.

## Client flow

1. Arrives at a tenant landing (host or `/:tenant`).
2. Chooses service → if not logged in, unified login.
3. Booking is created with contextual `tenantId`, not from the user record.
4. Client can view bookings filtered by tenant.

## Files/folders to create or adjust

- `middleware.ts`: resolve tenant from host/path and set headers/cookies.
- `app/(public)/[tenant]/layout.tsx`: apply dynamic theme.
- `app/(public)/[tenant]/page.tsx`: base landing with modular sections.
- `lib/tenant.ts`: tenant lookup by host/slug.
- `lib/theme.ts`: normalize theme → CSS vars.
- `components/tenant/*`: themable UI.
- `components/dashboard/*`: owner/staff/admin panels with role guards.
- Backend will follow clean architecture so database swaps are easy (domain/usecase/adapters split).
- Always use React Query for client-side data fetching and caching.

## Notes

- Sanitize theme inputs; do not allow arbitrary CSS.
- Cache tenant lookups (edge-safe if needed).
- Avoid reverting user changes; the repo may be dirty.
