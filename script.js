/* ============================================================
   THEME
   ============================================================ */
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.documentElement.classList.remove('dark');
  else document.documentElement.classList.add('dark');
})();

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function navScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  // Close mobile menu
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('hamburger-icon').className = 'bi bi-list';
}

/* ============================================================
   LOADING SCREEN
   ============================================================ */
window.addEventListener('load', () => {
  const screen = document.getElementById('loading-screen');
  setTimeout(() => {
    screen.classList.add('hidden');
    setTimeout(() => screen.remove(), 900);
  }, 2000);
});

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

let mobileOpen = false;
function toggleMobileMenu() {
  mobileOpen = !mobileOpen;
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('hamburger-icon');
  menu.classList.toggle('open', mobileOpen);
  icon.className = mobileOpen ? 'bi bi-x' : 'bi bi-list';
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animRing);
})();

document.addEventListener('mousedown', () => {
  ring.style.width  = '20px';
  ring.style.height = '20px';
});
document.addEventListener('mouseup', () => {
  ring.style.width  = '32px';
  ring.style.height = '32px';
});

/* ============================================================
   HERO CANVAS ANIMATION
   ============================================================ */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let raf, time = 0;
  const particles = [];
  const shapes = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function buildParticles() {
    particles.length = 0;
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: rand(0, canvas.width), y: rand(0, canvas.height), z: rand(1, 1000),
        vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3), vz: rand(-2.5, -0.5),
        size: rand(0.5, 2.5), opacity: rand(0.1, 0.5)
      });
    }
  }

  function buildShapes() {
    shapes.length = 0;
    const defs = [
      { fx:0.15, fy:0.3,  type:'hexagon',  size:60,  opacity:0.12, rs:0.005,  fp:0,   fs:0.8, fa:30 },
      { fx:0.80, fy:0.25, type:'square',   size:45,  opacity:0.10, rs:-0.008, fp:1.5, fs:0.6, fa:25 },
      { fx:0.50, fy:0.70, type:'triangle', size:50,  opacity:0.08, rs:0.003,  fp:3,   fs:1.0, fa:35 },
      { fx:0.25, fy:0.75, type:'circle',   size:35,  opacity:0.10, rs:-0.006, fp:2,   fs:0.7, fa:20 },
      { fx:0.75, fy:0.65, type:'hexagon',  size:40,  opacity:0.06, rs:0.004,  fp:4,   fs:0.9, fa:28 },
      { fx:0.40, fy:0.15, type:'triangle', size:30,  opacity:0.09, rs:-0.007, fp:5,   fs:1.1, fa:22 },
    ];
    defs.forEach(d => {
      shapes.push({
        x: d.fx * canvas.width, y: d.fy * canvas.height,
        rotation: 0, rotSpeed: d.rs, type: d.type, size: d.size,
        opacity: d.opacity, phase: d.fp, fspeed: d.fs, famp: d.fa
      });
    });
  }

  function hexPath(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 3 * i - Math.PI / 6;
      i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
              : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
  }

  function triPath(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = Math.PI * 2 / 3 * i - Math.PI / 2;
      i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
              : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
  }

  function draw() {
    time += 0.016;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Radial gradient
    const gr = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width * 0.6);
    gr.addColorStop(0, 'rgba(6,78,59,0.15)');
    gr.addColorStop(0.5, 'rgba(5,46,22,0.05)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Shapes
    shapes.forEach(s => {
      const fy = Math.sin(time * s.fspeed + s.phase) * s.famp;
      const fx = Math.cos(time * s.fspeed * 0.7 + s.phase) * s.famp * 0.5;
      const sx = s.x + fx, sy = s.y + fy;

      ctx.save();
      ctx.globalAlpha = s.opacity;
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.5;

      switch (s.type) {
        case 'circle':
          ctx.beginPath(); ctx.arc(sx, sy, s.size, 0, Math.PI * 2); ctx.stroke();
          break;
        case 'square':
          ctx.translate(sx, sy); ctx.rotate(s.rotation += s.rotSpeed);
          ctx.strokeRect(-s.size/2, -s.size/2, s.size, s.size);
          break;
        case 'triangle':
          ctx.translate(sx, sy); ctx.rotate(s.rotation += s.rotSpeed);
          triPath(ctx, 0, 0, s.size); ctx.stroke();
          break;
        case 'hexagon':
          ctx.translate(sx, sy); ctx.rotate(s.rotation += s.rotSpeed);
          hexPath(ctx, 0, 0, s.size); ctx.stroke();
          break;
      }
      ctx.restore();
    });

    // Connection lines
    ctx.save(); ctx.strokeStyle = '#34d399'; ctx.lineWidth = 0.5;
    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const dx = shapes[i].x - shapes[j].x, dy = shapes[i].y - shapes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < canvas.width * 0.5) {
          ctx.globalAlpha = 0.04 * (1 - dist / (canvas.width * 0.5));
          ctx.beginPath(); ctx.moveTo(shapes[i].x, shapes[i].y); ctx.lineTo(shapes[j].x, shapes[j].y); ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.z += p.vz;
      if (p.z < 1) { p.z = 1000; p.x = rand(0, canvas.width); p.y = rand(0, canvas.height); }
      const sc = 500 / p.z;
      const sx = (p.x - canvas.width/2) * sc + canvas.width/2;
      const sy = (p.y - canvas.height/2) * sc + canvas.height/2;
      const sz = Math.max(0.1, p.size * sc);
      if (sx < -50 || sx > canvas.width+50 || sy < -50 || sy > canvas.height+50) return;
      ctx.save();
      ctx.globalAlpha = p.opacity * Math.min(1, (1000-p.z)/500);
      ctx.fillStyle = '#34d399';
      ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });

    // Grid
    ctx.save(); ctx.globalAlpha = 0.02; ctx.strokeStyle = '#34d399'; ctx.lineWidth = 0.5;
    const gs = 80;
    const ox = (time * 10) % gs, oy = (time * 5) % gs;
    for (let x = -gs + ox; x < canvas.width + gs; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = -gs + oy; y < canvas.height + gs; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    ctx.restore();

    raf = requestAnimationFrame(draw);
  }

  resize();
  buildParticles();
  buildShapes();
  draw();

  window.addEventListener('resize', () => {
    resize();
    buildParticles();
    buildShapes();
  });
})();

/* ============================================================
   HERO ROLE CYCLER
   ============================================================ */
(function initRoleCycler() {
  const roles = [
    { label: 'Graphic Designer',    color: '#34d399' },
    { label: 'System Developer',    color: '#38bdf8' },
    { label: 'Digital Marketer',    color: '#fbbf24' },
    { label: 'Computer Technician', color: '#fb7185' },
    { label: 'IT Professional',     color: '#34d399' },
  ];

  const el = document.getElementById('animated-role');
  if (!el) return;
  let idx = 0;

  function cycle() {
    el.classList.add('fade-out');
    el.style.color = '';
    setTimeout(() => {
      idx = (idx + 1) % roles.length;
      el.textContent = roles[idx].label;
      el.style.color = roles[idx].color;
      el.classList.remove('fade-out');
    }, 450);
  }

  el.style.color = roles[0].color;
  setInterval(cycle, 2500);
})();

/* ============================================================
   INTERSECTION OBSERVER — REVEAL + SKILL BARS
   ============================================================ */
const skillsObserved = new Set();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);

    // Animate skill bars inside this revealed card
    entry.target.querySelectorAll('.ski-fill').forEach((bar, i) => {
      if (skillsObserved.has(bar)) return;
      skillsObserved.add(bar);
      const w = bar.dataset.w;
      setTimeout(() => {
        bar.style.width = w + '%';
      }, 100 + i * 80);
    });
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   PORTFOLIO FILTER + LIGHTBOX
   ============================================================ */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.pcard').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// Open lightbox
document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('click', () => openLightbox(card));
});

function openLightbox(card) {
  document.getElementById('lb-img').src   = card.dataset.img || '';
  document.getElementById('lb-img').alt   = card.dataset.title || '';
  document.getElementById('lb-sub').innerHTML  = card.dataset.sub   || '';
  document.getElementById('lb-title').innerHTML = card.dataset.title || '';
  document.getElementById('lb-desc').textContent = card.dataset.desc || '';
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ============================================================
   TESTIMONIALS SLIDER
   ============================================================ */
const testimonials = [
  {
    name: 'Romer Maitim',
    role: 'CEO, RMM Inc. — San Jose Del Monte Bulacan',
    text: 'Cyken is a dedicated professional with a strong eye for design and a keen understanding of what businesses need to stand out. His work ethic and creativity made a real impact for our operations.'
  },
  {
    name: 'Randy S. Petallo, MPA',
    role: 'MGDH-1 (HRMO), LGU — Del Carmen, Surigao del Norte',
    text: 'During his time with us, Cyken consistently demonstrated reliability, professionalism, and a willingness to go above and beyond. He is a trustworthy individual and a valuable asset to any team.'
  },
  {
    name: 'Local Business Owner',
    role: 'Retail Store, Siargao Island',
    text: 'Cyken designed our brand logo and all of our social media graphics. The results were incredible — our customers immediately noticed the professional look and our engagement doubled.'
  },
  {
    name: 'Marketing Manager',
    role: 'SME, Bulacan Philippines',
    text: 'His understanding of digital marketing is impressive. The content strategy he put together was practical, well-researched, and delivered results in just a few weeks.'
  },
];

let testiIdx = 0;

function renderTesti() {
  const t = testimonials[testiIdx];
  document.getElementById('testi-text').textContent = '"' + t.text + '"';
  document.getElementById('testi-name').textContent = t.name;
  document.getElementById('testi-role').textContent = t.role;

  // Dots
  const dotsEl = document.getElementById('testi-dots');
  dotsEl.innerHTML = testimonials.map((_, i) => `<div class="tdot ${i === testiIdx ? 'active' : ''}" onclick="goTesti(${i})"></div>`).join('');
}

function goTesti(idx) {
  const textEl = document.getElementById('testi-text');
  textEl.classList.add('fading');
  setTimeout(() => {
    testiIdx = idx;
    renderTesti();
    textEl.classList.remove('fading');
  }, 300);
}

function nextTesti() { goTesti((testiIdx + 1) % testimonials.length); }
function prevTesti() { goTesti((testiIdx - 1 + testimonials.length) % testimonials.length); }

renderTesti();

// Auto-advance every 5s
setInterval(() => nextTesti(), 5000);

/* ============================================================
   NEWSLETTER FORM
   ============================================================ */
function handleNewsletter(e) {
  e.preventDefault();
  const form = document.getElementById('newsletter-form');
  const success = document.getElementById('nl-success');
  form.style.display = 'none';
  success.classList.add('show');
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function handleContact(e) {
  e.preventDefault();
  const btn = document.getElementById('contact-btn');
  btn.textContent = 'Message Sent!';
  btn.disabled = true;
  btn.style.background = '#059669';
  setTimeout(() => {
    btn.innerHTML = '<i class="bi bi-send"></i> Send Message';
    btn.disabled = false;
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}