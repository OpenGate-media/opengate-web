const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

// Roto: estrella irregular de 10 puntas como clip-path
const spikes = [1, .82, 1.05, .9, 1, .78, 1.08, .86, .95, .84];
function star(r, cx = 50, cy = 50) {
  const p = [];
  for (let i = 0; i < 20; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 10 + .12;
    const rr = i % 2 ? r * .42 : r * spikes[i / 2];
    p.push(`${(cx + Math.cos(a) * rr).toFixed(2)}% ${(cy + Math.sin(a) * rr).toFixed(2)}%`);
  }
  return `polygon(${p.join(',')})`;
}
document.documentElement.style.setProperty('--star', star(48));
document.documentElement.style.setProperty('--star0', star(0));
document.documentElement.style.setProperty('--starX', star(210));

if ($('track')) {
  const M = ['marca 01','marca 02','marca 03','marca 04','marca 05','marca 06'];
  $('track').innerHTML = [...M, ...M].map(m => `<span>${m}</span><span>✶</span>`).join('');
}
if ($('pf')) $('pf').innerHTML = ['proyecto 01','proyecto 02','proyecto 03','proyecto 04','proyecto 05'].map((p, i) => `<div class="it"><div class="ph"><img src="/logo-negro.jpg" alt=""></div><div class="lb"><div><span class="mono">Cliente · 2026</span><b>${p}</b></div><span class="mono">0${i + 1}</span></div></div>`).join('');
if ($('svc')) $('svc').innerHTML = ['servicio 01','servicio 02','servicio 03','servicio 04'].map((v, i) => `<div class="row"><span class="mono">0${i + 1}</span><h3>${v}</h3><span class="mono">→</span></div>`).join('');
if ($('reels')) $('reels').innerHTML = ['toma 01','toma 02','toma 03','toma 04'].map((r, i) => `<div class="reel"><div class="ph"><img src="/logo-negro.jpg" alt=""></div><div class="tc mono"><span class="rec">REC</span><span>00:00:0${i + 1}:12</span></div><div class="cap"><span class="mono">Video 0${i + 1}</span><b>${r}</b></div></div>`).join('');

// Timecode REC: tiempo que lleva el visitante en la página (hh:mm:ss:frames)
const f2 = n => String(n).padStart(2, '0');
const t0 = performance.now();
(function tick() {
  const el = $('tc');
  if (el) {
    const ms = performance.now() - t0, s = Math.floor(ms / 1000);
    el.textContent = `${f2(Math.floor(s / 3600))}:${f2(Math.floor(s / 60) % 60)}:${f2(s % 60)}:${f2(Math.floor((ms % 1000) / 1000 * 24))}`;
  }
  requestAnimationFrame(tick);
})();

// Aerosol en canvas (prdct)
let dens = .2;
const cv = $('spray');
if (cv) {
  const cx = cv.getContext('2d');
  const fit = () => { cv.width = cv.offsetWidth * devicePixelRatio; cv.height = cv.offsetHeight * devicePixelRatio; };
  fit(); addEventListener('resize', fit);
  const parts = Array.from({ length: 900 }, () => ({ a: Math.random() * 6.283, r: Math.pow(Math.random(), .6), s: Math.random() * 1.6 + .3, v: Math.random() * .002 + .0005 }));
  (function draw() {
    const w = cv.width, h = cv.height;
    cx.clearRect(0, 0, w, h);
    cx.fillStyle = getComputedStyle(document.body).getPropertyValue('--fg');
    parts.forEach(p => {
      p.a += p.v;
      const R = p.r * Math.min(w, h) * .48 * (.6 + dens * .6);
      cx.globalAlpha = (1 - p.r) * .7 * dens + .05;
      cx.fillRect(w / 2 + Math.cos(p.a) * R, h / 2 + Math.sin(p.a) * R * .9, p.s * devicePixelRatio, p.s * devicePixelRatio);
    });
    if (!reduce) requestAnimationFrame(draw);
  })();
}

// ---- Animaciones ----
const roto = $('portal'), intro = $('intro');
// Siempre empezar arriba en la portada (evita quedar a mitad del zoom al recargar)
if (roto) { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; scrollTo(0, 0); }
if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  const E = 'expo.out';

  if (roto) {
    // Geometría del roto: tamaño base, centro y punto de entrada (dentro del roto, junto a los ojos)
    const st = { intro: .82, zoom: 1 }, OX = .38, OY = .40;
    // Flotación continua del roto: deriva suave como si estuviera suspendido en el aire
    const fl = { x: 0, y: 0, s: 1 };
    const hero = document.querySelector('.hero-stick'), eyes = $('eyes');
    function apply() {
      const W = hero.clientWidth, H = hero.clientHeight, vmin = Math.min(W, H), desk = W >= 900;
      const S0 = desk ? Math.min(vmin * .78, 640) : Math.min(vmin * .86, 680);
      const cx = desk ? W - W * .06 - S0 / 2 : W / 2;
      const cy = desk ? H / 2 : H / 2 - H * .13;
      const k = st.intro * st.zoom * fl.s, S = S0 * k;
      const px = cx - S0 / 2 + OX * S0 + fl.x, py = cy - S0 / 2 + OY * S0 + fl.y;
      const x = px - OX * S, y = py - OY * S;
      for (const el of [roto, eyes]) { el.style.setProperty('--ms', S + 'px'); el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px'); }
    }
    apply(); addEventListener('resize', apply);
    (function float() {
      const t = performance.now() / 1000, d = Math.min(innerWidth, innerHeight) / 100;
      fl.x = Math.sin(t * .55) * 1.1 * d + Math.sin(t * 1.3) * .3 * d;
      fl.y = Math.sin(t * .8 + 1) * 1.6 * d;
      fl.s = 1 + Math.sin(t * .65) * .018;
      if (st.zoom < 30) apply();
      requestAnimationFrame(float);
    })();

    const tl = gsap.timeline();
    if (intro) {
      tl.to('#intro img', { opacity: 1, scale: 1.04, duration: .9, ease: 'power2.out' })
        .to('#intro img', { opacity: 0, scale: .9, duration: .5, delay: .35 })
        .to('#intro', { opacity: 0, duration: .5, onComplete: () => intro.remove() }, '<.2');
    }
    tl.to(st, { intro: 1, duration: 1.3, ease: E, onUpdate: apply }, '<')
      .from('.hero h1', { yPercent: 30, opacity: 0, duration: 1.1, ease: E }, '-=1')
      .from('.hero-copy .kick', { y: 12, opacity: 0, duration: .8, ease: E }, '-=.8');

    // Scroll: entrar por el roto hasta la imagen de adentro (sin transformar capas gigantes)
    const z = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: .6 } });
    z.fromTo('#heroCopy,.hint-wrap', { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: .18, ease: 'none', immediateRender: false }, 0)
     .fromTo(st, { zoom: 1 }, { zoom: 40, duration: 1, ease: 'power2.in', onUpdate: apply, immediateRender: false }, 0)
     .fromTo('.inside-img', { scale: 1.6, filter: 'blur(10px)' }, { scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }, 0)
     .fromTo('.portal,#eyes', { opacity: 1 }, { opacity: 0, duration: .08, ease: 'none', immediateRender: false }, .92);
  }

  gsap.utils.toArray('.rv,.reel,.pf .it,.svc .row,.door').forEach((el, i) => gsap.from(el, { y: 40, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: E, delay: (i % 4) * .06, scrollTrigger: { trigger: el, start: 'top 92%' } }));
  gsap.utils.toArray('.head h2,.cta h2,.prdct-h').forEach(el => gsap.from(el, { yPercent: 25, opacity: 0, duration: 1.1, ease: E, scrollTrigger: { trigger: el, start: 'top 90%' } }));

  const L = gsap.utils.toArray('.layer');
  if (L.length) {
    gsap.set(L, { opacity: 0, y: 40 }); gsap.set(L[0], { opacity: 1, y: 0 });
    const d = { v: .2 };
    gsap.timeline({ scrollTrigger: { trigger: '.notes', start: 'top top', end: 'bottom bottom', scrub: .6 } })
      .to('#nbar', { width: '33%', duration: 1 }).to(L[0], { opacity: 0, y: -40, duration: .5 }).to(L[1], { opacity: 1, y: 0, duration: .5 }, '<.2').to('#nbar', { width: '66%', duration: 1 }, '<')
      .to(L[1], { opacity: 0, y: -40, duration: .5 }).to(L[2], { opacity: 1, y: 0, duration: .5 }, '<.2').to('#nbar', { width: '100%', duration: 1 }, '<')
      .to(d, { v: 1, duration: 3, ease: 'none', onUpdate: () => dens = d.v }, 0).to('#nbottle', { rotate: -6, duration: 3, ease: 'none' }, 0);
  }
} else {
  if (intro) intro.remove();
}

// ---- Barra superior: píldora que sigue al cursor, progreso de lectura y modo compacto ----
(() => {
  const tabs = document.querySelector('.tabs'), nav = document.querySelector('nav.topbar');
  if (!tabs || !nav) return;
  const pill = tabs.querySelector('.pill'), links = [...tabs.querySelectorAll('a')];
  const active = links.find(a => a.classList.contains('on'));
  const moveTo = a => {
    if (!a) { pill.style.width = '0px'; return; }
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = `translateX(${a.offsetLeft}px)`;
    links.forEach(l => { l.classList.toggle('hov', l === a && l !== active); l.classList.toggle('away', l === active && a !== active); });
  };
  const rest = () => { moveTo(active); links.forEach(l => l.classList.remove('hov', 'away')); };
  links.forEach(a => { a.addEventListener('pointerenter', () => moveTo(a)); a.addEventListener('focus', () => moveTo(a)); });
  tabs.addEventListener('pointerleave', rest);
  tabs.addEventListener('focusout', rest);
  requestAnimationFrame(() => { rest(); requestAnimationFrame(() => tabs.classList.add('ready')); });
  addEventListener('resize', rest);
  if (document.fonts) document.fonts.ready.then(rest);
  const prog = nav.querySelector('.prog');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
    nav.classList.toggle('min', scrollY > 40);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();

// Títulos de portada: nunca más de 3 líneas — si una línea no cabe, se reduce el tamaño
(() => {
  const hs = [...document.querySelectorAll('.hero h1,.ph-copy h1')];
  if (!hs.length) return;
  const fit = () => hs.forEach(h => {
    h.style.fontSize = '';
    const box = h.closest('.hero-copy') || h.parentElement;
    const gut = innerWidth >= 768 ? 80 : 32;
    const max = Math.min(box.clientWidth || innerWidth, innerWidth - gut);
    const w = h.scrollWidth;
    if (w > max) h.style.fontSize = (parseFloat(getComputedStyle(h).fontSize) * max / w * .98) + 'px';
  });
  fit(); addEventListener('resize', fit);
  if (document.fonts) document.fonts.ready.then(fit);
})();
