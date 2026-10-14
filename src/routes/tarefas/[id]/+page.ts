import db from '../../../../db.json';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const idParam = params.id;

    const tarefa = db.tarefas?.find((t) => String(t.id) === String(idParam));

    if (!tarefa) {
        throw error(404, 'Tarefa não encontrada');
    }

    return {
        tarefa
    };
};