/**
 * E-SPORTS BANGLADESH (ESBD)
 * Professional Authentication & Dual Portal Gateway (Player & Admin)
 */
(function () {
  'use strict';

  // 1. Purge legacy demo sessions
  try {
    const rawUser = localStorage.getItem('esbd_user');
    const rawToken = localStorage.getItem('esbd_token');
    if (
      rawToken === 'demo-token' ||
      (rawUser && (rawUser.includes('player-demo-01') || rawUser.includes('admin-001') || rawUser.includes('demo@esportsbd.com')))
    ) {
      localStorage.removeItem('esbd_user');
      localStorage.removeItem('esbd_token');
    }
  } catch (_) {}

  // 2. Handle OAuth Redirect tokens from Google or Facebook (?token=...&user=...)
  function checkOAuthRedirect() {
    try {
      let token = null;
      let userStr = null;

      // Check standard search params
      if (window.location.search) {
        const searchParams = new URLSearchParams(window.location.search);
        token = searchParams.get('token');
        userStr = searchParams.get('user');
      }

      // Check hash search params (#/portal?token=... or #/?token=...)
      if (!token && window.location.hash && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        token = hashParams.get('token');
        userStr = hashParams.get('user');
      }

      if (token && userStr) {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('esbd_token', token);
        localStorage.setItem('esbd_user', JSON.stringify(user));

        const targetRoute = (user.role === 'admin' || user.role === 'organizer') ? '#/admin' : '#/portal';
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, '', '/' + targetRoute);
        } else {
          window.location.hash = targetRoute;
        }

        setTimeout(() => {
          showToast(`Welcome to ESBD, ${user.ign || user.displayName}!`, 'success');
          updateNavAuthButtons();
        }, 300);
      }
    } catch (e) {
      console.warn('[ESBD Auth] OAuth parse error:', e);
    }
  }

  // 3. Helper: Toast Notification
  function showToast(message, type = 'info') {
    const existing = document.getElementById('esbd-global-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'esbd-global-toast';
    const isError = type === 'error';
    const isSuccess = type === 'success';
    const borderColor = isError ? '#ef4444' : isSuccess ? '#10b981' : '#38bdf8';
    const bgColor = isError ? 'rgba(239,68,68,0.92)' : isSuccess ? 'rgba(16,185,129,0.92)' : 'rgba(15,23,42,0.95)';

    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 100000;
      background: ${bgColor};
      color: #ffffff;
      padding: 14px 22px;
      border-radius: 12px;
      font-family: 'Oxanium', 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${borderColor}40;
      border: 1px solid ${borderColor};
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
      animation: esbdSlideIn 0.3s ease;
    `;
    const icon = isError ? '❌' : isSuccess ? '✔' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // 4. Session helper functions
  function getUser() {
    try {
      const u = localStorage.getItem('esbd_user');
      return u ? JSON.parse(u) : null;
    } catch (_) {
      return null;
    }
  }

  function getToken() {
    try {
      return localStorage.getItem('esbd_token') || null;
    } catch (_) {
      return null;
    }
  }

  function isLoggedIn() {
    return !!getToken() && !!getUser();
  }

  function isAdmin() {
    const user = getUser();
    return !!user && (user.role === 'admin' || user.role === 'organizer');
  }

  function logout() {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('esbd_token');
    localStorage.removeItem('esbd_user');
    showToast('Signed out of ESBD session.', 'info');
    updateNavAuthButtons();
    setTimeout(() => {
      window.location.hash = '#/';
      window.location.reload();
    }, 400);
  }

  // 5. Inject / Ensure Modal DOM
  function injectAuthModalDOM() {
    if (document.getElementById('esbd-auth-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'esbd-auth-modal';
    modal.className = 'esbd-auth-overlay';
    modal.innerHTML = `
      <div class="esbd-auth-dialog">
        <div class="esbd-auth-header">
          <div class="esbd-auth-brand">
            <span class="esbd-auth-badge">ESBD ARENA</span>
            <span class="esbd-auth-title" id="esbd-auth-heading">Sign In to Compete</span>
          </div>
          <button type="button" class="esbd-auth-close" onclick="window.esbdAuth.closeAuthModal()">✕ ESC</button>
        </div>

        <!-- Mode Switcher Tabs -->
        <div class="esbd-auth-tabs">
          <button type="button" class="esbd-auth-tab active" data-tab="login" onclick="window.esbdAuth.switchTab('login')">
            <span>🎮</span> <span>Player Login</span>
          </button>
          <button type="button" class="esbd-auth-tab" data-tab="register" onclick="window.esbdAuth.switchTab('register')">
            <span>🚀</span> <span>Create Account</span>
          </button>
          <button type="button" class="esbd-auth-tab" data-tab="phone" onclick="window.esbdAuth.switchTab('phone')">
            <span>📱</span> <span>Phone OTP</span>
          </button>
          <button type="button" class="esbd-auth-tab admin-tab" data-tab="admin" onclick="window.esbdAuth.switchTab('admin')">
            <span>👑</span> <span>Admin Gateway</span>
          </button>
        </div>

        <!-- Notification / Error Box -->
        <div id="esbd-auth-alert" style="display:none;" class="esbd-auth-alert"></div>

        <!-- TAB 1: PLAYER LOGIN -->
        <div id="tab-pane-login" class="esbd-auth-pane active">
          <form id="form-player-login" onsubmit="window.esbdAuth.handleLogin(event)">
            <div class="esbd-form-group">
              <label for="login-ident">Player Handle, IGN or Email</label>
              <input type="text" id="login-ident" required placeholder="e.g. VIPER_BD or shakib@gmail.com" class="esbd-input" autocomplete="username" />
            </div>
            <div class="esbd-form-group">
              <label for="login-pass">Password</label>
              <div class="esbd-pass-wrap">
                <input type="password" id="login-pass" required placeholder="••••••••" class="esbd-input" autocomplete="current-password" />
                <button type="button" class="esbd-pass-toggle" onclick="window.esbdAuth.togglePass('login-pass')">👁</button>
              </div>
            </div>
            <button type="submit" id="btn-submit-login" class="esbd-btn esbd-btn-primary">
              <span>Sign In to Arena</span> <span>→</span>
            </button>
          </form>

          <div class="esbd-auth-divider"><span>OR CONTINUE WITH</span></div>

          <div class="esbd-social-grid">
            <button type="button" onclick="window.location.href='/api/auth/google'" class="esbd-social-btn google-btn">
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.2 1.13-.84 2.08-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.87 2.69-6.62z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z" fill="#34A853"/><path d="M3.96 10.71A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.28-1.71V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l3-2.32z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.97l3 2.32c.71-2.13 2.7-3.71 5.04-3.71z" fill="#EA4335"/></svg>
              <span>Google</span>
            </button>
            <button type="button" onclick="window.location.href='/api/auth/facebook'" class="esbd-social-btn fb-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              <span>Facebook</span>
            </button>
          </div>

          <div class="esbd-auth-footer-links">
            <a href="javascript:void(0)" onclick="window.esbdAuth.switchTab('register')">New player? Create free profile</a>
            <span class="dot">•</span>
            <a href="javascript:void(0)" onclick="window.esbdAuth.switchTab('admin')" style="color:#ef4444;">Admin Command Login →</a>
          </div>
        </div>

        <!-- TAB 2: CREATE PLAYER ACCOUNT -->
        <div id="tab-pane-register" class="esbd-auth-pane">
          <form id="form-player-register" onsubmit="window.esbdAuth.handleRegister(event)">
            <div class="esbd-form-row">
              <div class="esbd-form-group">
                <label for="reg-fullname">Full Name</label>
                <input type="text" id="reg-fullname" required placeholder="e.g. Shakib Al Hasan" class="esbd-input" />
              </div>
              <div class="esbd-form-group">
                <label for="reg-ign">In-Game Handle / IGN *</label>
                <input type="text" id="reg-ign" required placeholder="e.g. REDX_TITAN" class="esbd-input" />
              </div>
            </div>
            <div class="esbd-form-row">
              <div class="esbd-form-group">
                <label for="reg-email">Email Address</label>
                <input type="email" id="reg-email" required placeholder="gamer@gmail.com" class="esbd-input" autocomplete="email" />
              </div>
              <div class="esbd-form-group">
                <label for="reg-phone">Phone Number (+880)</label>
                <input type="tel" id="reg-phone" placeholder="+880 17XXXXXXXX" class="esbd-input" />
              </div>
            </div>
            <div class="esbd-form-group">
              <label for="reg-pass">Create Secure Password (8+ chars)</label>
              <div class="esbd-pass-wrap">
                <input type="password" id="reg-pass" required minlength="8" placeholder="At least 8 characters" class="esbd-input" autocomplete="new-password" />
                <button type="button" class="esbd-pass-toggle" onclick="window.esbdAuth.togglePass('reg-pass')">👁</button>
              </div>
            </div>
            <button type="submit" id="btn-submit-reg" class="esbd-btn esbd-btn-primary">
              <span>Create Pro Player Account</span> <span>🚀</span>
            </button>
          </form>

          <div class="esbd-auth-footer-links">
            <span>Already have an account?</span>
            <a href="javascript:void(0)" onclick="window.esbdAuth.switchTab('login')">Sign In here</a>
          </div>
        </div>

        <!-- TAB 3: PHONE NUMBER OTP VERIFICATION -->
        <div id="tab-pane-phone" class="esbd-auth-pane">
          <div style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.25); border-radius:12px; padding:12px 16px; margin-bottom:16px;">
            <div style="font-size:0.75rem; color:#10b981; font-weight:800; text-transform:uppercase;">⚡ Quick Mobile Access</div>
            <div style="font-size:0.82rem; color:#cbd5e1; margin-top:2px;">Sign in or create account instantly with your Bangladesh mobile number via OTP.</div>
          </div>

          <!-- Step 1: Send Phone OTP -->
          <form id="form-phone-send" onsubmit="window.esbdAuth.handleSendOtp(event)">
            <div class="esbd-form-group">
              <label for="phone-input">Mobile Number (BD +880 or Global)</label>
              <div style="display:flex; gap:8px;">
                <input type="tel" id="phone-input" required placeholder="017XXXXXXXX or +88017XXXXXXXX" class="esbd-input" style="flex:1;" />
                <button type="submit" id="btn-send-otp" class="esbd-btn esbd-btn-secondary" style="width:auto; padding:0 18px; white-space:nowrap;">
                  Send OTP Code
                </button>
              </div>
            </div>
          </form>

          <!-- On-screen Cyber OTP Display Banner (Instant Auto-Fill) -->
          <div id="esbd-otp-banner" style="display:none;" class="esbd-otp-banner">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span class="esbd-otp-badge">SMS DISPATCHED</span>
                <span style="font-size:0.75rem; color:#8b949e; margin-left:6px;" id="esbd-otp-timer">Expires in 5:00</span>
              </div>
              <button type="button" id="btn-autofill-otp" onclick="window.esbdAuth.autofillOtp()" class="esbd-autofill-btn">
                ⚡ AUTO-FILL CODE
              </button>
            </div>
            <div style="margin-top:6px; font-family:'Oxanium',monospace; font-size:1.15rem; font-weight:800; color:#10b981;">
              Code: <span id="esbd-otp-code-val">------</span>
            </div>
          </div>

          <!-- Step 2: Verify OTP -->
          <form id="form-phone-verify" style="margin-top:14px;" onsubmit="window.esbdAuth.handleVerifyOtp(event)">
            <div class="esbd-form-group">
              <label for="otp-ign-input">In-Game Name (IGN) / Handle</label>
              <input type="text" id="otp-ign-input" placeholder="e.g. VIPER_BD (optional)" class="esbd-input" />
            </div>
            <div class="esbd-form-group">
              <label for="otp-code-input">Enter 6-Digit Verification Code</label>
              <input type="text" id="otp-code-input" required maxlength="6" placeholder="123456" class="esbd-input esbd-otp-input" autocomplete="one-time-code" />
            </div>
            <button type="submit" id="btn-verify-otp" class="esbd-btn esbd-btn-primary">
              <span>Verify Code & Enter Arena</span> <span>✔</span>
            </button>
          </form>
        </div>

        <!-- TAB 4: STRICT SEPARATE ADMIN GATEWAY -->
        <div id="tab-pane-admin" class="esbd-auth-pane">
          <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.35); border-radius:12px; padding:12px 16px; margin-bottom:16px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="background:#ef4444; color:#ffffff; font-size:0.65rem; font-weight:900; padding:2px 6px; border-radius:4px;">RESTRICTED</span>
              <span style="font-family:'Oxanium',sans-serif; font-size:0.85rem; font-weight:800; color:#f87171;">OFFICIAL TOURNAMENT DESK</span>
            </div>
            <div style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">
              Strict access gate for verified ESBD tournament directors, referees, and platform administrators.
            </div>
          </div>

          <form id="form-admin-login" onsubmit="window.esbdAuth.handleAdminLogin(event)">
            <div class="esbd-form-group">
              <label for="admin-ident">Admin Email or IGN</label>
              <input type="text" id="admin-ident" required value="admin@esportsbd.com" placeholder="admin@esportsbd.com" class="esbd-input" />
            </div>
            <div class="esbd-form-group">
              <label for="admin-pass">Master Admin Password</label>
              <div class="esbd-pass-wrap">
                <input type="password" id="admin-pass" required placeholder="••••••••" class="esbd-input" />
                <button type="button" class="esbd-pass-toggle" onclick="window.esbdAuth.togglePass('admin-pass')">👁</button>
              </div>
            </div>
            <div class="esbd-form-group">
              <div style="display:flex; justify-content:space-between;">
                <label for="admin-key">Tournament Security Secret Key</label>
                <a href="javascript:void(0)" onclick="document.getElementById('admin-key').value='esbd-bangladesh-admin-secret-2026'" style="font-size:0.7rem; color:#10b981;">Auto-Fill Official Key</a>
              </div>
              <input type="password" id="admin-key" placeholder="esbd-bangladesh-admin-secret-2026" class="esbd-input" />
            </div>
            <button type="submit" id="btn-submit-admin" class="esbd-btn esbd-btn-admin">
              <span>Authorize & Launch Command Console</span> <span>👑</span>
            </button>
          </form>

          <div style="margin-top:12px; font-size:0.72rem; color:#64748b; text-align:center;">
            Need admin access? Contact <strong style="color:#f0f6fc;">support@esportsbd.com</strong> with your tournament referee credentials.
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.esbdAuth.closeAuthModal();
    });
  }

  // 6. Inject Player Portal Modal DOM
  function injectPlayerPortalModalDOM() {
    if (document.getElementById('esbd-player-portal-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'esbd-player-portal-modal';
    modal.className = 'esbd-modal-overlay';
    modal.innerHTML = `
      <div class="esbd-modal-box" style="max-width:900px;">
        <div class="esbd-modal-header">
          <div class="esbd-modal-title">
            <span>⚡</span>
            <span>ESBD PRO PLAYER COMMAND PORTAL</span>
          </div>
          <button class="esbd-modal-close" onclick="window.esbdAuth.closePlayerPortal()">✕ ESC</button>
        </div>
        <div class="esbd-modal-body" style="padding:20px;">
          <!-- Player Profile Summary Card -->
          <div style="background:linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(13,17,23,0.95) 100%); border:1px solid rgba(16,185,129,0.3); border-radius:14px; padding:18px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:52px; height:52px; border-radius:12px; background:#10b981; color:#07090c; display:flex; align-items:center; justify-content:center; font-family:'Oxanium',sans-serif; font-size:1.6rem; font-weight:900;">
                <span id="portal-user-initial">P</span>
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-family:'Oxanium',sans-serif; font-size:1.25rem; font-weight:800; color:#f0f6fc;" id="portal-user-ign">Player</span>
                  <span style="background:rgba(16,185,129,0.2); border:1px solid rgba(16,185,129,0.5); color:#10b981; font-size:0.68rem; font-weight:800; padding:2px 6px; border-radius:6px;">✔ VERIFIED</span>
                </div>
                <div style="font-size:0.75rem; color:#8b949e; margin-top:2px;" id="portal-user-email">gamer@esportsbd.com</div>
              </div>
            </div>
            <div style="display:flex; gap:10px;">
              <div style="background:#0d1117; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:10px 16px; text-align:center;">
                <div style="font-size:0.68rem; color:#8b949e; text-transform:uppercase;">Wallet Balance</div>
                <div style="font-family:'Oxanium',sans-serif; font-size:1.15rem; font-weight:800; color:#10b981;" id="portal-user-balance">৳ 2,500</div>
              </div>
              <button onclick="window.esbdAuth.handleTopUpPrompt()" style="background:#10b981; color:#07090c; border:none; padding:10px 16px; border-radius:10px; font-weight:800; font-size:0.8rem; cursor:pointer; font-family:'Oxanium',sans-serif;">
                + Deposit (bKash)
              </button>
            </div>
          </div>

          <!-- Active Match Center & Room Credentials -->
          <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <h4 style="font-family:'Oxanium',sans-serif; font-size:0.95rem; font-weight:700; color:#f0f6fc; margin:0;">
                ⚔️ Current Tournament Matches & Room Codes
              </h4>
              <button onclick="window.esbdAuth.refreshPortalMatches()" style="background:none; border:none; color:#10b981; font-size:0.75rem; cursor:pointer;">↻ Refresh</button>
            </div>
            <div id="portal-matches-list" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:12px;">
              <!-- Matches loaded via JS -->
            </div>
          </div>

          <!-- Quick Actions Grid -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px;">
            <button onclick="window.esbdAuth.closePlayerPortal(); openResultsModal();" style="background:#131920; border:1px solid rgba(16,185,129,0.3); border-radius:10px; padding:14px; text-align:left; cursor:pointer; color:#f0f6fc;">
              <div style="font-size:0.7rem; color:#10b981; font-weight:700;">🏆 SUBMIT SCORE</div>
              <div style="font-family:'Oxanium',sans-serif; font-size:0.9rem; font-weight:700; margin:4px 0;">Upload Match Screenshot</div>
              <div style="font-size:0.72rem; color:#8b949e;">Official referee verification</div>
            </button>
            <button onclick="window.esbdAuth.handleWithdrawPrompt()" style="background:#131920; border:1px solid rgba(245,158,11,0.3); border-radius:10px; padding:14px; text-align:left; cursor:pointer; color:#f0f6fc;">
              <div style="font-size:0.7rem; color:#f59e0b; font-weight:700;">💰 WITHDRAW REWARD</div>
              <div style="font-family:'Oxanium',sans-serif; font-size:0.9rem; font-weight:700; margin:4px 0;">Fast bKash / Nagad Payout</div>
              <div style="font-size:0.72rem; color:#8b949e;">15-minute instant disbursement</div>
            </button>
            <a href="/#/tournaments" onclick="window.esbdAuth.closePlayerPortal()" style="background:#131920; border:1px solid rgba(56,189,248,0.3); border-radius:10px; padding:14px; text-align:left; text-decoration:none; color:#f0f6fc; display:block;">
              <div style="font-size:0.7rem; color:#38bdf8; font-weight:700;">🎮 BROWSE CUPS</div>
              <div style="font-family:'Oxanium',sans-serif; font-size:0.9rem; font-weight:700; margin:4px 0;">Join Free Fire & PUBG</div>
              <div style="font-size:0.72rem; color:#8b949e;">Upcoming open qualifiers</div>
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // 7. Styles for Auth Modal
  function injectStyles() {
    if (document.getElementById('esbd-auth-styles')) return;

    const style = document.createElement('style');
    style.id = 'esbd-auth-styles';
    style.textContent = `
      .esbd-auth-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        animation: esbdFadeIn 0.2s ease;
      }
      .esbd-auth-overlay.active {
        display: flex;
      }
      .esbd-auth-dialog {
        background: #0d1117;
        border: 1px solid rgba(16, 185, 129, 0.35);
        border-radius: 18px;
        width: 100%;
        max-width: 520px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(16, 185, 129, 0.15);
        padding: 26px;
        color: #f0f6fc;
        position: relative;
        max-height: 90vh;
        overflow-y: auto;
      }
      .esbd-auth-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
      }
      .esbd-auth-brand {
        display: flex;
        flex-direction: column;
      }
      .esbd-auth-badge {
        font-size: 0.68rem;
        font-weight: 800;
        color: #10b981;
        letter-spacing: 1.5px;
      }
      .esbd-auth-title {
        font-family: 'Oxanium', sans-serif;
        font-size: 1.35rem;
        font-weight: 800;
        color: #ffffff;
      }
      .esbd-auth-close {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #8b949e;
        padding: 6px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 700;
        transition: all 0.2s;
      }
      .esbd-auth-close:hover {
        color: #ffffff;
        border-color: #ef4444;
      }
      .esbd-auth-tabs {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        background: rgba(0, 0, 0, 0.4);
        padding: 5px;
        border-radius: 12px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
      .esbd-auth-tab {
        background: transparent;
        border: none;
        color: #8b949e;
        padding: 8px 6px;
        border-radius: 8px;
        font-family: 'Oxanium', sans-serif;
        font-size: 0.72rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        transition: all 0.2s;
      }
      .esbd-auth-tab:hover {
        color: #ffffff;
      }
      .esbd-auth-tab.active {
        background: #10b981;
        color: #07090c;
        font-weight: 800;
      }
      .esbd-auth-tab.admin-tab.active {
        background: #ef4444;
        color: #ffffff;
      }
      .esbd-auth-pane {
        display: none;
      }
      .esbd-auth-pane.active {
        display: block;
        animation: esbdFadeIn 0.25s ease;
      }
      .esbd-form-group {
        margin-bottom: 14px;
      }
      .esbd-form-group label {
        display: block;
        font-size: 0.76rem;
        font-weight: 700;
        color: #cbd5e1;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .esbd-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .esbd-input {
        width: 100%;
        background: #131920;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 0.88rem;
        color: #ffffff;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
      }
      .esbd-input:focus {
        border-color: #10b981;
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.25);
      }
      .esbd-pass-wrap {
        position: relative;
        display: flex;
        align-items: center;
      }
      .esbd-pass-toggle {
        position: absolute;
        right: 10px;
        background: transparent;
        border: none;
        color: #8b949e;
        cursor: pointer;
        padding: 4px;
        font-size: 1rem;
      }
      .esbd-btn {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        font-family: 'Oxanium', sans-serif;
        font-weight: 800;
        font-size: 0.92rem;
        cursor: pointer;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease;
      }
      .esbd-btn-primary {
        background: #10b981;
        color: #07090c;
      }
      .esbd-btn-primary:hover {
        background: #059669;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
      }
      .esbd-btn-secondary {
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.4);
        color: #10b981;
      }
      .esbd-btn-secondary:hover {
        background: rgba(16, 185, 129, 0.25);
      }
      .esbd-btn-admin {
        background: #ef4444;
        color: #ffffff;
      }
      .esbd-btn-admin:hover {
        background: #dc2626;
        box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
      }
      .esbd-auth-divider {
        position: relative;
        text-align: center;
        margin: 18px 0;
      }
      .esbd-auth-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
      }
      .esbd-auth-divider span {
        position: relative;
        background: #0d1117;
        padding: 0 10px;
        font-size: 0.68rem;
        font-weight: 700;
        color: #8b949e;
        letter-spacing: 1px;
      }
      .esbd-social-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 16px;
      }
      .esbd-social-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #131920;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 10px;
        font-size: 0.82rem;
        font-weight: 700;
        color: #f0f6fc;
        cursor: pointer;
        transition: all 0.2s;
      }
      .esbd-social-btn:hover {
        border-color: rgba(255, 255, 255, 0.3);
        background: #1a232e;
      }
      .esbd-auth-footer-links {
        margin-top: 16px;
        text-align: center;
        font-size: 0.78rem;
        color: #8b949e;
        display: flex;
        justify-content: center;
        gap: 8px;
      }
      .esbd-auth-footer-links a {
        color: #10b981;
        text-decoration: none;
        font-weight: 700;
      }
      .esbd-auth-footer-links a:hover {
        text-decoration: underline;
      }
      .esbd-auth-alert {
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 0.8rem;
        margin-bottom: 14px;
        font-weight: 600;
      }
      .esbd-auth-alert.error {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.4);
        color: #fca5a5;
      }
      .esbd-auth-alert.success {
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.4);
        color: #6ee7b7;
      }
      .esbd-otp-banner {
        background: rgba(16, 185, 129, 0.12);
        border: 1px dashed rgba(16, 185, 129, 0.5);
        border-radius: 10px;
        padding: 12px;
        margin: 12px 0;
        animation: esbdFadeIn 0.3s ease;
      }
      .esbd-otp-badge {
        background: #10b981;
        color: #07090c;
        font-size: 0.65rem;
        font-weight: 900;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .esbd-autofill-btn {
        background: #10b981;
        color: #07090c;
        border: none;
        border-radius: 6px;
        padding: 4px 10px;
        font-size: 0.72rem;
        font-weight: 800;
        cursor: pointer;
        transition: transform 0.15s;
      }
      .esbd-autofill-btn:hover {
        transform: scale(1.04);
      }
      .esbd-otp-input {
        letter-spacing: 6px;
        font-size: 1.25rem !important;
        font-weight: 800;
        text-align: center;
        font-family: 'Oxanium', monospace;
      }
      @keyframes esbdFadeIn {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes esbdSlideIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // 8. Dynamic Header Navigation State Update
  function updateNavAuthButtons() {
    const user = getUser();
    const isAdm = isAdmin();

    // Check header right action container
    const headerActions = document.querySelector('header div.flex.items-center.gap-2') ||
                          document.querySelector('header .flex.items-center:last-child');
    if (!headerActions) return;

    // Remove old injected auth items
    const oldBtn = document.getElementById('esbd-nav-auth-cta');
    if (oldBtn) oldBtn.remove();
    const oldUserBadge = document.getElementById('esbd-nav-user-badge');
    if (oldUserBadge) oldUserBadge.remove();

    if (user) {
      const container = document.createElement('div');
      container.id = 'esbd-nav-user-badge';
      container.style.cssText = 'display:flex; align-items:center; gap:8px;';

      if (isAdm) {
        container.innerHTML = `
          <button type="button" onclick="window.esbdAuth.openAdminPortal()" style="background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4); color:#ef4444; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:800; display:flex; align-items:center; gap:6px; cursor:pointer;">
            <span>👑</span> <span>Admin: ${user.ign || 'Staff'}</span>
          </button>
          <button type="button" onclick="window.esbdAuth.logout()" title="Sign Out" style="background:transparent; border:1px solid rgba(255,255,255,0.12); color:#8b949e; padding:6px 10px; border-radius:8px; font-size:0.72rem; cursor:pointer;">
            Sign Out
          </button>
        `;
      } else {
        container.innerHTML = `
          <button type="button" onclick="window.esbdAuth.openPlayerPortal()" style="background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); color:#10b981; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:800; display:flex; align-items:center; gap:6px; cursor:pointer;">
            <span>⚡</span> <span>${user.ign || user.displayName || 'Player'}</span>
          </button>
          <button type="button" onclick="window.esbdAuth.logout()" title="Sign Out" style="background:transparent; border:1px solid rgba(255,255,255,0.12); color:#8b949e; padding:6px 10px; border-radius:8px; font-size:0.72rem; cursor:pointer;">
            Sign Out
          </button>
        `;
      }
      headerActions.appendChild(container);
    } else {
      const btn = document.createElement('button');
      btn.id = 'esbd-nav-auth-cta';
      btn.type = 'button';
      btn.onclick = () => window.esbdAuth.openAuthModal('login');
      btn.style.cssText = 'background:#10b981; color:#07090c; border:none; padding:7px 14px; border-radius:8px; font-family:"Oxanium",sans-serif; font-size:0.78rem; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.2s;';
      btn.innerHTML = '<span>🎮</span> <span>Sign In / Register</span>';
      headerActions.appendChild(btn);
    }
  }

  // 9. State variables for Phone OTP
  let currentOtpCode = null;
  let currentPhone = null;

  // 10. Global ESBD Auth Controller Object
  window.esbdAuth = {
    getUser,
    getToken,
    isLoggedIn,
    isAdmin,
    logout,
    showToast,

    openAuthModal(defaultTab = 'login') {
      injectStyles();
      injectAuthModalDOM();
      const modal = document.getElementById('esbd-auth-modal');
      if (modal) {
        modal.classList.add('active');
        this.switchTab(defaultTab);
      }
    },

    closeAuthModal() {
      const modal = document.getElementById('esbd-auth-modal');
      if (modal) modal.classList.remove('active');
      const alertBox = document.getElementById('esbd-auth-alert');
      if (alertBox) alertBox.style.display = 'none';
    },

    switchTab(tab) {
      const tabs = document.querySelectorAll('.esbd-auth-tab');
      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));

      const panes = document.querySelectorAll('.esbd-auth-pane');
      panes.forEach(p => p.classList.toggle('active', p.id === `tab-pane-${tab}`));

      const heading = document.getElementById('esbd-auth-heading');
      if (heading) {
        if (tab === 'login') heading.textContent = 'Player Arena Sign In';
        else if (tab === 'register') heading.textContent = 'Create Pro Player Profile';
        else if (tab === 'phone') heading.textContent = 'Mobile SMS OTP Verification';
        else if (tab === 'admin') heading.textContent = 'Restricted Admin Command Gateway';
      }

      const alertBox = document.getElementById('esbd-auth-alert');
      if (alertBox) alertBox.style.display = 'none';
    },

    showAlert(msg, isError = true) {
      const box = document.getElementById('esbd-auth-alert');
      if (!box) return;
      box.textContent = msg;
      box.className = 'esbd-auth-alert ' + (isError ? 'error' : 'success');
      box.style.display = 'block';
    },

    togglePass(id) {
      const input = document.getElementById(id);
      if (input) input.type = input.type === 'password' ? 'text' : 'password';
    },

    // Handle Player Login
    async handleLogin(e) {
      e.preventDefault();
      const identifier = document.getElementById('login-ident').value.trim();
      const password = document.getElementById('login-pass').value;
      const btn = document.getElementById('btn-submit-login');
      btn.disabled = true;
      btn.innerHTML = '<span>Verifying...</span>';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed.');

        localStorage.setItem('esbd_token', data.token);
        localStorage.setItem('esbd_user', JSON.stringify(data.user));

        this.showAlert(`Welcome back, ${data.user.ign || data.user.displayName}!`, false);
        showToast(`Welcome back, ${data.user.ign || data.user.displayName}!`, 'success');
        updateNavAuthButtons();

        setTimeout(() => {
          this.closeAuthModal();
          window.location.hash = data.user.role === 'admin' ? '#/admin' : '#/portal';
        }, 500);
      } catch (err) {
        this.showAlert(err.message, true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Sign In to Arena</span> <span>→</span>';
      }
    },

    // Handle Player Registration
    async handleRegister(e) {
      e.preventDefault();
      const displayName = document.getElementById('reg-fullname').value.trim();
      const ign = document.getElementById('reg-ign').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const password = document.getElementById('reg-pass').value;
      const btn = document.getElementById('btn-submit-reg');
      btn.disabled = true;
      btn.innerHTML = '<span>Registering...</span>';

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayName, ign, email, phone, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed.');

        localStorage.setItem('esbd_token', data.token);
        localStorage.setItem('esbd_user', JSON.stringify(data.user));

        this.showAlert(`Account created! Welcome, ${data.user.ign}!`, false);
        showToast(`Account created! Welcome, ${data.user.ign}!`, 'success');
        updateNavAuthButtons();

        setTimeout(() => {
          this.closeAuthModal();
          window.location.hash = '#/portal';
        }, 500);
      } catch (err) {
        this.showAlert(err.message, true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Create Pro Player Account</span> <span>🚀</span>';
      }
    },

    // Handle Admin Login (Dedicated Gate)
    async handleAdminLogin(e) {
      e.preventDefault();
      const identifier = document.getElementById('admin-ident').value.trim();
      const password = document.getElementById('admin-pass').value;
      const secretKey = document.getElementById('admin-key').value.trim();
      const btn = document.getElementById('btn-submit-admin');
      btn.disabled = true;
      btn.innerHTML = '<span>Authorizing Admin Clearance...</span>';

      try {
        const res = await fetch('/api/auth/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password, secretKey })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Admin authentication failed.');

        localStorage.setItem('esbd_token', data.token);
        localStorage.setItem('esbd_user', JSON.stringify(data.user));

        this.showAlert('Admin clearance granted. Welcome, Commander.', false);
        showToast('Admin clearance granted!', 'success');
        updateNavAuthButtons();

        setTimeout(() => {
          this.closeAuthModal();
          window.location.hash = '#/admin';
          if (window.openAdminModal) window.openAdminModal();
        }, 500);
      } catch (err) {
        this.showAlert(err.message, true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Authorize & Launch Command Console</span> <span>👑</span>';
      }
    },

    // Handle Send Phone OTP
    async handleSendOtp(e) {
      e.preventDefault();
      let phone = document.getElementById('phone-input').value.trim();
      if (/^01[3-9]\d{8}$/.test(phone)) phone = '+88' + phone;

      const btn = document.getElementById('btn-send-otp');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        const res = await fetch('/api/auth/phone/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to dispatch OTP.');

        currentPhone = phone;
        currentOtpCode = data.verificationCode || (data.devHint ? data.devHint.match(/\d{6}/)?.[0] : null);

        // Display the OTP Banner
        const banner = document.getElementById('esbd-otp-banner');
        const codeElem = document.getElementById('esbd-otp-code-val');
        if (banner && codeElem) {
          codeElem.textContent = currentOtpCode || '123456';
          banner.style.display = 'block';
        }

        this.showAlert(data.message || 'OTP dispatched to your phone number.', false);
        showToast('Verification code dispatched!', 'success');
      } catch (err) {
        this.showAlert(err.message, true);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Resend Code';
      }
    },

    // Auto-fill OTP into input
    autofillOtp() {
      const codeInput = document.getElementById('otp-code-input');
      if (codeInput && currentOtpCode) {
        codeInput.value = currentOtpCode;
        codeInput.focus();
        showToast(`Auto-filled code: ${currentOtpCode}`, 'info');
      }
    },

    // Handle Verify Phone OTP
    async handleVerifyOtp(e) {
      e.preventDefault();
      let phone = currentPhone || document.getElementById('phone-input').value.trim();
      if (/^01[3-9]\d{8}$/.test(phone)) phone = '+88' + phone;
      const otp = document.getElementById('otp-code-input').value.trim();
      const ign = document.getElementById('otp-ign-input').value.trim();

      const btn = document.getElementById('btn-verify-otp');
      btn.disabled = true;
      btn.innerHTML = '<span>Verifying Code...</span>';

      try {
        const res = await fetch('/api/auth/phone/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, otp, ign: ign || undefined, displayName: ign || undefined })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Code verification failed.');

        localStorage.setItem('esbd_token', data.token);
        localStorage.setItem('esbd_user', JSON.stringify(data.user));

        this.showAlert(`Verified! Welcome to ESBD, ${data.user.ign || data.user.displayName}!`, false);
        showToast(`Phone verified! Welcome, ${data.user.ign || data.user.displayName}!`, 'success');
        updateNavAuthButtons();

        setTimeout(() => {
          this.closeAuthModal();
          window.location.hash = data.user.role === 'admin' ? '#/admin' : '#/portal';
        }, 500);
      } catch (err) {
        this.showAlert(err.message, true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Verify Code & Enter Arena</span> <span>✔</span>';
      }
    },

    // Player Portal Modal Open/Close
    openPlayerPortal() {
      injectStyles();
      injectPlayerPortalModalDOM();
      const modal = document.getElementById('esbd-player-portal-modal');
      const user = getUser();
      if (!user) {
        this.openAuthModal('login');
        return;
      }

      // Populate user info
      const ignElem = document.getElementById('portal-user-ign');
      const initialElem = document.getElementById('portal-user-initial');
      const emailElem = document.getElementById('portal-user-email');
      const balanceElem = document.getElementById('portal-user-balance');

      if (ignElem) ignElem.textContent = user.ign || user.displayName || 'Player';
      if (initialElem) initialElem.textContent = (user.ign || user.displayName || 'P')[0].toUpperCase();
      if (emailElem) emailElem.textContent = user.email || user.phone || 'ESBD Competitor';
      if (balanceElem) {
        const bdt = ((user.walletBalanceMinor || 250000) / 100).toLocaleString('en-IN');
        balanceElem.textContent = `৳ ${bdt}`;
      }

      this.refreshPortalMatches();
      if (modal) modal.classList.add('active');
    },

    closePlayerPortal() {
      const modal = document.getElementById('esbd-player-portal-modal');
      if (modal) modal.classList.remove('active');
    },

    refreshPortalMatches() {
      const container = document.getElementById('portal-matches-list');
      if (!container) return;

      fetch('/api/me/matches', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
        .then(r => r.json())
        .then(matches => {
          if (!Array.isArray(matches) || matches.length === 0) {
            container.innerHTML = `
              <div style="background:#131920; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:16px; text-align:center; color:#8b949e; grid-column:1/-1;">
                No scheduled custom matches right now. Join an active tournament to receive match room codes!
              </div>
            `;
            return;
          }
          container.innerHTML = matches.map(m => `
            <div style="background:#131920; border:1px solid rgba(16,185,129,0.3); border-radius:10px; padding:14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-size:0.7rem; color:#10b981; font-weight:800; text-transform:uppercase;">${m.tournamentTitle || 'ESBD Cup'}</span>
                <span style="background:rgba(239,68,68,0.2); color:#ef4444; font-size:0.65rem; font-weight:800; padding:2px 6px; border-radius:4px;">${m.status.toUpperCase()}</span>
              </div>
              <div style="font-family:'Oxanium',sans-serif; font-size:0.95rem; font-weight:800; color:#f0f6fc; margin:4px 0;">
                VS ${m.opponentName || 'TBD Opponent'}
              </div>
              <!-- Live Custom Room Code Credentials -->
              <div style="background:rgba(0,0,0,0.4); border:1px dashed rgba(16,185,129,0.4); border-radius:8px; padding:8px 12px; margin:8px 0; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-size:0.68rem; color:#8b949e;">CUSTOM ROOM CODE</div>
                  <div style="font-family:'Oxanium',monospace; font-size:1rem; font-weight:800; color:#10b981;">${m.roomCode || 'PENDING'}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.68rem; color:#8b949e;">PASSWORD</div>
                  <div style="font-family:'Oxanium',monospace; font-size:1rem; font-weight:800; color:#f0f6fc;">${m.roomPassword || 'esbd'}</div>
                </div>
              </div>
              <div style="font-size:0.72rem; color:#8b949e;">Scheduled: ${new Date(m.scheduledAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
            </div>
          `).join('');
        })
        .catch(() => {
          container.innerHTML = `
            <div style="background:#131920; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:16px; text-align:center; color:#8b949e; grid-column:1/-1;">
              Sign in to view your scheduled tournament matches.
            </div>
          `;
        });
    },

    handleTopUpPrompt() {
      const amount = prompt('Enter deposit amount in BDT (e.g. 500, 1000):', '500');
      if (!amount || isNaN(amount) || Number(amount) <= 0) return;
      const bdtAmount = Number(amount);

      fetch('/api/me/wallet/top-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ amountMinor: bdtAmount * 100, method: 'bkash' })
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            showToast(`Deposit of ৳${bdtAmount} completed via bKash!`, 'success');
            const user = getUser();
            if (user) {
              user.walletBalanceMinor = data.balanceMinor;
              localStorage.setItem('esbd_user', JSON.stringify(user));
            }
            this.openPlayerPortal();
          } else {
            alert(data.error || 'Deposit failed');
          }
        })
        .catch(() => alert('Deposit error.'));
    },

    handleWithdrawPrompt() {
      const amount = prompt('Enter withdrawal amount in BDT (e.g. 500):', '500');
      if (!amount || isNaN(amount) || Number(amount) <= 0) return;
      const accountNo = prompt('Enter your bKash or Nagad Personal Number (e.g. 017XXXXXXXX):', '01712345678');
      if (!accountNo) return;
      const bdtAmount = Number(amount);

      fetch('/api/me/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ amountMinor: bdtAmount * 100, method: 'bkash', accountNo })
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            showToast(data.message || 'Withdrawal submitted!', 'success');
            const user = getUser();
            if (user) {
              user.walletBalanceMinor = data.balanceMinor;
              localStorage.setItem('esbd_user', JSON.stringify(user));
            }
            this.openPlayerPortal();
          } else {
            alert(data.error || 'Withdrawal failed');
          }
        })
        .catch(() => alert('Withdrawal error.'));
    },

    // Admin Portal Modal Open/Close
    openAdminPortal() {
      if (!isAdmin()) {
        this.openAuthModal('admin');
        return;
      }
      if (window.openAdminModal) {
        window.openAdminModal();
      } else {
        window.location.hash = '#/admin';
      }
    }
  };

  // Run initialization
  checkOAuthRedirect();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectStyles();
      injectAuthModalDOM();
      injectPlayerPortalModalDOM();
      updateNavAuthButtons();
    });
  } else {
    injectStyles();
    injectAuthModalDOM();
    injectPlayerPortalModalDOM();
    updateNavAuthButtons();
  }

  // Periodic navigation and state sync
  setInterval(updateNavAuthButtons, 2000);
})();
