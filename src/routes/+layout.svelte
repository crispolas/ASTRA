<script lang="ts">

	import favicon from '#lib/assets/favicon.svg';
    import '#lib/astra-theme.css';
    import '#lib/orbita-viva.css';
    import '#lib/planetario.css';
    import '#lib/observatorio.css';
    import { onMount, tick } from 'svelte';
    import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
    import { orientar, setorDaRota, vistas } from '../lib/visual/observatorio';
	import type { LayoutProps } from './$types';
	import { navigating, page } from '$app/state';
	import MarcaAstra from '../lib/components/MarcaAstra.svelte';
	import TransicaoEntrada from '../lib/components/TransicaoEntrada.svelte';
	import AbrindoJanela from '../lib/components/AbrindoJanela.svelte';
	import { transicaoEntrada } from '../lib/entrada/transicao';
	import { ehRotaDeJanela, janela, voltarDaJanela } from '../lib/janela.svelte';
	import CeuAscii from '../lib/components/CeuAscii.svelte';


	let { children }: LayoutProps = $props();
    let plano = $state<HTMLDivElement>();
    let emGiro = $state(false);
    let animacao: Animation | undefined;
    let turno = 0;
    let montado = false;
    let reduzido: MediaQueryList;

    // Janela: detalhe, nova tarefa e edição abrem por cima da tela de origem, que continua no menu e no céu.
    const ehJanela = $derived(ehRotaDeJanela(page.url.pathname));
    const rotaBase = $derived(ehJanela ? janela.origem : page.url.pathname);
    const setor = $derived(setorDaRota(rotaBase));
    let troca = $state(false);
    let fundo = $state<{ copia: HTMLElement; top: number; left: number; width: number } | null>(null);
    const abrindo = $derived.by(() => {
        const destino = navigating.to?.url.pathname;
        if (!destino || !ehRotaDeJanela(destino) || ehJanela) return null;
        if (destino.endsWith('/nova')) return { titulo: 'Nova tarefa', formulario: true };
        if (destino.endsWith('/editar')) return { titulo: 'Editar tarefa', formulario: true };
        return { titulo: janela.titulo || 'Tarefa', formulario: false };
    });

    beforeNavigate((navigation) => {
        const de = navigation.from?.url.pathname, para = navigation.to?.url.pathname;
        if (!para || navigation.willUnload) return;
        troca = ehRotaDeJanela(de) && ehRotaDeJanela(para);
        if (!ehRotaDeJanela(para)) { janela.profundidade = 0; fundo = null; return; }
        if (!ehRotaDeJanela(de)) {
            // Saindo de uma tela comum: ela vira a origem e uma cópia parada dela fica atrás da janela.
            janela.origem = de ?? '/';
            janela.profundidade = 0;
            const main = plano?.querySelector<HTMLElement>(':scope > main');
            if (main) {
                const caixa = main.getBoundingClientRect();
                const copia = main.cloneNode(true) as HTMLElement;
                copia.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
                fundo = { copia, top: caixa.top, left: caixa.left, width: caixa.width };
            }
        }
        if (navigation.type === 'popstate') janela.profundidade = Math.max(0, janela.profundidade - 1);
        else janela.profundidade++;
    });
    afterNavigate((navigation) => {
        if (!ehRotaDeJanela(navigation.to?.url.pathname)) { janela.titulo = ''; return; }
        // Formulário: foco no primeiro campo; detalhe: no título (o leitor de tela anuncia a tarefa).
        void tick().then(() => {
            const main = plano?.querySelector<HTMLElement>(':scope > main');
            const alvo = main?.querySelector<HTMLElement>('form input:not([type=hidden]), form textarea') ?? main?.querySelector<HTMLElement>(':scope > .astra-head h1');
            if (alvo?.tagName === 'H1') alvo.setAttribute('tabindex', '-1');
            alvo?.focus({ preventScroll: true });
        });
    });
    function montarCopia(no: HTMLElement, copia: HTMLElement) { no.replaceChildren(copia); }

    function fecharJanela() {
        const main = plano?.querySelector<HTMLElement>(':scope > main');
        const fechar = main?.querySelector<HTMLAnchorElement>('.fechar-janela');
        void voltarDaJanela(fechar?.getAttribute('href') ?? '/');
    }
    function tecladoJanela(e: KeyboardEvent) {
        if (!ehJanela || e.defaultPrevented) return;
        const main = plano?.querySelector<HTMLElement>(':scope > main');
        if (!main) return;
        if (e.key === 'Escape') { e.preventDefault(); fecharJanela(); return; }
        if (e.key !== 'Tab') return;
        // O foco fica preso dentro da janela.
        const focaveis = [...main.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([type=hidden]), textarea, select, [tabindex]:not([tabindex="-1"])')]
            .filter((n) => n.getClientRects().length);
        if (!focaveis.length) return;
        const primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
        const ativo = document.activeElement;
        const dentro = !!ativo && main.contains(ativo);
        if (e.shiftKey && (ativo === primeiro || !dentro)) { e.preventDefault(); ultimo.focus(); }
        else if (!e.shiftKey && (ativo === ultimo || !dentro)) { e.preventDefault(); primeiro.focus(); }
    }
    function cliqueForaDaJanela(e: MouseEvent) {
        if (ehJanela && e.target instanceof HTMLElement && e.target.matches('.rota-janela main.astra-page')) fecharJanela();
    }

    // Chegada vinda da entrada: liga já no começo da transição e desliga quando as camadas terminaram de surgir.
    let chegando = $state(false);
    $effect(() => {
        if ($transicaoEntrada === 'oculta') return;
        chegando = true;
        if ($transicaoEntrada !== 'canto') return;
        const fim = setTimeout(() => { chegando = false; }, 3200);
        return () => clearTimeout(fim);
    });

    // A estrela do menu fica exatamente embaixo do texto da aba ativa.
    let menu = $state<HTMLUListElement>();
    function posicionarPonto() {
        const ativo = menu?.querySelector<HTMLElement>('a[aria-current=page]');
        if (!menu || !ativo) return;
        const caixaMenu = menu.getBoundingClientRect(), caixaAtivo = ativo.getBoundingClientRect();
        menu.style.setProperty('--ponto-x', `${(caixaAtivo.left + caixaAtivo.width / 2 - caixaMenu.left).toFixed(1)}px`);
    }
    $effect(() => { void rotaBase; void tick().then(posicionarPonto); });

    onMount(() => {
        montado = true;
        reduzido = matchMedia('(prefers-reduced-motion: reduce)');
        orientar(setorDaRota(page.url.pathname));
        const finalizar = () => { animacao?.finish(); };
        const visibilidade = () => { if (document.hidden) finalizar(); };
        reduzido.addEventListener('change', finalizar);
        document.addEventListener('visibilitychange', visibilidade);
        addEventListener('resize', posicionarPonto);
        void document.fonts?.ready.then(posicionarPonto);
        return () => { montado = false; animacao?.cancel(); reduzido.removeEventListener('change', finalizar); document.removeEventListener('visibilitychange', visibilidade); removeEventListener('resize', posicionarPonto); };
    });
    onNavigate(async (navigation) => {
        const de = navigation.from?.url.pathname;
        const para = navigation.to?.url.pathname;
        if (!montado || !de || !para || navigation.willUnload) return;
        const minhaVez = ++turno;
        animacao?.cancel(); emGiro = false;
        const elemento = plano;
        if (!elemento) return;
        // A janela abre e fecha por cima da tela; a câmera e o giro de página não mudam.
        if (ehRotaDeJanela(de) || ehRotaDeJanela(para)) return;
        const anterior = setorDaRota(de), proximo = setorDaRota(para);
        if (de === '/inicio' || para === '/inicio' || anterior === proximo) {
            orientar(proximo); return;
        }
        const direcao = Math.sign(vistas[proximo].angulo - vistas[anterior].angulo);
        const mover = !reduzido.matches && !document.hidden;
        orientar(proximo, mover ? 860 : 0);
        if (!mover) return async () => {
            await tick();
            const titulo = elemento.querySelector('h1');
            titulo?.setAttribute('tabindex', '-1'); titulo?.focus({ preventScroll: true });
        };
        emGiro = true;
        const mobile = innerWidth < 700;
        const pose = (lado: number) => `translateZ(-${mobile ? 60 : 140}px) rotateY(${lado * (mobile ? 20 : 32)}deg) translateX(${lado * -25}%)`;
        const executar = async (quadros: Keyframe[]) => {
            animacao = elemento.animate(quadros, { duration: 430, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' });
            try { await animacao.finished; } catch { /* cancelamento ao desmontar */ }
        };
        await executar([{ transform: 'none', opacity: 1 }, { transform: pose(direcao), opacity: 0 }]);
        if (!montado || minhaVez !== turno) return;
        return async () => {
            animacao?.cancel();
            if (!montado || minhaVez !== turno) return;
            if (!reduzido.matches && !document.hidden) await executar([{ transform: pose(-direcao), opacity: 0 }, { transform: 'none', opacity: 1 }]);
            if (!montado || minhaVez !== turno) return;
            animacao?.cancel(); emGiro = false;
            await tick();
            const titulo = elemento.querySelector('h1');
            titulo?.setAttribute('tabindex', '-1'); titulo?.focus({ preventScroll: true });
        };
    });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<svelte:window onkeydown={tecladoJanela} onclick={cliqueForaDaJanela} />

<TransicaoEntrada />

<div class:planetario={page.url.pathname !== '/inicio'} data-setor={setor} class:orbita-viva={page.url.pathname !== '/inicio'} class:ov-shell={page.url.pathname !== '/inicio'} class:catalogo={page.url.pathname !== '/inicio'}
    class:rota-janela={ehJanela} class:janela-troca={ehJanela && troca} class:chegando>
{#if page.url.pathname !== '/inicio'}<CeuAscii /><div class="grao" aria-hidden="true"></div>{/if}
{#if page.url.pathname !== '/inicio'}
<header class="astra-page cabecalho">
	<a class="marca-entrada" href="/inicio" aria-label="ASTRA — tela inicial" data-astra-brand
		style:visibility={$transicaoEntrada === 'oculta' ? 'visible' : 'hidden'}>
		<MarcaAstra compacta />
	</a>
	<nav class="astra-nav" aria-label="Navegação principal" style={`--indice:${setor === 'tarefas' ? 0 : setor === 'projetos' ? 1 : 2}`}>
        <ul bind:this={menu}>
            <li>
                <a href="/" aria-current={rotaBase === '/' || rotaBase.startsWith('/tarefas') ? 'page' : undefined}>Tarefas</a>
            </li>
            <li>
                <a href="/projetos" aria-current={rotaBase.startsWith('/projetos') ? 'page' : undefined}>Projetos</a>
            </li>
            <li>
                <a href="/quadro" aria-current={rotaBase === '/quadro' ? 'page' : undefined}>Quadro Kanban</a>
            </li>
        </ul>
    </nav>
</header>
{/if}

{#if ehJanela && fundo}
<div class="janela-fundo" aria-hidden="true" inert style:top={`${fundo.top}px`} style:left={`${fundo.left}px`} style:width={`${fundo.width}px`}
    use:montarCopia={fundo.copia}></div>
{/if}
{#if abrindo}<AbrindoJanela titulo={abrindo.titulo} formulario={abrindo.formulario} />{/if}

{#if page.url.pathname === '/inicio'}
{@render children()}
{:else}
<div class="campo-perspectiva"><div class="plano-rota" bind:this={plano} inert={emGiro} aria-busy={emGiro}>
{@render children()}
</div></div>
{/if}
</div>

<style>
	.cabecalho { padding-top:28px; padding-bottom:24px; flex-direction:row; align-items:center; justify-content:space-between; gap:24px; }
	.marca-entrada { display:block; flex:none; width:180px; height:45px; }
	nav a { display:block; padding:11px 14px; min-height:44px; background:#11151c; border-radius:3px; color:var(--astra-muted); text-decoration:none; font:13px ui-monospace,'Courier New',monospace; letter-spacing:.04em; border:1px solid #3a424f; transition:box-shadow 180ms,border-color 180ms,background 180ms; }
	nav ul { gap:8px; }
	nav a:hover, nav a:focus-visible { color:#fff; border-color:#e4ecff; background:#202733; box-shadow:0 0 22px #ffffff26,inset 0 0 12px #ffffff08; }
	nav a[aria-current='page'] { color:#fff; border-color:#aebbd0; background:#242c3a; }
	.catalogo { min-height:100svh; isolation:isolate; background:#08090b; color:#f1f2f4; --astra-text:#f1f2f4; --astra-muted:#a9abb2; --astra-accent-soft:#e2e6ec; --astra-accent-2:#e2e6ec; }
	.catalogo .cabecalho { position:relative; z-index:1; max-width:1256px; padding-inline:clamp(24px,5vw,64px); border-bottom:1px solid #30333a; }
	@media(max-width:700px) { .cabecalho { flex-wrap:wrap; gap:16px; } .marca-entrada { width:140px; height:35px; } nav ul { gap:8px; } nav a { font-size:12px; } }
</style>
