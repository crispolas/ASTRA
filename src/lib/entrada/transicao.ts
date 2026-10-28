import { writable } from 'svelte/store';

// A marca fica no layout para continuar visível durante a troca de rota.
export const transicaoEntrada = writable<'oculta' | 'centro' | 'canto'>('oculta');
