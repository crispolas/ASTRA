import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepararNavegador } from './helpers/navegador.mjs';
const app = prepararNavegador();

const projeto = {
	id: '1',
	nome: 'Gerenciador de Tarefas',
	descricao: 'Projeto em equipe da disciplina',
	disciplina: 'Desenvolvimento Frontend',
	criadoEm: '2026-10-01'
};

const tarefa = {
	id: '7',
	projetoId: '1',
	titulo: 'Criar a página do projeto',
	descricao: 'Reaproveitar o cartão de tarefa',
	status: 'em-andamento',
	prioridade: 'alta',
	responsavel: 'Felipe',
	prazo: '2026-10-14'
};

test('/projetos/:id mostra os dados do projeto e um cartão por tarefa', async () => {
	app.simularApi(() => Response.json({ ...projeto, tarefas: [tarefa, { ...tarefa, id: '8', titulo: 'Segunda tarefa' }] }));
	const resposta = await app.abrir('/projetos/1');
	await app.page.getByRole('heading', { level: 1, name: 'Detalhes do projeto', exact: true }).waitFor();
	assert.equal(resposta.status(), 200);
	assert(app.requisicoes.some(url => new URL(url).pathname === '/projetos/1' && new URL(url).search === '?_embed=tarefas'));
	const texto = await app.page.locator('main').innerText();
	for (const valor of [projeto.nome, projeto.descricao, projeto.disciplina, '01/10/2026']) assert(texto.includes(valor), `A página deve mostrar ${valor}`);
	assert.equal(await app.page.locator('article.tarefa-card').count(), 2);
	assert.equal(await app.page.locator('a[href="/tarefas/7"]').count(), 1);
	assert(texto.includes('Segunda tarefa'));
	assert.equal(await app.page.locator('main a[href="/projetos"]').count(), 1);
});

test('/projetos/:id avisa quando o projeto não tem tarefas', async () => {
	app.simularApi(() => Response.json({ ...projeto, tarefas: [] }));
	await app.abrir('/projetos/1');
	await app.page.getByText('Este projeto ainda não tem tarefas.', { exact: true }).waitFor();
	assert.equal(await app.page.locator('article.tarefa-card').count(), 0);
});

test('/projetos/:id mostra "não encontrado" quando a API responde 404', async () => {
	app.simularApi(() => new Response(null, { status: 404, statusText: 'Not Found' }));
	const resposta = await app.abrir('/projetos/999');
	await app.page.getByRole('alert').filter({ hasText: 'Projeto não encontrado' }).waitFor();
	assert.equal(resposta.status(), 200);
	assert.equal(await app.page.getByRole('heading', { level: 1, name: 'Detalhes do projeto', exact: true }).count(), 1);
	assert.doesNotMatch(await app.page.locator('body').innerText(), /não foi possível carregar o projeto/i);
});

test('/projetos/:id avisa que a API está fora do ar quando a conexão falha', async () => {
	app.simularApi(() => { throw new TypeError('fetch failed'); });
	await app.abrir('/projetos/1');
	await app.page.getByRole('alert').filter({ hasText: /não foi possível carregar o projeto/i }).waitFor();
	assert.doesNotMatch(await app.page.locator('body').innerText(), /Projeto não encontrado/);
});
