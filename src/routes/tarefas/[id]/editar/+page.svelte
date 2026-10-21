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


<h1>Editar tarefa</h1>

<a href="/tarefas/{data.tarefa.id}">Voltar</a>

<TarefaFormulario valoresIniciais={data.tarefa} aoEnviar={salvar} textoBotao="Salvar alterações" />
