// ===== Factura / comprobante de pedido "Membrete" en 3 estilos: papel · negativo · rec =====
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const STYLES = [['papel', 'Papel'], ['negativo', 'Negativo'], ['rec', 'REC']];
  let style = 'papel';
  try { style = localStorage.getItem('og-factura') || 'papel'; } catch (e) {}
  const ov = document.createElement('div');
  ov.className = 'inv-ov'; ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = `<div class="inv-wrap" role="dialog" aria-modal="true" aria-label="Tu pedido">
    <div class="inv-bar"><div class="inv-sw" role="radiogroup">${STYLES.map(([k, l]) => `<button data-s="${k}">${l}</button>`).join('')}<i></i></div><button class="inv-x" aria-label="Cerrar">×</button></div>
    <div class="inv-stage"><article class="inv"></article></div>
    <p class="inv-hint">elige un estilo · ajusta cantidades · descarga o envía</p></div>`;
  document.body.appendChild(ov);
  const inv = $('.inv', ov);
  const num = () => { let n; try { n = localStorage.getItem('og-num'); if (!n) { n = String(Math.floor(Math.random() * 9000) + 1000); localStorage.setItem('og-num', n); } } catch (e) { n = '0001'; } return n; };
  const today = () => new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

  function render() {
    const O = window.OG; if (!O) return;
    const items = O.cart.map(o => ({ o, p: O.P[o.i] }));
    const sub = items.reduce((s, x) => s + x.p.pn * x.o.q, 0), tot = O.disc(sub), dsc = sub - tot;
    inv.dataset.s = style;
    inv.innerHTML = `
      <i class="inv-cut t"></i>
      <header class="mb" data-k="head"><div class="inv-logo"><img class="l-b" src="/wm-blanco.png" alt="Open Gate"><img class="l-n" src="/wm-negro.png" alt="Open Gate"></div>
        <div class="inv-meta"><span>pedido</span><b>OG-${num()}</b><span>${today()}</span></div></header>
      <h3 class="mb inv-title" data-k="title">${style === 'rec' ? '● REC  pedido_og.log' : 'tu pedido'}</h3>
      <div class="mb inv-parts" data-k="parts"><div><span>de</span><b>Open Gate · og.prdct</b><small>opengate.media · Colombia</small></div><div><span>envío</span><b>Gratis a toda Colombia</b><small>originales · pago seguro</small></div></div>
      <div class="mb inv-head" data-k="th"><span>producto</span><span>cant.</span><span>precio</span><span>importe</span></div>
      <ul class="mb inv-items" data-k="items">${items.length ? items.map(({ o, p }) => `<li data-i="${o.i}"><span class="it-n"><b>${p.n}</b><small>${p.b} · ${p.c}${p.ml ? ' · ' + p.ml + ' ml' : ''}${p.enc ? ' · encargo' : ''}</small></span>
        <span class="it-q"><button data-d="-1" aria-label="Menos">−</button><output>${o.q}</output><button data-d="1" aria-label="Más">+</button></span>
        <span class="it-p">${O.fmt(p.pn)}</span><span class="it-t">${O.fmt(p.pn * o.q)}</span></li>`).join('') : '<li class="empty">Tu carrito está vacío.</li>'}</ul>
      <div class="mb inv-sum" data-k="sum"><div><span>subtotal</span><span>${O.fmt(sub)}</span></div>${dsc ? `<div><span>cupón ${O.coupon}</span><span>− ${O.fmt(dsc)}</span></div>` : ''}<div><span>envío</span><span>gratis</span></div>
        <div class="inv-tot"><span>total</span><b>${O.fmt(tot)}</b></div></div>
      <footer class="mb inv-foot" data-k="foot"><p>Pago seguro con Mercado Pago. Productos 100% originales.<br>Comprobante de pedido · no es factura electrónica.</p>
        <div class="inv-btns"><button class="inv-pay">Pagar ${O.fmt(tot)}</button><button class="inv-pdf">Descargar PDF</button><button class="inv-wa">Enviar por WhatsApp</button></div></footer>
      <i class="inv-cut b"></i>`;
    $$('.it-q button', inv).forEach(b => b.onclick = () => {
      const i = +b.closest('li').dataset.i, c = O.cart.map(x => ({ ...x })), o = c.find(x => x.i === i);
      o.q = Math.max(0, Math.min(O.maxQ(O.P[i]), o.q + +b.dataset.d));
      O.setCart(c.filter(x => x.q > 0)); render();
    });
    $('.inv-pdf', inv).onclick = () => window.print();
    $('.inv-pay', inv).onclick = () => O.checkout(O.cart.map(o => ({ p: O.P[o.i], q: o.q })));
    $('.inv-wa', inv).onclick = () => {
      const t = `Hola Open Gate 👋 Este es mi pedido OG-${num()}:\n` + items.map(({ o, p }) => `• ${o.q} × ${p.n} (${p.b}) — ${O.fmt(p.pn * o.q)}`).join('\n') + `\nTotal: ${O.fmt(tot)}`;
      window.open(`https://wa.me/573001087938?text=${encodeURIComponent(t)}`, '_blank', 'noopener');
    };
  }
  // cambio de estilo: las piezas se reordenan con animación (FLIP)
  function setStyle(s) {
    const first = new Map($$('.mb', inv).map(el => [el.dataset.k, el.getBoundingClientRect()]));
    style = s; try { localStorage.setItem('og-factura', s); } catch (e) {}
    $$('.inv-sw button', ov).forEach(b => b.classList.toggle('on', b.dataset.s === s));
    $('.inv-sw', ov).dataset.s = s;
    render();
    $$('.mb', inv).forEach((el, n) => {
      const a = first.get(el.dataset.k), b = el.getBoundingClientRect(); if (!a) return;
      el.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px)`, opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 650, delay: n * 35, easing: 'cubic-bezier(.22,1,.36,1)' });
    });
  }
  $$('.inv-sw button', ov).forEach(b => b.onclick = () => setStyle(b.dataset.s));
  const close = () => { ov.classList.remove('on'); ov.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('lock', 'printing-inv'); };
  ov.addEventListener('click', e => { if (e.target === ov || e.target.closest('.inv-x')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && ov.classList.contains('on')) close(); });
  window.OGInvoice = {
    open() {
      render(); $$('.inv-sw button', ov).forEach(b => b.classList.toggle('on', b.dataset.s === style)); $('.inv-sw', ov).dataset.s = style;
      ov.classList.add('on'); ov.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('lock', 'printing-inv');
      inv.animate([{ transform: 'translateY(-60%)', clipPath: 'inset(0 0 100% 0)' }, { transform: 'none', clipPath: 'inset(0 0 0 0)' }], { duration: 1100, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  };
  if (/[?&]pedido/.test(location.search)) { const go = () => OGInvoice.open(); window.OG ? go() : document.addEventListener('og:ready', go); }
})();
