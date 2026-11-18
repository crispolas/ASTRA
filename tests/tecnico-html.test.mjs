import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {prepararNavegador} from './helpers/navegador.mjs';
const app=prepararNavegador();
test('HTML em português e títulos das telas existentes',async()=>{
 assert.match(readFileSync(new URL('../src/app.html',import.meta.url),'utf8'),/lang="pt-BR"/);
 for(const [path,titulo] of [['/','Tarefas · ASTRA'],['/projetos','Projetos · ASTRA'],['/quadro','Quadro · ASTRA'],['/tarefas/nova','Nova tarefa · ASTRA']]){
  await app.abrir(path);assert.equal(await app.page.title(),titulo);
 }
});
