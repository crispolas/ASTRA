<script lang="ts">
	import { onMount } from 'svelte';
	import { iniciarCeu } from '../visual/ceu';
	let estrelas: HTMLCanvasElement;
	let cadentes: HTMLCanvasElement;
	onMount(() => iniciarCeu(estrelas, cadentes));
</script>

<canvas bind:this={estrelas} id="ceu-ascii" aria-hidden="true"></canvas>
<canvas bind:this={cadentes} class="cadentes" aria-hidden="true"></canvas>

<style>
	canvas { position:fixed; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; }
	.cadentes { z-index:0; }
</style>
