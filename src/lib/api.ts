import type { NovaTarefa, NovoProjeto, Projeto, ProjetoComTarefas, Tarefa } from '../tipos';

const API_URL = 'http://localhost:3000';

async function buscarNaApi<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
	const resposta = await fetch(`${API_URL}${caminho}`, opcoes);

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

export async function criarProjeto(dados: NovoProjeto): Promise<Projeto> {
	return enviarJson<Projeto>('/projetos', 'POST', dados);
}

export async function atualizarProjeto(id: string, dados: Partial<NovoProjeto>): Promise<Projeto> {
	return enviarJson<Projeto>(`/projetos/${encodeURIComponent(id)}`, 'PATCH', dados);
}
