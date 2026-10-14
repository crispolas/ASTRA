<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>Projetos</h1>
<h2>Lista de projetos</h2>

{#if data.projetos && data.projetos.length > 0}
	<ul class="lista-projetos">
		{#each data.projetos as projeto (projeto.id)}
			<li class="card-projeto">
				<h3>{projeto.nome}</h3>
				{#if projeto.descricao}
					<p>{projeto.descricao}</p>
				{/if}
				<a href="/projetos/{projeto.id}">Ver detalhes do projeto</a>
			</li>
		{/each}
	</ul>
{:else}
	<p>Nenhum projeto encontrado.</p>
{/if}

<style>
	.lista-projetos {
		list-style: none;
		padding: 0;
		display: grid;
		gap: 1rem;
	}

	.card-projeto {
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.25rem;
		background-color: #ffffff;
	}

	.card-projeto h3 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
	}

	.card-projeto a {
		display: inline-block;
		margin-top: 0.75rem;
		color: #2563eb;
		font-weight: 600;
		text-decoration: none;
	}

	.card-projeto a:hover {
		text-decoration: underline;
	}
</style>