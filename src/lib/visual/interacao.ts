import { registrarSuperficie } from './iluminacao';
import { registrarGravidade } from './gravidade';

/** Ação Svelte compartilhada por cartões de tarefa e projeto. Não modifica dados. */
export function interacaoOrbital(node: HTMLElement, ativo = true) {
	const removerLuz = registrarSuperficie(node);
	let removerGravidade: (() => void) | undefined;
	const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
	const preciso = matchMedia('(hover: hover) and (pointer: fine)');
	const limpar = () => {
		for (const nome of ['--tx', '--ty', '--rx', '--ry', '--mx', '--my']) node.style.removeProperty(nome);
	};

	// Brilho que segue o mouse (--brilho, de 0 a 1): acende devagar onde o mouse entrou, acompanha com leve atraso
	// e, ao sair, fica onde estava e só esmaece. Antes ele voltava ao centro e piscava.
	const brilho = { v: 0, x: 50, y: 50, alvoX: 50, alvoY: 50, sobre: false, quadro: 0, antes: 0, escrito: '' };
	function escreverBrilho() {
		const chave = `${brilho.v.toFixed(2)}|${brilho.x.toFixed(1)}|${brilho.y.toFixed(1)}`;
		if (chave === brilho.escrito) return;
		brilho.escrito = chave;
		node.style.setProperty('--brilho', brilho.v.toFixed(2));
		node.style.setProperty('--brilho-x', `${brilho.x.toFixed(1)}%`);
		node.style.setProperty('--brilho-y', `${brilho.y.toFixed(1)}%`);
	}
	function animarBrilho(t: number) {
		brilho.quadro = 0;
		const dt = Math.min(64, t - brilho.antes); brilho.antes = t;
		const kp = 1 - Math.exp(-dt / 110), kb = 1 - Math.exp(-dt / (brilho.sobre ? 260 : 520));
		if (brilho.sobre) { brilho.x += (brilho.alvoX - brilho.x) * kp; brilho.y += (brilho.alvoY - brilho.y) * kp; }
		brilho.v += ((brilho.sobre ? 1 : 0) - brilho.v) * kb;
		const parado = Math.abs((brilho.sobre ? 1 : 0) - brilho.v) < .005 && Math.abs(brilho.alvoX - brilho.x) < .05 && Math.abs(brilho.alvoY - brilho.y) < .05;
		if (parado) { brilho.v = brilho.sobre ? 1 : 0; brilho.x = brilho.alvoX; brilho.y = brilho.alvoY; }
		escreverBrilho();
		// Só pede o próximo quadro enquanto ainda está mudando e a aba está visível.
		if (!parado && !document.hidden) brilho.quadro = requestAnimationFrame(animarBrilho);
	}
	function atualizarBrilho() {
		if (reduzido.matches || document.hidden) {
			cancelAnimationFrame(brilho.quadro); brilho.quadro = 0;
			brilho.v = brilho.sobre ? 1 : 0; brilho.x = brilho.alvoX; brilho.y = brilho.alvoY; escreverBrilho();
			return;
		}
		if (!brilho.quadro) { brilho.antes = performance.now(); brilho.quadro = requestAnimationFrame(animarBrilho); }
	}
	function posicaoNoCartao(e: PointerEvent) {
		const box = node.getBoundingClientRect();
		return { x: Math.max(0, Math.min(1, (e.clientX - box.left) / box.width)), y: Math.max(0, Math.min(1, (e.clientY - box.top) / box.height)) };
	}
	function entrar(e: PointerEvent) {
		if (!ativo || !preciso.matches) return;
		const { x, y } = posicaoNoCartao(e);
		brilho.alvoX = x * 100; brilho.alvoY = y * 100;
		// Na entrada o brilho nasce já na posição do mouse, em vez de vir do centro.
		if (brilho.v < .02) { brilho.x = brilho.alvoX; brilho.y = brilho.alvoY; }
		brilho.sobre = true; atualizarBrilho();
	}
	function sair() { limpar(); brilho.sobre = node.matches(':focus-within'); atualizarBrilho(); }
	function focar() { brilho.sobre = true; atualizarBrilho(); }
	function desfocar() { brilho.sobre = node.matches(':hover'); atualizarBrilho(); }

	function mover(e: PointerEvent) {
		if (!ativo || reduzido.matches || !preciso.matches) return;
		const { x, y } = posicaoNoCartao(e);
		brilho.alvoX = x * 100; brilho.alvoY = y * 100;
		if (!brilho.sobre) { brilho.sobre = true; }
		atualizarBrilho();
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
            const item = node.closest<HTMLElement>('.ov-grid > *, .lista-cards > *');
            const grupo = item?.parentElement;
            let linha=0;
            if(item&&grupo){
                if(grupo.classList.contains('ov-grid')){
                    const alturas=[...new Set(Array.from(grupo.children,e=>(e as HTMLElement).offsetTop))].sort((a,b)=>a-b);
                    linha=alturas.indexOf(item.offsetTop);
                }else linha=Array.from(grupo.children).indexOf(item);
            }
            // Mesma duração para todos: a fase depende só da linha e forma uma onda descendo pela lista.
            // A prioridade pesa na gravidade (gravidade.ts), não no ritmo da flutuação.
            suporte.style.animationDuration = '12s';
            suporte.style.animationDirection = 'normal';
            suporte.style.animationDelay = `-${(Date.now()/1000+Math.max(0,linha)*1.8)%12}s`;
            if (ativo && !removerGravidade) removerGravidade = registrarGravidade(suporte);
        }
    }
	node.addEventListener('pointerenter', entrar);
	node.addEventListener('pointermove', mover, { passive: true });
	node.addEventListener('pointerleave', sair);
	node.addEventListener('focusin', focar);
	node.addEventListener('focusout', desfocar);
	reduzido.addEventListener('change', limpar);
	configurar();
    const grupo=node.closest('.ov-grid, .lista-cards');
    const observador=new ResizeObserver(configurar);
    if(grupo)observador.observe(grupo);
	return {
		update(valor: boolean) { ativo = valor; configurar(); },
		destroy() {
			node.removeEventListener('pointerenter', entrar);
			node.removeEventListener('pointermove', mover);
			node.removeEventListener('pointerleave', sair);
			node.removeEventListener('focusin', focar);
			node.removeEventListener('focusout', desfocar);
			reduzido.removeEventListener('change', limpar);
			cancelAnimationFrame(brilho.quadro);
			node.removeAttribute('data-orbital'); limpar(); removerLuz(); removerGravidade?.(); observador.disconnect();
		}
	};
}
