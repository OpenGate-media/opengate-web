// ===== SIDE B · música de Open Gate (supported by JOTiK Music) =====
// Temas de ejemplo (audio de prueba). Reemplazar por los temas reales / playlist de Juan Duarte.
const TRACKS = [
  { t: 'Del Otro Lado', a: 'JOTiK', g: 'tech-house', bpm: 124, key: 'Am', p: '$ 11.111', src: '/audio/demo-1.mp3' },
  { t: 'Open Gate', a: 'JOTiK', g: 'tech-house', bpm: 126, key: 'Cm', p: '$ 11.111', src: '/audio/demo-3.mp3' },
  { t: 'Sensor Apagado', a: 'JOTiK', g: 'house', bpm: 122, key: 'Dm', p: '$ 11.111', src: '/audio/demo-2.mp3' },
  { t: 'REC 00:00', a: 'JOTiK', g: 'house', bpm: 120, key: 'Em', p: '$ 11.111', src: '/audio/demo-4.mp3' }
];
const GENRES = [['all', 'Todo'], ['tech-house', 'Tech House'], ['house', 'House'], ['afro', 'Afro', 1], ['disco', 'Disco', 1]];
const WA_MUSIC = '573001087938';

(function musicInit() {
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', musicInit); return; }
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let st = { i: 0, t: 0, muted: false };
  try { Object.assign(st, JSON.parse(localStorage.getItem('og-music') || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem('og-music', JSON.stringify(st)); } catch (e) {} };
  const audio = new Audio(); audio.preload = 'auto'; audio.volume = 0;
  const VOL = .55;
  let started = false, fadeT;
  const fadeTo = (v, ms = 1200, cb) => {
    clearInterval(fadeT); const from = audio.volume, steps = 24; let k = 0;
    fadeT = setInterval(() => { k++; audio.volume = Math.max(0, Math.min(1, from + (v - from) * k / steps)); if (k >= steps) { clearInterval(fadeT); cb && cb(); } }, ms / steps);
  };
  const load = (i, t = 0) => { st.i = (i + TRACKS.length) % TRACKS.length; audio.src = TRACKS[st.i].src; audio.currentTime = t; paint(); };
  audio.addEventListener('ended', () => { load(st.i + 1); play(); });
  audio.addEventListener('timeupdate', () => { st.t = audio.currentTime; });
  setInterval(save, 2000); addEventListener('pagehide', save);

  // ---- mini reproductor fijo ----
  const mini = document.createElement('div');
  mini.className = 'og-player'; mini.setAttribute('role', 'region'); mini.setAttribute('aria-label', 'Música de Open Gate');
  mini.innerHTML = `<button class="op-toggle" aria-label="Silenciar música"><span class="eq"><i></i><i></i><i></i><i></i></span></button>
    <div class="op-meta"><span class="op-k">side b · sonando</span><span class="op-t"></span></div>
    <button class="op-next" aria-label="Siguiente tema">›</button>`;
  document.body.appendChild(mini);
  const playing = () => !audio.paused && !st.muted;
  function paint() {
    const tr = TRACKS[st.i];
    $('.op-t', mini).textContent = `${tr.t} — ${tr.a}`;
    mini.classList.toggle('on', playing());
    $('.op-toggle', mini).setAttribute('aria-label', st.muted ? 'Activar música' : 'Silenciar música');
    $('.op-k', mini).textContent = st.muted ? 'side b · en silencio' : 'side b · sonando';
    document.documentElement.classList.toggle('music-on', playing());
    $$('.sb-row').forEach(r => r.classList.toggle('cur', +r.dataset.i === st.i));
    $$('.sb-row .sb-play').forEach(b => { const on = +b.closest('.sb-row').dataset.i === st.i && playing(); b.textContent = on ? '❚❚' : '▶'; b.setAttribute('aria-label', on ? 'Pausar' : 'Reproducir'); });
  }
  function play() {
    if (st.muted) return;
    audio.play().then(() => { started = true; fadeTo(VOL); paint(); }).catch(() => {});
  }
  function mute(m) {
    st.muted = m; save();
    if (m) fadeTo(0, 500, () => { audio.pause(); paint(); }); else play();
    paint();
  }
  $('.op-toggle', mini).onclick = e => { e.stopPropagation(); if (!started && !st.muted) { play(); return; } mute(!st.muted); };
  $('.op-next', mini).onclick = e => { e.stopPropagation(); load(st.i + 1); if (st.muted) { st.muted = false; } play(); };
  load(st.i, st.t || 0);
  // Los navegadores no dejan sonar sin una interacción: arranca con el primer toque / tecla
  const kick = e => { if (e && e.target && e.target.closest && e.target.closest('.og-player')) return; if (!started && !st.muted) play(); };
  ['pointerdown', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, kick, { once: false, passive: true }));
  addEventListener('pointerdown', function off() { if (started || st.muted) removeEventListener('pointerdown', off); });

  // ---- sección SIDE B (si existe en la página) ----
  const sec = $('#sideb'); if (!sec) return;
  const tabs = $('.sb-tabs', sec), list = $('.sb-list', sec);
  tabs.innerHTML = GENRES.map(([k, l, soon], n) => `<button class="cat${n ? '' : ' on'}${soon ? ' soon' : ''}" data-k="${k}">${l}${soon ? ' <em>pronto</em>' : ''}</button>`).join('');
  const fmtT = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const render = k => {
    list.innerHTML = TRACKS.map((x, i) => (k === 'all' || x.g === k) ? `<li class="sb-row" data-i="${i}">
      <button class="sb-play" aria-label="Reproducir">▶</button>
      <span class="sb-n">${String(i + 1).padStart(2, '0')}</span>
      <span class="sb-tt"><b>${x.t}</b><small>${x.a} · ${GENRES.find(g => g[0] === x.g)[1]}</small></span>
      <span class="sb-meta">${x.bpm} BPM · ${x.key}</span>
      <span class="sb-p">${x.p}</span>
      <a class="sb-buy" target="_blank" rel="noopener" href="https://wa.me/${WA_MUSIC}?text=${encodeURIComponent(`Hola Open Gate 👋 Quiero comprar el tema "${x.t}" de ${x.a} (SIDE B).`)}">comprar</a></li>` : '').join('');
    $$('.sb-row', list).forEach(r => {
      const i = +r.dataset.i;
      $('.sb-play', r).onclick = () => {
        if (i === st.i && playing()) { mute(true); return; }
        if (i !== st.i) load(i); st.muted = false; save(); play();
      };
    });
    paint();
  };
  $$('.cat', tabs).forEach(b => b.onclick = () => {
    if (b.classList.contains('soon')) return;
    $$('.cat', tabs).forEach(x => x.classList.toggle('on', x === b)); render(b.dataset.k);
  });
  render('all');
  audio.addEventListener('timeupdate', () => { const el = $('.sb-time', sec); if (el && audio.duration) el.textContent = `${fmtT(audio.currentTime)} / ${fmtT(audio.duration)}`; const tr = TRACKS[st.i]; const n = $('.sb-now', sec); if (n) n.textContent = `${tr.t} — ${tr.a}`; });
})();
