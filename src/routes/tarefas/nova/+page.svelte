<script lang="ts">
	import { criarTarefa } from '../../../lib/api';
	import TarefaFormulario from '#lib/components/TarefaFormulario.svelte';
	import FecharJanela from '#lib/components/FecharJanela.svelte';
	import { voltarDaJanela } from '../../../lib/janela.svelte';
	import type { NovaTarefa } from '../../../tipos';
	import { page } from '$app/state';

	const valoresIniciais = { projetoId: page.url.searchParams.get('projeto') ?? '' };

	// Depois de criar, volta para a tela de onde a janela foi aberta (lista, quadro ou projeto).
	async function salvar(dados: NovaTarefa) {
		await criarTarefa(dados);
		await voltarDaJanela('/');
	}
</script>

<svelte:head><title>Nova tarefa · ASTRA</title></svelte:head>

<main class="astra-page">
	<div class="astra-head">
		<div>
			<h1>Nova tarefa</h1>
		</div>
		<FecharJanela href="/" />
	</div>

	<TarefaFormulario {valoresIniciais} aoEnviar={salvar} textoBotao="Criar tarefa" />
</main>
