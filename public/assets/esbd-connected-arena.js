/**
 * E-SPORTS BANGLADESH (ESBD) — THE CONNECTED ARENA
 * Complete 3D Asset Engine:
 * 1. Arena Core (Signature 55% Hero Globe & International Event Arcs)
 * 2. Victory Monolith (Angular Trophy, Illuminated Slit, Floating Base)
 * 3. Signal Relay (Three Smoked Glass Panels with Live Waveforms)
 * 4. Community Constellation (District Nodes & Cyber Tethers)
 * 5. Brand Accelerator (Four Bevelled Orbiting Blocks & Light Core)
 * 6. Legacy Rail (Dimensional Illuminated Track)
 * 7. Alliance Portal (Concentric Gateway Rings & Inward Motion)
 */

(function () {
  'use strict';

  if (!window.THREE) {
    console.error('[ESBD Connected Arena] Three.js library not detected.');
    return;
  }

  const THREE = window.THREE;

  // Shared Brand Colors
  const COLOR_GREEN = new THREE.Color('#ef4444');
  const COLOR_RED = new THREE.Color('#ef4444');
  const COLOR_CYAN = new THREE.Color('#38bdf8');
  const COLOR_GOLD = new THREE.Color('#f59e0b');
  const COLOR_DARK = new THREE.Color('#07090c');
  const COLOR_GRAPHITE = new THREE.Color('#111720');

  // Convert Lat/Lon to 3D Sphere Vector
  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  // Create smooth 3D curved arc between two points on sphere
  function createCurveArc(v1, v2, altitudeFactor) {
    const distance = v1.distanceTo(v2);
    const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    const midLength = mid.length();
    mid.normalize();
    mid.multiplyScalar(midLength + distance * altitudeFactor);

    return new THREE.QuadraticBezierCurve3(v1, mid, v2);
  }

  // ===========================================================================
  // 1. ARENA CORE (HERO SIGNATURE 55% 3D GLOBE)
  // ===========================================================================
  function initHeroArenaCore() {
    const canvas = document.getElementById('hero-globe-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      console.warn('Hero globe WebGL fallback:', e);
      return;
    }

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 2.3;

    // 1. Dark Semi-transparent Sphere Base
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 48, 48);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x070c12,
      transparent: true,
      opacity: 0.88,
      wireframe: false,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // 2. Subtle Outer Wireframe Grid (Tactical Latitude/Longitude lines)
    const gridGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.002, 28, 28);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    // 3. Procedural Illuminated Land Contours & Cyber Dots
    const dotCount = 1800;
    const dotPositions = new Float32Array(dotCount * 3);
    const dotColors = new Float32Array(dotCount * 3);

    for (let i = 0; i < dotCount; i++) {
      // Golden spiral distribution across sphere
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;

      const r = GLOBE_RADIUS * 1.004;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      dotPositions[i * 3] = x;
      dotPositions[i * 3 + 1] = y;
      dotPositions[i * 3 + 2] = z;

      // Continental density bias: brighten near Eurasian / Asian clusters
      const isAsiaRegion = y > 0.2 && y < 1.4 && x > 0.1 && z > 0.2;
      const c = isAsiaRegion ? COLOR_GREEN : (Math.random() < 0.15 ? COLOR_CYAN : COLOR_GREEN);
      const intensity = isAsiaRegion ? 0.9 : 0.35;

      dotColors[i * 3] = c.r * intensity;
      dotColors[i * 3 + 1] = c.g * intensity;
      dotColors[i * 3 + 2] = c.b * intensity;
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));
    const dotMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const dotPoints = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(dotPoints);

    // 4. Bangladesh Beacon Highlight (Lat: 23.8° N, Lon: 90.4° E)
    const BD_COORDS = { lat: 23.85, lon: 90.4 };
    const bdPos = latLonToVector3(BD_COORDS.lat, BD_COORDS.lon, GLOBE_RADIUS);

    // Glowing core beacon
    const beaconGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.copy(bdPos);
    globeGroup.add(beaconMesh);

    // Vertical Laser Beacon pointing outward into space
    const laserDir = bdPos.clone().normalize();
    const laserGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.7, 8);
    laserGeo.translate(0, 0.35, 0);
    laserGeo.rotateX(Math.PI / 2);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xf87171,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.position.copy(bdPos);
    laserMesh.lookAt(bdPos.clone().add(laserDir));
    globeGroup.add(laserMesh);

    // Pulsating Beacon Wave Rings
    const beaconRings = [];
    for (let r = 0; r < 2; r++) {
      const ringGeo = new THREE.RingGeometry(0.08, 0.12, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(bdPos.clone().multiplyScalar(1.01));
      ringMesh.lookAt(bdPos.clone().multiplyScalar(2));
      globeGroup.add(ringMesh);
      beaconRings.push({ mesh: ringMesh, offset: r * 0.5 });
    }

    // 5. Thin Connection Arcs to International Esports Event Hubs
    const internationalHubs = [
      { name: 'Singapore (SEA Major)', lat: 1.35, lon: 103.82 },
      { name: 'Bali / Jakarta (IESF 2023)', lat: -8.41, lon: 115.19 },
      { name: 'Birmingham, UK (Commonwealth 2022)', lat: 52.48, lon: -1.89 },
      { name: 'Riyadh (EWC)', lat: 24.71, lon: 46.67 },
      { name: 'Seoul (Championships)', lat: 37.57, lon: 126.98 },
    ];

    const arcPulses = [];

    internationalHubs.forEach((hub) => {
      const destPos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS);

      // Destination pin
      const pinGeo = new THREE.SphereGeometry(0.05, 12, 12);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(destPos);
      globeGroup.add(pin);

      // 3D Parabolic Arc Curve
      const curve = createCurveArc(bdPos, destPos, 0.35);
      const curvePoints = curve.getPoints(50);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const curveMat = new THREE.LineBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.55,
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      globeGroup.add(arcLine);

      // Travelling Light Pulse along the Arc
      const pulseGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.95,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      globeGroup.add(pulseMesh);

      arcPulses.push({
        curve: curve,
        mesh: pulseMesh,
        speed: 0.25 + Math.random() * 0.15,
        progress: Math.random(),
      });
    });

    // 6. Two Tilted Metallic Orbital Rings with Gaps & Pulses
    const rings = [];
    const ringConfig = [
      { radius: 3.1, tube: 0.016, rx: Math.PI / 2.3, rz: 0.25, color: COLOR_GREEN },
      { radius: 3.5, tube: 0.012, rx: Math.PI / 1.7, rz: -0.35, color: COLOR_CYAN },
    ];

    ringConfig.forEach((cfg) => {
      const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 8, 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.set(cfg.rx, 0, cfg.rz);
      globeGroup.add(ringMesh);
      rings.push(ringMesh);
    });

    // 7. Soft Atmospheric Emerald Halo
    const haloGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.065,
      side: THREE.BackSide,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // Initial globe tilt to frame Bangladesh prominently towards camera
    globeGroup.rotation.x = 0.25;
    globeGroup.rotation.y = -1.55;

    // Pointer Parallax
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    window.addEventListener(
      'pointermove',
      (e) => {
        mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
      },
      { passive: true }
    );

    // Resize Handler
    window.addEventListener('resize', () => {
      width = container.clientWidth || 600;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    // Scroll Pullback Integration
    let currentScrollY = 0;
    window.addEventListener(
      'scroll',
      () => {
        currentScrollY = window.scrollY || 0;
      },
      { passive: true }
    );

    // Animation Loop
    let clock = 0;
    function animateHero() {
      requestAnimationFrame(animateHero);
      clock += 0.016;

      // Pointer easing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Slow constant majestic rotation + pointer parallax
      globeGroup.rotation.y = -1.55 + clock * 0.08 + mouse.x;
      globeGroup.rotation.x = 0.25 + Math.sin(clock * 0.4) * 0.03 + mouse.y;

      // Scroll camera pullback: camera smoothly steps back as user scrolls
      const scrollFactor = Math.min(1, currentScrollY / 1000);
      camera.position.z = 7.8 + scrollFactor * 1.4;

      // Beacon ring expansion
      beaconRings.forEach((br) => {
        const t = (clock * 1.5 + br.offset) % 1;
        br.mesh.scale.setScalar(1 + t * 2.2);
        br.mesh.material.opacity = Math.max(0, 0.8 * (1 - t));
      });

      // Travelling arc light pulses
      arcPulses.forEach((ap) => {
        ap.progress = (ap.progress + 0.008 * ap.speed) % 1;
        const pt = ap.curve.getPoint(ap.progress);
        ap.mesh.position.copy(pt);
      });

      // Orbital rings rotation
      rings.forEach((r, idx) => {
        r.rotation.z += 0.002 * (idx + 1);
      });

      renderer.render(scene, camera);
    }
    animateHero();
  }

  // ===========================================================================
  // 2. VICTORY MONOLITH (FEATURED EVENTS)
  // ===========================================================================
  function initVictoryMonolith() {
    const canvas = document.getElementById('victory-monolith-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth || 340;
    let height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.5, 4.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      return;
    }

    const monolithGroup = new THREE.Group();
    scene.add(monolithGroup);

    // 1. Angular Monolith Body (Faceted crystalline trophy)
    const bodyGeo = new THREE.CylinderGeometry(0.45, 0.85, 2.2, 5);
    const bodyMat = new THREE.MeshBasicMaterial({
      color: 0x141a22,
      wireframe: false,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    monolithGroup.add(bodyMesh);

    // Wireframe edges for metallic highlight
    const wireGeo = new THREE.WireframeGeometry(bodyGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.65 });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    monolithGroup.add(wireMesh);

    // 2. Central Illuminated Slit
    const slitGeo = new THREE.BoxGeometry(0.06, 1.8, 0.95);
    const slitMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.95,
    });
    const slitMesh = new THREE.Mesh(slitGeo, slitMat);
    monolithGroup.add(slitMesh);

    // 3. Floating Base Plinth
    const plinthGeo = new THREE.CylinderGeometry(1.0, 1.2, 0.15, 6);
    const plinthMat = new THREE.MeshBasicMaterial({ color: 0x090d12 });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = -1.4;
    monolithGroup.add(plinthMesh);

    // Floating Electromagnetic Ring under base
    const ringGeo = new THREE.RingGeometry(0.8, 1.1, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.55;
    monolithGroup.add(ringMesh);

    window.addEventListener('resize', () => {
      width = container.clientWidth || 340;
      height = container.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    let clock = 0;
    function animateMonolith() {
      requestAnimationFrame(animateMonolith);
      clock += 0.016;

      // Slow majestic rotation
      monolithGroup.rotation.y = clock * 0.35;

      // Vertical micro-levitation bobbing
      bodyMesh.position.y = Math.sin(clock * 1.5) * 0.08;
      wireMesh.position.y = bodyMesh.position.y;
      slitMesh.position.y = bodyMesh.position.y;

      // Slit intensity breathing
      slitMat.opacity = 0.75 + Math.sin(clock * 3) * 0.2;

      renderer.render(scene, camera);
    }
    animateMonolith();
  }

  // ===========================================================================
  // 3. SIGNAL RELAY (BROADCASTING CONSOLE)
  // ===========================================================================
  function initSignalRelay() {
    const canvas = document.getElementById('signal-relay-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth || 380;
    let height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 30);
    camera.position.set(0, 0, 3.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      return;
    }

    const relayGroup = new THREE.Group();
    scene.add(relayGroup);

    // Three Offset Translucent Smoked Glass Panels
    const panels = [];
    const panelConfigs = [
      { z: -0.4, x: -0.3, y: 0.1, color: COLOR_GREEN },
      { z: 0.0, x: 0.0, y: 0.0, color: COLOR_CYAN },
      { z: 0.4, x: 0.3, y: -0.1, color: COLOR_GREEN },
    ];

    panelConfigs.forEach((cfg) => {
      const pGeo = new THREE.PlaneGeometry(2.2, 0.9);
      const pMat = new THREE.MeshBasicMaterial({
        color: 0x0d131a,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(cfg.x, cfg.y, cfg.z);
      relayGroup.add(pMesh);

      // Frame Border
      const frameGeo = new THREE.WireframeGeometry(pGeo);
      const frameMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.4,
      });
      const frame = new THREE.LineSegments(frameGeo, frameMat);
      frame.position.copy(pMesh.position);
      relayGroup.add(frame);

      // Waveform line on panel
      const wavePoints = [];
      const numPts = 32;
      for (let i = 0; i < numPts; i++) {
        wavePoints.push(new THREE.Vector3((i / numPts - 0.5) * 2.0, 0, cfg.z + 0.01));
      }
      const waveGeo = new THREE.BufferGeometry().setFromPoints(wavePoints);
      const waveMat = new THREE.LineBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.85 });
      const waveLine = new THREE.Line(waveGeo, waveMat);
      relayGroup.add(waveLine);

      panels.push({ line: waveLine, pts: wavePoints, geo: waveGeo, offset: cfg.z });
    });

    relayGroup.rotation.y = 0.35;
    relayGroup.rotation.x = 0.15;

    window.addEventListener('resize', () => {
      width = container.clientWidth || 380;
      height = container.clientHeight || 200;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    let clock = 0;
    function animateRelay() {
      requestAnimationFrame(animateRelay);
      clock += 0.02;

      // Update animated waveforms across panels
      panels.forEach((p, pIdx) => {
        const positions = p.geo.attributes.position.array;
        for (let i = 0; i < p.pts.length; i++) {
          const x = (i / p.pts.length - 0.5) * 2.0;
          const y = Math.sin(x * 6 + clock * 4 + p.offset * 2) * 0.22 * Math.sin(clock * 2 + pIdx);
          positions[i * 3 + 1] = y;
        }
        p.geo.attributes.position.needsUpdate = true;
      });

      relayGroup.rotation.y = 0.35 + Math.sin(clock * 0.5) * 0.08;

      renderer.render(scene, camera);
    }
    animateRelay();
  }

  // ===========================================================================
  // 4. COMMUNITY CONSTELLATION (COMMUNITIES)
  // ===========================================================================
  function initCommunityConstellation() {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth || 380;
    let height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 40);
    camera.position.set(0, 0, 4.6);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      return;
    }

    const constGroup = new THREE.Group();
    scene.add(constGroup);

    // Bangladesh Regional Gaming Nodes (Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur)
    const nodes = [
      { name: 'Dhaka (HQ)', x: 0.1, y: 0.1, z: 0.15, size: 0.08, color: COLOR_GREEN },
      { name: 'Chattogram', x: 0.5, y: -0.4, z: 0.05, size: 0.06, color: COLOR_CYAN },
      { name: 'Sylhet', x: 0.6, y: 0.5, z: -0.1, size: 0.06, color: COLOR_GREEN },
      { name: 'Rajshahi', x: -0.5, y: 0.3, z: 0.0, size: 0.06, color: COLOR_GOLD },
      { name: 'Khulna', x: -0.3, y: -0.3, z: 0.1, size: 0.06, color: COLOR_CYAN },
      { name: 'Barishal', x: -0.05, y: -0.5, z: 0.08, size: 0.05, color: COLOR_GREEN },
      { name: 'Rangpur', x: -0.4, y: 0.8, z: -0.05, size: 0.06, color: COLOR_RED },
      { name: 'Mymensingh', x: 0.05, y: 0.5, z: 0.0, size: 0.05, color: COLOR_GREEN },
    ];

    const nodeMeshes = [];
    nodes.forEach((n) => {
      const geo = new THREE.SphereGeometry(n.size, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: n.color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(n.x * 1.6, n.y * 1.6, n.z * 1.6);
      constGroup.add(mesh);
      nodeMeshes.push({ mesh, origY: mesh.position.y });
    });

    // Constellation Interconnecting Filaments
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.45,
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodeMeshes[i].mesh.position.distanceTo(nodeMeshes[j].mesh.position);
        if (dist < 1.6) {
          const lGeo = new THREE.BufferGeometry().setFromPoints([
            nodeMeshes[i].mesh.position,
            nodeMeshes[j].mesh.position,
          ]);
          const line = new THREE.Line(lGeo, lineMat);
          constGroup.add(line);
        }
      }
    }

    // Concentric boundary aura
    const auraGeo = new THREE.TorusGeometry(1.6, 0.008, 8, 64);
    const auraMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.25 });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    constGroup.add(aura);

    window.addEventListener('resize', () => {
      width = container.clientWidth || 380;
      height = container.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    let clock = 0;
    function animateConstellation() {
      requestAnimationFrame(animateConstellation);
      clock += 0.016;

      constGroup.rotation.y = clock * 0.2;
      constGroup.rotation.x = Math.sin(clock * 0.3) * 0.1;

      nodeMeshes.forEach((nm, idx) => {
        nm.mesh.position.y = nm.origY + Math.sin(clock * 2 + idx) * 0.04;
      });

      renderer.render(scene, camera);
    }
    animateConstellation();
  }

  // ===========================================================================
  // 5. BRAND ACCELERATOR (SERVICES)
  // ===========================================================================
  function initBrandAccelerator() {
    const canvas = document.getElementById('brand-accelerator-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth || 380;
    let height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 30);
    camera.position.set(0, 0, 4.4);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      return;
    }

    const accelGroup = new THREE.Group();
    scene.add(accelGroup);

    // Central Incandescent Light Core
    const coreGeo = new THREE.IcosahedronGeometry(0.35, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    accelGroup.add(coreMesh);

    // Four Suspended Bevelled Metallic Blocks
    const blocks = [];
    for (let i = 0; i < 4; i++) {
      const bGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
      const bMat = new THREE.MeshBasicMaterial({ color: 0x17212d });
      const bMesh = new THREE.Mesh(bGeo, bMat);

      const wireGeo = new THREE.WireframeGeometry(bGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
      const wire = new THREE.LineSegments(wireGeo, wireMat);
      bMesh.add(wire);

      accelGroup.add(bMesh);
      blocks.push({
        mesh: bMesh,
        angle: (i / 4) * Math.PI * 2,
        radius: 1.25,
        speed: 0.6 + i * 0.1,
      });
    }

    window.addEventListener('resize', () => {
      width = container.clientWidth || 380;
      height = container.clientHeight || 480;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    let clock = 0;
    function animateAccelerator() {
      requestAnimationFrame(animateAccelerator);
      clock += 0.016;

      coreMesh.rotation.y = clock * 0.8;
      coreMesh.rotation.x = clock * 0.5;

      blocks.forEach((b, idx) => {
        const theta = b.angle + clock * b.speed;
        b.mesh.position.set(
          Math.cos(theta) * b.radius,
          Math.sin(theta * 1.5) * 0.45,
          Math.sin(theta) * b.radius
        );
        b.mesh.rotation.x = clock + idx;
        b.mesh.rotation.y = clock * 1.2;
      });

      accelGroup.rotation.y = clock * 0.15;

      renderer.render(scene, camera);
    }
    animateAccelerator();
  }

  // ===========================================================================
  // 6. ALLIANCE PORTAL (CONTACT GATEWAY)
  // ===========================================================================
  function initAlliancePortal() {
    const canvas = document.getElementById('alliance-portal-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 40);
    camera.position.set(0, 0, 4.6);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      return;
    }

    const portalGroup = new THREE.Group();
    scene.add(portalGroup);

    // Segmented Outer Ring
    const outerRingGeo = new THREE.TorusGeometry(1.6, 0.06, 12, 48);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    portalGroup.add(outerRing);

    // Intermediate Concentric Ring
    const midRingGeo = new THREE.TorusGeometry(1.2, 0.04, 10, 36);
    const midRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const midRing = new THREE.Mesh(midRingGeo, midRingMat);
    portalGroup.add(midRing);

    // Inner Radiant Gateway Ring
    const innerRingGeo = new THREE.TorusGeometry(0.8, 0.03, 8, 32);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    portalGroup.add(innerRing);

    // Inward Light Vortex Particles
    const pCount = 180;
    const pPositions = new Float32Array(pCount * 3);
    const pSpeeds = [];

    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.5 + Math.random() * 1.4;
      pPositions[i * 3] = Math.cos(angle) * dist;
      pPositions[i * 3 + 1] = Math.sin(angle) * dist;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      pSpeeds.push({ angle, dist, speed: 0.008 + Math.random() * 0.012 });
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xef4444,
      transparent: true,
      opacity: 0.8,
    });
    const pPoints = new THREE.Points(pGeo, pMat);
    portalGroup.add(pPoints);

    portalGroup.rotation.x = 0.2;

    window.addEventListener('resize', () => {
      width = container.clientWidth || 500;
      height = container.clientHeight || 480;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    let clock = 0;
    function animatePortal() {
      requestAnimationFrame(animatePortal);
      clock += 0.016;

      outerRing.rotation.z = clock * 0.2;
      midRing.rotation.z = -clock * 0.35;
      innerRing.rotation.z = clock * 0.5;

      // Inward spiraling motion
      const positions = pGeo.attributes.position.array;
      pSpeeds.forEach((p, idx) => {
        p.dist -= p.speed;
        if (p.dist < 0.2) p.dist = 1.6;
        p.angle += 0.02;
        positions[idx * 3] = Math.cos(p.angle) * p.dist;
        positions[idx * 3 + 1] = Math.sin(p.angle) * p.dist;
      });
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    animatePortal();
  }

  // ===========================================================================
  // INITIALIZATION ON DOM READY
  // ===========================================================================
  function initAllConnectedArena() {
    initHeroArenaCore();
    initVictoryMonolith();
    initSignalRelay();
    initCommunityConstellation();
    initBrandAccelerator();
    initAlliancePortal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllConnectedArena);
  } else {
    initAllConnectedArena();
  }
})();
