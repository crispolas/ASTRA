import type { PageLoad } from './$types';
import type { Projeto } from '../../tipos';
export const load:PageLoad=()=>({projetos:[] as Projeto[]});
