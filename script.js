(() => {
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  };

  /* ---------- Theme ---------- */
  const toggleTheme = () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('v3-theme', root.dataset.theme); } catch (e) {}
  };
  $('#themeToggle').addEventListener('click', toggleTheme);

  /* ---------- Photo fallback ---------- */
  const photo = $('#photo');
  const noPhoto = () => photo.parentElement.classList.add('no-photo');
  photo.addEventListener('error', noPhoto);
  if (photo.complete && !photo.naturalWidth) noPhoto();

  /* ---------- Scroll progress + active link ---------- */
  const progress = $('#progress');
  const navLinks = $$('.links a');
  const sections = $$('main section[id]');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    let current = sections[0].id;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id;
    navLinks.forEach((a) => a.classList.toggle('active', a.hash === '#' + current));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Typing roles ---------- */
  const roles = ['NetSuite Technical Consultant', 'SuiteScript 2.1 developer', 'Integration builder', 'Data Science graduate'];
  const typed = $('#typed');
  if (!reducedMotion) {
    let r = 0, i = roles[0].length, deleting = true;
    const tick = () => {
      const word = roles[r];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 35 : 70;
      if (!deleting && i === word.length) { deleting = true; delay = 1800; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2000);
  }

  /* ---------- Reveal, counters, skill dots ---------- */
  $$('.dots').forEach((d) => {
    const level = Number(d.dataset.level);
    d.innerHTML = Array.from({ length: 5 }, (_, k) => `<i class="${k < level ? 'on' : ''}"></i>`).join('');
  });

  // "YYYY-MM" counts months from that month up to now (inclusive), so the stat never goes stale
  const monthsSince = (ym) => {
    const [y, m] = ym.split('-').map(Number);
    const now = new Date();
    return (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m) + 1;
  };

  const countUp = (el) => {
    const raw = el.dataset.count;
    const target = raw.includes('-') ? monthsSince(raw) : Number(raw);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    if (reducedMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
    const start = performance.now();
    const dur = 1400;
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      if (e.target.dataset.count) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  $$('.reveal, [data-count]').forEach((el) => io.observe(el));

  /* ---------- Journey filter ---------- */
  const chips = $$('.chip');
  const setFilter = (filter) => {
    chips.forEach((c) => {
      const on = c.dataset.filter === filter;
      c.classList.toggle('active', on);
      c.setAttribute('aria-selected', String(on));
    });
    $$('.entry').forEach((entry) => {
      const show = filter === 'all' || entry.dataset.type === filter;
      entry.classList.toggle('hide', !show);
      if (show) entry.classList.add('visible');
    });
  };
  chips.forEach((c) => c.addEventListener('click', () => setFilter(c.dataset.filter)));

  /* ---------- Skill card tilt + glow ---------- */
  if (!reducedMotion && matchMedia('(hover: hover)').matches) {
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        card.style.transform = `perspective(700px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Contact ---------- */
  const email = $('#copyEmail').dataset.email;
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast('Email copied to clipboard');
    } catch (e) {
      location.href = `mailto:${email}`;
    }
  };
  $('#copyEmail').addEventListener('click', copyEmail);

  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const body = `${data.get('message')}\n\n— ${data.get('name')}`;
    location.href = `mailto:${email}?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- Command palette ---------- */
  const go = (hash) => () => document.querySelector(hash).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  const commands = [
    { label: 'Go to About', hint: 'section', run: go('#about') },
    { label: 'Go to Journey', hint: 'section', run: go('#journey') },
    { label: 'Go to Skills', hint: 'section', run: go('#skills') },
    { label: 'Go to Contact', hint: 'section', run: go('#contact') },
    { label: 'Show work experience', hint: 'filter', run: () => { setFilter('work'); go('#journey')(); } },
    { label: 'Show education', hint: 'filter', run: () => { setFilter('education'); go('#journey')(); } },
    { label: 'Show leadership', hint: 'filter', run: () => { setFilter('leadership'); go('#journey')(); } },
    { label: 'Copy email address', hint: 'action', run: copyEmail },
    { label: 'Open LinkedIn', hint: 'link', run: () => window.open('https://www.linkedin.com/in/kytam0330/', '_blank', 'noopener') },
    { label: 'Toggle light / dark theme', hint: 'action', run: toggleTheme },
    { label: 'Back to top', hint: 'section', run: go('#home') },
    { label: 'View other site versions', hint: 'link', run: () => { location.href = 'versions/'; } },
  ];

  const palette = $('#palette');
  const input = $('#paletteInput');
  const list = $('#paletteList');
  let filtered = commands;
  let selected = 0;
  let lastFocus = null;

  const render = () => {
    const q = input.value.trim().toLowerCase();
    filtered = commands.filter((c) => c.label.toLowerCase().includes(q));
    selected = Math.min(selected, Math.max(filtered.length - 1, 0));
    list.innerHTML = filtered.length
      ? filtered.map((c, i) => `<li role="option" data-i="${i}" aria-selected="${i === selected}"><span>${c.label}</span><span>${c.hint}</span></li>`).join('')
      : '<li class="empty">No matching commands</li>';
    list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  };
  const openPalette = () => {
    lastFocus = document.activeElement;
    palette.hidden = false;
    input.value = '';
    selected = 0;
    render();
    input.focus();
  };
  const closePalette = () => {
    palette.hidden = true;
    lastFocus?.focus?.();
  };
  const runSelected = (i = selected) => {
    const cmd = filtered[i];
    if (!cmd) return;
    closePalette();
    cmd.run();
  };

  $('#openPalette').addEventListener('click', openPalette);
  input.addEventListener('input', () => { selected = 0; render(); });
  list.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-i]');
    if (li) runSelected(Number(li.dataset.i));
  });
  palette.addEventListener('click', (e) => { if (e.target === palette) closePalette(); });
  addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.hidden ? openPalette() : closePalette();
      return;
    }
    if (palette.hidden) return;
    if (e.key === 'Escape') closePalette();
    else if (e.key === 'ArrowDown') { e.preventDefault(); selected = (selected + 1) % Math.max(filtered.length, 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selected = (selected - 1 + filtered.length) % Math.max(filtered.length, 1); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); runSelected(); }
  });

  /* ---------- Hero data-network canvas ---------- */
  const canvas = $('#net');
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, nodes = [], running = false, rafId = 0;
  const pointer = { x: -9999, y: -9999 };

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(Math.round((w * h) / 16000), 110);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.8,
    }));
  };

  const draw = () => {
    const rgb = getComputedStyle(root).getPropertyValue('--net').trim();
    const linkDist = 130;
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      const dx = n.x - pointer.x, dy = n.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 14400) { n.x += dx * 0.012; n.y += dy * 0.012; }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist / linkDist) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${rgb}, 0.7)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
  };

  const loop = () => { draw(); if (running) rafId = requestAnimationFrame(loop); };
  const start = () => { if (!running && !reducedMotion && !document.hidden) { running = true; loop(); } };
  const stop = () => { running = false; cancelAnimationFrame(rafId); };

  resize();
  draw();
  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { resize(); draw(); }, 150); });
  const hero = $('.hero');
  hero.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', () => { pointer.x = pointer.y = -9999; });
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
})();
