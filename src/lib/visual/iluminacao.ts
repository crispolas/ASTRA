export type FonteLuz = { x: number; y: number; cor: string; alcance: number; intensidade: number };
const superficies = new Set<HTMLElement>();
let ultimo = -Infinity;
const propriedades = ['--luz-x', '--luz-y', '--luz-cor', '--luz-alcance', '--luz-intensidade'];
function limpar(node: HTMLElement) { for (const prop of propriedades) node.style.removeProperty(prop); }
export function registrarSuperficie(node: HTMLElement) {
	superficies.add(node);
	return () => { superficies.delete(node); limpar(node); };
}
/** Luz calculada pela distância real ao cartão, sem um filtro global sobre a página. */
export function iluminarSuperficies(fontes: FonteLuz[], tempo: number, forcar = false) {
	if (!forcar && tempo - ultimo < 100) return;
	ultimo = tempo;
	for (const node of superficies) {
		const box = node.getBoundingClientRect();
		if (box.bottom < 0 || box.top > innerHeight) continue;
		let melhor: FonteLuz | undefined, forca = 0;
		for (const fonte of fontes) {
			const dx = Math.max(box.left - fonte.x, 0, fonte.x - box.right);
			const dy = Math.max(box.top - fonte.y, 0, fonte.y - box.bottom);
			const valor = Math.max(0, 1 - Math.hypot(dx, dy) / fonte.alcance) ** 2 * fonte.intensidade;
			if (valor > forca) { melhor = fonte; forca = valor; }
		}
		if (!melhor) { node.style.setProperty('--luz-intensidade', '0'); continue; }
		node.style.setProperty('--luz-x', `${melhor.x - box.left}px`);
		node.style.setProperty('--luz-y', `${melhor.y - box.top}px`);
		node.style.setProperty('--luz-cor', melhor.cor);
		node.style.setProperty('--luz-alcance', `${melhor.alcance}px`);
		node.style.setProperty('--luz-intensidade', String(Math.min(.55, forca)));
	}
}
