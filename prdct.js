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
        <i class="f fr">${label ? `<span class="lbl"><small>${p.b}</small><b>${p.n}</b><small>${p.c} · ${p.ml} ml</small></span>` : ''}</i>
        <i class="f bk"><span class="lbl og">og</span></i><i class="f lf"></i><i class="f rt"></i><i class="f tp"></i><i class="f bt"></i>
      </div></div>`;
  }
  function visual(p) {
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
    if (!SHOP || !parts.length) { toast('Este perfume aún no tiene pago en línea. Pregúntanos y te ayudamos.'); return; }
    location.href = `https://${SHOP}/cart/${parts.join(',')}${coupon ? `?discount=${encodeURIComponent(coupon)}` : ''}`;
  };

  // ---------- Mensaje y canales ----------
  function send(text) {
    if (WHATSAPP) { window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener'); return; }
    // Instagram no deja precargar texto: lo copiamos y abrimos el chat
    // Instagram no permite que una web escriba el mensaje dentro del chat: lo copiamos para pegarlo con un toque
    const go = () => window.open(`https://ig.me/m/${IG}`, '_blank', 'noopener');
    const done = () => { toast('Mensaje listo y copiado ✓ En el chat de Instagram mantén presionado y toca Pegar.'); setTimeout(go, 900); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => { fallbackCopy(text); done(); });
    else { fallbackCopy(text); done(); }
  }
  function fallbackCopy(t) { const a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); }
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
    const card = (p, i) => `<article class="card" data-g="${p.g}" data-i="${i}" tabindex="0" aria-label="${p.n}, ${p.b}. Ver ficha">
      <div class="img"><span class="badge">${p.cat.toUpperCase()}</span>${p.enc ? '<span class="badge enc">POR ENCARGO</span>' : ''}<span class="num mono">${String(i + 1).padStart(3, '0')}</span>
        <div class="stage">${visual(p)}</div>
        <span class="explore mono">explorar ↗</span>
      </div>
      <div class="info"><div><h4>${p.n}</h4><div class="mono">${p.b} · ${p.c}${mlTxt(p)}</div><div class="fam">${p.fam}</div></div><div class="price${p.pn ? '' : ' tbd'}">${p.p}</div></div></article>`;
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
      card.addEventListener('click', () => open(i));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    });

    $$('#coleccion .chip').forEach(c => c.onclick = () => {
      $$('#coleccion .chip').forEach(x => x.classList.remove('on')); c.classList.add('on');
      $$('#coleccion .card').forEach(k => k.classList.toggle('hide', c.dataset.f !== 'all' && k.dataset.g !== c.dataset.f));
    });
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
          hide.hidden = true; show.hidden = false;
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
        <div class="dr-turn" title="Arrastra para girar">${p.frames && p.frames.length ? visual(p) : p.img ? visual(p) : bottle3d(p)}</div>
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
          ${p.vid ? `${couponBox()}<button class="btn solid pay"></button>
          <div class="pay-note mono">Pago seguro con Mercado Pago · tarjeta, PSE y más</div>` : `<div class="pay-note mono" style="margin:0">Precio y disponibilidad por confirmar · pregúntanos</div>`}
          <button class="btn send">${WHATSAPP ? 'Preguntar por WhatsApp' : 'Preguntar por Instagram'} →</button>
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
    $$('.qty button', body).forEach(b => b.onclick = () => { qty = Math.max(1, Math.min(9, qty + +b.dataset.d)); $('.qty output', body).textContent = qty; compose(); paintPay(); });
    $('.city', body).oninput = compose;
    $('.send', body).onclick = () => send(msg.textContent);
    const payBtn = $('.pay', body), priceEl = $('.dr-price', body);
    const paintPay = () => {
      priceEl.innerHTML = p.pn ? (coupon ? `<s>${p.p}</s><b>${fmt(disc(p.pn))}</b><span class="mono">con ${coupon}</span>` : `<b>${p.p}</b><span class="mono">COP · aprox.</span>`) : `<b class="tbd">${p.p}</b>`;
      if (payBtn) payBtn.textContent = `Pagar ahora · ${fmt(disc(p.pn) * qty)}`;
    };
    if (payBtn) { payBtn.onclick = () => checkout([{ p, q: qty }]); wireCoupon(body, () => { paintPay(); compose(); }); }
    paintPay();
    $('.save-btn', body).onclick = () => { list = list.includes(i) ? list.filter(x => x !== i) : [...list, i]; saveList(); toast(list.includes(i) ? `${p.n} guardado en tu lista` : `${p.n} salió de tu lista`); };
    $$('.rel-it', body).forEach(b => b.onclick = () => { body.scrollTop = 0; $('.dr-panel', dr).scrollTop = 0; open(+b.dataset.j); });
    compose(); paintList();

    // girar arrastrando (con inercia tipo stop motion)
    const turn = $('.dr-turn', body), b3 = $('.b3d', turn), fr = $('.frames', turn);
    let ry = -20, drag = false, sx = 0, sr = 0;
    const setR = () => { if (b3) b3.style.setProperty('--ry', ry + 'deg'); if (fr) { const F = JSON.parse(fr.dataset.frames); fr.src = F[((Math.round(ry / (360 / F.length)) % F.length) + F.length) % F.length]; } };
    setR();
    turn.onpointerdown = e => { drag = true; sx = e.clientX; sr = ry; turn.setPointerCapture(e.pointerId); turn.classList.add('grab'); };
    turn.onpointermove = e => { if (drag) { ry = sr + (e.clientX - sx) * .8; setR(); } };
    turn.onpointerup = turn.onpointercancel = () => { drag = false; turn.classList.remove('grab'); };

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
      ${payable.length ? `${couponBox()}<button class="btn solid lp-pay"></button>
      <div class="pay-note mono">Pago seguro con Mercado Pago${payable.length < items.length ? ' · los perfumes con precio por confirmar se consultan aparte' : ''}</div>` : ''}
      <button class="btn lp-send">${WHATSAPP ? 'Preguntar por WhatsApp' : 'Preguntar por Instagram'} →</button>` : `<p class="lp-empty">Todavía no guardas perfumes. Abre uno y toca <b>♡ guardar en mi lista</b>.</p>`}`;
    $$('.lp-ul button', b).forEach(x => x.onclick = () => { list = list.filter(i => i !== +x.dataset.i); saveList(); openList(); });
    const pb = $('.lp-pay', b);
    const paintTot = () => { const t = $('.lp-total', b); if (t) t.innerHTML = coupon ? `<s>${fmt(total)}</s> ${fmt(disc(total))}` : fmt(total); if (pb) pb.textContent = `Pagar todo · ${fmt(disc(payable.reduce((s, p) => s + p.pn, 0)))}`; };
    paintTot();
    if (pb) { pb.onclick = () => checkout(payable.map(p => ({ p, q: 1 }))); wireCoupon(b, paintTot); }
    const s = $('.lp-send', b);
    if (s) s.onclick = () => send(`Hola OG 👋 Quiero pedir:\n${items.map(p => `• ${p.n} (${p.b}, ${p.c}${mlTxt(p)}) · ${p.pn ? fmt(disc(p.pn)) : 'precio por confirmar'}`).join('\n')}\nTotal aprox.: ${fmt(disc(total))}${coupon ? ` (cupón ${coupon})` : ''}\n¿Están disponibles?`);
    lp.classList.add('on'); lp.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('lock');
  }
  lp.addEventListener('click', e => { if (e.target === lp || e.target.closest('.dr-x')) { lp.classList.remove('on'); lp.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('lock'); } });
  $$('.list-btn').forEach(b => b.onclick = openList);
  paintList();
})();
