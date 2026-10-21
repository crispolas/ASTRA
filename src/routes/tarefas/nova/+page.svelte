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


<h1>Nova tarefa</h1>
<a href="/">Voltar</a>

<TarefaFormulario {valoresIniciais} aoEnviar={salvar} textoBotao="Criar tarefa" />
