import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepararNavegador } from './helpers/navegador.mjs';
const app = prepararNavegador();

test('/inicio oferece a lua como entrada sem mostrar o menu do gerenciador', async () => {
	const resposta = await app.abrir('/inicio');
	await app.page.getByRole('button', { name: 'Entrar no ASTRA' }).waitFor();
	assert.equal(resposta.status(), 200);
	assert.equal(await app.page.locator('#lunar').count(), 1);
	assert.equal(await app.page.locator('.astra-nav').count(), 0);
	assert.equal(await app.page.getByText('Prévia do gerenciador').count(), 0);
});

test('o gerenciador continua em / e oferece a marca para retornar à abertura', async () => {
	const resposta = await app.abrir('/');
	await app.page.getByRole('heading', { name: 'Tarefas', exact: true }).waitFor();
	assert.equal(resposta.status(), 200);
	assert.equal(await app.page.locator('[data-astra-brand]').getAttribute('href'), '/inicio');
	assert.equal(await app.page.getByRole('navigation', { name: 'Navegação principal', exact: true }).count(), 1);
	assert.equal(await app.page.getByRole('region', { name: 'Lista de tarefas' }).count(), 1);
	assert.equal(await app.page.locator('#lunar').count(), 0);
});
