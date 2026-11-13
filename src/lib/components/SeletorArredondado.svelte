<script lang="ts">
    import { tick } from 'svelte';
    type Opcao = { valor: string; nome: string };
    let { id, rotulo, valor = $bindable(''), opcoes, desabilitado = false, compacto = false, labelVisivel = true, aoAlterar, nome, invalido = false, descricao }: {
        id: string; rotulo: string; valor?: string; opcoes: Opcao[]; desabilitado?: boolean; compacto?: boolean; labelVisivel?: boolean; nome?:string; invalido?:boolean; descricao?:string; aoAlterar?: (valor: string) => void | Promise<void>;
    } = $props();
    let raiz = $state<HTMLDivElement>();
    let botao = $state<HTMLButtonElement>();
    let lista = $state<HTMLDivElement>();
    let aberto = $state(false);
    let ativo = $state(0);
    let acima = $state(false);
    let texto = '', ultimaLetra = 0;
    const selecionado = $derived(opcoes.find(o => o.valor === valor) ?? opcoes[0]);
    async function abrir(deslocamento = 0) {
        if (desabilitado) return;
        texto = ''; ultimaLetra = 0;
        const box = botao?.getBoundingClientRect();
        const altura = Math.min(280, opcoes.length * 44 + 16, innerHeight * .45);
        acima = !!box && box.bottom + altura + 12 > innerHeight && box.top > altura + 12;
        ativo = Math.max(0, opcoes.findIndex(o => o.valor === valor));
        ativo = (ativo + deslocamento + opcoes.length) % opcoes.length;
        aberto = true; await tick(); lista?.focus();
    }
    async function fechar(devolverFoco = false) {
        aberto = false;
        if (devolverFoco) { await tick(); botao?.focus(); }
    }
    async function escolher(indice: number) {
        if (desabilitado) return;
        const novo = opcoes[indice].valor;
        if (!aoAlterar) { valor = novo; await fechar(true); return; }
        await fechar();
        try { await aoAlterar(novo); }
        finally {
            await tick();
            if (botao?.isConnected && !botao.disabled) botao.focus();
        }
    }
    async function mover(indice: number) {
        ativo = (indice + opcoes.length) % opcoes.length;
        await tick(); lista?.querySelector(`#${id}-opcao-${ativo}`)?.scrollIntoView({ block: 'nearest' });
    }
    function teclado(event: KeyboardEvent) {
        if (event.key === 'Tab') { void fechar(); return; }
        if (event.key === 'Escape') { event.preventDefault(); void fechar(true); return; }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
            event.preventDefault();
            if (event.key === 'Enter' || event.key === ' ') escolher(ativo);
            else void mover(event.key === 'Home' ? 0 : event.key === 'End' ? opcoes.length - 1 : ativo + (event.key === 'ArrowDown' ? 1 : -1));
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
            const agora = performance.now(); texto = agora - ultimaLetra < 700 ? texto + event.key : event.key;
            ultimaLetra = agora;
            const indice = opcoes.findIndex(o => o.nome.toLocaleLowerCase('pt-BR').startsWith(texto.toLocaleLowerCase('pt-BR')));
            if (indice >= 0) { event.preventDefault(); void mover(indice); }
        }
    }
</script>

<svelte:document onpointerdown={(e) => { if (aberto && e.target instanceof Node && !raiz?.contains(e.target)) void fechar(); }} />
<div class="seletor" class:compacto bind:this={raiz} onfocusout={(e) => { if (e.relatedTarget instanceof Node && !raiz?.contains(e.relatedTarget)) void fechar(); }}>
    {#if nome}<input type="hidden" name={nome} value={valor} />{/if}
    <label class:oculto={!labelVisivel} id={`${id}-rotulo`} for={id}>{rotulo}</label>
    <button type="button" role="combobox" {id} class="gatilho" disabled={desabilitado} bind:this={botao} aria-haspopup="listbox" aria-expanded={aberto}
        aria-invalid={invalido ? true : undefined} aria-label={!labelVisivel ? rotulo : undefined} aria-describedby={[!labelVisivel ? `${id}-valor` : '', descricao ?? ''].filter(Boolean).join(' ') || undefined}
        aria-controls={`${id}-lista`} aria-labelledby={labelVisivel ? `${id}-rotulo ${id}-valor` : undefined}
        onclick={() => aberto ? fechar(true) : abrir()}
        onkeydown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); void abrir(e.key === 'ArrowDown' ? 1 : -1); } }}>
        <span id={`${id}-valor`}>{selecionado.nome}</span><span class="seta" aria-hidden="true">⌄</span>
    </button>
    {#if aberto}
        <div class="opcoes" class:acima id={`${id}-lista`} role="listbox" tabindex="0" aria-label={rotulo}
            aria-activedescendant={`${id}-opcao-${ativo}`} bind:this={lista} onkeydown={teclado}>
            {#each opcoes as opcao, i (opcao.valor)}
                <div id={`${id}-opcao-${i}`} role="option" aria-selected={opcao.valor === valor} class:ativa={i === ativo}
                    onpointermove={() => ativo = i} onclick={() => escolher(i)} onkeydown={(e) => { if(e.key === 'Enter') escolher(i); }} tabindex="-1">
                    {opcao.nome}<span aria-hidden="true">{opcao.valor === valor ? '✓' : ''}</span>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .oculto{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
    .compacto .gatilho{min-height:40px;border-radius:999px;padding:8px 12px;background:#ffffff08;border-color:#ffffff26;font-size:12px;gap:8px}
    .compacto .opcoes{min-width:190px}
    .opcoes.acima{top:auto;bottom:calc(100% + 8px)}
    .gatilho:disabled{opacity:.6;cursor:progress}
    .seletor{position:relative;min-width:0}
    label{display:block;margin-bottom:7px;color:#aaa;font:11px/1.4 ui-monospace,monospace}
    .gatilho{width:100%;min-height:46px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 14px;background:#101010;color:#eee;border:1px solid #494949;border-radius:14px;font:14px/1.5 system-ui,sans-serif;text-align:left;cursor:pointer}
    .gatilho:hover,.gatilho[aria-expanded=true]{border-color:#b5becd}
    .seta{font-size:18px;color:#aaa}
    .opcoes{position:absolute;z-index:80;top:calc(100% + 8px);left:0;right:0;max-height:min(280px,45svh);overflow:auto;padding:8px;background:#151517;border:1px solid #55575d;border-radius:22px;box-shadow:0 16px 40px #000b,0 0 20px #ffffff0a;outline-offset:3px}
    [role=option]{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:44px;padding:10px 14px;border-radius:15px;color:#ddd;font:14px/1.5 system-ui,sans-serif;cursor:pointer}
    [role=option].ativa{background:#303239;color:#fff}
    [role=option][aria-selected=true]{color:#fff;font-weight:600}
    .gatilho:focus-visible,.opcoes:focus-visible{outline:2px solid #e9f1ff;outline-offset:3px}
</style>
