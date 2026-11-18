import assert from 'node:assert/strict';
import {test} from 'node:test';
import {lerComTentativas} from '../src/lib/leitura.ts';

test('leituras temporariamente indisponíveis têm quatro tentativas e backoff 2/4/8s',async()=>{
 const pausas=[];let chamadas=0;
 const resposta=await lerComTentativas('https://api.exemplo/tarefas',{fetcher:async()=>++chamadas<4?new Response(null,{status:503}):Response.json([]),esperar:async ms=>{pausas.push(ms)}});
 assert.equal(resposta.status,200);assert.equal(chamadas,4);assert.deepEqual(pausas,[2000,4000,8000]);
});
test('404 não é repetido e a falha final não é mascarada como sucesso',async()=>{
 let chamadas=0;
 const naoExiste=await lerComTentativas('https://api.exemplo/tarefas/999',{fetcher:async()=>{chamadas++;return new Response(null,{status:404})}});
 assert.equal(naoExiste.status,404);assert.equal(chamadas,1);
 await assert.rejects(lerComTentativas('https://api.exemplo',{fetcher:async()=>{throw new TypeError('offline')},esperar:async()=>{}}),/offline/);
});
