import type { PageLoad } from './$types';
import { API_URL } from '../../lib/configuracao';
import type { Tarefa } from '../../tipos';

export const load: PageLoad = async ({ fetch }) => {
	const resposta = await fetch(`${API_URL}/tarefas`);
	const tarefas: Tarefa[] = await resposta.json();

	return { tarefas };
};
