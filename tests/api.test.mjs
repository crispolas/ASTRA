import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { buscarProjeto, buscarTarefa, listarProjetos, listarTarefas } from '../src/lib/api.ts';

const fetchOriginal = globalThis.fetch;

afterEach(() => {
	globalThis.fetch = fetchOriginal;
});

test('listarTarefas consulta a coleção de tarefas e devolve seus dados', async () => {
	const tarefas = [
		{
			id: '1',
			projetoId: '1',
			titulo: 'Criar módulo da API',
			descricao: 'Disponibilizar operações de leitura',
			status: 'em-andamento',
			prioridade: 'alta',
			responsavel: 'Felipe',
			prazo: '2026-10-14'
		}
	];
	let urlConsultada;

	globalThis.fetch = async (url) => {
		urlConsultada = url;
		return Response.json(tarefas);
	};

	const resultado = await listarTarefas();

	assert.equal(urlConsultada, 'http://localhost:3000/tarefas');
	assert.deepEqual(resultado, tarefas);
});

test('buscarTarefa consulta a tarefa pelo id e devolve seus dados', async () => {
	const tarefa = {
		id: '42',
		projetoId: '3',
		titulo: 'Testar a API',
		descricao: 'Cobrir a busca individual',
		status: 'a-fazer',
		prioridade: 'media',
		responsavel: 'Felipe',
		prazo: '2026-10-14'
	};
	let urlConsultada;

	globalThis.fetch = async (url) => {
		urlConsultada = url;
		return Response.json(tarefa);
	};

	const resultado = await buscarTarefa('42');

	assert.equal(urlConsultada, 'http://localhost:3000/tarefas/42');
	assert.deepEqual(resultado, tarefa);
});

test('listarProjetos consulta a coleção de projetos e devolve seus dados', async () => {
	const projetos = [
		{
			id: '1',
			nome: 'ASTRA',
			descricao: 'Gerenciador de tarefas acadêmicas',
			disciplina: 'Desenvolvimento Frontend',
			criadoEm: '2026-10-01'
		}
	];
	let urlConsultada;

	globalThis.fetch = async (url) => {
		urlConsultada = url;
		return Response.json(projetos);
	};

	const resultado = await listarProjetos();

	assert.equal(urlConsultada, 'http://localhost:3000/projetos');
	assert.deepEqual(resultado, projetos);
});

test('buscarProjeto inclui as tarefas relacionadas na consulta', async () => {
	const projetoComTarefas = {
		id: '7',
		nome: 'ASTRA',
		descricao: 'Gerenciador de tarefas acadêmicas',
		disciplina: 'Desenvolvimento Frontend',
		criadoEm: '2026-10-01',
		tarefas: [
			{
				id: '10',
				projetoId: '7',
				titulo: 'Criar módulo da API',
				descricao: 'Disponibilizar operações de leitura',
				status: 'em-andamento',
				prioridade: 'alta',
				responsavel: 'Felipe',
				prazo: '2026-10-14'
			}
		]
	};
	let urlConsultada;

	globalThis.fetch = async (url) => {
		urlConsultada = url;
		return Response.json(projetoComTarefas);
	};

	const resultado = await buscarProjeto('7');

	assert.equal(urlConsultada, 'http://localhost:3000/projetos/7?_embed=tarefas');
	assert.deepEqual(resultado, projetoComTarefas);
});

test('uma resposta sem sucesso gera um erro com o status da API', async () => {
	globalThis.fetch = async () =>
		new Response(null, { status: 503, statusText: 'Service Unavailable' });

	await assert.rejects(listarTarefas(), /503 Service Unavailable/);
});
