/**
 * E-SPORTS BANGLADESH (ESBD) — PREMIER 3D GAMING PLATFORM & ATMOSPHERE ENGINE
 * Full-Page Persistent 3D Arena Core, 3D Animated Bar System, 3D Scroll Perspective & Tilt
 */

(function () {
  'use strict';

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
  // 2. FULL-PAGE PERSISTENT 3D THREE.JS ARENA CORE & COSMIC ENVIRONMENT
  // ===========================================================================
  let threeRenderer = null;
  let arenaGroup = null;
  let innerCoreMesh = null;
  let innerCoreLines = null;
  let outerSphereLines = null;
  let orbitalRings = [];
  let orbitalNodes = [];
  let starPoints = null;
  let cyberGridGroup = null;
  let threeCamera = null;
  let threeScene = null;

  // Inertia and motion state
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = window.scrollY || 0;
  let targetScrollY = scrollY;
  let scrollVelocity = 0;
  let lastScrollY = scrollY;

  function initThreeArenaCore() {
    if (!window.THREE) {
      console.warn('[ESBD 3D] Three.js not loaded, loading fallback...');
      setupFallbackCanvas();
      return;
    }

    if (document.getElementById('esbd-three-arena-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'esbd-three-arena-canvas';
    document.body.prepend(canvas);

    const THREE = window.THREE;

    // Palette (Neon Emerald Green, Crimson Red, Cyan, Gold)
    const colorGreen = new THREE.Color('#10b981');
    const colorRed = new THREE.Color('#ef4444');
    const colorCyan = new THREE.Color('#38bdf8');
    const colorGold = new THREE.Color('#f59e0b');

    // 1. Scene & Camera
    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    threeCamera.position.set(0, 0, 9.2);

    // 2. WebGL Renderer
    try {
      threeRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      threeRenderer.setClearColor(0x000000, 0);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      threeRenderer.setSize(window.innerWidth, window.innerHeight);
    } catch (e) {
      console.warn('[ESBD 3D] WebGL init failed:', e);
      setupFallbackCanvas();
      return;
    }

    // 3. Main Arena 3D Group
    arenaGroup = new THREE.Group();
    threeScene.add(arenaGroup);

    // Initial position aligned to top hero (right-hand side)
    arenaGroup.position.set(2.4, 0.25, 0);

    // --- Outer Emerald Green Wireframe Sphere (Icosahedron) ---
    const outerGeo = new THREE.IcosahedronGeometry(2.7, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: colorGreen,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    arenaGroup.add(outerMesh);

    // Crisper outer line segments
    const wireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.7, 1));
    outerSphereLines = new THREE.LineSegments(
      wireGeo,
      new THREE.LineBasicMaterial({
        color: colorGreen,
        transparent: true,
        opacity: 0.65,
      })
    );
    arenaGroup.add(outerSphereLines);

    // --- Inner Crimson Red Energy Core ---
    const innerGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: colorRed,
      wireframe: false,
      transparent: true,
      opacity: 0.25,
    });
    innerCoreMesh = new THREE.Mesh(innerGeo, innerMat);
    arenaGroup.add(innerCoreMesh);

    const innerWireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.15, 1));
    innerCoreLines = new THREE.LineSegments(
      innerWireGeo,
      new THREE.LineBasicMaterial({
        color: colorRed,
        transparent: true,
        opacity: 0.9,
      })
    );
    arenaGroup.add(innerCoreLines);

    // --- 3 3D Orbital Rings (Torus) ---
    orbitalRings = [];
    const ringConfigs = [
      { radius: 3.6, tube: 0.014, color: colorGreen, opacity: 0.7, rx: Math.PI / 2.2, rz: 0 },
      { radius: 4.4, tube: 0.010, color: colorCyan, opacity: 0.5, rx: Math.PI / 1.7, rz: Math.PI / 5 },
      { radius: 3.1, tube: 0.009, color: colorRed, opacity: 0.55, rx: Math.PI / 2.6, rz: -Math.PI / 4 },
    ];

    ringConfigs.forEach((cfg) => {
      const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 8, 160);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.set(cfg.rx, 0, cfg.rz);
      orbitalRings.push(ringMesh);
      arenaGroup.add(ringMesh);
    });

    // --- 8 Orbiting Glowing Nodes / Spheres ---
    orbitalNodes = [];
    for (let i = 0; i < 8; i++) {
      const isRed = i % 3 === 0;
      const nodeGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: isRed ? colorRed : colorGreen,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      const radius = 3.2 + (i % 3) * 0.65;
      const speed = 0.2 + (i % 4) * 0.06;
      const phase = (i / 8) * Math.PI * 2;
      const tilt = (i % 2 ? 1 : -1) * (0.35 + i * 0.1);
      orbitalNodes.push({ mesh: nodeMesh, radius, speed, phase, tilt });
      arenaGroup.add(nodeMesh);
    }

    // --- 3D Cosmic Particle Starfield (1,200 points with depth) ---
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const dist = 5.5 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = dist * Math.cos(phi) * 0.6;
      starPositions[i * 3 + 2] = dist * Math.sin(phi) * Math.sin(theta);

      const rnd = Math.random();
      let c = colorGreen;
      if (rnd < 0.2) c = colorRed;
      else if (rnd < 0.45) c = colorCyan;
      else if (rnd < 0.6) c = colorGold;

      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    starPoints = new THREE.Points(starGeo, starMat);
    threeScene.add(starPoints);

    // --- 3D Receding Horizon Cyber Grid ---
    cyberGridGroup = new THREE.Group();
    const gridHelper = new THREE.GridHelper(50, 40, 0x10b981, 0x059669);
    gridHelper.position.set(0, -3.8, 0);
    gridHelper.material.opacity = 0.18;
    gridHelper.material.transparent = true;
    cyberGridGroup.add(gridHelper);
    threeScene.add(cyberGridGroup);

    // Event Listeners
    window.addEventListener('resize', onThreeResize);
    window.addEventListener(
      'pointermove',
      (e) => {
        mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 0.8;
        mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
      },
      { passive: true }
    );

    window.addEventListener(
      'scroll',
      () => {
        targetScrollY = window.scrollY || 0;
      },
      { passive: true }
    );

    // Start 3D Render Loop
    requestAnimationFrame(renderThreeArena);
  }

  function onThreeResize() {
    if (!threeRenderer || !threeCamera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    threeCamera.aspect = w / h;
    threeCamera.fov = w < 768 ? 56 : 42;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(w, h);
  }

  let clock = 0;
  function renderThreeArena() {
    requestAnimationFrame(renderThreeArena);
    if (!threeRenderer || !threeScene || !threeCamera) return;

    clock += 0.016;

    // Smooth mouse inertia
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Smooth scroll interpolation & velocity
    scrollVelocity = targetScrollY - scrollY;
    scrollY += scrollVelocity * 0.08;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
    const scrollProgress = Math.min(1, Math.max(0, scrollY / docHeight));

    // Dynamic 3D Position Path across the Page as user scrolls
    // 0% (Hero): x: 2.4, y: 0.25 (right side)
    // 25% (Tournaments): x: -2.2, y: -0.3 (glides to left)
    // 50% (Leaderboards/Stats): x: 2.2, y: 0.45 (glides to right)
    // 75% (Communities/Creators): x: -2.0, y: 0.1
    // 100% (News/Shop/Footer): x: 0, y: -0.4, z: -0.8 (grand center)
    const p = scrollProgress;
    let targetX, targetY, targetZ;

    if (p < 0.25) {
      const t = p / 0.25;
      targetX = 2.4 + (-2.2 - 2.4) * t;
      targetY = 0.25 + (-0.3 - 0.25) * t;
      targetZ = 0 + 0.4 * t;
    } else if (p < 0.5) {
      const t = (p - 0.25) / 0.25;
      targetX = -2.2 + (2.2 - -2.2) * t;
      targetY = -0.3 + (0.45 - -0.3) * t;
      targetZ = 0.4 + (-0.3 - 0.4) * t;
    } else if (p < 0.75) {
      const t = (p - 0.5) / 0.25;
      targetX = 2.2 + (-2.0 - 2.2) * t;
      targetY = 0.45 + (0.1 - 0.45) * t;
      targetZ = -0.3 + (0.3 - -0.3) * t;
    } else {
      const t = (p - 0.75) / 0.25;
      targetX = -2.0 + (0 - -2.0) * t;
      targetY = 0.1 + (-0.4 - 0.1) * t;
      targetZ = 0.3 + (-0.9 - 0.3) * t;
    }

    if (arenaGroup) {
      // Smooth glide to scroll position
      arenaGroup.position.x += (targetX - arenaGroup.position.x) * 0.06;
      arenaGroup.position.y += (targetY - arenaGroup.position.y) * 0.06;
      arenaGroup.position.z += (targetZ - arenaGroup.position.z) * 0.06;

      // 3D Rotation driven by constant clock + scroll momentum + mouse parallax
      const scrollRotDelta = scrollVelocity * 0.0018;
      arenaGroup.rotation.y = clock * 0.14 + mouse.x + scrollY * 0.0012;
      arenaGroup.rotation.x = Math.sin(clock * 0.25) * 0.08 + mouse.y + scrollRotDelta;

      // Core pulsing
      if (innerCoreMesh && innerCoreLines) {
        const pulse = 1 + Math.sin(clock * 1.8) * 0.065;
        innerCoreMesh.scale.setScalar(pulse);
        innerCoreLines.scale.setScalar(pulse);
        innerCoreMesh.rotation.y = clock * 0.45;
        innerCoreMesh.rotation.x = clock * 0.3;
        innerCoreLines.rotation.copy(innerCoreMesh.rotation);
      }

      // Orbital rings rotation
      orbitalRings.forEach((ring, idx) => {
        ring.rotation.z += 0.002 * (idx + 1);
        ring.rotation.x += 0.0008 * (idx % 2 ? 1 : -1);
      });

      // Orbital nodes revolution
      orbitalNodes.forEach((node) => {
        const nt = node.phase + clock * node.speed;
        node.mesh.position.set(
          Math.cos(nt) * node.radius,
          Math.sin(nt * 1.3) * node.tilt,
          Math.sin(nt) * node.radius
        );
      });
    }

    // Starfield subtle cosmic drift
    if (starPoints) {
      starPoints.rotation.y = clock * 0.02 + mouse.x * 0.3;
      starPoints.rotation.x = Math.sin(clock * 0.1) * 0.04 + mouse.y * 0.2;
    }

    // Perspective Cyber Grid Parallax
    if (cyberGridGroup) {
      cyberGridGroup.position.x = mouse.x * 1.5;
      cyberGridGroup.position.z = (scrollY * 0.005) % 2.5;
    }

    threeRenderer.render(threeScene, threeCamera);
  }

  // Fallback 2D Canvas if WebGL is unavailable
  function setupFallbackCanvas() {
    if (document.getElementById('esbd-fallback-canvas')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'esbd-fallback-canvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;mix-blend-mode:screen;opacity:0.85;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.4 - 0.1,
        color: Math.random() < 0.25 ? '#ef4444' : '#10b981',
      });
    }

    function render2D() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      requestAnimationFrame(render2D);
    }
    requestAnimationFrame(render2D);
  }

  // ===========================================================================
  // 3. 3D ANIMATED BAR SYSTEM (EXACT REPLICA OF USER SCREENSHOT 1)
  // ===========================================================================
  function create3DAnimatedBar(options = {}) {
    const telemetry = options.telemetry || 'ESBD CORE PLATFORM // TOURNAMENTS LIVE';
    const code = options.code || 'SYS_144HZ_ACTIVE';
    const status = options.status || 'ANTI-CHEAT: ONLINE • ARBITRATION ACTIVE';

    const bar = document.createElement('div');
    bar.className = 'esbd-3d-animated-bar esbd-scroll-reveal-3d';
    bar.innerHTML = `
      <div class="esbd-3d-laser-runner"></div>
      <div class="esbd-bar-telemetry-left">
        <span class="esbd-bar-dot"></span>
        <span>${telemetry}</span>
      </div>
      <div class="esbd-bar-center-brand">
        <div class="esbd-eq-visualizer">
          <span class="esbd-eq-bar"></span>
          <span class="esbd-eq-bar"></span>
          <span class="esbd-eq-bar"></span>
        </div>
        <span>▲ E-SPORTS BANGLADESH ▲</span>
        <div class="esbd-eq-visualizer">
          <span class="esbd-eq-bar"></span>
          <span class="esbd-eq-bar"></span>
          <span class="esbd-eq-bar"></span>
        </div>
      </div>
      <div class="esbd-bar-telemetry-right">
        <span>${status}</span>
        <span class="esbd-bar-dot esbd-bar-dot-red"></span>
      </div>
    `;
    return bar;
  }

  function create3DLaserDivider() {
    const divider = document.createElement('div');
    divider.className = 'esbd-3d-laser-divider esbd-scroll-reveal-3d';
    divider.innerHTML = `<div class="esbd-3d-laser-divider-line"></div>`;
    return divider;
  }

  // Inject 3D Animated Bars in key strategic locations across the page
  function inject3DAnimatedBars() {
    // 1. Below Hero section (Prominent grand 3D animated bar)
    const heroSection = document.querySelector('section.min-h-\\[100svh\\], #root section:first-of-type');
    if (heroSection && !document.getElementById('esbd-hero-bar')) {
      const heroBar = create3DAnimatedBar({
        telemetry: 'NATIONAL ESPORTS HUB // DHAKA 128-TICK',
        code: 'CORE_ONLINE',
        status: 'VERIFIED PRIZE POOLS • INSTANT ESCROW',
      });
      heroBar.id = 'esbd-hero-bar';
      heroSection.parentNode.insertBefore(heroBar, heroSection.nextSibling);
    }

    // 2. Subpages Hero Bar (newsroom and shop)
    const subpageHeader = document.querySelector('.news-header, .shop-header, .page-header');
    if (subpageHeader && !document.getElementById('esbd-subpage-bar')) {
      const isShop = window.location.pathname.includes('shop');
      const subBar = create3DAnimatedBar({
        telemetry: isShop ? 'OFFICIAL PRO GEAR SHOP // HARDWARE DECK' : 'ESBD NEWSROOM // PATCH NOTES & ROSTERS',
        code: isShop ? 'GEAR_VERIFIED' : 'PRESS_NODE',
        status: isShop ? 'AUTHENTIC HARDWARE • 2-YR WARRANTY' : 'LIVE JOURNALISM • 24/7 DISPATCH',
      });
      subBar.id = 'esbd-subpage-bar';
      subpageHeader.parentNode.insertBefore(subBar, subpageHeader.nextSibling);
    }

    // 3. Frame Major Content Sections
    const sections = document.querySelectorAll(
      '#root section, main section, .shop-section, .news-section'
    );

    sections.forEach((sec, idx) => {
      if (sec.dataset.esbdBarsInjected === 'true') return;
      sec.dataset.esbdBarsInjected = 'true';

      // Skip hero or partner ticker to avoid stacking
      if (idx === 0 && sec.classList.contains('min-h-[100svh]')) return;
      if (sec.classList.contains('esbd-sponsor-billboard') || sec.offsetHeight < 120) return;

      const target = sec.querySelector(':scope > div.mx-auto, :scope > div.max-w-\\[1280px\\]') || sec;
      target.classList.add('esbd-platform-frame');

      // Add Corner Brackets
      const bTL = document.createElement('div');
      bTL.className = 'esbd-corner-bracket esbd-bracket-tl';
      const bTR = document.createElement('div');
      bTR.className = 'esbd-corner-bracket esbd-bracket-tr';
      const bBL = document.createElement('div');
      bBL.className = 'esbd-corner-bracket esbd-bracket-bl';
      const bBR = document.createElement('div');
      bBR.className = 'esbd-corner-bracket esbd-bracket-br';
      target.appendChild(bTL);
      target.appendChild(bTR);
      target.appendChild(bBL);
      target.appendChild(bBR);

      // Add Side Rails
      const railL = document.createElement('div');
      railL.className = 'esbd-platform-rail-left';
      const railR = document.createElement('div');
      railR.className = 'esbd-platform-rail-right';
      target.appendChild(railL);
      target.appendChild(railR);

      // Section-specific top bar with custom telemetry
      const text = (sec.textContent || '').toLowerCase();
      let label = 'ARENA ZONE // ' + String(idx).padStart(2, '0');
      let status = 'SERVER-SIDE ARBITRATION ACTIVE';

      if (text.includes('tournament')) {
        label = 'THE ARENA // LIVE & OPEN TOURNAMENTS';
        status = 'SLOTS CLOSING • SERVER-VERIFIED';
      } else if (text.includes('ranking') || text.includes('leaderboard')) {
        label = 'GLOBAL RANKINGS // VERIFIED CHAMPIONS';
        status = 'PRO LEAGUE POINTS UPDATED';
      } else if (text.includes('who we are') || text.includes('dominate') || text.includes('operator')) {
        label = 'OPERATIONS // LAN & ESPORTS PRODUCTION';
        status = '15+ YEARS • 1200+ EVENTS DELIVERED';
      } else if (text.includes('creator') || text.includes('influencer')) {
        label = 'CREATOR ROSTER // 30M+ AUDIENCE NETWORK';
        status = 'OFFICIAL PARTNER TALENT';
      } else if (text.includes('community') || text.includes('clan')) {
        label = 'COMMUNITY HUBS // VERIFIED CLANS';
        status = 'REGIONAL ROSTERS ACTIVE';
      } else if (text.includes('how it works') || text.includes('pipeline')) {
        label = 'SYSTEM PIPELINE // ENTRY TO PAYOUT';
        status = 'INSTANT ESCROW VERIFICATION';
      }

      const topBar = document.createElement('div');
      topBar.className = 'esbd-graphic-bar-top';
      topBar.innerHTML = `
        <div class="esbd-3d-laser-runner"></div>
        <div class="esbd-bar-telemetry-left">
          <span class="esbd-bar-dot"></span>
          <span>${label}</span>
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
          <span>${status}</span>
          <span class="esbd-bar-dot esbd-bar-dot-red"></span>
        </div>
      `;

      target.insertBefore(topBar, target.firstChild);
    });
  }

  // ===========================================================================
  // 4. 3D SCROLL EFFECTS & INTERACTIVE 3D MOUSE PARALLAX TILT
  // ===========================================================================
  function setup3DScrollEffects() {
    // 1. Intersection Observer for 3D Perspective Reveal
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    const revealElements = document.querySelectorAll(
      '.esbd-scroll-reveal-3d, .esbd-platform-frame, .bg-card, [data-testid="tournament-card"], .news-card, .product-card'
    );
    revealElements.forEach((el) => {
      el.classList.add('esbd-scroll-reveal-3d');
      revealObserver.observe(el);
    });

    // 2. Interactive 3D Card Mouse Parallax Tilt (Pinterest / 3D web design standard)
    const tiltCards = document.querySelectorAll(
      '.bg-card, [data-testid="tournament-card"], .news-card, .product-card, .stat-card, [data-testid="leaderboard-row"]'
    );

    tiltCards.forEach((card) => {
      if (card.dataset.has3DTilt === 'true') return;
      card.dataset.has3DTilt = 'true';
      card.classList.add('esbd-3d-tilt-card');

      // Inject Holographic Sheen
      if (!card.querySelector('.esbd-holo-sheen')) {
        const sheen = document.createElement('div');
        sheen.className = 'esbd-holo-sheen';
        card.appendChild(sheen);
      }

      card.addEventListener('pointermove', (e) => {
        if (window.innerWidth < 768) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -11;
        const rotateY = ((x - centerX) / centerX) * 11;

        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(16px) scale3d(1.025, 1.025, 1.025)`;
        card.style.boxShadow = `0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(16, 185, 129, 0.3)`;

        const sheen = card.querySelector('.esbd-holo-sheen');
        if (sheen) {
          sheen.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.18) 0%, rgba(16, 185, 129, 0.12) 35%, transparent 70%)`;
        }
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  // ===========================================================================
  // 5. ENHANCE SECTION HIGHLIGHTS (RADAR, GLOWING PRIZE POOL, LEADERBOARD)
  // ===========================================================================
  function enhanceSectionHighlights() {
    // 1. Highlight LIVE tournament tags with pulsing radar dot
    const liveBadges = document.querySelectorAll(
      '.bg-destructive, [class*="text-destructive"], .badge-live, [data-testid="badge-live"]'
    );
    liveBadges.forEach((badge) => {
      if (badge.dataset.hasRadar === 'true') return;
      badge.dataset.hasRadar = 'true';
      badge.classList.add('esbd-live-radar');
      if (!badge.querySelector('.esbd-radar-dot')) {
        const dot = document.createElement('span');
        dot.className = 'esbd-radar-dot';
        badge.prepend(dot);
      }
    });

    // 2. Highlight prize pool numbers (৳2.5Cr, etc.)
    const prizeTexts = document.querySelectorAll('h3, p, span, div');
    prizeTexts.forEach((el) => {
      if (el.children.length === 0 && (el.textContent.includes('৳') || el.textContent.includes('2.5Cr'))) {
        el.classList.add('esbd-prize-glow');
      }
    });

    // 3. Highlight top 3 leaderboard ranks
    const leaderRows = document.querySelectorAll('[data-testid="leaderboard-row"], tr, .leaderboard-item');
    leaderRows.forEach((row, i) => {
      if (i === 0) row.classList.add('esbd-rank-1-badge');
      else if (i === 1) row.classList.add('esbd-rank-2-badge');
      else if (i === 2) row.classList.add('esbd-rank-3-badge');
    });
  }

  // ===========================================================================
  // 6. MASTER INITIALIZATION & CONTINUOUS ROUTE OBSERVER
  // ===========================================================================
  function masterScan() {
    inject3DAnimatedBars();
    setup3DScrollEffects();
    enhanceSectionHighlights();
  }

  function init() {
    setupAmbientNebula();
    initThreeArenaCore();
    masterScan();

    // Re-scan when React re-renders or updates
    const observer = new MutationObserver(() => {
      masterScan();
    });

    const root = document.getElementById('root') || document.body;
    observer.observe(root, { childList: true, subtree: true });

    // Periodic check to ensure dynamic data (tourneys, news, shop) get framed
    setInterval(masterScan, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
