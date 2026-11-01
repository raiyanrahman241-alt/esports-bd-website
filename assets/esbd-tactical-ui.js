/**
 * E-SPORTS BANGLADESH (ESBD) — TACTICAL COMMAND CENTER UI CONTROLLER
 * Handles:
 * - Live score ticker bar
 * - Esports reticle cursor
 * - 3D card tilt with specular highlight
 * - Animated numerical counters
 * - Magnetic buttons & glow sweeps
 */

(function () {
  'use strict';

  // --- 1. Custom Esports Reticle Cursor ---
  function setupReticleCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cursor = document.getElementById('tactical-reticle-cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = 'tactical-reticle-cursor';
      document.body.appendChild(cursor);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      // Smooth lerp
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Expand over clickable elements
    const interactiveSelectors = 'a, button, input, select, .tactical-control-btn, .tactical-glass, [data-testid="tournament-card"], [role="button"]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursor.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursor.classList.remove('hovering');
      }
    });
  }

  // --- 2. Live Scores & Announcements Ticker ---
  function setupLiveTicker() {
    if (document.getElementById('esbd-live-ticker')) return;

    const nav = document.querySelector('header') || document.querySelector('nav') || document.body.firstElementChild;
    const ticker = document.createElement('div');
    ticker.id = 'esbd-live-ticker';
    ticker.innerHTML = `
      <div class="ticker-label"><span class="ticker-tag-live">● LIVE HUD</span> TOURNAMENT RADAR</div>
      <div class="ticker-track">
        <span class="ticker-item"><span class="ticker-tag-live">🔴 FREE FIRE PRO LEAGUE:</span> RedX vs Venom Esports (Round 4: 16 - 12) <span class="ticker-sep">|</span></span>
        <span class="ticker-item"><span class="ticker-tag-bdt">🏆 SEASON PRIZE POOL:</span> ৳2,50,00,000 BDT Active Across 16 Official Circuits <span class="ticker-sep">|</span></span>
        <span class="ticker-item"><span class="ticker-tag-live">⚡ PUBG MOBILE ELITE:</span> Dhaka Regional Lobby #104 Starting in 4m 20s <span class="ticker-sep">|</span></span>
        <span class="ticker-item"><span class="ticker-tag-bdt">🎮 VALORANT BD MASTERS:</span> Team Alpha leads Lower Bracket Final 12 - 9 <span class="ticker-sep">|</span></span>
        <span class="ticker-item"><span class="ticker-tag-live">🔴 CS2 DHAKA SHOWDOWN:</span> Overtime Match 15 - 15 on Mirage <span class="ticker-sep">|</span></span>
        <span class="ticker-item"><span class="ticker-tag-bdt">🛡️ ANTI-CHEAT RADAR:</span> 100% Server-Side Referee Verified Match Verification <span class="ticker-sep">|</span></span>
        <!-- Duplicate loop for seamless scroll -->
        <span class="ticker-item"><span class="ticker-tag-live">🔴 FREE FIRE PRO LEAGUE:</span> RedX vs Venom Esports (Round 4: 16 - 12) <span class="ticker-sep">|</span></span>
        <span class="ticker-item"><span class="ticker-tag-bdt">🏆 SEASON PRIZE POOL:</span> ৳2,50,00,000 BDT Active Across 16 Official Circuits <span class="ticker-sep">|</span></span>
        <span class="ticker-item"><span class="ticker-tag-live">⚡ PUBG MOBILE ELITE:</span> Dhaka Regional Lobby #104 Starting in 4m 20s <span class="ticker-sep">|</span></span>
        <span class="ticker-item"><span class="ticker-tag-bdt">🎮 VALORANT BD MASTERS:</span> Team Alpha leads Lower Bracket Final 12 - 9 <span class="ticker-sep">|</span></span>
        <span class="ticker-item"><span class="ticker-tag-live">🔴 CS2 DHAKA SHOWDOWN:</span> Overtime Match 15 - 15 on Mirage <span class="ticker-sep">|</span></span>
        <span class="ticker-item"><span class="ticker-tag-bdt">🛡️ ANTI-CHEAT RADAR:</span> 100% Server-Side Referee Verified Match Verification <span class="ticker-sep">|</span></span>
      </div>
    `;

    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(ticker, nav.nextSibling);
    } else {
      document.body.prepend(ticker);
    }
  }

  // --- 3. 3D Tilt Cards with Specular Highlight Reflection ---
  function setup3DTiltCards() {
    const cardSelectors = '[data-testid="tournament-card"], .tournament-card, .tactical-glass, .stat-card';
    const cards = document.querySelectorAll(cardSelectors);

    cards.forEach((card) => {
      // Inject specular highlight container if missing
      if (!card.querySelector('.tilt-specular')) {
        const specular = document.createElement('div');
        specular.className = 'tilt-specular';
        card.appendChild(specular);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7.5;
        const rotateY = ((x - centerX) / centerX) * 7.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.015)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      });
    });
  }

  // --- 4. Animated Numerical Stat Counters ---
  function setupAnimatedCounters() {
    const counters = document.querySelectorAll('.animate-counter, [data-counter-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter-target') || el.textContent.replace(/[^0-9.]/g, ''));
          const prefix = el.getAttribute('data-counter-prefix') || '';
          const suffix = el.getAttribute('data-counter-suffix') || '';
          const isDecimal = String(target).includes('.');

          let current = 0;
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(now) {
            const progress = Math.min(1, (now - startTime) / duration);
            const ease = 1 - Math.pow(1 - progress, 3);
            current = target * ease;

            el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()}${suffix}`;

            if (progress < 1) requestAnimationFrame(updateCounter);
            else el.textContent = `${prefix}${isDecimal ? target.toFixed(1) : target.toLocaleString()}${suffix}`;
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => observer.observe(c));
  }

  // --- 5. Magnetic Button Hover Micro-Pull ---
  function setupMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-magnetic, .tactical-control-btn, [data-testid="btn-register"]');
    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // --- Initialization ---
  function init() {
    setupReticleCursor();
    setupLiveTicker();
    setup3DTiltCards();
    setupAnimatedCounters();
    setupMagneticButtons();

    // Re-bind on dynamic React route changes
    const observer = new MutationObserver(() => {
      setup3DTiltCards();
      setupAnimatedCounters();
    });
    const root = document.getElementById('root');
    if (root) {
      observer.observe(root, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

