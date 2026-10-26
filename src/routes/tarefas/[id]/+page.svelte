<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let tarefa = $derived(data.tarefa);

  const nomesStatus: Record<string, string> = {
    'a-fazer': 'A fazer',
    'em-andamento': 'Em andamento',
    'em-revisao': 'Em revisão',
    concluida: 'Concluída'
  };

  const classesStatus: Record<string, string> = {
    'a-fazer': 'astra-tag--todo',
    'em-andamento': 'astra-tag--doing',
    'em-revisao': 'astra-tag--doing',
    concluida: 'astra-tag--done'
  };

  const nomesPrioridade: Record<string, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta'
  };
</script>

<main class="astra-page">
  <div class="astra-head">
    <div style="display:flex; flex-direction:column; gap:8px;">
      <span class="astra-eyebrow">Detalhes da tarefa</span>
      <h1>{tarefa ? tarefa.titulo : 'Tarefa'}</h1>
    </div>
    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      <a class="astra-pill" href="/">← Voltar</a>
      {#if tarefa}
        <a class="astra-btn" href="/tarefas/{tarefa.id}/editar" style="text-decoration:none;">Editar</a>
      {/if}
    </div>
  </div>

  {#if tarefa}
    <article class="astra-card detalhe">
      <h2>Descrição</h2>
      <p class="astra-muted">{tarefa.descricao || 'Nenhuma descrição fornecida.'}</p>

      <dl class="astra-meta">
        <div>
          <dt>Status</dt>
          <dd>
            <span class="astra-tag {classesStatus[tarefa.status] ?? 'astra-tag--todo'}">
              {nomesStatus[tarefa.status] ?? tarefa.status ?? 'Pendente'}
            </span>
          </dd>
        </div>
        <div>
          <dt>Prioridade</dt>
          <dd>{nomesPrioridade[tarefa.prioridade] ?? tarefa.prioridade ?? 'Não informada'}</dd>
        </div>
        <div>
          <dt>Responsável</dt>
          <dd>{tarefa.responsavel || 'Não atribuído'}</dd>
        </div>
        <div>
          <dt>Prazo</dt>
          <dd>
            {#if tarefa.prazo}
              <time datetime={tarefa.prazo}>{tarefa.prazo.split('-').reverse().join('/')}</time>
            {:else}
              Sem prazo
            {/if}
          </dd>
        </div>
      </dl>
    </article>
  {:else}
    <p class="astra-error" role="alert">Erro: não foi possível carregar a tarefa. Confira se a API está ligada e se a tarefa existe.</p>
  {/if}
</main>

<style>
  .detalhe {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-wrap: anywhere;
  }
</style>