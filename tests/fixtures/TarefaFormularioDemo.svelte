<script lang="ts">
	// Ambiente de teste do componente, sem criar as rotas das issues #18 e #19.
	import { onMount } from 'svelte';
	import TarefaFormulario from '../../src/lib/components/TarefaFormulario.svelte';
	import { buscarTarefa, criarTarefa, atualizarTarefa } from '../../src/lib/api';
	import type { NovaTarefa, Tarefa } from '../../src/tipos';

	let inicial = $state<Tarefa>();
	let criada = $state<Tarefa>();
	let editada = $state<Tarefa>();
	let dadosEnviados = $state('');
	let erro = $state('');

	onMount(async () => {
		try { inicial = await buscarTarefa('1'); }
		catch { erro = 'A tarefa 1 não está disponível na API de teste.'; }
	});

	async function criar(dados: NovaTarefa) {
		dadosEnviados = JSON.stringify(dados);
		criada = await criarTarefa(dados);
	}

	async function editar(dados: NovaTarefa) {
		if (inicial) editada = await atualizarTarefa(inicial.id, dados);
	}
</script>

<h1>Teste isolado das issues 16 e 17</h1>
<p>Os botões abaixo gravam na API. Use uma cópia do banco para esta demonstração.</p>
<section aria-label="Formulário de criação">
	<h2>Criação</h2>
	<TarefaFormulario aoEnviar={criar} textoBotao="Criar exemplo" />
	<output data-testid="criada">{JSON.stringify(criada)}</output>
	<output data-testid="dados">{dadosEnviados}</output>
</section>
<section aria-label="Formulário de edição">
	<h2>Edição da tarefa 1</h2>
	{#if inicial}
		<TarefaFormulario valoresIniciais={inicial} aoEnviar={editar} textoBotao="Atualizar exemplo" />
		<output data-testid="original">{JSON.stringify(inicial)}</output>
	{:else if erro}
		<p>{erro}</p>
	{/if}
	<output data-testid="editada">{JSON.stringify(editada)}</output>
</section>
