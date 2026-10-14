import { buscarTarefa } from '#lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const idParam = params.id;

  try {
    const tarefa = await buscarTarefa(idParam);

    if (!tarefa) {
      throw error(404, 'Tarefa não encontrada');
    }

    return {
      tarefa
    };
  } catch (err: any) {
    if (err && typeof err === 'object' && 'status' in err) {
      throw err;
    }
    throw error(404, 'Tarefa não encontrada');
  }
};