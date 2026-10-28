# Testing Patterns

**Analysis Date:** 2026-10-28

## Test Framework

**Runner:**
- No formal test framework (such as Jest, Mocha, or Vitest) is installed or defined in `package.json`.
- Automated and semi-automated tests run as standalone Node.js verification scripts located in `scratch/`.
- Config: None (`package.json` scripts currently provide only `"dev": "node server.js"`, `"start": "node server.js"`, and `"build": "echo \"Build ready.\""`).

**Assertion Library:**
- Native console evaluation (`console.log`) and boolean conditional checks.
- Browser evaluation expressions via Chrome DevTools Protocol (CDP) WebSocket inspection.

**Run Commands:**
```bash
# Start backend server before running verification scripts
node server.js                                 # Server starts on http://localhost:3000

# Execute backend API platform smoke tests
node scratch/verify_platform.js                # Verifies live streams, chat, matches, admin overview

# Execute browser & DOM verification via CDP (requires Chrome running with --remote-debugging-port=9222)
node scratch/verify_local_cdp.js               # Verifies canvas, HUD reticles, 3D elements, graphic bars
node scratch/verify_subpages_cdp.js            # Validates newsroom.html and shop.html routing and UI

# Verify live deployment endpoints
node scratch/verify_live.js                    # Checks live production deployment responses
```

## Test File Organization

**Location:**
- Separate test and verification harness scripts reside in `scratch/`.
- No tests are co-located in `src/`, `api/`, or `assets/`.

**Naming:**
- Verification scripts: `verify_<feature>.js` (e.g., `scratch/verify_platform.js`, `scratch/verify_local_cdp.js`, `scratch/verify_official_live.js`).
- CDP / Inspection scripts: `test_<feature>.js` (e.g., `scratch/test_root.js`, `scratch/test_navigation.js`, `scratch/test_cdp.js`).
- Smoke / Component checks: `check_<component>.js` (e.g., `scratch/check_html.js`, `scratch/check_bundle.js`).

**Structure:**
```
scratch/
├── verify_platform.js         # API integration verification (Streams, Chat, Matches, Admin)
├── verify_local_cdp.js        # Local CDP DOM and Three.js canvas inspection
├── verify_subpages_cdp.js     # Newsroom & Shop subpage CDP verification
├── verify_live_final.js       # Production deployment smoke test
├── test_root.js               # Root route load event & script tag verification
├── test_navigation.js         # Navigation link routing verification
├── test_cdp.js                # Low-level Chrome DevTools WebSocket connection test
└── test.js                    # Image decoding & color channel sampling tests
```

## Test Structure

**Suite Organization:**
Test scripts are written as top-level asynchronous execution functions with self-invoking or trailing calls.

Pattern from `scratch/verify_platform.js`:
```javascript
async function verifyPlatform() {
  const base = 'http://localhost:3000';

  console.log('--- 1. Testing Backend Platform APIs ---');
  const resStreams = await fetch(base + '/api/streams').then(r => r.json());
  console.log('Streams API count:', resStreams.length, 'first title:', resStreams[0]?.title);

  const resChat = await fetch(base + '/api/chat/messages?channel=tournament-live').then(r => r.json());
  console.log('Chat API count:', resChat.length, 'first message:', resChat[0]?.text);

  const sendChatRes = await fetch(base + '/api/chat/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel: 'tournament-live',
      user: 'TestGamer',
      text: 'Testing live chat broadcast!',
      role: 'pro',
      badge: '⚡ PRO'
    })
  }).then(r => r.json());
  console.log('Chat send test result:', sendChatRes.success);

  console.log('\n--- 2. Checking HTML Markup Elements ---');
  const html = await fetch(base + '/').then(r => r.text());
  console.log('Has particle bg:', html.includes('id="esbd-cyber-bg"'));
  console.log('Has spotlight:', html.includes('id="esbd-spotlight"'));
}

verifyPlatform();
```

**Patterns:**
- Setup pattern: Resolve debugger tab via `http://localhost:9222/json` or bind `fetch` to local base URL (`http://localhost:3000`).
- Teardown pattern: Close WebSocket connections (`ws.close()`) and terminate Node process with explicit exit code (`process.exit(0)`).
- Assertion pattern: Compare received object attributes or verify string inclusions against expected DOM markers.

## Mocking

**Framework:** None. No mocking libraries (e.g., Sinons or Jest mocks) are currently used.

**Patterns:**
- Embedded In-Memory State: `api/index.js` implements an embedded `memoryStore` object initialized with mock fixtures from `lib/seedData.js`.
- Fallback Mode: When external database keys (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are omitted, the API automatically falls back to mutating and reading from `memoryStore`, effectively simulating database persistence for tests and local development.

```javascript
// api/index.js in-memory mock fallback structure:
const memoryStore = {
  users: [...],
  passwords: {...},
  tournaments: JSON.parse(JSON.stringify(seed.tournaments)),
  games: JSON.parse(JSON.stringify(seed.games)),
  stats: { ...seed.stats },
  // ...
};
```

**What to Mock:**
- External third-party payment gateways (bKash, Nagad) or cloud authentication callbacks.
- Live database connection pools when executing offline smoke tests.

**What NOT to Mock:**
- Express route dispatching and middleware chains.
- Three.js WebGL canvas element bindings and DOM container layout measurements.

## Fixtures and Factories

**Test Data:**
- Comprehensive, high-fidelity Bangladesh esports dataset defined in `lib/seedData.js`.
- Contains full mock entities for:
  - `games`: 8 national esports game titles (Free Fire, PUBG Mobile, Valorant, CS2, etc.).
  - `tournaments`: Active, upcoming, and completed tournaments with prize pools in BDT (৳).
  - `stats`: Overall player, tournament, and prize pool metrics.
  - `influencers`: Verified creators and casters.
  - `clients`: Hardware partners (Asus, Gigabyte, MSI, Thermaltake, UCC, ViewSonic, Zotac).
  - `staff`: Executive and operations personnel.
  - `products`: Official tournament-approved merchandise and clan battle bundles.

**Location:**
- Primary fixtures: `lib/seedData.js`.
- Default memory users and credentials: `api/index.js` (lines 28–64).

## Coverage

**Requirements:** None enforced. No code coverage threshold is defined in project tooling.

**View Coverage:**
```bash
# Not configured. To enable coverage in future phases:
# npm install -D vitest @vitest/coverage-v8
# npx vitest run --coverage
```

## Test Types

**Unit Tests:**
- Not implemented in current codebase. Mathematical calculations (e.g., `latLonToVector3` in `assets/esbd-connected-arena.js`) are tested implicitly during 3D scene execution.

**Integration Tests:**
- Scripted via Node.js scripts in `scratch/verify_platform.js`.
- Directly tests Express route handlers over HTTP (`/api/streams`, `/api/chat/send`, `/api/matches/results`, `/api/matches/submit-result`).

**E2E Tests:**
- Browser automation is implemented using Chrome DevTools Protocol (CDP) WebSocket commands rather than Playwright/Cypress.
- Pattern from `scratch/verify_local_cdp.js`:
```javascript
// Connects to Chrome debugging port
const tabs = await fetch('http://localhost:9222/json').then(r => r.json());
const tab = tabs.find(t => t.url.includes('localhost'));
const ws = new WebSocket(tab.webSocketDebuggerUrl);

// Navigates and evaluates live DOM in the actual browser session
await send('Page.navigate', { url: 'http://localhost:3000/#/' });
const evalRes = await send('Runtime.evaluate', {
  expression: `({
    canvasExists: !!document.getElementById('esbd-fullpage-canvas'),
    topBars: document.querySelectorAll('.esbd-graphic-bar-top').length,
    trophies: document.querySelectorAll('.esbd-3d-trophy').length
  })`,
  returnByValue: true
});
```

## Common Patterns

**Async Testing:**
Promises and `await` with timeouts are used to allow asynchronous DOM renders, Three.js canvas setup, and network fetch cycles to settle before verification:
```javascript
await send('Page.navigate', { url: 'http://localhost:3000/#/' });
await new Promise(r => setTimeout(r, 3500)); // Allow 3D canvas and WebGL shaders to initialize
```

**Error Testing:**
Responses are verified for status code headers and expected error message formats:
```javascript
const res = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identifier: 'unknown_user', password: 'wrong' })
});
console.log('Status is 401:', res.status === 401);
```

---

*Testing analysis: 2026-10-28*
