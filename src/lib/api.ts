import type { NovaTarefa, NovoProjeto, Projeto, ProjetoComTarefas, Tarefa } from '../tipos';

import { API_URL } from './configuracao';

// Guarda o status HTTP para as telas separarem "não encontrado" (404) de "API fora do ar".
export class ErroApi extends Error {
	status: number;

	constructor(resposta: Response) {
		super(`Erro ao acessar a API: ${resposta.status} ${resposta.statusText}`);
		this.status = resposta.status;
	}
}

async function buscarNaApi<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
	const resposta = await fetch(`${API_URL}${caminho}`, opcoes);

	if (!resposta.ok) {
		throw new ErroApi(resposta);
	}

	return resposta.json() as Promise<T>;
}

export async function listarTarefas(): Promise<Tarefa[]> {
	return buscarNaApi<Tarefa[]>('/tarefas');
}

export async function buscarTarefa(id: string): Promise<Tarefa> {
	return buscarNaApi<Tarefa>(`/tarefas/${id}`);
}

export async function listarProjetos(): Promise<Projeto[]> {
	return buscarNaApi<Projeto[]>('/projetos');
}

export async function buscarProjeto(id: string): Promise<ProjetoComTarefas> {
	return buscarNaApi<ProjetoComTarefas>(`/projetos/${id}?_embed=tarefas`);
}

function enviarJson<T>(caminho: string, metodo: 'POST' | 'PATCH', dados: unknown): Promise<T> {
	return buscarNaApi<T>(caminho, {
		method: metodo,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(dados)
	});
}

export async function criarTarefa(dados: NovaTarefa): Promise<Tarefa> {
	return enviarJson<Tarefa>('/tarefas', 'POST', dados);
}

export async function atualizarTarefa(id: string, dados: Partial<NovaTarefa>): Promise<Tarefa> {
	return enviarJson<Tarefa>(`/tarefas/${encodeURIComponent(id)}`, 'PATCH', dados);
}

export async function excluirTarefa(id: string): Promise<void> {
	const resposta = await fetch(`${API_URL}/tarefas/${encodeURIComponent(id)}`, { method: 'DELETE' });
	if (!resposta.ok) {
		throw new ErroApi(resposta);
	}
	// DELETE pode responder 204, sem corpo: não há JSON para converter.
}

export async function criarProjeto(dados: NovoProjeto): Promise<Projeto> {
	return enviarJson<Projeto>('/projetos', 'POST', dados);
}

export async function atualizarProjeto(id: string, dados: Partial<NovoProjeto>): Promise<Projeto> {
	return enviarJson<Projeto>(`/projetos/${encodeURIComponent(id)}`, 'PATCH', dados);
}
