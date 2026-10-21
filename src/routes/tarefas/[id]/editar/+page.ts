import { buscarTarefa } from '../../../../lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		return { tarefa: await buscarTarefa(params.id) };
	} catch {
		throw error(404, 'Tarefa não encontrada');
	}
};
