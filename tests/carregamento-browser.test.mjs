import assert from 'node:assert/strict';
import {test} from 'node:test';
import {prepararNavegador} from './helpers/navegador.mjs';
const app=prepararNavegador();
const tarefa={id:'1',projetoId:'1',titulo:'Tarefa carregada',descricao:'Teste',status:'a-fazer',prioridade:'alta',responsavel:'Equipe',prazo:'2026-11-13'};
for(const [rota,nome] of [['/','tarefas'],['/quadro','tarefas'],['/projetos','projetos']]){
 test(`${rota}: skeleton, aviso após 3s, quatro tentativas, erro final e nova tentativa`,async()=>{
  let chamadas=0,falhar=true;
  app.simularApi(()=>{chamadas++;return falhar?Response.json({},{status:503}):Response.json(nome==='projetos'?[{id:'1',nome:'Projeto carregado',descricao:'Teste'}]:[tarefa]);});
  await app.abrir(rota);
  await app.page.getByRole('status').filter({hasText:/Carregando/}).waitFor();
  assert.equal(await app.page.locator('.esqueleto').count(),rota==='/quadro'?4:6);
  await app.page.getByRole('status').filter({hasText:'Acordando o servidor'}).waitFor();
  await app.page.getByRole('alert').filter({hasText:'Não foi possível carregar'}).waitFor();
  assert.equal(chamadas,4);assert.doesNotMatch(await app.page.locator('body').innerText(),/API ligada|API está ligada/);
  falhar=false;await app.page.getByRole('button',{name:'Tentar novamente',exact:true}).click();
  await app.page.getByText(nome==='projetos'?'Projeto carregado':'Tarefa carregada',{exact:true}).waitFor();
  assert.equal(chamadas,5);assert.equal(await app.page.locator('.esqueleto').count(),0);
 });
}
test('o quadro diferencia nenhuma tarefa cadastrada de nenhum resultado da busca após carregar',async()=>{
 app.simularApi(()=>Response.json([]));await app.abrir('/quadro');
 await app.page.getByRole('status').filter({hasText:'Nenhuma tarefa cadastrada ainda.'}).waitFor();
 assert.doesNotMatch(await app.page.locator('body').innerText(),/Nenhuma tarefa encontrada com a busca/);
 app.simularApi(()=>Response.json([tarefa]));await app.abrir('/quadro');
 await app.page.getByText(tarefa.titulo,{exact:true}).waitFor();await app.page.locator('#busca-titulo').fill('título que não existe');
 await app.page.getByRole('status').filter({hasText:'Nenhuma tarefa encontrada com a busca e os filtros atuais.'}).waitFor();
 assert.doesNotMatch(await app.page.locator('body').innerText(),/Nenhuma tarefa cadastrada ainda/);
 await app.page.locator('#busca-titulo').fill('');await app.page.getByText(tarefa.titulo,{exact:true}).waitFor();
 assert.equal(await app.page.getByRole('status').filter({hasText:/Nenhuma tarefa/}).count(),0);
});
