import { goto } from '$app/navigation';

/** Detalhe, nova tarefa e edição abrem como janela por cima da tela de onde vieram. */
export function ehRotaDeJanela(caminho: string | undefined | null): boolean {
	return !!caminho && /^\/tarefas\/[^/]+(\/editar)?$/.test(caminho);
}

/**
 * Estado das janelas abertas.
 * - profundidade: quantas janelas foram abertas a partir da tela de origem (detalhe → editar = 2).
 *   Fechar ou salvar volta uma posição no histórico; com 0 (link aberto direto), usa o endereço de reserva.
 * - origem: a tela que fica por trás (lista, quadro ou projeto).
 * - titulo: aparece na janela enquanto ela carrega, para a resposta ao clique ser imediata.
 */
export const janela = $state({ profundidade: 0, origem: '/', titulo: '' });

/** Fecha a janela atual voltando para a tela anterior; sem histórico, vai para `reserva`. */
export function voltarDaJanela(reserva: string): Promise<void> {
	if (janela.profundidade > 0) {
		history.back();
		return new Promise((pronto) => addEventListener('popstate', () => pronto(), { once: true }));
	}
	return goto(reserva);
}
