<script lang="ts">
	import { janela } from '../janela.svelte';
	/** Lista vazia: constelação apagada, a mensagem e uma ação que resolve (limpar filtros ou criar a primeira tarefa). */
	let { mensagem, acao }: { mensagem: string; acao?: { texto: string; href: string } | { texto: string; aoClicar: () => void } } = $props();
</script>

<div class="estado-vazio">
	<svg viewBox="0 0 120 64" aria-hidden="true" focusable="false">
		<polyline points="10,46 34,22 58,34 84,12 110,30" />
		<circle cx="10" cy="46" r="1.6" /><circle cx="34" cy="22" r="2.4" /><circle cx="58" cy="34" r="1.6" /><circle cx="84" cy="12" r="2.4" /><circle cx="110" cy="30" r="1.6" />
		<circle class="solta" cx="70" cy="54" r="1.1" /><circle class="solta" cx="22" cy="10" r="1" /><circle class="solta" cx="100" cy="52" r="1" />
	</svg>
	<p class="astra-muted estado-mensagem" role="status">{mensagem}</p>
	{#if acao && 'href' in acao}
		<a class="astra-pill" href={acao.href} onclick={() => { janela.titulo = ''; }}>{acao.texto}</a>
	{:else if acao}
		<button type="button" class="astra-pill" onclick={acao.aoClicar}>{acao.texto}</button>
	{/if}
</div>

<style>
	.estado-vazio { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 56px 16px 64px; text-align: center; animation: surgir .7s var(--obs-suave) both; }
	@keyframes surgir { from { opacity: 0; translate: 0 14px; } }
	svg { width: 120px; height: 64px; overflow: visible; }
	polyline { fill: none; stroke: rgba(173, 211, 238, .6); stroke-width: 1.2; stroke-dasharray: 3 4; }
	circle { fill: #e6f7ff; filter: drop-shadow(0 0 4px #a9dfff); }
	.solta { fill: rgba(230, 247, 255, .45); filter: none; animation: cintilar 3.2s ease-in-out infinite; }
	.solta:nth-of-type(7) { animation-delay: 1.1s; } .solta:nth-of-type(8) { animation-delay: 2.1s; }
	@keyframes cintilar { 50% { opacity: .2; } }
	:global(.ov-shell.orbita-viva.planetario) .estado-vazio p { margin: 0 !important; max-width: 36ch; font: 400 15px/1.5 var(--obs-ui) !important; color: var(--obs-tinta-2) !important; }
	:global(.ov-shell.orbita-viva.planetario) .estado-vazio :is(a, button) { margin-top: 6px; min-height: 40px !important; font-size: 13.5px !important; cursor: pointer; }
	@media (prefers-reduced-motion: reduce) { .estado-vazio, .solta { animation: none; } }
</style>
