/** Fotosfera ASCII: granulação, manchas e iluminação lateral da referência visual. */
const manchas = [
 {lon:.22,lat:-.32,r:.115}, {lon:1.03,lat:.36,r:.12},
 {lon:-.38,lat:.46,r:.055}, {lon:-1.15,lat:-.12,r:.08},
 {lon:2.12,lat:.23,r:.10}, {lon:2.7,lat:-.38,r:.09},
 {lon:-2.3,lat:-.26,r:.12}, {lon:-2.9,lat:.42,r:.07}
].map(m=>({...m,x:Math.sin(m.lon)*Math.cos(m.lat),y:Math.sin(m.lat),z:Math.cos(m.lon)*Math.cos(m.lat)}));
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export function desenharFotosfera(ctx:CanvasRenderingContext2D,tempo:number){
 ctx.clearRect(0,0,512,512);
 ctx.font='7.6px "Courier New",monospace';ctx.textAlign='center';ctx.textBaseline='middle';
 const a=tempo*.012,co=Math.cos(a),si=Math.sin(a);
 for(let linha=2;linha<84;linha++)for(let coluna=2;coluna<84;coluna++){
  const px=coluna*6+1,py=linha*6+1,nx=(px-256)/238,ny=(py-256)/238,rr=nx*nx+ny*ny;
  if(rr>=1)continue;
  const nz=Math.sqrt(1-rr),rx=nx*co+nz*si,rz=nz*co-nx*si;
  const ruido=Math.sin(rx*67+ny*23+rz*13)*Math.cos(ny*59-rz*37+rx*11);
  const detalhe=Math.sin(rx*131-ny*97+rz*53)*Math.cos(ny*113+rz*71);
  const luz=Math.max(.025,-nx*.50-ny*.34+nz*.78);
  let valor=clamp(.24+luz*.60+ruido*.14+detalhe*.08);
  for(const m of manchas){
   const distancia=Math.sqrt(Math.max(0,2*(1-(rx*m.x+ny*m.y+rz*m.z))));
   const q=distancia/m.r;
   if(q<2)valor*=1-.94*Math.exp(-q*q*1.8);
  }
  // A borda se desfaz em pontuação, sem grade preenchida ou contorno sólido.
  const limbo=clamp((1-rr)/.10);
  const pool=limbo<.55?'.:+':valor>.77?'#@8%':valor>.57?'08%OX':valor>.37?'o0OxX':valor>.15?'xX+:':'.:';
  const variacao=clamp(.5+ruido*.3+detalhe*.2);
  const char=pool[Math.min(pool.length-1,Math.floor(variacao*pool.length))];
  if(valor<.12&&variacao<.65)continue;
  const verde=Math.round(91+valor*155),azul=Math.round(2+Math.pow(valor,2)*56);
  ctx.fillStyle=`rgba(255,${verde},${azul},${(.4+valor*.6)*Math.sqrt(limbo)})`;
  ctx.fillText(char,px,py);
 }
}
