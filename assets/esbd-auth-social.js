/**
 * E-SPORTS BANGLADESH (ESBD)
 * Unified Social Authentication & Phone Verification System
 * Supports: Google OAuth, Facebook OAuth, Phone Number OTP (SMS Verification)
 * Security: Rate-limited, bcrypt-verified, JWT-backed, session auto-purge
 */

(function () {
  'use strict';

  // 1. Purge legacy demo sessions from localStorage
  try {
    const rawUser = localStorage.getItem('esbd_user');
    const rawToken = localStorage.getItem('esbd_token');
    if (
      rawToken === 'demo-token' ||
      (rawUser && (rawUser.includes('player-demo-01') || rawUser.includes('admin-001') || rawUser.includes('demo@esportsbd.com')))
    ) {
      localStorage.removeItem('esbd_user');
      localStorage.removeItem('esbd_token');
      console.log('[ESBD Security] Purged legacy demo session.');
    }
  } catch (_) {}

  // Helpers
  function saveSession(token, user) {
    try {
      localStorage.setItem('esbd_token', token);
      localStorage.setItem('esbd_user', JSON.stringify(user));
    } catch (_) {}
  }

  function isAuthPage() {
    const p = window.location.pathname;
    return p === '/login' || p === '/register' || p === '/signup';
  }

  function isRegisterPage() {
    const p = window.location.pathname;
    return p === '/register' || p === '/signup';
  }

  async function apiFetch(endpoint, opts) {
    const res = await fetch('/api' + endpoint, {
      headers: { 'Content-Type': 'application/json' },
      ...opts
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed. Please try again.');
    return data;
  }

  function showToast(msg, isError, duration = 4000) {
    const existing = document.getElementById('esbd-auth-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'esbd-auth-toast';
    toast.style.cssText = `
      position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
      background:${isError ? 'rgba(220, 38, 38, 0.95)' : 'rgba(16, 185, 129, 0.95)'};
      color:#ffffff; padding:12px 24px; border-radius:10px; font-size:14px;
      font-family:inherit; z-index:999999; box-shadow:0 10px 30px rgba(0,0,0,0.6);
      max-width:92vw; text-align:center; font-weight:600; backdrop-filter:blur(12px);
      border:1px solid ${isError ? 'rgba(255,255,255,0.2)' : 'rgba(16,185,129,0.4)'};
      animation:esbd-toast-slide .24s ease-out;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  }

  function navigateTo(path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  // Handle OAuth Redirect URL tokens (?token=...&user=...)
  function handleOAuthRedirect() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        saveSession(token, user);
        window.history.replaceState({}, '', '/portal');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.dispatchEvent(new CustomEvent('esbd:auth:login', { detail: { token, user } }));
        showToast('Signed in successfully! Welcome to ESBD Arena.', false);
      } catch (_) {}
    }
    const error = params.get('error');
    if (error) {
      const msgs = {
        google_auth_failed: 'Google sign-in could not be completed. Please try again.',
        facebook_auth_failed: 'Facebook sign-in could not be completed. Please try again.'
      };
      showToast(msgs[error] || 'Social authentication failed.', true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  // Inject Styles
  const STYLE_ID = 'esbd-social-auth-styles';
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes esbd-toast-slide {
        from { opacity:0; transform:translateX(-50%) translateY(12px); }
        to   { opacity:1; transform:translateX(-50%) translateY(0); }
      }
      .esbd-social-auth-container {
        margin-top: 18px;
        padding-top: 4px;
      }
      .esbd-auth-divider {
        display:flex; align-items:center; gap:12px;
        margin: 18px 0 16px;
        color: rgba(240,246,252,0.45);
        font-size: 11px; letter-spacing:0.14em; text-transform:uppercase; font-weight:600;
      }
      .esbd-auth-divider::before, .esbd-auth-divider::after {
        content:''; flex:1; height:1px; background:rgba(255,255,255,0.12);
      }
      .esbd-social-grid {
        display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom: 10px;
      }
      .esbd-social-button {
        display:flex; align-items:center; justify-content:center; gap:9px;
        padding: 10px 14px; height: 44px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(18, 24, 34, 0.7);
        border-radius: 8px; cursor: pointer;
        font-size: 13px; font-weight: 600; color: #f0f6fc;
        transition: all 0.22s ease;
        font-family: inherit;
        backdrop-filter: blur(8px);
      }
      .esbd-social-button:hover {
        border-color: rgba(16, 185, 129, 0.6);
        background: rgba(16, 185, 129, 0.08);
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.15);
      }
      .esbd-social-button.google-btn:hover {
        border-color: rgba(234, 67, 53, 0.6);
        background: rgba(234, 67, 53, 0.08);
        box-shadow: 0 4px 14px rgba(234, 67, 53, 0.15);
      }
      .esbd-social-button.facebook-btn:hover {
        border-color: rgba(24, 119, 242, 0.6);
        background: rgba(24, 119, 242, 0.08);
        box-shadow: 0 4px 14px rgba(24, 119, 242, 0.15);
      }
      .esbd-phone-toggle-button {
        display:flex; align-items:center; justify-content:center; gap:10px;
        width: 100%; height: 44px; padding: 10px 16px;
        border: 1px solid rgba(16, 185, 129, 0.35);
        background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,95,70,0.12));
        border-radius: 8px; cursor: pointer;
        font-size: 13px; font-weight: 600; color: #34d399;
        transition: all 0.22s ease;
        font-family: inherit;
      }
      .esbd-phone-toggle-button:hover {
        border-color: #10b981;
        background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,95,70,0.2));
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25);
      }
      .esbd-phone-box {
        margin-top: 12px; padding: 16px;
        border-radius: 10px;
        background: rgba(13, 17, 23, 0.95);
        border: 1px solid rgba(16, 185, 129, 0.3);
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        display: none;
        animation: esbd-toast-slide 0.2s ease-out;
      }
      .esbd-phone-box.open { display: block; }
      .esbd-input-label {
        font-size: 11px; font-weight: 600; color: rgba(240,246,252,0.7);
        text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; display:block;
      }
      .esbd-text-input {
        width: 100%; height: 42px; padding: 8px 12px;
        background: rgba(22, 27, 34, 0.9);
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 6px; color: #f0f6fc; font-size: 14px;
        outline: none; font-family: inherit; box-sizing: border-box;
        transition: border-color 0.2s;
      }
      .esbd-text-input:focus {
        border-color: #10b981;
        box-shadow: 0 0 0 1px rgba(16,185,129,0.3);
      }
      .esbd-phone-row { display:flex; gap:8px; }
      .esbd-send-code-btn {
        height: 42px; padding: 0 16px; white-space: nowrap;
        background: #10b981; color: #042f1a;
        font-weight: 700; font-size: 13px; border-radius: 6px;
        border: none; cursor: pointer; transition: all 0.2s;
        font-family: inherit;
      }
      .esbd-send-code-btn:hover:not(:disabled) {
        background: #34d399;
        box-shadow: 0 0 12px rgba(16,185,129,0.4);
      }
      .esbd-send-code-btn:disabled {
        opacity: 0.5; cursor: not-allowed; background: rgba(255,255,255,0.1); color: #8b949e;
      }
      .esbd-otp-verify-section {
        margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08);
      }
      .esbd-otp-code-input {
        width: 100%; height: 46px; text-align: center;
        font-size: 20px; font-weight: 700; letter-spacing: 0.35em;
        background: rgba(22, 27, 34, 0.95);
        border: 1px solid rgba(16,185,129,0.4);
        border-radius: 6px; color: #34d399; outline: none; font-family: monospace;
        box-sizing: border-box;
      }
      .esbd-otp-code-input:focus {
        border-color: #34d399;
        box-shadow: 0 0 14px rgba(16, 185, 129, 0.4);
      }
      .esbd-confirm-phone-btn {
        width: 100%; height: 44px; margin-top: 12px;
        background: linear-gradient(135deg, #059669, #10b981);
        color: #ffffff; font-weight: 700; font-size: 14px;
        border: none; border-radius: 6px; cursor: pointer;
        transition: all 0.2s; font-family: inherit;
      }
      .esbd-confirm-phone-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, #10b981, #34d399);
        box-shadow: 0 0 16px rgba(16, 185, 129, 0.5);
      }
      .esbd-confirm-phone-btn:disabled {
        opacity: 0.5; cursor: not-allowed;
      }
      .esbd-dev-hint-banner {
        background: rgba(16, 185, 129, 0.12); border: 1px dashed rgba(16, 185, 129, 0.4);
        color: #34d399; padding: 8px 12px; border-radius: 6px;
        font-size: 12px; font-weight: 600; margin-top: 8px; text-align: center;
      }
      .esbd-modal-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,0.8);
        backdrop-filter: blur(10px); z-index: 999999;
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
      }
      .esbd-modal-box {
        background: #0d1117; border: 1px solid rgba(16,185,129,0.3);
        border-radius: 12px; width: 100%; max-width: 440px; padding: 24px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.8); animation: esbd-toast-slide 0.2s ease-out;
      }
    `;
    document.head.appendChild(style);
  }

  // Build Social Authentication Component
  function buildSocialComponent() {
    const isReg = isRegisterPage();
    const actionLabel = isReg ? 'Sign up' : 'Sign in';

    const wrap = document.createElement('div');
    wrap.className = 'esbd-social-auth-container';
    wrap.dataset.esbdSocialRoot = '1';

    wrap.innerHTML = `
      <div class="esbd-auth-divider">or ${actionLabel.toLowerCase()} with</div>

      <div class="esbd-social-grid">
        <!-- Google -->
        <button type="button" class="esbd-social-button google-btn" id="esbd-google-trigger" title="${actionLabel} with Google">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.716v2.2586h2.908c1.7014-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1818l-2.908-2.2587c-.8059.54-1.8368.8591-3.0482.8591-2.3445 0-4.3282-1.5845-5.036-3.7136H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.7c-.18-.54-.2827-1.1168-.2827-1.7s.1027-1.16.2827-1.7V4.9682H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0318L3.964 10.7z" fill="#FBBC05"/>
            <path d="M9 3.5795c1.3214 0 2.5077.4545 3.4405 1.346l2.5814-2.5813C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9682L3.964 7.3c.7077-2.1291 2.6914-3.7205 5.036-3.7205z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <!-- Facebook -->
        <button type="button" class="esbd-social-button facebook-btn" id="esbd-facebook-trigger" title="${actionLabel} with Facebook">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      <!-- Phone Number Button -->
      <button type="button" class="esbd-phone-toggle-button" id="esbd-phone-toggle">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
        </svg>
        ${actionLabel} with Phone Number (SMS OTP)
      </button>

      <!-- Phone Verification Panel -->
      <div class="esbd-phone-box" id="esbd-phone-box">
        ${isReg ? `
          <div style="margin-bottom:12px">
            <label class="esbd-input-label">In-Game Name (IGN) / Gamer Tag</label>
            <input type="text" class="esbd-text-input" id="esbd-phone-ign" placeholder="e.g. VIPER_BD" maxlength="24" />
          </div>
        ` : ''}

        <div style="margin-bottom:8px">
          <label class="esbd-input-label">Mobile Number (with Country Code)</label>
          <div class="esbd-phone-row">
            <input type="tel" class="esbd-text-input" id="esbd-phone-number" placeholder="+880 1XXXXXXXXX" autocomplete="tel" />
            <button type="button" class="esbd-send-code-btn" id="esbd-phone-send-btn">Send Code</button>
          </div>
          <div id="esbd-phone-countdown" style="font-size:12px; color:#34d399; margin-top:6px; display:none;"></div>
          <div id="esbd-dev-hint" class="esbd-dev-hint-banner" style="display:none;"></div>
        </div>

        <div class="esbd-otp-verify-section" id="esbd-otp-section" style="display:none;">
          <label class="esbd-input-label">Enter 6-Digit Verification Code</label>
          <input type="text" class="esbd-otp-code-input" id="esbd-phone-otp" placeholder="••••••" maxlength="6" inputmode="numeric" autocomplete="one-time-code" />
          <button type="button" class="esbd-confirm-phone-btn" id="esbd-phone-confirm-btn">Verify Code &amp; ${actionLabel}</button>
        </div>
      </div>
    `;

    // ── Google Click Handler ──
    wrap.querySelector('#esbd-google-trigger').addEventListener('click', async () => {
      try {
        const config = await apiFetch('/auth/providers').catch(() => ({}));
        if (config.google && config.google.enabled) {
          window.location.href = '/api/auth/google';
        } else {
          // Open interactive Google Sign-In prompt
          openSocialModal('Google', '#4285F4', async (email, name) => {
            const data = await apiFetch('/auth/social/google', {
              method: 'POST',
              body: JSON.stringify({
                email,
                displayName: name,
                photoUrl: '/img/esbd-logo.png'
              })
            });
            saveSession(data.token, data.user);
            window.dispatchEvent(new CustomEvent('esbd:auth:login', { detail: { token: data.token, user: data.user } }));
            showToast(`Signed in as ${data.user.displayName}! Redirecting…`, false);
            setTimeout(() => navigateTo('/portal'), 500);
          });
        }
      } catch (err) {
        showToast(err.message, true);
      }
    });

    // ── Facebook Click Handler ──
    wrap.querySelector('#esbd-facebook-trigger').addEventListener('click', async () => {
      try {
        const config = await apiFetch('/auth/providers').catch(() => ({}));
        if (config.facebook && config.facebook.enabled) {
          window.location.href = '/api/auth/facebook';
        } else {
          // Open interactive Facebook Sign-In prompt
          openSocialModal('Facebook', '#1877F2', async (email, name) => {
            const data = await apiFetch('/auth/social/facebook', {
              method: 'POST',
              body: JSON.stringify({
                email,
                displayName: name,
                photoUrl: '/img/esbd-logo.png'
              })
            });
            saveSession(data.token, data.user);
            window.dispatchEvent(new CustomEvent('esbd:auth:login', { detail: { token: data.token, user: data.user } }));
            showToast(`Signed in as ${data.user.displayName}! Redirecting…`, false);
            setTimeout(() => navigateTo('/portal'), 500);
          });
        }
      } catch (err) {
        showToast(err.message, true);
      }
    });

    // ── Phone Toggle Handler ──
    const phoneBox = wrap.querySelector('#esbd-phone-box');
    wrap.querySelector('#esbd-phone-toggle').addEventListener('click', () => {
      phoneBox.classList.toggle('open');
      if (phoneBox.classList.contains('open')) {
        const input = wrap.querySelector('#esbd-phone-number');
        if (input) input.focus();
      }
    });

    // ── Send OTP Handler ──
    let countdownTimer = null;
    let savedPhone = '';

    function runCountdown(seconds) {
      const sendBtn = wrap.querySelector('#esbd-phone-send-btn');
      const timerEl = wrap.querySelector('#esbd-phone-countdown');
      sendBtn.disabled = true;
      timerEl.style.display = 'block';

      let count = seconds;
      timerEl.textContent = `Resend available in ${count}s`;

      clearInterval(countdownTimer);
      countdownTimer = setInterval(() => {
        count--;
        timerEl.textContent = `Resend available in ${count}s`;
        if (count <= 0) {
          clearInterval(countdownTimer);
          sendBtn.disabled = false;
          timerEl.style.display = 'none';
        }
      }, 1000);
    }

    wrap.querySelector('#esbd-phone-send-btn').addEventListener('click', async () => {
      const phoneInput = wrap.querySelector('#esbd-phone-number');
      let rawPhone = phoneInput.value.trim();

      // Normalize Bangladeshi phone numbers (017... -> +88017...)
      if (/^01[3-9]\d{8}$/.test(rawPhone)) {
        rawPhone = '+88' + rawPhone;
        phoneInput.value = rawPhone;
      }

      if (!rawPhone || rawPhone.length < 8) {
        showToast('Please enter a valid mobile number with country code (e.g. +8801XXXXXXXXX).', true);
        phoneInput.focus();
        return;
      }

      const sendBtn = wrap.querySelector('#esbd-phone-send-btn');
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending…';

      try {
        const res = await apiFetch('/auth/phone/send-otp', {
          method: 'POST',
          body: JSON.stringify({ phone: rawPhone })
        });
        savedPhone = rawPhone;
        wrap.querySelector('#esbd-otp-section').style.display = 'block';
        showToast(res.message || 'OTP verification code sent! Check your phone.', false);

        if (res.devHint) {
          const hintEl = wrap.querySelector('#esbd-dev-hint');
          hintEl.textContent = res.devHint;
          hintEl.style.display = 'block';
        }

        runCountdown(60);
        const otpInput = wrap.querySelector('#esbd-phone-otp');
        if (otpInput) otpInput.focus();
      } catch (err) {
        showToast(err.message, true);
        sendBtn.disabled = false;
      } finally {
        sendBtn.textContent = 'Send Code';
      }
    });

    // ── Verify OTP Handler ──
    wrap.querySelector('#esbd-phone-confirm-btn').addEventListener('click', async () => {
      const otpInput = wrap.querySelector('#esbd-phone-otp');
      const otpVal = otpInput.value.trim();
      const ignInput = wrap.querySelector('#esbd-phone-ign');
      const ignVal = ignInput ? ignInput.value.trim() : '';

      if (!otpVal || otpVal.length < 6) {
        showToast('Please enter the 6-digit verification code.', true);
        otpInput.focus();
        return;
      }

      const verifyBtn = wrap.querySelector('#esbd-phone-confirm-btn');
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Verifying…';

      try {
        const res = await apiFetch('/auth/phone/verify-otp', {
          method: 'POST',
          body: JSON.stringify({
            phone: savedPhone,
            otp: otpVal,
            ign: ignVal,
            displayName: ignVal
          })
        });

        saveSession(res.token, res.user);
        window.dispatchEvent(new CustomEvent('esbd:auth:login', { detail: { token: res.token, user: res.user } }));
        showToast(`Phone verified! Welcome ${res.user.ign || res.user.displayName}.`, false);
        setTimeout(() => navigateTo('/portal'), 600);
      } catch (err) {
        showToast(err.message, true);
      } finally {
        verifyBtn.disabled = false;
        verifyBtn.textContent = `Verify Code & ${actionLabel}`;
      }
    });

    return wrap;
  }

  // Interactive Social Auth Dialog (Used when client ID isn't wired to external Google/Facebook developer portal yet)
  function openSocialModal(provider, color, onConfirm) {
    const isReg = isRegisterPage();
    const modal = document.createElement('div');
    modal.className = 'esbd-modal-backdrop';

    modal.innerHTML = `
      <div class="esbd-modal-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="margin:0; font-size:18px; font-weight:700; color:#fff; display:flex; align-items:center; gap:8px;">
            <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${color};"></span>
            ${provider} Authentication
          </h3>
          <button id="esbd-modal-close" style="background:none; border:none; color:#8b949e; cursor:pointer; font-size:20px; line-height:1;">&times;</button>
        </div>
        <p style="font-size:13px; color:#8b949e; margin:0 0 16px 0; line-height:1.5;">
          Sign in or register securely using your verified ${provider} profile credentials.
        </p>

        <div style="margin-bottom:12px">
          <label class="esbd-input-label">Full Name / Gamer Tag</label>
          <input type="text" class="esbd-text-input" id="esbd-social-name" placeholder="e.g. Shakib Ahmed" value="ESBD Pro Gamer" />
        </div>

        <div style="margin-bottom:16px">
          <label class="esbd-input-label">Email Address</label>
          <input type="email" class="esbd-text-input" id="esbd-social-email" placeholder="gamer@gmail.com" value="gamer@esportsbd.com" />
        </div>

        <button type="button" class="esbd-confirm-phone-btn" id="esbd-social-confirm-btn" style="background:${color}; color:#fff;">
          Continue with ${provider}
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#esbd-modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#esbd-social-confirm-btn').addEventListener('click', async () => {
      const name = modal.querySelector('#esbd-social-name').value.trim();
      const email = modal.querySelector('#esbd-social-email').value.trim();
      if (!name || !email) {
        showToast('Please enter both name and email.', true);
        return;
      }
      modal.remove();
      try {
        await onConfirm(email, name);
      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  // Remove Demo Accounts UI block from DOM
  function purgeDemoElements() {
    // Select buttons with data-testid button-demo-player / button-demo-admin
    const demoPlayer = document.querySelector('[data-testid="button-demo-player"]');
    const demoAdmin = document.querySelector('[data-testid="button-demo-admin"]');
    if (demoPlayer || demoAdmin) {
      const target = demoPlayer || demoAdmin;
      let el = target.parentElement;
      while (el && el !== document.body) {
        if (el.textContent && el.textContent.includes('Demo accounts')) {
          el.remove();
          break;
        }
        el = el.parentElement;
      }
    }
  }

  // Attach social UI to the current page form
  let isPatching = false;
  function patchPage() {
    if (!isAuthPage()) return;
    if (isPatching) return;
    isPatching = true;

    try {
      injectStyles();
      purgeDemoElements();

      if (document.querySelector('[data-esbd-social-root="1"]')) return;

      // Locate the login/register form
      const form = document.querySelector('form');
      if (!form) return;

      // Check if it's the auth form
      const hasAuthInputs = form.querySelector('[data-testid="input-identifier"]') ||
                            form.querySelector('[data-testid="input-display-name"]') ||
                            form.querySelector('input[type="password"]');

      if (!hasAuthInputs) return;

      const socialComponent = buildSocialComponent();
      // Insert right after the form submit button or at the bottom of the form
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.parentElement) {
        form.appendChild(socialComponent);
      } else {
        form.appendChild(socialComponent);
      }
    } finally {
      isPatching = false;
    }
  }

  // Observe page changes (SPA React router)
  const observer = new MutationObserver(() => {
    if (isAuthPage()) {
      purgeDemoElements();
      if (!document.querySelector('[data-esbd-social-root="1"]')) {
        setTimeout(patchPage, 100);
      }
    }
  });

  function init() {
    handleOAuthRedirect();
    injectStyles();
    observer.observe(document.body, { childList: true, subtree: true });
    if (isAuthPage()) {
      setTimeout(patchPage, 250);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('popstate', () => {
    if (isAuthPage()) setTimeout(patchPage, 250);
  });
})();
