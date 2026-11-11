import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepararNavegador } from './helpers/navegador.mjs';
const app = prepararNavegador();

test('menus arredondados combinam filtros e mantêm escolhas entre lista e quadro', async () => {
	const tarefa = { id: '1', projetoId: '1', titulo: 'Criar o repositório', descricao: 'Teste de filtros', status: 'em-andamento', prioridade: 'alta', responsavel: 'Equipe', prazo: '2026-11-11' };
	app.simularApi(() => Response.json([
		tarefa,
		{ ...tarefa, id: '2', titulo: 'Outra tarefa', prioridade: 'baixa' },
		{ ...tarefa, id: '3', titulo: 'Tarefa concluída', status: 'concluida' }
	]));
	await app.abrir('/');
	await app.page.locator('#filtro-status').click();
	const menu = app.page.getByRole('listbox', { name: 'Filtrar por status' });
	await menu.waitFor();
	assert.equal(await menu.evaluate(el => getComputedStyle(el).borderRadius), '22px');
	await menu.getByRole('option', { name: 'Em andamento', exact: true }).click();
	await app.page.locator('#filtro-prioridade').click();
	await app.page.getByRole('option', { name: 'Alta', exact: true }).click();
	await app.page.locator('#busca-titulo').fill('repositório');
	assert.equal(await app.page.locator('.tarefa-card').count(), 1);
	assert.match(await app.page.locator('.tarefa-card h3').innerText(), /Criar o repositório/);
	await app.page.getByRole('navigation', { name: 'Visualização de tarefas' }).getByRole('link', { name: 'Quadro', exact: true }).click();
	await app.page.getByRole('heading', { level: 1, name: 'Quadro de Tarefas', exact: true }).waitFor();
	assert.match(await app.page.locator('#filtro-status').innerText(), /Em andamento/);
	assert.match(await app.page.locator('#filtro-prioridade').innerText(), /Alta/);
	assert.equal(await app.page.locator('#busca-titulo').inputValue(), 'repositório');
	assert.equal(await app.page.locator('.tarefa-card').count(), 1);
});

test('menus permitem setas, Home/End, Enter, Escape, Tab e clique fora', async () => {
	await app.abrir('/');
	const prioridade = app.page.locator('#filtro-prioridade');
	await prioridade.focus(); await app.page.keyboard.press('ArrowDown');
	await app.page.getByRole('listbox').waitFor();
	await app.page.keyboard.press('End'); await app.page.keyboard.press('Enter');
	assert.match(await prioridade.innerText(), /Alta/);
	assert.equal(await app.page.getByRole('listbox').count(), 0);
	assert(await prioridade.evaluate(el => el === document.activeElement));
	await prioridade.click(); await app.page.keyboard.press('Home'); await app.page.keyboard.press('Escape');
	assert.match(await prioridade.innerText(), /Alta/);
	assert(await prioridade.evaluate(el => el === document.activeElement));
	await app.page.locator('#filtro-status').click(); await app.page.keyboard.press('Tab');
	assert.equal(await app.page.getByRole('listbox').count(), 0);
	await prioridade.click(); await app.page.locator('h1').click();
	assert.equal(await app.page.getByRole('listbox').count(), 0);
});
