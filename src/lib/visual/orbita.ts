/** Referência fixa: a lua não reinicia ao navegar, remontar o céu ou recarregar. */
export const EPOCA_ORBITA = Date.UTC(2026, 0, 1);
export const PERIODO_ORBITA = 175_000;

export function posicaoLua(epoch: number, largura: number, altura: number) {
	const fase = (((epoch - EPOCA_ORBITA) % PERIODO_ORBITA + PERIODO_ORBITA) % PERIODO_ORBITA) / PERIODO_ORBITA * Math.PI * 2;
	const z = Math.sin(fase), x = Math.cos(fase);
	if (z <= -.12) return { visivel: false, fase, x: 0, y: 0, diametro: 0 };
	const profundidade = 1.65 + z * .55;
	const diametro = Math.min(largura * .34, altura * .46) * 2 / profundidade;
	const cx = largura / 2 + x * largura * 1.425 / profundidade;
	const cy = altura * .29 + x * altura * .162 / profundidade;
	const r = diametro / 2;
	return { visivel: cx + r > 0 && cx - r < largura && cy + r > 0 && cy - r < altura, fase, x: cx, y: cy, diametro };
}
