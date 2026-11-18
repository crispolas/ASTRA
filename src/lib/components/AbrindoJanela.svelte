<script lang="ts">
	/** Aparece no instante do clique enquanto a janela carrega os dados: título já visível e linhas em pontos de luz. */
	let { titulo, formulario = false }: { titulo: string; formulario?: boolean } = $props();
</script>

<div class="abrindo" role="status">
	<div class="caixa">
		<p class="titulo">{titulo}</p>
		<span class="pontos" style:width="92%"></span>
		<span class="pontos" style:width="64%"></span>
		<div class="grade" class:formulario>
			<span class="pontos"></span><span class="pontos"></span><span class="pontos"></span><span class="pontos"></span>
		</div>
		<span class="oculto">Abrindo…</span>
	</div>
</div>

<style>
	.abrindo { position: fixed; inset: 0; z-index: 91; display: grid; place-items: center; padding: 16px; background: rgba(5, 6, 9, .7); animation: veu .4s var(--obs-suave) both; }
	@keyframes veu { from { background: rgba(5, 6, 9, 0); } }
	.caixa { width: min(520px, 100%); background: var(--obs-painel); border: 1px solid var(--obs-fio-forte); padding: 22px 24px 26px; display: flex; flex-direction: column; gap: 14px; animation: subir .5s var(--obs-mola) both; }
	@keyframes subir { from { opacity: 0; transform: translateY(28px) scale(.97); } }
	.titulo { margin: 0 0 6px; padding-right: 60px; font: 500 21px/1.2 var(--obs-titulo); color: var(--obs-tinta); }
	.grade { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; padding-top: 18px; margin-top: 6px; border-top: 1px solid var(--obs-fio); }
	.grade.formulario { grid-template-columns: 1fr; }
	.pontos { display: block; height: 9px; background: radial-gradient(circle, rgba(220, 232, 255, .55) .9px, transparent 1.3px) 0 50%/6px 6px repeat-x;
		-webkit-mask: linear-gradient(90deg, rgba(0, 0, 0, .25) 0 35%, #000 50%, rgba(0, 0, 0, .25) 65% 100%) 0 0/300% 100%;
		mask: linear-gradient(90deg, rgba(0, 0, 0, .25) 0 35%, #000 50%, rgba(0, 0, 0, .25) 65% 100%) 0 0/300% 100%;
		animation: condensar 1.8s ease-in-out infinite; }
	@keyframes condensar { from { -webkit-mask-position: 100% 0; mask-position: 100% 0; } to { -webkit-mask-position: 0 0; mask-position: 0 0; } }
	.oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
	@media (prefers-reduced-motion: reduce) { .abrindo, .caixa, .pontos { animation: none; } }
</style>
