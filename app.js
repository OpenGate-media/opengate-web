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

// ---- Contenido de ejemplo ----
const bottle = (t) => `<svg viewBox="0 0 200 360"><rect x="72" y="20" width="56" height="62" rx="3" fill="url(#cp)"/><rect x="85" y="82" width="30" height="20" fill="#333"/><rect x="24" y="100" width="152" height="246" rx="${t}" fill="url(#gl)" stroke="rgba(242,240,236,.25)"/><rect x="40" y="116" width="12" height="214" rx="6" fill="url(#sh)" opacity=".6"/></svg>`;
const P = [{"n": "9 PM Rebel", "b": "Afnan", "c": "EDP", "ml": 100, "g": "uni", "gen": "Unisex", "p": "$ 266.666", "fam": "Frutal amaderado", "top": ["Piña", "manzana verde", "mandarina"], "heart": ["Musgo de roble", "cedro", "vainilla"], "base": ["Maderas secas", "ámbar gris", "caramelo", "almizcle"], "rx": 10, "cat": "Árabe"}, {"n": "Liquid Brun", "b": "French Avenue", "c": "EDP", "ml": 100, "g": "el", "gen": "Hombre", "p": "$ 277.777", "fam": "Oriental especiado", "top": ["Bergamota", "canela", "cardamomo", "azahar"], "heart": ["Vainilla bourbon", "elemí"], "base": ["Almizcle", "praliné", "ambroxan", "guayaco"], "rx": 40, "cat": "Árabe"}, {"n": "Atlas", "b": "Lattafa", "c": "EDP", "ml": 55, "g": "uni", "gen": "Unisex", "p": "$ 188.888", "fam": "Acuático amaderado", "top": ["Sal", "notas marinas", "limón"], "heart": ["Iris", "davana"], "base": ["Ámbar gris", "sándalo", "musgo de roble"], "rx": 4, "cat": "Árabe"}, {"n": "Khamrah", "b": "Lattafa", "c": "EDP", "ml": 100, "g": "uni", "gen": "Unisex", "p": "$ 199.999", "fam": "Oriental dulce especiado", "top": ["Canela", "nuez moscada", "bergamota"], "heart": ["Dátiles", "praliné", "nardo"], "base": ["Vainilla", "haba tonka", "ámbar", "mirra"], "rx": 18, "cat": "Árabe"}, {"n": "Hawas Ice", "b": "Rasasi", "c": "EDP", "ml": 100, "g": "el", "gen": "Hombre", "p": "$ 233.333", "fam": "Fresco frutal", "top": ["Manzana helada", "bergamota", "limón", "anís estrellado"], "heart": ["Azahar", "ciruela", "cardamomo"], "base": ["Musgo", "madera flotante", "ámbar", "almizcle"], "rx": 60, "cat": "Árabe"}, {"n": "Cedrus Blanc", "b": "Rayhaan", "c": "EDP", "ml": 100, "g": "uni", "gen": "Unisex", "p": "$ 377.777", "fam": "Amaderado cítrico", "top": ["Bergamota", "aldehídos"], "heart": ["Azahar"], "base": ["Cedro", "almizcle blanco"], "rx": 2, "cat": "Árabe"}, {"n": "Nocturno Elixir", "b": "Rayhaan", "c": "EDP", "ml": 100, "g": "el", "gen": "Hombre", "p": "$ 199.999", "fam": "Amaderado aromático", "top": ["Limón", "pomelo", "menta"], "heart": ["Jengibre", "nuez moscada"], "base": ["Sándalo", "cedro"], "rx": 12, "cat": "Árabe"}, {"n": "Terra", "b": "Rayhaan", "c": "EDP", "ml": 100, "g": "uni", "gen": "Unisex", "p": "$ 233.333", "fam": "Oriental amaderado", "top": ["Cardamomo", "elemí", "limón", "pimienta de Sichuan", "bergamota"], "heart": ["Pachulí", "azafrán", "rosa", "geranio"], "base": ["Incienso", "ámbar", "vainilla", "oud", "almizcle"], "rx": 30, "cat": "Árabe"}, {"n": "Wolf", "b": "Rayhaan", "c": "EDP", "ml": 100, "g": "el", "gen": "Hombre", "p": "$ 222.222", "fam": "Amaderado oriental", "top": ["Jengibre"], "heart": ["Maderas"], "base": ["Vainilla bourbon"], "rx": 8, "cat": "Árabe"}, {"n": "Black XS", "b": "Paco Rabanne", "c": "EDT", "ml": 100, "g": "el", "gen": "Hombre", "p": "$ 277.777", "fam": "Oriental especiado", "top": ["Limón de Calabria", "calamansi"], "heart": ["Canela", "praliné"], "base": ["Ámbar negro", "pachulí"], "rx": 24, "cat": "Diseñador"}];

if ($('grid')) {
  $('grid').innerHTML = P.map(p => `<article class="card" data-g="${p.g}" tabindex="0">
    <div class="img"><span class="badge">${p.cat.toUpperCase()}</span>${bottle(p.rx)}
      <div class="det">
        <div class="det-top"><span>${p.fam}</span><span class="rec">${p.c} · ${p.ml} ml</span></div>
        <ol>
          <li><i>01 · salida</i><b>${p.top.join(' · ')}</b></li>
          <li><i>02 · corazón</i><b>${p.heart.join(' · ')}</b></li>
          <li><i>03 · fondo</i><b>${p.base.join(' · ')}</b></li>
        </ol>
        <div class="det-bot"><span>${p.gen}</span><span>${p.p}</span></div>
      </div>
    </div>
    <div class="info"><div><h4>${p.n}</h4><div class="mono">${p.b} · ${p.c} · ${p.ml} ml</div></div><div class="price">${p.p}</div></div></article>`).join('');
  document.querySelectorAll('.card').forEach(c => c.addEventListener('click', () => c.classList.toggle('open')));
  document.querySelectorAll('#coleccion .chip').forEach(c => c.onclick = () => {
    document.querySelectorAll('#coleccion .chip').forEach(x => x.classList.remove('on'));
    c.classList.add('on');
    document.querySelectorAll('.card').forEach(k => k.classList.toggle('hide', c.dataset.f !== 'all' && k.dataset.g !== c.dataset.f));
  });
}
if ($('track')) {
  const M = ['marca 01','marca 02','marca 03','marca 04','marca 05','marca 06'];
  $('track').innerHTML = [...M, ...M].map(m => `<span>${m}</span><span>✶</span>`).join('');
}
if ($('pf')) $('pf').innerHTML = ['proyecto 01','proyecto 02','proyecto 03','proyecto 04','proyecto 05'].map((p, i) => `<div class="it"><div class="ph"><img src="/logo-negro.jpg" alt=""></div><div class="lb"><div><span class="mono">Cliente · 2026</span><b>${p}</b></div><span class="mono">0${i + 1}</span></div></div>`).join('');
if ($('svc')) $('svc').innerHTML = ['servicio 01','servicio 02','servicio 03','servicio 04'].map((v, i) => `<div class="row"><span class="mono">0${i + 1}</span><h3>${v}</h3><span class="mono">→</span></div>`).join('');
if ($('reels')) $('reels').innerHTML = ['toma 01','toma 02','toma 03','toma 04'].map((r, i) => `<div class="reel"><div class="ph"><img src="/logo-negro.jpg" alt=""></div><div class="tc mono"><span class="rec">REC</span><span>00:00:0${i + 1}:12</span></div><div class="cap"><span class="mono">Video 0${i + 1}</span><b>${r}</b></div></div>`).join('');

// Timecode con el scroll
const f2 = n => String(n).padStart(2, '0');
addEventListener('scroll', () => {
  const f = Math.floor(scrollY / 4);
  if ($('tc')) $('tc').textContent = `00:${f2(Math.floor(f / 1440) % 60)}:${f2(Math.floor(f / 24) % 60)}:${f2(f % 24)}`;
}, { passive: true });

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
const gate = $('gate'), intro = $('intro');
if (window.gsap && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  const E = 'expo.out';

  if (gate) {
    const o = { r: 0, x: 0 };
    const setG = () => gate.style.clipPath = star(o.r + o.x, innerWidth >= 900 ? 68 : 50, innerWidth >= 900 ? 50 : 34);
    setG();
    const tl = gsap.timeline();
    if (intro) {
      tl.to('#intro img', { opacity: 1, scale: 1.04, duration: .9, ease: 'power2.out' })
        .to('#intro img', { opacity: 0, scale: .9, duration: .5, delay: .35 })
        .to('#intro', { opacity: 0, duration: .5, onComplete: () => intro.remove() }, '<.2');
    }
    tl.to(o, { r: 30, duration: 1.3, ease: E, onUpdate: setG }, '<')
      .from('.hero h1', { yPercent: 30, opacity: 0, duration: 1.1, ease: E }, '-=1')
      .from('.hero-copy .btn,.hero-copy .mono,.scroll-hint', { y: 16, opacity: 0, stagger: .07, duration: .8, ease: E }, '-=.8');
    gsap.fromTo(o, { x: 0 }, { x: 90, immediateRender: false, ease: 'none', onUpdate: setG, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: .5 } });
    gsap.to('.gate-logo', { scale: 1.15, rotate: -4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: .5 } });
    gsap.to('.scroll-hint', { opacity: 0, scrollTrigger: { trigger: '.hero', start: 'top top', end: '15% top', scrub: true } });
  }

  gsap.utils.toArray('.rv,.card,.reel,.pf .it,.svc .row,.door').forEach((el, i) => gsap.from(el, { y: 40, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: E, delay: (i % 4) * .06, scrollTrigger: { trigger: el, start: 'top 92%' } }));
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
  if (gate) gate.style.clipPath = 'none';
}
