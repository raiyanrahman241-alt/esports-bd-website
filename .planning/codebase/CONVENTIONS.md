# Coding Conventions

**Analysis Date:** 2026-10-28

## Naming Patterns

**Files:**
- Backend modules and servers use camelCase or kebab-case: `server.js`, `api/index.js`, `lib/supabase.js`, `lib/seedData.js`.
- Standalone HTML page entrypoints use lowercase kebab-case: `index.html`, `preview.html`, `newsroom.html`, `shop.html`.
- Frontend scripts and styles in `assets/` follow prefixed kebab-case describing capability or role: `assets/esbd-platform-3d.js`, `assets/esbd-platform-3d-upgraded.js`, `assets/esbd-platform-3d-preview.js`, `assets/esbd-connected-arena.js`, `assets/esbd-hero-upgrade.js`.
- Static image assets use lowercase kebab-case describing brand, event, game, or sponsor: `img/games/free-fire.png`, `img/clients/asus.png`, `img/events/valorant-cup-2024.jpg`.
- Scratch and test harness scripts use snake_case or descriptive action prefixes: `scratch/verify_platform.js`, `scratch/test_root.js`, `scratch/verify_local_cdp.js`.

**Functions:**
- Use camelCase for functions, methods, and route helpers: `authenticateUser`, `initHeroArenaCore`, `setupAmbientAtmosphere`, `latLonToVector3`, `createCurveArc`.
- Event and lifecycle hooks use descriptive verbs: `initThreeArenaCore`, `handleResize`, `openStreamModal`, `injectPortalEnhancements`.
- Async operations and API callers use action prefixes: `fetchLiveTournaments`, `submitResult`, `checkLocal`.

**Variables:**
- Local variables and parameters: Use camelCase: `canvas`, `container`, `globeGroup`, `authHeader`, `decodedUser`, `walletBalanceMinor`.
- Global constants and theme color tokens: Use SCREAMING_SNAKE_CASE: `COLOR_GREEN`, `COLOR_RED`, `COLOR_CYAN`, `COLOR_GOLD`, `GLOBE_RADIUS`, `JWT_SECRET`.
- CSS custom properties (variables): Use kebab-case with double-dash prefix: `--bg-primary`, `--bg-card`, `--border-glow`, `--accent-green`, `--font-display`.

**Types:**
- JavaScript / JSDoc conventions: JavaScript is untyped vanilla and CommonJS; data structures adhere to JSON schema contracts matching Supabase database tables (`users`, `tournaments`, `matches`, `registrations`, `walletTransactions`).
- Database entity keys are consistently camelCase in memory (`walletBalanceMinor`, `avatarUrl`, `roomCode`, `registeredAt`) and snake_case in PostgreSQL Supabase schema (`wallet_balance_minor`, `display_name`, `created_at`).

## Code Style

**Formatting:**
- Tool: Manual / IDE standard (no dedicated Prettier config present in repository).
- Indentation: 2 spaces across JavaScript, HTML, and CSS files.
- Quotes: Single quotes (`'...'`) in JavaScript source files (`assets/*.js`, `server.js`, `api/index.js`), double quotes in HTML attributes and JSON configs (`package.json`, `vercel.json`).
- Semicolons: Explicit semicolons used consistently at the end of statements.
- Line Width: Kept under 120 characters where possible, with chained method calls broken across indented lines.

**Linting:**
- Tool: No active ESLint configuration present in project root.
- Strict Mode: Browser runtime scripts enforce strict mode via `'use strict';` inside Immediately Invoked Function Expressions (IIFE).
- Idempotency Guards: Critical client scripts use window initialization shields (`window.__ESBD_PLATFORM_MASTER_INITIALIZED__ = true;`) to avoid duplicate execution.

## Import Organization

**Order:**
1. Core Node.js standard library modules (e.g., `path`, `fs`, `zlib`)
2. Third-party npm dependencies (e.g., `express`, `cors`, `jsonwebtoken`, `@supabase/supabase-js`, `dotenv`)
3. Internal local modules and configuration (e.g., `../lib/supabase`, `../lib/seedData`, `./api/index`)

Example from `api/index.js`:
```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { supabase, isSupabaseConfigured } = require('../lib/supabase');
const seed = require('../lib/seedData');
const path = require('path');
```

**Path Aliases:**
- Node.js backend uses relative CommonJS paths (`../lib/supabase`, `../lib/seedData`).
- Browser static files reference absolute root-relative paths (`/assets/...`, `/img/...`, `/favicon.png`). No TypeScript or bundler path aliases (e.g. `@/*`) are configured in the runtime.

## Error Handling

**Patterns:**
- API Controller Endpoints: Wrap route logic in `try...catch` blocks. Return structured JSON error objects with explicit HTTP status codes:
```javascript
router.post('/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Username/IGN/Email and Password are required." });
    }
    // ...
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
```
- Resilient Dual-Engine / Fallback Pattern: If cloud services (e.g., Supabase PostgreSQL) are unavailable, log a warning and fall back gracefully to the comprehensive local memory store (`lib/seedData.js`) without crashing the application:
```javascript
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, { ... });
    console.log('✅ Connected to live Supabase project:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Could not initialize live Supabase client, using fallback engine:', err.message);
  }
} else {
  console.log('ℹ️ Running in resilient fallback mode (Supabase URL/Key not configured yet). Using embedded Bangladesh Esports records.');
}
```
- Browser Graphics & WebGL Fallbacks: Three.js renderer initialization is wrapped in `try...catch` to handle systems without hardware WebGL acceleration gracefully:
```javascript
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
} catch (e) {
  console.warn('Hero globe WebGL fallback:', e);
  return;
}
```
- React DOM Crash Shield: In `index.html`, `Node.prototype.removeChild` and `insertBefore` are patched defensively to neutralize minified React error #321 or mismatched parent nodes during client hydration.

## Logging

**Framework:** Native `console` (`console.log`, `console.warn`, `console.error`).

**Patterns:**
- High-visibility server startup and status logs are prefixed with relevant emojis for fast visual log parsing:
  - `🎮 E-SPORTS BANGLADESH Server is running at http://localhost:3000`
  - `⚡ API endpoints live at http://localhost:3000/api`
  - `✅ Connected to live Supabase project`
  - `⚠️ Could not initialize live Supabase client`
  - `ℹ️ Running in resilient fallback mode`
- Client script logging is tagged with system names:
  - `console.error('[ESBD Connected Arena] Three.js library not detected.');`

## Comments

**When to Comment:**
- Section Header Banners: Used heavily across both CSS and JS to separate feature domains (e.g., `// 1. ARENA CORE`, `// 2. VOLUMETRIC ATMOSPHERE`, `// 3. AUTHENTICATION`).
- Asset Metadata: Header comment blocks in assets describe supported models, scene components, and coordinate calculations.
- Workarounds & Polyfills: Critical protective logic (e.g., DOM tree node removal shield in `index.html`) is commented explaining why the override is required.

**JSDoc/TSDoc:**
- Light usage for mathematical utilities and 3D coordinate converters:
```javascript
/**
 * Convert Lat/Lon to 3D Sphere Vector
 * @param {number} lat - Latitude in degrees
 * @param {number} lon - Longitude in degrees
 * @param {number} radius - Sphere radius in world units
 * @returns {THREE.Vector3}
 */
```

## Function Design

**Size:**
- Modular functions handling single tasks (coordinate conversion, geometry creation, atmosphere setup) range from 15 to 60 lines.
- Complex Three.js scene initialization procedures run 80–150 lines and isolate animation loops inside local `requestAnimationFrame` closures.

**Parameters:**
- Functions take 1–3 explicit positional parameters (`lat, lon, radius`) or destructure properties from request bodies (`const { ign, email, password } = req.body;`).
- Browser helper functions accept standard DOM elements or event objects.

**Return Values:**
- Express routes return express response objects (`return res.json(...)` or `return res.status(...).json(...)`).
- Graphic math functions return instantiated Three.js objects (`THREE.Vector3`, `THREE.QuadraticBezierCurve3`, `THREE.Mesh`).
- Token verifiers return the decoded user entity or `null` on failure.

## Module Design

**Exports:**
- CommonJS pattern in Node.js backend:
  - Single export: `module.exports = app;` in `server.js` and `api/index.js`.
  - Named exports dictionary: `module.exports = { supabase, isSupabaseConfigured };` in `lib/supabase.js`.
  - Large dataset dictionary export: `module.exports = { games, tournaments, stats, ... };` in `lib/seedData.js`.
- Client Scripts: Self-executing closures (IIFEs) attach necessary objects directly to `window` or operate on existing DOM hooks.

**Barrel Files:**
- Not used in the current architecture. Modules are imported directly from their respective source files.

---

*Convention analysis: 2026-10-28*
