import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';

const fetchOriginal = globalThis.fetch;
let server;
let baseUrl;

before(async () => {
	server = await createServer({
		logLevel: 'silent',
		server: { host: '127.0.0.1', port: 0 }
	});
	await server.listen();

	const address = server.httpServer?.address();
	assert(address && typeof address !== 'string');
	baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
	await server.close();
});

afterEach(() => {
	globalThis.fetch = fetchOriginal;
});

// A renderização no servidor roda neste processo: as chamadas à API simulada passam por aqui.
function simularApi(responder) {
	globalThis.fetch = async (url, init) =>
		String(url).startsWith('http://localhost:3000') ? responder(String(url)) : fetchOriginal(url, init);
}

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
	let urlConsultada;
	simularApi((url) => {
		urlConsultada = url;
		return Response.json({ ...projeto, tarefas: [tarefa, { ...tarefa, id: '8', titulo: 'Segunda tarefa' }] });
	});

	const response = await fetch(`${baseUrl}/projetos/1`);
	const html = await response.text();

	assert.equal(response.status, 200);
	assert.equal(urlConsultada, 'http://localhost:3000/projetos/1?_embed=tarefas');
	assert.match(html, /<h1(?:\s[^>]*)?>Detalhes do projeto<\/h1>/);
	for (const valor of [projeto.nome, projeto.descricao, projeto.disciplina, '01/10/2026']) {
		assert(html.includes(valor), `A página deve mostrar ${valor}`);
	}
	assert.equal(html.match(/<article[^>]*class="[^"]*\btarefa-card\b[^"]*"/g)?.length, 2);
	assert(html.includes('href="/tarefas/7"'));
	assert(html.includes('Segunda tarefa'));
	assert(html.includes('href="/projetos"'));
});

test('/projetos/:id avisa quando o projeto não tem tarefas', async () => {
	simularApi(() => Response.json({ ...projeto, tarefas: [] }));

	const html = await (await fetch(`${baseUrl}/projetos/1`)).text();

	assert(html.includes('Este projeto ainda não tem tarefas.'));
	assert(!/<article[^>]*class="[^"]*\btarefa-card\b[^"]*"/.test(html));
});

test('/projetos/:id mostra um aviso quando a API falha ou o projeto não existe', async () => {
	simularApi(() => new Response(null, { status: 404, statusText: 'Not Found' }));

	const response = await fetch(`${baseUrl}/projetos/999`);
	const html = await response.text();

	assert.equal(response.status, 200);
	assert.match(html, /<h1(?:\s[^>]*)?>Detalhes do projeto<\/h1>/);
	assert.match(html, /role="alert"/);
	assert.match(html, /não foi possível carregar o projeto/i);
});
