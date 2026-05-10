/* =============================================
   main.js – Handwerksbetrieb Website-Vorlage
   ============================================= */

'use strict';

/* -----------------------------------------------
   1. HAMBURGER-NAVIGATION
   ----------------------------------------------- */
(function initMobileNav() {
  const toggle  = document.querySelector('.nav-toggle');
  const nav     = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  const open = () => {
    nav.classList.add('is-open');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    nav.classList.contains('is-open') ? close() : open();
  });

  /* Schließen bei Klick auf beliebigen Link */
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

  /* Schließen bei Klick außerhalb */
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) close();
  });

  /* Schließen per Escape-Taste */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
  });
})();

/* -----------------------------------------------
   2. HEADER-SCHATTEN BEI SCROLL
   ----------------------------------------------- */
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const update = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* -----------------------------------------------
   3. AKTIVEN NAV-LINK MARKIEREN
   ----------------------------------------------- */
(function markActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav__item a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === page) link.classList.add('active');
  });
})();

/* -----------------------------------------------
   4. KONTAKTFORMULAR – VALIDIERUNG & FEEDBACK
   ----------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById('kontaktformular');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearFeedback();

    const name    = form.querySelector('#name')?.value.trim()      || '';
    const email   = form.querySelector('#email')?.value.trim()     || '';
    const message = form.querySelector('#nachricht')?.value.trim() || '';

    if (!name || !email || !message) {
      showFeedback('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFeedback('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
      return;
    }

    /*
     * FORMULAR-VERSAND HIER EINBAUEN:
     * fetch('/api/kontakt', { method: 'POST', body: new FormData(form) })
     *   .then(r => r.ok ? showFeedback('Danke! Wir melden uns.', 'success') : ...)
     */
    showFeedback('Vielen Dank! Wir melden uns in Kürze bei Ihnen.', 'success');
    form.reset();
  });

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function showFeedback(msg, type) {
    const el = document.createElement('p');
    el.id = 'form-feedback';
    el.setAttribute('role', 'alert');
    el.textContent = msg;
    Object.assign(el.style, {
      marginTop:    '1rem',
      padding:      '0.75rem 1rem',
      borderRadius: '4px',
      fontSize:     '0.875rem',
      fontWeight:   '500',
      background:   type === 'success' ? '#d4edda' : '#f8d7da',
      color:        type === 'success' ? '#155724' : '#721c24',
      border:       `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
    });
    form.appendChild(el);
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearFeedback() {
    document.getElementById('form-feedback')?.remove();
  }
})();

/* -----------------------------------------------
   5. SCROLL-ANIMATION (IntersectionObserver)
      Karten und Abschnitte sanft einblenden.
   ----------------------------------------------- */
(function initFadeIn() {
  if (!('IntersectionObserver' in window)) return;

  const selector = [
    '.service-card',
    '.service-detail-card',
    '.feature-card',
    '.news-card',
    '.stat-item',
    '.team-card',
    '.process-step',
    '.project-item',
    '.contact-info-card',
  ].join(', ');

  const targets = document.querySelectorAll(selector);
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(22px)';
    /* gestaffelter Verzögerung pro Karte (max. 400 ms) */
    el.style.transition = `opacity 0.55s ease ${Math.min(i * 60, 400)}ms, transform 0.55s ease ${Math.min(i * 60, 400)}ms`;
    observer.observe(el);
  });
})();
