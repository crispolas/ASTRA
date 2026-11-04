import { buscarProjeto, ErroApi } from '../../../lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		return { projeto: await buscarProjeto(params.id), naoEncontrado: false };
	} catch (erro) {
		return { projeto: null, naoEncontrado: erro instanceof ErroApi && erro.status === 404 };
	}
};
