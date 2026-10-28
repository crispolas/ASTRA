<script lang="ts">
	let { atual }: { atual: 'lista' | 'quadro' } = $props();
</script>

<nav aria-label="Visualização de tarefas">
	<a href="/" aria-current={atual === 'lista' ? 'page' : undefined}>Lista</a>
	<a href="/quadro" aria-current={atual === 'quadro' ? 'page' : undefined}>Quadro</a>
</nav>

<style>
	nav { display:flex; flex-wrap:wrap; gap:4px; align-self:start; padding:4px; border:1px solid #626873; border-radius:3px; }
	a { min-height:44px; display:flex; align-items:center; justify-content:center; padding:10px 20px; color:#c3c6ce; text-decoration:none; font:13px ui-monospace,'Courier New',monospace; border:1px solid transparent; border-radius:2px; }
	a:hover { color:#fff; border-color:#8a919e; }
	a[aria-current='page'] { color:#111318; background:#eceef2; }
	a:focus-visible { outline:2px solid #fff; outline-offset:3px; }
</style>
