import { caminhosConstelacao as letterPaths } from './constelacao';

type Ponto = { x: number; y: number };
type NoConstelacao = Ponto & { letter: number };
type Particula = { node: NoConstelacao; sx: number; sy: number; bx: number; by: number; delay: number; duration: number; bend: number };
type Estrela = Ponto & {
  id: number; drawX?: number; drawY?: number; offsetX: number; offsetY: number;
  velocityX: number; velocityY: number; vx: number; vy: number; size: number;
  alpha: number; phase: number; glow: number; orbital: boolean; angle: number;
  radius: number; flatten: number; speed: number; tilt: number; tint: number; character: string;
};
function contexto(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const resultado=canvas.getContext('2d');
  if(!resultado)throw new Error('Canvas 2D não está disponível neste navegador.');
  return resultado;
}

/**
 * Monta o céu e a lua somente dentro da tela de abertura.
 * @param {HTMLElement} root
 * @param {() => Promise<void>} aoConcluir
 * @returns {() => void} Cancela frames, temporizadores e eventos ao sair da rota.
 */
export function iniciarEntrada(root: HTMLElement, aoConcluir: () => Promise<void>): () => void {
    const controller=new AbortController();
    let disposed=false, raf=0;
    const listen=<E extends Event>(target: EventTarget,event: string,handler: (e: E) => void,options: AddEventListenerOptions={})=>target.addEventListener(event,handler as EventListener,{...options,signal:controller.signal});
    // A animação é isolada nesta rota e devolve o controle ao SvelteKit no final.
    const sky = root.querySelector<HTMLCanvasElement>('#sky')!;
    const ctx = contexto(sky);
    const moon = root.querySelector<HTMLButtonElement>('#moon')!;
    const lunar = root.querySelector<HTMLCanvasElement>('#lunar')!;
    const lc = contexto(lunar);
    const pathLetters=[0,0,1,2,2,3,3,4,4];
    const constellationNodes: NoConstelacao[]=[];
    const nodeLookup=new Map<string, number>();
    const connections: [number, number][]=[];
    letterPaths.forEach((path,pi)=>{
      const indices=path.map(([x,y])=>{
        const key=x+','+y;
        if(!nodeLookup.has(key)){
          nodeLookup.set(key,constellationNodes.length);
          constellationNodes.push({x,y,letter:pathLetters[pi]});
        }
        return nodeLookup.get(key)!;
      });
      for(let i=1;i<indices.length;i++)connections.push([indices[i-1],indices[i]]);
    });
    const clamp=(n: number)=>Math.max(0,Math.min(1,n));
    const ease=(n: number)=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2;
    function targetPosition(node: Ponto){
      const w=Math.min(980,width*.9);
      return {x:(width-w)/2+node.x*w/1200,y:(height-w/4)/2+node.y*w/1200};
    }
    const burstDuration=650, returnStart=900;
    function burstPoint(x: number,y: number){
      const dx=x-orbitCenter.x,dy=y-orbitCenter.y;
      const distance=Math.hypot(dx,dy)||1;
      const push=Math.min(width,height)*.38+40;
      return {x:x+dx/distance*push,y:y+dy/distance*push};
    }
    function blastPulse(elapsed: number){
      if(reduced)return 0;
      if(elapsed<burstDuration)return 1-Math.pow(1-clamp(elapsed/burstDuration),3);
      if(elapsed<returnStart)return 1;
      return Math.exp(-(elapsed-returnStart)/650);
    }
    function prepareFormation(){
      selectedStars.clear();
      const order=[0,0,0,0,0];
      particles=constellationNodes.map((node,i)=>{
        const dest=targetPosition(node);
        const candidates=stars.filter(star=>!selectedStars.has(star.id));
        const point=(star: Estrela)=>({x:star.drawX??star.x,y:star.drawY??star.y});
        const visible=candidates.filter(star=>{const p=point(star);return p.x>10&&p.x<width-10&&p.y>10&&p.y<height-10&&Math.hypot(p.x-orbitCenter.x,p.y-orbitCenter.y)>moonRadius+12;});
        const pool=visible.length?visible:candidates;
        pool.sort((a,b)=>Math.hypot(point(a).x-dest.x,point(a).y-dest.y)-Math.hypot(point(b).x-dest.x,point(b).y-dest.y));
        const source=pool[0];selectedStars.add(source.id);
        const start=point(source),outward=burstPoint(start.x,start.y);
        return {node,sx:start.x/width,sy:start.y/height,bx:outward.x/width,by:outward.y/height,
          delay:node.letter*540+order[node.letter]++*38,
          duration:1350+(i%3)*100,bend:(i%2?1:-1)*(.06+(i%4)*.018)};
      });
      return returnStart+Math.max(...particles.map(p=>p.delay+p.duration))+500;
    }
    function particlePosition(p: Particula,elapsed: number){
      const sx=p.sx*width,sy=p.sy*height,bx=p.bx*width,by=p.by*height;
      if(!reduced&&elapsed<returnStart){
        const blast=1-Math.pow(1-clamp(elapsed/burstDuration),3);
        return {x:sx+(bx-sx)*blast,y:sy+(by-sy)*blast,progress:0,moving:elapsed<burstDuration};
      }
      const progress=reduced?1:clamp((elapsed-returnStart-p.delay)/p.duration);
      const e=ease(progress),target=targetPosition(p.node);
      const cx=(bx+target.x)/2+(target.y-by)*p.bend;
      const cy=(by+target.y)/2-(target.x-bx)*p.bend;
      return {x:(1-e)*(1-e)*bx+2*(1-e)*e*cx+e*e*target.x,
              y:(1-e)*(1-e)*by+2*(1-e)*e*cy+e*e*target.y,progress,
              moving:!reduced&&progress>0&&progress<1};
    }
    function drawGathering(elapsed: number){
      const positions=particles.map(p=>particlePosition(p,elapsed));
      ctx.lineWidth=1;
      for(const [ai,bi] of connections){
        const a=positions[ai],b=positions[bi];
        const arrival=returnStart+Math.max(particles[ai].delay+particles[ai].duration,particles[bi].delay+particles[bi].duration);
        const lineProgress=reduced?1:clamp((elapsed-arrival+80)/380);
        if(lineProgress<=0)continue;
        ctx.strokeStyle=`rgba(173,211,238,${.68*lineProgress})`;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x+(b.x-a.x)*lineProgress,a.y+(b.y-a.y)*lineProgress);ctx.stroke();
      }
      positions.forEach((point,i)=>{
        const p=particles[i];
        if(point.moving){
          const tail=particlePosition(p,elapsed-100);
          const gradient=ctx.createLinearGradient(tail.x,tail.y,point.x,point.y);
          gradient.addColorStop(0,'rgba(154,216,245,0)');gradient.addColorStop(1,'rgba(154,216,245,.45)');
          ctx.strokeStyle=gradient;ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(point.x,point.y);ctx.stroke();
        }
        ctx.shadowColor='#a9dfff';ctx.shadowBlur=point.progress>.85?14:7;
        ctx.fillStyle=`rgba(230,247,255,${.55+point.progress*.45})`;
        const finalRadius=(i%4===0?4.6:2.8)*Math.min(980,width*.9)/1200;
        ctx.beginPath();ctx.arc(point.x,point.y,1.1+point.progress*Math.max(.4,finalRadius-1.1),0,Math.PI*2);ctx.fill();
        if(point.progress>.9&&i%4===0){
          ctx.shadowBlur=0;ctx.strokeStyle='rgba(190,225,255,.35)';
          ctx.beginPath();ctx.moveTo(point.x-6,point.y);ctx.lineTo(point.x+6,point.y);ctx.moveTo(point.x,point.y-6);ctx.lineTo(point.x,point.y+6);ctx.stroke();
        }
      });
      ctx.shadowBlur=0;
    }
    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;
    listen(motionQuery,'change', (e: MediaQueryListEvent) => { reduced = e.matches; });
    let width = 0, height = 0;
    let stars: Estrela[] = [];
    const pointer = { x:-9999, y:-9999 };
    let hovered = false, focus = false, rotation = 0, scale = 1;
    let orbitCenter = { x:0, y:0 }, lastPaint = -1000;
    let lastTime = 0, previousMoon = '', entering = false;
    let stage = 'moon', formationStart = 0;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let particles: Particula[] = [];
    let selectedStars = new Set<number>();
    let moonRadius = 260;
    let seed = 4817;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    function resize() {
      width = innerWidth; height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      sky.width = Math.round(width*dpr); sky.height = Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count = Math.min(230, Math.max(140, Math.floor(width*height/6000)));
      stars = Array.from({length:count}, (_,id) => ({
        id, offsetX:0,offsetY:0,velocityX:0,velocityY:0,
        x:random()*width, y:random()*height, vx:(random()-.5)*9, vy:(random()-.5)*5,
        size:random(), alpha:.25+random()*.40, phase:random()*Math.PI*2, glow:0,
        orbital:random()<.75, angle:random()*Math.PI*2,
        radius:Math.min(width,height)*(.24+random()*.8),
        flatten:.32+random()*.38, speed:(.035+random()*.065)*(random()>.15?1:-1),
        tilt:-.35, tint:random(), character:random()>.55?'+':'.'
      }));
    }
    function measureMoon() {
      const r=moon.getBoundingClientRect();
      orbitCenter={x:r.left+r.width/2,y:r.top+r.height/2};
      moonRadius=Math.min(r.width,r.height)*.44;
    }
    listen(window,'resize',()=>{resize();measureMoon();});
    listen(window,'scroll',measureMoon,{passive:true});
    resize();measureMoon();
    listen(window,'pointermove', (e: PointerEvent) => { pointer.x=e.clientX; pointer.y=e.clientY; });
    listen(document,'pointerleave', () => { pointer.x=-9999;pointer.y=-9999; });
    listen(moon,'pointerenter', () => { hovered=true; });
    listen(moon,'pointerleave', () => { hovered=false; });
    listen(moon,'focus', () => { focus=true; });
    listen(moon,'blur', () => { focus=false; });
    const craters=Array.from({length:26},()=>{
      const lon=(random()-.5)*Math.PI*1.8, lat=(random()-.5)*Math.PI*.9;
      return {x:Math.sin(lon)*Math.cos(lat),y:Math.sin(lat),z:Math.cos(lon)*Math.cos(lat),radius:.05+random()*.15};
    });
    const glyphs='.:;+=xoXO%8#@';
    function drawMoon(ax: number,ay: number) {
      const resolution=lunar.width/384;
      lc.setTransform(resolution,0,0,resolution,0,0);
      lc.clearRect(0,0,384,384);
      const cell=6, center=192, radius=170;
      lc.font="bold 7.2px \"Courier New\", monospace";
      lc.textAlign="center";lc.textBaseline="middle";
      const cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax);
      for(let gy=3;gy<61;gy++)for(let gx=3;gx<61;gx++) {
        const nx=(gx*cell+3-center)/radius,ny=(gy*cell+3-center)/radius;
        const rr=nx*nx+ny*ny;if(rr>=1)continue;
        const nz=Math.sqrt(1-rr);
        const rx=nx*cy+nz*sy, rz=-nx*sy+nz*cy;
        const ry=ny*cx-rz*sx, tz=ny*sx+rz*cx;
        const u=Math.floor((Math.atan2(rx,tz)+Math.PI)*27),v=Math.floor((Math.asin(ry)+Math.PI/2)*27);
        const noise=((Math.sin(u*127.1+v*311.7)*43758.5453)%1+1)%1;
        let terrain=0;
        for(const c of craters){
          const dist=Math.sqrt(Math.max(0,2*(1-(rx*c.x+ry*c.y+tz*c.z))));
          if(dist<c.radius)terrain-=.25*(1-dist/c.radius);
          else if(dist<c.radius*1.25)terrain+=.12;
        }
        const mare=Math.sin(rx*7+ry*3)*Math.cos(ry*6+tz*3)*.11;
        const light=Math.max(.04,-nx*.52-ny*.28+nz*.81);
        const value=Math.max(0,Math.min(1,light*.72+terrain+mare+(noise-.5)*.21));
        const tone=.20+Math.pow(Math.max(0,Math.min(1,value*1.3)),.72)*.8;
        const texture=(noise-.5)*.17;
        const char=glyphs[Math.min(glyphs.length-1,Math.max(0,Math.floor((tone+texture)*(glyphs.length-1))))];
        // As células discretas dão estrutura; os caracteres claros desenham a lua.
        const high=[244,245,247];
        lc.fillStyle=`rgba(${high.join(',')},${.035+tone*.055})`;
        lc.fillRect(gx*cell,gy*cell,5.3,5.3);
        const strength=.35+tone*.65;
        const [r,g,b]=high.map(channel=>Math.round(channel*strength));
        lc.fillStyle=`rgba(${r},${g},${b},${.57+tone*.43})`;
        lc.fillText(char,gx*cell+3,gy*cell+3);


      }
    }
    function frame(time: number) {
      if(disposed)return;
      if(time-lastPaint<1000/30){raf=requestAnimationFrame(frame);return;}
      const dt=Math.min((time-lastTime)/1000||0,.05);lastTime=time;lastPaint=time;
      ctx.clearRect(0,0,width,height);
      for(const s of stars){
        if(entering&&selectedStars.has(s.id))continue;
        if(!reduced) {
          if(s.orbital) s.angle+=s.speed*dt;
          else {s.x=(s.x+s.vx*dt+width)%width;s.y=(s.y+s.vy*dt+height)%height;}
        }
        if(s.orbital) {
          const ox=Math.cos(s.angle)*s.radius,oy=Math.sin(s.angle)*s.radius*s.flatten;
          s.x=orbitCenter.x+ox*Math.cos(s.tilt)-oy*Math.sin(s.tilt);
          s.y=orbitCenter.y+ox*Math.sin(s.tilt)+oy*Math.cos(s.tilt);
        }
        // Desvio elástico: o cursor afasta as estrelas sem destruir suas órbitas.
        const dx=s.x+s.offsetX-pointer.x,dy=s.y+s.offsetY-pointer.y;
        const separation=Math.hypot(dx,dy);
        if(!reduced){
          const force=entering?0:Math.pow(Math.max(0,1-separation/155),2)*900;
          const ux=separation>.5?dx/separation:Math.cos(s.phase);
          const uy=separation>.5?dy/separation:Math.sin(s.phase);
          s.velocityX+=(ux*force-s.offsetX*14-s.velocityX*6)*dt;
          s.velocityY+=(uy*force-s.offsetY*14-s.velocityY*6)*dt;
          s.offsetX+=s.velocityX*dt;s.offsetY+=s.velocityY*dt;
          const length=Math.hypot(s.offsetX,s.offsetY);
          if(length>65){s.offsetX*=65/length;s.offsetY*=65/length;}
        } else {s.offsetX=0;s.offsetY=0;s.velocityX=0;s.velocityY=0;}
        s.drawX=s.x+s.offsetX;s.drawY=s.y+s.offsetY;
        const distance=Math.hypot(s.drawX-pointer.x,s.drawY-pointer.y);
        const target=Math.max(0,1-distance/145);
        s.glow+=(target-s.glow)*(reduced?1:.18);
        const twinkle=reduced?0:Math.sin(time*.001+s.phase)*.055;
        const depth=s.orbital? .7+.3*(Math.sin(s.angle)+1)/2:1;
        const alpha=Math.min(1,Math.max(.05,(s.alpha+twinkle+s.glow*.85)*depth));
                let viewX=s.drawX,viewY=s.drawY;
        if(entering){
          const blast=blastPulse(time-formationStart);
          const pushed=burstPoint(viewX,viewY);
          viewX+=(pushed.x-viewX)*blast;viewY+=(pushed.y-viewY)*blast;
        }
        const x=Math.round(viewX),y=Math.round(viewY);
        const rgb=s.tint>.7?'183,174,224':'165,212,220';
        ctx.font=`${s.size>.84?12:10}px "Courier New",monospace`;
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillStyle=`rgba(${rgb},${alpha})`;
        const behindMoon=!entering&&Math.hypot(s.drawX-orbitCenter.x,s.drawY-orbitCenter.y)<moonRadius;
        if(behindMoon)continue;
        if(s.size>.94) {
          // Estrela maior formada apenas por caracteres ASCII.
          ctx.font='8px "Courier New",monospace';
          ctx.fillText('|',x,y-7);ctx.fillText('-*-',x,y);ctx.fillText('|',x,y+7);
        } else ctx.fillText(s.size>.7?'*':s.character,x,y);
        if(s.glow>.12){
          ctx.shadowColor=`rgba(${rgb},.9)`;ctx.shadowBlur=s.glow*12;
          ctx.fillStyle=`rgba(223,245,255,${s.glow})`;ctx.fillText('*',x,y);ctx.shadowBlur=0;
        }
      }
      const active=hovered||focus;
      const easing=reduced?1:Math.min(1,dt*7);
      if(!reduced&&!entering)rotation=(rotation+dt*.22)%(Math.PI*2);
      scale+=((active?1.085:1)-scale)*easing;
      moon.style.transform=`scale(${scale})`;
      const key=rotation.toFixed(4);
      if(key!==previousMoon){drawMoon(-.08,rotation);previousMoon=key;}
      if(stage==='gathering'||stage==='holding')drawGathering(time-formationStart);
      raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);
    function later(action: () => void | Promise<void>,delay: number){timers.push(setTimeout(action,delay));}
    listen(moon,'click',()=>{
      if(entering||disposed)return;
      reduced=motionQuery.matches;
      const duration=reduced?0:prepareFormation();
      if(reduced)prepareFormation();
      formationStart=performance.now();entering=true;stage='gathering';moon.disabled=true;
      root.classList.add('entering','gathering');
      later(()=>{
        stage='holding';root.classList.remove('gathering');root.classList.add('holding');
      },duration);
      later(async()=>{
        stage='handoff';
        try { await aoConcluir(); }
        catch { if(!disposed)reset(); }
      },reduced?80:duration+1400);
    });
    function reset(){
      timers.forEach(clearTimeout);timers=[];selectedStars.clear();particles=[];
      root.classList.remove('entering','gathering','holding');
      moon.disabled=false;entering=false;stage='moon';hovered=false;
      measureMoon();moon.focus({preventScroll:true});
    }
    listen(window,'keydown',(e: KeyboardEvent)=>{
      if(e.key==='Escape'&&(stage==='gathering'||stage==='holding'))reset();
    });
    return () => {
      disposed=true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      controller.abort();
    };
}
