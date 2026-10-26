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

	// Classe visual de cada status (o texto continua dizendo o status, não só a cor).
	const classesStatus = {
		'a-fazer': 'astra-tag--todo',
		'em-andamento': 'astra-tag--doing',
		'em-revisao': 'astra-tag--doing',
		concluida: 'astra-tag--done'
	} satisfies Record<Tarefa['status'], string>;
</script>

<article class="astra-card tarefa-card">
	<h3>
		<a href={`/tarefas/${encodeURIComponent(tarefa.id)}`}>{tarefa.titulo}</a>
	</h3>
	<p class="astra-muted">{tarefa.descricao}</p>
	<dl class="astra-meta">
		<div>
			<dt>Status</dt>
			<dd><span class="astra-tag {classesStatus[tarefa.status]}">{nomesStatus[tarefa.status]}</span></dd>
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
		display: flex;
		flex-direction: column;
		gap: 16px;
		overflow-wrap: anywhere;
	}
</style>