<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { iniciarEntrada } from '../../lib/entrada/animacao';
	import { transicaoEntrada } from '../../lib/entrada/transicao';
	let cena: HTMLDivElement;
	let erro = $state('');

	// Tempo para a camada preta da transição escurecer por cima do céu antes de trocar de tela (sem corte).
	const ESCURECER_MS = 480;

	onMount(() => iniciarEntrada(cena, async () => {
		erro = '';
		transicaoEntrada.set('centro');
		try {
			await tick();
			if (!matchMedia('(prefers-reduced-motion: reduce)').matches) await new Promise((pronto) => setTimeout(pronto, ESCURECER_MS));
			await goto('/');
			await tick();
			transicaoEntrada.set('canto');
		} catch (falha) {
			transicaoEntrada.set('oculta');
			erro = 'Não foi possível abrir o gerenciador. Clique na lua para tentar novamente.';
			throw falha;
		}
	}));
</script>

<svelte:head><title>ASTRA · entre em órbita</title></svelte:head>

<div class="entrada" bind:this={cena}>
	<canvas id="sky" aria-hidden="true"></canvas>
	<div class="grain" aria-hidden="true"></div>
	<div class="shell">
		<main>
			<section class="portal" aria-labelledby="entrada-title">
				<h1 id="entrada-title" class="sr-only">ASTRA</h1>
				<div class="moon-space">
					<button id="moon" type="button" aria-label="Entrar no ASTRA">
						<canvas id="lunar" width="768" height="768" aria-hidden="true"></canvas>
					</button>
				</div>
			</section>
		</main>
	</div>
	{#if erro}<p role="alert" class="erro">{erro}</p>{/if}
</div>

<style>
	.entrada { position: fixed; inset: 0; z-index: 100; overflow: hidden; background: #000; color: #e0e7e9; font-family: 'Courier New', monospace; --accent: #b0d8df; }
	#sky { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
	/* granulado na mesma camada da grade (uma camada a menos sobre o céu animado) */
	.grain { position: absolute; inset: 0; pointer-events: none; opacity: .16; animation: acender 1.4s ease-out both;
		background:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.6 -.35'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E") 0 0/220px 220px,
			linear-gradient(#6c8c9c10 1px,transparent 1px) 0 0/20px 20px,linear-gradient(90deg,#6c8c9c10 1px,transparent 1px) 0 0/20px 20px; }
	.shell { min-height: 100svh; position: relative; padding: 24px 16px; }
	main { min-height: calc(100svh - 48px); display: grid; place-items: center; }
	.portal { position: relative; text-align: center; width: 100%; max-width: 1200px; padding: 20px 0; transition: transform 2400ms cubic-bezier(.32,0,.55,1); transform-origin: center; }
	.sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
	.moon-space { width: min(760px,96vw); height: min(690px,90svh); position: relative; margin: 0 auto; display: grid; place-items: center; }
	#moon { position: relative; border: 0; padding: 0; background: none; width: min(600px,82vw,78svh); aspect-ratio: 1; cursor: pointer; display: block; -webkit-tap-highlight-color: transparent; outline: none; }
	#lunar { display: block; width: 100%; height: 100%; filter: drop-shadow(0 0 18px #f4f5f752) drop-shadow(0 0 60px #f4f5f71f); }
	#moon:focus-visible { outline: 1px dashed var(--accent); outline-offset: 10px; border-radius: 50%; }
	.entrada:global(.entering) #moon { pointer-events: none; }
	.entrada:global(.gathering) .portal, .entrada:global(.holding) .portal { transform: scale(0); }
	/* ao abrir, o céu e a lua acendem em vez de surgirem de uma vez */
	#sky, .shell { animation: acender 1.1s ease-out both; }
	.shell { animation-delay: .15s; }
	@keyframes acender { from { opacity: 0; } }
	/* no clique as estrelas do nome passam a ser desenhadas na frente; a lua some no mesmo quadro em que se desmancha */
	.entrada:global(.entering) #sky { z-index: 3; }
	.entrada:global(.lua-desmanchada) .portal { opacity: 0; transition: none; }
	.entrada :global(.lua-solta) { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 4; pointer-events: none; filter: drop-shadow(0 0 6px rgba(225,240,255,.35)); }
	.erro { position: absolute; bottom: 20px; left: 10%; width: 80%; text-align: center; font: 12px 'Courier New',monospace; }
	@media(max-width:600px) { .shell { padding:20px 12px; } main { min-height:calc(100svh - 40px); } .portal { padding:0; } .moon-space { width:100%; height:calc(100svh - 80px); } }
	@media(prefers-reduced-motion:reduce) { .portal { transition:none; } #sky, .shell, .grain { animation:none; } }
</style>
