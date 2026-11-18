import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepararNavegador } from './helpers/navegador.mjs';
const app = prepararNavegador();

test('formulário com seletores compartilhados preserva os sete campos do POST',async()=>{
 let enviado;
 app.simularApi((url,req)=>{
  if(req.method()==='POST'){enviado=req.postDataJSON();return Response.json({id:'99',...enviado},{status:201});}
  return Response.json(new URL(url).pathname==='/projetos'?[{id:'1',nome:'Projeto de teste'}]:[]);
 });
 await app.abrir('/tarefas/nova');
 await app.page.getByLabel('Título',{exact:true}).fill('Testar formulário');
 await app.page.getByRole('combobox',{name:/^Projeto /}).click();
 await app.page.getByRole('option',{name:'Projeto de teste',exact:true}).click();
 await app.page.getByRole('combobox',{name:/^Status /}).click();
 await app.page.getByRole('option',{name:'Em revisão',exact:true}).click();
 await app.page.getByRole('combobox',{name:/^Prioridade /}).click();
 await app.page.getByRole('option',{name:'Alta',exact:true}).click();
 await app.page.getByRole('button',{name:'Criar tarefa',exact:true}).click();
 await app.page.getByRole('heading',{name:'Tarefas',exact:true}).waitFor();
 assert.deepEqual(enviado,{projetoId:'1',titulo:'Testar formulário',descricao:'',status:'em-revisao',prioridade:'alta',responsavel:'',prazo:''});
});

test('alça interna move o cartão entre colunas e envia um único PATCH',async()=>{
 let tarefa={id:'42',projetoId:'1',titulo:'Mover cartão',descricao:'Teste de arraste',status:'a-fazer',prioridade:'media',responsavel:'Equipe',prazo:''};
 const pedidos=[];
 app.simularApi((url,req)=>{
  if(req.method()==='PATCH'){pedidos.push(req.postDataJSON());tarefa={...tarefa,...req.postDataJSON()};return Response.json(tarefa);}
  return Response.json([tarefa]);
 });
 await app.abrir('/quadro');
 const alca=app.page.locator('.drag-handle');
 await alca.hover();const origem=await alca.boundingBox();
 const destino=await app.page.locator('.coluna[data-status="em-revisao"]').boundingBox();
 await app.page.mouse.move(origem.x+22,origem.y+22);await app.page.mouse.down();
 await app.page.mouse.move(origem.x+35,origem.y+30,{steps:5});
 await app.page.mouse.move(destino.x+30,destino.y+60,{steps:12});
 await app.page.mouse.move(destino.x+35,destino.y+65,{steps:3});await app.page.mouse.up();
 await app.page.locator('.coluna[data-status="em-revisao"] .tarefa-card').waitFor();
 assert.deepEqual(pedidos,[{status:'em-revisao'}]);
 assert.equal(await app.page.locator('.coluna[data-status="a-fazer"] .tarefa-card').count(),0);
});

test('telas e menus cabem em 390px e 1440px, com tipografia e contraste dos contadores', async () => {
 for (const width of [390,1440]) {
  await app.page.setViewportSize({width,height:900});
  for (const path of ['/','/projetos','/quadro','/tarefas/nova','/inicio']) {
   await app.abrir(path);
   assert.equal(await app.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${path} em ${width}px`);
   if(path==='/quadro') {
    const cor=await app.page.locator('.contador').first().evaluate(el=>({color:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor}));
    assert.equal(cor.color,'rgb(17, 17, 17)');assert.equal(cor.bg,'rgb(226, 232, 240)');
   }
   if(path==='/tarefas/nova') {
    const status=app.page.getByRole('combobox',{name:/^Status /});
    await status.focus();await app.page.keyboard.press('Enter');
    assert.equal(await app.page.getByRole('option').count(),4);
    await app.page.keyboard.press('End');await app.page.keyboard.press('Enter');
    assert.match(await status.innerText(),/Concluída/);
    assert.equal(await app.page.locator('input[name=status]').inputValue(),'concluida');
    assert.equal(await status.evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=12),true);
    assert.equal(await app.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   }
  }
 }
});

test('onda sincroniza os cartões da linha; hover e movimento reduzido pausam a flutuação',async()=>{
 await app.page.emulateMedia({reducedMotion:'no-preference'});
 await app.page.setViewportSize({width:1440,height:1000});await app.abrir('/');
 await app.page.waitForTimeout(900);
 const ondas=await app.page.locator('.ov-grid .astra-orbita').evaluateAll(els=>els.map(el=>({
  top:el.parentElement.offsetTop,delay:parseFloat(el.style.animationDelay),duration:el.style.animationDuration,
  state:getComputedStyle(el).animationPlayState
 })));
 assert.ok(ondas.length>=3);
 assert.equal(ondas[0].top,ondas[1].top);
 assert.ok(Math.abs(ondas[0].delay-ondas[1].delay)<.08);
 assert.equal(ondas[0].duration,'12s');assert.equal(ondas[0].state,'running');
 const card=app.page.locator('.ov-grid .astra-orbita').first();
 await card.hover({force:true});
 assert.equal(await card.evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
 await app.page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await card.evaluate(el=>getComputedStyle(el).animationName),'none');
});

test('canvas suspende RAF oculto, fora da viewport e com movimento reduzido',async()=>{
 await app.page.addInitScript(()=>{
  const original=requestAnimationFrame;
  window.__frames=0;window.__callbacks={};
  window.requestAnimationFrame=cb=>original.call(window,t=>{window.__frames++;window.__callbacks[cb.name]=(window.__callbacks[cb.name]||0)+1;cb(t)});
 });
 await app.page.emulateMedia({reducedMotion:'no-preference'});
 for(const path of ['/','/inicio']) {
  await app.abrir(path);await app.page.waitForTimeout(900);
  const antes=await app.page.evaluate(()=>window.__frames);
  await app.page.waitForTimeout(150);
  assert.ok(await app.page.evaluate(()=>window.__frames)>antes);
  await app.page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await app.page.waitForTimeout(100);const oculto=await app.page.evaluate(()=>window.__frames);
  await app.page.waitForTimeout(150);assert.equal(await app.page.evaluate(()=>window.__frames),oculto);
  await app.page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await app.page.waitForTimeout(150);assert.ok(await app.page.evaluate(()=>window.__frames)>oculto);
  await app.page.evaluate(()=>{document.querySelectorAll('canvas').forEach(el=>el.style.display='none');if(location.pathname==='/inicio')document.querySelector('.entrada')?.setAttribute('style','display:none');});
  await app.page.waitForTimeout(200);const fora=await app.page.evaluate(()=>window.__frames);
  await app.page.waitForTimeout(150);assert.equal(await app.page.evaluate(()=>window.__frames),fora);
  await app.page.evaluate(()=>{document.querySelectorAll('canvas').forEach(el=>el.style.display='');document.querySelector('.entrada')?.removeAttribute('style');});
  await app.page.waitForTimeout(150);assert.ok(await app.page.evaluate(()=>window.__frames)>fora);
  await app.page.emulateMedia({reducedMotion:'reduce'});
  await app.page.waitForTimeout(150);const reduzido=await app.page.evaluate(()=>window.__frames);
  await app.page.waitForTimeout(150);assert.equal(await app.page.evaluate(()=>window.__frames),reduzido,JSON.stringify({path,callbacks:await app.page.evaluate(()=>window.__callbacks)}));
  await app.page.emulateMedia({reducedMotion:'no-preference'});
 }
});
