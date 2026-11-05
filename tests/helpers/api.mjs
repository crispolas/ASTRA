import { createServer } from 'vite';

// $app/env/public é resolvido pelo SvelteKit, inclusive nos testes do módulo de API.
const server = await createServer({ mode: 'test', logLevel: 'silent', server: { middlewareMode: true } });
let api;
try {
	api = await server.ssrLoadModule('/src/lib/api.ts');
} finally {
	await server.close();
}

export const { buscarProjeto, buscarTarefa, listarProjetos, listarTarefas,
	criarTarefa, atualizarTarefa, criarProjeto, atualizarProjeto, excluirTarefa } = api;
