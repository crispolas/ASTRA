# ASTRA — Marco 4

Diário técnico de busca, filtros e quadro, atualizado pela equipe conforme o desenvolvimento avança.

**Equipe:** Brenno Milhomem Farias, Eurípedes Rocha Neto, Gabriel Crispim Galvão e Felipe Borges Barros.

**Tecnologias:** SvelteKit + TypeScript e json-server.

**Prazo:** 28/10/2026 às 23h59, conforme as issues do Marco 4.

## Objetivo do marco

Permitir encontrar tarefas por título, status e prioridade, mostrar as tarefas em um quadro com uma coluna por status, alternar entre lista e quadro sem perder a busca e os filtros, e mudar o status de uma tarefa direto pelo cartão.

Cada seção abaixo segue o resultado esperado da issue no GitHub. Campos sem registro do responsável permanecem **A preencher**.

## Divisão das tarefas

| Issue | Tarefa | Responsável |
| --- | --- | --- |
| #24 | Implementar a busca por título | Eurípedes Rocha Neto |
| #25 | Implementar os filtros por status e prioridade | Eurípedes Rocha Neto |
| #26 | Centralizar o estado de busca e filtros | Eurípedes Rocha Neto |
| #27 | Criar a visão de quadro | Brenno Milhomem Farias |
| #28 | Alternar entre lista e quadro | Gabriel Crispim Galvão |
| #29 | Mudar o status pelo cartão | Felipe Borges Barros |
| #30 | Criar o slide de apresentação do Marco 4 | A preencher |

Responsáveis conforme as atribuições no GitHub. Se a equipe combinar alguma mudança, atualize a tabela e a seção da issue.

## Como executar o projeto

Inicie a API em um terminal:

```sh
npx --no-install json-server db.json
```

Em outro terminal, inicie a aplicação:

```sh
npm run dev
```

- Aplicação: `http://localhost:5173`, ou a porta informada pelo Vite.
- API: `http://localhost:3000`.

Verificações existentes:

```sh
npm test
npm run check
npm run build
```

Os testes de rotas que buscam tarefas na API, como `/tarefas/1`, precisam do json-server ligado.

---

## Issue 24 - Implementar a busca por título

**Responsável:** Eurípedes Rocha Neto.

### Objetivo

Campo de busca que filtra as tarefas mostradas.

### O que foi feito

A preencher.

### GitHub

- Issue: [#24 - Implementar a busca por título](https://github.com/crispolas/ASTRA/issues/24).
- Pull Request: [#62](https://github.com/crispolas/ASTRA/pull/62), junto com #25 e #26.

---

## Issue 25 - Implementar os filtros por status e prioridade

**Responsável:** Eurípedes Rocha Neto.

### Objetivo

Dois seletores que se combinam entre si e com a busca.

### O que foi feito

A preencher.

### GitHub

- Issue: [#25 - Implementar os filtros por status e prioridade](https://github.com/crispolas/ASTRA/issues/25).
- Pull Request: [#62](https://github.com/crispolas/ASTRA/pull/62), junto com #24 e #26.

---

## Issue 26 - Centralizar o estado de busca e filtros

**Responsável:** Eurípedes Rocha Neto.

### Objetivo

Um único lugar guarda busca e filtros; lista e quadro usam o mesmo estado.

### O que foi feito

A preencher.

### GitHub

- Issue: [#26 - Centralizar o estado de busca e filtros](https://github.com/crispolas/ASTRA/issues/26).
- Pull Request: [#62](https://github.com/crispolas/ASTRA/pull/62), junto com #24 e #25.

---

## Issue 27 - Criar a visão de quadro

**Responsável:** Brenno Milhomem Farias.

### Objetivo

Rota `/quadro` com uma coluna por status e os cartões agrupados.

### O que foi feito

A preencher.

### GitHub

- Issue: [#27 - Criar a visão de quadro](https://github.com/crispolas/ASTRA/issues/27).
- Pull Request: [#63](https://github.com/crispolas/ASTRA/pull/63).

---

## Issue 28 - Alternar entre lista e quadro

**Responsável:** Gabriel Crispim Galvão.

### Objetivo

Navegação entre as duas visões, mantendo busca e filtros aplicados.

### O que foi feito

Registrado em [issue-28.md](issue-28.md).

### GitHub

- Issue: [#28 - Alternar entre lista e quadro](https://github.com/crispolas/ASTRA/issues/28).
- Pull Request: [#64](https://github.com/crispolas/ASTRA/pull/64), integrado na branch `feat/entrada-lunar-astra`.

---

## Issue 29 - Mudar o status pelo cartão

**Responsável:** Felipe Borges Barros.

### Objetivo

Seletor ou botão no cartão grava o novo status na API; no quadro, o cartão muda de coluna. Não é necessário arrastar e soltar.

Depende do quadro (#27) e da alternância de visões (#28), por isso a branch parte da entrega da #28.

### O que foi feito

- `src/lib/components/TarefaCard.svelte`: a etiqueta de status virou um `<select>` com os quatro status. Ao trocar, o cartão chama `atualizarTarefa(id, { status })`, que já existia em `src/lib/api.ts` desde a #16 e faz um `PATCH /tarefas/:id`. Depois que a API confirma, o cartão chama a nova prop opcional `onstatus` com a tarefa atualizada.
- `src/routes/quadro/+page.svelte`: passa `onstatus={() => invalidateAll()}`. Foi removido o CSS que escondia o campo Status nos cartões do quadro, porque agora ele é o seletor.
- `src/routes/+page.svelte`: a lista passa um `onstatus` que troca a tarefa no array `tarefas`.
- `tests/tarefa-card.test.mjs`: novo teste do seletor.

### Como foi feito e por quê

1. **Reaproveitar a API de escrita.** A função `atualizarTarefa` da #16 já aceita uma parte dos campos. Enviar só `{ status }` evita regravar a tarefa inteira.
2. **O cartão grava, a página decide o que atualizar.** O cartão é usado em três lugares (lista, quadro e página do projeto), e cada página carrega as tarefas de um jeito. Por isso o cartão só avisa pela prop `onstatus`, no mesmo estilo do `aoEnviar` do formulário da #17.
3. **Quadro: recarregar pelo `load`.** O quadro recebe as tarefas pelo `load` de `src/routes/quadro/+page.ts`. `invalidateAll()` faz o SvelteKit rodar esse `load` de novo e buscar as tarefas na API. Como as colunas agrupam por `status`, o cartão aparece na coluna nova.
4. **Lista: atualizar o estado local.** A lista busca as tarefas com `onMount`, não com `load`, então `invalidateAll()` não a recarregaria. Ela troca a tarefa no array, e os filtros da #26 continuam corretos.
5. **Falha da API.** Se o `PATCH` falhar, o seletor volta ao status anterior e o cartão mostra uma mensagem com `role="alert"`. O seletor fica desativado enquanto salva, para evitar dois envios ao mesmo tempo.
6. **Acessibilidade.** O seletor tem `aria-label="Status de <título>"`, para o leitor de tela dizer de qual tarefa é o status. O texto do status continua visível, sem depender só da cor.

### Como testar

Com a API (`npx --no-install json-server db.json`) e o `npm run dev` ligados:

1. Abra `/quadro`, troque o status de um cartão e confira que ele vai para a coluna nova e que os contadores mudam.
2. Atualize a página e confira que o status continua o novo, ou seja, foi gravado na API.
3. Em `/`, troque o status de um cartão e filtre por esse status; o cartão deve aparecer no filtro.
4. Desligue a API e troque um status: o seletor volta ao valor anterior e aparece a mensagem de erro.

Resultados registrados até agora: `npm run check` sem erros, `npm run build` concluído e `npm test` com 28 de 29 testes passando com a API ligada. O teste que falhou foi o de `/inicio` (`tests/entrada.test.mjs`), que passou nas três vezes em que foi executado sozinho. O `PATCH` de status foi conferido direto na API. Os passos no navegador acima ainda devem ser feitos pelo responsável antes do PR.

### Limites

A página do projeto (`/projetos/:id`) também mostra o seletor e grava o status, mas não recarrega os dados depois. Não foi implementado arrastar e soltar, que a issue dispensa.

### GitHub

- Issue: [#29 - Mudar o status pelo cartão](https://github.com/crispolas/ASTRA/issues/29).
- Pull Request: A preencher.

---

## Issue 30 - Criar o slide de apresentação do Marco 4

**Responsável:** A preencher.

### Objetivo

Slides com o que foi implementado e uma demonstração de no máximo 5 minutos.

### O que foi feito

A preencher.

### GitHub

- Issue: [#30 - Criar o slide de apresentação do Marco 4](https://github.com/crispolas/ASTRA/issues/30).
- Commit ou Pull Request: A preencher.

---

## Conferência final do Marco 4

Lista de verificações planejadas; nenhuma funcionalidade é declarada aprovada por este checklist.

- [ ] Buscar por parte do título e conferir as tarefas mostradas.
- [ ] Combinar busca, status e prioridade na lista e no quadro.
- [ ] Abrir `/quadro` e conferir uma coluna por status com os cartões agrupados.
- [ ] Alternar entre lista e quadro e conferir que busca e filtros continuam aplicados.
- [ ] Mudar o status pelo cartão no quadro e conferir a mudança de coluna e a gravação na API.
- [ ] Executar as verificações do projeto e registrar os resultados.
- [ ] Preparar e ensaiar a apresentação de até cinco minutos.

## Registro de integração

| Issues | Decisão ou problema | Solução ou acordo | Responsável | Referência |
| --- | --- | --- | --- | --- |
| #28 e #29 | O PR da #28 foi integrado em `feat/entrada-lunar-astra`, não na `main` | A #29 parte da entrega da #28; falta o PR de `feat/entrada-lunar-astra` para a `main` | A preencher | PR #64 |
| A preencher | A preencher | A preencher | A preencher | A preencher |

Mantenha o histórico do Marco 3 em seu próprio documento.
