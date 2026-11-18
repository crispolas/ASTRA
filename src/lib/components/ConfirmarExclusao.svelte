<script lang="ts">
	import { onMount, tick } from 'svelte';
	let { titulo, aoConfirmar, aoCancelar }: { titulo: string; aoConfirmar: () => void; aoCancelar: () => void } = $props();
	const id = $props.id();
	let cancelar = $state<HTMLButtonElement>();
	let excluir = $state<HTMLButtonElement>();
	let focoAnterior: Element | null = null;

	// Vai para o body: o cartão flutua com transform, e um elemento fixed dentro dele ficaria preso ao cartão.
	function noBody(no: HTMLElement) {
		document.body.append(no);
		return { destroy() { no.remove(); } };
	}
	onMount(() => {
		focoAnterior = document.activeElement;
		void tick().then(() => cancelar?.focus());
		return () => { if (focoAnterior instanceof HTMLElement && focoAnterior.isConnected) focoAnterior.focus(); };
	});
	function teclado(e: KeyboardEvent) {
		if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); aoCancelar(); }
		if (e.key === 'Tab') {
			// Só dois botões: o Tab alterna entre eles.
			e.preventDefault();
			(document.activeElement === cancelar ? excluir : cancelar)?.focus();
		}
	}
</script>

<div class="confirmar" use:noBody role="alertdialog" aria-modal="true" aria-labelledby="{id}-titulo" aria-describedby="{id}-texto"
	tabindex="-1" onkeydown={teclado} onclick={(e) => { if (e.target === e.currentTarget) aoCancelar(); }}>
	<div class="caixa">
		<h2 id="{id}-titulo">Excluir “{titulo}”?</h2>
		<p id="{id}-texto">A tarefa sai do quadro e não dá para desfazer.</p>
		<div class="acoes">
			<button type="button" class="cancelar" bind:this={cancelar} onclick={aoCancelar}>Cancelar</button>
			<button type="button" class="excluir" bind:this={excluir} onclick={aoConfirmar}>Excluir tarefa</button>
		</div>
	</div>
</div>

<style>
	.confirmar { position: fixed; inset: 0; z-index: 150; display: grid; place-items: center; padding: 16px; background: rgba(5, 6, 9, .72); font-family: var(--obs-ui); animation: veu .3s var(--obs-suave) both; }
	@keyframes veu { from { background: rgba(5, 6, 9, 0); } }
	.caixa { width: min(420px, 100%); padding: 28px; color: var(--obs-tinta); border: 1px solid var(--obs-fio-forte); animation: subir .5s var(--obs-mola) both;
		background:
			linear-gradient(var(--obs-tinta-2), var(--obs-tinta-2)) top left/10px 1px no-repeat,
			linear-gradient(var(--obs-tinta-2), var(--obs-tinta-2)) top left/1px 10px no-repeat,
			linear-gradient(var(--obs-tinta-2), var(--obs-tinta-2)) bottom right/10px 1px no-repeat,
			linear-gradient(var(--obs-tinta-2), var(--obs-tinta-2)) bottom right/1px 10px no-repeat,
			var(--obs-painel); }
	@keyframes subir { from { opacity: 0; transform: translateY(28px) scale(.97); } }
	h2 { margin: 0 0 10px; font: 500 24px/1.2 var(--obs-titulo); letter-spacing: -.01em; text-wrap: balance; }
	p { margin: 0; color: var(--obs-tinta-2); font-size: 15px; line-height: 1.5; }
	.acoes { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; margin-top: 26px; }
	button { min-height: 44px; padding: 0 22px; border-radius: 999px; font: 600 14px/1 var(--obs-ui); cursor: pointer; transition: transform .35s var(--obs-mola), background-color .2s, border-color .2s; }
	button:hover { transform: translateY(-2px); }
	button:focus-visible { outline: 2px solid var(--obs-gelo); outline-offset: 3px; }
	.cancelar { background: transparent; color: var(--obs-tinta); border: 1px solid var(--obs-fio-forte); }
	.excluir { background: var(--obs-perigo); color: #16080a; border: 1px solid var(--obs-perigo); }
	@media (prefers-reduced-motion: reduce) { .confirmar, .caixa { animation: none; } button { transition: none; } }
</style>
