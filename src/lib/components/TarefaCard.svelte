<script lang="ts">
	import type { Tarefa } from '../../tipos';

	interface Props {
		tarefa: Readonly<Tarefa>;
	}

	let { tarefa }: Props = $props();

	const nomesStatus = {
		'a-fazer': 'A fazer',
		'em-andamento': 'Em andamento',
		'em-revisao': 'Em revisão',
		concluida: 'Concluída'
	} satisfies Record<Tarefa['status'], string>;

	const nomesPrioridade = {
		baixa: 'Baixa',
		media: 'Média',
		alta: 'Alta'
	} satisfies Record<Tarefa['prioridade'], string>;
</script>

<article class="tarefa-card">
	<h3>
		<a href={`/tarefas/${encodeURIComponent(tarefa.id)}`}>{tarefa.titulo}</a>
	</h3>
	<p>{tarefa.descricao}</p>
	<dl>
		<div>
			<dt>Status</dt>
			<dd>{nomesStatus[tarefa.status]}</dd>
		</div>
		<div>
			<dt>Prioridade</dt>
			<dd>{nomesPrioridade[tarefa.prioridade]}</dd>
		</div>
		<div>
			<dt>Responsável</dt>
			<dd>{tarefa.responsavel}</dd>
		</div>
		<div>
			<dt>Prazo</dt>
			<dd><time datetime={tarefa.prazo}>{tarefa.prazo.split('-').reverse().join('/')}</time></dd>
		</div>
	</dl>
</article>

<style>
	.tarefa-card {
		max-width: 32rem;
		padding: 1rem;
		border: 1px solid #cbd5e1;
		border-radius: 0.5rem;
		background: #fff;
		color: #1e293b;
		overflow-wrap: anywhere;
	}

	h3 {
		margin: 0;
	}

	a {
		color: #1d4ed8;
	}

	a:focus-visible {
		outline: 2px solid #1d4ed8;
		outline-offset: 3px;
	}

	dl {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
		gap: 1rem;
		margin-bottom: 0;
	}

	dt {
		font-weight: 600;
	}

	dd {
		margin: 0.25rem 0 0;
	}
</style>
