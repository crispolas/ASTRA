import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';

const fetchOriginal = globalThis.fetch;
let server;
let baseUrl;

before(async () => {
	server = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 0 } });
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

test('/tarefas/:id mostra "não encontrada" quando a API responde 404', async () => {
	simularApi(() => new Response(null, { status: 404, statusText: 'Not Found' }));

	const html = await (await fetch(`${baseUrl}/tarefas/999`)).text();

	assert.match(html, /Voltar/);
	assert.match(html, /role="alert"/);
	assert.match(html, /Tarefa não encontrada/);
	assert.doesNotMatch(html, /não foi possível carregar a tarefa/i);
});

test('/tarefas/:id avisa que a API está fora do ar quando a conexão falha', async () => {
	simularApi(() => { throw new TypeError('fetch failed'); });

	const html = await (await fetch(`${baseUrl}/tarefas/1`)).text();

	assert.match(html, /role="alert"/);
	assert.match(html, /não foi possível carregar a tarefa/i);
	assert.doesNotMatch(html, /Tarefa não encontrada/);
});
