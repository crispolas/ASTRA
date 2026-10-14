import { buscarProjeto } from '../../../lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		return { projeto: await buscarProjeto(params.id) };
	} catch {
		return { projeto: null };
	}
};
