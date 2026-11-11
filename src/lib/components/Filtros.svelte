<script lang="ts">
    import SeletorArredondado from "./SeletorArredondado.svelte";
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

    <SeletorArredondado id="filtro-status" rotulo="Filtrar por status" bind:valor={$filtroStatus}
        opcoes={[
            { valor: '', nome: 'Todos os status' },
            { valor: 'a-fazer', nome: 'A fazer' },
            { valor: 'em-andamento', nome: 'Em andamento' },
            { valor: 'concluida', nome: 'Concluída' }
        ]} />
    <SeletorArredondado id="filtro-prioridade" rotulo="Filtrar por prioridade" bind:valor={$filtroPrioridade}
        opcoes={[
            { valor: '', nome: 'Todas as prioridades' },
            { valor: 'baixa', nome: 'Baixa' },
            { valor: 'media', nome: 'Média' },
            { valor: 'alta', nome: 'Alta' }
        ]} />
</div>

<style>
    .astra-filters { display:grid; grid-template-columns:minmax(0,1.6fr) repeat(2,minmax(0,1fr)); gap:20px; padding:22px 0; border-block:1px solid #34363d; }
    .astra-filters > div { min-width:0; }
    label { display:block; margin-bottom:10px; color:#b7b9c1; font:11px ui-monospace,'Courier New',monospace; letter-spacing:.025em; }
    input { width:100%; min-width:0; min-height:46px; padding:11px 12px; border:1px solid #464951; border-radius:3px; background:#111317; color:#f1f2f4; font-size:14px; color-scheme:dark; }
    input::placeholder { color:#a6a9b1; }
    input:hover { border-color:#989da9; }
    @media(max-width:700px) { .astra-filters { grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px 12px; } .astra-filters > div:first-child { grid-column:1 / -1; } }
    @media(max-width:480px) { .astra-filters { grid-template-columns:minmax(0,1fr); } }
</style>
