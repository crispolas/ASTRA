import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepararNavegador } from './helpers/navegador.mjs';
const app = prepararNavegador();

test('/tarefas/:id mostra "não encontrada" quando a API responde 404', async () => {
	app.simularApi(() => new Response(null, { status: 404, statusText: 'Not Found' }));
	await app.abrir('/tarefas/999');
	await app.page.getByRole('alert').filter({ hasText: 'Tarefa não encontrada' }).waitFor();
	assert.equal(await app.page.getByRole('link', { name: /Voltar/ }).count(), 1);
	assert.doesNotMatch(await app.page.locator('body').innerText(), /não foi possível carregar a tarefa/i);
});

test('/tarefas/:id avisa que a API está fora do ar quando a conexão falha', async () => {
	app.simularApi(() => { throw new TypeError('fetch failed'); });
	await app.abrir('/tarefas/1');
	await app.page.getByRole('alert').filter({ hasText: /não foi possível carregar a tarefa/i }).waitFor();
	assert.doesNotMatch(await app.page.locator('body').innerText(), /Tarefa não encontrada/);
});
