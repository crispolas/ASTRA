<script lang="ts">
	import { onMount } from 'svelte';
	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const contexto = ctx;
		const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
		const eventos = new AbortController();
		let largura = innerWidth, altura = innerHeight, frame = 0, ultimo = 0, estado = 72;
		const cursor = { x: -9999, y: -9999 };
		type Estrela = { x: number; y: number; fase: number; velocidade: number; tamanho: number; grande: boolean; glifo: string; brilho: number; dx: number; dy: number };
		let estrelas: Estrela[] = [];
		function sorteio() {
			estado = (estado * 1664525 + 1013904223) >>> 0;
			return estado / 4294967296;
		}
		function desenhar(tempo: number) {
			contexto.clearRect(0, 0, largura, altura);
			const t = reduzido.matches ? 0 : tempo * .0001;
			for (const e of estrelas) {
				let x = e.x + Math.sin(t * e.velocidade + e.fase) * (e.grande ? 8 : 16);
				let y = e.y + Math.cos(t * .7 * e.velocidade + e.fase) * (e.grande ? 12 : 18);
				const vx = x - cursor.x, vy = y - cursor.y, distancia = Math.hypot(vx, vy);
				const forca = Math.max(0, 1 - distancia / 150);
				const alvoX = reduzido.matches ? 0 : vx / (distancia || 1) * forca * 12;
				const alvoY = reduzido.matches ? 0 : vy / (distancia || 1) * forca * 12;
				e.dx += (alvoX - e.dx) * .06; e.dy += (alvoY - e.dy) * .06;
				x += e.dx; y += e.dy;
				contexto.font = `${e.tamanho}px 'Courier New',monospace`;
				contexto.textAlign = 'center'; contexto.textBaseline = 'middle';
				contexto.fillStyle = `rgba(229,233,244,${Math.min(.9, e.brilho + forca * .5)})`;
				contexto.shadowColor = '#f1f4ff'; contexto.shadowBlur = forca * 11;
				if (e.grande) {
					['  .  ', '  |  ', '.-+-.', '  |  ', '  ·  '].forEach((linha, i) => contexto.fillText(linha, x, y + (i - 2) * e.tamanho * .83));
				} else contexto.fillText(e.glifo, x, y);
			}
			contexto.shadowBlur = 0;
		}
		function preparar() {
			largura = innerWidth; altura = innerHeight;
			const dpr = Math.min(devicePixelRatio || 1, 2);
			canvas.width = largura * dpr; canvas.height = altura * dpr;
			contexto.setTransform(dpr, 0, 0, dpr, 0, 0);
			estrelas = []; estado = 72;
			for (let i = 0; i < 92; i++) {
				const grande = i < 15;
				let x = sorteio() * largura, y = sorteio() * altura;
				if (grande) {
					const margem = largura > 900 ? Math.max(42, (largura - 1256) / 2 + 24) : 18;
					x = i % 2 ? largura - sorteio() * margem : sorteio() * margem;
					y = 120 + sorteio() * (altura - 150);
				}
				estrelas.push({ x, y, fase: sorteio() * 6.28, velocidade: .5 + sorteio() * .6,
					tamanho: grande ? 10 + sorteio() * 3 : 9 + sorteio() * 4, grande,
					glifo: ['.', '+', '*', ':'][Math.floor(sorteio() * 4)], brilho: .2 + sorteio() * .32, dx: 0, dy: 0 });
			}
			desenhar(performance.now());
		}
		function animar(tempo: number) {
			if (tempo - ultimo > 32) { desenhar(tempo); ultimo = tempo; }
			frame = requestAnimationFrame(animar);
		}
		function atualizarMovimento() {
			cancelAnimationFrame(frame);
			if (document.hidden) return;
			if (reduzido.matches) desenhar(0);
			else frame = requestAnimationFrame(animar);
		}
		const options = { signal: eventos.signal, passive: true };
		window.addEventListener('resize', preparar, options);
		window.addEventListener('pointermove', (e) => {
			cursor.x = e.clientX; cursor.y = e.clientY;
			if (reduzido.matches) desenhar(0);
		}, options);
		document.addEventListener('pointerleave', () => { cursor.x = cursor.y = -9999; if (reduzido.matches) desenhar(0); }, options);
		document.addEventListener('visibilitychange', atualizarMovimento, options);
		reduzido.addEventListener('change', atualizarMovimento, options);
		preparar(); atualizarMovimento();
		return () => { cancelAnimationFrame(frame); eventos.abort(); };
	});
</script>

<canvas bind:this={canvas} id="ceu-ascii" aria-hidden="true"></canvas>

<style>
	canvas { position:fixed; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; }
</style>
