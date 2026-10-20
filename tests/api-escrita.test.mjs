import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { criarTarefa, atualizarTarefa, criarProjeto, atualizarProjeto } from '../src/lib/api.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

const tarefa = {
	projetoId: '1', titulo: 'Testar formulário', descricao: 'Exemplo',
	status: 'a-fazer', prioridade: 'media', responsavel: 'Crispim', prazo: '2026-10-21'
};
const projeto = { nome: 'ASTRA', descricao: 'Equipe', disciplina: 'Frontend', criadoEm: '2026-10-20' };

for (const [nome, executar, caminho, metodo, dados] of [
	['criarTarefa', () => criarTarefa(tarefa), '/tarefas', 'POST', tarefa],
	['atualizarTarefa', () => atualizarTarefa('a/b', { titulo: 'Editada' }), '/tarefas/a%2Fb', 'PATCH', { titulo: 'Editada' }],
	['criarProjeto', () => criarProjeto(projeto), '/projetos', 'POST', projeto],
	['atualizarProjeto', () => atualizarProjeto('2', { nome: 'Editado' }), '/projetos/2', 'PATCH', { nome: 'Editado' }]
]) {
	test(`${nome} envia JSON com método e endereço corretos e devolve a resposta`, async () => {
		const antes = structuredClone(dados);
		const salvo = { ...dados, id: '99' };
		globalThis.fetch = async (url, opcoes) => {
			assert.equal(url, `http://localhost:3000${caminho}`);
			assert.equal(opcoes.method, metodo);
			assert.equal(opcoes.headers['Content-Type'], 'application/json');
			assert.deepEqual(JSON.parse(opcoes.body), dados);
			return Response.json(salvo);
		};
		assert.deepEqual(await executar(), salvo);
		assert.deepEqual(dados, antes);
	});
}

test('as quatro funções de escrita rejeitam respostas HTTP sem sucesso', async () => {
	globalThis.fetch = async () => new Response(null, { status: 503, statusText: 'Service Unavailable' });
	for (const executar of [
		() => criarTarefa(tarefa), () => atualizarTarefa('1', { titulo: 'Outra' }),
		() => criarProjeto(projeto), () => atualizarProjeto('1', { nome: 'Outro' })
	]) {
		await assert.rejects(executar(), /503 Service Unavailable/);
	}
});

test('falha de rede é propagada para quem chamou a função', async () => {
	globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
	await assert.rejects(criarTarefa(tarefa), /Failed to fetch/);
});
