<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { invalidateAll } from '$app/navigation';
	import { atualizarTarefa } from '../../lib/api';
	import TarefaCard from '../../lib/components/TarefaCard.svelte';
	import Filtros from '../../lib/components/Filtros.svelte';
	import AlternarVisao from '../../lib/components/AlternarVisao.svelte';
	import { buscaTexto, filtroStatus, filtroPrioridade, aplicarFiltros } from '../../lib/stores/filtros';
	import type { PageData } from './$types';
	import type { Tarefa } from '../../tipos';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let tarefasFiltradas = $derived(
		aplicarFiltros(data.tarefas, $buscaTexto, $filtroStatus, $filtroPrioridade)
	);

	const colunas: { id: Tarefa['status']; titulo: string }[] = [
		{ id: 'a-fazer', titulo: 'A fazer' },
		{ id: 'em-andamento', titulo: 'Em andamento' },
		{ id: 'em-revisao', titulo: 'Em revisão' },
		{ id: 'concluida', titulo: 'Concluída' }
	];

	let idTarefaArrastada = $state<string | null>(null);
	let destino = $state<Tarefa['status'] | null>(null);
	let salvandoArraste = $state<string | null>(null);
	let chegou = $state<string | null>(null);
	let erroArraste = $state('');
	let reduzido = $state(true);
	let imagem: HTMLElement | null = null;
	let limparImagem: ReturnType<typeof setTimeout> | undefined;
	let limparChegada: ReturnType<typeof setTimeout> | undefined;
	onMount(() => {
		const media = matchMedia('(prefers-reduced-motion: reduce)');
		const atualizar = () => { reduzido = media.matches; };
		atualizar(); media.addEventListener('change', atualizar);
		return () => media.removeEventListener('change', atualizar);
	});
	function removerImagem() { clearTimeout(limparImagem); imagem?.remove(); imagem = null; }
	onDestroy(() => { removerImagem(); clearTimeout(limparChegada); });
	function encerrarArraste() { idTarefaArrastada = null; destino = null; removerImagem(); }

	function handleDragStart(event: DragEvent, id: string) {
		if (salvandoArraste || !event.dataTransfer) { event.preventDefault(); return; }
		const alca = event.currentTarget as HTMLElement;
		const cartao = alca.closest<HTMLElement>('.cartao-wrapper');
		if (!cartao) { event.preventDefault(); return; }
		idTarefaArrastada = id; erroArraste = '';
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', id);
		// A imagem nativa copia o cartão inteiro, mesmo começando o gesto pela alça.
		removerImagem();
		const box = cartao.getBoundingClientRect();
		imagem = cartao.cloneNode(true) as HTMLElement;
		imagem.setAttribute('aria-hidden', 'true');
		imagem.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
		imagem.style.cssText = `position:fixed;left:-10000px;top:0;width:${box.width}px;pointer-events:none;`;
		imagem.classList.add('imagem-arraste');
		cartao.parentElement?.append(imagem);
		event.dataTransfer.setDragImage(imagem, Math.min(box.width - 8, Math.max(8, event.clientX - box.left)), 20);
		limparImagem = setTimeout(removerImagem, 0);
	}

	function handleDragOver(event: DragEvent, status: Tarefa['status']) {
		if (!idTarefaArrastada || salvandoArraste) return;
		event.preventDefault(); destino = status;
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
	}
	function handleDragLeave(event: DragEvent, status: Tarefa['status']) {
		if (event.relatedTarget instanceof Node && (event.currentTarget as HTMLElement).contains(event.relatedTarget)) return;
		if (destino === status) destino = null;
	}
	async function handleDrop(event: DragEvent, novoStatus: Tarefa['status']) {
		event.preventDefault();
		const id = idTarefaArrastada;
		encerrarArraste();
		if (!id || salvandoArraste) return;
		if (data.tarefas.find(t => String(t.id) === id)?.status === novoStatus) return;
		salvandoArraste = id; erroArraste = '';
		let salvo = false;
		try {
			await atualizarTarefa(id, { status: novoStatus });
			salvo = true; chegou = id;
			await invalidateAll();
			await tick();
			clearTimeout(limparChegada);
			limparChegada = setTimeout(() => { chegou = null; }, 450);
		} catch {
			chegou = null;
			erroArraste = salvo
				? 'O status foi salvo, mas não foi possível atualizar o quadro. Recarregue a página.'
				: 'Não foi possível mover a tarefa. Ela permanece na coluna original. Tente novamente.';
		} finally { salvandoArraste = null; }
	}

	function filtrarPorStatus(status: Tarefa['status']): Tarefa[] {
		return tarefasFiltradas.filter((t: Tarefa) => t.status === status);
	}
</script>

<main class="astra-page quadro-pagina">
	<div class="astra-head">
		<div style="display:flex; flex-direction:column; gap:8px;">
			<span class="astra-eyebrow">Tarefas · Quadro kanban</span>
			<h1>Quadro de Tarefas</h1>
			<p class="ov-count">{tarefasFiltradas.length} {tarefasFiltradas.length === 1 ? 'tarefa' : 'tarefas'} no observatório</p>
		</div>
		<a class="astra-btn" href="/tarefas/nova" style="text-decoration:none;">Nova tarefa</a>
	</div>

	<Filtros />
	<AlternarVisao atual="quadro" />

	{#if data.tarefas.length === 0}
		<p class="astra-muted" role="status">Nenhuma tarefa cadastrada ainda.</p>
	{:else if tarefasFiltradas.length === 0}
		<p class="astra-muted" role="status">Nenhuma tarefa encontrada com a busca e os filtros atuais.</p>
	{/if}

	{#if erroArraste}<p class="astra-error" role="alert">{erroArraste}</p>{/if}
	{#if salvandoArraste}<p class="aviso-arraste" role="status">Salvando mudança de coluna...</p>{/if}
	<div class="quadro-container" class:arraste-ativo={idTarefaArrastada !== null || salvandoArraste !== null}>
		{#each colunas as coluna (coluna.id)}
			{@const tarefasColuna = filtrarPorStatus(coluna.id)}

			<section
				class="coluna"
                class:destino-arraste={destino === coluna.id}
				data-status={coluna.id}
				aria-label={coluna.titulo}
				ondragover={(e) => handleDragOver(e, coluna.id)}
                ondragleave={(e) => handleDragLeave(e, coluna.id)}
				ondrop={(e) => handleDrop(e, coluna.id)}
			>
				<header class="coluna-cabecalho">
					<h2>{coluna.titulo}</h2>
					<span class="contador" aria-label="{tarefasColuna.length} tarefas">{tarefasColuna.length}</span>
				</header>

				<div class="lista-cards">
					{#each tarefasColuna as tarefa (tarefa.id)}
						<div
							class="cartao-wrapper"
                            data-tarefa-id={tarefa.id}
                            class:arrastando={idTarefaArrastada === String(tarefa.id)}
                            class:salvando-arraste={salvandoArraste === String(tarefa.id)}
                            class:chegada-arraste={chegou === String(tarefa.id)}
                            inert={salvandoArraste === String(tarefa.id)}
                            aria-busy={salvandoArraste === String(tarefa.id)}
                            animate:flip={{ duration: reduzido ? 0 : 200 }}
							role="group"
							aria-label={tarefa.titulo}

						>
							<div class="drag-handle" role="img" aria-label="Arrastar tarefa. Para usar o teclado, altere o seletor de status do cartão."
                                title="Arraste para outra coluna; pelo teclado, use o seletor de status."
                                draggable={salvandoArraste === null}
                                ondragstart={(e) => handleDragStart(e, String(tarefa.id))}
                                ondragend={encerrarArraste}>
								⠿ Arrastar cartão
							</div>
							<TarefaCard {tarefa} onstatus={() => invalidateAll()} />
						</div>
					{:else}
						<p class="vazio">Nenhuma tarefa nesta coluna.</p>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</main>

<style>
	.quadro-pagina {
		max-width: 1500px;
	}

	.quadro-container {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
		align-items: stretch;
	}

	/* faixa (coluna) do kanban */
	.coluna {
		--cor-status: var(--astra-muted);
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 16px;
		background: #101319;
		border: 1px solid var(--astra-glass-border);
		border-top: 2px solid var(--cor-status);
		border-radius: 3px;
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
		min-height: 500px; /* Garante que colunas vazias aceitem o drop em toda a sua extensão */
	}

	.coluna[data-status='em-andamento'] { --cor-status: var(--astra-accent-2); }
	.coluna[data-status='em-revisao']   { --cor-status: var(--astra-accent-pale); }
	.coluna[data-status='concluida']    { --cor-status: var(--astra-accent); }

	.coluna-cabecalho {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 4px 4px 0;
	}

	.coluna-cabecalho h2 {
		font-size: 20px;
		letter-spacing: 1px;
		text-transform: uppercase;
	}

	.contador {
		min-width: 32px;
		padding: 2px 10px;
		font-size: 18px;
		font-weight: 700;
		text-align: center;
		color: var(--astra-on-action);
		background: var(--cor-status);
		border-radius: 3px;
	}

	.lista-cards {
		display: flex;
		flex-direction: column;
		gap: 16px;
		flex: 1;
		min-height: 140px;
	}

	/* --- ESTRUTURA E REGRAS DE ARRASTE --- */
	.cartao-wrapper {
		display: flex;
		flex-direction: column;
		gap: 6px;
		cursor: grab;
	}

	.cartao-wrapper:active {
		cursor: grabbing;
	}

	.drag-handle {
		background: #1c2029;
		color: var(--astra-muted, #a1a1aa);
		border: 1px dashed var(--astra-glass-border, #27272a);
		font-size: 0.75rem;
		text-align: center;
		padding: 6px;
		border-radius: 3px;
		user-select: none;
		-webkit-user-select: none;
		font-weight: 600;
		letter-spacing: 0.5px;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.drag-handle:hover {
		background: #252a36;
		color: #ffffff;
	}

	.drag-handle { cursor:grab; touch-action:pan-y; }
	.drag-handle:active { cursor:grabbing; }
	.cartao-wrapper { cursor:default; }
	.cartao-wrapper.arrastando { opacity:.35; outline:1px dashed #ccd8ed; outline-offset:4px; border-radius:10px; }
	.cartao-wrapper.salvando-arraste { opacity:.6; cursor:progress; }
	.cartao-wrapper.chegada-arraste { animation:acomodar 280ms ease-out; }
	.cartao-wrapper:global(.imagem-arraste) { background:#151515; border:1px solid #e7edf7; border-radius:10px; box-shadow:0 8px 28px #dceaff40; }
	.cartao-wrapper:global(.imagem-arraste) :global(.astra-orbita),
	.arraste-ativo :global(.astra-orbita) { animation-play-state:paused; }
	.arraste-ativo :global(.astra-card[data-orbital]) { transform:none; }
	.coluna.destino-arraste { outline:1px solid #dceaff; outline-offset:2px; box-shadow:0 0 30px #dceaff20,inset 0 0 25px #ffffff06; }
	.aviso-arraste { margin:0; color:var(--astra-muted); font-size:14px; }
	@keyframes acomodar { from { opacity:.65; transform:translateY(-8px) scale(.985); } to { opacity:1; transform:none; } }
	@media(prefers-reduced-motion:reduce) { .cartao-wrapper.chegada-arraste { animation:none; } }
	/* ------------------------------------- */

	/* cartão compacto de kanban */
	.lista-cards :global(.tarefa-card) {
		padding: 18px;
		gap: 10px;
		background: var(--astra-grad-glass);
		border-radius: 3px;
	}

	.lista-cards :global(.tarefa-card:hover) {
		border-color: var(--astra-accent-soft);
	}

	.lista-cards :global(.tarefa-card h3) {
		font-size: 18px;
		line-height: 1.25;
	}

	.lista-cards :global(.tarefa-card .astra-sparkle) {
		width: 18px;
		height: 18px;
	}

	/* descrição limitada a 2 linhas */
	.lista-cards :global(.tarefa-card > p) {
		font-size: 16px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.lista-cards :global(.tarefa-card .astra-meta) {
		grid-template-columns: 1fr 1fr;
		gap: 8px 12px;
	}

	.lista-cards :global(.tarefa-card .astra-meta dt) {
		font-size: 14px;
	}

	.lista-cards :global(.tarefa-card .astra-meta dd) {
		font-size: 16px;
		margin-top: 2px;
	}

	/* faixa vazia */
	.vazio {
		margin: 0;
		padding: 24px 12px;
		font-size: 16px;
		text-align: center;
		color: var(--astra-muted);
		border: 1px dashed var(--astra-glass-border);
		border-radius: 3px;
	}

	@media(max-width:1100px) { .quadro-container { grid-template-columns:repeat(2,minmax(0,1fr)); } }
	@media(max-width:640px) { .quadro-container { grid-template-columns:minmax(0,1fr); } }

	@media (prefers-reduced-motion: reduce) {
		.lista-cards :global(.tarefa-card) {
			transition: none;
		}
	}
</style>
