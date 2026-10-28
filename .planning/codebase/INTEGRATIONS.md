# External Integrations
**Analysis Date:** 2026-10-28

## APIs & External Services

**Database & Backend as a Service:**
- Supabase - Remote PostgreSQL database, user profiles, tournament management, and dispute logs
  - SDK/Client: `@supabase/supabase-js` `^2.49.1` in `lib/supabase.js`
  - Auth: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` (with fallbacks `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  - Resilience Engine: In-memory fallback (`lib/seedData.js` & `api/index.js`) engages automatically if Supabase credentials are missing or unreachable

**Fonts & CDN Assets:**
- Google Fonts API - Typography delivery for the gaming cyber aesthetic (Architects Daughter, DM Sans, Fira Code, Geist, IBM Plex, Inter, JetBrains Mono, Outfit, Oxanium, Space Grotesk)
  - Preconnected endpoints: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`
  - Used in: `index.html`, `preview.html`, `shop.html`, `newsroom.html`
  - Auth: None (public CDN)

**Video Streaming Embeds:**
- YouTube Embedded Player - Live esports tournament broadcasts and player POV match feeds
  - Embed domain: `https://www.youtube-nocookie.com/embed/`
  - Configuration: Stored in stream data objects within `api/index.js` (`/api/streams`)
  - Auth: None (public video embeds)

**Local Payment & MFS Records:**
- Bangladesh Mobile Financial Services (bKash, Nagad, Rocket, Bank Transfer)
  - Integration approach: Semi-automated manual verification flow in `api/index.js` (`/api/me/wallet/top-up`, `/api/products/order`)
  - Merchant account configuration: `bkashMerchant: "01700000000"` defined in `/api/config`
  - Flow: Users submit transaction reference IDs (TRX IDs) which are stored in wallet transaction records and verified by platform administrators

## Data Storage

**Databases:**
- PostgreSQL (via Supabase)
  - Connection: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_ANON_KEY` in `lib/supabase.js`
  - Client: `@supabase/supabase-js`
  - Schema: `supabase_schema.sql` (20 relational tables including `profiles`, `tournaments`, `teams`, `matches`, `match_submissions`, `disputes`, `wallet_transactions`, `announcements`, `games`, `influencers`, `clients`, `communities`, `products`, `orders`)
- In-Memory High-Speed Store (`memoryStore`)
  - Client: Native JavaScript object in `api/index.js` pre-populated from `lib/seedData.js`
  - Purpose: Instant zero-config fallback and local development operation without database latency

**File Storage:**
- Local Filesystem: Static files served from `assets/`, `img/`, `public/assets/`, `public/img/` by Express in `server.js` and `api/index.js`
- Remote Object Storage: Supabase Storage bucket URLs referenced in schema (`nid_attachment_url`, `proof_url`), falling back to local image assets (`/img/gallery/...`, `/img/esbd-logo.png`)

**Caching:**
- HTTP Edge & Browser Caching configured in `vercel.json` and `server.js`:
  - JavaScript / CSS bundles (`/assets/(.*)`): `Cache-Control: public, max-age=0, must-revalidate`
  - Media & Images (`/img/(.*)`): `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`
- Application-level in-memory state in `api/index.js`

## Authentication & Identity

**Auth Provider:**
- Custom JWT Authentication (Primary)
  - Implementation: `jsonwebtoken` (HS256) in `api/index.js`
  - Endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
  - Verification: `authenticateUser()` helper inspects `Authorization: Bearer <token>`
  - Expiration: 7 days
- Supabase Auth (Dual Integration)
  - Profiles are synchronized to the Supabase `profiles` table on registration when live Supabase connection is detected

## Monitoring & Observability

**Error Tracking:**
- Console Logging: Structured `console.log`, `console.warn`, and `console.error` across `server.js`, `lib/supabase.js`, and `api/index.js`
- React DOM Crash Shield: Global client-side interceptor in `index.html` and `preview.html` preventing React 18 DOM tree mutation errors (`removeChild`, `Minified React error #321`)

**Logs:**
- Console output (stdout/stderr) during local development
- Vercel Function Runtime Logs accessible via Vercel Web Dashboard in production

## CI/CD & Deployment

**Hosting:**
- Vercel: Primary deployment target configured via `vercel.json` and linked in `.vercel/project.json` (`projectId: prj_JUn2oFXnloUWdhk2Rxc5odIhGf8I`)
- Node.js Container / Self-hosted: Can run on any VPS or container runtime using `node server.js`

**CI Pipeline:**
- Vercel GitHub Integration with automated preview and production deployment upon push to repository

## Environment Configuration

**Required env vars:**
- `PORT` - Port number for local Express server (defaults to `3000`)
- `JWT_SECRET` - Cryptographic signing secret for JWT tokens
- `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` - Supabase project endpoint
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role secret key
- `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public client key

**Secrets location:**
- Local: `.env` and `.env.local` files in repository root (ignored by `.gitignore`)
- Production: Vercel Project Environment Variables console

## Webhooks & Callbacks

**Incoming:**
- None detected (no third-party webhook receivers currently implemented)

**Outgoing:**
- None detected (no external notification or webhook dispatchers configured)

---

*Integration audit: 2026-10-28*
