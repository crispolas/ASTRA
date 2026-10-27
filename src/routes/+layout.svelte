<script lang="ts">

	import favicon from '#lib/assets/favicon.svg';
    import '#lib/astra-theme.css';
	import type { LayoutProps } from './$types';


	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="astra-page" style="padding-top: 32px; padding-bottom: 0;">
	<nav class="astra-nav">
        <ul>
            <li>
                <a class="astra-pill" href="/">Página inicial</a>
            </li>
            <li>
                <a class="astra-pill" href="/projetos">Projetos</a> 
            </li>
            <li>
                <a class="astra-pill" href="/">Tarefas</a>
            </li>
            <li>
                <a class="astra-pill" href="/quadro">Quadro Kanban</a>
            </li>
        </ul>
    </nav>
</header>

{@render children()}

