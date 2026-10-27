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
  const touch = () => matchMedia('(hover: none), (max-width: 899px)').matches;
  const sheet = document.createElement('div');
  sheet.className = 'sheet'; sheet.innerHTML = '<div class="sheet-card" role="dialog" aria-modal="true"><button class="sheet-x" aria-label="Cerrar">×</button><div id="sheetBody"></div></div>';
  document.body.appendChild(sheet);
  const close = () => sheet.classList.remove('on');
  sheet.addEventListener('click', e => { if (e.target === sheet || e.target.closest('.sheet-x')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.querySelectorAll('.card').forEach((c, i) => c.addEventListener('click', () => {
    if (!touch()) { c.classList.toggle('open'); return; }
    const p = P[i];
    $('sheetBody').innerHTML = `<span class="mono" style="color:#6b6964">${p.cat} · ${p.b}</span><h4>${p.n}</h4>` + c.querySelector('.det').outerHTML;
    sheet.classList.add('on');
  }));
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
    const hero = document.querySelector('.hero-stick'), eyes = $('eyes');
    function apply() {
      const W = hero.clientWidth, H = hero.clientHeight, vmin = Math.min(W, H), desk = W >= 900;
      const S0 = desk ? Math.min(vmin * .78, 640) : Math.min(vmin * .86, 680);
      const cx = desk ? W - W * .06 - S0 / 2 : W / 2;
      const cy = desk ? H / 2 : H / 2 - H * .13;
      const k = st.intro * st.zoom, S = S0 * k;
      const px = cx - S0 / 2 + OX * S0, py = cy - S0 / 2 + OY * S0;
      const x = px - OX * S, y = py - OY * S;
      for (const el of [roto, eyes]) { el.style.setProperty('--ms', S + 'px'); el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px'); }
    }
    apply(); addEventListener('resize', apply);

    const tl = gsap.timeline();
    if (intro) {
      tl.to('#intro img', { opacity: 1, scale: 1.04, duration: .9, ease: 'power2.out' })
        .to('#intro img', { opacity: 0, scale: .9, duration: .5, delay: .35 })
        .to('#intro', { opacity: 0, duration: .5, onComplete: () => intro.remove() }, '<.2');
    }
    tl.to(st, { intro: 1, duration: 1.3, ease: E, onUpdate: apply }, '<')
      .from('.hero h1', { yPercent: 30, opacity: 0, duration: 1.1, ease: E }, '-=1')
      .from('.hero-copy .btn,.hero-copy .mono', { y: 16, opacity: 0, stagger: .07, duration: .8, ease: E }, '-=.8');

    // Scroll: entrar por el roto hasta la imagen de adentro (sin transformar capas gigantes)
    const z = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: .6 } });
    z.fromTo('#heroCopy,.hint-wrap', { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: .18, ease: 'none', immediateRender: false }, 0)
     .fromTo(st, { zoom: 1 }, { zoom: 40, duration: 1, ease: 'power2.in', onUpdate: apply, immediateRender: false }, 0)
     .fromTo('.inside-img', { scale: 1.6, filter: 'blur(10px)' }, { scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }, 0)
     .fromTo('.portal,#eyes', { opacity: 1 }, { opacity: 0, duration: .08, ease: 'none', immediateRender: false }, .92);
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
}
