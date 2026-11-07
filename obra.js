// ===== stdo · COMING SOON: la obra (bloques con física que se pueden arrastrar, lanzar, derribar y apilar) =====
(function () {
  const wrap = document.getElementById('obraCanvas'); if (!wrap || !window.Matter) return;
  const { Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = n => getComputedStyle(document.body).getPropertyValue(n).trim();
  const FG = css('--fg') || '#0A0A0A', BG = css('--bg') || '#F2F0EC';
  const PALABRAS = ['IDEA', 'GUION', 'CASTING', 'RODAJE', 'LUCES', 'CÁMARA', 'ACCIÓN', 'EDICIÓN', 'COLOR', 'SONIDO', 'VFX', 'LANZAMIENTO'];
  let W = 0, H = 0, mobile = false;
  const engine = Engine.create({ gravity: { y: 1 } });
  const render = Render.create({ element: wrap, engine, options: { width: 10, height: 10, wireframes: false, background: 'transparent', pixelRatio: Math.min(2, devicePixelRatio || 1) } });
  let walls = [];
  const logo = new Image(); logo.src = '/hole.png';

  function size() {
    const r = wrap.getBoundingClientRect(); W = Math.round(r.width); H = Math.round(r.height); mobile = W < 640;
    render.canvas.width = W * render.options.pixelRatio; render.canvas.height = H * render.options.pixelRatio;
    render.canvas.style.width = W + 'px'; render.canvas.style.height = H + 'px';
    render.options.width = W; render.options.height = H; render.bounds.max.x = W; render.bounds.max.y = H;
    Composite.remove(engine.world, walls);
    const t = 200;
    walls = [Bodies.rectangle(W / 2, H + t / 2, W * 3, t, { isStatic: true, render: { visible: false } }),
             Bodies.rectangle(-t / 2, H / 2, t, H * 4, { isStatic: true, render: { visible: false } }),
             Bodies.rectangle(W + t / 2, H / 2, t, H * 4, { isStatic: true, render: { visible: false } })];
    Composite.add(engine.world, walls);
  }

  // Ladrillo con palabra (el texto se pinta encima, en afterRender)
  const ladrillos = [];
  function ladrillo(word, x, y, dark) {
    const fs = mobile ? 13 : 17, w = Math.max(70, word.length * fs * 0.72 + 34), h = mobile ? 38 : 48;
    const b = Bodies.rectangle(x, y, w, h, { chamfer: { radius: 6 }, restitution: .15, friction: .6, density: .002,
      render: { fillStyle: dark ? FG : BG, strokeStyle: FG, lineWidth: 2 } });
    b.og = { word, dark, w, h }; b.angle = (Math.random() - .5) * .6; ladrillos.push(b); Composite.add(engine.world, b); return b;
  }
  function roto(x, y) {
    const r = mobile ? 34 : 46;
    const b = Bodies.circle(x, y, r, { restitution: .5, friction: .3, density: .003, render: { fillStyle: FG } });
    b.og = { roto: true, r }; ladrillos.push(b); Composite.add(engine.world, b); return b;
  }
  function cono(x, y) {
    const s = mobile ? 26 : 34;
    const b = Bodies.polygon(x, y, 3, s, { restitution: .2, friction: .8, render: { fillStyle: '#E8E54A', strokeStyle: FG, lineWidth: 2 } });
    b.og = { cono: true }; ladrillos.push(b); Composite.add(engine.world, b); return b;
  }
  function carga(n = PALABRAS.length) {
    PALABRAS.slice(0, n).forEach((p, i) => setTimeout(() => ladrillo(p, W * (.15 + Math.random() * .7), -60 - Math.random() * 200, i % 3 === 0), i * (reduce ? 0 : 110)));
    setTimeout(() => roto(W * (.3 + Math.random() * .4), -120), reduce ? 0 : 600);
    setTimeout(() => cono(W * (.2 + Math.random() * .6), -100), reduce ? 0 : 900);
    tope();
  }
  function tope() {          // máximo de piezas para que no se sature (sobre todo en celular)
    const max = mobile ? 30 : 60;
    while (ladrillos.length > max) Composite.remove(engine.world, ladrillos.shift());
  }
  function derribar() {
    ladrillos.forEach(b => Body.applyForce(b, b.position, { x: (Math.random() - .5) * .25 * b.mass, y: -(.18 + Math.random() * .2) * b.mass }));
    avance(-6);
  }
  function construir() {       // apila las piezas como un muro ordenado
    let x = 0, fila = 0; const g = 6, base = H - 10, ancho = mobile ? W - 40 : Math.min(W - 40, W * 0.48), x0 = (W - ancho) / 2;
    ladrillos.filter(b => b.og.word).forEach(b => {
      if (x + b.og.w > ancho) { x = 0; fila++; }
      const off = x0 + (fila % 2 ? 18 : 0);
      Body.setAngle(b, 0); Body.setAngularVelocity(b, 0); Body.setVelocity(b, { x: 0, y: 0 });
      Body.setPosition(b, { x: off + x + b.og.w / 2, y: base - fila * (b.og.h + 3) - b.og.h / 2 - 2 });
      x += b.og.w + g;
    });
    ladrillos.filter(b => !b.og.word).forEach((b, i) => {   // el roto y los conos se apartan a un lado
      Body.setVelocity(b, { x: 0, y: 0 }); Body.setAngularVelocity(b, 0);
      Body.setPosition(b, { x: Math.min(W - 50, x0 + ancho + 70 + (i % 4) * 80), y: base - 60 });
    });
    avance(+12);
  }

  // Medidor "obra al X%": sube cuando la gente construye, baja cuando derriba
  let pct = 62; const bar = document.getElementById('obraPct');
  function avance(d) {
    pct = Math.max(40, Math.min(97, pct + d));
    if (bar) { bar.style.setProperty('--p', pct + '%'); bar.querySelector('b').textContent = pct + '%'; }
  }

  // Texto de cada ladrillo y el roto
  Events.on(render, 'afterRender', () => {
    const c = render.context, pr = render.options.pixelRatio;
    c.save(); c.scale(pr, pr);
    for (const b of ladrillos) {
      c.save(); c.translate(b.position.x, b.position.y); c.rotate(b.angle);
      if (b.og.word) {
        c.fillStyle = b.og.dark ? BG : FG; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.font = `${mobile ? 700 : 800} ${mobile ? 13 : 17}px Archivo, Arial, sans-serif`; c.fillText(b.og.word, 0, 1);
      } else if (b.og.roto && logo.complete) {
        const r = b.og.r * 1.25; c.filter = 'invert(1)'; c.drawImage(logo, -r, -r, r * 2, r * 2); c.filter = 'none';
      } else if (b.og.cono) {
        c.fillStyle = FG; c.fillRect(-12, -2, 24, 5);
      }
      c.restore();
    }
    c.restore();
  });

  // Arrastrar y lanzar con mouse o dedo (sin bloquear el scroll de la página con la rueda)
  const mouse = Mouse.create(render.canvas); mouse.pixelRatio = render.options.pixelRatio;
  const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: .2, render: { visible: false } } });
  ['mousewheel', 'DOMMouseScroll', 'wheel'].forEach(ev => render.canvas.removeEventListener(ev, mouse.mousewheel));
  Composite.add(engine.world, mc); render.mouse = mouse;
  Events.on(mc, 'startdrag', () => { wrap.classList.add('grab'); avance(+1); });
  Events.on(mc, 'enddrag', () => wrap.classList.remove('grab'));

  size(); Render.run(render); const runner = Runner.create(); Runner.run(runner, engine);
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(size, 200); });

  // la carga cae cuando la sección entra en pantalla
  let cayo = false;
  new IntersectionObserver(e => { if (e[0].isIntersecting && !cayo) { cayo = true; carga(); } }, { threshold: .25 }).observe(wrap);
  document.getElementById('obraCarga')?.addEventListener('click', () => { carga(6); avance(+4); });
  document.getElementById('obraDerribar')?.addEventListener('click', derribar);
  document.getElementById('obraConstruir')?.addEventListener('click', construir);
  avance(0);
})();
