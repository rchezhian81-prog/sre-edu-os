# SRE EDU OS — Frontend (Next.js 14)

> Production React frontend for the School ERP platform

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS 3 + custom Neu-Skeuomorphism design tokens
- **Components**: Radix UI primitives + custom Neu component library
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand (auth store, persisted)
- **API**: Axios with JWT interceptors + auto-refresh on 401
- **Charts**: Recharts (bar, line, radar)
- **Notifications**: Sonner

## Quick Start

```bash
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

npm install
npm run dev
# App: http://localhost:4000
```

## Pages Built

| Portal  | Page              | Route                       |
|---------|-------------------|-----------------------------|
| Auth    | Login             | /login                      |
| Owner   | Dashboard         | /owner                      |
| Admin   | Dashboard         | /admin                      |
| Admin   | Students          | /admin/students             |
| Admin   | Fees              | /admin/fees                 |
| Teacher | Dashboard         | /teacher                    |
| Teacher | Attendance Marking| /teacher/attendance         |
| Student | Dashboard         | /student                    |
| Parent  | Dashboard         | /parent                     |

## Custom Neu-Skeuomorphism Components

All in `src/components/neu/`:

| Component      | Usage                                         |
|----------------|-----------------------------------------------|
| `NeuCard`      | Main card surface (raised/sunken variants)    |
| `NeuButton`    | Buttons (default/primary/success/danger)      |
| `NeuKpiCard`   | Dashboard metric cards with icons and badges  |
| `NeuBadge`     | Status/label pills                            |
| `NeuProgress`  | Progress bars with gradient fills             |
| `NeuInput`     | Form inputs with sunken shadow                |
| `NeuTable`     | Data tables with alternating hover states     |

## Role-Based Routing

Auth guard in `AuthGuard.tsx` auto-redirects unauthenticated users to `/login`
and role-unauthorised users to `/unauthorized`.

Routes map by role: `owner→/owner`, `admin→/admin`, `teacher→/teacher`,
`student→/student`, `parent→/parent`.

## API Integration

All API calls go through `src/lib/api/client.ts` (Axios):
- Attaches `Authorization: Bearer <token>` from localStorage
- Attaches `x-branch-id` header for branch-scoped queries  
- Auto-refreshes JWT on 401; redirects to `/login` on refresh failure

Set `NEXT_PUBLIC_API_URL` to point at your NestJS backend.
