# ASTRA — Marco 3

Diário técnico de cadastro e edição, atualizado pela equipe conforme o desenvolvimento avança.

**Equipe:** Brenno Milhomem Farias, Eurípedes Rocha Neto, Gabriel Crispim Galvão e Felipe Borges Barros.

**Tecnologias:** SvelteKit + TypeScript e json-server.

**Prazo:** 21/10/2026 às 23h59 para a turma de quinta, conforme o PDF da professora. Para a turma de quarta, o prazo indicado é 20/10/2026 às 23h59.

## Objetivo do marco

Implementar cadastro e edição de tarefas e projetos, gravando as alterações na API. O formulário de tarefa será compartilhado pelas telas de criação e edição, com validação e acessibilidade.

O escopo abaixo segue o documento da professora “Projeto em equipe: issues dos Marcos 1 a 6”, página 3. As seções descrevem resultados esperados; os campos de implementação permanecem **A preencher**. Esta documentação não significa que as funcionalidades já estão prontas.

## Divisão das tarefas

| Issue | Tarefa | Responsável |
| --- | --- | --- |
| #16 | Ampliar o módulo da API (escrita) | Felipe Borges Barros |
| #17 | Criar o componente de formulário de tarefa | Gabriel Crispim Galvão |
| #18 | Criar a tela de nova tarefa | Brenno Milhomem Farias |
| #19 | Criar a tela de edição de tarefa | Eurípedes Rocha Neto |
| #20 | Validar o formulário | Eurípedes Rocha Neto |
| #21 | Tornar o formulário acessível | Brenno Milhomem Farias |
| #22 | Criar cadastro e edição de projeto | Felipe Borges Barros |
| #23 | Criar o slide de apresentação do Marco 3 | Gabriel Crispim Galvão |

Divisão planejada nesta conversa. Se a equipe combinar alguma mudança, atualize a tabela e a seção da issue.

## Ordem de trabalho combinada

1. **Felipe implementa a #16.** Documenta as funções de escrita, os parâmetros e os retornos para que as telas possam utilizá-las.
2. **Crispim implementa a #17 com esse contrato disponível.** Enquanto espera a API, pode levantar os campos e planejar o formulário usando os tipos existentes.
3. **Brenno e Eurípedes podem preparar as rotas #18 e #19 em paralelo.** A edição já pode consultar a tarefa pelo módulo de leitura. Para concluir o envio e a gravação, ambas precisam da #16 e da #17.
4. **Eurípedes acrescenta a validação #20 ao formulário integrado.** Depois, **Brenno acrescenta e confere a acessibilidade #21** usando a versão atualizada.
5. **Felipe desenvolve a #22 após a API de escrita**, reutilizando as consultas já existentes.
6. **A equipe testa os fluxos completos.** Crispim reúne o que foi implementado para a #23.

Essa sequência é uma organização da equipe para facilitar o aprendizado e reduzir conflitos; não é uma ordem obrigatória imposta pela professora.

**#17, #20 e #21 trabalham no mesmo formulário de tarefa.** Não devem criar três formulários separados. Antes de cada etapa, atualize a branch com a versão integrada e combine quem está editando o componente compartilhado.

## Base existente e informações para integração

- `src/tipos.ts` contém o contrato de dados. Preserve os campos e os tipos dos identificadores definidos pela disciplina.
- `NovaTarefa` é `Omit<Tarefa, 'id'>`: representa os campos da tarefa sem o identificador.
- `src/lib/api.ts` já fornece `listarTarefas()`, `buscarTarefa(id)`, `listarProjetos()` e `buscarProjeto(id)`. As funções de escrita ainda devem ser implementadas e registradas na #16.
- O formulário deve trabalhar com os campos do contrato, incluindo a seleção do projeto a partir da API.
- As rotas de lista e detalhe do Marco 2 já existem. As novas telas devem se integrar a elas.

Antes de conectar as telas, registre na #16 os nomes reais das funções e seus tipos. Na #17, registre as props do componente, como recebe valores iniciais e como comunica o envio. Esses detalhes serão acordados durante a implementação; este diário não inventa uma assinatura obrigatória.

## Como executar o projeto

Na raiz do ASTRA, com Node.js e npm compatíveis com o projeto, instale as dependências se necessário:

```sh
npm ci
```

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

No Windows PowerShell, use `npm.cmd` e `npx.cmd` se a política de execução bloquear os comandos. Mantenha os dois terminais rodando.

Neste marco, salvar pelo formulário deve alterar os dados servidos pelo json-server. Use registros de teste identificáveis e preserve o contrato; não altere os IDs para contornar problemas. No ambiente de nuvem, siga as instruções salvas de inicialização, que usam uma cópia do banco.

Verificações existentes:

```sh
npm test
npm run check
npm run build
```

Esses comandos não substituem testar cadastro e edição com a API real. Cada responsável deve registrar os resultados observados, sem descrever verificações não executadas como aprovadas.

## Como documentar uma issue

Use o mesmo formato simples do Marco 2:

```md
## Issue número - Nome da issue

**Responsável:** Nome da pessoa

### Objetivo

Explique o resultado esperado.

### O que foi feito

Explique a implementação e os arquivos envolvidos.

### Como testar

Informe os passos, os dados usados e os resultados observados.

### GitHub

- Issue: link da issue.
- Commit ou Pull Request: referência real.
```

Acrescente “Como funciona”, “Dificuldades e soluções” e “Para continuar” quando isso ajudar outro integrante. Registre contratos compartilhados e decisões de integração, sem transformar planos em resultados concluídos.

---

## Issue 16 - Ampliar o módulo da API (escrita)

**Responsável:** Felipe Borges Barros.

### Objetivo

Criar funções tipadas para criar e atualizar tarefas e projetos.

Para continuar: registrar os nomes reais das funções, os dados recebidos e os retornos, para #17, #18, #19 e #22.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#16 - Ampliar o módulo da API (escrita)](https://github.com/crispolas/ASTRA/issues/16).
- Commit ou Pull Request: A preencher.

---

## Issue 17 - Criar o componente de formulário de tarefa

**Responsável:** Gabriel Crispim Galvão.

### Objetivo

Criar um formulário com os campos do contrato e um seletor de projetos carregado da API. Reutilizar o mesmo componente para criar e editar tarefas.

Para continuar: registrar as propriedades do componente, os valores iniciais e como o envio é comunicado à tela. Combinar as alterações desse arquivo com os responsáveis por #20 e #21.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#17 - Criar o componente de formulário de tarefa](https://github.com/crispolas/ASTRA/issues/17).
- Commit ou Pull Request: A preencher.

---

## Issue 18 - Criar a tela de nova tarefa

**Responsável:** Brenno Milhomem Farias.

### Objetivo

Criar a rota `/tarefas/nova`, gravar a tarefa na API e voltar para a lista. Quando aberta pela página de um projeto, a tela deve apresentar esse projeto já selecionado. O segmento `nova` não pode ser interpretado como ID de tarefa.

Depende da API de escrita #16 e do formulário #17 para concluir o fluxo; a estrutura da rota pode ser preparada antes.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#18 - Criar a tela de nova tarefa](https://github.com/crispolas/ASTRA/issues/18).
- Commit ou Pull Request: A preencher.

---

## Issue 19 - Criar a tela de edição de tarefa

**Responsável:** Eurípedes Rocha Neto.

### Objetivo

Criar a rota `/tarefas/:id/editar`, abrir o formulário com os dados atuais da tarefa e salvar as alterações na API.

Depende da API de escrita #16 e do formulário #17 para concluir o fluxo. A leitura da tarefa pode usar a função existente `buscarTarefa(id)`.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#19 - Criar a tela de edição de tarefa](https://github.com/crispolas/ASTRA/issues/19).
- Commit ou Pull Request: A preencher.

---

## Issue 20 - Validar o formulário

**Responsável:** Eurípedes Rocha Neto.

### Objetivo

Validar os campos obrigatórios, mostrar a mensagem de erro junto ao campo correspondente e bloquear o botão durante o envio.

Aplicar a validação ao formulário compartilhado da #17, respeitando o contrato e os requisitos da professora. Registrar quais campos são obrigatórios e as regras efetivamente adotadas, sem presumir limites ou regras extras.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#20 - Validar o formulário](https://github.com/crispolas/ASTRA/issues/20).
- Commit ou Pull Request: A preencher.

---

## Issue 21 - Tornar o formulário acessível

**Responsável:** Brenno Milhomem Farias.

### Objetivo

Garantir que todo campo tenha label, que o formulário possa ser usado completamente pelo teclado e que os erros sejam perceptíveis sem depender somente de cores.

Trabalhar sobre o formulário integrado, com as validações da #20. Registrar como associar os campos às mensagens de erro e os passos de uso por teclado.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#21 - Tornar o formulário acessível](https://github.com/crispolas/ASTRA/issues/21).
- Commit ou Pull Request: A preencher.

---

## Issue 22 - Criar cadastro e edição de projeto

**Responsável:** Felipe Borges Barros.

### Objetivo

Criar as rotas `/projetos/novo` e `/projetos/:id/editar`, seguindo o mesmo fluxo de cadastro e edição das tarefas, com gravação na API. O segmento `novo` não pode ser interpretado como ID de projeto.

Depende da API de escrita #16. Reutilizar o contrato de Projeto e as consultas existentes, documentando o fluxo de envio e o retorno após salvar.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#22 - Criar cadastro e edição de projeto](https://github.com/crispolas/ASTRA/issues/22).
- Commit ou Pull Request: A preencher.

---

## Issue 23 - Criar o slide de apresentação do Marco 3

**Responsável:** Gabriel Crispim Galvão.

### Objetivo

Preparar slides com o que foi implementado e uma demonstração de cadastro e edição. A apresentação deve durar no máximo cinco minutos.

Reunir material dos quatro integrantes após a integração. Registrar o caminho ou link dos slides e o roteiro real, incluindo os comandos necessários para a demonstração.

### O que foi feito

A preencher.

### Como testar

A preencher.

### GitHub

- Issue: [#23 - Criar o slide de apresentação do Marco 3](https://github.com/crispolas/ASTRA/issues/23).
- Commit ou Pull Request: A preencher.

---

## Conferência final do Marco 3

Lista de verificações planejadas; nenhuma funcionalidade é declarada aprovada por este checklist.

- [ ] Criar uma tarefa pela rota `/tarefas/nova`, gravar na API e voltar à lista.
- [ ] Abrir o cadastro pela página de um projeto e conferir a seleção inicial desse projeto.
- [ ] Abrir `/tarefas/:id/editar` com os valores atuais, salvar e conferir a alteração na API e na aplicação.
- [ ] Conferir campos obrigatórios, mensagens junto aos campos e botão bloqueado durante o envio.
- [ ] Usar todos os campos e o envio apenas pelo teclado; conferir labels e mensagens de erro sem depender só da cor.
- [ ] Criar e editar projetos nas rotas previstas, conferindo a gravação.
- [ ] Abrir diretamente `/tarefas/nova` e `/projetos/novo` e conferir que são telas de cadastro.
- [ ] Executar as verificações do projeto e registrar os resultados.
- [ ] Preparar e ensaiar a apresentação de até cinco minutos.

## Registro de integração

| Issues | Decisão ou problema | Solução ou acordo | Responsável | Referência |
| --- | --- | --- | --- | --- |
| #17, #20 e #21 | As três tarefas alteram o formulário compartilhado | Integrar a base, depois validação e depois acessibilidade; combinar a edição do arquivo entre responsáveis | Crispim, Eurípedes e Brenno | Planejamento da equipe |
| A preencher | A preencher | A preencher | A preencher | A preencher |

## Quando uma issue está concluída?

- [ ] O resultado esperado está implementado.
- [ ] O fluxo foi testado e os resultados foram registrados.
- [ ] O código ou material está integrado.
- [ ] A seção correspondente deste diário está atualizada.
- [ ] O commit ou PR real está identificado.
- [ ] As informações necessárias para as próximas tarefas estão disponíveis.

Mantenha o histórico do Marco 2 em seu próprio documento. Este diário deve receber os resultados reais conforme cada responsável concluir seu trabalho.
