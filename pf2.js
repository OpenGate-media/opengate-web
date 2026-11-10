(function(){
if(!document.querySelector(".pf2"))return;

const P=[
 {n:'Supremacy Noir',c:'Video',k:'VFX',cl:'Afnan',y:'2026',d:'0:24',g:'linear-gradient(145deg,#1a1a1a,#3b3b39 60%,#0a0a0a)',t:'La grieta con forma del roto se abre y el frasco cae girando.',w:'Dirección · Blender · Composición'},
 {n:'Spot Perfumería',c:'Video',k:'Comercial',cl:'og.prdct',y:'2026',d:'0:30',g:'linear-gradient(200deg,#2d2c2a,#0c0c0c 70%)',t:'Anuncio vertical para redes, pensado para vender en 3 segundos.',w:'Guion · Rodaje · Edición'},
 {n:'Sesión Aventus',c:'Foto',k:'Producto',cl:'og.prdct',y:'2026',d:'24 fotos',g:'linear-gradient(160deg,#4a4945,#171717)',t:'Luz lateral, vidrio y reflejos. Fondo blanco y fondo oscuro.',w:'Fotografía · Retoque'},
 {n:'Identidad OG',c:'Diseño',k:'Marca',cl:'Open Gate',y:'2026',d:'Sistema',g:'linear-gradient(130deg,#6e6c67,#1b1b1a)',t:'Logo, paleta, tipografía y reglas de uso en todas las piezas.',w:'Dirección de arte · Diseño'},
 {n:'Reel Octubre',c:'Video',k:'Reel',cl:'Open Gate',y:'2026',d:'1:10',g:'linear-gradient(170deg,#262625,#555350 55%,#111)',t:'Lo mejor del mes en un solo corte, con música original.',w:'Edición · Color · Sonido'},
 {n:'Tras cámara',c:'Foto',k:'Proceso',cl:'Open Gate',y:'2026',d:'18 fotos',g:'linear-gradient(190deg,#3a3936,#0e0e0e)',t:'Cómo se hace: set, luces y equipo trabajando.',w:'Fotografía documental'}
];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const art=(p,ej=true)=>`<div class="art" data-l="${p.n[0]}" style="--g:${p.g}"><i></i><i></i><i></i><i></i></div>${ej?'<span class="ej">Ejemplo</span>':''}`;
const VISTAS=['rollo','grid','indice'],NOM={rollo:'Rollo',grid:'Cuadrícula',indice:'Índice'};
let cat='Todo',vista='rollo';
const vis=()=>P.filter(p=>cat==='Todo'||p.c===cat);
const wa=t=>'https://wa.me/573001087938?text='+encodeURIComponent(t);

/* el roto gira con el scroll (hero, dock, contacto) */
let rt=0;addEventListener('scroll',()=>{if(rt)return;rt=requestAnimationFrame(()=>{rt=0;document.documentElement.style.setProperty('--r',(scrollY*.12)+'deg')})},{passive:true});
/* el roto del hero mira hacia el cursor */
if(matchMedia('(hover:hover)').matches)addEventListener('mousemove',e=>{const r=$('#heroImg').getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/innerWidth*14,y=(e.clientY-r.top-r.height/2)/innerHeight*14;$('#heroImg').style.translate=`${x}px ${y}px`});

/* destacado */
const f=P[0];
$('#feat').innerHTML=`${art(f)}<span class="meta"><span><span class="mono rec">Destacado · ${f.d}</span><h3 class="d">${f.n}</h3></span><span class="rb"><span class="roto"></span><span class="tip">Ver</span></span></span>`;
$('#feat').onclick=()=>open(0);

/* ficha */
function open(i){const p=P[i];$('#box').innerHTML=`<div class="vis">${art(p,false)}</div><div class="txt"><button class="rb pfx" id="cl" aria-label="Cerrar"><span class="roto"></span><span class="tip">Cerrar</span></button><span class="mono rec">${p.c} · ${p.k}</span><h3 class="d">${p.n}</h3><p style="line-height:1.5">${p.t}</p><dl><dt>Cliente</dt><dd>${p.cl}</dd><dt>Año</dt><dd>${p.y}</dd><dt>Duración</dt><dd>${p.d}</dd><dt>Hicimos</dt><dd>${p.w}</dd></dl><a class="btn" target="_blank" rel="noopener" href="${wa('Hola Open Gate, vi el proyecto '+p.n+' y quiero algo así.')}">Quiero algo así →</a><button class="btn o" id="cl2">Seguir viendo</button></div>`;
 $('#sh').classList.add('act');$('#cl').onclick=$('#cl2').onclick=()=>$('#sh').classList.remove('act')}
$('#sh').addEventListener('click',e=>{if(e.target.id==='sh')$('#sh').classList.remove('act')});
addEventListener('keydown',e=>{if(e.key==='Escape')$('#sh').classList.remove('act')});

/* vistas */
function rollo(v){
 $('#view').innerHTML=`<div class="film fade"><div class="now"><span class="pfn d" id="bn">01</span><div class="pfinfo"><span class="mono rec" id="bm"></span><h3 class="d" id="bt"></h3><button class="btn" id="bo">Ver proyecto →</button></div></div>
 <div class="strip" id="strip">${v.map((p,i)=>`<div class="pffr hv" data-i="${P.indexOf(p)}">${'<span class="perf perfT"></span><span class="perf perfB"></span>'}${art(p)}<span class="tag mono">${p.d} · ${p.k}</span></div>`).join('')}</div>
 <div class="ctl"><button class="arr" id="pv" aria-label="Anterior">←</button><div class="pfprog"><i id="bb"></i></div><button class="arr" id="nx" aria-label="Siguiente">→</button></div></div>`;
 const st=$('#strip'),fr=$$('.pffr');let k=0;
 const set=i=>{k=Math.max(0,Math.min(fr.length-1,i));fr.forEach((x,j)=>x.classList.toggle('act',j===k));const p=P[+fr[k].dataset.i];$('#bn').textContent=String(k+1).padStart(2,'0');$('#bm').textContent=p.c+' · '+p.cl;$('#bt').textContent=p.n;$('#bb').style.width=((k+1)/fr.length*100)+'%';$('#bo').onclick=()=>open(+fr[k].dataset.i)};
 const go=i=>{set(i);fr[k].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})};
 st.addEventListener('scroll',()=>{const c=st.scrollLeft+st.clientWidth/2;let b=0,bd=1e9;fr.forEach((x,j)=>{const d=Math.abs(x.offsetLeft+x.offsetWidth/2-c);if(d<bd){bd=d;b=j}});if(b!==k)set(b)},{passive:true});
 fr.forEach((x,j)=>x.onclick=()=>j===k?open(+x.dataset.i):go(j));
 $('#pv').onclick=()=>go(k-1);$('#nx').onclick=()=>go(k+1);
 let dn=0,sx=0,sl=0;st.onpointerdown=e=>{if(e.pointerType!=='mouse')return;dn=1;sx=e.clientX;sl=st.scrollLeft;st.style.scrollSnapType='none'};
 addEventListener('pointermove',e=>{if(dn)st.scrollLeft=sl-(e.clientX-sx)});addEventListener('pointerup',()=>{if(dn){dn=0;st.style.scrollSnapType='';go(k)}});
 set(0)}
function grid(v){
 $('#view').innerHTML=`<div class="pfgrid fade">${v.map((p,j)=>`<button class="tile hv${j===0&&v.length>3?' w':''}" data-i="${P.indexOf(p)}">${art(p)}<span class="pftc">${p.d}</span><span class="pflb"><span class="mono">${p.c} · ${p.cl}</span><b>${p.n}</b></span></button>`).join('')}</div>`;
 $$('.tile').forEach(e=>e.onclick=()=>open(+e.dataset.i))}
function indice(v){
 $('#view').innerHTML=`<div class="list fade">${v.map((p,i)=>`<button class="pfrow" data-i="${P.indexOf(p)}"><span class="mono">${String(i+1).padStart(2,'0')}</span><h3 class="d">${p.n}</h3><span class="mono">${p.c}<br>${p.y}</span><span class="in">${art(p,false)}</span></button>`).join('')}</div><div class="float" id="fl"></div>`;
 const fl=$('#fl');let tx=0,ty=0,cx=0,cy=0;
 (function loop(){if(!fl.isConnected)return;cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;fl.style.transform=`translate(${cx}px,${cy}px) rotate(${(tx-cx)*.02}deg)`;requestAnimationFrame(loop)})();
 $$('.pfrow').forEach(r=>{const p=P[+r.dataset.i];
  r.addEventListener('mouseenter',()=>{fl.innerHTML=art(p,false);fl.style.opacity=1});
  r.addEventListener('mouseleave',()=>fl.style.opacity=0);
  r.addEventListener('mousemove',e=>{tx=e.clientX+24;ty=Math.min(innerHeight-fl.offsetHeight-12,Math.max(60,e.clientY-fl.offsetHeight/2))});
  r.onclick=()=>{if(matchMedia('(hover:none)').matches&&!r.classList.contains('pfopen')){$$('.pfrow').forEach(x=>x.classList.remove('pfopen'));r.classList.add('pfopen');r.querySelector('.in').onclick=ev=>{ev.stopPropagation();open(+r.dataset.i)}}else open(+r.dataset.i)}})}

function render(){
 const v=vis();$('#chips').innerHTML=['Todo','Video','Foto','Diseño'].map(c=>`<button class="chip${c===cat?' act':''}" data-c="${c}">${c}</button>`).join('');
 ({rollo,grid,indice})[vista](v);
 $$('#seg button').forEach(b=>b.classList.toggle('act',b.dataset.v===vista));
 $('#vista').textContent='Vista · '+NOM[vista];$('#cycTip').textContent='Vista · '+NOM[vista]+' → siguiente';
 $('#cnt').textContent=v.length+' de '+P.length+' proyectos'}
$('#chips').onclick=e=>{const b=e.target.closest('button');if(!b)return;cat=b.dataset.c;render()};
$('#seg').onclick=e=>{const b=e.target.closest('button');if(!b)return;vista=b.dataset.v;render()};
let tt;$('#cyc').onclick=()=>{vista=VISTAS[(VISTAS.indexOf(vista)+1)%3];render();$('#proyectos').scrollIntoView({block:'start'});const t=$('#toast');t.textContent='Vista · '+NOM[vista];t.classList.add('act');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('act'),1400)};

/* contadores */
const io=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;io.unobserve(x.target);const t=+x.target.dataset.n;let n=0;const s=setInterval(()=>{n+=Math.max(1,Math.round(t/24));if(n>=t){n=t;clearInterval(s)}x.target.textContent=n+'+'},40)}));$$('[data-n]').forEach(e=>io.observe(e));
render();

})();
