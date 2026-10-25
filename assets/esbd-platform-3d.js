/**
 * E-SPORTS BANGLADESH (ESBD) — MASTER 3D GAMING PLATFORM & ATMOSPHERE ENGINE
 * 
 * Features:
 * 1. Signature 3D Globe with 3D Holographic ESBD Logo inside (counter-rotating, glowing reticles).
 * 2. Leaderboards-grade 5-layer volumetric cosmic atmosphere and floating cyber dust.
 * 3. Ultra-glow 3D animated bar with dual opposing laser runners, equalizers, and breathing neon aura.
 * 4. Section 3D Scroll Entrance & Viewport Center-of-Attention Focus Engine:
 *    - 3D perspective reveal on scroll
 *    - Center-of-attention focus detection with holographic cyber corner HUD brackets
 *    - Ambient stadium spotlight and idle 3D micro-floating on cards
 *    - 3D extrusion shadows on key stat numbers
 * 5. Kinetic 3D Globe scroll coordination and sleek laser dividers between major sections.
 */

(function () {
  'use strict';

  if (window.__ESBD_PLATFORM_MASTER_INITIALIZED__) return;
  window.__ESBD_PLATFORM_MASTER_INITIALIZED__ = true;

  // ===========================================================================
  // 1. INJECT VOLUMETRIC AMBIENT NEBULA GLOWS & FULL-PAGE COSMIC DEPTH
  // ===========================================================================
  function setupAmbientAtmosphere() {
    // 1.1 Five-Layer Volumetric Nebula System
    if (!document.getElementById('esbd-ambient-nebula')) {
      const nebula = document.createElement('div');
      nebula.id = 'esbd-ambient-nebula';
      nebula.className = 'esbd-ambient-nebula';
      nebula.innerHTML = `
        <div class="esbd-nebula-glow esbd-nebula-emerald-primary"></div>
        <div class="esbd-nebula-glow esbd-nebula-crimson-core"></div>
        <div class="esbd-nebula-glow esbd-nebula-cyan-accent"></div>
        <div class="esbd-nebula-glow esbd-nebula-gold-subtle"></div>
        <div class="esbd-nebula-glow esbd-nebula-deep-space"></div>
      `;
      document.body.prepend(nebula);
    }

    // 1.2 Ambient Floating Cyber Dust Particles
    if (!document.getElementById('esbd-floating-particles')) {
      const pContainer = document.createElement('div');
      pContainer.id = 'esbd-floating-particles';
      pContainer.className = 'esbd-floating-particles';
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        pContainer.appendChild(p);
      }
      document.body.prepend(pContainer);
    }

    // 1.3 Hero Volumetric Light Beams
    if (!document.getElementById('esbd-hero-light-beams')) {
      const beams = document.createElement('div');
      beams.id = 'esbd-hero-light-beams';
      beams.className = 'esbd-hero-light-beams';
      beams.innerHTML = `
        <div class="beam beam-emerald"></div>
        <div class="beam beam-crimson"></div>
        <div class="beam beam-cyan"></div>
      `;
      document.body.prepend(beams);
    }
  }

  // ===========================================================================
  // 2. FULL-PAGE PERSISTENT 3D THREE.JS ARENA CORE WITH 3D LOGO INSIDE
  // ===========================================================================
  let threeRenderer = null;
  let arenaGroup = null;
  let innerCoreMesh = null;
  let innerCoreLines = null;
  let outerSphereLines = null;
  let orbitalRings = [];
  let orbitalNodes = [];
  let starPoints = null;
  let starMat = null;
  let cyberGridGroup = null;
  let threeCamera = null;
  let threeScene = null;

  // 3D Logo Components inside Globe
  let logo3DGroup = null;
  let logoPlaneFront = null;
  let logoPlaneBack = null;
  let logoGlowMesh = null;
  let logoHaloMesh = null;
  let logoRingRed = null;
  let logoRingGreen = null;
  let logoCircuitLine = null;

  // Inertia and motion state
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = window.scrollY || 0;
  let targetScrollY = scrollY;
  let scrollVelocity = 0;

  function initThreeArenaCore() {
    if (!window.THREE) {
      console.warn('[ESBD 3D] Three.js not yet loaded, retrying...');
      setTimeout(initThreeArenaCore, 250);
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

    // 1. Scene & Perspective Camera
    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    threeCamera.position.set(0, 0, 9.2);

    // 2. WebGL Renderer with Native Alpha
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
      return;
    }

    // 3. Main Arena 3D Group
    arenaGroup = new THREE.Group();
    threeScene.add(arenaGroup);

    // Initial position aligned to top hero (right-hand composition)
    arenaGroup.position.set(2.4, 0.25, 0);

    // --- Outer Emerald Green Wireframe Sphere (Icosahedron radius 2.7) ---
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
        opacity: 0.70,
      })
    );
    arenaGroup.add(outerSphereLines);

    // --- Inner Crimson Red Energy Lattice (Radius 1.65 - cages the 3D logo) ---
    const innerGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: colorRed,
      wireframe: false,
      transparent: true,
      opacity: 0.05,
    });
    innerCoreMesh = new THREE.Mesh(innerGeo, innerMat);
    arenaGroup.add(innerCoreMesh);

    const innerWireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.65, 1));
    innerCoreLines = new THREE.LineSegments(
      innerWireGeo,
      new THREE.LineBasicMaterial({
        color: colorRed,
        transparent: true,
        opacity: 0.35,
      })
    );
    arenaGroup.add(innerCoreLines);

    // =========================================================================
    // 3D HOLOGRAPHIC COMPANY LOGO INSIDE THE GLOBE CORE
    // =========================================================================
    logo3DGroup = new THREE.Group();
    arenaGroup.add(logo3DGroup);

    // Dynamic offscreen canvas processor to generate 100% transparent texture
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/img/3d-logo/esbd-3d-logo-front.png';
    logoImg.onload = function () {
      try {
        const offscreen = document.createElement('canvas');
        offscreen.width = logoImg.width;
        offscreen.height = logoImg.height;
        const ctx = offscreen.getContext('2d');
        ctx.drawImage(logoImg, 0, 0);

        const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
        const data = imgData.data;
        const h = offscreen.height;

        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];
          const row = Math.floor((i / 4) / offscreen.width);

          // Fade out table floor reflection below 72% height
          let reflectionFade = 1.0;
          if (row > h * 0.72) {
            reflectionFade = Math.max(0, 1.0 - (row - h * 0.72) / (h * 0.08));
          }

          const maxRGB = Math.max(r, g, b);
          if (maxRGB < 15 || reflectionFade <= 0) {
            data[i + 3] = 0; // Black background completely transparent
          } else {
            // Boost vibrancy of the metallic and neon elements
            data[i] = Math.min(255, Math.round(r * 1.35));
            data[i + 1] = Math.min(255, Math.round(g * 1.35));
            data[i + 2] = Math.min(255, Math.round(b * 1.35));

            let alpha = 255;
            if (maxRGB < 45) {
              alpha = Math.round(((maxRGB - 15) / 30) * 255);
            }
            data[i + 3] = Math.round(alpha * reflectionFade);
          }
        }
        ctx.putImageData(imgData, 0, 0);

        const logoTexture = new THREE.CanvasTexture(offscreen);
        logoTexture.minFilter = THREE.LinearFilter;
        logoTexture.magFilter = THREE.LinearFilter;
        logoTexture.generateMipmaps = false;

        // Front 3D Logo Plane (Width: 2.8, Height: 1.4)
        const logoPlaneGeo = new THREE.PlaneGeometry(2.8, 1.4);
        const logoPlaneMat = new THREE.MeshBasicMaterial({
          map: logoTexture,
          transparent: true,
          opacity: 1.0,
          side: THREE.DoubleSide,
          depthWrite: false,
          depthTest: false,
        });

        logoPlaneFront = new THREE.Mesh(logoPlaneGeo, logoPlaneMat);
        logoPlaneFront.position.set(0, 0, 0.05);
        logoPlaneFront.renderOrder = 999;
        logo3DGroup.add(logoPlaneFront);

        // Additive Glow Mesh for neon radiance
        const logoGlowMat = new THREE.MeshBasicMaterial({
          map: logoTexture,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
        });
        logoGlowMesh = new THREE.Mesh(logoPlaneGeo, logoGlowMat);
        logoGlowMesh.position.set(0, 0, 0.06);
        logoGlowMesh.renderOrder = 1000;
        logo3DGroup.add(logoGlowMesh);

        // Subtle Back Plane for dimensional thickness & emerald backlight
        const logoBackMat = new THREE.MeshBasicMaterial({
          map: logoTexture,
          transparent: true,
          opacity: 0.70,
          side: THREE.DoubleSide,
          depthWrite: false,
          depthTest: false,
          color: colorGreen,
          blending: THREE.AdditiveBlending,
        });
        logoPlaneBack = new THREE.Mesh(logoPlaneGeo, logoBackMat);
        logoPlaneBack.position.set(0, 0, -0.05);
        logoPlaneBack.renderOrder = 998;
        logo3DGroup.add(logoPlaneBack);

        // Holographic Backing Aura Ring
        const haloGeo = new THREE.RingGeometry(0.95, 1.45, 64);
        const haloMat = new THREE.MeshBasicMaterial({
          color: colorGreen,
          transparent: true,
          opacity: 0.32,
          side: THREE.DoubleSide,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
        });
        logoHaloMesh = new THREE.Mesh(haloGeo, haloMat);
        logoHaloMesh.position.set(0, 0, -0.08);
        logoHaloMesh.renderOrder = 997;
        logo3DGroup.add(logoHaloMesh);
      } catch (err) {
        console.warn('[ESBD 3D] Logo processing fallback:', err);
      }
    };

    // 3D Segmented Crimson Reticle Ring around the "e" Mark (Offset x ~ -0.74)
    const ringRedGeo = new THREE.TorusGeometry(0.62, 0.024, 8, 48);
    const ringRedMat = new THREE.MeshBasicMaterial({
      color: colorRed,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    logoRingRed = new THREE.Mesh(ringRedGeo, ringRedMat);
    logoRingRed.position.set(-0.74, 0.02, 0.08);
    logoRingRed.renderOrder = 1001;
    logo3DGroup.add(logoRingRed);

    // Inner Concentric Emerald Ring around "e"
    const ringGreenGeo = new THREE.TorusGeometry(0.48, 0.016, 8, 36);
    const ringGreenMat = new THREE.MeshBasicMaterial({
      color: colorGreen,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    logoRingGreen = new THREE.Mesh(ringGreenGeo, ringGreenMat);
    logoRingGreen.position.set(-0.74, 0.02, 0.09);
    logoRingGreen.renderOrder = 1002;
    logo3DGroup.add(logoRingGreen);

    // 3D Glowing Cyber Circuit Trace Line with Terminal Spheres underneath Logo
    const circuitPoints = [
      new THREE.Vector3(-1.35, -0.50, 0.06),
      new THREE.Vector3(-0.65, -0.50, 0.06),
      new THREE.Vector3(-0.42, -0.26, 0.06),
      new THREE.Vector3(0.65, -0.26, 0.06),
    ];
    const circuitGeo = new THREE.BufferGeometry().setFromPoints(circuitPoints);
    const circuitMat = new THREE.LineBasicMaterial({
      color: colorGreen,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    logoCircuitLine = new THREE.Line(circuitGeo, circuitMat);
    logoCircuitLine.renderOrder = 1001;
    logo3DGroup.add(logoCircuitLine);

    // Glowing Terminal Spheres on circuit trace
    const sphereTerminalGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const sphereTerminalMat = new THREE.MeshBasicMaterial({
      color: colorGreen,
      depthWrite: false,
      depthTest: false,
    });
    
    const term1 = new THREE.Mesh(sphereTerminalGeo, sphereTerminalMat);
    term1.position.copy(circuitPoints[0]);
    term1.renderOrder = 1002;
    logo3DGroup.add(term1);

    const term2 = new THREE.Mesh(sphereTerminalGeo, sphereTerminalMat);
    term2.position.copy(circuitPoints[circuitPoints.length - 1]);
    term2.renderOrder = 1002;
    logo3DGroup.add(term2);

    // --- 3 3D Orbital Rings (Torus) ---
    orbitalRings = [];
    const ringConfigs = [
      { radius: 3.6, tube: 0.014, color: colorGreen, opacity: 0.72, rx: Math.PI / 2.2, rz: 0 },
      { radius: 4.4, tube: 0.010, color: colorCyan, opacity: 0.52, rx: Math.PI / 1.7, rz: Math.PI / 5 },
      { radius: 3.1, tube: 0.009, color: colorRed, opacity: 0.58, rx: Math.PI / 2.6, rz: -Math.PI / 4 },
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

    // --- 3D Cosmic Particle Starfield (2,200 points with rich depth & color) ---
    const starCount = 2200;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const dist = 5.0 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = dist * Math.cos(phi) * 0.65;
      starPositions[i * 3 + 2] = dist * Math.sin(phi) * Math.sin(theta);

      const rnd = Math.random();
      let c = colorGreen;
      if (rnd < 0.22) c = colorRed;
      else if (rnd < 0.48) c = colorCyan;
      else if (rnd < 0.65) c = colorGold;

      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    starMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    starPoints = new THREE.Points(starGeo, starMat);
    threeScene.add(starPoints);

    // --- 3D Receding Horizon Cyber Grid ---
    cyberGridGroup = new THREE.Group();
    const gridHelper = new THREE.GridHelper(55, 45, 0x10b981, 0x059669);
    gridHelper.position.set(0, -3.8, 0);
    gridHelper.material.opacity = 0.22;
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

    // Kinetic 5-Waypoint 3D Position Path across Page Sections
    const p = scrollProgress;
    let targetX, targetY, targetZ;

    if (p < 0.20) {
      // 1. Hero: Glides at upper right composition
      const t = p / 0.20;
      targetX = 2.4 + (-2.3 - 2.4) * t;
      targetY = 0.25 + (0.05 - 0.25) * t;
      targetZ = 0 + (-0.2 - 0) * t;
    } else if (p < 0.45) {
      // 2. Who We Are / Metrics: Glides to left background
      const t = (p - 0.20) / 0.25;
      targetX = -2.3 + (2.3 - -2.3) * t;
      targetY = 0.05 + (0.25 - 0.05) * t;
      targetZ = -0.2 + (-0.1 - -0.2) * t;
    } else if (p < 0.70) {
      // 3. Live Tournaments & Sponsors: Glides to right background
      const t = (p - 0.45) / 0.25;
      targetX = 2.3 + (-2.1 - 2.3) * t;
      targetY = 0.25 + (0.15 - 0.25) * t;
      targetZ = -0.1 + (-0.3 - -0.1) * t;
    } else if (p < 0.88) {
      // 4. Broadcast, Creators & Community: Glides left
      const t = (p - 0.70) / 0.18;
      targetX = -2.1 + (0 - -2.1) * t;
      targetY = 0.15 + (-0.35 - 0.15) * t;
      targetZ = -0.3 + (-0.7 - -0.3) * t;
    } else {
      // 5. News, Shop & Global Alliance Portal: Anchors grand center
      targetX = 0;
      targetY = -0.35;
      targetZ = -0.7;
    }

    if (arenaGroup) {
      // Smooth glide to scroll waypoint
      arenaGroup.position.x += (targetX - arenaGroup.position.x) * 0.06;
      arenaGroup.position.y += (targetY - arenaGroup.position.y) * 0.06;
      arenaGroup.position.z += (targetZ - arenaGroup.position.z) * 0.06;

      // 3D Rotation driven by constant clock + scroll momentum tilt + mouse parallax
      const scrollTilt = Math.min(0.4, Math.max(-0.4, scrollVelocity * 0.0018));
      arenaGroup.rotation.y = clock * 0.14 + mouse.x + scrollY * 0.0012;
      arenaGroup.rotation.x = Math.sin(clock * 0.25) * 0.08 + mouse.y + scrollTilt;

      // Inner Crimson Core pulsing
      if (innerCoreMesh && innerCoreLines) {
        const pulse = 1 + Math.sin(clock * 1.8) * 0.055;
        innerCoreMesh.scale.setScalar(pulse);
        innerCoreLines.scale.setScalar(pulse);
        innerCoreMesh.rotation.y = clock * 0.45;
        innerCoreMesh.rotation.x = clock * 0.3;
        innerCoreLines.rotation.copy(innerCoreMesh.rotation);
      }

      // =======================================================================
      // ANIMATE 3D LOGO INSIDE THE GLOBE (ALWAYS MAJESTICALLY FACING VIEWER)
      // =======================================================================
      if (logo3DGroup) {
        // Vertical micro-levitation bobbing in the center of the globe
        logo3DGroup.position.y = Math.sin(clock * 1.6) * 0.06;

        // Counter-rotate against arenaGroup so the logo stays facing the audience,
        // with gentle holographic 3D tilt rocking
        logo3DGroup.rotation.y = -arenaGroup.rotation.y + Math.sin(clock * 0.8) * 0.18 + mouse.x * 0.35;
        logo3DGroup.rotation.x = -arenaGroup.rotation.x + Math.sin(clock * 1.1) * 0.10 + mouse.y * 0.25;

        // Pulsing scale
        const logoPulse = 1 + Math.sin(clock * 2.0) * 0.025;
        logo3DGroup.scale.setScalar(logoPulse);

        // Rotate the reticle ring around the "e"
        if (logoRingRed) {
          logoRingRed.rotation.z = clock * 0.6;
        }
        if (logoRingGreen) {
          logoRingGreen.rotation.z = -clock * 0.9;
        }

        // Pulse the circuit trace line
        if (logoCircuitLine) {
          logoCircuitLine.material.opacity = 0.80 + Math.sin(clock * 3) * 0.18;
        }

        // Rotate holographic backing halo
        if (logoHaloMesh) {
          logoHaloMesh.rotation.z = clock * 0.25;
          const haloScale = 1 + Math.sin(clock * 1.5) * 0.08;
          logoHaloMesh.scale.set(haloScale, haloScale, 1);
        }
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

    // Starfield kinetic momentum flaring
    if (starPoints && starMat) {
      starPoints.rotation.y = clock * 0.02 + mouse.x * 0.3;
      starPoints.rotation.x = Math.sin(clock * 0.1) * 0.04 + mouse.y * 0.2;
      const flare = Math.min(0.035, Math.abs(scrollVelocity) * 0.0005);
      starMat.size = 0.055 + flare;
    }

    // Perspective Cyber Grid Parallax
    if (cyberGridGroup) {
      cyberGridGroup.position.x = mouse.x * 1.5;
      cyberGridGroup.position.z = (scrollY * 0.005) % 2.5;
    }

    threeRenderer.render(threeScene, threeCamera);
  }

  // ===========================================================================
  // 3. ULTRA-GLOW 3D ANIMATED BAR SYSTEM & SLEEK LASER DIVIDERS
  // ===========================================================================
  function create3DAnimatedBar(options = {}) {
    const telemetry = options.telemetry || 'ESBD CORE PLATFORM // TOURNAMENTS LIVE';
    const status = options.status || 'ANTI-CHEAT: ONLINE • ARBITRATION ACTIVE';

    const bar = document.createElement('div');
    bar.className = 'esbd-3d-animated-bar';
    bar.innerHTML = `
      <div class="esbd-3d-laser-runner-top"></div>
      <div class="esbd-3d-laser-runner-bottom"></div>
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

  // Sleek 3D Laser Divider using Image 5
  function createSleekLaserDivider() {
    const divider = document.createElement('div');
    divider.className = 'esbd-sleek-laser-divider';
    divider.innerHTML = `
      <div class="esbd-sleek-laser-image"></div>
      <div class="esbd-sleek-laser-glow"></div>
      <div class="esbd-sleek-laser-sparkler"></div>
    `;
    return divider;
  }

  // Clean up duplicate consecutive bars
  function cleanupRedundantBars() {
    const bars = document.querySelectorAll('.esbd-3d-animated-bar');
    let lastText = '';
    bars.forEach((bar, idx) => {
      const text = (bar.textContent || '').trim().substring(0, 50);
      if (idx > 0 && text === lastText) {
        bar.style.display = 'none';
      }
      lastText = text;
    });
  }

  // Inject Spacious 3D Bars & Laser Dividers without touching ad/sponsor slots
  function injectSpacious3DBars() {
    cleanupRedundantBars();

    // 1. Below Hero section (Prominent grand 3D animated bar)
    const heroSection = document.querySelector('section.min-h-\\[100svh\\], #root section:first-of-type');
    if (heroSection && !document.getElementById('esbd-hero-bar')) {
      const heroBar = create3DAnimatedBar({
        telemetry: 'NATIONAL ESPORTS HUB // DHAKA 128-TICK',
        status: 'VERIFIED PRIZE POOLS • INSTANT ESCROW',
      });
      heroBar.id = 'esbd-hero-bar';
      heroSection.parentNode.insertBefore(heroBar, heroSection.nextSibling);
    }

    // 2. Subpages Hero Bar (newsroom and shop only)
    const subpageHeader = document.querySelector('.news-header, .shop-header, .page-header');
    if (subpageHeader && !document.getElementById('esbd-subpage-bar')) {
      const isShop = window.location.pathname.includes('shop');
      const subBar = create3DAnimatedBar({
        telemetry: isShop ? 'OFFICIAL PRO GEAR SHOP // HARDWARE DECK' : 'ESBD NEWSROOM // PATCH NOTES & ROSTERS',
        status: isShop ? 'AUTHENTIC HARDWARE • 2-YR WARRANTY' : 'LIVE JOURNALISM • 24/7 DISPATCH',
      });
      subBar.id = 'esbd-subpage-bar';
      subpageHeader.parentNode.insertBefore(subBar, subpageHeader.nextSibling);
    }

    // 3. Insert Sleek Laser Dividers between major sections (Spaced generously)
    const sections = document.querySelectorAll(
      '#root > div > section, #root > div > main > section, main section, #root section'
    );

    if (sections.length > 1) {
      sections.forEach((sec, idx) => {
        // Skip hero, skip very short sections, preserve sponsor/ad container spacing
        if (idx > 0 && sec.offsetHeight > 140) {
          if (!sec.nextElementSibling || !sec.nextElementSibling.classList.contains('esbd-sleek-laser-divider')) {
            const divider = createSleekLaserDivider();
            sec.parentNode.insertBefore(divider, sec.nextSibling);
          }
        }
      });
    }
  }

  // ===========================================================================
  // 4. SECTION 3D SCROLL & VIEWPORT ATTENTION ENGINE
  // ===========================================================================
  let activeFocusSection = null;

  function setupSection3DEngine() {
    const sections = document.querySelectorAll(
      '#root section, main section, #root > div > section, #root > div > main > section'
    );

    sections.forEach((sec, idx) => {
      if (sec.dataset.esbd3dInitialized === 'true') return;
      sec.dataset.esbd3dInitialized = 'true';
      sec.classList.add('esbd-3d-section');

      // Always mark first section (Hero) as immediately revealed
      if (idx === 0) {
        sec.classList.add('esbd-section-revealed');
      }

      // Inject 4 Cyber HUD Corner Reticles for each major section
      if (sec.offsetHeight > 160 && !sec.querySelector('.esbd-hud-corner')) {
        const hudTL = document.createElement('div'); hudTL.className = 'esbd-hud-corner esbd-hud-tl';
        const hudTR = document.createElement('div'); hudTR.className = 'esbd-hud-corner esbd-hud-tr';
        const hudBL = document.createElement('div'); hudBL.className = 'esbd-hud-corner esbd-hud-bl';
        const hudBR = document.createElement('div'); hudBR.className = 'esbd-hud-corner esbd-hud-br';
        sec.appendChild(hudTL);
        sec.appendChild(hudTR);
        sec.appendChild(hudBL);
        sec.appendChild(hudBR);
      }
    });

    updateSectionFocus();
  }

  function updateSectionFocus() {
    const sections = document.querySelectorAll('.esbd-3d-section');
    if (!sections.length) return;

    const vh = window.innerHeight;
    const centerY = vh / 2;

    let closestSec = null;
    let closestDist = Infinity;

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();

      // Check if revealed in viewport (top enters bottom 90% of screen)
      if (rect.top < vh * 0.90) {
        sec.classList.add('esbd-section-revealed');
      }

      // Check distance to center of viewport
      const secCenter = rect.top + rect.height / 2;
      const dist = Math.abs(secCenter - centerY);

      // Only consider if in active viewport range
      if (rect.bottom > vh * 0.15 && rect.top < vh * 0.85) {
        if (dist < closestDist) {
          closestDist = dist;
          closestSec = sec;
        }
      }
    });

    // Update active focus section
    if (closestSec && closestSec !== activeFocusSection) {
      if (activeFocusSection) {
        activeFocusSection.classList.remove('esbd-section-in-focus');
      }
      activeFocusSection = closestSec;
      activeFocusSection.classList.add('esbd-section-in-focus');
    }
  }

  // ===========================================================================
  // 5. 3D CARD TILT, HIGHLIGHTS & INTERACTION POLISH
  // ===========================================================================
  function setup3DCardInteractions() {
    const cards = document.querySelectorAll(
      '.bg-card, [data-testid="tournament-card"], [data-testid="stat-card"], .esbd-interactive-3d'
    );

    cards.forEach((card) => {
      if (card.__3d_tilt_bound) return;
      card.__3d_tilt_bound = true;

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Highlight key stats with radiant glowing effects & 3D extrusion
  function enhanceSectionHighlights() {
    // 1. Live tournament badges with radar dot
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

    // 2. Highlight prize pool numbers (৳2.5Cr, ৳1.8L, ৳1.5L) and key counts (1,200+, 200+, 80K+, 85K)
    const allText = document.querySelectorAll('h2, h3, span, div');
    allText.forEach((el) => {
      if (el.children.length > 2) return;
      if (el.dataset.esbdStatGlow === 'true') return;
      const text = (el.textContent || '').trim();
      if (/^[\d৳,\.]+[\+KkMm]?[Cc]?[Rr]?$/.test(text) || /^\d+\+?$/.test(text)) {
        const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
        if (fontSize >= 20) {
          el.dataset.esbdStatGlow = 'true';
          el.classList.add('esbd-stat-highlight');
        }
      }
    });
  }

  // ===========================================================================
  // 6. MASTER INITIALIZATION
  // ===========================================================================
  function masterScan() {
    injectSpacious3DBars();
    setupSection3DEngine();
    setup3DCardInteractions();
    enhanceSectionHighlights();
  }

  function initPlatformMaster() {
    setupAmbientAtmosphere();
    initThreeArenaCore();

    // Check periodically as React SPA mounts DOM elements
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      masterScan();
      if (attempts > 20) clearInterval(interval);
    }, 400);

    // Scroll listener for real-time section focus detection
    window.addEventListener('scroll', updateSectionFocus, { passive: true });

    // Re-scan when React re-renders routes or components
    const observer = new MutationObserver(() => {
      masterScan();
    });
    const root = document.getElementById('root') || document.body;
    observer.observe(root, { childList: true, subtree: true });

    // Continuous smooth scan
    setInterval(masterScan, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlatformMaster);
  } else {
    initPlatformMaster();
  }
})();
