# PROJECT.md — E-SPORTS BANGLADESH (ESBD)

_Initialized by gsd-onboard · 2026-10-28_

---

## Overview

**E-SPORTS BANGLADESH (ESBD)** is a premier esports tournament hosting and gaming platform for Bangladesh. It provides tournament registration, live brackets, leaderboards, a player portal with wallet/rewards, newsroom, and a 3D-immersive web experience.

**Current Version:** 2.0.0  
**Live Platform:** Vercel (production)  
**Local Dev:** `node server.js` → `http://localhost:3000`

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React SPA (pre-compiled Vite bundle) + Three.js 3D |
| Backend | Node.js / Express — single serverless function on Vercel |
| Database | Supabase (PostgreSQL + RLS + Storage) |
| Auth | JWT (HS256, `jsonwebtoken`) |
| Hosting | Vercel (static assets + serverless API) |
| Local Dev Server | Express (`server.js`) |

---

## Key Pages

| Route | Description |
|---|---|
| `/` | Main SPA — tournaments, leaderboard, player portal, streams |
| `/newsroom` | Esports news & articles |
| `/shop` | Merchandise / product listings |
| `/preview` | Design direction preview |
| `/api/*` | REST API (auth, tournaments, leaderboard, teams, shop, admin) |

---

## Codebase Map

See `.planning/codebase/` for full analysis:
- [STACK.md](.planning/codebase/STACK.md) — Tech stack & dependencies
- [INTEGRATIONS.md](.planning/codebase/INTEGRATIONS.md) — External services & APIs
- [ARCHITECTURE.md](.planning/codebase/ARCHITECTURE.md) — System architecture & data flow
- [STRUCTURE.md](.planning/codebase/STRUCTURE.md) — Directory layout & key files
- [CONVENTIONS.md](.planning/codebase/CONVENTIONS.md) — Code style & patterns
- [TESTING.md](.planning/codebase/TESTING.md) — Testing approach
- [CONCERNS.md](.planning/codebase/CONCERNS.md) — Technical debt & risks

---

## Top Priorities

Based on codebase analysis, key areas needing attention:

1. **Security hardening** — hardcoded credentials, JWT fallback secret, CORS wildcard
2. **API refactor** — split 1393-line monolith into domain routers
3. **State persistence** — remove reliance on ephemeral `memoryStore` for mutable data
4. **Frontend source** — recover or add Vite source project for proper build pipeline
5. **Testing** — add formal test framework (Vitest) to replace ad-hoc `scratch/` scripts

---

## Team

**Author:** E-SPORTS BANGLADESH  
**License:** MIT

