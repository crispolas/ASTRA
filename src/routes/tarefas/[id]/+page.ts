import { buscarTarefa } from '../../../lib/api';
import db from '../../../../db.json';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const idParam = params.id;
    let tarefa = null;

    try {
        tarefa = await buscarTarefa(idParam);
    } catch (err) {
        console.warn('API não respondeu, usando fallback local db.json');
    }

    if (!tarefa && db.tarefas) {
        tarefa = db.tarefas.find((t) => String(t.id) === String(idParam));
    }

    if (!tarefa) {
        throw error(404, 'Tarefa não encontrada');
    }

    return {
        tarefa
    };
};