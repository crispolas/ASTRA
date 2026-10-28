import { writable } from 'svelte/store';
import type { Tarefa } from '../../tipos';

export const buscaTexto = writable('');
export const filtroStatus = writable('');
export const filtroPrioridade = writable('');

// Lista e quadro aplicam os mesmos critérios ao estado compartilhado.
export function aplicarFiltros(
	tarefas: readonly Tarefa[], busca: string, status: string, prioridade: string
): Tarefa[] {
	return tarefas.filter((tarefa) =>
		tarefa.titulo.toLowerCase().includes(busca.toLowerCase()) &&
		(!status || tarefa.status === status) &&
		(!prioridade || tarefa.prioridade === prioridade)
	);
}
