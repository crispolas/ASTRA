# ASTRA — Marco 2

Diário técnico das tarefas do Marco 2, atualizado pela equipe conforme o desenvolvimento avança.

**Equipe:** Brenno Milhomem Farias, Eurípedes Rocha Neto, Gabriel Crispim Galvão e Felipe Borges Barros.

**Tecnologias:** SvelteKit + TypeScript e json-server.

**Prazo:** 14/10/2026 às 23h59.

## Objetivo do marco

Criar a navegação, os componentes reutilizáveis e as primeiras telas de consulta de tarefas e projetos. Este documento explica o que cada integrante fez e como outra pessoa pode testar e continuar o trabalho.

## Como executar o projeto

Requisitos: Git, npm e Node.js compatível com as dependências (mínimo 22.17; Node.js 24 é compatível). Execute os comandos na raiz do projeto.

Instale as dependências, se necessário:

```sh
npm ci
```

Inicie a aplicação:

```sh
npm run dev
```

Em uma máquina local, use `npm run dev -- --open` para abrir o navegador automaticamente.

Em outro terminal, inicie a API com a dependência já instalada:

```sh
npx --no-install json-server db.json
```

- Aplicação: `http://localhost:5173`
- API: `http://localhost:3000`
- Dados: `/tarefas` e `/projetos` na API.

No PowerShell, se necessário, use `npm.cmd` e `npx.cmd`. Na nuvem, siga as instruções de inicialização do ambiente, que usam uma cópia do banco para preservar `db.json`.

Para verificar o projeto:

```sh
npm test
npm run check
npm run build
```

`npm test` verifica as rotas, `npm run check` procura erros de Svelte e TypeScript e `npm run build` gera o build. Registre os resultados reais na issue correspondente.

## Ordem recomendada de integração

| Etapa | Issue | Tarefa | Dependências |
| --- | --- | --- | --- |
| 1 — Fundação | #9 | Configurar o roteador | Nenhuma |
| 1 — Fundação | #10 | Criar o módulo de acesso à API (leitura) | Contrato de dados existente |
| 1 — Fundação | #7 | Criar o componente de cartão de tarefa | Tipos existentes |
| 2 — Estrutura e listagens | #12 | Criar o layout base e a navegação | #9 |
| 2 — Estrutura e listagens | #11 | Criar a tela de lista de tarefas | #7 e #10 |
| 2 — Estrutura e listagens | #13 | Criar a tela de lista de projetos | #9 e #10 |
| 3 — Detalhamento | #8 | Criar a tela de detalhe da tarefa | #9 e #10 |
| 3 — Detalhamento | #14 | Criar a página do projeto | #7, #9 e #10 |
| 4 — Entrega | #15 | Criar o slide de apresentação do Marco 2 | Integração das funcionalidades |

As dependências indicam a ordem de integração, não uma sequência rígida. As tarefas podem avançar em paralelo quando a equipe combinar as funções da API, propriedades dos componentes e rotas. Os tipos existentes estão em `src/tipos.ts`; `Tarefa.projetoId` relaciona a tarefa ao projeto.

## Como documentar uma issue

Cada membro deve preencher sua issue neste documento usando esta estrutura:

```md
## Issue número - Nome da issue

**Responsável:** Nome da pessoa

### Objetivo

Explique o resultado esperado.

### O que foi feito

Explique as alterações realizadas e os arquivos envolvidos.

### Como testar

Informe comandos ou URLs, o resultado esperado e o resultado observado.

### GitHub

- Issue: link da issue.
- Commit ou Pull Request: referência real da alteração.
```

Acrescente explicações como “Como funciona”, “Problemas e soluções” ou “Para continuar” quando ajudarem outro integrante. Não é necessário preencher uma lista extensa de campos: registre o que for útil para entender o trabalho.

Os campos das tarefas ainda não documentadas permanecem **A preencher**. Não descreva planos como funcionalidades prontas e não registre testes como aprovados sem executá-los. O registro da issue #9 abaixo incorpora a documentação do Felipe em `docs/README.md`.

---

## Issue 7 - Criar o componente de cartão de tarefa

**Responsável:** A preencher

### Objetivo

Disponibilizar um componente reutilizável para representar uma tarefa.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#7 - Criar o componente de cartão de tarefa](https://github.com/crispolas/ASTRA/issues/7)
- Commit ou Pull Request: A preencher.

---

## Issue 8 - Criar a tela de detalhe da tarefa

**Responsável:** Eurípedes Rocha

### Objetivo
Consultar e exibir os dados da tarefa identificada na rota de detalhe.

### O que foi feito
- Criação e estruturação da rota dinâmica `/tarefas/[id]` no SvelteKit 5 (`src/routes/tarefas/[id]/+page.svelte` e `+page.ts`).
- Implementação da busca dinâmica de dados de tarefas a partir do arquivo `db.json` com base no parâmetro `id` da URL.
- Configuração de tratamento para tarefas não encontradas (redirecionamento/exibição da página de erro 404).

### Como testar
1. Executar o servidor com `npm run dev`.
2. Acessar `http://localhost:5174/tarefas/1` no navegador.
3. Verificar se o título ("Criar o repositório"), a descrição, a badge de status ("concluída") e o ID da tarefa são exibidos corretamente.
4. Acessar uma rota com ID inexistente (ex: `/tarefas/999`) para validar a tela de erro 404.

### GitHub
- Issue: [#8 - Criar a tela de detalhe da tarefa](https://github.com/crispolas/ASTRA/issues/8)
- Commit ou Pull Request: Branch `8-criar-a-tela-de-detalhe-da-tarefa`

---

## Issue 9 - Configurar o roteador

**Responsável:** Felipe Borges Barros

### Objetivo

Criar as rotas iniciais do ASTRA e uma página personalizada para endereços que não existem.

As páginas criadas nesta issue são simples e usam apenas um título (`h1`) e um subtítulo (`h2`).

### Como o roteamento funciona

O SvelteKit cria as rotas usando as pastas e os arquivos dentro de `src/routes`. Por isso, não foi necessário instalar outra biblioteca de roteamento.

Um arquivo chamado `+page.svelte` representa uma página que pode ser aberta no navegador.

Por exemplo, este arquivo:

```text
src/routes/projetos/+page.svelte
```

Cria este endereço:

```text
/projetos
```

### Rotas criadas

| Endereço | Arquivo | Conteúdo atual |
| --- | --- | --- |
| `/` | `src/routes/+page.svelte` | Página inicial de tarefas |
| `/tarefas/:id` | `src/routes/tarefas/[id]/+page.svelte` | Detalhes provisórios de uma tarefa |
| `/projetos` | `src/routes/projetos/+page.svelte` | Lista provisória de projetos |
| `/projetos/:id` | `src/routes/projetos/[id]/+page.svelte` | Detalhes provisórios de um projeto |

### O que significa `[id]`?

Os colchetes indicam uma parte variável do endereço.

Estes endereços usam a mesma página:

```text
/tarefas/1
/tarefas/25
/tarefas/abc
```

Em cada endereço, o valor depois de `/tarefas/` é o `id`.

### Página não encontrada

O arquivo `src/routes/+error.svelte` personaliza a página de erro.

Quando alguém abre um endereço que não existe, como `/pagina-inexistente`, o servidor responde com o status HTTP `404` e mostra a mensagem "Página não encontrada".

### Testes criados

O arquivo `tests/routes.test.mjs` contém os testes de integração das rotas. Eles iniciam um servidor local e acessam as páginas como um navegador faria.

Os testes verificam:

- se as quatro rotas respondem com o status `200`;
- se cada página mostra o `h1` e o `h2` esperados;
- se um endereço inexistente responde com o status `404`;
- se a página personalizada de erro é exibida.

Para executar os testes:

```sh
npm test
```

### Como testar manualmente

Inicie a aplicação com `npm run dev -- --open` e abra estes endereços:

```text
http://localhost:5173/
http://localhost:5173/tarefas/1
http://localhost:5173/projetos
http://localhost:5173/projetos/1
http://localhost:5173/pagina-inexistente
```

As quatro primeiras páginas devem mostrar seus títulos provisórios. O último endereço deve mostrar a página personalizada de erro 404.

### GitHub

- Issue: [#9 - Configurar o roteador](https://github.com/crispolas/ASTRA/issues/9)
- Pull request: [#47 - Configura as rotas iniciais da aplicação](https://github.com/crispolas/ASTRA/pull/47)

---

## Issue 10 - Criar o módulo de acesso à API (leitura)

**Responsável:** A preencher

### Objetivo

Disponibilizar acesso tipado de leitura a tarefas e projetos para as telas do marco.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#10 - Criar o módulo de acesso à API (leitura)](https://github.com/crispolas/ASTRA/issues/10)
- Commit ou Pull Request: A preencher.

---

## Issue 11 - Criar a tela de lista de tarefas

**Responsável:** A preencher

### Objetivo

Consultar as tarefas na API e apresentá-las usando o cartão reutilizável.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#11 - Criar a tela de lista de tarefas](https://github.com/crispolas/ASTRA/issues/11)
- Commit ou Pull Request: A preencher.

---

## Issue 12 - Criar o layout base e a navegação

**Responsável:** A preencher

### Objetivo

Disponibilizar layout compartilhado e navegação entre tarefas e projetos.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#12 - Criar o layout base e a navegação](https://github.com/crispolas/ASTRA/issues/12)
- Commit ou Pull Request: A preencher.

---

## Issue 13 - Criar a tela de lista de projetos

**Responsável:** A preencher

### Objetivo

Consultar e apresentar os projetos da API com acesso às respectivas páginas.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#13 - Criar a tela de lista de projetos](https://github.com/crispolas/ASTRA/issues/13)
- Commit ou Pull Request: A preencher.

---

## Issue 14 - Criar a página do projeto

**Responsável:** A preencher

### Objetivo

Apresentar os dados de um projeto e suas tarefas relacionadas, reutilizando o cartão de tarefa.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#14 - Criar a página do projeto](https://github.com/crispolas/ASTRA/issues/14)
- Commit ou Pull Request: A preencher.

---

## Issue 15 - Criar o slide de apresentação do Marco 2

**Responsável:** A preencher

### Objetivo

Preparar material de apresentação do Marco 2 e demonstração das funcionalidades efetivamente disponíveis.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#15 - Criar o slide de apresentação do Marco 2](https://github.com/crispolas/ASTRA/issues/15)
- Commit ou Pull Request: A preencher.

---

## Registro de integração

Use esta seção para registrar decisões e problemas que afetem mais de uma issue.

| Issues | Decisão ou problema | Orientação para a equipe | Referência |
| --- | --- | --- | --- |
| #9, #8, #11, #12, #13 e #14 | Rotas iniciais integradas; páginas ainda provisórias | Usar as rotas existentes e atualizar os testes quando o conteúdo das telas mudar | [PR #47](https://github.com/crispolas/ASTRA/pull/47) |
| A preencher | A preencher | A preencher | A preencher |

## Quando uma issue está concluída?

Antes de considerar uma issue concluída, confira:

- [ ] O resultado está implementado e testado.
- [ ] O código ou material está integrado.
- [ ] O registro neste documento está atualizado.
- [ ] O commit ou PR está identificado.
- [ ] Quem vai continuar o trabalho tem as informações necessárias.

## Próximos marcos

Para os próximos marcos, reutilize este formato em `docs/marco-3.md`, `docs/marco-4.md` e assim por diante, com as tarefas e o prazo correspondentes. Acrescente o link ao README quando cada documento for criado; preserve o histórico dos marcos anteriores.
