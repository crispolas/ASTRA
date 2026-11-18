<script lang="ts">
	import { atualizarTarefa } from '../../../../lib/api';
	import TarefaFormulario from '#lib/components/TarefaFormulario.svelte';
	import FecharJanela from '#lib/components/FecharJanela.svelte';
	import { voltarDaJanela } from '../../../../lib/janela.svelte';
	import type { NovaTarefa } from '../../../../tipos';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Depois de salvar, volta uma janela: para o detalhe, se veio dele, ou para a lista/quadro do lápis.
	async function salvar(dados: NovaTarefa) {
		await atualizarTarefa(data.tarefa.id, dados);
		await voltarDaJanela(`/tarefas/${data.tarefa.id}`);
	}
</script>

<svelte:head><title>Editar tarefa · ASTRA</title></svelte:head>

<main class="astra-page">
	<div class="astra-head">
		<div>
			<h1>Editar tarefa</h1>
		</div>
		<FecharJanela href="/tarefas/{data.tarefa.id}" />
	</div>

	<TarefaFormulario valoresIniciais={data.tarefa} aoEnviar={salvar} textoBotao="Salvar alterações" />
</main>
