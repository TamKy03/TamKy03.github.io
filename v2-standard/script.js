(() => {
  const root = document.documentElement;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  $('#year').textContent = new Date().getFullYear();

  // Theme toggle
  $('#themeToggle').addEventListener('click', () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  // Mobile menu
  const menu = $('#menu');
  const menuBtn = $('#menuToggle');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '✕' : '☰';
  };
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.matches('a')) setMenu(false); });

  // Nav border, back-to-top button
  const nav = $('.nav');
  const toTop = $('#toTop');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 10);
    toTop.classList.toggle('show', scrollY > 600);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hide the photo frame gracefully if the image is missing
  $$('img').forEach((img) => img.addEventListener('error', () => { img.parentElement.hidden = true; }));

  if (!('IntersectionObserver' in window)) {
    root.classList.add('no-js');
    $$('.meters').forEach((m) => m.classList.add('filled'));
    return;
  }

  // Scroll reveal + skill meters
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.meters').forEach((m) => m.classList.add('filled'));
      revealer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach((el) => revealer.observe(el));

  // Active section highlight
  const links = new Map([...$$('#menu a')].map((a) => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.remove('active'));
      links.get(entry.target.id)?.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));
})();
