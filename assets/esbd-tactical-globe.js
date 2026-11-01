/**
 * E-SPORTS BANGLADESH (ESBD) — TACTICAL COMMAND CENTER 3D GLOBE ENGINE
 * Based on the ESBD Landing Page 3D Upgrade Plan (Nov 1, 2026 · @Stone)
 *
 * Architecture:
 * 1. Base dark sphere with custom Fresnel atmosphere rim shader (electric green / neon cyan).
 * 2. Dotted continental land mass generated from accurate geographic boundary polygons.
 * 3. Match traffic parabolic arcs connecting Dhaka (HQ) to Singapore, Bangkok, Riyadh, Tokyo, Seoul, London, Dubai.
 * 4. Animated photon packets running along arcs simulating live match packet transmission.
 * 5. Pulsing city markers (Dhaka with laser beacon & radar wave rings, Chattogram, Sylhet, and regional hubs).
 * 6. Floating 3D-tracked LIVE broadcast tag anchored to Dhaka with live viewer count.
 * 7. Interactive 3D Raycasting with glassmorphic tactical tooltips on hover.
 * 8. Weighty mouse parallax, drag-to-rotate with inertia, and auto-rotation that eases to Bangladesh on load.
 * 9. Orbiting HUD rings with tick marks & rotating esports game names (Free Fire, PUBG Mobile, Valorant, CS2).
 * 10. Floating holographic 3D game badges orbiting the globe.
 * 11. Scroll-driven camera positioning from hero to tournament sections.
 * 12. Performance optimizations (capped DPR 2, visibility pause, offscreen pause).
 */

(function () {
  'use strict';

  if (window.__ESBD_TACTICAL_GLOBE_INITIALIZED__) return;
  window.__ESBD_TACTICAL_GLOBE_INITIALIZED__ = true;

  // --- Constants & Config ---
  const GLOBE_RADIUS = 2.45;
  const COLOR_BASE = 0x07090c;
  const COLOR_GREEN = 0x10b981;
  const COLOR_CYAN = 0x38bdf8;
  const COLOR_RED = 0xef4444;

  // Bangladesh optimal focus angles (facing camera directly at +Z)
  const BD_TARGET_ROTY = 3.134;
  const BD_TARGET_ROTX = -0.166;

  // City & Esports Hub Registry
  const HUBS = [
    {
      id: 'dhaka',
      name: 'DHAKA (ESBD NATIONAL HQ)',
      event: 'ESBD National Free Fire & PUBG Pro League 2026',
      players: '24,850 Active Players',
      prize: '৳25,00,000 BDT',
      ping: '8ms',
      lat: 23.8103,
      lon: 90.4125,
      isHQ: true,
      isBD: true
    },
    {
      id: 'chattogram',
      name: 'CHATTOGRAM (PORT CITY ARENA)',
      event: 'Coastal Clash Regional Invitational',
      players: '6,420 Players',
      prize: '৳5,00,000 BDT',
      ping: '14ms',
      lat: 22.3569,
      lon: 91.7832,
      isHQ: false,
      isBD: true
    },
    {
      id: 'sylhet',
      name: 'SYLHET (TEA VALLEY CUP)',
      event: 'Sylhet Esports Open Division',
      players: '4,180 Players',
      prize: '৳3,50,000 BDT',
      ping: '18ms',
      lat: 24.8949,
      lon: 91.8687,
      isHQ: false,
      isBD: true
    },
    {
      id: 'singapore',
      name: 'SINGAPORE (SEA MAJOR HUB)',
      event: 'Southeast Asia Regional Finals',
      players: '18,200 Viewers',
      prize: '$50,000 USD',
      ping: '38ms',
      lat: 1.3521,
      lon: 103.8198,
      isHQ: false,
      isBD: false
    },
    {
      id: 'bangkok',
      name: 'BANGKOK (FFWS ASIA HUB)',
      event: 'Free Fire World Series Qualifier',
      players: '15,300 Viewers',
      prize: '$30,000 USD',
      ping: '42ms',
      lat: 13.7563,
      lon: 100.5018,
      isHQ: false,
      isBD: false
    },
    {
      id: 'riyadh',
      name: 'RIYADH (EWC ARENA)',
      event: 'Esports World Cup Qualifier Circuit',
      players: '32,000 Viewers',
      prize: '$100,000 USD',
      ping: '65ms',
      lat: 24.7136,
      lon: 46.6753,
      isHQ: false,
      isBD: false
    },
    {
      id: 'tokyo',
      name: 'TOKYO (VALORANT PACIFIC)',
      event: 'Tokyo Masters Pro Circuit',
      players: '28,500 Viewers',
      prize: '$75,000 USD',
      ping: '82ms',
      lat: 35.6762,
      lon: 139.6503,
      isHQ: false,
      isBD: false
    },
    {
      id: 'seoul',
      name: 'SEOUL (CHAMPIONSHIP HUB)',
      event: 'Global Esports Masters',
      players: '21,400 Viewers',
      prize: '$60,000 USD',
      ping: '78ms',
      lat: 37.5665,
      lon: 126.9780,
      isHQ: false,
      isBD: false
    },
    {
      id: 'dubai',
      name: 'DUBAI (GLOBAL LEAGUE)',
      event: 'Middle East & South Asia Major',
      players: '19,800 Viewers',
      prize: '$45,000 USD',
      ping: '52ms',
      lat: 25.2048,
      lon: 55.2708,
      isHQ: false,
      isBD: false
    },
    {
      id: 'london',
      name: 'LONDON (INVITATIONAL HUB)',
      event: 'European Masters Exhibition',
      players: '12,600 Viewers',
      prize: '$35,000 USD',
      ping: '128ms',
      lat: 51.5074,
      lon: -0.1278,
      isHQ: false,
      isBD: false
    }
  ];

  // Continental land boundary polygons
  const LAND_POLYGONS = [
    // Eurasia Main
    [[-9, 36], [0, 43], [10, 54], [25, 71], [60, 75], [100, 78], [140, 72], [170, 66], [160, 55], [140, 50], [130, 42], [120, 32], [110, 20], [105, 10], [100, 1], [104, 1], [98, 10], [90, 22], [88, 26], [80, 28], [72, 20], [68, 25], [60, 25], [55, 15], [45, 13], [35, 30], [26, 40], [15, 40], [-5, 36], [-9, 36]],
    // South Asia & India Subcontinent
    [[68, 24], [72, 8], [78, 8], [80, 16], [85, 20], [89, 22], [92, 21], [92, 26], [88, 27], [80, 31], [74, 32], [68, 24]],
    // Bangladesh High-Density Region
    [[88.0, 21.5], [89.0, 21.8], [91.5, 21.0], [92.6, 21.0], [92.6, 22.5], [92.3, 23.8], [91.8, 25.1], [89.8, 26.5], [88.1, 26.5], [88.0, 24.5], [88.0, 21.5]],
    // Southeast Asia & Archipelagos
    [[98, 7], [104, 1], [108, -7], [118, -8], [128, -3], [130, 2], [120, 15], [108, 16], [98, 7]],
    // Japan
    [[130, 31], [135, 34], [141, 43], [145, 44], [141, 38], [136, 34], [130, 31]],
    // Africa
    [[-17, 30], [-5, 36], [10, 37], [25, 31], [34, 28], [43, 12], [51, 12], [41, 0], [40, -10], [35, -25], [20, -35], [18, -34], [12, -18], [9, 5], [-5, 5], [-15, 12], [-17, 21], [-17, 30]],
    // North America
    [[-168, 65], [-160, 70], [-130, 70], [-90, 72], [-60, 60], [-55, 50], [-70, 42], [-80, 25], [-85, 20], [-97, 20], [-105, 23], [-115, 32], [-124, 48], [-140, 60], [-165, 60], [-168, 65]],
    // South America
    [[-80, 8], [-60, 10], [-35, -5], [-38, -13], [-45, -23], [-53, -33], [-65, -55], [-75, -50], [-75, -20], [-81, -5], [-80, 8]],
    // Australia
    [[114, -22], [130, -12], [142, -11], [153, -28], [150, -38], [140, -38], [115, -35], [114, -22]],
    // United Kingdom
    [[-5, 50], [1, 51], [2, 53], [-2, 58], [-6, 58], [-5, 50]]
  ];

  function pointInPolygon(point, vs) {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function isLand(lon, lat) {
    for (let i = 0; i < LAND_POLYGONS.length; i++) {
      if (pointInPolygon([lon, lat], LAND_POLYGONS[i])) return true;
    }
    return false;
  }

  // Lat/Lon to 3D Cartesian coordinates
  function latLonToVector3(lat, lon, radius = GLOBE_RADIUS) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  // 3D Parabolic Arc Curve
  function createParabolicCurve(start, end, maxElevation = 0.45) {
    const distance = start.distanceTo(end);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const midLength = mid.length();
    const elevation = Math.max(0.2, distance * 0.28, maxElevation);
    mid.normalize().multiplyScalar(midLength + elevation);

    const p1 = start.clone().lerp(mid, 0.5).normalize().multiplyScalar(start.length() + elevation * 0.7);
    const p2 = end.clone().lerp(mid, 0.5).normalize().multiplyScalar(end.length() + elevation * 0.7);

    return new THREE.CubicBezierCurve3(start, p1, p2, end);
  }

  // --- Main Tactical Command Globe Initializer ---
  function initTacticalGlobe() {
    if (!window.THREE) {
      setTimeout(initTacticalGlobe, 200);
      return;
    }

    const THREE = window.THREE;

    // Use or inject tactical canvas
    let canvas = document.getElementById('esbd-tactical-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'esbd-tactical-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.zIndex = '0';
      canvas.style.pointerEvents = 'auto';
      canvas.style.cursor = 'grab';
      document.body.prepend(canvas);
    }

    // Hide old cyber-bg if present to let tactical globe shine
    const oldBg = document.getElementById('esbd-cyber-bg');
    if (oldBg) oldBg.style.display = 'none';

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
    } catch (e) {
      console.warn('Tactical Globe WebGL init failed:', e);
      return;
    }

    // Master Arena Group (positioned on right of Hero on desktop, center on mobile)
    const arenaGroup = new THREE.Group();
    scene.add(arenaGroup);

    let isHeroComposition = true;
    const isDesktop = width >= 1024;
    const defaultPosX = isDesktop ? 2.3 : 0;
    const defaultPosY = isDesktop ? 0.2 : 0;
    arenaGroup.position.set(defaultPosX, defaultPosY, 0);

    // Inner Globe Group (handles rotation)
    const globeGroup = new THREE.Group();
    arenaGroup.add(globeGroup);

    // Initial state easing toward Bangladesh
    let currentRotY = BD_TARGET_ROTY + 0.85;
    let currentRotX = BD_TARGET_ROTX - 0.45;
    let targetRotY = BD_TARGET_ROTY;
    let targetRotX = BD_TARGET_ROTX;
    let isIntroEasing = true;
    let introStartTime = performance.now();

    globeGroup.rotation.y = currentRotY;
    globeGroup.rotation.x = currentRotX;

    // --- 2. Low-Saturation Dark Earth Base Sphere (Semi-transparent to reveal inner 3D Logo) ---
    const baseGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const baseMat = new THREE.MeshBasicMaterial({
      color: 0x06090e,
      transparent: true,
      opacity: 0.42,
      depthWrite: false
    });
    const baseSphere = new THREE.Mesh(baseGeo, baseMat);
    globeGroup.add(baseSphere);

    // =========================================================================
    // 2.5 3D HOLOGRAPHIC ESBD LOGO INSIDE THE GLOBE CORE
    // =========================================================================
    const logo3DGroup = new THREE.Group();
    arenaGroup.add(logo3DGroup);

    // Inner Holographic Facet Core (Wireframe containment cage)
    const innerCoreGeo = new THREE.IcosahedronGeometry(1.68, 1);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: COLOR_GREEN,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    logo3DGroup.add(innerCoreMesh);

    // Offscreen Canvas Processor for Transparent Vibrant 3D Logo
    let logoPlaneFront = null;
    let logoGlowMesh = null;
    let logoPlaneBack = null;
    let logoHaloMesh = null;
    let logoRingRed = null;
    let logoRingGreen = null;
    let logoCircuitLine = null;

    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/img/3d-logo/esbd-3d-logo-transparent.png';
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

          let reflectionFade = 1.0;
          if (row > h * 0.72) {
            reflectionFade = Math.max(0, 1.0 - (row - h * 0.72) / (h * 0.08));
          }

          const maxRGB = Math.max(r, g, b);
          if (maxRGB < 8 || reflectionFade <= 0) {
            data[i + 3] = 0;
          } else {
            data[i] = Math.min(255, Math.round(r * 1.1));
            data[i + 1] = Math.min(255, Math.round(g * 1.1));
            data[i + 2] = Math.min(255, Math.round(b * 1.1));

            let alpha = 255;
            if (maxRGB < 35) {
              alpha = Math.round(((maxRGB - 8) / 27) * 255);
            }
            data[i + 3] = Math.round(alpha * reflectionFade);
          }
        }
        ctx.putImageData(imgData, 0, 0);

        const logoTexture = new THREE.CanvasTexture(offscreen);
        logoTexture.minFilter = THREE.LinearFilter;
        logoTexture.magFilter = THREE.LinearFilter;
        logoTexture.generateMipmaps = false;

        // Front 3D Logo Plane
        const logoPlaneGeo = new THREE.PlaneGeometry(2.35, 1.18);
        const logoFrontMat = new THREE.MeshBasicMaterial({
          map: logoTexture,
          transparent: true,
          opacity: 0.98,
          side: THREE.DoubleSide,
          depthWrite: false,
          depthTest: false
        });
        logoPlaneFront = new THREE.Mesh(logoPlaneGeo, logoFrontMat);
        logoPlaneFront.position.set(0, 0, 0.05);
        logoPlaneFront.renderOrder = 999;
        logo3DGroup.add(logoPlaneFront);

        // Neon Glow Radiance Layer
        const logoGlowMat = new THREE.MeshBasicMaterial({
          map: logoTexture,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending
        });
        logoGlowMesh = new THREE.Mesh(logoPlaneGeo, logoGlowMat);
        logoGlowMesh.position.set(0, 0, 0.06);
        logoGlowMesh.renderOrder = 1000;
        logo3DGroup.add(logoGlowMesh);

        // Back Plane with Emerald Backlight for 3D Depth
        const logoBackMat = new THREE.MeshBasicMaterial({
          map: logoTexture,
          transparent: true,
          opacity: 0.65,
          side: THREE.DoubleSide,
          depthWrite: false,
          depthTest: false,
          color: COLOR_GREEN,
          blending: THREE.AdditiveBlending
        });
        logoPlaneBack = new THREE.Mesh(logoPlaneGeo, logoBackMat);
        logoPlaneBack.position.set(0, 0, -0.05);
        logoPlaneBack.renderOrder = 998;
        logo3DGroup.add(logoPlaneBack);

        // Holographic Backing Aura Ring
        const haloGeo = new THREE.RingGeometry(0.85, 1.35, 64);
        const haloMat = new THREE.MeshBasicMaterial({
          color: COLOR_GREEN,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending
        });
        logoHaloMesh = new THREE.Mesh(haloGeo, haloMat);
        logoHaloMesh.position.set(0, 0, -0.08);
        logoHaloMesh.renderOrder = 997;
        logo3DGroup.add(logoHaloMesh);
      } catch (err) {
        console.warn('Tactical 3D logo processing fallback:', err);
      }
    };

    // Crimson Reticle Ring around the "e" Emblem (Offset x ~ -0.62)
    const ringRedGeo = new THREE.TorusGeometry(0.54, 0.022, 8, 48);
    const ringRedMat = new THREE.MeshBasicMaterial({
      color: COLOR_RED,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending
    });
    logoRingRed = new THREE.Mesh(ringRedGeo, ringRedMat);
    logoRingRed.position.set(-0.62, 0.02, 0.08);
    logoRingRed.renderOrder = 1001;
    logo3DGroup.add(logoRingRed);

    // Inner Concentric Emerald Ring around "e"
    const ringGreenGeo = new THREE.TorusGeometry(0.42, 0.016, 8, 36);
    const ringGreenMat = new THREE.MeshBasicMaterial({
      color: COLOR_GREEN,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending
    });
    logoRingGreen = new THREE.Mesh(ringGreenGeo, ringGreenMat);
    logoRingGreen.position.set(-0.62, 0.02, 0.09);
    logoRingGreen.renderOrder = 1002;
    logo3DGroup.add(logoRingGreen);

    // Glowing Cyber Circuit Trace Line under the Logo
    const circuitPoints = [
      new THREE.Vector3(-1.15, -0.42, 0.06),
      new THREE.Vector3(-0.55, -0.42, 0.06),
      new THREE.Vector3(-0.35, -0.22, 0.06),
      new THREE.Vector3(0.55, -0.22, 0.06)
    ];
    const circuitGeo = new THREE.BufferGeometry().setFromPoints(circuitPoints);
    const circuitMat = new THREE.LineBasicMaterial({
      color: COLOR_GREEN,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending
    });
    logoCircuitLine = new THREE.Line(circuitGeo, circuitMat);
    logoCircuitLine.renderOrder = 1001;
    logo3DGroup.add(logoCircuitLine);

    // Terminal Spheres on Circuit Trace
    const terminalGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const terminalMat = new THREE.MeshBasicMaterial({
      color: COLOR_CYAN,
      depthWrite: false,
      depthTest: false
    });
    const term1 = new THREE.Mesh(terminalGeo, terminalMat);
    term1.position.copy(circuitPoints[0]);
    term1.renderOrder = 1002;
    logo3DGroup.add(term1);

    const term2 = new THREE.Mesh(terminalGeo, terminalMat);
    term2.position.copy(circuitPoints[circuitPoints.length - 1]);
    term2.renderOrder = 1002;
    logo3DGroup.add(term2);

    // --- 3. Thin Fresnel Atmosphere Glow Rim ---
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
          float intensity = pow(0.70 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(glowColor, intensity * 0.95);
        }
      `,
      uniforms: {
        glowColor: { value: new THREE.Color(COLOR_CYAN) }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // Inner subtle atmosphere rim
    const innerAtmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.998, 48, 48);
    const innerAtmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
          gl_FragColor = vec4(0.04, 0.07, 0.12, 1.0 - intensity * 0.4);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending
    });
    const innerAtmoMesh = new THREE.Mesh(innerAtmoGeo, innerAtmoMat);
    globeGroup.add(innerAtmoMesh);

    // --- 4. Dotted Continental Land Mass ---
    const totalDots = 3800;
    const landPositions = [];
    const landColors = [];
    const oceanPositions = [];

    const cGreen = new THREE.Color(COLOR_GREEN);
    const cCyan = new THREE.Color(COLOR_CYAN);
    const cOcean = new THREE.Color(0x0b1622);

    for (let i = 0; i < totalDots; i++) {
      const phi = Math.acos(-1 + (2 * i) / totalDots);
      const theta = Math.sqrt(totalDots * Math.PI) * phi;
      const lat = 90 - (phi * 180 / Math.PI);
      let lon = (theta * 180 / Math.PI) % 360 - 180;

      const pos = latLonToVector3(lat, lon, GLOBE_RADIUS * 1.004);
      const isLandPoint = isLand(lon, lat);

      // Focus on Bangladesh & South Asia
      const distToBD = Math.sqrt(Math.pow(lat - 23.8, 2) + Math.pow(lon - 90.4, 2));
      const isNearBD = distToBD < 16;

      if (isLandPoint || isNearBD) {
        landPositions.push(pos.x, pos.y, pos.z);
        const col = isNearBD ? cGreen : (Math.random() < 0.25 ? cCyan : cGreen);
        const intensity = isNearBD ? 1.0 : (0.55 + Math.random() * 0.4);
        landColors.push(col.r * intensity, col.g * intensity, col.b * intensity);
      } else if (i % 3 === 0) {
        oceanPositions.push(pos.x, pos.y, pos.z);
      }
    }

    // High-resolution cluster specifically on Bangladesh
    for (let b = 0; b < 140; b++) {
      const bLat = 21.0 + Math.random() * 5.6;
      const bLon = 88.0 + Math.random() * 4.6;
      const bPos = latLonToVector3(bLat, bLon, GLOBE_RADIUS * 1.006);
      landPositions.push(bPos.x, bPos.y, bPos.z);
      landColors.push(cGreen.r * 1.2, cGreen.g * 1.2, cGreen.b * 1.2);
    }

    // Land Points
    const landGeo = new THREE.BufferGeometry();
    landGeo.setAttribute('position', new THREE.Float32BufferAttribute(landPositions, 3));
    landGeo.setAttribute('color', new THREE.Float32BufferAttribute(landColors, 3));
    const landMat = new THREE.PointsMaterial({
      size: 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending
    });
    const landPoints = new THREE.Points(landGeo, landMat);
    globeGroup.add(landPoints);

    // Subtle Ocean Grid Points
    const oceanGeo = new THREE.BufferGeometry();
    oceanGeo.setAttribute('position', new THREE.Float32BufferAttribute(oceanPositions, 3));
    const oceanMat = new THREE.PointsMaterial({
      size: 0.02,
      color: cOcean,
      transparent: true,
      opacity: 0.28
    });
    const oceanPoints = new THREE.Points(oceanGeo, oceanMat);
    globeGroup.add(oceanPoints);

    // Subtle Tactical Lat/Lon Wireframe Grid
    const tacticalGridGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.002, 32, 32);
    const tacticalGridMat = new THREE.MeshBasicMaterial({
      color: COLOR_GREEN,
      wireframe: true,
      transparent: true,
      opacity: 0.09
    });
    const tacticalGridMesh = new THREE.Mesh(tacticalGridGeo, tacticalGridMat);
    globeGroup.add(tacticalGridMesh);

    // --- 5. Match Traffic Parabolic Arcs & Traveling Photons ---
    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);

    const arcPulses = [];
    const dhakaHub = HUBS.find(h => h.id === 'dhaka');
    const dhakaPos = latLonToVector3(dhakaHub.lat, dhakaHub.lon, GLOBE_RADIUS);

    HUBS.filter(h => h.id !== 'dhaka').forEach((hub) => {
      const hubPos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS);
      const curve = createParabolicCurve(dhakaPos, hubPos, hub.isBD ? 0.15 : 0.45);
      const curvePoints = curve.getPoints(54);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

      const curveMat = new THREE.LineBasicMaterial({
        color: hub.isBD ? COLOR_GREEN : COLOR_CYAN,
        transparent: true,
        opacity: hub.isBD ? 0.75 : 0.48,
        blending: THREE.AdditiveBlending
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      arcsGroup.add(arcLine);

      // Traveling photon packet
      const photonGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const photonMat = new THREE.MeshBasicMaterial({
        color: hub.isBD ? 0x6ee7b7 : 0x38bdf8,
        transparent: true,
        opacity: 0.98,
        blending: THREE.AdditiveBlending
      });
      const photonMesh = new THREE.Mesh(photonGeo, photonMat);
      arcsGroup.add(photonMesh);

      arcPulses.push({
        curve: curve,
        mesh: photonMesh,
        speed: 0.2 + Math.random() * 0.15,
        progress: Math.random()
      });
    });

    // --- 6. Pulsing City Markers & Interactive Raycast Targets ---
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);

    const markerMeshes = [];
    const radarRings = [];

    HUBS.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS * 1.008);

      const pinRadius = hub.isHQ ? 0.085 : (hub.isBD ? 0.06 : 0.048);
      const pinGeo = new THREE.SphereGeometry(pinRadius, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: hub.isHQ ? COLOR_RED : (hub.isBD ? COLOR_GREEN : COLOR_CYAN)
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { hubData: hub };
      markersGroup.add(pinMesh);
      markerMeshes.push(pinMesh);

      // Radar pulse waves for Dhaka & Regional Hubs
      if (hub.isHQ || hub.isBD) {
        for (let r = 0; r < 2; r++) {
          const ringGeo = new THREE.RingGeometry(0.07, 0.12, 24);
          const ringMat = new THREE.MeshBasicMaterial({
            color: hub.isHQ ? COLOR_RED : COLOR_GREEN,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.position.copy(pos.clone().multiplyScalar(1.005));
          ringMesh.lookAt(pos.clone().multiplyScalar(2));
          markersGroup.add(ringMesh);
          radarRings.push({ mesh: ringMesh, offset: r * 0.5, speed: 1.2, isHQ: hub.isHQ });
        }
      }

      // Vertical Laser Pillar at Dhaka HQ pointing straight out into space
      if (hub.isHQ) {
        const laserGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.75, 8);
        laserGeo.translate(0, 0.375, 0);
        laserGeo.rotateX(Math.PI / 2);
        const laserMat = new THREE.MeshBasicMaterial({
          color: 0xef4444,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending
        });
        const laserMesh = new THREE.Mesh(laserGeo, laserMat);
        laserMesh.position.copy(pos);
        laserMesh.lookAt(pos.clone().multiplyScalar(2));
        markersGroup.add(laserMesh);
      }
    });

    // --- 7. Orbiting HUD Rings with Tick Marks ---
    const hudRingConfigs = [
      { radius: 3.3, tube: 0.014, rx: Math.PI / 2.3, rz: 0.2, color: COLOR_GREEN, opacity: 0.55 },
      { radius: 3.75, tube: 0.010, rx: Math.PI / 1.75, rz: -0.35, color: COLOR_CYAN, opacity: 0.42 }
    ];

    const hudRings = [];
    hudRingConfigs.forEach((cfg) => {
      const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 8, 140);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.set(cfg.rx, 0, cfg.rz);
      globeGroup.add(ringMesh);
      hudRings.push(ringMesh);
    });

    // Orbiting HUD Nodes (Tick indicators)
    const hudNodes = [];
    for (let i = 0; i < 6; i++) {
      const nodeGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? COLOR_GREEN : COLOR_CYAN
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      globeGroup.add(nodeMesh);
      hudNodes.push({
        mesh: nodeMesh,
        radius: 3.3,
        speed: 0.18 + (i % 3) * 0.05,
        phase: (i / 6) * Math.PI * 2,
        tilt: i % 2 === 0 ? 0.3 : -0.3
      });
    }

    // --- 8. Floating Holographic Game Emblems (Free Fire, PUBG, Valorant, CS2) ---
    const gameEmblems = [];
    const gamesList = [
      { name: 'FREE FIRE', img: '/img/games/free-fire.png', angle: 0 },
      { name: 'PUBG MOBILE', img: '/img/games/pubg-mobile.png', angle: Math.PI * 0.5 },
      { name: 'VALORANT', img: '/img/games/valorant.png', angle: Math.PI },
      { name: 'CS2', img: '/img/games/cs2.png', angle: Math.PI * 1.5 }
    ];

    const textureLoader = new THREE.TextureLoader();
    gamesList.forEach((game) => {
      textureLoader.load(game.img, (tex) => {
        const badgeGeo = new THREE.PlaneGeometry(0.55, 0.55);
        const badgeMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.92,
          side: THREE.DoubleSide
        });
        const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);

        // Surrounding glowing hexagonal border / halo
        const haloGeo = new THREE.RingGeometry(0.32, 0.36, 6);
        const haloMat = new THREE.MeshBasicMaterial({
          color: COLOR_GREEN,
          transparent: true,
          opacity: 0.65,
          side: THREE.DoubleSide
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        badgeMesh.add(haloMesh);

        arenaGroup.add(badgeMesh);
        gameEmblems.push({
          mesh: badgeMesh,
          angle: game.angle,
          radius: 3.65,
          speed: 0.14,
          tilt: 0.25
        });
      }, undefined, (err) => console.warn('Game emblem texture fallback:', err));
    });

    // --- 9. Sparse Drifting Particles with Depth-of-Field ---
    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const r = 3.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const col = Math.random() < 0.6 ? cGreen : cCyan;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // --- 10. Soft Lighting with Rim Light ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(5, 3, 4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x10b981, 0.7);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    // --- 11. Floating LIVE Tag Anchored to Dhaka ---
    let liveDhakaTag = document.getElementById('esbd-live-dhaka-tag');
    if (!liveDhakaTag) {
      liveDhakaTag = document.createElement('div');
      liveDhakaTag.id = 'esbd-live-dhaka-tag';
      liveDhakaTag.innerHTML = `
        <div class="live-dhaka-badge">
          <span class="red-dot"></span>
          <span>🔴 LIVE BROADCAST</span>
          <span class="viewer-count">• 14.8K VIEWERS</span>
        </div>
      `;
      document.body.appendChild(liveDhakaTag);
    }

    // --- 12. Interactive Raycasting & Glass Tooltip ---
    let tooltip = document.getElementById('tactical-marker-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'tactical-marker-tooltip';
      document.body.appendChild(tooltip);
    }

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.15;
    const mouse2D = new THREE.Vector2(-999, -999);
    let hoveredHub = null;

    function updateDhakaLiveTagPosition() {
      if (!liveDhakaTag) return;
      const worldPos = dhakaPos.clone().applyMatrix4(globeGroup.matrixWorld);
      const projected = worldPos.clone().project(camera);

      // Check if facing camera
      const cameraDir = camera.position.clone().sub(arenaGroup.position).normalize();
      const worldDhakaDir = dhakaPos.clone().applyMatrix4(globeGroup.matrixWorld).sub(arenaGroup.position).normalize();
      const isFacingCamera = worldDhakaDir.dot(cameraDir) > 0.12;

      if (isFacingCamera && projected.z < 1) {
        const x = (projected.x * 0.5 + 0.5) * width;
        const y = (-(projected.y * 0.5) + 0.5) * height;
        liveDhakaTag.style.left = `${x}px`;
        liveDhakaTag.style.top = `${y}px`;
        liveDhakaTag.style.opacity = '1';
        liveDhakaTag.style.display = 'block';
      } else {
        liveDhakaTag.style.opacity = '0';
        liveDhakaTag.style.display = 'none';
      }
    }

    function updateTooltipPosition() {
      if (!tooltip || !hoveredHub) return;
      const targetPos = latLonToVector3(hoveredHub.lat, hoveredHub.lon, GLOBE_RADIUS * 1.01);
      const projected = targetPos.applyMatrix4(globeGroup.matrixWorld).project(camera);

      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-(projected.y * 0.5) + 0.5) * height;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    }

    // --- 13. Interaction: Mouse Parallax & Drag with Inertia ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let autoRotatePaused = false;
    let autoRotateResumeTimeout = null;
    let autoRotateEnabled = true;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      isIntroEasing = false;
      autoRotatePaused = true;
      if (autoRotateResumeTimeout) clearTimeout(autoRotateResumeTimeout);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      velocityX = 0;
      velocityY = 0;
    });

    window.addEventListener('mousemove', (e) => {
      mouse2D.x = (e.clientX / width) * 2 - 1;
      mouse2D.y = -(e.clientY / height) * 2 + 1;

      mouseParallaxX = (e.clientX / width - 0.5) * 0.22;
      mouseParallaxY = (e.clientY / height - 0.5) * 0.18;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        velocityX = deltaX * 0.0055;
        velocityY = deltaY * 0.0055;

        globeGroup.rotation.y += velocityX;
        globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroup.rotation.x + velocityY));
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        if (autoRotateResumeTimeout) clearTimeout(autoRotateResumeTimeout);
        autoRotateResumeTimeout = setTimeout(() => {
          autoRotatePaused = false;
        }, 3000);
      }
    });

    // Touch support for mobile / tablets
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        isIntroEasing = false;
        autoRotatePaused = true;
        if (autoRotateResumeTimeout) clearTimeout(autoRotateResumeTimeout);
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;

        velocityX = deltaX * 0.006;
        velocityY = deltaY * 0.006;

        globeGroup.rotation.y += velocityX;
        globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroup.rotation.x + velocityY));
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      isDragging = false;
      if (autoRotateResumeTimeout) clearTimeout(autoRotateResumeTimeout);
      autoRotateResumeTimeout = setTimeout(() => {
        autoRotatePaused = false;
      }, 3000);
    });

    // --- 14. Scroll-Driven Camera Coordination ---
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = Math.min(1, Math.max(0, scrollY / Math.max(1, docHeight * 0.6)));
    }, { passive: true });

    // --- 15. Tactical Camera HUD Controls ---
    window.esbdFocusBangladesh = function () {
      isIntroEasing = false;
      autoRotatePaused = true;
      targetRotY = BD_TARGET_ROTY;
      targetRotX = BD_TARGET_ROTX;

      const startY = globeGroup.rotation.y;
      const startX = globeGroup.rotation.x;
      const startTime = performance.now();
      const duration = 1200;

      function step(now) {
        const p = Math.min(1, (now - startTime) / duration);
        const ease = 0.5 - Math.cos(p * Math.PI) / 2;
        globeGroup.rotation.y = startY + (targetRotY - startY) * ease;
        globeGroup.rotation.x = startX + (targetRotX - startX) * ease;

        if (p < 1) requestAnimationFrame(step);
        else {
          autoRotateResumeTimeout = setTimeout(() => {
            autoRotatePaused = false;
          }, 3500);
        }
      }
      requestAnimationFrame(step);
    };

    window.esbdToggleAutoRotate = function () {
      autoRotateEnabled = !autoRotateEnabled;
      const btn = document.getElementById('btn-toggle-rotate');
      if (btn) {
        btn.textContent = autoRotateEnabled ? '⏸ Pause Rotate' : '▶ Play Rotate';
        btn.classList.toggle('active', autoRotateEnabled);
      }
    };

    window.esbdToggleArcs = function () {
      arcsGroup.visible = !arcsGroup.visible;
      const btn = document.getElementById('btn-toggle-arcs');
      if (btn) {
        btn.classList.toggle('active', arcsGroup.visible);
      }
    };

    window.esbdToggleLayoutMode = function () {
      isHeroComposition = !isHeroComposition;
      const btn = document.getElementById('btn-toggle-layout');
      if (btn) {
        btn.textContent = isHeroComposition ? '🌐 Full Screen Mode' : '🎯 Hero Mode';
      }
    };

    // --- 16. Responsive Resize ---
    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const isDesk = width >= 1024;
      if (isHeroComposition) {
        arenaGroup.position.x = isDesk ? 2.3 : 0;
        arenaGroup.position.y = isDesk ? 0.2 : 0;
      }
    }
    window.addEventListener('resize', onResize);

    // --- 17. Animation Loop with 60fps Optimization ---
    let lastTime = performance.now();
    let isVisible = true;

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    function animate(currentTime) {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // 1. Initial Ease to Bangladesh
      if (isIntroEasing) {
        const elapsed = (currentTime - introStartTime) / 1000;
        const progress = Math.min(1, elapsed / 2.8);
        const ease = 1 - Math.pow(1 - progress, 3);
        globeGroup.rotation.y = (BD_TARGET_ROTY + 0.85) + ((BD_TARGET_ROTY) - (BD_TARGET_ROTY + 0.85)) * ease;
        globeGroup.rotation.x = (BD_TARGET_ROTX - 0.45) + ((BD_TARGET_ROTX) - (BD_TARGET_ROTX - 0.45)) * ease;
        if (progress >= 1) {
          isIntroEasing = false;
        }
      } else if (!isDragging) {
        if (Math.abs(velocityX) > 0.0001 || Math.abs(velocityY) > 0.0001) {
          globeGroup.rotation.y += velocityX;
          globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroup.rotation.x + velocityY));
          velocityX *= 0.94;
          velocityY *= 0.94;
        } else if (autoRotateEnabled && !autoRotatePaused) {
          globeGroup.rotation.y += delta * 0.065;
        }
      }

      // Scroll-driven position & scale interpolation
      if (isHeroComposition) {
        const isDesk = width >= 1024;
        const targetX = isDesk ? (2.3 + scrollProgress * 0.9) : 0;
        const targetY = isDesk ? (0.2 + scrollProgress * 1.0) : (-scrollProgress * 1.2);
        const targetScale = 1.0 - scrollProgress * 0.28;

        arenaGroup.position.x += (targetX - arenaGroup.position.x) * 0.08;
        arenaGroup.position.y += (targetY - arenaGroup.position.y) * 0.08;
        arenaGroup.scale.set(targetScale, targetScale, targetScale);
      } else {
        arenaGroup.position.x += (0 - arenaGroup.position.x) * 0.08;
        arenaGroup.position.y += (0 - arenaGroup.position.y) * 0.08;
        arenaGroup.scale.set(1.0, 1.0, 1.0);
      }

      // Mouse parallax damping
      camera.position.x += (mouseParallaxX - camera.position.x) * 0.05;
      camera.position.y += (-mouseParallaxY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // 2. Animate Arcs Photon Packets
      if (arcsGroup.visible) {
        arcPulses.forEach((ap) => {
          ap.progress = (ap.progress + delta * ap.speed) % 1;
          const pos = ap.curve.getPoint(ap.progress);
          ap.mesh.position.copy(pos);
        });
      }

      // 3. Animate Radar Rings
      radarRings.forEach((rr) => {
        const t = (currentTime * 0.001 * rr.speed + rr.offset) % 1;
        const scale = 1.0 + t * 2.6;
        rr.mesh.scale.set(scale, scale, 1);
        rr.mesh.material.opacity = (1 - t) * (rr.isHQ ? 0.9 : 0.7);
      });

      // 4. Animate Orbiting HUD Rings & Nodes
      hudRings.forEach((ring, idx) => {
        ring.rotation.z += delta * (idx === 0 ? 0.04 : -0.03);
      });

      hudNodes.forEach((node) => {
        node.phase += delta * node.speed;
        node.mesh.position.set(
          Math.cos(node.phase) * node.radius,
          Math.sin(node.phase * 1.4) * node.tilt,
          Math.sin(node.phase) * node.radius
        );
      });

      // 5. Animate Floating 3D Game Emblems
      gameEmblems.forEach((ge) => {
        ge.angle += delta * ge.speed;
        ge.mesh.position.set(
          Math.cos(ge.angle) * ge.radius,
          Math.sin(ge.angle * 1.5) * ge.tilt + Math.sin(currentTime * 0.002) * 0.1,
          Math.sin(ge.angle) * ge.radius
        );
        ge.mesh.lookAt(camera.position);
      });

      // 5.5 Animate 3D Holographic ESBD Logo Inside Globe Core
      if (logo3DGroup) {
        // Vertical micro-levitation floating in the center of the globe
        logo3DGroup.position.y = Math.sin(currentTime * 0.0016) * 0.06;

        // Counter-rotate against globe rotation so the logo always majestically faces the audience/camera,
        // with gentle 3D tilt responding to mouse parallax
        logo3DGroup.rotation.y = -globeGroup.rotation.y + Math.sin(currentTime * 0.0009) * 0.14 + mouseParallaxX * 0.45;
        logo3DGroup.rotation.x = -globeGroup.rotation.x + Math.sin(currentTime * 0.0012) * 0.08 + mouseParallaxY * 0.35;

        // Breathing scale pulse
        const logoPulse = 1.0 + Math.sin(currentTime * 0.0022) * 0.028;
        logo3DGroup.scale.set(logoPulse, logoPulse, logoPulse);

        // Counter-rotating gyroscopic rings around the "e"
        if (logoRingRed) {
          logoRingRed.rotation.z = currentTime * 0.00065;
        }
        if (logoRingGreen) {
          logoRingGreen.rotation.z = -currentTime * 0.00095;
        }

        // Pulse the circuit trace line
        if (logoCircuitLine) {
          logoCircuitLine.material.opacity = 0.82 + Math.sin(currentTime * 0.0035) * 0.16;
        }

        // Rotate and breathe holographic backing halo
        if (logoHaloMesh) {
          logoHaloMesh.rotation.z = currentTime * 0.00028;
          const haloScale = 1.0 + Math.sin(currentTime * 0.0015) * 0.08;
          logoHaloMesh.scale.set(haloScale, haloScale, 1);
        }

        // Slowly rotate facet wireframe cage
        if (innerCoreMesh) {
          innerCoreMesh.rotation.y = currentTime * 0.00035;
          innerCoreMesh.rotation.x = currentTime * 0.00025;
        }
      }

      // 6. Sparse Starfield Slow Drift
      particleField.rotation.y += delta * 0.015;

      // 7. Update Dhaka LIVE Broadcast Tag
      updateDhakaLiveTagPosition();

      // 8. Raycasting for Marker Tooltip
      raycaster.setFromCamera(mouse2D, camera);
      const intersects = raycaster.intersectObjects(markerMeshes);

      if (intersects.length > 0) {
        const hub = intersects[0].object.userData.hubData;
        if (hub && hoveredHub !== hub) {
          hoveredHub = hub;
          if (tooltip) {
            tooltip.innerHTML = `
              <div class="tooltip-header">
                <div class="tooltip-title">
                  <span style="color:${hub.isHQ ? '#ef4444' : '#10b981'};">●</span> ${hub.name}
                </div>
                <div class="tooltip-ping">⚡ ${hub.ping}</div>
              </div>
              <div class="tooltip-event">${hub.event}</div>
              <div class="tooltip-meta-grid">
                <div class="tooltip-meta-item">
                  <div class="meta-label">Online Traffic</div>
                  <div class="meta-val">${hub.players}</div>
                </div>
                <div class="tooltip-meta-item">
                  <div class="meta-label">Active Stakes</div>
                  <div class="meta-val" style="color:#10b981;">${hub.prize}</div>
                </div>
              </div>
            `;
            tooltip.classList.add('visible');
          }
        }
        updateTooltipPosition();
      } else {
        if (hoveredHub) {
          hoveredHub = null;
          if (tooltip) tooltip.classList.remove('visible');
        }
      }

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTacticalGlobe);
  } else {
    initTacticalGlobe();
  }
})();
