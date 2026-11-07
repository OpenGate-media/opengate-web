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

  // ---- textos dinámicos: descripción y ocasión a partir de la familia y las notas ----
  const has = (p, ...w) => w.some(x => (p.fam + ' ' + [...(p.top||[]), ...(p.heart||[]), ...(p.base||[])].join(' ')).toLowerCase().includes(x));
  const low = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : '';
  const desc = p => {
    const who = p.g === 'el' ? 'para él' : p.g === 'ella' ? 'para ella' : 'para cualquiera que lo lleve';
    const open = (p.top || []).slice(0, 2).map(low).join(' y '), heart = (p.heart || []).slice(0, 2).map(low).join(' y '), base = (p.base || []).slice(0, 2).map(low).join(' y ');
    return `Un ${low(p.fam)} ${who}. Abre con ${open}, se asienta en un corazón de ${heart} y deja una estela de ${base}.`;
  };
  const occ = p => {
    const fresh = has(p, 'fresc', 'cítric', 'acuát', 'bergamot', 'limón', 'marin', 'aromát'), sweet = has(p, 'dulce', 'vainilla', 'gourmand', 'caramel', 'ámbar', 'oriental', 'tonka'), wood = has(p, 'amader', 'cuero', 'oud', 'especi', 'tabaco'), flor = has(p, 'floral', 'rosa', 'jazmín', 'flor');
    const st = p.st && p.st.s, pct = k => Math.round(st ? st[k] : 0);
    const day = st ? pct('Day') : fresh ? 90 : sweet ? 45 : 65, night = st ? pct('Night') : sweet || wood ? 90 : 55;
    const sea = st ? { Verano: pct('Summer'), Primavera: pct('Spring'), Otoño: pct('Fall'), Invierno: pct('Winter') } : { Verano: fresh ? 95 : sweet ? 35 : 60, Primavera: fresh || flor ? 90 : 60, Otoño: wood || sweet ? 90 : 60, Invierno: sweet || wood ? 92 : 45 };
    const moments = [];
    if (fresh) moments.push(['Oficina', 'limpio y seguro, no invade el espacio'], ['Día de calor', 'se siente ligero aunque suba la temperatura']);
    if (sweet) moments.push(['Cita', 'cálido y cercano, invita a acercarse'], ['Noche fría', 'brilla cuando el aire está fresco']);
    if (wood) moments.push(['Evento formal', 'presencia y carácter con traje o vestido'], ['Cena', 'elegante sin decir una palabra']);
    if (flor) moments.push(['Celebración de día', 'luminoso, alegre, fácil de llevar']);
    if (moments.length < 2) moments.push(['Día a día', 'versátil, de la mañana a la noche'], ['Salida', 'deja huella al pasar']);
    const line = night > day + 10 ? 'Brilla de noche' : day > night + 10 ? 'Hecho para el día' : 'Del día a la noche';
    return { day, night, sea, moments: moments.slice(0, 3), line };
  };
  const bar = (l, v) => `<div class="vb"><span>${l}</span><i><b style="--v:${v}%"></b></i></div>`;

  const fv = document.createElement('div');
  fv.className = 'v-focus'; fv.setAttribute('aria-hidden', 'true');
  fv.innerHTML = `<button class="v-x" aria-label="Cerrar">×</button>
    <aside class="v-pan v-l"></aside>
    <div class="v-mid"><div class="v-stage"></div><i class="v-plate"></i>
      <div class="v-buy"><span class="mono v-k"></span><h3 class="v-n"></h3><b class="v-price"></b><div class="v-btns"><button class="btn solid v-add">Agregar al carrito</button><button class="btn v-more">Ver ficha</button></div></div></div>
    <aside class="v-pan v-r"></aside>
    <button class="v-nav prev" aria-label="Anterior">‹</button><button class="v-nav next" aria-label="Siguiente">›</button><span class="mono v-count"></span>`;
  document.body.appendChild(fv);
  let cur = 0;
  const show = (k, dir = 0) => {
    cur = (k + items.length) % items.length; const { p, i } = items[cur];
    $('.v-k', fv).textContent = `#${cur + 1} más vendido · ${p.b}`; $('.v-n', fv).textContent = p.n;
    $('.v-price', fv).textContent = p.p + (p.enc ? ' · por encargo' : '');
    $('.v-count', fv).textContent = `${String(cur + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    const ICO = { Oficina: 'M4 8h16v11H4zM9 8V5h6v3', 'Día de calor': 'M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', Cita: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z', 'Noche fría': 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z', 'Evento formal': 'M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2 8 12.7 4 8.8 9.5 8z', Cena: 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2 6 0 8v10', 'Celebración de día': 'M5 21l4-12 6 6-10 6zM14 4l1 2M19 5l-2 1M20 10h-2', 'Día a día': 'M5 6h14v14H5zM5 10h14M9 3v4M15 3v4', Salida: 'M12 21s6-5.7 6-11a6 6 0 0 0-12 0c0 5.3 6 11 6 11zM12 8v4' };
    const svg = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
    const tier = (t, a, n) => a && a.length ? `<div class="vt vt${n}"><span class="vt-k"><b>0${n}</b>${t}</span><p>${a.map(x => `<em>${x}</em>`).join('')}</p></div>` : '';
    const ring = (l, v) => `<div class="vr" style="--v:${v}"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5"/><circle class="f" cx="18" cy="18" r="15.5" pathLength="100"/></svg><b>${v}</b><span>${l}</span></div>`;
    const f = O.profile(p), dn = Math.round(f.night / (f.day + f.night) * 100);
    const key = (t, a) => a && a.length ? `<div class="vt"><span>${t}</span><b>${a[0]}</b></div>` : '';
    $('.v-l', fv).innerHTML = `<div class="vh"><i></i>la fragancia<i></i></div>
      <h4 class="vf drip">${f.tag}</h4><p class="vfam">${p.fam}</p>
      <div class="vpyr">${key('Salida', p.top)}${key('Corazón', p.heart)}${key('Fondo', p.base)}</div>`;
    $('.v-r', fv).innerHTML = `<div class="vh"><i></i>cuándo usarlo<i></i></div>
      <h4 class="vf drip">${f.line}</h4>
      <div class="vdn"><span>☀</span><i><b></b></i><span>☾</span></div>
      <ul class="vo">${f.moments.slice(0, 3).map(([a]) => `<li>${svg(ICO[a] || ICO['Día a día'])}<b>${a}</b></li>`).join('')}</ul>
      <div class="vrs">${Object.entries(f.sea).map(([a, val]) => ring(a, val)).join('')}</div>`;
    const stg = $('.v-stage', fv); stg.innerHTML = `<div class="v-big">${p.img ? O.visual(p) : O.bottle3d(p, false)}</div>`;
    fv.style.setProperty('--c1', p.c1 || '#555');
    if (window.gsap) {
      gsap.fromTo($('.v-big', stg), { x: dir * 220, opacity: 0, rotateY: dir * -40, scale: .9 }, { x: 0, opacity: 1, rotateY: 0, scale: 1, duration: .9, ease: 'expo.out' });
      gsap.fromTo($$('.v-l > *, .v-r > *, .v-r li', fv), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7, ease: 'expo.out', stagger: .045, delay: .15 });
            gsap.fromTo($$('.vb b', fv), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'expo.out', stagger: .05, delay: .4 });
      gsap.fromTo($$('.vr .f', fv), { strokeDashoffset: 100 }, { strokeDashoffset: (k, el) => 100 - +el.closest('.vr').style.getPropertyValue('--v'), duration: 1.4, ease: 'expo.out', stagger: .08, delay: .45 });
      gsap.fromTo($('.vdn b', fv), { left: '50%' }, { left: dn + '%', duration: 1.2, ease: 'expo.out', delay: .4 });
      gsap.fromTo($$('.vt', fv), { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: .7, ease: 'expo.out', stagger: .1, delay: .25 });
      gsap.fromTo($('.v-buy', fv), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .6, delay: .2 });
    }
    $('.v-add', fv).onclick = () => O.addToCart(i, 1);
    $('.v-more', fv).textContent = 'Ver ficha técnica'; $('.v-more', fv).onclick = () => { close(); O.open(i); };
  };
  const openF = (k, from) => {
    show(k); fv.classList.add('on'); fv.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('lock');
    if (window.gsap && from) { const r = from.getBoundingClientRect(); gsap.fromTo($('.v-big', fv), { x: r.left + r.width / 2 - innerWidth / 2, y: r.top + r.height / 2 - innerHeight / 2, scale: .35 }, { x: 0, y: 0, scale: 1, duration: 1, ease: 'expo.out' }); }
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
