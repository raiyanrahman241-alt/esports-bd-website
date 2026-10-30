/**
 * E-SPORTS BANGLADESH (ESBD)
 * Social Auth & Session Safety Shield
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
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const userStr = params.get('user');
      if (token && userStr) {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('esbd_token', token);
        localStorage.setItem('esbd_user', JSON.stringify(user));
        window.history.replaceState({}, '', '/portal');
        window.location.href = user.role === 'admin' ? '/admin' : '/portal';
      }
    } catch (_) {}
  }

  // 3. Remove any remaining demo accounts DOM elements if rendered
  function purgeDemoDOMElements() {
    const selectors = [
      '[data-testid="button-demo-player"]',
      '[data-testid="button-demo-admin"]'
    ];
    selectors.forEach(sel => {
      const btn = document.querySelector(sel);
      if (btn) {
        let parent = btn.parentElement;
        while (parent && parent !== document.body) {
          if (parent.textContent && parent.textContent.includes('Demo accounts')) {
            parent.remove();
            break;
          }
          parent = parent.parentElement;
        }
      }
    });
  }

  checkOAuthRedirect();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', purgeDemoDOMElements);
  } else {
    purgeDemoDOMElements();
  }
  const observer = new MutationObserver(purgeDemoDOMElements);
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
})();
