<script lang="ts">
	import TarefaCard from '#lib/components/TarefaCard.svelte';
	import type { Tarefa } from '../tipos';

	// Exemplos fixos para demonstrar a issue #7. A lista da API pertence à issue #11.
	const primeiraTarefa: Tarefa = {
		id: '1',
		projetoId: '1',
		titulo: 'Criar o repositório',
		descricao: 'Repositório da equipe no GitHub, com todos os integrantes',
		status: 'concluida',
		prioridade: 'alta',
		responsavel: 'Ana',
		prazo: '2026-10-06'
	};

	const segundaTarefa: Tarefa = {
		id: '2',
		projetoId: '1',
		titulo: 'Subir o json-server',
		descricao: 'API local a partir do db.json',
		status: 'em-andamento',
		prioridade: 'alta',
		responsavel: 'Bruno',
		prazo: '2026-10-06'
	};
</script>

<h1>Tarefas</h1>
<h2>Página inicial</h2>

<section aria-label="Demonstração do cartão de tarefa">
	<p>Exemplos de cartões de tarefa.</p>
	<div class="cartoes">
		<TarefaCard tarefa={primeiraTarefa} />
		<TarefaCard tarefa={segundaTarefa} />
	</div>
</section>

<style>
	.cartoes {
		display: grid;
		gap: 1rem;
	}
</style>
