<h1>Detalhes da tarefa</h1>

<script lang="ts">
  import type { PageData } from './$types';

  // No Svelte 5 (Runes), utiliza-se $props() em vez de 'export let'
  let { data }: { data: PageData } = $props();

  // Reatividade para extrair a tarefa dos dados recebidos
  let tarefa = $derived(data.tarefa);
</script>

<main class="detalhe-container">
  <a href="/" class="btn-voltar">← Voltar</a>

  {#if tarefa}
    <header class="header-tarefa">
      <h1>{tarefa.titulo}</h1>
      <span class="badge">{tarefa.status || 'Pendente'}</span>
    </header>

    <div class="card-detalhes">
      <h2>Descrição</h2>
      <p>{tarefa.descricao || 'Nenhuma descrição fornecida.'}</p>

      <div class="meta-info">
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
  .badge {
    background-color: #2563eb;
    color: #fff;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
  }
  .meta-info {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #aaa;
  }
</style>