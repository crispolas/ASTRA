<script lang="ts">
	import TarefaCard from '#lib/components/TarefaCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main class="astra-page">
	<div class="astra-head">
		<div style="display:flex; flex-direction:column; gap:8px;">
			<span class="astra-eyebrow">Projetos</span>
			<h1>Detalhes do projeto</h1>
		</div>
		<a class="astra-pill" href="/projetos">Voltar para projetos</a>
	</div>

	{#if data.projeto}
		{@const projeto = data.projeto}
		<section class="bloco" aria-labelledby="nome-projeto">
			<div class="astra-card bloco">
				<div class="astra-head">
					<h2 id="nome-projeto">{projeto.nome}</h2>
					<a class="astra-btn" href="/tarefas/nova?projeto={projeto.id}" style="text-decoration:none;">Nova tarefa</a>
				</div>
				<p class="astra-muted">{projeto.descricao}</p>
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
			</div>
		</section>

		<section class="bloco" aria-labelledby="tarefas-projeto">
			<h2 id="tarefas-projeto">Tarefas</h2>
			{#if projeto.tarefas.length === 0}
				<p class="astra-muted">Este projeto ainda não tem tarefas.</p>
			{:else}
				<div class="astra-list">
					{#each projeto.tarefas as tarefa (tarefa.id)}
						<TarefaCard {tarefa} />
					{/each}
				</div>
			{/if}
		</section>
	{:else}
		<p class="astra-error" role="alert">Erro: não foi possível carregar o projeto. Confira se a API está ligada e se o projeto existe.</p>
	{/if}
</main>

<style>
	.bloco {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
</style>