/** Posição do Sol na tela, atualizada por ceu.ts a cada quadro em que ele é desenhado. */
export const posicaoSol = { x: 0, y: 0, r: 0, t: -Infinity };
/** O Sol só conta como "presente" se foi desenhado há pouco (o céu pausa fora de vista e com movimento reduzido). */
export const solPresente = (agora = performance.now()) => agora - posicaoSol.t < 400;

/** Prioridade funciona como massa: a alta é pesada e quase não se move; a baixa é puxada com mais força. */
export const massaPorPrioridade: Record<string, number> = { alta: .45, media: .8, baixa: 1.2 };

type Corpo = { suporte: HTMLElement; caixa: DOMRect; x: number; y: number; a: number; ultimo: string };
const corpos = new Map<HTMLElement, Corpo>();
const ponteiro = { x: -9999, y: -9999 };
let ultimaMedida = 0, ouvindo = false;

function aoMoverPonteiro(e: PointerEvent) { ponteiro.x = e.clientX; ponteiro.y = e.clientY; }
function aoSairPonteiro() { ponteiro.x = ponteiro.y = -9999; }
function ouvirPonteiro(ligar: boolean) {
	if (ligar === ouvindo || typeof window === 'undefined') return;
	ouvindo = ligar;
	if (ligar) { addEventListener('pointermove', aoMoverPonteiro, { passive: true }); document.addEventListener('pointerleave', aoSairPonteiro); }
	else { removeEventListener('pointermove', aoMoverPonteiro); document.removeEventListener('pointerleave', aoSairPonteiro); }
}

/** O cartão "pousa" quando o mouse chega a 28 px dele, para não ficar entrando e saindo de baixo do cursor. */
function pousado(c: Corpo) {
	const r = c.caixa;
	return c.suporte.matches(':focus-within') ||
		(ponteiro.x > r.left - 28 && ponteiro.x < r.right + 28 && ponteiro.y > r.top - 28 && ponteiro.y < r.bottom + 28);
}

/**
 * Um passo da gravidade. Roda dentro do laço do céu (ceu.ts), a 30 quadros por segundo:
 * assim pausa junto com ele quando a aba some, o céu sai de vista ou o movimento é reduzido.
 */
export function passoGravidade(t: number, parar: boolean) {
	if (!corpos.size) return;
	// Com uma janela aberta os cartões ficam escondidos atrás dela.
	if (!parar && document.querySelector('.rota-janela')) return;
	if (t - ultimaMedida > 300) {
		ultimaMedida = t;
		for (const c of corpos.values()) c.caixa = c.suporte.getBoundingClientRect();
	}
	const p = posicaoSol;
	for (const c of corpos.values()) {
		let tx = 0, ty = 0, ta = 0;
		if (!parar && !pousado(c)) {
			// Distância a partir da posição sem o puxão, para o cartão não "perseguir" a si mesmo.
			const cx = c.caixa.left + c.caixa.width / 2 - c.x, cy = c.caixa.top + c.caixa.height / 2 - c.y;
			const dx = p.x - cx, dy = p.y - cy, d = Math.max(p.r, Math.hypot(dx, dy));
			const prioridade = c.suporte.querySelector<HTMLElement>('[data-prioridade]')?.dataset.prioridade ?? 'media';
			const m = massaPorPrioridade[prioridade] ?? .8;
			const s = Math.pow(p.r / d, 1.15);
			const forca = Math.min(22, 70 * s * m);
			tx = dx / d * forca; ty = dy / d * forca;
			// Cartões largos inclinam menos.
			const limite = 2.4 * 320 / Math.max(320, c.caixa.width);
			ta = Math.max(-limite, Math.min(limite, (dx / d) * s * 6 * m));
		}
		const k = parar ? 1 : .06;
		c.x += (tx - c.x) * k; c.y += (ty - c.y) * k; c.a += (ta - c.a) * k;
		const valor = `${c.x.toFixed(1)}px ${c.y.toFixed(1)}px|${c.a.toFixed(2)}deg`;
		// Só escreve quando muda: cada escrita obriga o navegador a recalcular o estilo do cartão.
		if (valor === c.ultimo) continue;
		c.ultimo = valor;
		const [deslocamento, giro] = valor.split('|');
		c.suporte.style.translate = deslocamento;
		c.suporte.style.rotate = giro;
	}
}

/** Puxa o suporte do cartão (.astra-orbita) na direção do Sol. Usa `translate`/`rotate`, que somam com a flutuação. */
export function registrarGravidade(suporte: HTMLElement) {
	corpos.set(suporte, { suporte, caixa: suporte.getBoundingClientRect(), x: 0, y: 0, a: 0, ultimo: '' });
	ouvirPonteiro(true);
	return () => {
		corpos.delete(suporte);
		suporte.style.removeProperty('translate');
		suporte.style.removeProperty('rotate');
		if (!corpos.size) ouvirPonteiro(false);
	};
}
