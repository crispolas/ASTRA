<script lang="ts">
	import { goto } from '$app/navigation';
	import { atualizarTarefa } from '../../../../lib/api';
	import TarefaFormulario from '#lib/components/TarefaFormulario.svelte';
	import type { NovaTarefa } from '../../../../tipos';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	async function salvar(dados: NovaTarefa) {
		await atualizarTarefa(data.tarefa.id, dados);
		await goto(`/tarefas/${data.tarefa.id}`);
	}
</script>

<main class="astra-page">
	<div class="astra-head">
		<div style="display:flex; flex-direction:column; gap:8px;">
			<h1>Editar tarefa</h1>
		</div>
		<a class="astra-pill" href="/tarefas/{data.tarefa.id}">Voltar</a>
	</div>

	<TarefaFormulario valoresIniciais={data.tarefa} aoEnviar={salvar} textoBotao="Salvar alterações" />
</main>