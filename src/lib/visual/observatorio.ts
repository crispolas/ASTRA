export type Setor = 'tarefas' | 'projetos' | 'quadro';
export const vistas = {
	tarefas: { angulo: -28, numero: '01', lua: true },
	projetos: { angulo: 0, numero: '02', lua: false },
	quadro: { angulo: 28, numero: '03', lua: false }
} as const;

export function setorDaRota(path: string): Setor {
	return path.startsWith('/projetos') ? 'projetos' : path === '/quadro' ? 'quadro' : 'tarefas';
}

// Um único relógio da câmera. As órbitas locais não dependem deste estado.
let origem = -28, destino = -28, inicio = 0, duracao = 0;
export function orientacaoAgora(agora = performance.now()): number {
	const p = duracao ? Math.max(0, Math.min(1, (agora - inicio) / duracao)) : 1;
	if (p === 1) return destino;
	const suave = p * p * (3 - 2 * p);
	return origem + (destino - origem) * suave;
}
export function orientar(setor: Setor, ms = 0) {
	origem = orientacaoAgora(); destino = vistas[setor].angulo;
	inicio = performance.now(); duracao = ms;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('observatorio:giro'));
}

/** Projeção de uma coordenada angular; objetos próximos atravessam mais a visão. */
export function projetarX(x: number, largura: number, giro: number, profundidade = 1) {
	const focal = largura * .85;
	const angulo = Math.atan((x - largura / 2) / focal) - giro * Math.PI / 180 * profundidade;
	return largura / 2 + Math.tan(angulo) * focal;
}
