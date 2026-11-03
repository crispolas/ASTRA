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
