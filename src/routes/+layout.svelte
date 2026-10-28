<script lang="ts">

	import favicon from '#lib/assets/favicon.svg';
    import '#lib/astra-theme.css';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import MarcaAstra from '../lib/components/MarcaAstra.svelte';
	import TransicaoEntrada from '../lib/components/TransicaoEntrada.svelte';
	import { transicaoEntrada } from '../lib/entrada/transicao';
	import CeuAscii from '../lib/components/CeuAscii.svelte';


	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<TransicaoEntrada />

<div class:catalogo={page.url.pathname === '/'}>
{#if page.url.pathname === '/'}<CeuAscii />{/if}
{#if page.url.pathname !== '/inicio'}
<header class="astra-page cabecalho">
	<a class="marca-entrada" href="/inicio" aria-label="ASTRA — tela inicial" data-astra-brand
		style:visibility={$transicaoEntrada === 'oculta' ? 'visible' : 'hidden'}>
		<MarcaAstra compacta />
	</a>
	<nav class="astra-nav" aria-label="Navegação principal">
        <ul>
            <li>
                <a href="/" aria-current={page.url.pathname === '/' || page.url.pathname.startsWith('/tarefas') ? 'page' : undefined}>Tarefas</a>
            </li>
            <li>
                <a href="/projetos" aria-current={page.url.pathname.startsWith('/projetos') ? 'page' : undefined}>Projetos</a>
            </li>
            <li>
                <a href="/quadro" aria-current={page.url.pathname === '/quadro' ? 'page' : undefined}>Quadro Kanban</a>
            </li>
        </ul>
    </nav>
</header>
{/if}

{@render children()}
</div>

<style>
	.cabecalho { padding-top:28px; padding-bottom:24px; flex-direction:row; align-items:center; justify-content:space-between; gap:24px; }
	.marca-entrada { display:block; flex:none; width:180px; height:45px; }
	nav a { display:block; padding:12px 0; color:var(--astra-muted); text-decoration:none; font:13px ui-monospace,'Courier New',monospace; letter-spacing:.04em; border-bottom:1px solid transparent; }
	nav ul { gap:28px; }
	nav a:hover { color:var(--astra-text); }
	nav a[aria-current='page'] { color:var(--astra-text); border-color:currentColor; }
	.catalogo { min-height:100svh; isolation:isolate; background:#08090b; color:#f1f2f4; --astra-text:#f1f2f4; --astra-muted:#a9abb2; --astra-accent-soft:#e2e6ec; --astra-accent-2:#e2e6ec; }
	.catalogo .cabecalho { position:relative; z-index:1; max-width:1256px; padding-inline:clamp(24px,5vw,64px); border-bottom:1px solid #30333a; }
	@media(max-width:700px) { .cabecalho { flex-wrap:wrap; gap:16px; } .marca-entrada { width:140px; height:35px; } nav ul { gap:18px; } nav a { font-size:12px; } }
</style>
