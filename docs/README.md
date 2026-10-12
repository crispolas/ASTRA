# Documentação da issue 9 - Configurar o roteador

## Objetivo

Esta issue criou as rotas iniciais do ASTRA.

As páginas ainda são provisórias. Cada uma mostra apenas um título (`h1`) e um subtítulo (`h2`). O conteúdo completo será adicionado nas outras issues do projeto.

## Como o roteamento funciona

O ASTRA usa SvelteKit. Nesse framework, não precisamos instalar uma biblioteca de roteamento separada.

O SvelteKit cria as rotas usando as pastas e os arquivos dentro de `src/routes`. Um arquivo chamado `+page.svelte` representa uma página que pode ser aberta no navegador.

Por exemplo:

```text
src/routes/projetos/+page.svelte
```

Esse arquivo cria a rota:

```text
/projetos
```

## Rotas criadas

| Endereço | Arquivo | O que mostra atualmente |
| --- | --- | --- |
| `/` | `src/routes/+page.svelte` | Página inicial de tarefas |
| `/tarefas/:id` | `src/routes/tarefas/[id]/+page.svelte` | Página provisória de uma tarefa |
| `/projetos` | `src/routes/projetos/+page.svelte` | Página provisória da lista de projetos |
| `/projetos/:id` | `src/routes/projetos/[id]/+page.svelte` | Página provisória de um projeto |

### O que significa `[id]`?

Os colchetes indicam uma parte variável da URL.

Por exemplo, estes endereços usam a mesma página:

```text
/tarefas/1
/tarefas/25
/tarefas/abc
```

Em todos eles, o valor depois de `/tarefas/` é o `id`.

## Página não encontrada

O arquivo `src/routes/+error.svelte` personaliza a página de erro.

Quando alguém abre um endereço que não existe, como `/pagina-inexistente`, o servidor responde com o status HTTP `404` e mostra a mensagem "Página não encontrada".

## Testes adicionados

O arquivo `tests/routes.test.mjs` contém testes de integração das rotas.

Esses testes iniciam um servidor local do Vite e acessam as páginas como um navegador faria. Eles verificam:

- se as quatro rotas respondem com o status `200`;
- se cada página mostra o `h1` e o `h2` esperados;
- se uma rota inexistente responde com o status `404`;
- se a página personalizada de erro é exibida.

O comando para executar os testes foi adicionado ao `package.json`:

```sh
npm test
```

## Como executar o projeto

Na primeira execução, instale as dependências:

```sh
npm install
```

Depois, inicie a aplicação:

```sh
npm run dev -- --open
```

A aplicação normalmente ficará disponível em:

```text
http://localhost:5173
```

Para testar manualmente, abra:

```text
http://localhost:5173/
http://localhost:5173/tarefas/1
http://localhost:5173/projetos
http://localhost:5173/projetos/1
http://localhost:5173/pagina-inexistente
```

## API local

A API local pode ser iniciada em outro terminal:

```sh
npx json-server db.json
```

Ela fica disponível em `http://localhost:3000`.

As páginas provisórias desta issue ainda não usam a API. Ela será usada pelas telas que listam e mostram os dados das tarefas e dos projetos.

## Comandos de verificação

Execute estes comandos antes de enviar novas alterações:

```sh
npm test
npm run check
npm run build
```

- `npm test` verifica o comportamento das rotas.
- `npm run check` procura erros de Svelte e TypeScript.
- `npm run build` confirma que a aplicação pode ser gerada para produção.

## O que ainda falta

Esta issue preparou apenas os caminhos das páginas. As próximas issues devem substituir o conteúdo provisório por:

- lista de tarefas vinda da API;
- detalhes de uma tarefa;
- lista de projetos;
- dados e tarefas de um projeto;
- layout e menu de navegação.

## GitHub

- Issue: [#9 - Configurar o roteador](https://github.com/crispolas/ASTRA/issues/9)
- Pull request: [#47 - Configura as rotas iniciais da aplicação](https://github.com/crispolas/ASTRA/pull/47)
