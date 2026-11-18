<script lang="ts">
  import FecharJanela from '#lib/components/FecharJanela.svelte';
  import { nomesPrioridade, nomesStatus } from '../../../lib/opcoes';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let tarefa = $derived(data.tarefa);

  /** Prazo em linguagem de gente: "vence amanhã", "em 5 dias", "atrasada há 3 dias". Some quando a tarefa está concluída. */
  function prazoRelativo(prazo: string, status: string): { texto: string; atrasada: boolean } | null {
    if (!prazo || status === 'concluida') return null;
    const [ano, mes, dia] = prazo.split('-').map(Number);
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const dias = Math.round((new Date(ano, mes - 1, dia).getTime() - hoje.getTime()) / 86_400_000);
    if (dias < 0) return { texto: `atrasada há ${-dias} ${dias === -1 ? 'dia' : 'dias'}`, atrasada: true };
    if (dias === 0) return { texto: 'vence hoje', atrasada: false };
    if (dias === 1) return { texto: 'vence amanhã', atrasada: false };
    return { texto: `em ${dias} dias`, atrasada: false };
  }
  const relativo = $derived(tarefa ? prazoRelativo(tarefa.prazo, tarefa.status) : null);
</script>

<svelte:head><title>{tarefa?.titulo ?? 'Tarefa não encontrada'} · ASTRA</title></svelte:head>

<main class="astra-page">
  <div class="astra-head">
    <div>
      <h1>{tarefa ? tarefa.titulo : 'Tarefa'}</h1>
    </div>
    <div class="acoes">
      {#if tarefa}
        <a class="astra-pill editar" href="/tarefas/{tarefa.id}/editar" aria-label="Editar tarefa">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M10.5 2.5l3 3L5 14H2v-3z" /><path d="M9 4l3 3" /></svg>
          <span>Editar</span>
        </a>
      {/if}
      <FecharJanela href="/" />
    </div>
  </div>

  {#if tarefa}
    <article class="astra-card detalhe">
      <h2 class="oculto">Descrição</h2>
      {#if tarefa.descricao}
        <p class="descricao">{tarefa.descricao}</p>
      {:else}
        <p class="descricao vazia">Sem descrição.</p>
      {/if}

      <dl>
        <div>
          <dt>Status</dt>
          <dd><span class="selo status--{tarefa.status}">{nomesStatus[tarefa.status] ?? tarefa.status}</span></dd>
        </div>
        <div>
          <dt>Prioridade</dt>
          <dd><span class="selo prioridade--{tarefa.prioridade}">{nomesPrioridade[tarefa.prioridade] ?? tarefa.prioridade}</span></dd>
        </div>
        <div>
          <dt>Responsável</dt>
          <dd>
            {#if tarefa.responsavel}<span class="inicial" aria-hidden="true">{tarefa.responsavel[0].toUpperCase()}</span>{tarefa.responsavel}
            {:else}Não atribuído{/if}
          </dd>
        </div>
        <div>
          <dt>Prazo</dt>
          <dd>
            {#if tarefa.prazo}
              <time datetime={tarefa.prazo}>{tarefa.prazo.split('-').reverse().join('/')}</time>
              {#if relativo}<span class="relativo" class:atrasada={relativo.atrasada}>{relativo.texto}</span>{/if}
            {:else}
              Sem prazo
            {/if}
          </dd>
        </div>
      </dl>
    </article>
  {:else if data.naoEncontrada}
    <p class="astra-error" role="alert">Tarefa não encontrada. Ela pode ter sido excluída ou o endereço está errado.</p>
  {:else}
    <p class="astra-error" role="alert">Erro: não foi possível carregar a tarefa. Tente novamente em instantes.</p>
  {/if}
</main>

<style>
  .acoes { display: flex; align-items: center; gap: 10px; flex: none; }
  :global(.ov-shell.orbita-viva.planetario) .editar { min-height: 36px !important; height: 36px; padding: 0 14px 0 12px !important; font-size: 13px !important; gap: 7px !important; background: transparent !important; }
  :global(.ov-shell.orbita-viva.planetario) .editar:hover { border-color: var(--obs-tinta-2) !important; }
  .editar svg { flex: none; }
  .detalhe { display: flex; flex-direction: column; gap: 22px; overflow-wrap: anywhere; padding: 8px 24px 24px !important; }
  .oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .descricao { margin: 0; max-width: 62ch; white-space: pre-line; font: 400 15.5px/1.6 var(--obs-ui); color: var(--obs-tinta); }
  .descricao.vazia { color: var(--obs-tinta-3); font-style: italic; }
  dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 20px; margin: 0; padding-top: 18px; border-top: 1px solid var(--obs-fio); }
  dt { margin-bottom: 7px; font: 500 12.5px/1.3 var(--obs-ui) !important; letter-spacing: 0 !important; text-transform: none !important; color: var(--obs-tinta-3) !important; }
  dd { margin: 0; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font: 500 15px/1.3 var(--obs-ui); color: var(--obs-tinta); }
  time { font: inherit; }
  /* status e prioridade como selos com bolinha de cor (as mesmas cores das estrelas do fundo) */
  .selo { display: inline-flex; align-items: center; gap: 7px; width: max-content; border: 1px solid currentColor; border-radius: 999px; padding: 6px 11px 6px 9px; font: 600 12.5px/1 var(--obs-ui); }
  .selo::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }
  .status--a-fazer { color: var(--obs-tinta-2); }
  .status--em-andamento { color: var(--obs-gelo); }
  .status--em-revisao { color: var(--obs-lilas); }
  .status--concluida { color: var(--obs-estrela-agua); }
  .prioridade--alta { color: var(--obs-estrela-quente); }
  .prioridade--media { color: var(--obs-estrela-azul); }
  .prioridade--baixa { color: var(--obs-estrela-agua); }
  .inicial { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; flex: none; background: var(--obs-painel-2); border: 1px solid var(--obs-fio-forte); font: 600 12px/1 var(--obs-ui); color: var(--obs-tinta-2); }
  .relativo { flex-basis: 100%; font: 400 12.5px/1.3 var(--obs-ui); color: var(--obs-tinta-3); }
  .relativo.atrasada { color: var(--obs-perigo); }
  @media (max-width: 760px) {
    /* no celular, Editar vira só o lápis para caber ao lado do título */
    :global(.ov-shell.orbita-viva.planetario) .editar { width: 36px; padding: 0 !important; gap: 0 !important; }
    .editar span { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  }
</style>
