import { registrarSuperficie } from './iluminacao';
/** Ação Svelte compartilhada por cartões de tarefa e projeto. Não modifica dados. */
export function interacaoOrbital(node: HTMLElement, ativo = true) {
	const removerLuz = registrarSuperficie(node);
	const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
	const preciso = matchMedia('(hover: hover) and (pointer: fine)');
	const limpar = () => {
		for (const nome of ['--tx', '--ty', '--rx', '--ry', '--mx', '--my']) node.style.removeProperty(nome);
	};
	function mover(e: PointerEvent) {
		if (!ativo || reduzido.matches || !preciso.matches) return;
		const box = node.getBoundingClientRect();
		const x = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
		const y = Math.max(0, Math.min(1, (e.clientY - box.top) / box.height));
		node.style.setProperty('--mx', `${x * 100}%`);
		node.style.setProperty('--my', `${y * 100}%`);
		node.style.setProperty('--tx', `${(x - .5) * 5}px`);
		node.style.setProperty('--ty', `${(y - .5) * 4}px`);
		node.style.setProperty('--rx', `${(.5 - y) * 2.2}deg`);
		node.style.setProperty('--ry', `${(x - .5) * 1.7}deg`);
	}
	function configurar() {
        node.toggleAttribute('data-orbital', ativo); limpar();
        const suporte = node.closest<HTMLElement>('.astra-orbita');
        if (suporte) {
            const estilo = getComputedStyle(suporte);
            const periodo = parseFloat(estilo.animationDuration) || 10;
            const fase = [...(node.querySelector('h3')?.textContent ?? '')].reduce((a,c) => a + c.charCodeAt(0), 0) % 11;
            suporte.style.animationDelay = `-${(Date.now() / 1000 + fase) % periodo}s`;
        }
    }
	node.addEventListener('pointermove', mover, { passive: true });
	node.addEventListener('pointerleave', limpar);
	reduzido.addEventListener('change', limpar);
	configurar();
	return {
		update(valor: boolean) { ativo = valor; configurar(); },
		destroy() {
			node.removeEventListener('pointermove', mover);
			node.removeEventListener('pointerleave', limpar);
			reduzido.removeEventListener('change', limpar);
			node.removeAttribute('data-orbital'); limpar(); removerLuz();
		}
	};
}
