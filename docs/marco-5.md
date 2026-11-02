# ASTRA — Marco 5

Diário técnico de exclusão, erros e estados da tela.

**Equipe:** Brenno Milhomem Farias, Eurípedes Rocha Neto, Gabriel Crispim Galvão e Felipe Borges Barros.

**Tecnologias:** Svelte 5, SvelteKit, TypeScript e json-server.

## Organização

| Issue | Tarefa | Responsável | Registro |
| --- | --- | --- | --- |
| #31 | Excluir tarefa com confirmação | Gabriel Crispim Galvão | Implementada e verificada nesta branch; aguarda integração |
| #32 | Estado de carregamento | A definir | Sem implementação registrada neste documento |
| #33 | Estado de erro e tentar novamente | A definir | Sem implementação registrada neste documento |
| #34 | Estado vazio | A definir | Sem implementação registrada neste documento |
| #35 | Tarefa ou projeto inexistente | A definir | Sem implementação registrada neste documento |
| #36 | Falha ao salvar e excluir | A definir | Complementa os fluxos de escrita |
| #37 | Auditoria de acessibilidade e responsividade | A definir | Sem auditoria registrada neste documento |
| #38 | Apresentação do Marco 5 | Gabriel Crispim Galvão | Material inicial da #31 em slides-marco-5/index.html |

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
- Em falha, a tarefa permanece na tela, o botão é reabilitado e aparece uma mensagem básica. A #36 continua responsável pelo tratamento mais amplo das falhas de escrita.

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
- O PR deve usar `Closes #31` para vincular a entrega e encerrar a issue somente quando integrado à main.

## Apresentação inicial — Issue 38

Abra [slides-marco-5/index.html](slides-marco-5/index.html) no navegador. O HTML é independente, sem API ou instalação. Letras grandes, margens curtas e contraste alto foram priorizados para projeção. Setas navegam, F ativa tela cheia e N abre o roteiro oculto. A simulação de exclusão é local à apresentação e não altera os dados do ASTRA. O restante do Marco 5 será documentado e acrescentado aos slides quando implementado.
