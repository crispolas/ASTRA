export type FonteLuz = { x: number; y: number; cor: string; alcance: number; intensidade: number };
type Luz = { x: number; y: number; alcance: number; intensidade: number; cor: [number, number, number] };
type Estado = { alvo: Luz; atual: Luz | null; escrito: string };
const superficies = new Map<HTMLElement, Estado>();
let ultimo = -Infinity, anterior = 0;
const propriedades = ['--luz-x', '--luz-y', '--luz-cor', '--luz-alcance', '--luz-intensidade'];
function limpar(node: HTMLElement) { for (const prop of propriedades) node.style.removeProperty(prop); }
const apagada = (): Luz => ({ x: 0, y: 0, alcance: 280, intensidade: 0, cor: [255, 255, 255] });

export function registrarSuperficie(node: HTMLElement) {
	superficies.set(node, { alvo: apagada(), atual: null, escrito: '' });
	return () => { superficies.delete(node); limpar(node); };
}

/** Luz calculada pela distância real ao cartão, sem um filtro global sobre a página.
 * Chamada a cada quadro do céu: recalcula o alvo a cada 100 ms e, em todo quadro, leva a luz até ele,
 * para posição e cor não mudarem de uma vez. */
export function iluminarSuperficies(fontes: FonteLuz[], tempo: number, forcar = false) {
	if (forcar || tempo - ultimo >= 100) { ultimo = tempo; mirar(fontes); }
	suavizar(tempo, forcar);
}
function mirar(fontes: FonteLuz[]) {
	for (const [node, estado] of superficies) {
		const box = node.getBoundingClientRect();
		if (box.bottom < 0 || box.top > innerHeight) continue;
		let melhor: FonteLuz | undefined, forca = 0;
		for (const fonte of fontes) {
			const dx = Math.max(box.left - fonte.x, 0, fonte.x - box.right);
			const dy = Math.max(box.top - fonte.y, 0, fonte.y - box.bottom);
			const valor = Math.max(0, 1 - Math.hypot(dx, dy) / fonte.alcance) ** 2 * fonte.intensidade;
			if (valor > forca) { melhor = fonte; forca = valor; }
		}
		if (!melhor) { estado.alvo.intensidade = 0; continue; }
		const [r, g, b] = melhor.cor.split(/\s+/).map(Number);
		estado.alvo = { x: melhor.x - box.left, y: melhor.y - box.top, alcance: melhor.alcance, intensidade: Math.min(.55, forca), cor: [r, g, b] };
	}
}

function suavizar(t: number, imediato: boolean) {
	const dt = Math.min(64, Math.max(0, t - anterior)); anterior = t;
	// Constante de tempo de ~240 ms: uma troca de fonte leva cerca de meio segundo e não pisca.
	const k = imediato ? 1 : 1 - Math.exp(-dt / 240);
	for (const [node, estado] of superficies) {
		const alvo = estado.alvo;
		const atual = estado.atual ??= { ...alvo, intensidade: 0, cor: [...alvo.cor] as Luz['cor'] };
		atual.x += (alvo.x - atual.x) * k; atual.y += (alvo.y - atual.y) * k;
		atual.alcance += (alvo.alcance - atual.alcance) * k;
		atual.intensidade += (alvo.intensidade - atual.intensidade) * k;
		for (let i = 0; i < 3; i++) atual.cor[i] += (alvo.cor[i] - atual.cor[i]) * k * .7;
		const valores = [`${Math.round(atual.x)}px`, `${Math.round(atual.y)}px`, atual.cor.map(Math.round).join(' '), `${Math.round(atual.alcance)}px`, atual.intensidade.toFixed(2)];
		const chave = valores.join('|');
		// Só escreve quando muda: cada escrita obriga o navegador a recalcular o cartão.
		if (chave === estado.escrito) continue;
		estado.escrito = chave;
		propriedades.forEach((prop, i) => node.style.setProperty(prop, valores[i]));
	}
}
