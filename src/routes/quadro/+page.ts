import type { PageLoad } from './$types';
import type { Tarefa } from '../../tipos';

export const load: PageLoad = async ({ fetch }) => {
	const resposta = await fetch('http://localhost:3000/tarefas');
	const tarefas: Tarefa[] = await resposta.json();

	return { tarefas };
};