<script lang="ts">
	import { onMount } from 'svelte';
	let superficie: SVGSVGElement;
	let altura = $state(238);
	const id = $props.id();
	const formas = [
		'M 50 10 C 180 -1 260 15 390 8 S 620 -2 650 29 C 681 59 654 86 661 122 S 681 191 644 214 C 548 241 438 219 312 225 S 105 239 44 216 C 9 203 5 173 13 139 S -4 81 16 49 C 23 27 32 15 50 10 Z',
		'M 45 21 C 155 5 244 23 364 10 S 565 18 623 16 C 678 13 674 47 661 79 S 676 153 660 191 C 648 227 586 222 514 228 S 372 217 249 227 S 69 237 33 212 C 6 193 17 150 12 119 S 9 43 45 21 Z',
		'M 55 13 C 180 2 235 23 360 13 S 581 4 636 24 C 674 37 666 71 657 103 S 678 174 654 204 C 627 237 492 219 382 228 S 153 219 74 225 C 29 227 6 208 13 164 S 7 101 16 64 C 23 35 30 18 55 13 Z'
	];
	// Mantém a curva superior/inferior com altura constante mesmo em textos extensos.
	const adaptadas = $derived(formas.map(forma => {
		let coordenada = 0;
		return forma.replace(/-?\d+(?:\.\d+)?/g, valor => {
			const y = Number(valor);
			if (coordenada++ % 2 === 0) return valor;
			return String(y <= 40 ? y : y >= 198 ? y + altura - 238 : 40 + (y - 40) * (altura - 80) / 158);
		});
	}));
	onMount(() => {
		const cartao = superficie.parentElement!;
		const observer = new ResizeObserver(entries => {
			altura = Math.max(120, entries[0].borderBoxSize?.[0]?.blockSize ?? cartao.clientHeight);
		});
		observer.observe(cartao);
		return () => observer.disconnect();
	});
</script>

<svg class="ov-surface" bind:this={superficie} viewBox={`0 0 672 ${altura}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
	<defs>
		<linearGradient id={`${id}-base`} x1="0" y1="0" x2=".25" y2="1">
			<stop stop-color="#252525" /><stop offset=".48" stop-color="#101010" /><stop offset="1" stop-color="#080808" />
		</linearGradient>
		<linearGradient id={`${id}-edge`} x1="0" y1="0" x2=".1" y2="1">
			<stop stop-color="#939393" /><stop offset=".6" stop-color="#414141" /><stop offset="1" stop-color="#242424" />
		</linearGradient>
		<radialGradient id={`${id}-light`} cx=".3" cy=".05" r=".95">
			<stop stop-color="white" stop-opacity=".16" /><stop offset="1" stop-color="white" stop-opacity="0" />
		</radialGradient>
	</defs>
	{#each adaptadas as forma, i}
		<g class={`ov-shape ov-shape-${i}`}>
			<path d={forma} fill={`url(#${id}-base)`} stroke={`url(#${id}-edge)`} vector-effect="non-scaling-stroke" />
			<path class="ov-reflexo" d={forma} fill={`url(#${id}-light)`} />
		</g>
	{/each}
</svg>

<style>
	.ov-surface { position:absolute; inset:0; width:100%; height:100%; z-index:-1; overflow:visible; pointer-events:none; filter:drop-shadow(0 12px 14px #0008); transition:filter 320ms ease; }
	.ov-shape:not(.ov-shape-0) { display:none; }
	.ov-reflexo { opacity:0; transition:opacity 320ms ease; }
	@media(prefers-reduced-motion:reduce) { .ov-surface,.ov-reflexo { transition:none; } }
</style>
