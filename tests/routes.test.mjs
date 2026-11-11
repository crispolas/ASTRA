import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepararNavegador } from './helpers/navegador.mjs';
const app = prepararNavegador();

for (const [path, heading, subheading] of [
	['/', 'Tarefas', 'Página inicial'],
	['/projetos', 'Projetos', 'Lista de projetos']
]) {
	test(`${path} responde com o título e a identificação da página`, async () => {
		const resposta = await app.abrir(path);
		await app.page.getByRole('heading', { level: 1, name: heading, exact: true }).waitFor();
		assert.equal(resposta.status(), 200);
		assert.equal(await app.page.locator('.astra-eyebrow').textContent(), subheading);
	});
}

test('/tarefas/1 exibe os dados da tarefa e o link Voltar', async () => {
	const resposta = await app.abrir('/tarefas/1');
	await app.page.getByRole('heading', { level: 1, name: 'Criar o repositório', exact: true }).waitFor();
	assert.equal(resposta.status(), 200);
	assert.equal(await app.page.getByRole('link', { name: /Voltar/ }).count(), 1);
});

test('uma URL desconhecida mostra a página de erro personalizada', async () => {
	const resposta = await app.abrir('/pagina-inexistente');
	await app.page.getByRole('heading', { level: 1, name: 'Página não encontrada', exact: true }).waitFor();
	assert.equal(resposta.status(), 404);
	assert.equal(await app.page.getByRole('heading', { level: 2, name: 'Erro 404', exact: true }).count(), 1);
});
