import type { Projeto, ProjetoComTarefas, Tarefa } from '../tipos';

const API_URL = 'http://localhost:3000';

async function buscarNaApi<T>(caminho: string): Promise<T> {
	const resposta = await fetch(`${API_URL}${caminho}`);

	if (!resposta.ok) {
		throw new Error(`Erro ao acessar a API: ${resposta.status} ${resposta.statusText}`);
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
