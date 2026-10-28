<script lang="ts">
	import { transicaoEntrada } from '../entrada/transicao';
	import MarcaAstra from './MarcaAstra.svelte';
	let destino = $state<{ x: number; y: number; largura: number } | null>(null);

	$effect(() => {
		if ($transicaoEntrada !== 'canto') { destino = null; return; }
		const alvo = document.querySelector('[data-astra-brand]');
		if (alvo) {
			const box = alvo.getBoundingClientRect();
			destino = { x: box.left, y: box.top, largura: box.width };
		}
		const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const timer = setTimeout(() => transicaoEntrada.set('oculta'), reduzido ? 0 : 1100);
		return () => clearTimeout(timer);
	});
</script>

{#if $transicaoEntrada !== 'oculta'}
	<div class="transicao" class:revelando={$transicaoEntrada === 'canto'} aria-hidden="true">
		<div class="fundo"></div>
		<div class="marca"
			style:left={destino ? `${destino.x}px` : '50%'}
			style:top={destino ? `${destino.y}px` : '50%'}
			style:width={destino ? `${destino.largura}px` : 'min(980px, 90vw)'}
			style:transform={destino ? 'none' : 'translate(-50%, -50%)'}>
			<MarcaAstra compacta={destino !== null} />
		</div>
	</div>
{/if}

<style>
	.transicao { position: fixed; inset: 0; z-index: 1000; pointer-events: auto; }
	.fundo { position: absolute; inset: 0; background: #000; transition: opacity 700ms ease; }
	.revelando .fundo { opacity: 0; }
	.marca { position: fixed; transition: left 950ms cubic-bezier(.65,0,.2,1), top 950ms cubic-bezier(.65,0,.2,1), width 950ms cubic-bezier(.65,0,.2,1), transform 950ms cubic-bezier(.65,0,.2,1); }
	@media (prefers-reduced-motion: reduce) { .fundo, .marca { transition: none; } }
</style>
