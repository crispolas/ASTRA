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

<h1>Tarefas</h1>
<h2>Página inicial</h2>

<section aria-label="Lista de tarefas">
	{#if carregando}
		<p role="status">Carregando tarefas...</p>
	{:else if erro}
		<p role="alert">{erro}</p>
	{:else if tarefas.length === 0}
		<p>Nenhuma tarefa encontrada.</p>
	{:else}
		<div class="cartoes">
			{#each tarefas as tarefa (tarefa.id)}
				<TarefaCard tarefa={tarefa} />
			{/each}
		</div>
	{/if}
</section>

<style>
	.cartoes {
		display: grid;
		gap: 1rem;
	}
</style>
