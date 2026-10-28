<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import TarefaCard from '../../lib/components/TarefaCard.svelte';
	import Filtros from '../../lib/components/Filtros.svelte';
	import AlternarVisao from '../../lib/components/AlternarVisao.svelte';
	import { buscaTexto, filtroStatus, filtroPrioridade, aplicarFiltros } from '../../lib/stores/filtros';
	import type { PageData } from './$types';
	import type { Tarefa } from '../../tipos';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let tarefasFiltradas = $derived(
		aplicarFiltros(data.tarefas, $buscaTexto, $filtroStatus, $filtroPrioridade)
	);

	const colunas: { id: Tarefa['status']; titulo: string }[] = [
		{ id: 'a-fazer', titulo: 'A fazer' },
		{ id: 'em-andamento', titulo: 'Em andamento' },
		{ id: 'em-revisao', titulo: 'Em revisão' },
		{ id: 'concluida', titulo: 'Concluída' }
	];

	function filtrarPorStatus(status: Tarefa['status']): Tarefa[] {
		return tarefasFiltradas.filter((t: Tarefa) => t.status === status);
	}
</script>

<main class="astra-page quadro-pagina">
	<div class="astra-head">
		<div style="display:flex; flex-direction:column; gap:8px;">
			<span class="astra-eyebrow">Tarefas · Quadro kanban</span>
			<h1>Quadro de Tarefas</h1>
		</div>
		<a class="astra-btn" href="/tarefas/nova" style="text-decoration:none;">Nova tarefa</a>
	</div>

	<AlternarVisao atual="quadro" />
	<Filtros />

	<div class="quadro-container">
		{#each colunas as coluna (coluna.id)}
			{@const tarefasColuna = filtrarPorStatus(coluna.id)}

			<section class="coluna" data-status={coluna.id} aria-label={coluna.titulo}>
				<header class="coluna-cabecalho">
					<h2>{coluna.titulo}</h2>
					<span class="contador" aria-label="{tarefasColuna.length} tarefas">{tarefasColuna.length}</span>
				</header>

				<div class="lista-cards">
					{#each tarefasColuna as tarefa (tarefa.id)}
						<TarefaCard {tarefa} onstatus={() => invalidateAll()} />
					{:else}
						<p class="vazio">Nenhuma tarefa nesta coluna.</p>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</main>

<style>
	/* o quadro precisa de mais largura que as outras páginas */
	.quadro-pagina {
		max-width: 1500px;
	}

	/* 4 faixas lado a lado, mesma largura e mesma altura */
	.quadro-container {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
		align-items: stretch;
	}

	/* faixa (coluna) do kanban */
	.coluna {
		--cor-status: var(--astra-muted);
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 16px;
		background: #101319;
		border: 1px solid var(--astra-glass-border);
		border-top: 2px solid var(--cor-status);
		border-radius: 3px;
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
	}

	.coluna[data-status='em-andamento'] { --cor-status: var(--astra-accent-2); }
	.coluna[data-status='em-revisao']   { --cor-status: var(--astra-accent-pale); }
	.coluna[data-status='concluida']    { --cor-status: var(--astra-accent); }

	.coluna-cabecalho {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 4px 4px 0;
	}

	.coluna-cabecalho h2 {
		font-size: 20px;
		letter-spacing: 1px;
		text-transform: uppercase;
	}

	.contador {
		min-width: 32px;
		padding: 2px 10px;
		font-size: 18px;
		font-weight: 700;
		text-align: center;
		color: var(--astra-on-action);
		background: var(--cor-status);
		border-radius: 3px;
	}

	.lista-cards {
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex: 1;
		min-height: 140px;
	}

	/* cartão compacto de kanban */
	.lista-cards :global(.tarefa-card) {
		padding: 16px 16px 16px 36px;
		gap: 10px;
		background: var(--astra-grad-glass);
		border-radius: 3px;
	}

	.lista-cards :global(.tarefa-card:hover) {
		border-color: var(--astra-accent-soft);
	}

	.lista-cards :global(.tarefa-card h3) {
		font-size: 18px;
		line-height: 1.25;
	}

	.lista-cards :global(.tarefa-card .astra-sparkle) {
		width: 18px;
		height: 18px;
	}

	/* descrição limitada a 2 linhas */
	.lista-cards :global(.tarefa-card > p) {
		font-size: 16px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.lista-cards :global(.tarefa-card .astra-meta) {
		grid-template-columns: 1fr 1fr;
		gap: 8px 12px;
	}

	.lista-cards :global(.tarefa-card .astra-meta dt) {
		font-size: 14px;
	}

	.lista-cards :global(.tarefa-card .astra-meta dd) {
		font-size: 16px;
		margin-top: 2px;
	}

	/* faixa vazia */
	.vazio {
		margin: 0;
		padding: 24px 12px;
		font-size: 16px;
		text-align: center;
		color: var(--astra-muted);
		border: 1px dashed var(--astra-glass-border);
		border-radius: 3px;
	}

	.lista-cards :global(.estrela) { left:12px; top:17px; font-size:18px; }
	@media(max-width:1100px) { .quadro-container { grid-template-columns:repeat(2,minmax(0,1fr)); } }
	@media(max-width:640px) { .quadro-container { grid-template-columns:minmax(0,1fr); } }

	@media (prefers-reduced-motion: reduce) {
		.lista-cards :global(.tarefa-card) {
			transition: none;
		}
	}
</style>
