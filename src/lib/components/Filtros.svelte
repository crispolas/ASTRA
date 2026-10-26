<script lang="ts">
    import {
        buscaTexto,
        filtroStatus,
        filtroPrioridade,
    } from "../stores/filtros";
</script>

<div
    class="astra-filters"
    style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;"
>
    <div style="flex: 1; min-width: 200px;">
        <label for="busca-titulo" class="sr-only">Buscar por título</label>
        <input
            id="busca-titulo"
            type="search"
            placeholder="Buscar por título..."
            bind:value={$buscaTexto}
            class="astra-input"
        />
    </div>

    <div>
        <label for="filtro-status" class="sr-only">Filtrar por status</label>
        <select
            id="filtro-status"
            bind:value={$filtroStatus}
            class="astra-select"
        >
            <option value="">Todos os status</option>
            <option value="a-fazer">A fazer</option>
            <option value="em-andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
        </select>
    </div>

    <div>
        <label for="filtro-prioridade" class="sr-only"
            >Filtrar por prioridade</label
        >
        <select
            id="filtro-prioridade"
            bind:value={$filtroPrioridade}
            class="astra-select"
        >
            <option value="">Todas as prioridades</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
        </select>
    </div>
</div>
