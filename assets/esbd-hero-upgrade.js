/**
 * ESBD — PREMIUM HERO & FULL-PAGE ATMOSPHERE ENGINE
 * Adds deep cosmic atmosphere, 3D logo inside globe, enhanced particles,
 * premium scroll effects, and spacious section dividers.
 * Works alongside existing esbd-platform-3d.js — does NOT replace it.
 */
(function () {
  'use strict';

  if (window.__ESBD_HERO_UPGRADE_INITIALIZED__) return;
  window.__ESBD_HERO_UPGRADE_INITIALIZED__ = true;

  // ==========================================================================
  // 1. INJECT DEEP COSMIC ATMOSPHERE LAYERS
  // ==========================================================================
  function injectDeepAtmosphere() {
    if (document.getElementById('esbd-deep-atmosphere')) return;

    const atmo = document.createElement('div');
    atmo.id = 'esbd-deep-atmosphere';
    atmo.className = 'esbd-deep-atmosphere';
    atmo.innerHTML = `
      <div class="nebula-layer nebula-emerald-primary"></div>
      <div class="nebula-layer nebula-crimson-core"></div>
      <div class="nebula-layer nebula-cyan-accent"></div>
      <div class="nebula-layer nebula-gold-subtle"></div>
      <div class="nebula-layer nebula-deep-space"></div>
    `;
    document.body.prepend(atmo);
  }

  // ==========================================================================
  // 2. INJECT FLOATING CSS PARTICLES
  // ==========================================================================
  function injectFloatingParticles() {
    if (document.getElementById('esbd-floating-particles')) return;

    const container = document.createElement('div');
    container.id = 'esbd-floating-particles';
    container.className = 'esbd-floating-particles';

    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      container.appendChild(p);
    }
    document.body.prepend(container);
  }

  // ==========================================================================
  // 3. INJECT HERO LIGHT BEAMS
  // ==========================================================================
  function injectHeroLightBeams() {
    if (document.getElementById('esbd-hero-light-beams')) return;

    const beams = document.createElement('div');
    beams.id = 'esbd-hero-light-beams';
    beams.className = 'esbd-hero-light-beams';
    beams.innerHTML = `
      <div class="beam"></div>
      <div class="beam"></div>
      <div class="beam"></div>
    `;
    document.body.prepend(beams);
  }

  // ==========================================================================
  // 4. 3D LOGO INSIDE THE GLOBE (via Three.js Sprite in the scene)
  // ==========================================================================
  function inject3DLogoInGlobe() {
    if (window.__ESBD_LOGO_IN_GLOBE__) return;

    // Wait for Three.js arena to be initialized
    function tryInject() {
      const THREE = window.THREE;
      if (!THREE) { setTimeout(tryInject, 500); return; }

      // Access the existing scene and arena group from esbd-platform-3d.js
      // The globe's arenaGroup is added to the scene — we need to find it
      const canvas = document.getElementById('esbd-three-arena-canvas');
      if (!canvas) { setTimeout(tryInject, 500); return; }

      // Load logo texture
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('/img/3d-logo/esbd-3d-logo-emerald.png', function(texture) {
        texture.colorSpace = THREE.SRGBColorSpace || 'srgb';

        // Create a plane mesh to hold the logo inside the globe
        const aspect = texture.image.width / texture.image.height;
        const logoWidth = 1.6;
        const logoHeight = logoWidth / aspect;

        const logoGeo = new THREE.PlaneGeometry(logoWidth, logoHeight);
        const logoMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.92,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        const logoMesh = new THREE.Mesh(logoGeo, logoMat);
        logoMesh.renderOrder = 999;

        // Find the arena group in the scene
        // The scene is referenced by the renderer
        const renderer = canvas.__renderer || null;
        let scene = null;
        let arenaGroup = null;

        // Access via the global scope — the platform script stores these in closure
        // We'll traverse the scene children to find the arena group
        // Alternative: add the logo mesh to a new group positioned at the globe
        
        // Create a separate scene overlay approach — add mesh that tracks globe position
        const logoContainer = new THREE.Group();
        logoContainer.add(logoMesh);

        // We need to add this to the scene — the scene is used by the renderer
        // Since the renderer renders to the canvas, we can check WebGL context
        // Simpler approach: poll for the scene via the global animation loop
        
        let added = false;
        function addToScene() {
          if (added) return;
          
          // The esbd-platform-3d.js uses module-scoped vars, not accessible.
          // Instead, create our own mini-scene that renders on top of the same canvas.
          // OR: Use a CSS3D approach with a positioned overlay that composites correctly.
          
          // Best approach: Create a small secondary canvas overlay
          const overlayCanvas = document.createElement('canvas');
          overlayCanvas.id = 'esbd-logo-overlay-canvas';
          overlayCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1;
            opacity: 0.95;
          `;
          document.body.insertBefore(overlayCanvas, canvas.nextSibling);

          const logoRenderer = new THREE.WebGLRenderer({
            canvas: overlayCanvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          });
          logoRenderer.setClearColor(0x000000, 0);
          logoRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          logoRenderer.setSize(window.innerWidth, window.innerHeight);

          const logoScene = new THREE.Scene();
          const logoCamera = new THREE.PerspectiveCamera(
            window.innerWidth < 768 ? 56 : 42,
            window.innerWidth / window.innerHeight,
            0.1, 1000
          );
          logoCamera.position.set(0, 0, 9.2);

          // Add the logo group to the logo scene
          logoScene.add(logoContainer);

          // Add a subtle glow ring around the logo
          const glowGeo = new THREE.RingGeometry(0.7, 0.85, 64);
          const glowMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#10b981'),
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
          });
          const glowRing = new THREE.Mesh(glowGeo, glowMat);
          logoContainer.add(glowRing);

          // Resize handler
          window.addEventListener('resize', () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            logoCamera.aspect = w / h;
            logoCamera.fov = w < 768 ? 56 : 42;
            logoCamera.updateProjectionMatrix();
            logoRenderer.setSize(w, h);
          });

          // Mouse tracking (same as main scene)
          let mx = 0, my = 0, tmx = 0, tmy = 0;
          window.addEventListener('pointermove', (e) => {
            tmx = (e.clientX / window.innerWidth - 0.5) * 0.8;
            tmy = (e.clientY / window.innerHeight - 0.5) * 0.6;
          }, { passive: true });

          let scrollYSmooth = window.scrollY || 0;
          let clock = 0;

          function animateLogo() {
            requestAnimationFrame(animateLogo);
            clock += 0.016;

            mx += (tmx - mx) * 0.05;
            my += (tmy - my) * 0.05;

            const targetScrollY = window.scrollY || 0;
            scrollYSmooth += (targetScrollY - scrollYSmooth) * 0.08;

            const docHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
            const p = Math.min(1, Math.max(0, scrollYSmooth / docHeight));

            // Mirror globe position path from esbd-platform-3d.js
            let gx, gy, gz;
            if (p < 0.25) {
              const t = p / 0.25;
              gx = 2.4 + (-2.2 - 2.4) * t;
              gy = 0.25 + (-0.3 - 0.25) * t;
              gz = 0 + 0.4 * t;
            } else if (p < 0.5) {
              const t = (p - 0.25) / 0.25;
              gx = -2.2 + (2.2 + 2.2) * t;
              gy = -0.3 + (0.45 + 0.3) * t;
              gz = 0.4 + (-0.3 - 0.4) * t;
            } else if (p < 0.75) {
              const t = (p - 0.5) / 0.25;
              gx = 2.2 + (-2.0 - 2.2) * t;
              gy = 0.45 + (0.1 - 0.45) * t;
              gz = -0.3 + (0.3 + 0.3) * t;
            } else {
              const t = (p - 0.75) / 0.25;
              gx = -2.0 + (0 + 2.0) * t;
              gy = 0.1 + (-0.4 - 0.1) * t;
              gz = 0.3 + (-0.9 - 0.3) * t;
            }

            // Smooth glide
            logoContainer.position.x += (gx - logoContainer.position.x) * 0.06;
            logoContainer.position.y += (gy - logoContainer.position.y) * 0.06;
            logoContainer.position.z += (gz - logoContainer.position.z) * 0.06;

            // Subtle rotation matching globe but slower
            logoContainer.rotation.y = clock * 0.06 + mx * 0.3;
            logoContainer.rotation.x = Math.sin(clock * 0.15) * 0.04 + my * 0.2;

            // Logo pulsing scale
            const pulse = 1 + Math.sin(clock * 1.2) * 0.03;
            logoMesh.scale.setScalar(pulse);

            // Glow ring rotation
            glowRing.rotation.z = clock * 0.3;
            glowRing.scale.setScalar(1 + Math.sin(clock * 0.8) * 0.1);

            // Fade logo when scrolled far
            const fadeOpacity = Math.max(0, 1 - p * 3);
            logoMat.opacity = 0.92 * fadeOpacity;
            glowMat.opacity = 0.3 * fadeOpacity;

            if (fadeOpacity < 0.01) {
              overlayCanvas.style.display = 'none';
            } else {
              overlayCanvas.style.display = '';
            }

            logoRenderer.render(logoScene, logoCamera);
          }

          requestAnimationFrame(animateLogo);
          added = true;
          window.__ESBD_LOGO_IN_GLOBE__ = true;
        }

        addToScene();
      });
    }

    setTimeout(tryInject, 1000);
  }

  // ==========================================================================
  // 5. PREMIUM SECTION DIVIDERS (replacing repetitive bars)
  // ==========================================================================
  function injectPremiumDividers() {
    const sections = document.querySelectorAll('#root section, main section');
    
    sections.forEach((sec, idx) => {
      if (idx === 0) return; // Skip hero
      if (sec.dataset.esbdPremiumDivider === 'true') return;
      if (sec.offsetHeight < 100) return;
      
      // Check if there's already a premium divider before this section
      const prev = sec.previousElementSibling;
      if (prev && prev.classList && prev.classList.contains('esbd-premium-divider')) return;

      sec.dataset.esbdPremiumDivider = 'true';

      const divider = document.createElement('div');
      divider.className = 'esbd-premium-divider';
      divider.innerHTML = '<div class="divider-runner"></div>';
      sec.parentNode.insertBefore(divider, sec);
    });
  }

  // ==========================================================================
  // 6. ENHANCE STAT NUMBERS WITH GLOW
  // ==========================================================================
  function enhanceStatNumbers() {
    // Find stat/counter elements and add glow
    const statElements = document.querySelectorAll(
      '[class*="text-primary"], [class*="text-emerald"], .esbd-prize-glow'
    );
    statElements.forEach(el => {
      if (el.dataset.esbdStatGlow === 'true') return;
      el.dataset.esbdStatGlow = 'true';
      el.classList.add('esbd-stat-highlight');
    });

    // Target large number displays
    const allText = document.querySelectorAll('h2, h3, span, div');
    allText.forEach(el => {
      if (el.children.length > 2) return;
      if (el.dataset.esbdStatGlow === 'true') return;
      const text = (el.textContent || '').trim();
      // Match patterns like "1,200+", "85K", "৳2.5Cr", "200+", "15+"
      if (/^[\d৳,\.]+[\+KkMm]?[Cc]?[Rr]?$/.test(text) || /^\d+\+?$/.test(text)) {
        const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
        if (fontSize >= 24) {
          el.dataset.esbdStatGlow = 'true';
          el.classList.add('esbd-stat-highlight');
        }
      }
    });
  }

  // ==========================================================================
  // 7. ENHANCED THREE.JS STARFIELD (boost existing if available)
  // ==========================================================================
  function enhanceStarfield() {
    // Boost the existing starfield opacity and add more cosmic depth
    const canvas = document.getElementById('esbd-three-arena-canvas');
    if (canvas) {
      canvas.style.opacity = '1';
    }

    // Boost nebula glow opacity
    const nebula = document.getElementById('esbd-ambient-nebula');
    if (nebula) {
      nebula.style.opacity = '1';
      const glows = nebula.querySelectorAll('.esbd-nebula-glow');
      glows.forEach(g => {
        g.style.opacity = '0.55';
      });
    }
  }

  // ==========================================================================
  // 8. REMOVE REDUNDANT BAR SECTIONS
  // ==========================================================================
  function cleanupRedundantBars() {
    // Find consecutive identical bars and hide them
    const bars = document.querySelectorAll('.esbd-3d-animated-bar');
    let lastBarText = '';
    bars.forEach((bar, idx) => {
      const text = (bar.textContent || '').trim().substring(0, 50);
      if (idx > 0 && text === lastBarText) {
        bar.style.display = 'none';
      }
      lastBarText = text;
    });
  }

  // ==========================================================================
  // 9. MASTER INITIALIZATION
  // ==========================================================================
  function init() {
    injectDeepAtmosphere();
    injectFloatingParticles();
    injectHeroLightBeams();
    inject3DLogoInGlobe();
    enhanceStarfield();

    // Wait for React content to render then enhance
    setTimeout(() => {
      injectPremiumDividers();
      enhanceStatNumbers();
      cleanupRedundantBars();
    }, 2000);

    // Re-scan on mutations
    const observer = new MutationObserver(() => {
      enhanceStatNumbers();
      cleanupRedundantBars();
    });
    const root = document.getElementById('root') || document.body;
    observer.observe(root, { childList: true, subtree: true });

    // Periodic re-scan for dynamic content
    setInterval(() => {
      injectPremiumDividers();
      enhanceStatNumbers();
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
