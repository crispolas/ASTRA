# ASTRA — Marco 5

Diário técnico de exclusão, erros e estados da tela.

**Equipe:** Brenno Milhomem Farias, Eurípedes Rocha Neto, Gabriel Crispim Galvão e Felipe Borges Barros.

**Tecnologias:** Svelte 5, SvelteKit, TypeScript e json-server.

## Organização

| Issue | Tarefa | Responsável | Registro |
| --- | --- | --- | --- |
| #31 | Excluir tarefa com confirmação | Gabriel Crispim Galvão | Integrada à main pelo PR #68 |
| #32 | Estado de carregamento | Eurípedes Rocha Neto | PR #69: alterações na lista geral; demais telas ainda precisam de conferência |
| #33 | Estado de erro e tentar novamente | Eurípedes Rocha Neto | PR #69: alterações na lista geral; demais telas ainda precisam de conferência |
| #34 | Estado vazio | A definir | Sem implementação registrada neste documento |
| #35 | Tarefa ou projeto inexistente | A definir | Sem implementação registrada neste documento |
| #36 | Falha ao salvar e excluir | A confirmar pela equipe | Comportamento verificado em cadastro, edição e exclusão; slides e roteiro incluídos |
| #37 | Auditoria de acessibilidade e responsividade | Brenno Milhomem Farias | Integrada pelo PR #71; slides e roteiro incluídos |
| #38 | Apresentação do Marco 5 | Gabriel Crispim Galvão | Slides da #31 e dos estados da lista (#32 e #33) em slides/index.html |

Os responsáveis não definidos não foram atribuídos automaticamente. Os slides são parciais: não apresentam as demais issues como concluídas. O marco só estará completo após as entregas restantes.

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

## Registro das issues 32 e 33

O [PR #69](https://github.com/crispolas/ASTRA/pull/69), de Eurípedes Rocha Neto, foi integrado à main e alterou `src/routes/+page.svelte` para carregamento e erro. Este registro identifica a integração; não equivale a uma auditoria do comportamento em todas as rotas. As seções técnicas detalhadas podem ser complementadas pelo responsável.

## Apresentação inicial — Issue 38

Abra [slides/index.html](slides/index.html) no navegador. O HTML é independente, sem API ou instalação. Letras grandes, margens curtas e contraste alto foram priorizados para projeção. Setas navegam, F ativa tela cheia e N abre o roteiro oculto. A simulação de exclusão é local à apresentação e não altera os dados do ASTRA. A apresentação contém doze slides: exclusão, carregamento, erro na lista, tratamento de falhas ao salvar e excluir e auditoria de acessibilidade e responsividade. Explica onMount, $state, await, try/catch/finally e os blocos condicionais do Svelte. O botão Tentar novamente ainda não está implementado e não é apresentado como concluído. As demais issues serão acrescentadas após a implementação.


Os slides usam fontes ampliadas, margens curtas e notas ocultas. **← / →** navegam, **F** solicita tela cheia e **N** abre ou fecha o roteiro. O botão das notas fica oculto na lateral esquerda, aparecendo no hover ou no foco. A [versão PDF](slides/apresentacao.pdf) serve de reserva, sem notas. O HTML pode ser baixado do GitHub e aberto diretamente no navegador.


## Issue 36 — Tratar falha ao salvar e ao excluir

### Objetivo

Avisar a pessoa quando uma operação falhar e preservar o que ela digitou.

### Como funciona

O formulário compartilhado mantém os campos em `$state`, ligados aos controles com `bind:value`. O `catch` define `erroEnvio` sem limpar os campos; `finally` libera o envio. Cadastro e edição só navegam após o sucesso da API.

Na exclusão, `onexcluir` só é chamado depois do sucesso do DELETE. Se houver falha, o cartão permanece, aparece um alerta e `finally` reabilita o botão. Não foram necessárias dependências adicionais.

### Como conferir

Simule HTTP 500 em POST e PATCH: os campos, a página e os dados digitados devem permanecer, com aviso e botão reabilitado. Simule HTTP 500 em DELETE: a tarefa deve continuar na lista, com aviso e nova tentativa disponível. A conferência no navegador usou respostas interceptadas, sem gravar ou excluir dados reais.

Os dois últimos slides e seus roteiros mostram esses fluxos com simulações locais. Issue: [#36](https://github.com/crispolas/ASTRA/issues/36).


## Issue 37 — Auditar acessibilidade e responsividade

**Responsável:** Brenno Milhomem Farias.

A entrega foi integrada pelo [PR #71](https://github.com/crispolas/ASTRA/pull/71). O commit registra conferência com Lighthouse no DevTools e adiciona uma meta description em `src/app.html`, documento base do SvelteKit. O repositório não contém relatório com notas; os slides não atribuem pontuações à auditoria. A descrição é um metadado do site, não uma comprovação de acessibilidade.

A apresentação explica a conferência de teclado, foco visível e tela pequena usando recursos presentes na interface: labels associados aos campos, `:focus-visible` no tema e media queries no Kanban. Os dois últimos slides têm demonstrações locais de teclado e reorganização das colunas. Essas regras já existentes são exemplos do que conferir, não alterações atribuídas ao commit da auditoria.

Para demonstrar no site, percorra os controles com Tab e Shift + Tab, acione botões com Enter e confira no modo de dispositivos do DevTools se os controles e textos permanecem utilizáveis. Execute Lighthouse para inspecionar os apontamentos do navegador. Não foi adicionada dependência ao projeto.
