<script lang="ts">
	import { onMount } from 'svelte';
	import TarefaCard from '#lib/components/TarefaCard.svelte';
	import { listarTarefas } from '../lib/api';
	import type { Tarefa } from '../tipos';

	let tarefas = $state<Tarefa[]>([]);
	let carregando = $state(true);
	let erro = $state('');

	onMount(async () => {
		try {
			tarefas = await listarTarefas();
		} catch {
			erro = 'Não foi possível carregar as tarefas. Confira se a API está ligada.';
		} finally {
			carregando = false;
		}
	});
</script>

<main class="astra-page">
	<div class="astra-head">
		<div style="display:flex; flex-direction:column; gap:8px;">
			<span class="astra-eyebrow">Página inicial</span>
			<h1>Tarefas</h1>
		</div>
		<a class="astra-btn" href="/tarefas/nova" style="text-decoration:none;">Nova tarefa</a>
	</div>

	<section aria-label="Lista de tarefas">
		{#if carregando}
			<p class="astra-muted" role="status">Carregando tarefas...</p>
		{:else if erro}
			<p class="astra-error" role="alert">Erro: {erro}</p>
		{:else if tarefas.length === 0}
			<p class="astra-muted">Nenhuma tarefa encontrada.</p>
		{:else}
			<div class="astra-list">
				{#each tarefas as tarefa (tarefa.id)}
					<TarefaCard tarefa={tarefa} />
				{/each}
			</div>
		{/if}
	</section>
</main>