<script lang="ts">
 import {flip} from 'svelte/animate';
 import {fade} from 'svelte/transition';
 import {entradaCartao,duracaoMovimento} from '../../lib/visual/movimento';
 import {untrack} from 'svelte';
 import {criarColecao} from '../../lib/colecao.svelte';
 import {listarProjetos} from '../../lib/api';
 import type {Projeto} from '../../tipos';
 import Carregamento from '../../lib/components/Carregamento.svelte';
 import ErroCarregamento from '../../lib/components/ErroCarregamento.svelte';
	import { interacaoOrbital } from '../../lib/visual/interacao';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
 const colecao=criarColecao<Projeto>(untrack(()=>data.projetos),listarProjetos,'os projetos');
</script>

<svelte:head><title>Projetos · ASTRA</title></svelte:head>

<main class="astra-page">
	<div class="astra-head">
		<div style="display:flex; flex-direction:column; gap:8px;">
			<span class="astra-eyebrow">Lista de projetos</span>
			<h1>Projetos</h1>
            {#if !colecao.carregando && !colecao.erro}<p class="ov-count">{colecao.itens.length} {colecao.itens.length === 1 ? 'projeto' : 'projetos'}</p>{/if}
		</div>
	</div>

	{#if colecao.carregando}
        <Carregamento nome="projetos" />
    {:else if colecao.erro}
        <ErroCarregamento mensagem={colecao.erro} tentar={()=>colecao.carregar()} />
    {:else if colecao.itens && colecao.itens.length > 0}
		<ul class="astra-list lista-projetos ov-grid">
			{#each colecao.itens as projeto,i (projeto.id)}
				<li class="item-movimento" animate:flip={{duration:duracaoMovimento(220)}} in:entradaCartao={{indice:i}} out:fade={{duration:duracaoMovimento(160)}}>
                  <div class="astra-orbita">
					<article class="astra-card card-projeto ov-organic" use:interacaoOrbital>

					<h3>{projeto.nome}</h3>
					{#if projeto.descricao}
						<p class="astra-muted">{projeto.descricao}</p>
					{/if}
					<a class="astra-pill" href="/projetos/{projeto.id}">Ver detalhes do projeto</a>
					</article>
                  </div>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="astra-muted">Nenhum projeto encontrado.</p>
	{/if}
</main>

<style>
	.lista-projetos {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.card-projeto {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}
</style>
