<script lang="ts">
    import {
        buscaTexto,
        filtroStatus,
        filtroPrioridade,
    } from "../stores/filtros";
</script>

<div class="astra-filters">
    <div>
        <label for="busca-titulo">Buscar por título</label>
        <input
            id="busca-titulo"
            type="search"
            placeholder="Buscar por título..."
            bind:value={$buscaTexto}
            class="astra-input"
        />
    </div>

    <div>
        <label for="filtro-status">Filtrar por status</label>
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
        <label for="filtro-prioridade"
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

<style>
    .astra-filters { display:grid; grid-template-columns:minmax(0,1.6fr) repeat(2,minmax(0,1fr)); gap:20px; padding:22px 0; border-block:1px solid #34363d; }
    .astra-filters > div { min-width:0; }
    label { display:block; margin-bottom:10px; color:#b7b9c1; font:11px ui-monospace,'Courier New',monospace; letter-spacing:.025em; }
    input, select { width:100%; min-width:0; min-height:46px; padding:11px 12px; border:1px solid #464951; border-radius:3px; background:#111317; color:#f1f2f4; font-size:14px; color-scheme:dark; }
    input::placeholder { color:#a6a9b1; }
    input:hover, select:hover { border-color:#989da9; }
    @media(max-width:700px) { .astra-filters { grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px 12px; } .astra-filters > div:first-child { grid-column:1 / -1; } }
    @media(max-width:480px) { .astra-filters { grid-template-columns:minmax(0,1fr); } }
</style>
