<script lang="ts">
	import TarefaCard from '#lib/components/TarefaCard.svelte';
	import ProgressoStatus from '#lib/components/ProgressoStatus.svelte';
	import EstadoVazio from '#lib/components/EstadoVazio.svelte';
	import type { Tarefa } from '../../../tipos';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	// Cópia local: a troca de status pelo cartão atualiza a lista e o progresso na hora.
	let tarefas = $state<Tarefa[]>([]);
	$effect(() => { tarefas = data.projeto?.tarefas ?? []; });
</script>

<svelte:head><title>{data.projeto?.nome ?? 'Projeto não encontrado'} · ASTRA</title></svelte:head>

<main class="astra-page pagina-projeto">
	<div class="astra-head">
		<div>
			<span class="astra-eyebrow">Projetos</span>
			<!-- O nome do projeto é o título da página; sem projeto, o título genérico. -->
			<h1>{data.projeto ? data.projeto.nome : 'Detalhes do projeto'}</h1>
		</div>
		<a class="astra-pill voltar" href="/projetos">Voltar para projetos</a>
	</div>

	{#if data.projeto}
		{@const projeto = data.projeto}
		<section class="bloco" aria-label="Sobre o projeto">
			<div class="astra-card bloco ficha">
				{#if projeto.descricao}<p class="descricao">{projeto.descricao}</p>{/if}
				<dl class="astra-meta">
					<div>
						<dt>Disciplina</dt>
						<dd>{projeto.disciplina}</dd>
					</div>
					<div>
						<dt>Criado em</dt>
						<dd>
							<time datetime={projeto.criadoEm}>{projeto.criadoEm.split('-').reverse().join('/')}</time>
						</dd>
					</div>
				</dl>
				<ProgressoStatus {tarefas} />
				<a class="astra-btn nova" href="/tarefas/nova?projeto={projeto.id}">Nova tarefa</a>
			</div>
		</section>

		<section class="bloco" aria-labelledby="tarefas-projeto">
			<h2 id="tarefas-projeto">Tarefas <span class="total">{tarefas.length}</span></h2>
			{#if tarefas.length === 0}
				<EstadoVazio mensagem="Este projeto ainda não tem tarefas." acao={{ texto: 'Criar a primeira tarefa', href: `/tarefas/nova?projeto=${projeto.id}` }} />
			{:else}
				<div class="astra-list ov-grid">
					{#each tarefas as tarefa (tarefa.id)}
						<TarefaCard {tarefa} onstatus={(nova) => { tarefas = tarefas.map((t) => (t.id === nova.id ? nova : t)); }} />
					{/each}
				</div>
			{/if}
		</section>
	{:else if data.naoEncontrado}
		<p class="astra-error" role="alert">Projeto não encontrado. Ele pode ter sido removido ou o endereço está errado.</p>
	{:else}
		<p class="astra-error" role="alert">Erro: não foi possível carregar o projeto. Tente novamente em instantes.</p>
	{/if}
</main>

<style>
	.bloco { display: flex; flex-direction: column; gap: 16px; }
	:global(.ov-shell.orbita-viva.planetario) .voltar { min-height: 40px !important; font-size: 13.5px !important; }
	.ficha { position: relative; padding-right: 200px !important; }
	.descricao { margin: 0; font: 400 16px/1.55 var(--obs-ui); color: var(--obs-tinta); }
	.ficha :global(.astra-meta) { margin: 0 !important; }
	.ficha :global(.progresso) { max-width: 520px; }
	.nova { position: absolute; top: 22px; right: 24px; }
	h2 { display: flex; align-items: baseline; gap: 10px; margin: 8px 0 4px; font: 500 22px/1.2 var(--obs-titulo); }
	.total { font: 500 13px/1 var(--obs-ui); color: var(--obs-tinta-3); border: 1px solid var(--obs-fio-forte); border-radius: 999px; padding: 4px 9px; }
	@media (max-width: 760px) {
		.ficha { padding-right: 20px !important; }
		.nova { position: static; align-self: flex-start; }
	}
</style>
