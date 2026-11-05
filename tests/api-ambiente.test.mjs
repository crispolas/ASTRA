import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';

test('API, projetos e quadro usam a URL configurada, inclusive com barra final', async () => {
	const anterior = process.env.PUBLIC_API_URL;
	const fetchOriginal = globalThis.fetch;
	try {
		for (const url of ['http://localhost:4101', 'https://api.exemplo.invalid/astra/']) {
			process.env.PUBLIC_API_URL = url;
			const base = url.replace(/\/+$/, '');
			const server = await createServer({ mode: 'test', logLevel: 'silent', server: { middlewareMode: true } });
			try {
				const chamadas = [];
				const fetchSimulado = async (endereco, opcoes) => {
					chamadas.push([endereco, opcoes?.method ?? 'GET']);
					return opcoes?.method === 'DELETE' ? new Response(null, { status: 204 }) : Response.json([]);
				};
				globalThis.fetch = fetchSimulado;
				const api = await server.ssrLoadModule('/src/lib/api.ts');
				await api.listarTarefas();
				await api.buscarProjeto('7');
				await api.criarTarefa({ titulo: 'Teste' });
				await api.atualizarTarefa('a/b', { status: 'concluida' });
				await api.excluirTarefa('a/b');
				const projetos = await server.ssrLoadModule('/src/routes/projetos/+page.ts');
				const quadro = await server.ssrLoadModule('/src/routes/quadro/+page.ts');
				await projetos.load({ fetch: fetchSimulado });
				await quadro.load({ fetch: fetchSimulado });
				assert.deepEqual(chamadas, [
					[`${base}/tarefas`, 'GET'],
					[`${base}/projetos/7?_embed=tarefas`, 'GET'],
					[`${base}/tarefas`, 'POST'],
					[`${base}/tarefas/a%2Fb`, 'PATCH'],
					[`${base}/tarefas/a%2Fb`, 'DELETE'],
					[`${base}/projetos`, 'GET'],
					[`${base}/tarefas`, 'GET']
				]);
			} finally {
				await server.close();
			}
		}
	} finally {
		globalThis.fetch = fetchOriginal;
		if (anterior === undefined) delete process.env.PUBLIC_API_URL;
		else process.env.PUBLIC_API_URL = anterior;
	}
});
