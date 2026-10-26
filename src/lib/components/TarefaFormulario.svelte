<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { listarProjetos } from '../api';
	import type { NovaTarefa, Projeto } from '../../tipos';

	interface Props {
		valoresIniciais?: Partial<NovaTarefa>;
		aoEnviar: (dados: NovaTarefa) => void | Promise<void>;
		textoBotao?: string;
	}

	let { valoresIniciais, aoEnviar, textoBotao = 'Salvar tarefa' }: Props = $props();
	const id = $props.id();
	function prepararCampos(valores: Partial<NovaTarefa> = {}): NovaTarefa {
		// Copiar só os campos editáveis evita enviar o ID de uma tarefa existente.
		return {
			projetoId: valores.projetoId ?? '',
			titulo: valores.titulo ?? '',
			descricao: valores.descricao ?? '',
			status: valores.status ?? 'a-fazer',
			prioridade: valores.prioridade ?? 'media',
			responsavel: valores.responsavel ?? '',
			prazo: valores.prazo ?? ''
		};
	}

	let campos = $state<NovaTarefa>(untrack(() => prepararCampos(valoresIniciais)));
	let projetos = $state<Projeto[]>([]);
	let carregandoProjetos = $state(true);
	let erroProjetos = $state('');
	let erroEnvio = $state('');
	let erros = $state<{ titulo?: string; projetoId?: string }>({});
	let enviando = $state(false);

	function validar(): boolean {
		erros = {};
		if (!campos.titulo.trim()) erros.titulo = 'Informe o título.';
		if (!campos.projetoId) erros.projetoId = 'Selecione um projeto.';
		return Object.keys(erros).length === 0;
	}


	// Uma tarefa carregada pela tela de edição atualiza os campos, sem alterar a prop.
	$effect(() => {
		campos = prepararCampos(valoresIniciais);
	});

	onMount(async () => {
		try {
			projetos = await listarProjetos();
		} catch {
			erroProjetos = 'Não foi possível carregar os projetos. Confira se a API está ligada.';
		} finally {
			carregandoProjetos = false;
		}
	});

	async function enviar(evento: SubmitEvent) {
		evento.preventDefault();
		if (enviando || !validar()) return;
		erroEnvio = '';
		enviando = true;
		try {
			await aoEnviar({ ...campos });
		} catch {
			erroEnvio = 'Não foi possível enviar a tarefa.';
		} finally {
			enviando = false;
		}
	}
</script>

<form class="astra-card astra-form" onsubmit={enviar}>
	<div class="astra-field">
		<label class="astra-label" for={`${id}-titulo`}>Título</label>
		<input
			class="astra-input"
			id={`${id}-titulo`}
			name="titulo"
			bind:value={campos.titulo}
			aria-invalid={erros.titulo ? 'true' : undefined}
			aria-describedby={erros.titulo ? `${id}-titulo-erro` : undefined}
		/>
		{#if erros.titulo}
			<p class="astra-error" id={`${id}-titulo-erro`} role="alert">Erro: {erros.titulo}</p>
		{/if}
	</div>
	<div class="astra-field">
		<label class="astra-label" for={`${id}-descricao`}>Descrição</label>
		<textarea class="astra-textarea" id={`${id}-descricao`} name="descricao" bind:value={campos.descricao}></textarea>
	</div>
	<div class="astra-field">
		<label class="astra-label" for={`${id}-projeto`}>Projeto</label>
		<select
			class="astra-select"
			id={`${id}-projeto`}
			name="projetoId"
			bind:value={campos.projetoId}
			aria-invalid={erros.projetoId ? 'true' : undefined}
			aria-describedby={erros.projetoId ? `${id}-projeto-erro` : undefined}
		>
			<option value="">Selecione um projeto</option>
			{#each projetos as projeto (projeto.id)}
				<option value={projeto.id}>{projeto.nome}</option>
			{/each}
		</select>
		{#if erros.projetoId}
			<p class="astra-error" id={`${id}-projeto-erro`} role="alert">Erro: {erros.projetoId}</p>
		{/if}

		{#if carregandoProjetos}
			<p class="astra-muted" role="status">Carregando projetos...</p>
		{:else if erroProjetos}
			<p class="astra-error" role="alert">Erro: {erroProjetos}</p>
		{:else if projetos.length === 0}
			<p class="astra-muted">Nenhum projeto disponível.</p>
		{/if}
	</div>
	<div class="astra-field">
		<label class="astra-label" for={`${id}-status`}>Status</label>
		<select class="astra-select" id={`${id}-status`} name="status" bind:value={campos.status}>
			<option value="a-fazer">A fazer</option>
			<option value="em-andamento">Em andamento</option>
			<option value="em-revisao">Em revisão</option>
			<option value="concluida">Concluída</option>
		</select>
	</div>
	<div class="astra-field">
		<label class="astra-label" for={`${id}-prioridade`}>Prioridade</label>
		<select class="astra-select" id={`${id}-prioridade`} name="prioridade" bind:value={campos.prioridade}>
			<option value="baixa">Baixa</option>
			<option value="media">Média</option>
			<option value="alta">Alta</option>
		</select>
	</div>
	<div class="astra-field">
		<label class="astra-label" for={`${id}-responsavel`}>Responsável</label>
		<input class="astra-input" id={`${id}-responsavel`} name="responsavel" bind:value={campos.responsavel} />
	</div>
	<div class="astra-field">
		<label class="astra-label" for={`${id}-prazo`}>Prazo</label>
		<input class="astra-input" id={`${id}-prazo`} name="prazo" type="date" bind:value={campos.prazo} />
	</div>
	{#if erroEnvio}
		<p class="astra-error" role="alert">Erro: {erroEnvio}</p>
	{/if}
	<button class="astra-btn" type="submit" disabled={enviando}>{enviando ? 'Enviando...' : textoBotao}</button>
</form>

<style>
	.astra-form {
		display: grid;
		gap: 20px;
		max-width: 36rem;
	}

	.astra-form :global(.astra-textarea) {
		min-height: 120px;
		resize: vertical;
	}

	/* o seletor de data usa o esquema escuro do tema */
	.astra-form :global(input[type='date']) {
		color-scheme: dark;
	}
</style>