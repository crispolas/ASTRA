<script lang="ts">
	let { atual }: { atual: 'lista' | 'quadro' } = $props();
</script>

<nav aria-label="Visualização de tarefas">
	<a href="/" aria-current={atual === 'lista' ? 'page' : undefined}>Lista</a>
	<a href="/quadro" aria-current={atual === 'quadro' ? 'page' : undefined}>Quadro</a>
</nav>

<style>
	nav { display:flex; flex-wrap:wrap; gap:4px; align-self:start; padding:4px; border:1px solid #626873; border-radius:3px; }
	a { min-height:44px; display:flex; align-items:center; justify-content:center; padding:10px 20px; color:#c3c6ce; text-decoration:none; font:13px ui-monospace,'Courier New',monospace; border:1px solid transparent; border-radius:2px; transition:box-shadow 180ms,border-color 180ms; }
	a:hover, a:focus-visible { color:#fff; border-color:#e4ecff; box-shadow:0 0 18px #ffffff26; }
	a[aria-current='page'] { color:#111318; background:#eceef2; }
	a:focus-visible { outline:2px solid #fff; outline-offset:3px; }
</style>
