// ===== Vitrina: pared con repisas; al tocar un producto la cámara "entra" y lo muestra en grande =====
(function init() {
  if (!window.OG) { document.addEventListener('og:ready', init, { once: true }); return; }
  const O = window.OG, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wall = $('#vitrinaWall'); if (!wall) return;
  const items = O.P.map((p, i) => ({ p, i })).filter(x => !x.p.enc);
  const PER = 5;
  wall.innerHTML = Array.from({ length: Math.ceil(items.length / PER) }, (_, r) =>
    `<div class="v-shelf">${items.slice(r * PER, r * PER + PER).map(({ p, i }, k) =>
      `<button class="v-item" data-i="${i}" style="--d:${(r * PER + k) * 40}ms" aria-label="Ver ${p.n}"><span class="v-obj">${p.img ? O.visual(p) : O.bottle3d(p, false)}</span><span class="v-tag">${p.n}</span></button>`).join('')}<i class="v-glass"></i></div>`).join('');

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
