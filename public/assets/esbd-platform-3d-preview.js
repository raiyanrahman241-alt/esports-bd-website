/**
 * E-SPORTS BANGLADESH (ESBD) — 3D PLATFORM PREVIEW SCRIPT
 * Complete Landing Page 3D Fullness Engine & Forward/Back Scroll Velocity Dynamics
 * Universal Hero-Background System (3D Cyber Grid, Light Beams, Nebulae Everywhere)
 */

(function () {
  'use strict';

  if (window.__ESBD_PLATFORM_PREVIEW_INITIALIZED__) return;
  window.__ESBD_PLATFORM_PREVIEW_INITIALIZED__ = true;

  // ===========================================================================
  // 0. GLOBAL FULL-PAGE HERO-BACKGROUND INJECTION SYSTEM
  // ===========================================================================
  function setupFullPageHeroBackground() {
    // 1. Inject Fixed Full-Page Cyber Grid Texture (matching Hero's grid texture)
    if (!document.getElementById('esbd-fullpage-cyber-grid')) {
      const grid = document.createElement('div');
      grid.id = 'esbd-fullpage-cyber-grid';
      document.body.prepend(grid);
    }

    // 2. Expand floating cyber particles to 36 across full width
    let pContainer = document.getElementById('esbd-floating-particles');
    if (!pContainer) {
      pContainer = document.createElement('div');
      pContainer.id = 'esbd-floating-particles';
      pContainer.className = 'esbd-floating-particles';
      document.body.prepend(pContainer);
    }
    if (pContainer.childElementCount < 20) {
      pContainer.innerHTML = '';
      for (let i = 0; i < 36; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        pContainer.appendChild(p);
      }
    }

    // 3. Ensure Volumetric Light Beams are present and fixed across whole page
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

    // 4. Ensure 5-Layer Volumetric Nebulae are present
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

    // 5. AGGRESSIVE Dynamic Container Transparency Cleansing:
    // Scan EVERY element with a non-transparent computed background-color
    // and strip it, unless it belongs to a card, modal, image, or interactive widget.
    // We detect opacity > 0 via computed background-color check (rgba(r,g,b,0) = transparent).
    const allEls = document.querySelectorAll(
      'div, section, main, header, footer, article, aside'
    );
    allEls.forEach((el) => {
      // Skip background-layer elements we explicitly inject
      if (
        el.id === 'esbd-fullpage-cyber-grid' ||
        el.id === 'esbd-hero-light-beams' ||
        el.id === 'esbd-ambient-nebula' ||
        el.id === 'esbd-floating-particles' ||
        el.id === 'esbd-three-arena-canvas' ||
        el.id === 'esbd-cyber-bg'
      ) return;

      // Skip cards, modals, floating widgets, nav, and interactive elements
      if (
        el.classList.contains('bg-card') ||
        el.classList.contains('esbd-excel-podium-card') ||
        el.classList.contains('esbd-creator-card-3d') ||
        el.classList.contains('esbd-brand-card-3d') ||
        el.closest('[role="dialog"]') ||
        el.closest('.esbd-chat-panel') ||
        el.closest('#esbd-floating-chat') ||
        el.closest('.esbd-stream-modal') ||
        el.closest('nav') ||
        el.tagName === 'CANVAS' ||
        el.tagName === 'VIDEO' ||
        el.tagName === 'IMG'
      ) return;

      const cs = window.getComputedStyle(el);
      const bg = cs.backgroundColor;
      const bgImg = cs.backgroundImage;

      // Strip any opaque solid background-color (any alpha > 0)
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        el.style.setProperty('background-color', 'transparent', 'important');
      }

      // Also strip gradient-to-background overlays that cover the 3D canvas
      // e.g. bg-gradient-to-t from-background, from-[hsl(218...)], etc.
      if (bgImg && bgImg !== 'none' && (
        bgImg.includes('hsl(218') ||
        bgImg.includes('hsl(217') ||
        bgImg.includes('hsl(var(--background)') ||
        bgImg.includes('#07090c') ||
        bgImg.includes('7, 9, 12') ||
        bgImg.includes('5.5%)') ||
        bgImg.includes('6%)')
      )) {
        el.style.setProperty('background-image', 'none', 'important');
      }
    });
  }

  // ===========================================================================
  // 1. FORWARD & BACKWARD SCROLL VELOCITY ENGINE (PHYSICS & 3D MOMENTUM)
  // ===========================================================================
  let lastScrollY = window.scrollY || 0;
  let scrollVelocity = 0;
  let smoothVelocity = 0;
  let scrollDirection = 1; // 1 = down/forward, -1 = up/back
  let isScrollingTimeout = null;

  function updateScrollVelocityPhysics() {
    const currentScrollY = window.scrollY || 0;
    scrollVelocity = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Dampened interpolation
    smoothVelocity += (scrollVelocity - smoothVelocity) * 0.14;

    if (Math.abs(scrollVelocity) > 0.5) {
      scrollDirection = scrollVelocity > 0 ? 1 : -1;
      document.body.classList.add('esbd-scroll-momentum-active');
      clearTimeout(isScrollingTimeout);
      isScrollingTimeout = setTimeout(() => {
        document.body.classList.remove('esbd-scroll-momentum-active');
      }, 160);
    }

    // Dynamic tilt angles: forward scroll tilts forward (positive X), back scroll tilts back (negative X)
    const tiltDeg = Math.min(6, Math.max(-6, smoothVelocity * 0.16));
    const zPush = Math.min(22, Math.max(-22, smoothVelocity * 0.45));

    document.documentElement.style.setProperty('--esbd-scroll-velocity', smoothVelocity.toFixed(2));
    document.documentElement.style.setProperty('--esbd-scroll-dir', scrollDirection.toString());
    document.documentElement.style.setProperty('--esbd-scroll-tilt', `${tiltDeg.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--esbd-scroll-z-push', `${zPush.toFixed(1)}px`);

    requestAnimationFrame(updateScrollVelocityPhysics);
  }
  requestAnimationFrame(updateScrollVelocityPhysics);

  // ===========================================================================
  // 2. SECTION 1: REACH ("We already own the room") 3D HOLOGRAPHIC RADAR
  // ===========================================================================
  function enhanceReachSection() {
    const headings = document.querySelectorAll('h2');
    let reachTitle = null;
    headings.forEach((h) => {
      if (h.textContent.includes('We already own the room')) {
        reachTitle = h;
      }
    });

    if (!reachTitle) return;

    const grid = reachTitle.closest('.grid');
    if (!grid || !grid.children || grid.children.length < 2) return;

    const leftCol = grid.children[0];

    if (!leftCol.querySelector('.esbd-reach-radar-container')) {
      const radar = document.createElement('div');
      radar.className = 'esbd-reach-radar-container';
      radar.innerHTML = `
        <div class="esbd-reach-radar-header">
          <span>▲ LIVE REGIONAL NETWORK</span>
          <span class="esbd-radar-badge-live">
            <span class="pulse-dot"></span>
            ACTIVE NODES
          </span>
        </div>
        <div class="esbd-radar-viewport">
          <div class="esbd-radar-crosshair-x"></div>
          <div class="esbd-radar-crosshair-y"></div>
          <div class="esbd-radar-circle c1"></div>
          <div class="esbd-radar-circle c2"></div>
          <div class="esbd-radar-circle c3"></div>
          <div class="esbd-radar-sweep"></div>
          
          <!-- Hub Division Nodes across Bangladesh -->
          <div class="esbd-radar-hub-node node-dhaka" title="Dhaka Division 4.2M Players">
            <span class="esbd-hub-dot"></span>
            <span class="esbd-hub-label">DHAKA 4.2M</span>
          </div>
          <div class="esbd-radar-hub-node node-chattogram" title="Chattogram Division 1.8M Players">
            <span class="esbd-hub-dot"></span>
            <span class="esbd-hub-label">CTG 1.8M</span>
          </div>
          <div class="esbd-radar-hub-node node-sylhet" title="Sylhet Division 850K Players">
            <span class="esbd-hub-dot"></span>
            <span class="esbd-hub-label">SYLHET 850K</span>
          </div>
          <div class="esbd-radar-hub-node node-rajshahi" title="Rajshahi Division 620K Players">
            <span class="esbd-hub-dot"></span>
            <span class="esbd-hub-label">RAJ 620K</span>
          </div>
        </div>
        <div class="esbd-reach-radar-footer">
          <span>BANDWIDTH: <strong>100GBPS BACKBONE</strong></span>
          <span>PING: <strong>14MS</strong></span>
        </div>
      `;
      leftCol.appendChild(radar);
    }

    const rightCol = grid.children[1];
    if (rightCol) {
      const rows = rightCol.querySelectorAll('div, a');
      rows.forEach((row) => {
        if (row.textContent.includes('Community') || row.textContent.includes('Valorant') || row.textContent.includes('FreeFire') || row.textContent.includes('PUBG')) {
          if (row.children.length > 0 && !row.classList.contains('esbd-community-row-highlight')) {
            row.classList.add('esbd-community-row-highlight');
          }
        }
      });
    }
  }

  // ===========================================================================
  // 3. SECTION 2: WHO WE ARE ("Bangladesh's esports operator") 3D TROPHY
  // ===========================================================================
  function enhanceWhoWeAreSection() {
    const headings = document.querySelectorAll('h2');
    let whoTitle = null;
    headings.forEach((h) => {
      if (h.textContent.includes("esports operator") || h.textContent.includes("not a side project")) {
        whoTitle = h;
      }
    });

    if (!whoTitle) return;

    const grid = whoTitle.closest('.grid');
    if (!grid || !grid.children || grid.children.length < 2) return;

    const leftCol = grid.children[0];

    if (!leftCol.querySelector('.esbd-3d-trophy-container')) {
      const trophyBox = document.createElement('div');
      trophyBox.className = 'esbd-3d-trophy-container';
      trophyBox.innerHTML = `
        <div class="esbd-trophy-prism-3d">
          <div class="esbd-prism-core"></div>
          <div class="esbd-prism-ring"></div>
        </div>
        <div class="esbd-trophy-telemetry">
          <span class="title">▲ TIER-1 OPERATOR PLATFORM ▲</span>
          <div class="metric-row">
            <span>OPERATING STATUS:</span>
            <span class="metric-val">100% INDEPENDENT</span>
          </div>
          <div class="metric-row">
            <span>LAN PRODUCTION:</span>
            <span class="metric-val">BROADCAST-READY</span>
          </div>
          <div class="metric-row">
            <span>ESCROW RELIABILITY:</span>
            <span class="metric-val">99.98% AUDITED</span>
          </div>
        </div>
      `;
      leftCol.appendChild(trophyBox);
    }

    const rightCol = grid.children[1];
    if (rightCol && !rightCol.classList.contains('esbd-stat-cards-depth-system')) {
      rightCol.classList.add('esbd-stat-cards-depth-system');
    }
  }

  // ===========================================================================
  // 4. SECTION 3: HOW IT WORKS & WHERE WE EXCEL
  // ===========================================================================
  function enhanceHowItWorksAndExcel() {
    const headings = document.querySelectorAll('h2');
    headings.forEach((h) => {
      if (h.textContent.includes('From sign-up to payout')) {
        const container = h.closest('section') || h.parentElement;
        const stepsGrid = container ? container.querySelector('.grid') : null;
        if (stepsGrid && !stepsGrid.querySelector('.esbd-step-laser-conduit')) {
          const conduit = document.createElement('div');
          conduit.className = 'esbd-step-laser-conduit';
          conduit.innerHTML = `<div class="esbd-step-laser-packet"></div>`;
          stepsGrid.prepend(conduit);

          const stepDivs = stepsGrid.querySelectorAll(':scope > div');
          stepDivs.forEach((step) => {
            const firstChild = step.firstElementChild;
            if (firstChild && /^\d{2}$/.test(firstChild.textContent.trim())) {
              firstChild.classList.add('esbd-step-num-3d');
            }
          });
        }
      }

      if (h.textContent.includes('Events · Activation · Esports') || h.textContent.includes('Where we excel')) {
        const container = h.closest('section') || h.parentElement;
        const cardsGrid = container ? container.querySelector('.grid') : null;
        if (cardsGrid) {
          const cards = cardsGrid.querySelectorAll(':scope > div');
          cards.forEach((card) => {
            if (!card.classList.contains('esbd-excel-podium-card')) {
              card.classList.add('esbd-excel-podium-card');
            }
          });
        }
      }
    });
  }

  // ===========================================================================
  // 5. SECTION 4: BUILT FOR COMPETITORS (3D SECURITY SHIELD & TELEMETRY BEACONS)
  // ===========================================================================
  function enhanceCompetitorsSection() {
    const headings = document.querySelectorAll('h2');
    headings.forEach((h) => {
      if (h.textContent.includes('A platform that officiates itself')) {
        const section = h.closest('section') || h.parentElement;
        if (section && !section.querySelector('.esbd-security-backdrop-matrix')) {
          const backdrop = document.createElement('div');
          backdrop.className = 'esbd-security-backdrop-matrix';
          backdrop.innerHTML = `<div class="esbd-hex-shield-grid"></div>`;
          section.prepend(backdrop);

          const cardsGrid = section.querySelector('.grid');
          if (cardsGrid && !section.querySelector('.esbd-security-beacons-row')) {
            const beacons = document.createElement('div');
            beacons.className = 'esbd-security-beacons-row';
            beacons.innerHTML = `
              <div class="esbd-beacon-item">
                <span class="esbd-bar-dot"></span>
                <span>DHAKA SERVER NODE // <strong>128-TICK AUTH</strong></span>
              </div>
              <div class="esbd-beacon-item">
                <span class="esbd-bar-dot esbd-bar-dot-red"></span>
                <span>ESCROW SMART-LOCK // <strong>INSTANT PAYOUT</strong></span>
              </div>
            `;
            cardsGrid.parentNode.insertBefore(beacons, cardsGrid);
          }
        }
      }
    });
  }

  // ===========================================================================
  // 6. SECTION 5: THE ARENA ("Live and open tournaments") 3D TEASER PORTAL CARD
  // ===========================================================================
  function enhanceTournamentsSection() {
    const headings = document.querySelectorAll('h2');
    headings.forEach((h) => {
      if (h.textContent.includes('Live and open tournaments')) {
        const section = h.closest('section') || h.parentElement;
        const grid = section ? section.querySelector('.grid') : null;
        if (grid && !grid.querySelector('.esbd-3d-arena-teaser-card')) {
          const teaserCard = document.createElement('div');
          teaserCard.className = 'esbd-3d-arena-teaser-card';
          teaserCard.innerHTML = `
            <div class="esbd-teaser-badge">
              <span class="glow-orb"></span>
              ▲ CLASSIFIED MAJOR // Q4 LAN ▲
            </div>
            <div class="esbd-teaser-visual">
              <div class="esbd-teaser-trophy-mesh">🏆</div>
              <div class="esbd-teaser-details">
                <div class="esbd-teaser-title">Bangalore vs Dhaka Cross-Border Invitational</div>
                <div class="esbd-teaser-sub">VALORANT & CS2 // NATIONAL ARENA CHAMPIONSHIP</div>
              </div>
            </div>
            <div class="esbd-teaser-prize-row">
              <span>GUARANTEED PRIZE POOL:</span>
              <span class="esbd-teaser-prize-val">৳5,00,000</span>
            </div>
            <button class="esbd-teaser-btn" onclick="alert('ESBD Major Arena Pass: Early bird registration opens soon! You are on the priority waitlist.')">
              Get VIP Pass & Waitlist Access →
            </button>
          `;
          grid.appendChild(teaserCard);
        }
      }
    });
  }

  // ===========================================================================
  // 7. SECTION 6: TRACK RECORD ("Fourteen years on the main stage") 3D TIMELINE
  // ===========================================================================
  function enhanceTrackRecordSection() {
    const headings = document.querySelectorAll('h2');
    headings.forEach((h) => {
      if (h.textContent.includes('Fourteen years on the main stage')) {
        const section = h.closest('section') || h.parentElement;
        if (!section) return;

        if (!section.querySelector('.esbd-track-timeline-wrapper')) {
          const timeline = document.createElement('div');
          timeline.className = 'esbd-track-timeline-wrapper';
          timeline.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Geist Mono', monospace; font-size: 10px; color: #ef4444; letter-spacing: 0.14em;">
              <span>▲ HISTORICAL CHRONOLOGY ARCHIVE</span>
              <span>200+ NATIONAL LAN EXECUTIONS</span>
            </div>
            <div class="esbd-timeline-spine">
              <div class="esbd-timeline-photon"></div>
              <div class="esbd-timeline-node">
                <span class="esbd-node-year">2012</span>
                <span class="esbd-node-desc">FOUNDATION</span>
              </div>
              <div class="esbd-timeline-node">
                <span class="esbd-node-year">2016</span>
                <span class="esbd-node-desc">DHAKA LAN</span>
              </div>
              <div class="esbd-timeline-node">
                <span class="esbd-node-year">2019</span>
                <span class="esbd-node-desc">CAMPUS LADDER</span>
              </div>
              <div class="esbd-timeline-node">
                <span class="esbd-node-year">2022</span>
                <span class="esbd-node-desc">STUDIO LIVE</span>
              </div>
              <div class="esbd-timeline-node">
                <span class="esbd-node-year">2024</span>
                <span class="esbd-node-desc">128-TICK PLATFORM</span>
              </div>
              <div class="esbd-timeline-node">
                <span class="esbd-node-year">2026</span>
                <span class="esbd-node-desc">CROSS-BORDER</span>
              </div>
            </div>
          `;
          const container = section.querySelector('.mx-auto');
          if (container) {
            container.appendChild(timeline);
          }
        }

        const cards = section.querySelectorAll('.clip-corner, .group.relative');
        cards.forEach((card) => {
          if (!card.classList.contains('esbd-track-card-3d')) {
            card.classList.add('esbd-track-card-3d');
          }
        });
      }
    });
  }

  // ===========================================================================
  // 8. SECTION 7: CREATOR ROSTER ("30M+ followers on call") 3D BROADCAST
  // ===========================================================================
  function enhanceCreatorRosterSection() {
    const headings = document.querySelectorAll('h2');
    headings.forEach((h) => {
      if (h.textContent.includes('30M+ followers on call')) {
        const section = h.closest('section') || h.parentElement;
        if (!section) return;

        const container = section.querySelector('.mx-auto');
        if (container && !section.querySelector('.esbd-creator-signal-banner')) {
          const banner = document.createElement('div');
          banner.className = 'esbd-creator-signal-banner';
          banner.innerHTML = `
            <div class="esbd-creator-signal-badge">
              <span class="esbd-signal-dot"></span>
              <span>LIVE TRANSMISSION // TALENT NETWORK ACTIVE</span>
            </div>
            <div>
              <span>TOTAL INFLUENCE: <strong>32.4M COMBINED REACH</strong></span>
            </div>
          `;
          container.appendChild(banner);
        }

        const marquee = section.querySelector('.marquee-track');
        if (marquee) {
          const cards = marquee.children;
          for (let i = 0; i < cards.length; i++) {
            if (!cards[i].classList.contains('esbd-creator-card-3d')) {
              cards[i].classList.add('esbd-creator-card-3d');
            }
          }
        }
      }
    });
  }

  // ===========================================================================
  // 9. SECTION 8: TRUSTED BY 100+ BRANDS 3D PODIUMS
  // ===========================================================================
  function enhanceBrandsSection() {
    const brandHeaders = document.querySelectorAll('p');
    brandHeaders.forEach((p) => {
      if (p.textContent.includes('Trusted by 100+ brands')) {
        const section = p.closest('section');
        if (!section) return;

        const grid = section.querySelector('.grid');
        if (grid) {
          const brandBoxes = grid.querySelectorAll(':scope > div > div');
          brandBoxes.forEach((box) => {
            if (!box.classList.contains('esbd-brand-podium-3d')) {
              box.classList.add('esbd-brand-podium-3d');
            }
          });
        }
      }
    });
  }

  // ===========================================================================
  // 10. SECTION 9: PRE-FOOTER ARENA CTA 3D WARP PORTAL
  // ===========================================================================
  function enhancePreFooterPortal() {
    const headings = document.querySelectorAll('h2');
    headings.forEach((h) => {
      if (h.textContent.includes('Where Bangladesh plays for real') || h.textContent.includes('Free to enter · sponsor-funded prizes')) {
        const section = h.closest('section');
        if (section && !section.querySelector('.esbd-portal-gateway-matrix')) {
          const portal = document.createElement('div');
          portal.className = 'esbd-portal-gateway-matrix';
          portal.innerHTML = `
            <div class="esbd-portal-warp-ring r1"></div>
            <div class="esbd-portal-warp-ring r2"></div>
            <div class="esbd-portal-warp-ring r3"></div>
          `;
          section.prepend(portal);

          if (!section.querySelector('.esbd-portal-beacon-header')) {
            const beacon = document.createElement('div');
            beacon.className = 'esbd-portal-beacon-header';
            beacon.textContent = '▲ SYSTEM READY // ZERO ENTRY FEE // 100% SPONSOR ESCROW ▲';
            h.parentNode.insertBefore(beacon, h);
          }
        }
      }
    });
  }

  // ===========================================================================
  // 11. SECTION 10: GLOBAL FOOTER 3D STATUS BAR
  // ===========================================================================
  function enhanceGlobalFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    if (!footer.querySelector('.esbd-footer-status-bar')) {
      const statusBar = document.createElement('div');
      statusBar.className = 'esbd-footer-status-bar';
      statusBar.innerHTML = `
        <div>ESBD PLATFORM ENGINE // <strong>ONLINE</strong></div>
        <div>DHAKA REGION // <strong>128-TICK CLOUD</strong></div>
        <div>PAYOUT ESCROW // <strong>VERIFIED</strong></div>
      `;
      const firstChild = footer.querySelector('.mx-auto');
      if (firstChild) {
        firstChild.prepend(statusBar);
      }
    }
  }

  // ===========================================================================
  // 12. PREVIEW SCANNER & RESILIENCE RUNNER
  // ===========================================================================
  function runPreviewScanner() {
    setupFullPageHeroBackground();
    enhanceReachSection();
    enhanceWhoWeAreSection();
    enhanceHowItWorksAndExcel();
    enhanceCompetitorsSection();
    enhanceTournamentsSection();
    enhanceTrackRecordSection();
    enhanceCreatorRosterSection();
    enhanceBrandsSection();
    enhancePreFooterPortal();
    enhanceGlobalFooter();
  }

  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    runPreviewScanner();
    if (attempts > 30) clearInterval(timer);
  }, 400);

  setInterval(runPreviewScanner, 2500);

  const root = document.getElementById('root') || document.body;
  const observer = new MutationObserver(runPreviewScanner);
  observer.observe(root, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPreviewScanner);
  } else {
    runPreviewScanner();
  }
})();
