<script lang="ts">
    import {flip} from 'svelte/animate';
    import {fade} from 'svelte/transition';
    import {entradaCartao,duracaoMovimento} from '../lib/visual/movimento';
    import { criarColecao } from '../lib/colecao.svelte';
    import Carregamento from '../lib/components/Carregamento.svelte';
    import ErroCarregamento from '../lib/components/ErroCarregamento.svelte';
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

    const colecao = criarColecao<Tarefa>([], listarTarefas, 'as tarefas');
    let tarefasFiltradas = $derived(
        colecao.itens.filter((t) => {
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
            {#if !colecao.carregando && !colecao.erro}<p class="ov-count ov-count-desktop">{tarefasFiltradas.length} {tarefasFiltradas.length === 1 ? 'tarefa' : 'tarefas'}</p>{/if}
        </div>
        <a class="astra-btn" href="/tarefas/nova">Nova tarefa</a>
    </div>
    <Filtros />
    <AlternarVisao atual="lista" />
    {#if !colecao.carregando && !colecao.erro}<p class="ov-count ov-count-mobile">{tarefasFiltradas.length} {tarefasFiltradas.length === 1 ? 'tarefa' : 'tarefas'}</p>{/if}
    <section aria-label="Lista de tarefas">
        {#if colecao.carregando}
            <Carregamento />
        {:else if colecao.erro}
            <ErroCarregamento mensagem={colecao.erro} tentar={() => colecao.carregar()} />
        {:else if colecao.itens.length === 0}
            <p class="astra-muted estado-mensagem" role="status">Nenhuma tarefa cadastrada ainda.</p>
        {:else if tarefasFiltradas.length === 0}
            <p class="astra-muted estado-mensagem" role="status">Nenhuma tarefa encontrada com a busca e os filtros atuais.</p>
        {:else}
            <div class="astra-list lista-tarefas ov-grid">
                {#each tarefasFiltradas as tarefa,i (tarefa.id)}
                    <div class="item-movimento" animate:flip={{duration:duracaoMovimento(220)}} in:entradaCartao={{indice:i}} out:fade={{duration:duracaoMovimento(160)}}>
                    <TarefaCard {tarefa}
                        onstatus={(nova) => colecao.itens = colecao.itens.map((t) => t.id === nova.id ? nova : t)}
                        onexcluir={(id) => colecao.itens = colecao.itens.filter((t) => t.id !== id)} />
                    </div>
                {/each}
            </div>
        {/if}
    </section>
</main>

<style>
    .titulo-lista { display:flex; flex-direction:column; gap:10px; }
</style>
