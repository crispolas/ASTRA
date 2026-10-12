# Documentação do ASTRA

Este documento registra o que foi desenvolvido no projeto. Cada membro da equipe deve adicionar uma seção para explicar sua issue de forma simples.

## Sobre o projeto

O ASTRA é um gerenciador de tarefas acadêmicas desenvolvido para a disciplina de Desenvolvimento Frontend.

## Equipe

- Brenno Milhomem Farias
- Eurípedes Rocha Neto
- Gabriel Crispim Galvão
- Felipe Borges Barros

## Tecnologia

O projeto usa SvelteKit com TypeScript.

## Como instalar

Na primeira execução, instale as dependências:

```sh
npm install
```

## Como iniciar a aplicação

```sh
npm run dev -- --open
```

A aplicação normalmente estará disponível em:

```text
http://localhost:5173
```

## Como iniciar a API local

Abra outro terminal e execute:

```sh
npx json-server db.json
```

A API estará disponível em `http://localhost:3000`.

Os principais endereços são:

```text
http://localhost:3000/tarefas
http://localhost:3000/projetos
```

## Como verificar o projeto

```sh
npm test
npm run check
npm run build
```

- `npm test` executa os testes automatizados.
- `npm run check` procura erros de Svelte e TypeScript.
- `npm run build` confirma que a aplicação pode ser gerada para produção.

## Como documentar uma issue

Cada membro deve adicionar sua issue neste documento usando esta estrutura:

```md
## Issue número - Nome da issue

**Responsável:** Nome da pessoa

### Objetivo

Explique o resultado esperado.

### O que foi feito

Explique as alterações realizadas.

### Como testar

Explique como outra pessoa pode conferir o funcionamento.
```

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
