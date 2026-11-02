<script lang="ts">
    import { onMount } from "svelte";
    import TarefaCard from "#lib/components/TarefaCard.svelte";
    import Filtros from "#lib/components/Filtros.svelte";
    import {
        buscaTexto,
        filtroStatus,
        filtroPrioridade,
    } from "#lib/stores/filtros";
    import { listarTarefas } from "#lib/api";
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

<Filtros />

{#if carregando}
    <p class="estado-mensagem">Carregando tarefas...</p>
{:else if erro}
    <p class="estado-erro">Erro: {erro}</p>
{:else if tarefasFiltradas.length === 0}
    <p class="estado-mensagem">Nenhuma tarefa encontrada.</p>
{:else}
    <div class="lista-tarefas">
        {#each tarefasFiltradas as tarefa (tarefa.id)}
            <TarefaCard {tarefa} />
        {/each}
    </div>
{/if}
