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

<form onsubmit={enviar}>
	<div>
		<label for={`${id}-titulo`}>Título</label>
		<input id={`${id}-titulo`} name="titulo" bind:value={campos.titulo} />
		{#if erros.titulo}
			<p role="alert">{erros.titulo}</p>
		{/if}

	</div>
	<div>
		<label for={`${id}-descricao`}>Descrição</label>
		<textarea id={`${id}-descricao`} name="descricao" bind:value={campos.descricao}></textarea>
	</div>
	<div>
		<label for={`${id}-projeto`}>Projeto</label>
		<select id={`${id}-projeto`} name="projetoId" bind:value={campos.projetoId}>
			<option value="">Selecione um projeto</option>
			{#each projetos as projeto (projeto.id)}
				<option value={projeto.id}>{projeto.nome}</option>
			{/each}
		</select>
		{#if erros.projetoId}
			<p role="alert">{erros.projetoId}</p>
		{/if}

		{#if carregandoProjetos}
			<p role="status">Carregando projetos...</p>
		{:else if erroProjetos}
			<p role="alert">{erroProjetos}</p>
		{:else if projetos.length === 0}
			<p>Nenhum projeto disponível.</p>
		{/if}
	</div>
	<div>
		<label for={`${id}-status`}>Status</label>
		<select id={`${id}-status`} name="status" bind:value={campos.status}>
			<option value="a-fazer">A fazer</option>
			<option value="em-andamento">Em andamento</option>
			<option value="em-revisao">Em revisão</option>
			<option value="concluida">Concluída</option>
		</select>
	</div>
	<div>
		<label for={`${id}-prioridade`}>Prioridade</label>
		<select id={`${id}-prioridade`} name="prioridade" bind:value={campos.prioridade}>
			<option value="baixa">Baixa</option>
			<option value="media">Média</option>
			<option value="alta">Alta</option>
		</select>
	</div>
	<div>
		<label for={`${id}-responsavel`}>Responsável</label>
		<input id={`${id}-responsavel`} name="responsavel" bind:value={campos.responsavel} />
	</div>
	<div>
		<label for={`${id}-prazo`}>Prazo</label>
		<input id={`${id}-prazo`} name="prazo" type="date" bind:value={campos.prazo} />
	</div>
	{#if erroEnvio}
		<p role="alert">{erroEnvio}</p>
	{/if}
	<button type="submit" disabled={enviando}>{enviando ? 'Enviando...' : textoBotao}</button>

</form>

<style>
	form {
		display: grid;
		gap: 1rem;
		max-width: 36rem;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
	}

	input, textarea, select, button {
		box-sizing: border-box;
		font: inherit;
		padding: 0.5rem;
	}

	input, textarea, select {
		width: 100%;
	}
</style>
