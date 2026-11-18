import type { TransitionConfig } from 'svelte/transition';
import { duracaoMovimento } from './movimento';

/**
 * Par de transições para o cartão que troca de coluna no quadro.
 * Parecido com o crossfade do Svelte, mas o cartão faz um arco: levanta, atravessa as colunas e pousa.
 * `enviar` guarda onde o cartão estava; `receber` (adiada, como no crossfade) parte de lá até o lugar novo.
 */
export function criarViagem(semOrigem: (no: Element) => TransitionConfig) {
	const saidas = new Map<unknown, DOMRect>();
	function enviar(no: Element, { key }: { key: unknown }): TransitionConfig {
		saidas.set(key, no.getBoundingClientRect());
		// Some na hora: quem aparece é o cartão da coluna nova, viajando.
		return { duration: duracaoMovimento(1), css: () => 'opacity: 0' };
	}
	function receber(no: Element, { key }: { key: unknown }) {
		return () => {
			const de = saidas.get(key);
			saidas.delete(key);
			if (!de) return semOrigem(no);
			const para = no.getBoundingClientRect();
			const dx = de.left - para.left, dy = de.top - para.top;
			const lado = dx > 0 ? 1 : -1;
			return {
				duration: duracaoMovimento(820),
				css: (t: number) => {
					// ease-in-out com o pico do arco no meio do caminho
					const e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
					const arco = Math.sin(Math.PI * e);
					return `position: relative; z-index: 30;
						transform: translate(${dx * (1 - e)}px, ${dy * (1 - e) - arco * 46}px) scale(${1 + arco * .04}) rotate(${lado * arco * 1.5}deg);
						filter: drop-shadow(0 ${arco * 24}px ${arco * 25}px rgba(0, 0, 0, ${arco * .5}));`;
				}
			} satisfies TransitionConfig;
		};
	}
	return [enviar, receber] as const;
}
