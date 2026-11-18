<script lang="ts">
	import { nomesStatus } from '../opcoes';
	import type { Status, Tarefa } from '../../tipos';
	/** Barra em segmentos com as cores dos status e o texto "1 de 4 tarefas concluídas". */
	let { tarefas }: { tarefas: readonly Pick<Tarefa, 'status'>[] } = $props();
	const ordem: Status[] = ['concluida', 'em-revisao', 'em-andamento', 'a-fazer'];
	const contagem = $derived(ordem.map((status) => ({ status, total: tarefas.filter((t) => t.status === status).length })).filter((c) => c.total));
	const feitas = $derived(tarefas.filter((t) => t.status === 'concluida').length);
	const texto = $derived(
		!tarefas.length ? 'Nenhuma tarefa ainda'
		: feitas === tarefas.length ? (tarefas.length === 1 ? 'A tarefa está concluída' : `Todas as ${tarefas.length} tarefas concluídas`)
		: `${feitas} de ${tarefas.length} ${tarefas.length === 1 ? 'tarefa concluída' : 'tarefas concluídas'}`
	);
</script>

<div class="progresso">
	<div class="barra" class:vazia={!tarefas.length} aria-hidden="true">
		{#each contagem as { status, total } (status)}
			<span class="status--{status}" style:flex-grow={total} title={`${nomesStatus[status]}: ${total}`}></span>
		{/each}
	</div>
	<p>{texto}</p>
</div>

<style>
	.progresso { display: flex; flex-direction: column; gap: 9px; align-self: stretch; width: 100%; max-width: 420px; margin: 4px 0 2px; }
	.barra { display: flex; gap: 3px; height: 6px; width: 100%; }
	.barra.vazia { border: 1px dashed var(--obs-fio-forte); }
	span { min-width: 6px; height: 100%; background: currentColor; box-shadow: 0 0 10px -2px currentColor; transition: flex-grow .7s cubic-bezier(.65, 0, .35, 1); }
	.status--concluida { color: var(--obs-estrela-agua); }
	.status--em-revisao { color: var(--obs-lilas); }
	.status--em-andamento { color: var(--obs-gelo); }
	.status--a-fazer { color: rgba(169, 176, 187, .45); box-shadow: none; }
	:global(.ov-shell.orbita-viva.planetario) .progresso p { margin: 0 !important; font: 500 13.5px/1.3 var(--obs-ui) !important; color: var(--obs-tinta-2) !important; font-variant-numeric: tabular-nums; }
	@media (prefers-reduced-motion: reduce) { span { transition: none; } }
</style>
