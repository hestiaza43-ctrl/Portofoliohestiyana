// Interaksi utama: theme switching, typing animation, particles, fade-in on scroll, parallax, contact form
document.addEventListener('DOMContentLoaded', () => {
  // ========== THEME SWITCHER ==========
  const THEME_KEY = 'portfolio-theme';
  const body = document.body;
  const themeButtons = {
    neutral: document.getElementById('theme-neutral'),
    trust: document.getElementById('theme-trust'),
    creative: document.getElementById('theme-creative')
  };

  function applyTheme(name){
    body.classList.remove('theme-neutral','theme-trust','theme-creative');
    if(name === 'trust') body.classList.add('theme-trust');
    else if(name === 'creative') body.classList.add('theme-creative');
    else body.classList.add('theme-neutral');
    // update aria-pressed
    Object.entries(themeButtons).forEach(([k, btn]) => {
      if(btn) btn.setAttribute('aria-pressed', k === name ? 'true' : 'false');
    });
    localStorage.setItem(THEME_KEY, name);
  }

  // Restore saved theme or default to neutral
  const saved = localStorage.getItem(THEME_KEY) || 'neutral';
  applyTheme(saved);

  // Attach events
  if(themeButtons.neutral) themeButtons.neutral.addEventListener('click', () => applyTheme('neutral'));
  if(themeButtons.trust) themeButtons.trust.addEventListener('click', () => applyTheme('trust'));
  if(themeButtons.creative) themeButtons.creative.addEventListener('click', () => applyTheme('creative'));

  // ========== TYPING ANIMATION ==========
  const lines = [
    "Hi, I'm Hestiyana.",
    "Problem solver — Web Dev & Digital Marketer.",
    "Turning Ideas into Digital Experience."
  ];
  const el = document.getElementById('typed-line');
  let li = 0, ci = 0, forward = true;

  function typeLoop(){
    const current = lines[li];
    if(forward){
      el.textContent = current.slice(0, ++ci);
      if(ci === current.length){ forward = false; setTimeout(typeLoop, 900); return; }
    } else {
      el.textContent = current.slice(0, --ci);
      if(ci === 0){ forward = true; li = (li+1) % lines.length; }
    }
    setTimeout(typeLoop, forward ? 80 : 30);
  }
  typeLoop();

  // Cursor blink
  setInterval(()=> {
    document.querySelectorAll('.cursor').forEach(c => c.style.opacity = c.style.opacity == 0 ? 1 : 0);
  }, 600);

  // ========== FADE-IN ON SCROLL ==========
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add('visible');
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.section, .skill-card, .project-preview, .timeline-item').forEach(n => {
    n.classList.add('fade-in');
    io.observe(n);
  });

  // ========== PARALLAX (subtle) ==========
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if(hero) hero.style.backgroundPosition = `center ${s * 0.06}px`;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      el.style.transform = `translateY(${s * speed}px)`;
    });
  });

  // ========== PARTICLES ==========
  const canvas = document.getElementById('particles');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  let w, h, particles = [];
  function resize(){ if(canvas){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; } }
  window.addEventListener('resize', resize); resize();

  function rnd(min,max){ return Math.random()*(max-min)+min; }
  function initParticles(){
    particles = [];
    for(let i=0;i<50;i++){
      particles.push({
        x: rnd(0,w), y: rnd(0,h),
        r: rnd(0.5,2.2),
        vx: rnd(-0.2,0.5), vy: rnd(-0.2,0.2),
        hue: rnd(180,300)
      });
    }
  }
  initParticles();

  function draw(){
    if(!ctx) return;
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -10) p.x = w+10; if(p.x > w+10) p.x = -10;
      if(p.y < -10) p.y = h+10; if(p.y > h+10) p.y = -10;
      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
      g.addColorStop(0, `hsla(${p.hue},65%,60%,0.12)`);
      g.addColorStop(0.5, `hsla(${p.hue},55%,50%,0.06)`);
      g.addColorStop(1, `transparent`);
      ctx.fillStyle = g;
      ctx.arc(p.x,p.y,p.r*8,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();

  // ========== TILT EFFECT ==========
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${ -y * 6 }deg) rotateY(${ x * 8 }deg) translateY(-6px)`;
      card.style.boxShadow = `${x*10}px ${-y*10}px 40px rgba(0,0,0,0.06)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  // ========== FOOTER YEAR ==========
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // ========== CONTACT FORM HANDLER ==========
  const form = document.getElementById('contact-form');
  if(form){
    const toast = document.getElementById('toast');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const loc = form.location.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if(!loc || !email || !message){
        showToast('Isi semua field sebelum mengirim.', 3000, true);
        return;
      }
      const to = 'hello@example.com'; // ganti sesuai kebutuhan
      const subject = encodeURIComponent('Pesan dari Portofolio — Kolaborasi');
      const bodyLines = [
        `Lokasi: ${loc}`,
        `Email pengirim: ${email}`,
        '',
        `Pesan:`,
        message
      ];
      const body = encodeURIComponent(bodyLines.join('\n'));
      const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
      window.location.href = mailto;
      showToast('Email klien Anda akan terbuka. Pastikan aplikasi email terpasang.', 4500, false);
    });

    form.addEventListener('reset', () => showToast('Form direset.', 1200, false));

    function showToast(text, ms = 3000, isError = false){
      toast.hidden = false;
      toast.textContent = text;
      toast.style.background = isError ? 'rgba(220,60,60,0.95)' : `linear-gradient(90deg,var(--accent1),var(--accent2))`;
      toast.style.color = isError ? '#fff' : '#021204';
      setTimeout(()=> { toast.hidden = true; }, ms);
    }
  }
});