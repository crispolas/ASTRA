<script lang="ts">
	import { goto } from '$app/navigation';
	import { criarTarefa } from '../../../lib/api';
	import TarefaFormulario from '#lib/components/TarefaFormulario.svelte';
	import type { NovaTarefa } from '../../../tipos';
	import { page } from '$app/state';

	const valoresIniciais = { projetoId: page.url.searchParams.get('projeto') ?? '' };

	async function salvar(dados: NovaTarefa) {
		await criarTarefa(dados);
		await goto('/');
	}
</script>

<main class="astra-page">
	<div class="astra-head">
		<div style="display:flex; flex-direction:column; gap:8px;">
			<h1>Nova tarefa</h1>
		</div>
		<a class="astra-pill" href="/">Voltar</a>
	</div>

	<TarefaFormulario {valoresIniciais} aoEnviar={salvar} textoBotao="Criar tarefa" />
</main>