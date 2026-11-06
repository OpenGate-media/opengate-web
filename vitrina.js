// ===== Vitrina: pared con repisas; al tocar un producto la cámara "entra" y lo muestra en grande =====
(function init() {
  if (!window.OG) { document.addEventListener('og:ready', init, { once: true }); return; }
  const O = window.OG, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wall = $('#vitrinaWall'); if (!wall) return;
  // Solo perfumes de nicho y de diseñador, del más vendido al menos vendido
  // (ranking por popularidad en Colombia; cambiar el orden aquí cuando haya ventas reales)
  const RANK = ['Sauvage', 'Acqua di Giò Parfum', 'Y Eau de Parfum', 'Good Girl', 'La Vie Est Belle', 'Le Male Elixir', 'Eros Flame', 'Black XS', 'Born in Roma Uomo', 'Donna Born in Roma', 'Aventus', 'Baccarat Rouge 540', 'Layton', 'Erba Pura', 'Collection II · Set'];
  const pos = n => { const k = RANK.indexOf(n); return k < 0 ? 999 : k; };
  const items = O.P.map((p, i) => ({ p, i })).filter(x => x.p.cat === 'Nicho' || x.p.cat === 'Diseñador').sort((a, b) => pos(a.p.n) - pos(b.p.n));
  const PER = matchMedia("(max-width:600px)").matches ? 3 : 4, PAGE = PER * 2;
  const cell = ({ p, i }, n) => `<button class="v-item" data-i="${i}" style="--d:${n * 40}ms" aria-label="Ver ${p.n}"><span class="v-rk">#${n + 1}</span><span class="v-obj">${p.img ? O.visual(p) : O.bottle3d(p, false)}</span><span class="v-spot"></span><span class="v-tag"><b>${p.n}</b><small>${p.enc ? 'por encargo · ' : ''}${p.p}</small></span></button>`;
  const pages = Math.ceil(items.length / PAGE);
  wall.innerHTML = `<div class="v-track">${Array.from({ length: pages }, (_, g) => `<div class="v-page">${[0, 1].map(r => { const a = g * PAGE + r * PER; return `<div class="v-shelf">${items.slice(a, a + PER).map((x, k) => cell(x, a + k)).join('')}<i class="v-glass"></i></div>`; }).join('')}</div>`).join('')}</div>
    <div class="v-car"><button class="v-cp" aria-label="Mostrario anterior">‹</button><span class="v-dots">${Array.from({ length: pages }, (_, g) => `<i data-g="${g}"></i>`).join('')}</span><button class="v-cn" aria-label="Mostrario siguiente">›</button></div>`;
  const track = $('.v-track', wall), dots = $$('.v-dots i', wall);
  const go = g => track.scrollTo({ left: Math.max(0, Math.min(pages - 1, g)) * track.clientWidth, behavior: 'smooth' });
  const curPage = () => Math.round(track.scrollLeft / track.clientWidth);
  const mark = () => { const g = curPage(); dots.forEach((d, k) => d.classList.toggle('on', k === g)); $('.v-cp', wall).disabled = g === 0; $('.v-cn', wall).disabled = g === pages - 1; };
  track.addEventListener('scroll', () => requestAnimationFrame(mark)); mark();
  $('.v-cp', wall).onclick = () => go(curPage() - 1); $('.v-cn', wall).onclick = () => go(curPage() + 1);
  dots.forEach(d => d.onclick = () => go(+d.dataset.g));

  const fv = document.createElement('div');
  fv.className = 'v-focus'; fv.setAttribute('aria-hidden', 'true');
  fv.innerHTML = `<button class="v-x" aria-label="Cerrar">×</button>
    <div class="v-top"><span class="mono v-k"></span><h3 class="v-n"></h3><p class="v-f"></p></div>
    <div class="v-side"><b class="v-price"></b><button class="btn solid v-add">Agregar al carrito</button><button class="btn v-more">Ver ficha completa</button></div>
    <button class="v-nav prev" aria-label="Anterior">‹</button><div class="v-stage"></div><button class="v-nav next" aria-label="Siguiente">›</button>
    <i class="v-plate"></i><span class="mono v-count"></span>`;
  document.body.appendChild(fv);
  let cur = 0;
  const show = (k, dir = 0) => {
    cur = (k + items.length) % items.length; const { p, i } = items[cur];
    $('.v-k', fv).textContent = `${p.cat} · ${p.b}`; $('.v-n', fv).textContent = p.n;
    $('.v-f', fv).textContent = `${p.fam} · ${p.gen} · ${p.c}${p.ml ? ' · ' + p.ml + ' ml' : ''}`;
    $('.v-price', fv).textContent = p.p; $('.v-count', fv).textContent = `${String(cur + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    const st = $('.v-stage', fv); st.innerHTML = `<div class="v-big">${p.img ? O.visual(p) : O.bottle3d(p, false)}</div>`;
    if (window.gsap) gsap.fromTo($('.v-big', st), { x: dir * 260, opacity: 0, rotateY: dir * -40, scale: .85 }, { x: 0, opacity: 1, rotateY: 0, scale: 1, duration: .9, ease: 'expo.out' });
    $('.v-add', fv).onclick = () => O.addToCart(i, 1);
    $('.v-more', fv).onclick = () => { close(); O.open(i); };
  };
  const openF = (k, from) => {
    show(k); fv.classList.add('on'); fv.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('lock');
    if (window.gsap && from) { const r = from.getBoundingClientRect(); gsap.fromTo($('.v-big', fv), { x: r.left + r.width / 2 - innerWidth / 2, y: r.top + r.height / 2 - innerHeight / 2, scale: .35 }, { x: 0, y: 0, scale: 1, duration: 1, ease: 'expo.out' }); gsap.fromTo([$('.v-top', fv), $('.v-side', fv)], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, delay: .25, ease: 'expo.out', stagger: .08 }); }
  };
  const close = () => { fv.classList.remove('on'); fv.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('lock'); };
  $$('.v-item', wall).forEach(b => b.onclick = () => openF(items.findIndex(x => x.i === +b.dataset.i), b));
  $('.prev', fv).onclick = () => show(cur - 1, -1); $('.next', fv).onclick = () => show(cur + 1, 1);
  $('.v-x', fv).onclick = close;
  addEventListener('keydown', e => { if (!fv.classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(cur + 1, 1); if (e.key === 'ArrowLeft') show(cur - 1, -1); });
  let sx = null; fv.addEventListener('pointerdown', e => sx = e.clientX); fv.addEventListener('pointerup', e => { if (sx === null) return; const d = e.clientX - sx; if (Math.abs(d) > 60) show(cur + (d < 0 ? 1 : -1), d < 0 ? 1 : -1); sx = null; });
  // la pared se mueve levemente con el cursor
  const sec = $('#vitrina');
  sec.addEventListener('pointermove', e => { const r = sec.getBoundingClientRect(); wall.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3)); wall.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
  if (window.gsap && window.ScrollTrigger) gsap.from($$('.v-item', wall), { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .04, scrollTrigger: { trigger: wall, start: 'top 80%' } });
})();
