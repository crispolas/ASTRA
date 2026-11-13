import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepararNavegador } from './helpers/navegador.mjs';
const app = prepararNavegador();
const base = { id:'42',projetoId:'1',titulo:'Documentar o componente',descricao:'Teste',status:'em-revisao',prioridade:'media',responsavel:'Equipe',prazo:'2026-11-13' };

test('o cartão oferece quatro status e indica o atual no menu arredondado', async () => {
	let tarefa = {...base}, pedidos = [];
	app.simularApi((url, req) => {
		if (req.method() === 'PATCH') { pedidos.push(req.postDataJSON()); tarefa = {...tarefa,...req.postDataJSON()}; return Response.json(tarefa); }
		return Response.json([tarefa]);
	});
	await app.abrir('/');
	const controle=app.page.getByRole('button',{name:'Status de Documentar o componente',exact:true});
	assert.match(await controle.innerText(),/Em revisão/);
	await controle.click();
	const menu=app.page.getByRole('listbox',{name:'Status de Documentar o componente'});
	assert.equal(await menu.getByRole('option').count(),4);
	assert.equal(await menu.getByRole('option',{name:'Em revisão',exact:true}).getAttribute('aria-selected'),'true');
	assert.equal(await menu.getByRole('option',{name:'A fazer',exact:true}).getAttribute('aria-selected'),'false');
	await menu.getByRole('option',{name:'Concluída',exact:true}).click();
	await app.page.waitForFunction(()=>document.querySelector('.tarefa-card .gatilho')?.textContent.includes('Concluída'));
	assert.deepEqual(pedidos,[{status:'concluida'}]);
});

test('falha ao mudar status mantém o valor anterior e libera o controle', async () => {
	app.simularApi((url,req)=>req.method()==='PATCH'?Response.json({}, {status:503}):Response.json([{...base}]));
	await app.abrir('/');
	const controle=app.page.getByRole('button',{name:'Status de Documentar o componente',exact:true});
	await controle.click();await app.page.getByRole('option',{name:'Concluída',exact:true}).click();
	await app.page.getByRole('alert').filter({hasText:'Não foi possível salvar o status'}).waitFor();
	assert.match(await controle.innerText(),/Em revisão/);assert.equal(await controle.isEnabled(),true);
});

test('ícone de exclusão mantém confirmação e só exclui ao confirmar', async () => {
	let removida=false,exclusoes=0;
	app.simularApi((url,req)=>{
		if(req.method()==='DELETE'){exclusoes++;removida=true;return new Response(null,{status:204});}
		return Response.json(removida?[]:[{...base}]);
	});
	await app.abrir('/');
	const excluir=app.page.getByRole('button',{name:'Excluir tarefa Documentar o componente',exact:true});
	assert.equal(await excluir.locator('svg').count(),1);
	app.page.once('dialog',d=>d.dismiss());await excluir.click();assert.equal(exclusoes,0);
	app.page.once('dialog',d=>d.accept());await excluir.click();await app.page.getByRole('status').filter({hasText:'Nenhuma tarefa cadastrada'}).waitFor();assert.equal(exclusoes,1);
});
