import type { PageLoad } from './$types';

export interface Projeto {
	id: string;
	nome: string;
	descricao?: string;
}

export const load: PageLoad = async ({ fetch }) => {
	try {
		const resposta = await fetch('http://localhost:3000/projetos');
		
		if (!resposta.ok) {
			return { projetos: [] };
		}

		const projetos: Projeto[] = await resposta.json();
		return { projetos };
	} catch (error) {

		return { projetos: [] };
	}
};