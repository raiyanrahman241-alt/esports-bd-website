# Technology Stack
**Analysis Date:** 2026-10-28

## Languages

**Primary:**
- JavaScript (Node.js ES6/CommonJS & Browser ES Modules) - Backend API logic (`server.js`, `api/index.js`, `lib/supabase.js`, `lib/seedData.js`), client-side application bundle (`assets/index-DxaXhSva.js`), 3D graphics scripts (`assets/esbd-platform-3d-upgraded.js`, `assets/esbd-connected-arena.js`, `assets/ArenaCore-aAl-8thE.js`)

**Secondary:**
- HTML5 - Application shell, client routing entry point, and standalone static landing pages (`index.html`, `preview.html`, `newsroom.html`, `shop.html`)
- CSS3 - Cyber esports styling, animations, 3D CSS transforms, and utility stylesheet (`assets/esbd-platform-3d.css`, `assets/esbd-connected-arena.css`, `assets/index-Bdt_ggT_.css`)
- SQL (PostgreSQL Dialect) - Production database schema, foreign keys, row-level security (RLS), and database seed queries (`supabase_schema.sql`)

## Runtime

**Environment:**
- Node.js (v26.3.1 confirmed; compatible with Node.js 18+ LTS)
- Modern Web Browsers supporting WebGL 1.0/2.0 (for Three.js canvas rendering)

**Package Manager:**
- npm (v11.16.0)
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**
- Express 4.21.2 (`express`) - Web application framework handling API routes, CORS middleware, and static asset delivery in local development and as a Vercel serverless function (`server.js`, `api/index.js`)
- React 18+ - Client-side single-page application framework bundled in `assets/index-DxaXhSva.js` with client routes, tournament UI, and DOM resilience protections
- Three.js (r128+ in `assets/three.min.js`) - Client-side 3D WebGL graphics engine powering the Cyber Arena hero visualizer, particle canvas, and interactive mouse-tracking spotlight

**Testing:**
- Not detected (no automated testing frameworks configured in `package.json`)

**Build/Dev:**
- Node.js native execution (`node server.js`) for dev and start scripts
- Pre-compiled production bundles (committed under `assets/` and `public/`)
- Vercel Serverless Routing & Deployment Engine (`vercel.json`)

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` `^2.49.1` - Official client SDK for Supabase PostgreSQL database querying, auth synchronization, and storage interactions (`lib/supabase.js`, `api/index.js`)
- `express` `^4.21.2` - HTTP server foundation powering both standalone server and serverless API execution (`server.js`, `api/index.js`)
- `jsonwebtoken` `^9.0.2` - HMAC-SHA256 signing and verification for session authentication tokens (`api/index.js`)
- `cors` `^2.8.5` - Cross-Origin Resource Sharing handling across endpoints (`api/index.js`)
- `dotenv` `^16.4.7` - Environment variable configuration loading in Node.js runtime (`server.js`, `lib/supabase.js`)

**Infrastructure:**
- Vercel (`vercel.json`, `.vercel/project.json`) - Hosting platform defining API rewrite rules, route routing, and HTTP caching headers

## Configuration

**Environment:**
- Loaded via `dotenv` from `.env` and `.env.local` files in development; injected via Vercel platform environment variables in production
- `.env`, `.env.example`, `.env.local` present in root directory
- Key configs required:
  - `PORT` - HTTP server port for local server (default: `3000`)
  - `JWT_SECRET` - Cryptographic secret key used to sign and verify authentication tokens
  - `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` - HTTPS API URL for the Supabase project
  - `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase access keys

**Build:**
- `package.json`:
  - `dev`: `node server.js`
  - `start`: `node server.js`
  - `build`: `echo "Build ready."`
- `vercel.json`: Handles URL rewrites (`/api/(.*)` to `/api/index.js`, `/(.*)` to `/index.html`), route aliasing for legacy bundles (`/assets/index-v4-esbd.js` to `/assets/index-DxaXhSva.js`), and caching headers

## Platform Requirements

**Development:**
- Node.js 18.x or higher
- npm 9.x or higher
- Windows, macOS, or Linux operating system
- Hardware-accelerated browser for WebGL 3D rendering

**Production:**
- Vercel Serverless Platform (configured with static file hosting and serverless functions via `vercel.json`)
- Alternative: Any Node.js-compatible container/VPS environment running `server.js`

---

*Stack analysis: 2026-10-28*
