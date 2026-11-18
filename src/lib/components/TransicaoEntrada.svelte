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
		// Some só depois que o preto dissolveu e a marca chegou ao canto.
		const timer = setTimeout(() => transicaoEntrada.set('oculta'), reduzido ? 0 : 2100);
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
	/* Entrada: o preto e a marca nascem transparentes e escurecem por cima do ASTRA desenhado no céu, sem corte. */
	.fundo { position: absolute; inset: 0; background: #000; transition: opacity 480ms ease-out; }
	.marca { position: fixed; transition: opacity 480ms ease-out; }
	@starting-style { .fundo, .marca { opacity: 0; } }
	/* Saída: a marca desliza para o canto com mola enquanto o preto dissolve devagar, começando um pouco depois. */
	.revelando .fundo { opacity: 0; transition: opacity 1600ms cubic-bezier(.55,0,.35,1) 150ms; }
	.revelando .marca { transition: opacity 480ms ease-out, left 1350ms cubic-bezier(.22,1,.36,1), top 1350ms cubic-bezier(.22,1,.36,1), width 1350ms cubic-bezier(.22,1,.36,1), transform 1350ms cubic-bezier(.22,1,.36,1); }
	@media (prefers-reduced-motion: reduce) { .fundo, .marca, .revelando .fundo, .revelando .marca { transition: none; } }
</style>
