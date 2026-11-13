import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EPOCA_ORBITA, PERIODO_ORBITA, posicaoLua } from '../src/lib/visual/orbita.ts';

test('a lua mantém sua fase independente da montagem da página', () => {
 const instante=EPOCA_ORBITA+PERIODO_ORBITA*.21;
 assert.deepEqual(posicaoLua(instante,1440,1000),posicaoLua(instante+PERIODO_ORBITA,1440,1000));
 assert.deepEqual(posicaoLua(instante,1440,1000),posicaoLua(instante,1440,1000));
});
test('a órbita tem trechos fora da tela e passagem contínua sem salto de escala', () => {
 let visiveis=0,ocultas=0,anterior;
 for(let i=0;i<1000;i++){
  const p=posicaoLua(EPOCA_ORBITA+PERIODO_ORBITA*i/1000,1440,1000);
  if(p.visivel){visiveis++;assert(p.diametro>0);if(anterior?.visivel)assert(Math.abs(p.diametro-anterior.diametro)<3);}
  else ocultas++;
  anterior=p;
 }
 assert(visiveis>0 && ocultas>0);
});

test('em cada orientação a Lua entra e sai pelas bordas, sem aparecer no centro', () => {
 for(const giro of [0,28,56])for(const [w,h] of [[1600,1000],[390,844]]){
  let antes=posicaoLua(EPOCA_ORBITA-1,w,h,giro),entradas=0;
  for(let i=0;i<=2000;i++){
   const p=posicaoLua(EPOCA_ORBITA+PERIODO_ORBITA*i/2000,w,h,giro);
   if(p.visivel&&!antes.visivel){entradas++;assert(p.x<25||p.x>w-25,`entrada no meio: ${giro},${w},${p.x}`);}
   if(!p.visivel&&antes.visivel)assert(antes.x<25||antes.x>w-25,`saída no meio: ${giro},${w},${antes.x}`);
   antes=p;
  }
  assert.equal(entradas,1);
 }
});
