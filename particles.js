// ===== El roto de OG hecho de partículas 3D que reaccionan al cursor =====
(function () {
  const cv = document.getElementById('ogParticles'); if (!cv) return;
  const ctx = cv.getContext('2d'), DPR = Math.min(2, devicePixelRatio || 1);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, pts = [], mx = -9999, my = -9999, rx = 0, ry = 0, trx = 0, try_ = 0, t0 = performance.now();
  const fit = () => { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); };
  fit(); addEventListener('resize', fit);
  const img = new Image(); img.src = '/hole.png';
  img.onload = () => {
    const S = 160, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d'); g.drawImage(img, 0, 0, S, S);
    const d = g.getImageData(0, 0, S, S).data, cand = [];
    for (let y = 0; y < S; y += 1) for (let x = 0; x < S; x += 1) if (d[(y * S + x) * 4 + 3] > 140) cand.push([x / S - .5, y / S - .5]);
    const N = Math.min(4200, cand.length);
    for (let k = 0; k < N; k++) {
      const [x, y] = cand[Math.floor(Math.random() * cand.length)], r = Math.hypot(x, y);
      const z = (Math.random() - .5) * .22 * (1 - r * 1.2);
      const a = Math.random() * Math.PI * 2, R = .9 + Math.random() * .6;
      pts.push({ x: x + (Math.random() - .5) * .006, y: y + (Math.random() - .5) * .006, z, sx: Math.cos(a) * R, sy: Math.sin(a) * R, sz: (Math.random() - .5) * 2, ox: 0, oy: 0, s: Math.random() * 1.4 + .8 });
    }
    requestAnimationFrame(draw);
  };
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; trx = (my / H - .5) * -.6; try_ = (mx / W - .5) * .8; });
  cv.addEventListener('pointerleave', () => { mx = my = -9999; trx = 0; try_ = 0; });
  const fg = () => getComputedStyle(document.body).getPropertyValue('--fg').trim() || '#EDE8DF';
  function draw(now) {
    const t = (now - t0) / 1000, k = reduce ? 1 : Math.min(1, t / 2.2), e = 1 - Math.pow(1 - k, 4);
    rx += (trx - rx) * .05; ry += (try_ + Math.sin(t * .3) * .25 - ry) * .05;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = fg();
    const size = Math.min(W, H) * .92, cx = W / 2, cy = H / 2, cX = Math.cos(rx), sX = Math.sin(rx), cY = Math.cos(ry), sY = Math.sin(ry);
    for (const p of pts) {
      let x = p.sx + (p.x - p.sx) * e, y = p.sy + (p.y - p.sy) * e, z = p.sz + (p.z - p.sz) * e;
      const x1 = x * cY + z * sY, z1 = -x * sY + z * cY, y1 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
      const per = 1.6 / (1.6 + z2);
      let px = cx + x1 * size * per, py = cy + y1 * size * per;
      const dx = px - mx, dy = py - my, d2 = dx * dx + dy * dy;
      if (d2 < 9000) { const f = (1 - d2 / 9000) * 26; p.ox += dx / Math.sqrt(d2 + 1) * f * .15; p.oy += dy / Math.sqrt(d2 + 1) * f * .15; }
      p.ox *= .9; p.oy *= .9; px += p.ox; py += p.oy;
      ctx.globalAlpha = Math.max(.15, Math.min(1, .55 + z2 * 2)) * e;
      ctx.fillRect(px, py, p.s * per, p.s * per);
    }
    ctx.globalAlpha = 1;
    if (!reduce || k < 1) requestAnimationFrame(draw);
  }
})();
