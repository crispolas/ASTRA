<script lang="ts">
	import { atualizarTarefa, excluirTarefa } from '../api';
	import { interacaoOrbital } from '../visual/interacao';
	import type { Status, Tarefa } from '../../tipos';

	interface Props {
		tarefa: Readonly<Tarefa>;
		variante?: 'padrao' | 'catalogo';
		onstatus?: (tarefa: Tarefa) => void;
		onexcluir?: (id: string) => void;
	}

	let { tarefa, variante = 'catalogo', onstatus, onexcluir }: Props = $props();

	let salvando = $state(false);
	let erroStatus = $state('');
	let excluindo = $state(false);
	let erroExclusao = $state('');

	async function confirmarExclusao() {
		if (excluindo || salvando || !onexcluir) return;
		if (!window.confirm(`Excluir a tarefa “${tarefa.titulo}”? Essa ação não pode ser desfeita.`)) return;
		excluindo = true;
		erroExclusao = '';
		try {
			await excluirTarefa(tarefa.id);
			onexcluir(tarefa.id);
		} catch {
			erroExclusao = 'Não foi possível excluir a tarefa. Confira se a API está ligada e tente novamente.';
		} finally {
			excluindo = false;
		}
	}

	async function mudarStatus(event: Event) {
		const select = event.currentTarget as HTMLSelectElement;
		salvando = true;
		erroStatus = '';
		try {
			onstatus?.(await atualizarTarefa(tarefa.id, { status: select.value as Status }));
		} catch {
			select.value = tarefa.status;
			erroStatus = 'Não foi possível salvar o status. Confira se a API está ligada.';
		} finally {
			salvando = false;
		}
	}

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

<div class="suporte" class:astra-orbita={variante === 'catalogo'}>
<article class="astra-card tarefa-card" class:catalogo={variante === 'catalogo'} class:ov-organic={variante === 'catalogo'}
	use:interacaoOrbital={variante === 'catalogo'}>

	<h3>
		<a href={`/tarefas/${encodeURIComponent(tarefa.id)}`}>{tarefa.titulo}</a>
	</h3>
	<p class="astra-muted">{tarefa.descricao}</p>
	<dl class="astra-meta">
		<div>
			<dt>Status</dt>
			<dd>
				<select class="astra-tag status-select {classesStatus[tarefa.status]}" value={tarefa.status}
					aria-label={`Status de ${tarefa.titulo}`} disabled={salvando || excluindo} onchange={mudarStatus}>
					{#each Object.entries(nomesStatus) as [valor, nome] (valor)}
						<option value={valor}>{nome}</option>
					{/each}
				</select>
			</dd>
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
	{#if erroStatus}<p class="astra-error" role="alert">{erroStatus}</p>{/if}
	{#if onexcluir}
		<div class="acoes-tarefa">
			<button type="button" class="astra-pill excluir-tarefa" onclick={confirmarExclusao}
				aria-label={`Excluir tarefa ${tarefa.titulo}`} disabled={excluindo || salvando}>
				{excluindo ? 'Excluindo...' : 'Excluir'}
			</button>
		</div>
	{/if}
	{#if erroExclusao}<p class="astra-error" role="alert">{erroExclusao}</p>{/if}
</article>
</div>

<style>
	.tarefa-card {
		display: flex;
		flex-direction: column;
		gap: 16px;
		overflow-wrap: anywhere;
	}
	.status-select { max-width:100%; font:inherit; cursor:pointer; color-scheme:dark; }
	.status-select:disabled { cursor:progress; opacity:.6; }
	.acoes-tarefa { display:flex; justify-content:flex-end; padding-top:8px; }
	.excluir-tarefa { cursor:pointer; font-size:12px; }
	.excluir-tarefa:disabled { opacity:.55; cursor:progress; }
	.suporte { display:contents; }
	.suporte.astra-orbita { display:block; min-width:0; }
	.catalogo { position:relative; isolation:isolate; padding:26px 28px; gap:12px; background:#111318f5; border:1px solid #363940; border-radius:3px; backdrop-filter:none; transform:perspective(1100px) translate3d(var(--tx,0px),var(--ty,0px),0) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); transition:transform 380ms ease-out,border-color 300ms ease,box-shadow 380ms ease; box-shadow:0 9px 25px #00000038; }
	.catalogo::after { content:''; position:absolute; inset:0; z-index:-1; border-radius:inherit; opacity:0; pointer-events:none; background:radial-gradient(ellipse 480px 220px at var(--mx,50%) var(--my,50%),#ffffff19,transparent 72%); transition:opacity 350ms ease; }
	.catalogo:hover, .catalogo:focus-within { border-color:#e6e9f28c; box-shadow:0 0 0 1px #ffffff0d,0 0 24px #ffffff17,0 0 65px #ffffff0c,0 18px 32px #00000060; }
	.catalogo:hover::after, .catalogo:focus-within::after { opacity:1; }
	.catalogo h3 { font-size:21px; line-height:1.3; font-weight:500; letter-spacing:-.02em; }
	.catalogo h3 a { color:#f1f2f4; }
	.catalogo h3 a:hover { color:#fff; }
	.catalogo p { font-size:15px; line-height:1.6; color:#b2b5bf; }
	.catalogo dl { margin-top:8px; padding-top:18px; border-top:1px solid #30333b; gap:16px; grid-template-columns:repeat(4,minmax(0,1fr)); }
	.catalogo dt { color:#a9adb8; font:10px ui-monospace,'Courier New',monospace; text-transform:uppercase; letter-spacing:.1em; }
	.catalogo dd { margin-top:8px; color:#e3e5eb; font-size:14px; font-weight:400; }
	.catalogo time { font:13px ui-monospace,'Courier New',monospace; }
	.catalogo .astra-tag { padding:2px 7px; font-size:12px; border-radius:2px; }
	.catalogo .astra-tag--done { color:#edf0f5; background:#33373f; }
	.catalogo .astra-tag--doing { color:#e1e4eb; border-color:#767e8d; }
	.catalogo .astra-tag--todo { color:#bbc0ca; }
	@media(max-width:600px) { .catalogo { padding:22px 18px; } .catalogo h3 { font-size:19px; } .catalogo dl { grid-template-columns:repeat(2,minmax(0,1fr)); row-gap:20px; } }
	@media(prefers-reduced-motion:reduce) { .astra-orbita { animation:none; } .catalogo { transform:none; transition:none; } .catalogo::after { transition:none; } }
</style>
