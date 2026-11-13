import type { PageLoad } from './$types';
import type { Tarefa } from '../../tipos';
// A leitura começa no componente, permitindo skeleton e nova tentativa no cliente.
export const load:PageLoad=()=>({tarefas:[] as Tarefa[]});
