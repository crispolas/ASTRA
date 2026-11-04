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
function atualizarEstrelas(dt: number,t: number){
 const proximas=estrelas.map(e=>({x:e.x,y:e.y,vx:e.vx,vy:e.vy}));
 for(let i=0;i<estrelas.length;i++){const e=estrelas[i];e.angulo+=Math.sin(t*.00016+e.fase)*dt*.16;
  let ax=0,ay=0,alx=0,aly=0,n=0;
  for(let j=0;j<proximas.length;j++){if(i===j)continue;const o=proximas[j],dx=e.x-o.x,dy=e.y-o.y,d=Math.hypot(dx,dy);if(d<70&&d>0){alx+=o.vx;aly+=o.vy;n++;if(d<22){ax+=dx/d*(1-d/22)*.7;ay+=dy/d*(1-d/22)*.7}}}
  const tx=Math.cos(e.angulo)*e.vel,ty=Math.sin(e.angulo)*e.vel;e.vx+=(tx-e.vx)*dt*.22;e.vy+=(ty-e.vy)*dt*.22;
  if(n){ax+=(alx/n-e.vx)*.045;ay+=(aly/n-e.vy)*.045}
  const dx=e.x-mouse.x,dy=e.y-mouse.y,d=Math.hypot(dx,dy);if(d<120){const f=(1-d/120)**2;ax+=dx/(d||1)*f*7-dy/(d||1)*f*.8;ay+=dy/(d||1)*f*7+dx/(d||1)*f*.8}
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
function pintarLua(t: number,forcar: boolean){const epoch=(reduzir.matches)?(tempoPausaLua??Date.now()):Date.now(),p=posicaoLua(epoch,W,H);if(!p.visivel)return;
 if(forcar||t-ultimoDesenhoLua>80){ultimoDesenhoLua=t;desenharTexturaLua(epoch)}
 // Escala visual da revisão; fase, centro, profundidade e período continuam em orbita.ts.
 const larguraUtil=Math.max(1,Math.min(W-228,1384)-96);
 const diametroReferencia=W<=900?Math.min(168,W*.4):larguraUtil*.22;
 const escala=diametroReferencia*2.2/(2*Math.min(W*.34,H*.46));
 const size=p.diametro*escala/(340/384);ctx.save();ctx.shadowColor='#e1eaff';ctx.shadowBlur=4;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(lunar,p.x-size/2,p.y-size/2,size,size);ctx.restore();
}
let cadente: Cadente | null=null; let proximaCadente=performance.now()+55000+Math.random()*65000;
function desenharCadente(t: number){
 if(reduzir.matches)return;
 if(!cadente){if(t<proximaCadente)return;const ang=.32+Math.random()*.35;cadente={inicio:t,duracao:700+Math.random()*450,x:W*(.2+Math.random()*.55),y:H*(.04+Math.random()*.3),ang,dist:170+Math.random()*150}}
 const p=(t-cadente.inicio)/cadente.duracao;if(p>=1){cadente=null;proximaCadente=t+75000+Math.random()*105000;return}
 const c=cadente,x=c.x+Math.cos(c.ang)*c.dist*p,y=c.y+Math.sin(c.ang)*c.dist*p,len=55+Math.sin(p*Math.PI)*55,tx=x-Math.cos(c.ang)*len,ty=y-Math.sin(c.ang)*len,alpha=Math.sin(p*Math.PI)*.65;
 const g=fc.createLinearGradient(tx,ty,x,y);g.addColorStop(0,'rgba(215,229,255,0)');g.addColorStop(1,`rgba(238,245,255,${alpha})`);fc.save();fc.lineCap='round';fc.strokeStyle=g;fc.lineWidth=1.2;fc.beginPath();fc.moveTo(tx,ty);fc.lineTo(x,y);fc.stroke();fc.fillStyle=`rgba(246,250,255,${alpha})`;fc.shadowColor='#dceaff';fc.shadowBlur=5;fc.beginPath();fc.arc(x,y,1.2,0,Math.PI*2);fc.fill();fc.restore();
}
function pintar(t: number,forcar=false){if(!ctx||!fc)return;const parar=reduzir.matches,tempo=parar?0:t*.0001;
 if(forcar||t-ultimo>32){const dt=Math.min(.06,Math.max(0,(t-ultimo)/1000));ultimo=t;ctx.clearRect(0,0,W,H);if(!parar)atualizarEstrelas(dt,t);
 for(const e of estrelas){const d=Math.hypot(e.x-mouse.x,e.y-mouse.y),perto=Math.max(0,1-d/110);ctx.font=(e.brilho>.36?11:9)+'px Consolas,monospace';ctx.fillStyle=`rgba(215,228,248,${e.brilho+perto*.25})`;ctx.fillText(e.brilho>.36?'+':'.',e.x,e.y)}
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
 window.addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;if(reduzir.matches)pintar(performance.now(),true);},options);
 document.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-9999;},options);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){cadente=null;proximaCadente=performance.now()+55000+Math.random()*65000;}reiniciar();},options);
 reduzir.addEventListener('change',reiniciar,options);
 ajustar();reiniciar();
 return ()=>{cancelAnimationFrame(frame);eventos.abort();};
}
