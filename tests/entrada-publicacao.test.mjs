import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { prepararNavegador } from './helpers/navegador.mjs';
const app=prepararNavegador();

test('entrada do domínio vai para /inicio e o clique na Lua abre a lista sem redirecionar em loop',async()=>{
 const regras=readFileSync(new URL('../static/_redirects',import.meta.url),'utf8').trim().split('\n').map(l=>l.trim().split(/\s+/));
 assert.deepEqual(regras[0],['/','/inicio','302!']);
 assert.deepEqual(regras[1],['/*','/index.html','200']);
 // Simula a regra de hosting; o roteamento interno continua sendo do SvelteKit.
 await app.page.route('**/*',route=>{
  const req=route.request();
  if(req.isNavigationRequest()&&new URL(req.url()).pathname===regras[0][0])return route.fulfill({status:302,headers:{location:regras[0][1]}});
  return route.fallback();
 });
 await app.abrir('/');
 await app.page.getByRole('button',{name:'Entrar no ASTRA'}).waitFor();
 assert.equal(new URL(app.page.url()).pathname,'/inicio');
 await app.page.getByRole('button',{name:'Entrar no ASTRA'}).click();
 await app.page.getByRole('heading',{level:1,name:'Tarefas',exact:true}).waitFor();
 assert.equal(new URL(app.page.url()).pathname,'/');
});
