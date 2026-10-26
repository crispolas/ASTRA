<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main class="astra-page">
	<div class="astra-head">
		<div style="display:flex; flex-direction:column; gap:8px;">
			<span class="astra-eyebrow">Lista de projetos</span>
			<h1>Projetos</h1>
		</div>
	</div>

	{#if data.projetos && data.projetos.length > 0}
		<ul class="astra-list lista-projetos">
			{#each data.projetos as projeto (projeto.id)}
				<li class="astra-card card-projeto">
					<h3>{projeto.nome}</h3>
					{#if projeto.descricao}
						<p class="astra-muted">{projeto.descricao}</p>
					{/if}
					<a class="astra-pill" href="/projetos/{projeto.id}">Ver detalhes do projeto</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="astra-muted">Nenhum projeto encontrado.</p>
	{/if}
</main>

<style>
	.lista-projetos {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.card-projeto {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}
</style>