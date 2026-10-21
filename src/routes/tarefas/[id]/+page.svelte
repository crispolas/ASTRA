<h1>Detalhes da tarefa</h1>

<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let tarefa = $derived(data.tarefa);
</script>

<main class="detalhe-container">
  <a href="/" class="btn-voltar">← Voltar</a>

  {#if tarefa}
  
    <a href="/tarefas/{tarefa.id}/editar">Editar</a>

    <header class="header-tarefa">
      <h1>{tarefa.titulo}</h1>
      <span class="badge">{tarefa.status || 'Pendente'}</span>
    </header>

    <div class="card-detalhes">
      <h2>Descrição</h2>
      <p>{tarefa.descricao || 'Nenhuma descrição fornecida.'}</p>

      <div class="grid-info">
        <p><strong>Prioridade:</strong> {tarefa.prioridade || 'Não informada'}</p>
        <p><strong>Responsável:</strong> {tarefa.responsavel || 'Não atribuído'}</p>
        <p><strong>Prazo:</strong> {tarefa.prazo || 'Sem prazo'}</p>
        <p><strong>ID do Projeto:</strong> {tarefa.projetoId ?? 'N/A'}</p>
        <p><strong>ID da Tarefa:</strong> {tarefa.id}</p>
      </div>
    </div>
  {/if}
</main>

<style>
  .detalhe-container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1.5rem;
    font-family: sans-serif;
  }
  .btn-voltar {
    display: inline-block;
    margin-bottom: 1rem;
    color: #3b82f6;
    text-decoration: none;
  }
  .header-tarefa {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #333;
    padding-bottom: 1rem;
  }
  .card-detalhes {
    background-color: #1e1e1e;
    color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 1.5rem;
  }
  .grid-info {
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    border-top: 1px solid #333;
    padding-top: 1rem;
    font-size: 0.95rem;
  }
  .badge {
    background-color: #2563eb;
    color: #fff;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
  }
</style>