// ===== OG 3D: perfumes en 3D real (GLB) con un solo motor WebGL compartido =====
// Cualquier <div class="og3d" data-glb="/models/x.glb"> se convierte en un frasco 3D que gira.
// data-drag="1" permite girarlo con el dedo / mouse.
import * as THREE from 'three';
import { GLTFLoader } from '/vendor/three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from '/vendor/three/examples/jsm/environments/RoomEnvironment.js';

const DPR = Math.min(2, devicePixelRatio || 1);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const loader = new GLTFLoader();
const cache = new Map();
const getModel = url => {
  if (!cache.has(url)) cache.set(url, new Promise((ok, ko) => loader.load(url, g => {
    const root = g.scene;
    root.traverse(o => {
      if (!o.isMesh) return;
      const m = o.material;
      o.material = new THREE.MeshPhysicalMaterial({
        map: m.map || null, color: m.color || 0xffffff,
        roughness: .22, metalness: .05, clearcoat: 1, clearcoatRoughness: .06,
        envMap: envTex, envMapIntensity: 1.15, side: THREE.DoubleSide
      });
      if (o.material.map) o.material.map.anisotropy = 8;
    });
    // centrar y normalizar a 2 unidades de alto
    const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    root.position.sub(c); const wrap = new THREE.Group(); wrap.add(root); wrap.scale.setScalar(2 / size.y);
    ok(wrap);
  }, undefined, ko)));
  return cache.get(url);
};

const views = new Set();
class View {
  constructor(el) {
    this.el = el; el.dataset.on = '1';
    this.cv = document.createElement('canvas'); this.cv.className = 'og3d-cv'; el.appendChild(this.cv);
    this.ctx = this.cv.getContext('2d');
    this.scene = new THREE.Scene(); this.scene.environment = envTex;
    const key = new THREE.DirectionalLight(0xfff1dc, 2.2); key.position.set(2, 3, 3); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xc9d8ff, 1.6); rim.position.set(-3, 1.5, -2); this.scene.add(rim);
    this.scene.add(new THREE.AmbientLight(0xffffff, .35));
    this.cam = new THREE.PerspectiveCamera(26, 1, .1, 50); this.cam.position.set(0, .25, 5.4); this.cam.lookAt(0, 0, 0);
    this.ry = +(el.dataset.ry || 0); this.vy = 0; this.rx = 0; this.visible = true; this.drag = el.dataset.drag === '1';
    this.spin = el.dataset.spin === '0' ? 0 : .35;
    getModel(el.dataset.glb).then(m => { this.obj = m.clone(); this.scene.add(this.obj); el.classList.add('ready'); }).catch(() => el.classList.add('fail'));
    new IntersectionObserver(e => this.visible = e[0].isIntersecting, { rootMargin: '100px' }).observe(el);
    if (this.drag) {
      let px = null, py = null;
      el.addEventListener('pointerdown', e => { px = e.clientX; py = e.clientY; this.vy = 0; el.setPointerCapture && el.setPointerCapture(e.pointerId); });
      el.addEventListener('pointermove', e => { if (px === null) return; const dx = e.clientX - px; this.ry += dx * .012; this.vy = dx * .012; this.rx = Math.max(-.35, Math.min(.35, this.rx + (e.clientY - py) * .004)); px = e.clientX; py = e.clientY; });
      const up = () => px = null; el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
      el.style.touchAction = 'pan-y'; el.style.cursor = 'grab';
    }
  }
  frame(dt) {
    if (!this.obj || !this.visible || !this.el.isConnected) return;
    const r = this.el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
    const w = Math.round(r.width * DPR), h = Math.round(r.height * DPR);
    if (this.cv.width !== w || this.cv.height !== h) { this.cv.width = w; this.cv.height = h; }
    this.vy *= .94; this.ry += this.vy + this.spin * dt; this.rx *= .96;
    this.obj.rotation.set(this.rx, this.ry, 0);
    this.cam.aspect = w / h;
    // encuadre: el frasco ocupa el alto disponible
    const fit = 1.15 / Math.tan(THREE.MathUtils.degToRad(this.cam.fov / 2));
    this.cam.position.z = Math.max(fit, fit / Math.min(1, this.cam.aspect * 1.6)); this.cam.updateProjectionMatrix();
    if (renderer.domElement.width !== w || renderer.domElement.height !== h) renderer.setSize(w, h, false);
    renderer.render(this.scene, this.cam);
    this.ctx.clearRect(0, 0, w, h); this.ctx.drawImage(renderer.domElement, 0, 0);
  }
}
const scan = (root = document) => root.querySelectorAll('.og3d[data-glb]:not([data-on])').forEach(el => views.add(new View(el)));
new MutationObserver(() => scan()).observe(document.body, { childList: true, subtree: true });
scan();
let last = performance.now();
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
(function loop(t) {
  const dt = Math.min(.05, (t - last) / 1000); last = t;
  for (const v of views) { if (!v.el.isConnected) { views.delete(v); continue; } if (reduce && v.obj && v.done) continue; v.frame(dt); if (reduce) v.done = true; }
  requestAnimationFrame(loop);
})(last);
window.OG3D = { scan };
