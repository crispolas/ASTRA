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

`npm test` executa as suítes automatizadas, `npm run check` procura erros de Svelte e TypeScript e `npm run build` gera o build. Registre os resultados reais na issue correspondente.

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

**Responsável:** Gabriel Crispim Galvão.

### Objetivo

Criar um cartão reutilizável que recebe uma `Tarefa` por prop e mostra seus dados, conforme a Aula 10. Demonstrar o mesmo componente duas vezes na página inicial, com tarefas diferentes.

### O que foi feito

Foi criado `src/lib/components/TarefaCard.svelte`. O cartão mostra título, descrição, status, prioridade, responsável e prazo. O título contém um link para `/tarefas/:id`, usando a rota criada pelo Felipe.

A página inicial usa duas instâncias do componente com exemplos fixos. Essa demonstração pertence à issue #7: ela não consulta a API e não implementa a listagem da issue #11. Quando a lista for desenvolvida, os exemplos poderão ser substituídos pelos dados reais.

O cartão apenas lê os dados recebidos. Ele não altera o status nem guarda uma cópia própria do estado da tarefa. Não há botão de conclusão nesta implementação de leitura.

Arquivos envolvidos:

- `src/lib/components/TarefaCard.svelte`: componente, marcação HTML e estilos.
- `src/routes/+page.svelte`: dois exemplos fixos para demonstrar a reutilização.
- `tests/tarefa-card.test.mjs`: três testes do cartão e da demonstração.
- `tests/routes.test.mjs`: ajuste das verificações de títulos para aceitar atributos HTML gerados pelo Svelte.
- `docs/marco-2.md`: este registro.

O banco, os tipos existentes, as dependências, as rotas de detalhe e o layout não foram alterados. A implementação está na branch `feat/issue-7-cartao-tarefa`; sua integração à `main` ainda depende de PR e merge.

### Passo a passo: o que foi feito, como e por quê

1. **Partir da versão atualizada da equipe.** Foi criada a branch `feat/issue-7-cartao-tarefa` a partir da `main` atualizada, que já contém as rotas do Felipe e o layout do Brenno. Uma branch separa a implementação até a revisão.
2. **Reutilizar o contrato existente.** O componente importa `Tarefa` de `src/tipos.ts`. Esse tipo descreve os campos obrigatórios e evita criar outro formato incompatível com a API.
3. **Definir a entrada do cartão.** A interface `Props` declara uma propriedade obrigatória `tarefa: Readonly<Tarefa>`. `let { tarefa }: Props = $props()` recebe essa propriedade no Svelte 5. `Readonly` faz o TypeScript rejeitar atribuições diretas aos campos; não é um congelamento automático do objeto em execução.
4. **Mostrar os dados recebidos.** As chaves dentro do HTML, como `{tarefa.titulo}`, colocam os valores da tarefa na tela. Os códigos de status e prioridade são convertidos para rótulos legíveis, como “Em revisão” e “Média”.
5. **Criar o link e apresentar o prazo.** O título aponta para `/tarefas/` seguido do identificador. `encodeURIComponent` evita que caracteres especiais do identificador mudem a estrutura da URL. O prazo permanece em formato ISO no atributo `datetime` e aparece como dia/mês/ano na tela, sem conversão de fuso horário.
6. **Estilizar o cartão.** O bloco `<style>` define borda, espaçamento e disposição dos campos. O CSS é limitado pelo Svelte ao componente. O título é um link acessível por teclado, com indicação de foco.
7. **Demonstrar a reutilização.** A página importa o cartão pelo alias `#lib` e o usa duas vezes: `<TarefaCard tarefa={primeiraTarefa} />` e `<TarefaCard tarefa={segundaTarefa} />`. Os dados ficam na página, que é o componente pai; o cartão é o filho que recebe a prop.
8. **Verificar e registrar.** Foram executados os testes do cartão, os testes de rotas, a verificação de Svelte/TypeScript e o build. Depois, a alteração foi preparada para um commit apenas da issue #7.

### O que significam os termos usados?

| Termo | Significado nesta tarefa |
| --- | --- |
| Componente | Arquivo reutilizável que reúne a apresentação e a lógica do cartão. |
| Prop | Dado entregue por um componente pai ao filho; aqui, uma tarefa inteira. |
| Pai e filho | A página é o pai; cada `TarefaCard` utilizado nela é um filho. |
| Tipo/interface | Descrição dos campos e valores que o TypeScript aceita. |
| `$props()` | Recurso do Svelte 5 para receber as propriedades do componente. |
| `Readonly<Tarefa>` | Versão do tipo que não permite atribuir diretamente novos valores a seus campos pelo TypeScript. |
| `satisfies` | Confere que o mapa de rótulos corresponde aos valores possíveis do tipo, sem perder os tipos específicos. |
| `#lib` | Atalho já configurado no projeto para importar arquivos de `src/lib`. |
| Instância | Cada uso separado do mesmo componente; dois cartões são duas instâncias. |
| Build | Geração dos arquivos da aplicação para produção; ajuda a detectar falhas de compilação. |
| Commit | Registro local das alterações; não envia ao GitHub e não integra automaticamente à `main`. |

Exemplo de uso, depois de importar `TarefaCard` e obter um objeto `tarefa` compatível com o contrato:

```svelte
<TarefaCard tarefa={tarefa} />
```

### Como testar

Na raiz do projeto, execute:

```sh
node --test tests/tarefa-card.test.mjs
npm test
npm run check
npm run build
```

No PowerShell, use `npm.cmd` se a política de execução bloquear `npm`.

Resultados verificados nesta implementação:

- Testes do cartão: **3 aprovados**, nenhum falhou. Verificam dados, todos os rótulos de status/prioridade, prazo, link, preservação da prop, escape de texto e duas instâncias diferentes na página.
- Testes existentes das rotas: **5 aprovados**, nenhum falhou.
- Svelte/TypeScript: **zero erros e zero avisos**.
- Build: **concluído**. O adapter-auto continua sem um destino de deploy de produção configurado; isso não impede esta demonstração local.

Atualmente, `npm test` executa todas as suítes `*.test.mjs`, incluindo os testes do cartão, das rotas e do módulo da API.

Para conferir no seu computador:

1. Execute `npm run dev`.
2. Abra a página inicial no endereço informado pelo Vite.
3. Confira dois cartões: “Criar o repositório”, de Ana, e “Subir o json-server”, de Bruno.
4. Confira seus status, prioridades, descrições e prazo “06/10/2026”.
5. Clique no título: o endereço deve ser `/tarefas/1` ou `/tarefas/2`. A tela de detalhe ainda é a página provisória da issue #9.
6. Use Tab para alcançar os links e verificar a indicação de foco.

A demonstração usa dados fixos e funciona sem iniciar o json-server. A renderização da página foi verificada por HTTP nos testes; as etapas visuais acima são orientações para a conferência no navegador.

### Dificuldades e soluções

**Receber dados sem mudar a tarefa.** O cartão usa a prop diretamente para leitura. Não foi criada uma variável de estado com uma cópia da tarefa, nem uma atribuição a `tarefa.status`. Essa separação segue a regra da professora: o dono do estado altera o dado.

**Reutilizar o cartão sem antecipar a issue #11.** A solução foi demonstrar dois exemplos fixos, sem `fetch`, integração com a API ou implementação da lista dinâmica.

**Testar componentes no mesmo ambiente de execução do Svelte.** A primeira tentativa de renderização misturou o runtime importado diretamente pelo Node com o componente carregado pelo Vite, causando um erro interno. O teste passou a carregar também `svelte/server` pelo Vite, mantendo os dois no mesmo ambiente.

**Preservar os testes de rotas com CSS.** Os testes antigos esperavam literalmente `<h1>Tarefas</h1>`. Com estilos, o Svelte adicionou uma classe ao elemento e o teste falhou, embora o título estivesse correto. As verificações foram ajustadas para aceitar atributos no `h1` e no `h2`, mantendo a exigência do texto e dos códigos HTTP originais.

### Para continuar

Na issue #11, importar este componente, buscar as tarefas pelo módulo da API e usar cada identificador como chave da lista, conforme a professora orienta. A consulta à API e a lista dinâmica ainda não fazem parte deste commit.

Felipe também poderá reutilizar o cartão na issue #14, passando cada tarefa do projeto pela prop `tarefa`.

### GitHub

- Issue: [#7 - Criar o componente de cartão de tarefa](https://github.com/crispolas/ASTRA/issues/7).
- Branch: `feat/issue-7-cartao-tarefa`.
- Commit desta implementação: mensagem `Cria cartão de tarefa reutilizável para a issue 7`; consulte seu identificador com `git log -1 --oneline` nessa branch.
- Pull Request e integração na `main`: pendentes.

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

**Responsável:** Felipe Borges Barros.

### Objetivo

Disponibilizar acesso tipado de leitura a tarefas e projetos para as telas do marco.

### O que foi feito

Foi criado `src/lib/api.ts`, que centraliza as consultas de leitura à API local em `http://localhost:3000`. O módulo exporta quatro funções assíncronas e tipadas:

- `listarTarefas()` consulta `GET /tarefas`;
- `buscarTarefa(id)` consulta `GET /tarefas/:id`;
- `listarProjetos()` consulta `GET /projetos`;
- `buscarProjeto(id)` consulta `GET /projetos/:id?_embed=tarefas`.

O tipo `ProjetoComTarefas` foi adicionado a `src/tipos.ts` para representar o projeto retornado pela última consulta. Ele contém todos os campos de `Projeto` e um vetor `tarefas` do tipo `Tarefa[]`.

Todas as funções usam o mesmo helper interno para executar o `fetch`, converter o JSON para o tipo esperado e lançar um erro com o status HTTP quando a API responde sem sucesso. Assim, as telas podem importar as funções sem repetir URLs ou tratamento básico de resposta.

O arquivo `tests/api.test.mjs` verifica os quatro endpoints, os dados retornados e o tratamento de erro. O comando `npm test` foi ampliado para executar todas as suítes `*.test.mjs`, incluindo esses testes e os testes existentes.

### Como testar

Na raiz do projeto, execute:

```sh
npm test
npm run check
npm run build
```

Para testar a API manualmente, inicie o json-server em outro terminal:

```sh
npx --no-install json-server db.json
```

As funções podem ser importadas de `$lib/api`. A busca de projeto deve acessar um endereço como `http://localhost:3000/projetos/1?_embed=tarefas` e devolver o projeto com a propriedade `tarefas`.

### GitHub

- Issue: [#10 - Criar o módulo de acesso à API (leitura)](https://github.com/crispolas/ASTRA/issues/10)
- Branch: `feat/issue-10-api-leitura`.
- Pull Request: [#52 - Cria módulo de leitura da API](https://github.com/crispolas/ASTRA/pull/52).

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
