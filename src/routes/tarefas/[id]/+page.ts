import { buscarTarefa, ErroApi } from '../../../lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  try {
    return { tarefa: await buscarTarefa(params.id), naoEncontrada: false };
  } catch (erro) {
    return { tarefa: null, naoEncontrada: erro instanceof ErroApi && erro.status === 404 };
  }
};
