import type { PageLoad } from './$types';
import { API_URL } from '../../lib/configuracao';

export interface Projeto {
	id: string;
	nome: string;
	descricao?: string;
}

export const load: PageLoad = async ({ fetch }) => {
	try {
		const resposta = await fetch(`${API_URL}/projetos`);
		
		if (!resposta.ok) {
			return { projetos: [] };
		}

		const projetos: Projeto[] = await resposta.json();
		return { projetos };
	} catch (error) {

		return { projetos: [] };
	}
};
