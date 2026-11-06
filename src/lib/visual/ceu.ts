import { orientacaoAgora, projetarX } from './observatorio';
import { EPOCA_ORBITA, posicaoLua } from './orbita';
type Estrela = { x:number; y:number; vx:number; vy:number; angulo:number; vel:number; fase:number; brilho:number };
type Cadente = { inicio:number; duracao:number; x:number; y:number; ang:number; dist:number };
function contexto(canvas: HTMLCanvasElement) {
 const ctx = canvas.getContext('2d');
 if (!ctx) throw new Error('Canvas 2D não disponível.');
 return ctx;
}
/** Monta apenas efeitos decorativos. Retorna a limpeza completa de eventos e frames. */
export function iniciarCeu(fundo: HTMLCanvasElement, efeitos: HTMLCanvasElement): () => void {
 const ctx=contexto(fundo),fc=contexto(efeitos),reduzir=matchMedia('(prefers-reduced-motion: reduce)');
 const eventos=new AbortController(),mouse={x:-9999,y:-9999};
 let W=innerWidth,H=innerHeight,frame=0,ultimo=-9999,ultimoDesenhoLua=-9999;
 let tempoPausaLua: number | null=null;
 const lunar=document.createElement('canvas');lunar.width=lunar.height=768;const moonCtx=contexto(lunar);
 let sementeLua=4817;const randomLua=()=>{sementeLua=(sementeLua*1664525+1013904223)>>>0;return sementeLua/4294967296};
 const crateras=Array.from({length:26},()=>{const lon=(randomLua()-.5)*Math.PI*1.8,lat=(randomLua()-.5)*Math.PI*.9;return{x:Math.sin(lon)*Math.cos(lat),y:Math.sin(lat),z:Math.cos(lon)*Math.cos(lat),radius:.05+randomLua()*.15}});
const estrelas: Estrela[]=Array.from({length:90},(_,i)=>{const ang=i*2.39996,vel=3+(i%9)*.42;return{x:(i*173+47)%997/997*W,y:(i*337+91)%991/991*H,vx:Math.cos(ang)*vel,vy:Math.sin(ang)*vel,angulo:ang,vel,fase:i*.77,brilho:.22+(i%7)*.035}});
function aparente(e: Estrela, i: number) {
 const giro=(orientacaoAgora()+28)*Math.PI/180*(.45+(i%5)*.12);
 const a=((Math.atan((e.x-W/2)/(W*.85))-giro+.6)%1.2+1.2)%1.2-.6;
 return {x:W/2+Math.tan(a)*W*.85,y:e.y-Math.min(scrollY,1600)*(.012+(i%4)*.006)};
}
function atualizarEstrelas(dt: number,t: number){
 const proximas=estrelas.map(e=>({x:e.x,y:e.y,vx:e.vx,vy:e.vy}));
 for(let i=0;i<estrelas.length;i++){const e=estrelas[i];e.angulo+=Math.sin(t*.00016+e.fase)*dt*.16;
  let ax=0,ay=0,alx=0,aly=0,n=0;
  for(let j=0;j<proximas.length;j++){if(i===j)continue;const o=proximas[j],dx=e.x-o.x,dy=e.y-o.y,d=Math.hypot(dx,dy);if(d<70&&d>0){alx+=o.vx;aly+=o.vy;n++;if(d<22){ax+=dx/d*(1-d/22)*.7;ay+=dy/d*(1-d/22)*.7}}}
  const tx=Math.cos(e.angulo)*e.vel,ty=Math.sin(e.angulo)*e.vel;e.vx+=(tx-e.vx)*dt*.22;e.vy+=(ty-e.vy)*dt*.22;
  if(n){ax+=(alx/n-e.vx)*.045;ay+=(aly/n-e.vy)*.045}
  const vis=aparente(e,i),dx=vis.x-mouse.x,dy=vis.y-mouse.y,d=Math.hypot(dx,dy);if(d<120){const f=(1-d/120)**2;ax+=dx/(d||1)*f*7-dy/(d||1)*f*.8;ay+=dy/(d||1)*f*7+dx/(d||1)*f*.8}
  e.vx+=ax*dt;e.vy+=ay*dt;const speed=Math.hypot(e.vx,e.vy);if(speed>13){e.vx*=13/speed;e.vy*=13/speed}
  e.x+=e.vx*dt;e.y+=e.vy*dt;
  if(e.x< -25)e.x=W+24;if(e.x>W+25)e.x=-24;if(e.y< -25)e.y=H+24;if(e.y>H+25)e.y=-24;
 }
}
// A mesma técnica de relevo, crateras, células e glifos da abertura do ASTRA.
function desenharTexturaLua(epoch: number){
 const ax=.08,ay=((epoch-EPOCA_ORBITA)/1000*.014)%(Math.PI*2),cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax),glyphs='.:;+=xoXO%8#@';
 moonCtx.setTransform(2,0,0,2,0,0);moonCtx.clearRect(0,0,384,384);moonCtx.font='bold 7.2px "Courier New",monospace';moonCtx.textAlign='center';moonCtx.textBaseline='middle';
 const clamp=(n: number)=>Math.max(0,Math.min(1,n));
 for(let gy=3;gy<61;gy++)for(let gx=3;gx<61;gx++){
  const nx=(gx*6+3-192)/170,ny=(gy*6+3-192)/170,rr=nx*nx+ny*ny;if(rr>=1)continue;const nz=Math.sqrt(1-rr),rx=nx*cy+nz*sy,rz=-nx*sy+nz*cy,ry=ny*cx-rz*sx,tz=ny*sx+rz*cx;
  const noise=.5+Math.sin(rx*53+ry*17+tz*11)*Math.cos(ry*47-tz*29+rx*7)*.3+Math.sin(rx*21-ry*31+tz*37)*.13;
  let terreno=0;for(const c of crateras){const dist=Math.sqrt(Math.max(0,2*(1-(rx*c.x+ry*c.y+tz*c.z))));const q=dist/c.radius;if(q<1.5){terreno-=.22*Math.exp(-q*q*3);terreno+=.085*Math.exp(-Math.pow((q-1.05)/.17,2));}}
  const mare=Math.sin(rx*7+ry*3)*Math.cos(ry*6+tz*3)*.11,light=Math.max(.04,-nx*.52-ny*.28+nz*.81),value=clamp(light*.72+terreno+mare+(noise-.5)*.21),tone=.2+Math.pow(clamp(value*1.3),.72)*.8;
  const char=glyphs[Math.min(glyphs.length-1,Math.max(0,Math.floor((tone+(noise-.5)*.17)*(glyphs.length-1))))];
  moonCtx.fillStyle=`rgba(244,245,247,${.035+tone*.055})`;moonCtx.fillRect(gx*6,gy*6,5.3,5.3);const strength=.35+tone*.65;moonCtx.fillStyle=`rgba(${Math.round(244*strength)},${Math.round(245*strength)},${Math.round(247*strength)},${.57+tone*.43})`;moonCtx.fillText(char,gx*6+3,gy*6+3);
 }
}
function pintarLua(t: number,forcar: boolean){const epoch=(reduzir.matches)?(tempoPausaLua??Date.now()):Date.now(),p=posicaoLua(epoch,W,H);if(p.diametro<=0)return;
 // Escala visual da revisão; fase, centro, profundidade e período continuam em orbita.ts.
 const larguraUtil=Math.max(1,Math.min(W,1600)-W*.09);
 const diametroReferencia=W<=900?Math.min(168,W*.4):larguraUtil*.22;
 const escala=diametroReferencia*2.2/(2*Math.min(W*.34,H*.46));
 const size=p.diametro*escala/(340/384),giro=orientacaoAgora()+28;
 // Visibilidade depende do corpo inteiro no campo projetado, nunca da rota
 // ou de um corte angular que apagaria uma Lua ainda dentro da tela.
 const angulo=Math.atan((p.x-W/2)/(W*.85))-giro*Math.PI/180*.95;
 if(Math.abs(angulo)>=Math.PI/2)return; // atrás do observador
 const x=projetarX(p.x,W,giro,.95),raio=size/2+8;
 if(x+raio<0||x-raio>W||p.y+raio<0||p.y-raio>H)return;
 if(forcar||t-ultimoDesenhoLua>80){ultimoDesenhoLua=t;desenharTexturaLua(epoch)}
 ctx.save();ctx.shadowColor='#e1eaff';ctx.shadowBlur=4;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(lunar,x-size/2,p.y-size/2,size,size);ctx.restore();
}
let cadente: Cadente | null=null; let proximaCadente=performance.now()+55000+Math.random()*65000;
function desenharCadente(t: number){
 if(reduzir.matches)return;
 if(!cadente){if(t<proximaCadente)return;const ang=.32+Math.random()*.35;cadente={inicio:t,duracao:700+Math.random()*450,x:W*(.2+Math.random()*.55),y:H*(.04+Math.random()*.3),ang,dist:170+Math.random()*150}}
 const p=(t-cadente.inicio)/cadente.duracao;if(p>=1){cadente=null;proximaCadente=t+75000+Math.random()*105000;return}
 const c=cadente,x=c.x+Math.cos(c.ang)*c.dist*p,y=c.y+Math.sin(c.ang)*c.dist*p,len=55+Math.sin(p*Math.PI)*55,tx=x-Math.cos(c.ang)*len,ty=y-Math.sin(c.ang)*len,alpha=Math.sin(p*Math.PI)*.65;
 const g=fc.createLinearGradient(tx,ty,x,y);g.addColorStop(0,'rgba(215,229,255,0)');g.addColorStop(1,`rgba(238,245,255,${alpha})`);fc.save();fc.lineCap='round';fc.strokeStyle=g;fc.lineWidth=1.2;fc.beginPath();fc.moveTo(tx,ty);fc.lineTo(x,y);fc.stroke();fc.fillStyle=`rgba(246,250,255,${alpha})`;fc.shadowColor='#dceaff';fc.shadowBlur=5;fc.beginPath();fc.arc(x,y,1.2,0,Math.PI*2);fc.fill();fc.restore();
}
// Camada luminosa adicional: órbitas próprias + projeção da mesma câmera.
const luminosas=[
 {x:.69,y:.16,c:'255,181,102',r:2.5,d:.72,f:1},
 {x:.91,y:.24,c:'128,235,222',r:3,d:.9,f:3},
 {x:1.24,y:.27,c:'143,209,255',r:3.7,d:1.05,f:5},
 {x:.19,y:.65,c:'245,226,195',r:1.7,d:.5,f:7},
 {x:1.62,y:.12,c:'167,210,255',r:2.5,d:.68,f:9}
];
function pintarLuminosas(t:number,parar:boolean){
 const tempo=parar?0:t/1000;
 for(const e of luminosas){
  const x=projetarX(W*(e.x+Math.sin(tempo*.027+e.f)*.014),W,orientacaoAgora()+28,e.d);
  const y=H*(e.y+Math.cos(tempo*.033+e.f)*.012)-Math.min(scrollY,1800)*e.d*.025;
  if(x< -70||x>W+70)continue;
  const r=e.r*(W<700?.8:1),halo=r*10,brilho=parar?1:.88+Math.sin(tempo*.43+e.f)*.12;
  const g=ctx.createRadialGradient(x,y,0,x,y,halo);
  g.addColorStop(0,`rgba(${e.c},${.5*brilho})`);g.addColorStop(.22,`rgba(${e.c},${.22*brilho})`);g.addColorStop(1,`rgba(${e.c},0)`);
  ctx.fillStyle=g;ctx.fillRect(x-halo,y-halo,halo*2,halo*2);
  ctx.save();ctx.shadowColor=`rgb(${e.c})`;ctx.shadowBlur=11;ctx.fillStyle=`rgba(${e.c},${brilho})`;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle=`rgba(255,255,255,${brilho})`;ctx.beginPath();ctx.arc(x,y,r*.5,0,Math.PI*2);ctx.fill();ctx.restore();
 }
}
function pintar(t: number,forcar=false){if(!ctx||!fc)return;const parar=reduzir.matches,tempo=parar?0:t*.0001;
 if(forcar||t-ultimo>32){const dt=Math.min(.06,Math.max(0,(t-ultimo)/1000));ultimo=t;ctx.clearRect(0,0,W,H);if(!parar)atualizarEstrelas(dt,t);
 for(let i=0;i<estrelas.length;i++){const e=estrelas[i],v=aparente(e,i),d=Math.hypot(v.x-mouse.x,v.y-mouse.y),perto=Math.max(0,1-d/110);ctx.font=(e.brilho>.36?11:9)+'px Consolas,monospace';ctx.fillStyle=`rgba(215,228,248,${e.brilho+perto*.25+Math.sin((parar?0:t)*.0005+e.fase)*.035})`;ctx.fillText(e.brilho>.36?'+':'.',v.x,v.y)}
 pintarLuminosas(t,parar);

  pintarLua(t,forcar);
 }
 fc.clearRect(0,0,W,H);if(!parar)desenharCadente(t);
}

 function ajustar() {
  const oldW=W,oldH=H; W=innerWidth; H=innerHeight;
  for(const e of estrelas){e.x*=W/oldW;e.y*=H/oldH;}
  const dpr=Math.min(devicePixelRatio||1,2);
  for(const canvas of [fundo,efeitos]){canvas.width=W*dpr;canvas.height=H*dpr;contexto(canvas).setTransform(dpr,0,0,dpr,0,0);}
  ultimoDesenhoLua=-9999;pintar(performance.now(),true);
 }
 function loop(t:number){pintar(t);frame=requestAnimationFrame(loop);}
 function reiniciar(){
  cancelAnimationFrame(frame);ultimo=performance.now();
  tempoPausaLua=reduzir.matches?Date.now():null;
  if(document.hidden)return;
  if(reduzir.matches){cadente=null;pintar(performance.now(),true);}else frame=requestAnimationFrame(loop);
 }
 const options={signal:eventos.signal,passive:true};
 window.addEventListener('resize',ajustar,options);
 window.addEventListener('observatorio:giro',()=>{if(reduzir.matches)pintar(performance.now(),true);},options);
 window.addEventListener('scroll',()=>{if(reduzir.matches)pintar(performance.now(),true);},options);
 window.addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;if(reduzir.matches)pintar(performance.now(),true);},options);
 document.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-9999;},options);
 document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('planetario-pausado',document.hidden);if(!document.hidden){cadente=null;proximaCadente=performance.now()+55000+Math.random()*65000;}reiniciar();},options);
 reduzir.addEventListener('change',reiniciar,options);
 ajustar();reiniciar();
 return ()=>{cancelAnimationFrame(frame);eventos.abort();document.body.classList.remove('planetario-pausado');};
}
