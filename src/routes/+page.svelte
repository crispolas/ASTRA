<script lang="ts">
    import { onMount } from 'svelte';
    import TarefaCard from '#lib/components/TarefaCard.svelte';
    import Filtros from '#lib/components/Filtros.svelte';
    import { buscaTexto, filtroStatus, filtroPrioridade } from '../lib/stores/filtros';
    import { listarTarefas } from '../lib/api';
    import type { Tarefa } from '../tipos';

    let tarefas = $state<Tarefa[]>([]);
    let carregando = $state(true);
    let erro = $state('');

    // Reatividade para aplicar os 3 filtros simultaneamente
    let tarefasFiltradas = $derived(
        tarefas.filter((t) => {
            const bateTexto = t.titulo.toLowerCase().includes($buscaTexto.toLowerCase());
            const bateStatus = $filtroStatus ? t.status === $filtroStatus : true;
            const batePrioridade = $filtroPrioridade ? t.prioridade === $filtroPrioridade : true;
            return bateTexto && bateStatus && batePrioridade;
        })
    );

    onMount(async () => {
        try {
            tarefas = await listarTarefas();
        } catch {
            erro = 'Não foi possível carregar as tarefas. Confira se a API está ligada.';
        } finally {
            carregando = false;
        }
    });
</script>

<main class="astra-page observatorio">
    <div class="assinatura" aria-hidden="true"><span>+ — — ·</span><span>A S T R A / /</span></div>
    <div class="astra-head">
        <div class="titulo">
            <span class="astra-eyebrow">Página inicial</span>
            <h1>Tarefas</h1>
        </div>
        <a class="astra-btn nova-tarefa" href="/tarefas/nova"><span aria-hidden="true">+</span> Nova tarefa</a>
    </div>

    <Filtros />

    <section aria-label="Lista de tarefas">
        {#if carregando}
            <p class="astra-muted" role="status">Carregando tarefas...</p>
        {:else if erro}
            <p class="astra-error" role="alert">Erro: {erro}</p>
        {:else if tarefasFiltradas.length === 0}
            <p class="astra-muted">Nenhuma tarefa encontrada.</p>
        {:else}
            <div class="astra-list">
                {#each tarefasFiltradas as tarefa (tarefa.id)}
                    <TarefaCard tarefa={tarefa} variante="catalogo" />
                {/each}
            </div>
        {/if}
    </section>
</main>

<style>
    main.observatorio { position:relative; z-index:1; max-width:1256px; padding:32px clamp(24px,5vw,64px) 80px; gap:32px; }
    .assinatura { display:flex; justify-content:space-between; color:#a0a3ae; font:11px ui-monospace,'Courier New',monospace; letter-spacing:.18em; }
    .titulo { display:flex; flex-direction:column; gap:10px; }
    .astra-eyebrow { font:11px ui-monospace,'Courier New',monospace; letter-spacing:.16em; color:#a9abb2; }
    h1 { font-size:clamp(42px,6vw,68px); font-weight:500; letter-spacing:-.055em; }
    .astra-head { align-items:end; padding-bottom:4px; }
    .nova-tarefa { display:inline-flex; align-items:center; gap:20px; padding:13px 20px; border-radius:3px; background:#eceef2; font-size:14px; font-weight:600; text-decoration:none; color:#111318; }
    .nova-tarefa span { font:22px/1 'Courier New',monospace; }
    .nova-tarefa:hover { color:#111318; background:#fff; }
    .astra-list { gap:24px; perspective:1200px; }
    section { min-width:0; }
    @media(max-width:600px) { main.observatorio { gap:24px; padding-top:24px; } .nova-tarefa { gap:10px; padding:12px 14px; } .astra-head { gap:20px; } .assinatura { font-size:10px; } .astra-list { gap:22px; } }
</style>
