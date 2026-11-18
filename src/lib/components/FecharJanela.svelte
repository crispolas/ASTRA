<script lang="ts">
	import { janela, voltarDaJanela } from '../janela.svelte';
	/** `href` é o destino quando não há para onde voltar (a janela foi aberta por um link direto). */
	let { href }: { href: string } = $props();
</script>

<a class="astra-pill fechar-janela" {href} aria-label="Fechar" title="Fechar"
	onclick={(e) => { if (janela.profundidade > 0) { e.preventDefault(); void voltarDaJanela(href); } }}>
	<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" /></svg>
</a>

<style>
	/* :global(.ov-shell...) para vencer a regra geral de botões da camada observatorio.css */
	:global(.ov-shell.orbita-viva.planetario) .fechar-janela { width: 36px !important; height: 36px; min-height: 36px !important; min-width: 0 !important; padding: 0 !important; border-radius: 50% !important; flex: none; }
	svg { flex: none; }
</style>
