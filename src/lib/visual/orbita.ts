/** Referência fixa: a lua não reinicia ao navegar, remontar o céu ou recarregar. */
export const EPOCA_ORBITA = Date.UTC(2026, 0, 1);
export const PERIODO_ORBITA = 175_000;

/** A câmera gira dentro da órbita; a ocultação acontece atrás do observador,
 * quando o corpo já atravessou o limite lateral do seu campo de visão. */
export function posicaoLua(epoch: number, largura: number, altura: number, giro = 0) {
	const fase = (((epoch - EPOCA_ORBITA) % PERIODO_ORBITA + PERIODO_ORBITA) % PERIODO_ORBITA) / PERIODO_ORBITA * Math.PI * 2;
	const yaw = giro * Math.PI / 180;
	const x = Math.cos(fase), z = Math.sin(fase);
	const lateral = x * Math.cos(yaw) - z * Math.sin(yaw);
	const frente = x * Math.sin(yaw) + z * Math.cos(yaw);
	if (frente <= 0) return { visivel: false, fase, x: 0, y: 0, diametro: 0 };
	const diametro = Math.min(largura * .34, altura * .46) * 2 / (1.65 + frente * .55);
	const cx = largura / 2 + largura * .85 * lateral / frente;
	const cy = altura * .29 + altura * .10 * lateral / frente;
	const r = diametro / 2;
	return { visivel: cx + r > 0 && cx - r < largura && cy + r > 0 && cy - r < altura, fase, x: cx, y: cy, diametro };
}
