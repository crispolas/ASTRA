import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { before, after, beforeEach, afterEach } from 'node:test';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const dados = JSON.parse(readFileSync(new URL('../../db.seed.json', import.meta.url), 'utf8'));

/** Cada teste recebe contexto e API simulada próprios; não depende de json-server. */
export function prepararNavegador() {
	let server, browser, context, page, baseUrl, responderApi;
	let erros = [];
	const requisicoes = [];
	before(async () => {
		server = await createServer({ mode: 'test', logLevel: 'silent', server: { host: '127.0.0.1', port: 0 } });
		await server.listen();
		baseUrl = `http://127.0.0.1:${server.httpServer.address().port}`;
		browser = await chromium.launch({ args: ['--no-sandbox'] });
	});
	after(async () => { await browser?.close(); await server?.close(); });
	beforeEach(async () => {
		erros = []; requisicoes.length = 0;
		responderApi = (url) => {
			const path = new URL(url).pathname;
			if (path === '/tarefas') return Response.json(dados.tarefas);
			if (path === '/projetos') return Response.json(dados.projetos);
			const tarefa = dados.tarefas.find(t => path === `/tarefas/${t.id}`);
			if (tarefa) return Response.json(tarefa);
			return Response.json({}, { status: 404 });
		};
		context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
		// Intercepta a URL configurada pelo mesmo SvelteKit usado pela aplicação.
		const { API_URL } = await server.ssrLoadModule('/src/lib/configuracao.ts');
		await context.route(`${API_URL}/**`, async (route) => {
			requisicoes.push(route.request().url());
			let resposta;
			try { resposta = await responderApi(route.request().url()); }
			catch { await route.abort('failed'); return; }
			await route.fulfill({ status: resposta.status, contentType: resposta.headers.get('content-type') ?? 'application/json', body: Buffer.from(await resposta.arrayBuffer()) });
		});
		page = await context.newPage();
		page.on('pageerror', erro => erros.push(erro.message));
	});
	afterEach(async () => {
		try { assert.deepEqual(erros, [], 'A página não deve gerar erros JavaScript'); }
		finally { await context?.close(); }
	});
	return {
		get page() { return page; },
		get requisicoes() { return requisicoes; },
		simularApi(responder) { responderApi = responder; },
		async abrir(path) { return page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' }); }
	};
}
