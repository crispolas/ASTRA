import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let server;
let baseUrl;
before(async () => {
	server = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 0 } });
	await server.listen();
	baseUrl = `http://127.0.0.1:${server.httpServer.address().port}`;
});
after(async () => { await server?.close(); });

test('/inicio oferece a lua como entrada sem mostrar o menu do gerenciador', async () => {
	const resposta = await fetch(`${baseUrl}/inicio`);
	const html = await resposta.text();
	assert.equal(resposta.status, 200);
	assert(html.includes('aria-label="Entrar no ASTRA"'));
	assert(html.includes('id="lunar"'));
	assert(!/<nav[^>]*class="[^"]*\bastra-nav\b/.test(html));
	assert(!html.includes('Prévia do gerenciador'));
});

test('o gerenciador continua em / e oferece a marca para retornar à abertura', async () => {
	const resposta = await fetch(`${baseUrl}/`);
	const html = await resposta.text();
	assert.equal(resposta.status, 200);
	assert(html.includes('data-astra-brand'));
	assert(html.includes('href="/inicio"'));
	assert(/<nav[^>]*class="[^"]*\bastra-nav\b/.test(html));
	assert(html.includes('Lista de tarefas'));
	assert(!html.includes('id="lunar"'));
});
