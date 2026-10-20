/**
 * ESBD PREMIER 3D GAMING PLATFORM & ATMOSPHERE ENGINE
 * Complete Full-Page Dust, Stars, Animated 3D Graphic Bars & Gaming Objects
 */

(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.__ESBD_PLATFORM_3D_INITIALIZED__) return;
  window.__ESBD_PLATFORM_3D_INITIALIZED__ = true;

  // ===========================================================================
  // 1. INJECT VOLUMETRIC AMBIENT NEBULA GLOWS
  // ===========================================================================
  function setupAmbientNebula() {
    if (document.getElementById('esbd-ambient-nebula')) return;
    const nebula = document.createElement('div');
    nebula.id = 'esbd-ambient-nebula';
    nebula.className = 'esbd-ambient-nebula';
    nebula.innerHTML = `
      <div class="esbd-nebula-glow esbd-nebula-green"></div>
      <div class="esbd-nebula-glow esbd-nebula-red"></div>
      <div class="esbd-nebula-glow esbd-nebula-cyan"></div>
    `;
    document.body.prepend(nebula);
  }

  // ===========================================================================
  // 2. FULL-PAGE CONTINUOUS 3D BACKGROUND CANVAS (DUST, STARS, 3D CYBER GRID)
  // ===========================================================================
  function setupFullPageCanvas() {
    let canvas = document.getElementById('esbd-fullpage-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'esbd-fullpage-canvas';
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let scrollY = window.scrollY;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener(
      'pointermove',
      (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
      },
      { passive: true }
    );

    window.addEventListener(
      'scroll',
      () => {
        scrollY = window.scrollY;
      },
      { passive: true }
    );

    // Particle Palette
    const colors = [
      { r: 16, g: 185, b: 129 }, // Emerald Green
      { r: 16, g: 185, b: 129 }, // Emerald Green (weight)
      { r: 239, g: 68, b: 68 },  // Crimson Red
      { r: 56, g: 189, b: 248 },  // Cyan
      { r: 245, g: 158, b: 11 },  // Gold
    ];

    // Cosmic Dust Particles (High Density & Depth)
    const DUST_COUNT = Math.min(240, Math.floor(window.innerWidth / 6));
    const dustParticles = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2.8 + 0.6,
        radius: Math.random() * 2.2 + 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.25,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.45 - 0.15, // Gently drift upwards like cosmic gaming stardust
        pulseSpeed: Math.random() * 0.035 + 0.015,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Twinkling Diamond Stars
    const STAR_COUNT = Math.min(130, Math.floor(window.innerWidth / 11));
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3.2 + 1.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    function render() {
      time += 0.02;
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // --- 1. Draw 3D Perspective Cyber Horizon Grid at Bottom ---
      const horizonY = height * 0.65;
      const fov = 350;
      const gridSpacing = 48;
      const parallaxX = (mouseX / width - 0.5) * 60;

      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.055)';
      ctx.lineWidth = 1;

      // Vertical perspective lines converging to horizon
      const numLines = 26;
      for (let i = -numLines; i <= numLines; i++) {
        const xStart = width / 2 + parallaxX + i * 28;
        const xEnd = width / 2 + parallaxX + i * 160;
        ctx.beginPath();
        ctx.moveTo(xStart, horizonY);
        ctx.lineTo(xEnd, height);
        ctx.stroke();
      }

      // Horizontal receding lines
      for (let y = horizonY + 15; y < height; y += (height - y) * 0.22 + 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // --- 2. Draw Twinkling Diamond Stars ---
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const brightness = (Math.sin(time * s.twinkleSpeed * 60 + s.phase) + 1) * 0.5;
        const currentAlpha = 0.25 + brightness * 0.7;
        const currentSize = s.size * (0.8 + brightness * 0.4);

        // Parallax shift
        const px = (s.x + (mouseX - width / 2) * 0.015 + width) % width;
        const py = (s.y + (mouseY - height / 2) * 0.015 + height) % height;

        ctx.save();
        ctx.translate(px, py);
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha})`;
        ctx.shadowColor = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, 0.8)`;
        ctx.shadowBlur = 10;

        // 4-point diamond star
        ctx.beginPath();
        ctx.moveTo(0, -currentSize * 1.8);
        ctx.lineTo(currentSize * 0.6, 0);
        ctx.lineTo(0, currentSize * 1.8);
        ctx.lineTo(-currentSize * 0.6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // --- 3. Draw Cosmic Dust Particles ---
      for (let i = 0; i < dustParticles.length; i++) {
        const p = dustParticles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulse = (Math.sin(time * 3 + p.phase) + 1) * 0.5;
        const alpha = p.alpha * (0.6 + pulse * 0.4);

        // Z-depth parallax calculation
        const px = (p.x + (mouseX - width / 2) * 0.025 * p.z + width) % width;
        const py = (p.y + (mouseY - height / 2) * 0.025 * p.z + height) % height;

        ctx.beginPath();
        ctx.arc(px, py, p.radius * p.z * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.7)`;
        ctx.shadowBlur = 8 * p.z;
        ctx.fill();
      }

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  // ===========================================================================
  // 3. ANIMATED 3D GRAPHIC BARS & PLATFORM FRAMES FOR ALL SECTIONS
  // ===========================================================================
  const SECTION_TITLES = [
    { key: 'tournament', label: 'THE ARENA // LIVE & OPEN TOURNAMENTS', code: 'BRACKET_V4.2' },
    { key: 'leaderboard', label: 'GLOBAL RANKINGS // VERIFIED CHAMPIONS', code: 'RANK_SYS_LIVE' },
    { key: 'who we are', label: 'OPERATIONS // LAN & ESPORTS PRODUCTION', code: 'ESBD_CORE_14Y' },
    { key: 'how it works', label: 'SYSTEM PIPELINE // ENTRY TO PAYOUT', code: 'SECURE_ESCROW' },
    { key: 'creator', label: 'CREATOR ROSTER // 30M+ AUDIENCE NETWORK', code: 'BROADCAST_NODE' },
    { key: 'sponsor', label: 'PARTNER NETWORK // BRAND INTEGRATION', code: 'SPONSOR_DECK' },
    { key: 'numbers', label: 'EXECUTION METRICS // 1200+ EVENTS', code: 'TELEMETRY_LOG' },
    { key: 'news', label: 'ESBD NEWSROOM // PATCH NOTES & ANNOUNCEMENTS', code: 'DISPATCH_FEED' },
    { key: 'shop', label: 'PRO GEAR SHOP // TOURNAMENT HARDWARE', code: 'SHOP_CATALOG' },
    { key: 'communities', label: 'COMMUNITY HUBS // VERIFIED REGIONAL CLANS', code: 'CLAN_NET' },
  ];

  function getSectionTelemetry(sec, index) {
    const text = (sec.textContent || '').toLowerCase();
    for (const item of SECTION_TITLES) {
      if (text.includes(item.key)) {
        return { label: item.label, code: item.code };
      }
    }
    return {
      label: `ARENA PLATFORM // ZONE ${String(index + 1).padStart(2, '0')}`,
      code: `SYS_144HZ_OK`,
    };
  }

  function decorateSectionAsGamingPlatform(sec, index) {
    if (sec.dataset.esbdDecorated === 'true') return;
    sec.dataset.esbdDecorated = 'true';

    // Target content wrapper or section for tight gaming platform frame
    const target = sec.querySelector(':scope > div.mx-auto, :scope > div.max-w-\\[1280px\\]') || sec;
    target.classList.add('esbd-platform-frame');

    const telemetry = getSectionTelemetry(sec, index);

    // --- Top 3D Graphic Bar ---
    const topBar = document.createElement('div');
    topBar.className = 'esbd-graphic-bar-top';
    topBar.innerHTML = `
      <div class="esbd-laser-runner"></div>
      <div class="esbd-bar-telemetry-left">
        <span class="esbd-bar-dot"></span>
        <span>${telemetry.label}</span>
      </div>
      <div class="esbd-eq-visualizer">
        <span class="esbd-eq-bar"></span>
        <span class="esbd-eq-bar"></span>
        <span class="esbd-eq-bar"></span>
        <span class="esbd-eq-bar"></span>
        <span class="esbd-eq-bar"></span>
        <span class="esbd-eq-bar"></span>
      </div>
      <div class="esbd-bar-telemetry-right">
        <span>[${telemetry.code}]</span>
        <span class="esbd-bar-dot" style="background:#ef4444; box-shadow:0 0 8px #ef4444;"></span>
      </div>
    `;

    // --- Bottom 3D Graphic Bar ---
    const bottomBar = document.createElement('div');
    bottomBar.className = 'esbd-graphic-bar-bottom';
    bottomBar.innerHTML = `
      <div class="esbd-laser-runner"></div>
      <div class="esbd-bar-telemetry-left" style="color:#6e7681; font-size:0.65rem;">
        <span>// ANTI-CHEAT ACTIVE</span>
        <span style="color:#10b981;">• SERVER-SIDE ARBITRATION</span>
      </div>
      <div style="font-family:'Oxanium',sans-serif; font-size:0.7rem; font-weight:700; color:#10b981; letter-spacing:2px;">
        ▲ ESBD PLATFORM ▲
      </div>
      <div class="esbd-bar-telemetry-right" style="color:#6e7681; font-size:0.65rem;">
        <span>PING: 12ms // DHAKA HUB</span>
      </div>
    `;

    // --- High-Tech 3D Corner Brackets ---
    const bTL = document.createElement('div');
    bTL.className = 'esbd-bracket-3d esbd-bracket-tl';
    const bTR = document.createElement('div');
    bTR.className = 'esbd-bracket-3d esbd-bracket-tr';
    const bBL = document.createElement('div');
    bBL.className = 'esbd-bracket-3d esbd-bracket-bl';
    const bBR = document.createElement('div');
    bBR.className = 'esbd-bracket-3d esbd-bracket-br';

    // --- Side Rails ---
    const railL = document.createElement('div');
    railL.className = 'esbd-platform-rail-left';
    const railR = document.createElement('div');
    railR.className = 'esbd-platform-rail-right';

    // Prepend top bar, corner brackets and append bottom bar
    target.insertBefore(topBar, target.firstChild);
    target.appendChild(bottomBar);
    target.appendChild(bTL);
    target.appendChild(bTR);
    target.appendChild(bBL);
    target.appendChild(bBR);
    target.appendChild(railL);
    target.appendChild(railR);

    // --- Inject Floating 3D Gaming Object for Key Sections ---
    inject3DGamingObject(target, index);
  }

  // ===========================================================================
  // 4. INJECT 3D GAMING OBJECTS (CONTROLLER, TROPHY, CORE, RETICLE)
  // ===========================================================================
  function inject3DGamingObject(sec, index) {
    const text = (sec.textContent || '').toLowerCase();
    let objectMarkup = '';
    let style = 'right: 20px; top: -35px;';

    if (text.includes('live and open tournaments') || index === 1) {
      // 3D Controller beside Tournaments
      style = 'right: 18px; top: -35px;';
      objectMarkup = `
        <div class="esbd-3d-controller" title="ESBD Tournament Controller">
          <div class="esbd-controller-body"></div>
          <div class="esbd-controller-dpad"></div>
          <div class="esbd-controller-btns">
            <span class="esbd-controller-btn btn-y"></span>
            <span class="esbd-controller-btn btn-b"></span>
            <span class="esbd-controller-btn btn-a"></span>
            <span class="esbd-controller-btn btn-x"></span>
          </div>
          <div class="esbd-controller-stick-left"></div>
          <div class="esbd-controller-stick-right"></div>
          <div class="esbd-controller-gem"></div>
        </div>
      `;
    } else if (text.includes('ranking') || text.includes('by the numbers') || index === 2) {
      // 3D Championship Trophy
      style = 'left: 20px; top: -45px;';
      objectMarkup = `
        <div class="esbd-3d-trophy" title="ESBD Championship Trophy">
          <div class="esbd-trophy-cup"></div>
          <div class="esbd-trophy-handle-left"></div>
          <div class="esbd-trophy-handle-right"></div>
          <div class="esbd-trophy-stem"></div>
          <div class="esbd-trophy-base"></div>
          <div class="esbd-trophy-ring"></div>
        </div>
      `;
    } else if (text.includes('excel') || text.includes('operations') || index === 4) {
      // 3D Cyber Polyhedron / Energy Core
      style = 'right: 25px; top: -35px;';
      objectMarkup = `
        <div class="esbd-3d-polyhedron" title="ESBD Quantum Core">
          <div class="esbd-poly-face esbd-poly-f1"></div>
          <div class="esbd-poly-face esbd-poly-f2"></div>
          <div class="esbd-poly-face esbd-poly-f3"></div>
          <div class="esbd-poly-face esbd-poly-f4"></div>
          <div class="esbd-poly-face esbd-poly-f5"></div>
          <div class="esbd-poly-face esbd-poly-f6"></div>
          <div class="esbd-poly-core"></div>
        </div>
      `;
    } else if (text.includes('creator') || text.includes('roster') || index === 6) {
      // 3D Tactical Holo-Reticle
      style = 'left: 22px; top: -35px;';
      objectMarkup = `
        <div class="esbd-3d-reticle" title="ESBD Targeting Array">
          <div class="esbd-reticle-inner"></div>
          <div class="esbd-reticle-cross"></div>
        </div>
      `;
    }

    if (objectMarkup) {
      const wrap = document.createElement('div');
      wrap.className = 'esbd-3d-object-wrap';
      wrap.style.cssText = style;
      wrap.innerHTML = objectMarkup;
      sec.appendChild(wrap);
    }
  }

  // ===========================================================================
  // 5. OBSERVER & ROUTE LISTENER FOR COMPLETE COVERAGE
  // ===========================================================================
  function scanAndDecorateSections() {
    // Target all semantic sections and platform containers
    const sections = document.querySelectorAll(
      '#root section, main section, .shop-section, .news-section, section'
    );
    sections.forEach((sec, idx) => {
      // Skip very small containers or utility rows
      if (sec.offsetHeight < 60 && sec.childNodes.length < 2) return;
      // Skip top hero if it's the 100vh hero itself to keep 3D globe unobstructed
      if (sec.classList.contains('min-h-[100svh]') && idx === 0) return;

      decorateSectionAsGamingPlatform(sec, idx);
    });
  }

  function init() {
    setupAmbientNebula();
    setupFullPageCanvas();

    // Initial scan
    scanAndDecorateSections();

    // Re-scan when React re-renders or changes routes
    const observer = new MutationObserver(() => {
      scanAndDecorateSections();
    });

    const root = document.getElementById('root') || document.body;
    observer.observe(root, { childList: true, subtree: true });

    // Additional periodic check to ensure dynamically fetched tourneys/results get framed
    setInterval(scanAndDecorateSections, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
