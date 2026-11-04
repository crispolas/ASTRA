# ASTRA — Marco 5

Diário técnico de exclusão, erros e estados da tela.

**Equipe:** Brenno Milhomem Farias, Eurípedes Rocha Neto, Gabriel Crispim Galvão e Felipe Borges Barros.

**Tecnologias:** Svelte 5, SvelteKit, TypeScript e json-server.

## Organização

| Issue | Tarefa | Responsável | Registro |
| --- | --- | --- | --- |
| #31 | Excluir tarefa com confirmação | Gabriel Crispim Galvão | Integrada à main pelo PR #68 |
| #32 | Estado de carregamento | Eurípedes Rocha Neto | Lista geral implementada no PR #69; indicação nas demais buscas ainda precisa ser completada |
| #33 | Estado de erro e tentar novamente | Eurípedes Rocha Neto | Mensagem na lista geral pelo PR #69; nova tentativa e consistência entre telas pendentes |
| #34 | Estado vazio | Felipe Borges Barros | Lista e quadro separam "nenhuma tarefa cadastrada" de "nenhum resultado"; commit 38d11c7, PR #72 integrado |
| #35 | Tarefa ou projeto inexistente | Felipe Borges Barros | `/tarefas/:id` e `/projetos/:id` mostram "não encontrado" no 404; commit 4c33e25, PR #72 integrado |
| #36 | Falha ao salvar e excluir | A confirmar pela equipe | Comportamento verificado em cadastro, edição e exclusão; slides e roteiro incluídos |
| #37 | Auditoria de acessibilidade e responsividade | Brenno Milhomem Farias | Integrada pelo PR #71; slides e roteiro incluídos |
| #38 | Apresentação do Marco 5 | Gabriel Crispim Galvão | HTML e PDF com capa e 16 slides de conteúdo: #31 a #37 e infraestrutura local |

Os responsáveis não confirmados devem ser definidos pela equipe. O registro distingue comportamento existente de pendências: a existência de um PR integrado ou de um slide não significa que todos os requisitos da issue foram atendidos. A apresentação cobre #31 a #37 e infraestrutura local; as pendências das #32 e #33 permanecem documentadas.

## Issue 31 — Excluir tarefa com confirmação

**Responsável:** Gabriel Crispim Galvão.

### Objetivo

Excluir uma tarefa após confirmação e atualizar a lista depois do sucesso na API, conforme a issue da professora.

### O que foi feito

- `excluirTarefa(id): Promise<void>` em `src/lib/api.ts` envia `DELETE /tarefas/:id` com o ID codificado e verifica a resposta HTTP.
- A função não tenta ler JSON: uma exclusão pode responder `204 No Content`, sem corpo.
- O cartão da lista recebe `onexcluir` e mostra um botão identificado com o nome da tarefa. Outros usos do cartão não recebem um botão sem ação configurada.
- `window.confirm` pede confirmação antes da requisição. Cancelar não envia DELETE.
- O botão fica bloqueado enquanto exclui ou salva um status; o seletor de status também fica bloqueado durante a exclusão, evitando gravações concorrentes nesse cartão.
- Depois do sucesso, o cartão avisa a página. A página remove o ID da coleção local, preservando as outras tarefas e as escolhas dos filtros.
- Em falha, a tarefa permanece na tela, o botão é reabilitado e aparece uma mensagem básica. O tratamento de falhas é detalhado na seção da #36.

### Como e por quê

O fluxo é `confirmar → aguardar API → avisar página → atualizar coleção`. A API é quem grava no json-server; o frontend atualiza a representação depois da confirmação do servidor. Essa ordem evita esconder um cartão cuja exclusão falhou.

`$state` guarda a coleção na página; `$derived` recalcula o resultado dos filtros. O template do Svelte acompanha essa mudança, sem remover elementos do HTML manualmente e sem F5. O callback `onexcluir` permite ao cartão avisar a página sem conhecer a coleção completa, seguindo a separação de responsabilidades já usada por `onstatus` na #29.

A confirmação nativa evita uma biblioteca ou modal novo nesta issue. Não foi instalada dependência adicional. O maior cuidado foi não reutilizar a função que sempre converte respostas em JSON, pois DELETE pode não ter corpo.

### Como testar

Na raiz do projeto, em terminais separados:

```sh
npx json-server db.json
npm run dev
```

No PowerShell, use `npx.cmd` e `npm.cmd` se a execução de scripts estiver bloqueada.

1. Crie uma tarefa de teste e abra a lista `/`.
2. Clique em Excluir e cancele. A tarefa permanece; a API não recebe DELETE.
3. Confirme a exclusão. O cartão desaparece depois do sucesso da API.
4. Recarregue a página e confira que a tarefa não reaparece.
5. Repita com busca e filtros aplicados: os critérios permanecem, e apenas a tarefa excluída sai da coleção.
6. Simule falha na API: a tarefa deve permanecer, com aviso e botão disponível para nova tentativa.

Não use tarefas reais da equipe para demonstrar exclusão. Nos testes de navegador, use tarefas temporárias e remova as sobras ao terminar.

### Verificações

```sh
npm run check
npm run build
npm test
```

Os testes de API cobrem ID codificado, DELETE sem corpo, respostas de sucesso 200/204 e rejeição de falhas. O teste do cartão verifica a presença condicional do botão. A navegação real verifica cancelar, confirmar, erro, bloqueio durante o envio e permanência da exclusão após recarregar.

### GitHub

- Issue: [#31](https://github.com/crispolas/ASTRA/issues/31).
- Branch: `feat/issue-31-excluir-tarefa`.
- Pull request: [#68](https://github.com/crispolas/ASTRA/pull/68), integrado à main.

## Issue 32 — Mostrar o estado de carregando

**Responsável:** Eurípedes Rocha Neto. Integração pelo [PR #69](https://github.com/crispolas/ASTRA/pull/69).

### Como funciona e por quê

Em `src/routes/+page.svelte`, `carregando` começa como `$state(true)`. O `onMount` do Svelte inicia a busca no navegador; `await listarTarefas()` aguarda os dados e os atribui à coleção. O `finally` muda `carregando` para `false`, tanto no sucesso quanto no erro. O template usa `{#if carregando}` para mostrar a espera, evitando apresentar uma lista vazia antes da resposta.

Não foi instalada biblioteca nova. O formulário também indica o carregamento de projetos. A exigência da professora é indicação em todas as telas que buscam dados: completar as demais buscas continua pendente, sem substituir a arquitetura de carregamento existente.

### Como conferir

No DevTools, aplique limitação de rede e recarregue a lista. A mensagem deve aparecer durante a espera e desaparecer após a resposta ou a falha. Repita a conferência nas demais telas para completar o requisito.

## Issue 33 — Mostrar o estado de erro e permitir nova tentativa

**Responsável:** Eurípedes Rocha Neto. Mensagem na lista geral integrada pelo [PR #69](https://github.com/crispolas/ASTRA/pull/69).

### Como funciona e por quê

O módulo `api.ts` verifica `resposta.ok` e lança erro para respostas HTTP sem sucesso. Na lista, o `catch` guarda uma mensagem em `erro`, declarado com `$state`; o template a mostra com `role="alert"`. O `finally` encerra o carregamento. A mensagem aparece antes da condição de lista vazia.

O tratamento HTTP é necessário porque `fetch` pode resolver uma Promise mesmo recebendo HTTP 500. Nenhuma dependência nova foi necessária.

### Pendências verificadas

A opção de tentar novamente ainda não existe na lista. Em projetos, uma falha pode ser apresentada como lista vazia; no Kanban, falhas podem aparecer como página não encontrada. A #35 corrigiu a distinção nos detalhes de tarefa e projeto. Distinguir esses estados e permitir repetir a busca faz parte do pedido da #33, não de um marco futuro.

### Como conferir

Simule HTTP 503 nas requisições de leitura ou pare temporariamente a API. Confira a mensagem apresentada e a possibilidade de repetir a busca. Não use uma falha de rede como evidência de banco vazio ou de registro inexistente.

## Issue 34 — Mostrar o estado vazio

**Responsável:** Felipe Borges Barros.

### Objetivo

Mostrar uma mensagem quando não há tarefas, quando o projeto não tem tarefas ou quando a busca e os filtros não encontram nada.

### Como funciona

A lista (`src/routes/+page.svelte`) tinha uma única mensagem, "Nenhuma tarefa encontrada.", para dois casos diferentes. Agora os blocos condicionais do Svelte testam, nesta ordem:

1. `carregando` e `erro`, que já existiam pelas issues 32 e 33;
2. `tarefas.length === 0`: a API não devolveu nenhuma tarefa, então aparece "Nenhuma tarefa cadastrada ainda.";
3. `tarefasFiltradas.length === 0`: existem tarefas, mas nenhuma passa pela busca e pelos filtros, então aparece "Nenhuma tarefa encontrada com a busca e os filtros atuais.".

A ordem importa: se o teste dos filtros viesse primeiro, uma lista vazia também mostraria a mensagem de busca. O quadro (`src/routes/quadro/+page.svelte`) usa as mesmas duas mensagens acima das colunas, comparando `data.tarefas` (o que veio do `load`) com `tarefasFiltradas`. Cada coluna vazia continua mostrando "Nenhuma tarefa nesta coluna.".

A página do projeto já mostrava "Este projeto ainda não tem tarefas." e não foi alterada. As mensagens usam `role="status"`, para leitores de tela anunciarem a mudança sem tratá-la como erro.

### Como conferir

Com `npx --no-install json-server db.json` e `npm run dev`:

1. Em `/` e em `/quadro`, digite na busca um título que não existe: aparece a mensagem de busca e filtros.
2. Limpe a busca: as tarefas voltam e a mensagem some.
3. Abra um projeto sem tarefas: aparece "Este projeto ainda não tem tarefas.".
4. Para ver "Nenhuma tarefa cadastrada ainda.", use uma cópia do `db.json` com `"tarefas": []`; não apague os dados reais.

`tests/visoes.test.mjs` cobre as três situações no quadro: sem tarefas, sem resultado da busca e com tarefas.

### GitHub

- Issue: [#34 - Mostrar o estado vazio](https://github.com/crispolas/ASTRA/issues/34).
- Commit: `38d11c7`. Pull request: [#72](https://github.com/crispolas/ASTRA/pull/72).

## Issue 35 — Tratar tarefa ou projeto inexistente

**Responsável:** Felipe Borges Barros.

### Objetivo

Abrir `/tarefas/999` ou `/projetos/999` deve mostrar "não encontrado", em vez de carregamento infinito.

### Como estava

- `/tarefas/999` mostrava a página genérica "Página não encontrada / Erro 404". O `catch` do `load` transformava qualquer erro em 404, então, com a API desligada, uma tarefa existente também aparecia como "não encontrada".
- `/projetos/999` mostrava "não foi possível carregar o projeto. Confira se a API está ligada e se o projeto existe.", a mesma mensagem da API desligada.

As duas telas não diferenciavam "o registro não existe" de "a API está fora do ar".

### Como funciona

1. **A API informa o status.** Em `src/lib/api.ts`, as respostas sem sucesso passaram a lançar `ErroApi`, uma classe que estende `Error` e guarda `status`. A mensagem continua igual, então quem já mostrava o erro não muda.
2. **O `load` separa os casos.** Em `src/routes/tarefas/[id]/+page.ts` e `src/routes/projetos/[id]/+page.ts`, o `try` busca o registro. No `catch`, `erro instanceof ErroApi && erro.status === 404` vira `naoEncontrada` / `naoEncontrado`. O json-server responde 404 quando o ID não existe. Falha de conexão não é `ErroApi`, então cai no aviso de API fora do ar.
3. **A página escolhe a mensagem.** As páginas usam `{#if}`, `{:else if data.naoEncontrada}` e `{:else}`: dados da tarefa, "Tarefa não encontrada." ou "Erro: não foi possível carregar a tarefa. Confira se a API está ligada.". O projeto segue o mesmo padrão.

Como o `load` termina antes de a página aparecer, nunca fica um carregamento infinito. As duas páginas mantêm o cabeçalho e o link de voltar, para a pessoa sair da tela de erro.

### Como conferir

Com `npx --no-install json-server db.json` e `npm run dev`:

1. Abra `/tarefas/999` e `/projetos/999`: aparece "Tarefa não encontrada." e "Projeto não encontrado.".
2. Abra `/tarefas/1` e `/projetos/1`: os dados aparecem normalmente.
3. Desligue a API e abra `/tarefas/1`: aparece o aviso de API fora do ar, não "não encontrada".

`tests/tarefa-page.test.mjs` e `tests/projeto-page.test.mjs` simulam a API respondendo 404 e a conexão falhando, e conferem a mensagem de cada caso.

### Limites

A tela de edição (`/tarefas/:id/editar`) não foi alterada; a issue cita apenas as páginas de detalhe.

### GitHub

- Issue: [#35 - Tratar tarefa ou projeto inexistente](https://github.com/crispolas/ASTRA/issues/35).
- Commit: `4c33e25`. Pull request: [#72](https://github.com/crispolas/ASTRA/pull/72).

## Issue 36 — Tratar falha ao salvar e ao excluir

### Objetivo

Avisar a pessoa quando uma operação falhar e preservar o que ela digitou.

### Como funciona

O formulário compartilhado mantém os campos em `$state`, ligados aos controles com `bind:value`. O `catch` define `erroEnvio` sem limpar os campos; `finally` libera o envio. Cadastro e edição só navegam após o sucesso da API.

Na exclusão, `onexcluir` só é chamado depois do sucesso do DELETE. Se houver falha, o cartão permanece, aparece um alerta e `finally` reabilita o botão. Não foram necessárias dependências adicionais.

### Como conferir

Simule HTTP 500 em POST e PATCH: os campos, a página e os dados digitados devem permanecer, com aviso e botão reabilitado. Simule HTTP 500 em DELETE: a tarefa deve continuar na lista, com aviso e nova tentativa disponível. A conferência no navegador usou respostas interceptadas, sem gravar ou excluir dados reais.

Os slides 12 e 13, contando a capa como slide 1, e seus roteiros mostram esses fluxos com simulações locais. Issue: [#36](https://github.com/crispolas/ASTRA/issues/36).

## Issue 37 — Auditar acessibilidade e responsividade

**Responsável:** Brenno Milhomem Farias.

A entrega foi integrada pelo [PR #71](https://github.com/crispolas/ASTRA/pull/71). O commit registra conferência com Lighthouse no DevTools e adiciona uma meta description em `src/app.html`, documento base do SvelteKit. O repositório não contém relatório com notas; os slides não atribuem pontuações à auditoria. A descrição é um metadado do site, não uma comprovação de acessibilidade.

A apresentação explica a conferência de teclado, foco visível e tela pequena usando recursos presentes na interface: labels associados aos campos, `:focus-visible` no tema e media queries no Kanban. Os dois últimos slides têm demonstrações locais de teclado e reorganização das colunas. Essas regras já existentes são exemplos do que conferir, não alterações atribuídas ao commit da auditoria.

Para demonstrar no site, percorra os controles com Tab e Shift + Tab, acione botões com Enter e confira no modo de dispositivos do DevTools se os controles e textos permanecem utilizáveis. Execute Lighthouse para inspecionar os apontamentos do navegador. Não foi adicionada dependência ao projeto.

## Apresentação — Issue 38

Abra [slides/index.html](slides/index.html) no navegador. O HTML é independente, sem API ou instalação. Letras grandes, margens curtas e contraste alto foram priorizados para projeção. Setas navegam, F ativa tela cheia e N abre o roteiro oculto. A simulação de exclusão é local à apresentação e não altera os dados do ASTRA. A apresentação contém dezessete slides, incluindo a capa do Marco 5: exclusão, carregamento, erro na lista, estado vazio, registro inexistente, infraestrutura local e tratamento de falhas ao salvar e excluir e auditoria de acessibilidade e responsividade. Explica onMount, $state, await, try/catch/finally e os blocos condicionais do Svelte. O botão Tentar novamente ainda não está implementado e não é apresentado como concluído. A apresentação não declara #32 e #33 integralmente concluídas; as pendências ficam registradas nas seções correspondentes.


Os slides usam fontes ampliadas, margens curtas e notas ocultas. **← / →** navegam, **F** solicita tela cheia e **N** abre ou fecha o roteiro. O botão das notas fica oculto na lateral esquerda, aparecendo no hover ou no foco. A [versão PDF](slides/apresentacao.pdf) serve de reserva, sem notas. O HTML pode ser baixado do GitHub e aberto diretamente no navegador.

### Metodologia da apresentação

Os slides mostram a implementação em etapas, com código curto, significado dos recursos e motivo das decisões. As explicações essenciais de callback, estado reativo, ciclo de vida, tratamento de falhas e CSS ficam visíveis; o roteiro oculto complementa a fala. As interações demonstram o mecanismo explicado em cada cena.

### Organização atual dos slides

| Slides | Conteúdo |
| --- | --- |
| 1 | Capa do Marco 5 e equipe |
| 2–5 | #31: exclusão, API, callback, estado reativo e demonstração |
| 6–7 | #32: onMount, await, $state, finally e carregamento |
| 8–9 | #33: falha HTTP, catch e renderização condicional |
| 10 | #34: diferença entre lista vazia, busca sem resultado e projeto sem tarefas |
| 11 | #35: ErroApi, status 404, load e mensagem de inexistência |
| 12–13 | #36: preservação dos campos e falha de exclusão |
| 14–15 | #37: teclado, foco, Lighthouse e responsividade do Kanban |
| 16 | Mapa arrastável e clicável da infraestrutura local, sem título |
| 17 | Encerramento com a abertura real de `/inicio`, para passagem à demonstração |

A infraestrutura representa a versão atual: SvelteKit em desenvolvimento e json-server são processos separados. Algumas rotas usam api.ts; outras fazem fetch diretamente. O diagrama não apresenta hospedagem ou configuração de produção, previstas no Marco 6.

A capa mantém a lua ASCII e os quatro integrantes. O cartão de demonstração tem borda completa e a explicação fica abaixo. O cenário respeita movimento reduzido e pode ser ativado nas notas. As simulações do HTML não alteram dados reais; o PDF é estático e não inclui notas. Ensaiar a apresentação para respeitar o limite de cinco minutos da professora.


### Mapa, percurso lunar e encerramento

A infraestrutura ocupa um mapa sem título, com seis nós arrastáveis e conexões que acompanham o reposicionamento. Clique ou Enter seleciona a parte e exibe arquivos e função; Alt + setas reposiciona o nó focado. O mapa preserva a posição dos nós durante a apresentação.

Da capa ao slide 2 a lua fica à direita. Ao entrar no slide 3, a mesma lua atravessa a tela em aproximadamente 1,8 segundo e passa a ocupar a esquerda nos slides seguintes. Movimento reduzido aplica a posição sem a travessia.

O slide 17 reutiliza o renderer de `src/lib/entrada/animacao.ts`, a geometria de `constelacao.ts` e os estilos da abertura de `src/routes/inicio/+page.svelte`, compilados e incorporados ao HTML para funcionar offline. Esses arquivos da aplicação não foram alterados. O ciclo de animação da abertura é montado e limpo ao entrar e sair do último slide.

Para passar à aplicação por Alt+Tab, deixe o ASTRA na rota real `/inicio`, usando o mesmo zoom, tamanho de janela e modo de tela cheia. O desenho e o enquadramento são os mesmos; as animações executam independentemente e não têm sincronização de fase entre janelas. A infraestrutura continua representando apenas o ambiente local atual, sem antecipar o Marco 6.
