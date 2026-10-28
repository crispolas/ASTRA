# Issue 28 — Alternar entre lista e quadro

## Objetivo

Navegar entre a lista (`/`) e o quadro (`/quadro`) mantendo a busca por título e os filtros de status e prioridade aplicados, conforme a issue 28 do Marco 4.

## O que foi feito e por quê

- `AlternarVisao.svelte` oferece links Lista / Quadro nas duas telas. `aria-current` identifica a visão atual, inclusive para leitores de tela.
- As duas páginas reutilizam `Filtros.svelte` e os mesmos stores de `src/lib/stores/filtros.ts`. Não há uma segunda cópia do estado.
- A função `aplicarFiltros` concentra os critérios já usados na lista. As duas telas usam `$derived` para recalcular os resultados quando os stores mudam.
- O quadro aplica os filtros antes de separar os cartões por status. Os contadores mostram a quantidade de cartões exibidos em cada coluna.

O SvelteKit intercepta os links internos e navega sem recarregar o documento. Assim, os stores em memória continuam com os valores escolhidos. A mudança não adiciona persistência após atualizar a página ou abrir outra aba; isso não é exigido nesta issue.

O maior cuidado foi distinguir guardar o valor do filtro de aplicar esse valor: o estado compartilhado já existia, mas o quadro ainda mostrava todas as tarefas. Apenas criar links não resolveria o resultado pedido.

## Como testar

1. Inicie a API com `npx json-server db.json` e o frontend com `npm run dev`.
2. Abra `/`, digite parte de um título e escolha status e prioridade que correspondam a uma tarefa.
3. Clique em Quadro. Confira os mesmos valores nos controles e os mesmos cartões, agrupados por status. As outras colunas continuam visíveis.
4. Altere um filtro no quadro e clique em Lista. A lista deve usar o novo valor.
5. Limpe os três campos; todas as tarefas devem reaparecer nas duas visões.
6. Confira também Voltar / Avançar do navegador e navegação por teclado. Nenhuma troca de visão deve recarregar o documento.

`npm run check`, `npm run build` e `npm test` verificam tipos, compilação e testes. `tests/visoes.test.mjs` cobre combinação de critérios, aplicação no quadro, quantidade de cartões e identificação da visão atual. A navegação real e a retenção dos valores também são verificadas no navegador durante a implementação.

## Limites

O visual aprovado e as rotas foram preservados. Esta issue não implementa mudança de status pelo cartão (#29), arrastar e soltar, exclusão ou novas opções de filtro.

- Issue: [#28 — Alternar entre lista e quadro](https://github.com/crispolas/ASTRA/issues/28)
