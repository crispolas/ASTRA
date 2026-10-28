<script lang="ts">
	import { caminhosConstelacao } from '../entrada/constelacao';
	let { compacta = false }: { compacta?: boolean } = $props();
	const pontos = [...new Map(
		caminhosConstelacao.flat().map(([x, y]) => [`${x},${y}`, [x, y]])
	).values()];
</script>

<svg viewBox="0 0 1200 300" fill="none" aria-hidden="true" focusable="false">
	{#each caminhosConstelacao as caminho}
		<polyline points={caminho.map(([x, y]) => `${x},${y}`).join(' ')} />
	{/each}
	{#each pontos as [x, y], i}
		<circle cx={x} cy={y} r={compacta ? (i % 4 === 0 ? 9 : 6) : (i % 4 === 0 ? 4.6 : 2.8)} />
	{/each}
</svg>

<style>
	svg { display: block; width: 100%; height: auto; overflow: visible; }
	polyline { stroke: #adD3ee; stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
	circle { fill: #e6f7ff; filter: drop-shadow(0 0 5px #a9dfff); transition: r 950ms; }
	@media (prefers-reduced-motion: reduce) { circle { transition: none; } }
</style>
