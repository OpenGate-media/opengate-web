// og.prdct — banner 3D, tarjetas que giran, ficha de pedido y lista
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = n => '$ ' + n.toLocaleString('es-CO').replace(/,/g, '.');

  // ---------- Frasco: foto real, giro por fotogramas o frasco 3D de muestra ----------
  function bottle3d(p, label = true) {
    return `<div class="b3d" style="--c1:${p.c1};--c2:${p.c2}">
      <div class="b3d-cap"><i class="f fr"></i><i class="f bk"></i><i class="f lf"></i><i class="f rt"></i><i class="f tp"></i></div>
      <div class="b3d-neck"></div>
      <div class="b3d-body">
        <i class="f fr">${label ? `<span class="lbl"><small>${p.b}</small><b>${p.n}</b><small>${p.ml ? `${p.c} · ${p.ml} ml` : p.c}</small></span>` : ''}</i>
        <i class="f bk"><span class="lbl og">og</span></i><i class="f lf"></i><i class="f rt"></i><i class="f tp"></i><i class="f bt"></i>
      </div></div>`;
  }
  // Frasco real recortado (sin fondo) con profundidad: capas para dar grosor al girar
  function cut3d(p) {
    const layers = [6, 5, 4, 3, 2, 1].map(z => `<img class="cl" src="${p.cut}" alt="" aria-hidden="true" style="--z:${z}">`).join('');
    return `<div class="cut3d">${layers}<img class="cf" src="${p.cut}" alt="${p.n}"><i class="sheen" style="-webkit-mask-image:url(${p.cut});mask-image:url(${p.cut})"></i></div><span class="cut-floor" aria-hidden="true"></span>`;
  }
  function visual(p) {
    if (p.cut) return cut3d(p);
    if (p.frames && p.frames.length) return `<img class="ph frames" src="${p.frames[0]}" alt="${p.n}" data-frames='${JSON.stringify(p.frames)}'>`;
    if (p.img) return `<img class="ph" src="${p.img}" alt="${p.n}">`;
    return bottle3d(p);
  }

  // ---------- Lista (guardados) ----------
  let list = [];
  try { list = JSON.parse(localStorage.getItem('og-lista') || '[]'); } catch (e) {}
  const saveList = () => { try { localStorage.setItem('og-lista', JSON.stringify(list)); } catch (e) {} paintList(); };
  function paintList() {
    $$('.list-count').forEach(el => { el.textContent = list.length; el.parentElement.classList.toggle('has', list.length > 0); });
    $$('.save-btn').forEach(b => { const on = list.includes(+b.dataset.i); b.classList.toggle('on', on); b.querySelector('span').textContent = on ? 'en tu lista' : 'guardar en mi lista'; });
  }

  // ---------- Carrito ----------
  // Disponibles: 1 unidad en stock. Por encargo: hasta 9.
  const maxQ = p => p.enc ? 9 : 1;
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('og-carrito') || '[]').filter(o => P[o.i]).map(o => ({ i: o.i, q: Math.max(1, Math.min(maxQ(P[o.i]), o.q)) })); } catch (e) {}
  const saveCart = () => { try { localStorage.setItem('og-carrito', JSON.stringify(cart)); } catch (e) {} paintCart(); };
  const cartN = () => cart.reduce((s, o) => s + o.q, 0);
  function paintCart(bump) {
    $$('.cart-count').forEach(el => { el.textContent = cartN(); el.parentElement.classList.toggle('has', cart.length > 0); if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } });
  }
  function addToCart(i, q = 1) {
    const o = cart.find(x => x.i === i);
    const m = maxQ(P[i]);
    if (o && o.q >= m) { toastAction(`Solo hay ${m} unidad de ${P[i].n} y ya está en tu carrito`, 'ver carrito', () => openCart()); return; }
    if (o) o.q = Math.min(m, o.q + q); else cart.push({ i, q: Math.min(m, q) });
    saveCart(); paintCart(true);
    toastAction(`${P[i].n} en tu carrito`, 'ver carrito', () => openCart());
  }

  // ---------- Pago: checkout de Shopify con los productos ya en el carrito ----------
  // Cupón: se valida aquí para mostrar el precio y se envía a Shopify, que aplica el descuento real
  let coupon = '';
  try { coupon = localStorage.getItem('og-cupon') || ''; } catch (e) {}
  if (!(typeof COUPONS !== 'undefined' && COUPONS[coupon])) coupon = '';
  const rate = () => (coupon && COUPONS[coupon]) || 0;
  const disc = n => Math.round(n * (1 - rate()));
  const setCoupon = c => { coupon = c; try { c ? localStorage.setItem('og-cupon', c) : localStorage.removeItem('og-cupon'); } catch (e) {} };
  const mlTxt = p => p.ml ? ` · ${p.ml} ml` : '';
  const couponBox = () => `<div class="cpn">
      <input class="cpn-in" placeholder="¿Tienes un cupón?" value="${coupon}" autocapitalize="characters" aria-label="Cupón de descuento">
      <button class="cpn-btn">${coupon ? 'quitar' : 'aplicar'}</button></div>
      <div class="cpn-msg mono">${coupon ? `cupón ${coupon} · −${Math.round(rate() * 100)}%` : ''}</div>`;
  function wireCoupon(root, repaint) {
    const inp = $('.cpn-in', root), btn = $('.cpn-btn', root), m = $('.cpn-msg', root);
    const apply = () => {
      if (coupon) { setCoupon(''); inp.value = ''; btn.textContent = 'aplicar'; m.textContent = ''; repaint(); return; }
      const c = inp.value.trim().toUpperCase();
      if (COUPONS[c]) { setCoupon(c); btn.textContent = 'quitar'; m.textContent = `cupón ${c} · −${Math.round(COUPONS[c] * 100)}%`; toast(`Cupón ${c} aplicado`); }
      else { m.textContent = 'cupón no válido'; }
      repaint();
    };
    btn.onclick = apply; inp.onkeydown = e => { if (e.key === 'Enter') apply(); };
  }
  const checkout = items => {
    const parts = items.filter(o => o.p.vid).map(o => `${o.p.vid}:${o.q}`);
    if (!SHOP || !parts.length) { toast('Este producto aún no tiene pago en línea. Pregúntanos y te ayudamos.'); return; }
    location.href = `https://${SHOP}/cart/${parts.join(',')}${coupon ? `?discount=${encodeURIComponent(coupon)}` : ''}`;
  };

  // ---------- Mensaje y canales ----------
  // Canal elegido para escribir: WhatsApp o Instagram (se recuerda)
  let canal = 'wa';
  try { canal = localStorage.getItem('og-canal') || (WHATSAPP ? 'wa' : 'ig'); } catch (e) {}
  if (!WHATSAPP) canal = 'ig';
  const chLabel = () => canal === 'wa' ? 'Escribir por WhatsApp →' : 'Escribir por Instagram →';
  const chSwitch = () => WHATSAPP ? `<div class="ch-sw" role="radiogroup" aria-label="Canal"><button data-c="wa" class="${canal === 'wa' ? 'on' : ''}">WhatsApp</button><button data-c="ig" class="${canal === 'ig' ? 'on' : ''}">Instagram</button><i></i></div>` : '';
  function wireSwitch(root, btn) {
    $$('.ch-sw button', root).forEach(b => b.onclick = () => { canal = b.dataset.c; try { localStorage.setItem('og-canal', canal); } catch (e) {} $$('.ch-sw button', root).forEach(x => x.classList.toggle('on', x === b)); $('.ch-sw', root).dataset.c = canal; if (btn) btn.textContent = chLabel(); });
    const sw = $('.ch-sw', root); if (sw) sw.dataset.c = canal; if (btn) btn.textContent = chLabel();
  }
  function send(text) {
    if (WHATSAPP && canal === 'wa') { window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener'); return; }
    // Instagram no deja precargar texto: lo copiamos y abrimos el chat
    // Instagram no permite que una web escriba el mensaje dentro del chat: lo copiamos para pegarlo con un toque
    const go = () => window.open(`https://ig.me/m/${IG}`, '_blank', 'noopener');
    const done = () => { toast('Mensaje listo y copiado ✓ En el chat de Instagram mantén presionado y toca Pegar.'); setTimeout(go, 900); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => { fallbackCopy(text); done(); });
    else { fallbackCopy(text); done(); }
  }
  function fallbackCopy(t) { const a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); }
  function toastAction(t, label, fn) {
    toast(t); const el = $('.toast'); const b = document.createElement('button'); b.className = 'toast-act'; b.textContent = label; b.onclick = () => { el.classList.remove('on'); fn(); }; el.appendChild(b);
  }
  function toast(t) {
    let el = $('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 4200);
  }

  // ---------- Banner ----------
  const hero = $('#prdHero');
  if (hero) {
    const star = P.find(p => p.n === 'Khamrah') || P[0];
    $('#heroBottle').innerHTML = bottle3d(star);
    $('#heroFrom').textContent = fmt(Math.min(...P.filter(p => p.pn).map(p => p.pn)));
    $('#heroCount').textContent = P.length;
    $('#heroName').textContent = `${star.n} · ${star.b}`;
    $('#heroOpen').onclick = () => open(P.indexOf(star));
  }

  // ---------- Tarjetas ----------
  const grid = $('#grid');
  if (grid) {
    const card = (p, i) => `<article class="card" data-g="${p.g}" data-k="${p.k || 'perfumes'}" data-i="${i}" tabindex="0" aria-label="${p.n}, ${p.b}. Ver ficha">
      <div class="img"><span class="badge">${p.cat.toUpperCase()}</span>${p.enc ? '<span class="badge enc">ENCARGO</span>' : ''}${p.enc ? '' : `<span class="num mono">${String(i + 1).padStart(3, '0')}</span>`}
        <div class="stage">${visual(p)}</div>
        <span class="explore mono">explorar ↗</span>
        <button class="q-add" data-i="${i}" aria-label="Agregar ${p.n} al carrito">+</button>
      </div>
      <div class="info"><span class="mono">${p.b}</span><h4>${p.n}</h4><div class="i-row"><span class="fam">${p.c}${mlTxt(p)}</span><span class="price${p.pn ? '' : ' tbd'}">${p.p}</span></div></div></article>`;
    const grid2 = $('#grid2');
    grid.innerHTML = P.map((p, i) => p.enc ? '' : card(p, i)).join('');
    if (grid2) grid2.innerHTML = P.map((p, i) => p.enc ? card(p, i) : '').join('');

    const hoverable = matchMedia('(hover: hover)').matches;
    $$('#coleccion .card').forEach(card => {
      const st = $('.stage', card), i = +card.dataset.i, fr = $('.frames', card);
      if (hoverable) {
        card.addEventListener('pointermove', e => {
          const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          if (fr) { const F = JSON.parse(fr.dataset.frames); fr.src = F[Math.min(F.length - 1, Math.floor(x * F.length))]; }
          st.style.setProperty('--ry', ((x - .5) * 150).toFixed(1) + 'deg');
          st.style.setProperty('--rx', ((.5 - y) * 14).toFixed(1) + 'deg');
        });
        card.addEventListener('pointerleave', () => { st.style.removeProperty('--ry'); st.style.removeProperty('--rx'); if (fr) fr.src = JSON.parse(fr.dataset.frames)[0]; });
      }
      const qa = $('.q-add', card); if (qa) qa.addEventListener('click', e => { e.stopPropagation(); addToCart(i, 1); qa.classList.add('done'); setTimeout(() => qa.classList.remove('done'), 900); });
      card.addEventListener('click', () => open(i));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    });

    // ---- Hombres / Mujeres / Unisex (los unisex aparecen también en Hombres y Mujeres) ----
    const gtabs = $('.gtabs'), gbtns = gtabs ? $$('.chip', gtabs) : [], gline = gtabs && $('.g-line', gtabs);
    const fits = (g, f) => f === 'all' || g === f || g === 'uni';
    const gOn = () => gbtns.find(b => b.classList.contains('on'));
    const gPlace = () => { const b = gOn(); if (gline && b) { gline.style.width = b.offsetWidth + 'px'; gline.style.transform = `translateX(${b.offsetLeft}px)`; } };
    const gCount = () => { const enc = !!($('#grid2') && !$('#grid2').hidden); gbtns.forEach(b => { $('sup', b).textContent = P.filter(p => !!p.enc === enc && fits(p.g, b.dataset.f)).length; }); };
    let cat = 'all';
    const gApply = () => { const f = gOn().dataset.f; $$('#coleccion .card').forEach(k => k.classList.toggle('hide', !fits(k.dataset.g, f) || (cat !== 'all' && k.dataset.k !== cat))); };
    $$('.cats .cat').forEach(c => c.onclick = () => {
      if (c.classList.contains('soon')) { toast(`${c.firstChild.textContent.trim()}: muy pronto. Si buscas algo en especial, escríbenos y te lo conseguimos.`); return; }
      $$('.cats .cat').forEach(x => x.classList.toggle('on', x === c)); cat = c.dataset.k; gApply();
      const vis = $$('#coleccion .grid:not([hidden]) .card:not(.hide)').slice(0, 10);
      if (window.gsap) gsap.fromTo(vis, { opacity: 0, y: 20, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8, ease: 'expo.out', stagger: .04, clearProps: 'filter,transform' });
    });
    window.__gCount = gCount;
    gbtns.forEach(c => c.onclick = () => {
      gbtns.forEach(x => x.classList.toggle('on', x === c)); gPlace(); gApply();
      const vis = $$('#coleccion .grid:not([hidden]) .card:not(.hide)').slice(0, 10);
      if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.fromTo(vis, { opacity: 0, y: 20, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8, ease: 'expo.out', stagger: .04, clearProps: 'filter,transform' });
    });
    gCount(); requestAnimationFrame(gPlace); addEventListener('resize', gPlace); if (document.fonts) document.fonts.ready.then(gPlace);
    // ---- Disponible / Por encargo: selector con píldora deslizante y entrada "enfoque" de las tarjetas ----
    const mode = $('.mode');
    if (mode && grid2) {
      $('#nDisp').textContent = P.filter(p => !p.enc).length;
      $('#nEnc').textContent = P.filter(p => p.enc).length;
      const pill = $('.mode-pill', mode), btns = $$('button', mode);
      const place = b => { pill.style.width = b.offsetWidth + 'px'; pill.style.transform = `translateX(${b.offsetLeft}px)`; };
      const cur = () => btns.find(b => b.classList.contains('on'));
      requestAnimationFrame(() => { place(cur()); requestAnimationFrame(() => mode.classList.add('ready')); });
      addEventListener('resize', () => place(cur()));
      if (document.fonts) document.fonts.ready.then(() => place(cur()));
      btns.forEach(b => b.onclick = () => {
        if (b.classList.contains('on')) return;
        btns.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
        place(b);
        const show = $('#' + b.dataset.m), hide = show === grid ? grid2 : grid;
        const swap = () => {
          hide.hidden = true; show.hidden = false; if (window.__gCount) window.__gCount();
          const cards = $$('.card:not(.hide)', show).slice(0, 12);
          if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.fromTo(cards, { opacity: 0, y: 30, scale: 1.04, filter: 'blur(12px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .9, ease: 'expo.out', stagger: .05, clearProps: 'filter,transform' });
            if (window.ScrollTrigger) ScrollTrigger.refresh();
          }
          const top = mode.getBoundingClientRect().top + scrollY - 90;
          if (scrollY > top) scrollTo({ top, behavior: 'smooth' });
        };
        if (window.gsap && !hide.hidden) gsap.to($$('.card', hide), { opacity: 0, y: -16, filter: 'blur(8px)', duration: .28, ease: 'power2.in', stagger: .01, onComplete: () => { gsap.set($$('.card', hide), { clearProps: 'all' }); swap(); } });
        else swap();
      });
      if (location.hash === '#encargo') btns[1].click();
    }
    const sort = $('#sort');
    if (sort) sort.onchange = () => {
      const v = sort.value;
      [grid, grid2].filter(Boolean).forEach(G => { const cards = $$('.card', G);
      cards.sort((a, b) => { const A = P[a.dataset.i], B = P[b.dataset.i]; const a1 = A.pn || 1e9, b1 = B.pn || 1e9; return v === 'pa' ? a1 - b1 : v === 'pd' ? B.pn - A.pn : v === 'az' ? A.n.localeCompare(B.n) : a.dataset.i - b.dataset.i; });
      cards.forEach(c => G.appendChild(c)); });
    };
  }


  // ---------- Lo que dicen los compradores (encuesta a compradores verificados) ----------
  function statsBlock(p) {
    const t = p.st; if (!t) return '';
    const bar = (lab, l, r, v, cls) => `<div class="sb ${cls}"><div class="sb-h"><b>${lab}</b></div><div class="sb-lr"><span>${l}</span><span>${r}</span></div><div class="sb-track"><i style="left:${v}%"></i></div></div>`;
    const g = t.g || [0, 0, 0], gt = g[0] + g[1] + g[2] || 1;
    const S = t.s || {}, keys = [['Day', 'Día'], ['Summer', 'Verano'], ['Fall', 'Otoño'], ['Night', 'Noche'], ['Winter', 'Invierno'], ['Spring', 'Primavera']];
    const R = 70, C = 100, pt = (k, v) => { const a = -Math.PI / 2 + k * Math.PI / 3, r = R * v / 100; return [C + Math.cos(a) * r, C + Math.sin(a) * r]; };
    const ring = f => keys.map((_, k) => pt(k, f).join(',')).join(' ');
    const poly = keys.map(([k], j) => pt(j, S[k] || 0).map(n => n.toFixed(1)).join(',')).join(' ');
    const labels = keys.map(([k, es], j) => { const [x, y] = pt(j, 128); return `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle"><tspan class="rl">${es}</tspan><tspan class="rv" x="${x.toFixed(1)}" dy="11">${S[k] ?? 0}</tspan></text>`; }).join('');
    const pct = Math.max(0, Math.min(100, t.r / 5 * 100)), circ = 2 * Math.PI * 42;
    return `<div class="stats">
      <span class="mono">lo que dicen los compradores</span>
      <div class="st-top">
        <div class="st-score"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" class="trk"/><circle cx="50" cy="50" r="42" class="val" stroke-dasharray="${(circ * pct / 100).toFixed(1)} ${circ.toFixed(1)}"/></svg><div><b>${t.r.toFixed(1)}</b><span>de 5</span></div></div>
        <div class="st-bars">
          ${bar('Valoración', 'no me gusta', 'me encanta', t.rt, 'b-rt')}
          ${bar('Estela', 'mínima', 'máxima', t.si, 'b-si')}
          ${bar('Duración', 'poca', 'todo el día', t.lo, 'b-lo')}
        </div>
      </div>
      <div class="sb b-g"><div class="sb-h"><b>Lo usan</b></div><div class="g-split"><i style="flex:${g[0]}"></i><i style="flex:${g[1]}"></i><i style="flex:${g[2]}"></i></div>
        <div class="sb-lr g-lr"><span>Hombres ${Math.round(g[0] / gt * 100)}%</span><span>Neutral ${Math.round(g[1] / gt * 100)}%</span><span>Mujeres ${Math.round(g[2] / gt * 100)}%</span></div></div>
      <div class="st-radar"><b class="sb-h">Cuándo usarlo</b>
        <svg viewBox="-24 -4 248 212" role="img" aria-label="Uso por temporada y momento del día">
          ${[1, .66, .33].map(f => `<polygon points="${ring(f * 100)}" class="rg"/>`).join('')}
          ${keys.map((_, k) => `<line x1="${C}" y1="${C}" x2="${pt(k, 100)[0]}" y2="${pt(k, 100)[1]}" class="rg"/>`).join('')}
          <polygon points="${poly}" class="rp"/>
          ${keys.map(([k], j) => { const [x, y] = pt(j, S[k] || 0); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" class="rd"/>`; }).join('')}
          ${labels}
        </svg>
      </div>
      <p class="st-src">Encuesta a ${t.v} compradores verificados en EE. UU.</p>
    </div>`;
  }
  // ---------- By Juan José Sotelo (marca invitada) ----------
  (() => {
    const g = $('#jjsGrid'), cats = $('.jjs-cats'); if (!g || typeof JJS === 'undefined') return;
    const C = [['all', 'Todo'], ['gafas', 'Gafas'], ['pantalones', 'Pantalones'], ['bermudas', 'Bermudas'], ['accesorios', 'Accesorios']];
    const ico = {
      gafas: '<svg viewBox="0 0 120 60"><circle cx="34" cy="34" r="20"/><circle cx="86" cy="34" r="20"/><path d="M54 32q6-6 12 0M14 30 4 20M106 30l10-10"/></svg>',
      pantalones: '<svg viewBox="0 0 80 120"><path d="M14 6h52l6 108H48L40 46l-8 68H8z"/><path d="M14 18h52"/></svg>',
      bermudas: '<svg viewBox="0 0 90 80"><path d="M10 8h70l8 62H54L45 34l-9 36H2z"/><path d="M10 20h70"/></svg>',
      accesorios: '<svg viewBox="0 0 100 100"><circle cx="50" cy="56" r="30"/><circle cx="50" cy="56" r="20"/><path d="M38 26 44 8h12l6 18"/></svg>'
    };
    cats.innerHTML = C.map(([k, l], i) => `<button class="cat${i ? '' : ' on'}" data-k="${k}">${l}</button>`).join('');
    const paint = k => {
      const items = JJS.filter(x => k === 'all' || x.cat === k);
      if (items.length) g.innerHTML = items.map(x => `<article class="jjs-card"><div class="jjs-img">${x.img ? `<img src="${x.img}" alt="${x.n}">` : ico[x.cat] || ''}</div><div class="jjs-info"><span class="mono">${x.cat}</span><h4>${x.n}</h4><span class="price">${x.p}</span></div></article>`).join('');
      else g.innerHTML = (k === 'all' ? C.slice(1) : C.filter(c => c[0] === k)).map(([c, l]) => `<article class="jjs-card soon"><div class="jjs-img">${ico[c]}</div><div class="jjs-info"><span class="mono">próximamente</span><h4>${l}</h4><span class="soon-t">colección en camino</span></div></article>`).join('');
      if (window.gsap) gsap.fromTo($$('.jjs-card', g), { opacity: 0, y: 24, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8, ease: 'expo.out', stagger: .06, clearProps: 'filter,transform' });
    };
    $$('.cat', cats).forEach(b => b.onclick = () => { $$('.cat', cats).forEach(x => x.classList.toggle('on', x === b)); paint(b.dataset.k); });
    paint('all');
  })();

  // ---------- Perfil del perfume (texto corto, ocasión y ficha técnica) ----------
  function profile(p) {
    const txt = (p.fam + ' ' + [...(p.top || []), ...(p.heart || []), ...(p.base || [])].join(' ')).toLowerCase(), has = (...w) => w.some(x => txt.includes(x));
    const low = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : '';
    const fresh = has('fresc', 'cítric', 'acuát', 'bergamot', 'limón', 'marin', 'aromát'), sweet = has('dulce', 'vainilla', 'gourmand', 'caramel', 'ámbar', 'oriental', 'tonka', 'praliné'), wood = has('amader', 'cuero', 'oud', 'especi', 'tabaco', 'vetiver', 'cedro'), flor = has('floral', 'rosa', 'jazmín', 'flor', 'azahar');
    const words = []; if (fresh) words.push('Fresco'); if (flor) words.push('Luminoso'); if (sweet) words.push('Seductor'); if (wood) words.push('Magnético');
    while (words.length < 3) words.push(['Elegante', 'Seguro', 'Inolvidable'][words.length]);
    const st = p.st && p.st.s, pc = k => Math.round(st[k] || 0);
    const day = st ? pc('Day') : fresh ? 90 : sweet ? 45 : 65, night = st ? pc('Night') : sweet || wood ? 90 : 55;
    const sea = st ? { Verano: pc('Summer'), Primavera: pc('Spring'), Otoño: pc('Fall'), Invierno: pc('Winter') } : { Verano: fresh ? 95 : sweet ? 35 : 60, Primavera: fresh || flor ? 90 : 60, Otoño: wood || sweet ? 90 : 60, Invierno: sweet || wood ? 92 : 45 };
    const mo = [];
    if (fresh) mo.push(['Oficina', 'limpio y seguro, no invade el espacio'], ['Día de calor', 'ligero aunque suba la temperatura']);
    if (sweet) mo.push(['Cita', 'cálido y cercano, invita a acercarse'], ['Noche fría', 'brilla cuando el aire está fresco']);
    if (wood) mo.push(['Evento formal', 'presencia y carácter con traje o vestido'], ['Cena', 'elegante sin decir una palabra']);
    if (flor) mo.push(['Celebración de día', 'luminoso, alegre, fácil de llevar']);
    if (mo.length < 2) mo.push(['Día a día', 'versátil, de la mañana a la noche'], ['Salida', 'deja huella al pasar']);
    const who = p.g === 'el' ? 'para él' : p.g === 'ella' ? 'para ella' : 'para quien lo lleve';
    const j = a => (a || []).slice(0, 2).map(low).join(' y ');
    return {
      tag: words.slice(0, 3).join('. ') + '.',
      desc: `Un ${low(p.fam)} ${who}. Abre con ${j(p.top)}${p.heart && p.heart.length ? `, se asienta en ${j(p.heart)}` : ''}${p.base && p.base.length ? ` y deja una estela de ${j(p.base)}` : ''}.`,
      day, night, sea, moments: mo.slice(0, 3),
      line: night > day + 10 ? 'Brilla de noche' : day > night + 10 ? 'Hecho para el día' : 'Del día a la noche',
      best: Object.entries(sea).sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0]).join(' y ')
    };
  }
  function techSheet(p) {
    const f = profile(p), t = p.st, row = (k, v) => v ? `<div class="ts-r"><dt>${k}</dt><dd>${v}</dd></div>` : '';
    const lvl = v => v >= 75 ? 'Alta' : v >= 55 ? 'Media' : 'Suave';
    return `<section class="tsheet"><span class="mono">ficha técnica</span>
      <p class="ts-tag">${f.tag}</p><p class="ts-desc">${f.desc}</p>
      <dl>
        ${row('Marca', p.b)}${row('Línea', p.cat)}${row('Familia olfativa', p.fam)}${row('Concentración', { EDP: 'Eau de Parfum (EDP)', EDT: 'Eau de Toilette (EDT)', Parfum: 'Parfum', Elixir: 'Elixir', EDC: 'Eau de Cologne (EDC)' }[p.c] || p.c)}
        ${row('Contenido', p.ml ? p.ml + ' ml' : '')}${row('Género', p.gen)}
        ${row('Notas de salida', (p.top || []).join(', '))}${row('Notas de corazón', (p.heart || []).join(', '))}${row('Notas de fondo', (p.base || []).join(', '))}
        ${row('Momento ideal', f.line)}${row('Mejor temporada', f.best)}${row('Ocasiones', f.moments.map(m => m[0]).join(', '))}
        ${t ? row('Estela', `${lvl(t.si)} · ${Math.round(t.si)}/100`) + row('Duración', `${lvl(t.lo)} · ${Math.round(t.lo)}/100`) + row('Valoración', `${t.r.toFixed(1)} de 5 · ${t.v} compradores`) : ''}
        ${row('Disponibilidad', p.enc ? 'Por encargo · 10–15 días hábiles' : 'Disponible · entrega inmediata')}
        ${row('Envío', 'Gratis a toda Colombia')}${row('Autenticidad', '100% original, sellado de fábrica')}${row('Pago', 'Mercado Pago · tarjeta, PSE y más')}
      </dl></section>`;
  }

  // ---------- Ficha (drawer) ----------
  const dr = document.createElement('div');
  dr.className = 'drawer'; dr.setAttribute('aria-hidden', 'true');
  dr.innerHTML = `<div class="dr-panel" role="dialog" aria-modal="true" aria-labelledby="drName"><button class="dr-x" aria-label="Cerrar">×</button><div class="dr-body"></div></div>`;
  document.body.appendChild(dr);
  const body = $('.dr-body', dr);
  let current = -1, lastFocus = null;

  function open(i) {
    const p = P[i]; current = i; lastFocus = document.activeElement;
    const rel = P.map((q, j) => ({ q, j })).filter(o => o.j !== i).sort((a, b) => (b.q.fam.split(' ')[0] === p.fam.split(' ')[0]) - (a.q.fam.split(' ')[0] === p.fam.split(' ')[0]) || Math.abs(a.q.pn - p.pn) - Math.abs(b.q.pn - p.pn)).slice(0, 3);
    body.innerHTML = `
      <div class="dr-view">
        <div class="dr-turn" title="Arrastra para girar">${p.cut || (p.frames && p.frames.length) || p.img ? visual(p) : bottle3d(p)}</div>
        <span class="mono dr-hint">↔ arrastra para girar</span>
      </div>
      <div class="dr-info">
        <span class="mono">${p.cat} · ${p.b}</span>
        <h3 id="drName">${p.n}</h3>
        <p class="dr-meta">${p.fam} · ${p.gen} · ${p.c}${mlTxt(p)}</p>${p.enc ? '<p class="enc-note">Por encargo · lo traemos para ti en 10–15 días hábiles</p>' : '<p class="enc-note ok">Disponible · entrega inmediata</p>'}
        <div class="dr-price"></div>

        <div class="pyr" role="tablist" aria-label="Notas">
          ${(p.heart.length || p.base.length ? [['01', 'salida', '0–15 min', p.top], ['02', 'corazón', '15 min – 4 h', p.heart], ['03', 'fondo', '4 h +', p.base]] : [['··', 'notas principales', '', p.top]]).filter(t => t[3].length).map((t, k) =>
            `<button class="tier${k === 0 ? ' on' : ''}" role="tab" aria-selected="${k === 0}"><i>${t[0]} · ${t[1]}</i><b>${t[3].join(' · ')}</b><em>${t[2]}</em></button>`).join('')}
        </div>
        ${techSheet(p)}
        ${statsBlock(p)}

        <div class="ask">
          <span class="mono">compra o pregunta</span>
          <div class="qs">
            ${['¿Está disponible?', '¿Cuánto tarda la entrega?', '¿Formas de pago?', '¿Hacen envío a mi ciudad?'].map((q, k) => `<button class="q${k === 0 ? ' on' : ''}">${q}</button>`).join('')}
          </div>
          <div class="ask-row">
            <div class="qty" aria-label="Cantidad"><button data-d="-1" aria-label="Menos">−</button><output>1</output><button data-d="1" aria-label="Más">+</button></div>
            <input class="city" placeholder="Tu ciudad (opcional)" autocomplete="address-level2">
          </div>
          <pre class="msg" aria-live="polite"></pre>
          ${p.vid ? `<button class="btn solid add-cart"></button><button class="btn pay"></button>${couponBox()}
          <div class="pay-note mono">Pago seguro con Mercado Pago · tarjeta, PSE y más</div>` : `<div class="pay-note mono" style="margin:0">Precio y disponibilidad por confirmar · pregúntanos</div>`}
          <div class="ch-row">${chSwitch()}<button class="btn send"></button></div>
          <button class="save-btn" data-i="${i}"><b>♡</b><span>guardar en mi lista</span></button>
        </div>

        <div class="rel"><span class="mono">si te gusta este, mira</span>
          <div class="rel-row">${rel.map(o => `<button class="rel-it" data-j="${o.j}"><div class="mini">${o.q.img ? visual(o.q) : bottle3d(o.q, false)}</div><b>${o.q.n}</b><span>${o.q.p}</span></button>`).join('')}</div>
        </div>
      </div>`;

    // notas: tocar para resaltar
    $$('.tier', body).forEach(t => t.onclick = () => { $$('.tier', body).forEach(x => { x.classList.remove('on'); x.setAttribute('aria-selected', 'false'); }); t.classList.add('on'); t.setAttribute('aria-selected', 'true'); });
    // mensaje
    let qty = 1;
    const msg = $('.msg', body);
    const compose = () => {
      const qs = $$('.q.on', body).map(b => '• ' + b.textContent);
      const city = $('.city', body).value.trim();
      msg.textContent = `Hola OG 👋 Me interesa:\n${qty} × ${p.n} (${p.b}, ${p.c}${mlTxt(p)})${p.pn ? ' · ' + fmt(disc(p.pn) * qty) + (coupon ? ` (cupón ${coupon})` : '') : ''}${city ? `\nCiudad: ${city}` : ''}${qs.length ? '\n' + qs.join('\n') : ''}`;
    };
    $$('.q', body).forEach(b => b.onclick = () => { b.classList.toggle('on'); compose(); });
    $$('.qty button', body).forEach(b => b.onclick = () => { if (+b.dataset.d > 0 && qty >= maxQ(p)) { toast(`Solo hay ${maxQ(p)} unidad disponible de ${p.n}`); return; } qty = Math.max(1, Math.min(maxQ(p), qty + +b.dataset.d)); $('.qty output', body).textContent = qty; compose(); paintPay(); });
    $('.city', body).oninput = compose;
    $('.send', body).onclick = () => send(msg.textContent); wireSwitch(body, $('.send', body));
    const payBtn = $('.pay', body), priceEl = $('.dr-price', body);
    const paintPay = () => {
      priceEl.innerHTML = p.pn ? (coupon ? `<s>${p.p}</s><b>${fmt(disc(p.pn))}</b><span class="mono">con ${coupon}</span>` : `<b>${p.p}</b><span class="mono">COP · aprox.</span>`) : `<b class="tbd">${p.p}</b>`;
      if (payBtn) payBtn.textContent = `Comprar ya · ${fmt(disc(p.pn) * qty)}`;
      const ac = $('.add-cart', body); if (ac) ac.textContent = `Agregar al carrito · ${qty > 1 ? qty + ' × ' : ''}${fmt(disc(p.pn))}`;
    };
    if (payBtn) { payBtn.onclick = () => checkout([{ p, q: qty }]); wireCoupon(body, () => { paintPay(); compose(); }); }
    const acb = $('.add-cart', body); if (acb) acb.onclick = () => { addToCart(i, qty); close(); };
    paintPay();
    $('.save-btn', body).onclick = () => { list = list.includes(i) ? list.filter(x => x !== i) : [...list, i]; saveList(); toast(list.includes(i) ? `${p.n} guardado en tu lista` : `${p.n} salió de tu lista`); };
    $$('.rel-it', body).forEach(b => b.onclick = () => { body.scrollTop = 0; $('.dr-panel', dr).scrollTop = 0; open(+b.dataset.j); });
    compose(); paintList();

    // girar arrastrando (con inercia tipo stop motion)
    const turn = $('.dr-turn', body), cutEl = $('.cut3d', turn), b3 = $('.b3d', turn) || cutEl, fr = $('.frames', turn);
    let ry = cutEl ? -14 : -20, drag = false, sx = 0, sr = 0;
    const setR = () => { if (cutEl) ry = Math.max(-55, Math.min(55, ry)); if (b3) b3.style.setProperty('--ry', ry + 'deg'); if (fr) { const F = JSON.parse(fr.dataset.frames); fr.src = F[((Math.round(ry / (360 / F.length)) % F.length) + F.length) % F.length]; } };
    setR();
    turn.onpointerdown = e => { drag = true; sx = e.clientX; sr = ry; turn.setPointerCapture(e.pointerId); turn.classList.add('grab'); };
    turn.onpointermove = e => { if (drag) { ry = sr + (e.clientX - sx) * .8; setR(); } };
    turn.onpointerup = turn.onpointercancel = () => { drag = false; turn.classList.remove('grab');
      if (cutEl && window.gsap) { const o = { v: ry }; gsap.to(o, { v: -14, duration: 1.4, ease: 'elastic.out(1, .45)', onUpdate: () => { ry = o.v; setR(); } }); } };

    dr.classList.add('on'); dr.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('lock');
    setTimeout(() => $('.dr-x', dr).focus(), 50);
  }
  function close() {
    dr.classList.remove('on'); dr.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('lock');
    if (lastFocus) lastFocus.focus();
  }
  dr.addEventListener('click', e => { if (e.target === dr || e.target.closest('.dr-x')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && dr.classList.contains('on')) close(); });

  // ---------- Panel de lista ----------
  const lp = document.createElement('div');
  lp.className = 'drawer list-drawer'; lp.setAttribute('aria-hidden', 'true');
  lp.innerHTML = `<div class="dr-panel" role="dialog" aria-modal="true" aria-label="Mi lista"><button class="dr-x" aria-label="Cerrar">×</button><div class="lp-body"></div></div>`;
  document.body.appendChild(lp);
  function openList() {
    const b = $('.lp-body', lp), items = list.map(i => P[i]).filter(Boolean);
    const total = items.reduce((s, p) => s + p.pn, 0), payable = items.filter(p => p.vid);
    b.innerHTML = `<span class="mono">og.prdct</span><h3>mi lista</h3>${items.length ? `
      <ul class="lp-ul">${list.map(i => `<li><div class="mini">${P[i].img ? visual(P[i]) : bottle3d(P[i], false)}</div><div><b>${P[i].n}</b><span class="mono">${P[i].b} · ${P[i].c}${mlTxt(P[i])}</span></div><span>${P[i].p}</span><button data-i="${i}" aria-label="Quitar">×</button></li>`).join('')}</ul>
      <div class="lp-tot"><span class="mono">total aprox.</span><b class="lp-total"></b></div>
      ${payable.length ? `<button class="btn solid lp-pay"></button>` : ''}
      <div class="ch-row">${chSwitch()}<button class="btn lp-send"></button></div>` : `<p class="lp-empty">Todavía no guardas productos. Abre uno y toca <b>♡ guardar en mi lista</b>.</p>`}`;
    $$('.lp-ul button', b).forEach(x => x.onclick = () => { list = list.filter(i => i !== +x.dataset.i); saveList(); openList(); });
    const pb = $('.lp-pay', b);
    const t0 = $('.lp-total', b); if (t0) t0.innerHTML = fmt(total);
    if (pb) { pb.textContent = 'Pasar todo al carrito →'; pb.onclick = () => { list.forEach(i => { if (P[i].vid && !cart.find(o => o.i === i)) cart.push({ i, q: 1 }); }); saveCart(); closeLp(); openCart(); }; }
    const s = $('.lp-send', b); if (s) wireSwitch(b, s);
    if (s) s.onclick = () => send(`Hola OG 👋 Quiero pedir:\n${items.map(p => `• ${p.n} (${p.b}, ${p.c}${mlTxt(p)}) · ${p.pn ? fmt(disc(p.pn)) : 'precio por confirmar'}`).join('\n')}\nTotal aprox.: ${fmt(disc(total))}${coupon ? ` (cupón ${coupon})` : ''}\n¿Están disponibles?`);
    lp.classList.add('on'); lp.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('lock');
  }
  const closeLp = () => { lp.classList.remove('on'); lp.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('lock'); };
  lp.addEventListener('click', e => { if (e.target === lp || e.target.closest('.dr-x')) closeLp(); });
  $$('.list-btn').forEach(b => b.onclick = openList);
  paintList();

  // ---------- Panel del carrito ----------
  const cp = document.createElement('div');
  cp.className = 'drawer cart-drawer'; cp.setAttribute('aria-hidden', 'true');
  cp.innerHTML = `<div class="dr-panel" role="dialog" aria-modal="true" aria-label="Carrito"><button class="dr-x" aria-label="Cerrar">×</button><div class="lp-body cart-body"></div></div>`;
  document.body.appendChild(cp);
  const closeCart = () => { cp.classList.remove('on'); cp.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('lock'); };
  function openCart() {
    const b = $('.cart-body', cp);
    const sub = cart.reduce((s, o) => s + P[o.i].pn * o.q, 0), hasEnc = cart.some(o => P[o.i].enc);
    b.innerHTML = `<span class="mono">og.prdct</span><h3>carrito</h3>${cart.length ? `
      <ul class="cart-ul">${cart.map(o => { const p = P[o.i]; return `<li data-i="${o.i}">
        <div class="mini">${p.img ? visual(p) : bottle3d(p, false)}</div>
        <div class="c-mid"><span class="mono">${p.b}${p.enc ? ' · por encargo' : ''}</span><b>${p.n}</b>
          <div class="qty sm"><button data-d="-1" aria-label="Menos">−</button><output>${o.q}</output><button data-d="1" aria-label="Más">+</button></div></div>
        <div class="c-end"><span class="c-price">${fmt(p.pn * o.q)}</span><button class="c-rm" aria-label="Quitar">quitar</button></div></li>`; }).join('')}</ul>
      <div class="lp-tot"><span class="mono">${cartN()} ${cartN() === 1 ? 'producto' : 'productos'} · total</span><b class="lp-total"></b></div>
      ${couponBox()}
      <button class="btn solid c-pay"></button>
      <div class="pay-note mono">Pago seguro con Mercado Pago · tarjeta, PSE y más · envío gratis a toda Colombia${hasEnc ? '<br>Los productos por encargo llegan en 10–15 días hábiles' : ''}</div>
      <button class="btn c-inv">Ver mi pedido como factura</button>
      <button class="btn c-more">Seguir comprando</button>` : `<p class="lp-empty">Tu carrito está vacío. Toca <b>+</b> en un producto o <b>Agregar al carrito</b> en su ficha.</p><button class="btn c-more">Ver perfumes</button>`}`;
    const paint = () => { const t = $('.lp-total', b); if (t) t.innerHTML = coupon ? `<s>${fmt(sub)}</s> ${fmt(disc(sub))}` : fmt(sub); const pb = $('.c-pay', b); if (pb) pb.textContent = `Pagar · ${fmt(disc(sub))}`; };
    paint();
    $$('.cart-ul li', b).forEach(li => {
      const i = +li.dataset.i, o = cart.find(x => x.i === i);
      $$('.qty button', li).forEach(x => x.onclick = () => { const m = maxQ(P[i]); if (+x.dataset.d > 0 && o.q >= m) { toast(`Solo hay ${m} unidad disponible. Si quieres más, pídelo por encargo.`); return; } o.q = Math.max(1, Math.min(m, o.q + +x.dataset.d)); saveCart(); openCart(); });
      $('.c-rm', li).onclick = () => { cart = cart.filter(x => x.i !== i); saveCart(); openCart(); };
    });
    const pb = $('.c-pay', b); if (pb) { pb.onclick = () => checkout(cart.map(o => ({ p: P[o.i], q: o.q }))); wireCoupon(b, paint); }
    const ci = $('.c-inv', b); if (ci) ci.onclick = () => { closeCart(); window.OGInvoice && OGInvoice.open(); };
    $('.c-more', b).onclick = () => { closeCart(); const c = $('#coleccion'); if (c) c.scrollIntoView({ behavior: 'smooth' }); };
    cp.classList.add('on'); cp.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('lock');
  }
  cp.addEventListener('click', e => { if (e.target === cp || e.target.closest('.dr-x')) closeCart(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && cp.classList.contains('on')) closeCart(); });
  $$('.cart-btn').forEach(b => b.onclick = openCart);
  paintCart();
  if (/[?&]carrito/.test(location.search)) openCart();
  // API para factura y vitrina
  window.OG = { profile,  P, fmt, disc, get coupon() { return coupon; }, get cart() { return cart; }, setCart(c) { cart = c; saveCart(); }, addToCart, open, openCart, closeCart, bottle3d, visual, maxQ, checkout };
  document.dispatchEvent(new Event('og:ready'));
})();
