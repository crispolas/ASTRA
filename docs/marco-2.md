# ASTRA — Diário técnico do Marco 2

**Disciplina:** Desenvolvimento Frontend\
**Tecnologias:** SvelteKit + TypeScript; API local com json-server\
**Repositório:** https://github.com/crispolas/ASTRA\
**Equipe:** Brenno Milhomem Farias, Eurípedes Rocha Neto, Gabriel Crispim Galvão e Felipe Borges Barros\
**Prazo:** 14/10/2026 às 23h59, conforme informado para o marco.

## Objetivo e uso do diário

O Marco 2 trata da navegação, dos componentes reutilizáveis e das primeiras interfaces de consulta de tarefas e projetos da ASTRA. Este diário registra a implementação real e permite que outro integrante continue o trabalho sem reconstruir todo o contexto.

Os resultados esperados abaixo são planejamento baseado nas tarefas fornecidas; a implementação registrada na seção #9 foi conferida na `main` após a integração do PR #47. Os demais campos continuam pendentes. A consulta às descrições das issues pela API do GitHub retornou `Forbidden`; por isso, não foram transcritos critérios de aceite externos. Consulte a issue vinculada antes de iniciar a tarefa.

Este diário incorpora o registro de Felipe Borges Barros em `docs/README.md`, disponível na [versão integrada pelo PR #47](https://github.com/crispolas/ASTRA/blob/2ece3feb20175a275e9a3b890eb6604fc1f0a13c/docs/README.md). Ao atualizar as informações da issue nos dois documentos, mantenha comandos, rotas e resultados consistentes.

Ao assumir uma tarefa, preencha responsável e status. Durante o trabalho, registre os arquivos, passos, decisões e dúvidas; antes de concluir, substitua os campos **A preencher** por fatos verificáveis. Para testar, informe comando ou URL, pré-condições, dados usados, resultado esperado e resultado observado. Diferencie testes aprovados, falhas e verificações não executadas. Não invente commits ou resultados: adicione o identificador ou link somente quando existir.

Se uma alteração afetar outra tarefa, registre o acordo na seção de integração e atualize as orientações para quem dará continuidade. Combine com a equipe a branch e a forma de integração antes de trabalhar; este documento não define uma política de branches.

## Base técnica existente

Na `main`, após o PR #47 de Felipe, a página inicial em `src/routes/+page.svelte` apresenta os títulos “Tarefas” e “Página inicial”. Foram adicionadas as rotas de projetos e detalhes, além da página personalizada de erro. Essas páginas são provisórias: ainda não consultam a API nem exibem os dados de tarefas e projetos. O layout em `src/routes/+layout.svelte` contém o favicon e renderiza o conteúdo das páginas.

A issue #9 está implementada e integrada; a documentação de Felipe descreve os testes criados, mas não registra uma execução com resultados. Os testes não foram executados nesta atualização documental. A cópia local usada para editar este diário ainda está anterior ao PR #47; as informações acima foram conferidas em `origin/main`, sem alterar o código local.

Referências para o trabalho:

- `src/tipos.ts` define `Projeto`, `Tarefa`, `Status`, `Prioridade` e `NovaTarefa`.
- Os identificadores de projetos e tarefas são strings. `Tarefa.projetoId` relaciona uma tarefa ao projeto.
- `db.json` contém as coleções `projetos` e `tarefas`; os dados iniciais têm dois projetos e cinco tarefas.
- O acesso existente à biblioteca usa o alias `#lib`, definido em `package.json`.
- As rotas do SvelteKit são definidas pelos arquivos em `src/routes`; não é necessário instalar um roteador adicional para documentar ou usar essa convenção.

## Preparação e execução local

Requisitos: Git, Node.js compatível com as dependências do lockfile (mínimo 22.17; Node.js 24 é uma opção compatível), npm e dois terminais. Execute os comandos a partir da raiz do ASTRA. As portas 5173 e 3000 devem estar livres.

Antes de atualizar a cópia local, confira `git status` e preserve alterações próprias. Atualize a branch combinada com a equipe sem sobrescrever trabalho em andamento.

Instale as dependências somente se necessário, preservando o lockfile:

```sh
npm ci
```

No primeiro terminal, inicie o frontend:

```sh
npm run dev
```

Felipe também documentou `npm run dev -- --open`, que abre o navegador automaticamente em uma máquina local. No ambiente de nuvem, use o comando sem `--open`.

No segundo terminal, inicie a API com a dependência do projeto já instalada:

```sh
npx --no-install json-server db.json
```

No Windows PowerShell, se a execução dos scripts npm for bloqueada, use `npm.cmd` e `npx.cmd` no lugar de `npm` e `npx`.

- Aplicação: http://localhost:5173
- API: http://localhost:3000
- Consultas de leitura: http://localhost:3000/projetos e http://localhost:3000/tarefas

Confira nos terminais as portas efetivamente usadas. O json-server persiste operações de escrita no arquivo servido; para este marco de leitura, não altere os dados de referência. No ambiente de nuvem já preparado, siga as instruções de inicialização salvas, que usam uma cópia em `/workspace/astra-runtime/db.json` para preservar `db.json`.

Verificações disponíveis na `main` após o PR #47:

```sh
npm test
npm run check
npm run build
```

`npm test` executa os cinco testes de integração das rotas em `tests/routes.test.mjs`, usando o runner nativo do Node.js. `npm run check` verifica TypeScript/Svelte, e `npm run build` gera o build. Os testes atuais validam páginas provisórias e uma URL inexistente; não cobrem consultas à API nem a existência de tarefas e projetos. Registre os resultados reais na seção da tarefa correspondente. Para usar `npm test`, a cópia de trabalho precisa conter as alterações do PR #47; esse script não existia na versão anterior.

## Dependências e integração

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

As dependências indicam a ordem recomendada de integração, não uma sequência rígida de execução. Na etapa 1, as três tarefas podem avançar em paralelo. Nas demais, combine antecipadamente contratos de funções, propriedades de componentes e rotas para permitir trabalho simultâneo; registre os acordos e valide a integração com as implementações reais.

## Registro das tarefas

### #7 — Criar o componente de cartão de tarefa

**Issue:** [#7 — Criar o componente de cartão de tarefa](https://github.com/crispolas/ASTRA/issues/7)\
**Responsável:** A preencher\
**Status:** A preencher\
**Dependências:** Tipos existentes em `src/tipos.ts`.

#### Resultado esperado

Disponibilizar um componente reutilizável para representar uma tarefa.

#### O que foi implementado

A preencher

#### Arquivos criados ou modificados

A preencher

#### Passo a passo técnico da implementação

A preencher

#### Como executar e testar

A preencher

#### Decisões técnicas e justificativas

A preencher

#### Problemas encontrados e soluções

A preencher

#### Orientações para o próximo integrante

A preencher

Ao atualizar este campo: registrar as propriedades aceitas, seus tipos, obrigatoriedade e um exemplo real de uso para #11 e #14.

#### Referência ao commit ou Pull Request

A preencher

### #8 — Criar a tela de detalhe da tarefa

**Issue:** [#8 — Criar a tela de detalhe da tarefa](https://github.com/crispolas/ASTRA/issues/8)\
**Responsável:** A preencher\
**Status:** A preencher\
**Dependências:** #9 e #10.

#### Resultado esperado

Consultar e exibir os dados da tarefa identificada na rota de detalhe.

#### O que foi implementado

A preencher

#### Arquivos criados ou modificados

A preencher

#### Passo a passo técnico da implementação

A preencher

#### Como executar e testar

A preencher

#### Decisões técnicas e justificativas

A preencher

#### Problemas encontrados e soluções

A preencher

#### Orientações para o próximo integrante

A preencher

Ao atualizar este campo: explicar como obter o identificador da rota, consultar a API e tratar tarefa ausente; registrar verificações com identificadores existentes e inexistentes.

#### Referência ao commit ou Pull Request

A preencher

### #9 — Configurar o roteador

**Issue:** [#9 — Configurar o roteador](https://github.com/crispolas/ASTRA/issues/9)\
**Responsável:** Felipe Borges Barros\
**Status:** Implementada e integrada na `main` pelo PR #47; resultados de execução dos testes a registrar.\
**Dependências:** Nenhuma.

#### Resultado esperado

Criar as rotas iniciais do ASTRA e uma página personalizada para endereços inexistentes, com páginas provisórias contendo um título (`h1`) e um subtítulo (`h2`).

#### O que foi implementado

Felipe configurou as quatro rotas pelo sistema de arquivos do SvelteKit e adicionou a página personalizada de erro. As páginas contêm somente títulos provisórios; listagens, detalhamento de dados e navegação compartilhada serão desenvolvidos nas respectivas issues.

| Endereço | Arquivo | Título e subtítulo atuais |
| --- | --- | --- |
| `/` | `src/routes/+page.svelte` | Tarefas / Página inicial |
| `/tarefas/:id` | `src/routes/tarefas/[id]/+page.svelte` | Detalhes da tarefa / Página provisória |
| `/projetos` | `src/routes/projetos/+page.svelte` | Projetos / Lista de projetos |
| `/projetos/:id` | `src/routes/projetos/[id]/+page.svelte` | Detalhes do projeto / Página provisória |

O arquivo `src/routes/+error.svelte` exibe “Página não encontrada” e “Erro 404”. Uma URL sem rota correspondente é tratada pelo SvelteKit com HTTP 404.

#### Arquivos criados ou modificados

- Modificado: `src/routes/+page.svelte`, com os títulos da página inicial de tarefas.
- Criados: `src/routes/tarefas/[id]/+page.svelte`, `src/routes/projetos/+page.svelte` e `src/routes/projetos/[id]/+page.svelte`.
- Criado: `src/routes/+error.svelte`, com o conteúdo da página de erro.
- Criado: `tests/routes.test.mjs`, com os testes de integração das rotas.
- Modificado: `package.json`, acrescentando `test: node --test tests/routes.test.mjs`.
- Criado: `docs/README.md`, com instruções compartilhadas e o registro da issue #9.

#### Passo a passo técnico da implementação

1. Substituiu o conteúdo de boas-vindas da página inicial pelos títulos provisórios de tarefas.
2. Criou as pastas e arquivos `+page.svelte` correspondentes às rotas de projetos e detalhes.
3. Usou pastas `[id]` para os segmentos variáveis de tarefas e projetos.
4. Criou `+error.svelte` para personalizar o conteúdo apresentado em uma URL inexistente.
5. Adicionou testes que iniciam um servidor Vite local, fazem requisições HTTP e verificam status e títulos; o servidor é encerrado após a suíte.
6. Adicionou o comando `npm test` e documentou as rotas e procedimentos em `docs/README.md`.

Esta sequência descreve as alterações conferidas no PR integrado, sem afirmar uma ordem cronológica de trabalho não registrada pelo autor.

#### Como executar e testar

Na raiz do projeto, em uma cópia que contenha o PR #47, execute:

```sh
npm test
npm run check
npm run build
```

A suíte tem cinco casos: quatro verificam HTTP 200 e os títulos/subtítulos das páginas provisórias; o quinto verifica HTTP 404 e o conteúdo personalizado de uma URL inexistente. Ela inicia seu próprio servidor em uma porta disponível e não depende do json-server, porque as páginas ainda não consultam a API.

Para conferir manualmente, execute `npm run dev` (ou `npm run dev -- --open` em uma máquina local) e acesse:

| URL | Resultado esperado |
| --- | --- |
| `http://localhost:5173/` | HTTP 200; Tarefas / Página inicial |
| `http://localhost:5173/tarefas/1` | HTTP 200; Detalhes da tarefa / Página provisória |
| `http://localhost:5173/projetos` | HTTP 200; Projetos / Lista de projetos |
| `http://localhost:5173/projetos/1` | HTTP 200; Detalhes do projeto / Página provisória |
| `http://localhost:5173/pagina-inexistente` | HTTP 404; Página não encontrada / Erro 404 |

**Resultado observado de execução:** A preencher. Os procedimentos e as asserções foram conferidos no código e na documentação do Felipe; nenhuma execução desses testes foi realizada nesta atualização do diário.

#### Decisões técnicas e justificativas

- Usar o roteamento nativo do SvelteKit: as pastas em `src/routes` e os arquivos `+page.svelte` definem as páginas, sem instalar outra biblioteca.
- Usar `[id]` como segmento variável: `/tarefas/1`, `/tarefas/25` e `/tarefas/abc` correspondem à mesma página de rota. Isso não comprova que essas tarefas existem na API.
- Manter páginas provisórias com `h1` e `h2`, conforme o objetivo registrado por Felipe, para permitir a implementação posterior das telas.

#### Problemas encontrados e soluções

A preencher pelo responsável. O registro de Felipe não relata problemas encontrados nem soluções aplicadas; não foram presumidos incidentes.

#### Orientações para o próximo integrante

- #12: implementar o layout e os links compartilhados; a criação das rotas não adicionou um menu de navegação.
- #11: desenvolver a listagem de tarefas em `src/routes/+page.svelte` usando #7 e #10.
- #13: desenvolver a listagem em `src/routes/projetos/+page.svelte` usando #10.
- #8 e #14: desenvolver os detalhes nos arquivos existentes em `[id]`; a leitura do parâmetro e a consulta de dados ainda precisam ser implementadas. Registrar como obter `params.id` no carregamento da página e como tratar um recurso ausente.
- Para adicionar uma página, criar o diretório correspondente dentro de `src/routes` e seu `+page.svelte`. Uma pasta `[id]` representa um segmento variável, não uma validação de existência do recurso.
- Ao substituir os títulos provisórios, atualizar as expectativas de `tests/routes.test.mjs` para verificar o comportamento real das telas, preservando as verificações relevantes de rotas e erros.
- O conteúdo de `+error.svelte` está fixo em “Erro 404”; ele não diferencia outros erros. O tratamento de falhas de API nas novas telas precisa ser definido e documentado nas tarefas correspondentes.

Registrar na integração qualquer mudança de URL ou contrato que afete as tarefas dependentes.

#### Referência ao commit ou Pull Request

- [PR #47 — Configura as rotas iniciais da aplicação](https://github.com/crispolas/ASTRA/pull/47), integrado na `main`.
- Implementação: `6cd36ea` — Configura rotas iniciais da aplicação.
- Documentação: `b0338ba` — Documenta configuração das rotas; `7fd1820` — Organiza documentação por issue.
- Commit de merge: `2ece3feb20175a275e9a3b890eb6604fc1f0a13c`.

### #10 — Criar o módulo de acesso à API (leitura)

**Issue:** [#10 — Criar o módulo de acesso à API (leitura)](https://github.com/crispolas/ASTRA/issues/10)\
**Responsável:** A preencher\
**Status:** A preencher\
**Dependências:** Contrato de dados em `db.json` e `src/tipos.ts`.

#### Resultado esperado

Disponibilizar acesso tipado de leitura a tarefas e projetos para as telas do marco.

#### O que foi implementado

A preencher

#### Arquivos criados ou modificados

A preencher

#### Passo a passo técnico da implementação

A preencher

#### Como executar e testar

A preencher

#### Decisões técnicas e justificativas

A preencher

#### Problemas encontrados e soluções

A preencher

#### Orientações para o próximo integrante

A preencher

Ao atualizar este campo: registrar nomes das funções, parâmetros, retornos, importações, endereço da API e tratamento de erros; explicar a consulta das tarefas relacionadas a um projeto.

#### Referência ao commit ou Pull Request

A preencher

### #11 — Criar a tela de lista de tarefas

**Issue:** [#11 — Criar a tela de lista de tarefas](https://github.com/crispolas/ASTRA/issues/11)\
**Responsável:** A preencher\
**Status:** A preencher\
**Dependências:** #7 e #10.

#### Resultado esperado

Consultar as tarefas na API e apresentá-las usando o cartão reutilizável.

#### O que foi implementado

A preencher

#### Arquivos criados ou modificados

A preencher

#### Passo a passo técnico da implementação

A preencher

#### Como executar e testar

A preencher

#### Decisões técnicas e justificativas

A preencher

#### Problemas encontrados e soluções

A preencher

#### Orientações para o próximo integrante

A preencher

Ao atualizar este campo: explicar como a lista recebe os dados, identifica cada tarefa e encaminha à página de detalhe; registrar como verificar a correspondência com a API.

#### Referência ao commit ou Pull Request

A preencher

### #12 — Criar o layout base e a navegação

**Issue:** [#12 — Criar o layout base e a navegação](https://github.com/crispolas/ASTRA/issues/12)\
**Responsável:** Brenno Milhomem Farias
**Status:** Implementeado.
**Dependências:** #9.

#### Resultado esperado

Disponibilizar layout compartilhado e navegação entre tarefas e projetos.

#### O que foi implementado

Um layout de navegação entre as páginas do código

#### Arquivos criados ou modificados

src/routes/+layout.svelte 
src/routes/+page.svelte 
docs/marco-2.md

#### Passo a passo técnico da implementação

Criação do arquivo de layout raiz src/routes/+layout.svelte  para encapsular a estrutura comum da aplicação.

Adição da barra de navegação contendo os links para as rotas do sistema.

Um link com o diretório das páginas que serão acessadas.

#### Como executar e testar

Após iniciar a será possível ver uma tela inicial com Página inicial, Projetos e Tarefas respectivamente e ao clicar os mesmos eles devem lhe redirecionar para uma nova tela.

#### Decisões técnicas e justificativas

Layout Compartilhado com +layout.svelte: Adotado o padrão nativo do SvelteKit para evitar duplicar componentes de interface (como navbar e header) em cada subpágina, facilitando a manutenção e garantindo consistência visual.

#### Orientações para o próximo integrante

Elementos compartilhados: O cabeçalho, o logotipo e a barra de menu estão definidos no arquivo src/routes/+layout.svelte. Tudo o que for inserido fora da tag <slot /> (ou {@render children()}) permanecerá visível em todas as telas da aplicação.

Onde cada página é renderizada: O SvelteKit injeta o conteúdo de cada página individual (+page.svelte de cada pasta dentro de src/routes/) exatamente onde a tag <slot /> (ou {@render children()}) está posicionada no +layout.svelte.

Como acrescentar links sem duplicar o layout: Para adicionar uma nova rota ao menu, basta criar a pasta correspondente em src/routes/sua-nova-rota/+page.svelte e incluir a tag <a href="/sua-nova-rota"> dentro do arquivo +layout.svelte. Não é necessário importar o layout ou a navbar dentro da nova página criada.

#### Referência ao commit ou Pull Request

[Adicionado layout e navegacao base- #49](https://github.com/crispolas/ASTRA/pull/49)

### #13 — Criar a tela de lista de projetos

**Issue:** [#13 — Criar a tela de lista de projetos](https://github.com/crispolas/ASTRA/issues/13)\
**Responsável:** A preencher\
**Status:** A preencher\
**Dependências:** #9 e #10.

#### Resultado esperado

Consultar e apresentar os projetos da API com acesso às respectivas páginas.

#### O que foi implementado

A preencher

#### Arquivos criados ou modificados

A preencher

#### Passo a passo técnico da implementação

A preencher

#### Como executar e testar

A preencher

#### Decisões técnicas e justificativas

A preencher

#### Problemas encontrados e soluções

A preencher

#### Orientações para o próximo integrante

A preencher

Ao atualizar este campo: registrar a rota acordada e como o identificador de cada projeto é passado ao detalhamento.

#### Referência ao commit ou Pull Request

A preencher

### #14 — Criar a página do projeto

**Issue:** [#14 — Criar a página do projeto](https://github.com/crispolas/ASTRA/issues/14)\
**Responsável:** A preencher\
**Status:** A preencher\
**Dependências:** #7, #9 e #10.

#### Resultado esperado

Apresentar os dados de um projeto e suas tarefas relacionadas, reutilizando o cartão de tarefa.

#### O que foi implementado

A preencher

#### Arquivos criados ou modificados

A preencher

#### Passo a passo técnico da implementação

A preencher

#### Como executar e testar

A preencher

#### Decisões técnicas e justificativas

A preencher

#### Problemas encontrados e soluções

A preencher

#### Orientações para o próximo integrante

A preencher

Ao atualizar este campo: explicar a relação entre projeto e tarefas, as funções utilizadas e a reutilização do cartão; registrar como verificar que apenas tarefas do projeto são exibidas.

#### Referência ao commit ou Pull Request

A preencher

### #15 — Criar o slide de apresentação do Marco 2

**Issue:** [#15 — Criar o slide de apresentação do Marco 2](https://github.com/crispolas/ASTRA/issues/15)\
**Responsável:** A preencher\
**Status:** A preencher\
**Dependências:** Funcionalidades integradas.

#### Resultado esperado

Preparar material de apresentação do Marco 2 e demonstração das funcionalidades efetivamente disponíveis.

#### O que foi implementado

A preencher

#### Arquivos criados ou modificados

A preencher

#### Passo a passo técnico da implementação

A preencher

#### Como executar e testar

A preencher

#### Decisões técnicas e justificativas

A preencher

#### Problemas encontrados e soluções

A preencher

#### Orientações para o próximo integrante

A preencher

Ao atualizar este campo: registrar o caminho ou link do material, o roteiro, os comandos necessários à demonstração e as limitações reais; não apresentar funcionalidades planejadas como concluídas.

#### Referência ao commit ou Pull Request

A preencher

## Registro de integração

Registre decisões, problemas e soluções que afetem mais de uma issue: contratos entre componentes e API, mudanças de rotas, conflitos de merge e verificações após integração. Preencha também quem deve receber as informações para continuar; não deixe um acordo apenas em uma conversa.

| Data | Issues envolvidas | Problema ou decisão | Solução ou acordo | Arquivos ou contratos afetados | Responsável | Próximo integrante ou tarefa | Commit ou PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Data de integração a registrar | #9, #8, #11, #12, #13 e #14 | Rotas iniciais integradas; telas ainda provisórias | Usar os arquivos de rota existentes para implementar as telas e atualizar os testes quando o conteúdo mudar | `src/routes`, `tests/routes.test.mjs`, `package.json` e `docs/README.md` | Felipe Borges Barros (#9); responsáveis pelas telas a preencher | Responsáveis por #8, #11, #12, #13 e #14 | [PR #47](https://github.com/crispolas/ASTRA/pull/47) |
| A preencher | A preencher | A preencher | A preencher | A preencher | A preencher | A preencher | A preencher |

## Critérios internos de conclusão

Uma issue só deve ser considerada concluída quando:

- [ ] A funcionalidade ou o material previsto estiver implementado.
- [ ] O resultado tiver sido testado, com procedimentos e resultados registrados.
- [ ] O código ou material estiver integrado à versão compartilhada do projeto.
- [ ] A seção correspondente deste diário estiver atualizada.
- [ ] O commit ou Pull Request real estiver registrado.
- [ ] As informações necessárias às tarefas dependentes estiverem disponíveis.

A existência deste modelo não comprova a conclusão das issues. Quem executa a tarefa deve preencher seu registro antes de considerá-la concluída.

## Continuidade nos próximos marcos

Para um novo marco, crie futuramente `docs/marco-3.md`, `docs/marco-4.md` e assim por diante, reutilizando a identificação, o contexto técnico, a tabela de dependências, o modelo das tarefas, o registro de integração e os critérios de conclusão. Ajuste tarefas e prazo ao escopo daquele marco e acrescente seu link à seção **Documentação técnica** do README.

Mantenha o histórico de cada marco no respectivo documento. Não copie resultados, responsáveis ou referências de commits como se pertencessem a outro marco. Esses documentos futuros não são criados nesta entrega.
