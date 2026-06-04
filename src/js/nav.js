

/**
 * nav.js
 * Handles: scroll-triggered nav backdrop, mobile dropdown open/close.
 * Called from main.js via initNav().
 */

export function initNav() {
  const nav        = document.getElementById('nav');
  const menuBtn    = document.getElementById('menu-btn');
  const menuClose  = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  // All elements inside the panel that should close it on click
  const closeTargets = document.querySelectorAll(
    '.mobile-nav-link, #mobile-menu .btn-solid'
  );

  // ── Scroll backdrop ─────────
  // Adds/removes .scrolled when past 60px — CSS handles the visual transition
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Mobile menu ───────────────
  function open() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function close() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  // Toggle on MENU button click
  menuBtn.addEventListener('click', () =>
    mobileMenu.classList.contains('open') ? close() : open()
  );

  // Close on X button
  menuClose.addEventListener('click', close);

  // Close on any nav link or Book Now tap inside the panel
  closeTargets.forEach(el => el.addEventListener('click', close));
}


