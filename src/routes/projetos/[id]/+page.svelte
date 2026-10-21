<script lang="ts">
	import TarefaCard from '#lib/components/TarefaCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>Detalhes do projeto</h1>
<a href="/projetos">Voltar para projetos</a>

{#if data.projeto}
	{@const projeto = data.projeto}
	<section aria-labelledby="nome-projeto">
		<h2 id="nome-projeto">{projeto.nome}</h2>
		<a href="/tarefas/nova?projeto={projeto.id}">Nova tarefa</a>
		<p>{projeto.descricao}</p>
		<dl>
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
	</section>

	<section aria-labelledby="tarefas-projeto">
		<h2 id="tarefas-projeto">Tarefas</h2>
		{#if projeto.tarefas.length === 0}
			<p>Este projeto ainda não tem tarefas.</p>
		{:else}
			<div class="cartoes">
				{#each projeto.tarefas as tarefa (tarefa.id)}
					<TarefaCard {tarefa} />
				{/each}
			</div>
		{/if}
	</section>
{:else}
	<p role="alert">Não foi possível carregar o projeto. Confira se a API está ligada e se o projeto existe.</p>
{/if}

<style>
	.cartoes {
		display: grid;
		gap: 1rem;
	}
</style>
