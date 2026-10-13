<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
    <nav>
        <ul>
            <li>
                <a href="/">Página inicial</a>
            </li>
            <li>
                <a href="/projetos">Projetos</a> 
            </li>
            <li>
                <a href="/tarefas/[id]">Tarefas</a>
            </li>
        </ul>
    </nav>
</header>

{@render children()}
