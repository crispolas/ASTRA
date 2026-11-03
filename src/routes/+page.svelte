<script lang="ts">
    import { onMount } from "svelte";
    import TarefaCard from "#lib/components/TarefaCard.svelte";
    import Filtros from "#lib/components/Filtros.svelte";
    import AlternarVisao from "#lib/components/AlternarVisao.svelte";
    import {
        buscaTexto,
        filtroStatus,
        filtroPrioridade,
    } from "../lib/stores/filtros";
    import { listarTarefas } from "../lib/api";
    import type { Tarefa } from "../tipos";

    let tarefas = $state<Tarefa[]>([]);

    let carregando = $state(true);
    let erro = $state<string | null>(null);

    onMount(async () => {
        try {
            carregando = true;
            erro = null;
            tarefas = await listarTarefas();
        } catch (e) {
            erro =
                "Não foi possível carregar as tarefas. Confira se a API está ligada.";
        } finally {
            carregando = false;
        }
    });

    let tarefasFiltradas = $derived(
        tarefas.filter((t) => {
            const bateTexto = t.titulo
                .toLowerCase()
                .includes($buscaTexto.toLowerCase());
            const bateStatus = $filtroStatus
                ? t.status === $filtroStatus
                : true;
            const batePrioridade = $filtroPrioridade
                ? t.prioridade === $filtroPrioridade
                : true;
            return bateTexto && bateStatus && batePrioridade;
        }),
    );
</script>

<main class="astra-page">
    <div class="astra-head">
        <div class="titulo-lista">
            <span class="astra-eyebrow">Página inicial</span>
            <h1>Tarefas</h1>
        </div>
        <a class="astra-btn" href="/tarefas/nova">Nova tarefa</a>
    </div>
    <AlternarVisao atual="lista" />
    <Filtros />
    <section aria-label="Lista de tarefas">
        {#if carregando}
            <p class="astra-muted estado-mensagem" role="status">Carregando tarefas...</p>
        {:else if erro}
            <p class="astra-error estado-erro" role="alert">Erro: {erro}</p>
        {:else if tarefasFiltradas.length === 0}
            <p class="astra-muted estado-mensagem">Nenhuma tarefa encontrada.</p>
        {:else}
            <div class="astra-list lista-tarefas">
                {#each tarefasFiltradas as tarefa (tarefa.id)}
                    <TarefaCard {tarefa}
                        onstatus={(nova) => tarefas = tarefas.map((t) => t.id === nova.id ? nova : t)}
                        onexcluir={(id) => tarefas = tarefas.filter((t) => t.id !== id)} />
                {/each}
            </div>
        {/if}
    </section>
</main>

<style>
    .titulo-lista { display:flex; flex-direction:column; gap:10px; }
</style>
