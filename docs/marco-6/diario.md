# ASTRA — Marco 6

## Issue 39 — Tirar a URL da API do código

**Responsável:** Gabriel Crispim Galvão

### Objetivo

Configurar o endereço da API por variável de ambiente, permitindo endereços
diferentes em desenvolvimento e produção sem editar o código das requisições.

### O que foi feito e por quê

Declaramos `PUBLIC_API_URL` em `src/env.ts` usando `defineEnvVars` do SvelteKit
instalado no projeto. A declaração é pública porque há requisições feitas pelo
navegador, e estática porque o endereço é incorporado durante o build.
O valor é obrigatório e precisa começar com HTTP ou HTTPS.

`src/lib/configuracao.ts` disponibiliza esse endereço ao módulo `api.ts` e aos
carregamentos de projetos e do quadro. Apenas a origem das URLs mudou: os caminhos,
métodos, dados enviados e tratamento de erros permanecem os mesmos. A barra final
é removida para não duplicar barras na montagem dos caminhos.

`.env.example` mostra a configuração local e pode ser copiado para `.env`, que
não é versionado. `.env.test` define o endereço dos testes simulados. Na produção,
a variável deve ser definida com a URL real da API antes do build; essa URL será
fornecida na issue #40. Nenhum pacote novo foi instalado.

### Como testar

1. Copie `.env.example` para `.env` e inicie a API local com
   `npx json-server db.json --port 3000`.
2. Em outro terminal, execute `npm run dev` e confira tarefas, projetos e quadro.
3. Para usar outra porta, altere `PUBLIC_API_URL` no `.env`, inicie a API nessa
   porta e reinicie o servidor SvelteKit. Os três pontos devem usar o novo endereço.
4. Execute `npm run check` e `node --test --test-concurrency=1 tests/*.test.mjs`.
5. Defina a variável com a URL de produção antes de executar `npm run build`.
   No PowerShell: `$env:PUBLIC_API_URL='https://endereco-real-da-api'; npm.cmd run build`.

### Validação realizada

- Verificação de tipos: zero erros e avisos.
- 40 testes passaram, incluindo leitura, escrita, exclusão e os dois carregamentos
  com URLs alternativas, uma delas com prefixo de caminho e barra final.
- Build com URL HTTPS de teste concluído; o bundle cliente contém essa URL e não
  contém `http://localhost:3000`.

O endereço de teste não representa uma API hospedada. Hospedagem, publicação,
adaptação de deploy e slides não fazem parte desta alteração.

## Issue 40 — Migrar a API para um serviço hospedado

**Responsável pela publicação no Render:** Felipe Borges e Gabriel Crispim Galvão

### O que já está pronto no repositório

- `Dockerfile` na raiz: sobe o mesmo `json-server@1.0.0-beta.15` usado em
  desenvolvimento, com os dados de exemplo de `db.seed.json`, escutando em
  `0.0.0.0` na porta `$PORT` (definida pelo Render) ou `3000`.
- `.dockerignore`: envia ao build apenas o `db.seed.json`.
- O contrato não muda: mesmas rotas `/tarefas` e `/projetos`, mesmos campos.
  O `json-server` já responde com CORS liberado (`Access-Control-Allow-Origin: *`),
  então o site publicado consegue chamar a API.

### O que o responsável precisa fazer

1. Confirmar que o PR com o `Dockerfile` já foi mergeado na `main`.
2. Entrar em <https://render.com> com a conta do GitHub.
3. Clicar em **New +** e depois em **Web Service**.
4. Conectar o repositório `crispolas/ASTRA` (via **Connect GitHub**, autorizando
   o app do Render, ou via **Public Git Repository** colando
   `https://github.com/crispolas/ASTRA`).
5. Preencher:
   - **Name:** `astra-api`
   - **Language/Runtime:** `Docker`
   - **Branch:** `main`
   - **Root Directory:** vazio
   - **Instance Type:** `Free`
   - **Environment Variables:** nenhuma (o Render define `PORT` sozinho)
6. Clicar em **Deploy Web Service** e esperar no log a mensagem
   `JSON Server started` e o aviso **Your service is live**.
7. Copiar a URL do serviço (ex.: `https://astra-api-xxxx.onrender.com`).
8. Testar no terminal:

   ```sh
   API=https://astra-api-xxxx.onrender.com
   curl -s $API/tarefas | jq length     # deve retornar 5
   curl -s $API/projetos | jq length
   curl -si -H "Origin: https://exemplo.netlify.app" $API/tarefas | grep -i access-control
   ```

### O que o responsável precisa entregar

Abrir uma branch `marco-6-api-render`, fazer um commit e abrir um PR para a
`main` contendo:

1. No `README.md`, seção **Publicação**: trocar `<URL_DA_API>` pela URL real
   do Render (sem barra no final).
2. Neste diário, na seção **Validação realizada** abaixo: a URL, a data do
   deploy e a saída dos três comandos `curl` do passo 8.
3. Na descrição do PR: `Closes #40` e um print do painel do Render com o
   serviço **Live**.

Com a URL em mãos, a equipe segue para a issue #42 (build com
`PUBLIC_API_URL` apontando para o Render e publicação no Netlify).

### Cuidados do plano gratuito

- Após 15 minutos sem acesso o serviço dorme; a primeira requisição leva cerca
  de 50 segundos. Abrir a URL da API um minuto antes da apresentação.
- A cada reinício ou novo deploy os dados voltam ao `db.seed.json`. Tarefas
  criadas na demonstração não ficam salvas.
- Todo push na `main` gera um novo deploy automático.

### Validação realizada

- URL: <https://astra-api-4upe.onrender.com>
- Deploy no Render (plano Free, runtime Docker, branch `main`) feito por Gabriel Crispim Galvão; validado em 10/11/2026.
- Saída dos testes:

  ```text
  $ curl -s $API/tarefas | jq length
  5
  $ curl -s $API/projetos | jq length
  2
  $ curl -si -H "Origin: https://exemplo.netlify.app" $API/tarefas | grep -i access-control
  access-control-allow-headers: content-type
  access-control-allow-methods: GET, HEAD, PUT, PATCH, POST, DELETE
  access-control-allow-origin: *
  ```

## Issue 42 — Publicar a aplicação
**Responsável:** Felipe Borges Barros


### O que foi feito e por quê

Trocamos `@sveltejs/adapter-auto` por `@sveltejs/adapter-static` com
`fallback: 'index.html'`. O `adapter-auto` não gera site estático, e a
aplicação já roda só no navegador (`ssr = false`), então o fallback atende
todas as rotas internas junto com o `static/_redirects` da issue #43.
O `netlify.toml` define o comando de build e a pasta publicada (`build`).

### Como foi publicado

A publicação foi feita pelo Netlify CLI, a partir da raiz do projeto:

```sh
npx netlify-cli login
npx netlify-cli env:set PUBLIC_API_URL https://astra-api-4upe.onrender.com
npx netlify-cli deploy --prod
```

O `deploy` executa o build definido no `netlify.toml`. Por isso a variável
`PUBLIC_API_URL` precisa estar cadastrada no Netlify (`env:set`): sem ela, o
build usa o `.env` local, se existir, e o site passa a chamar
`http://localhost:3000`. Foi o que aconteceu no primeiro deploy, corrigido
com o `env:set` e um novo deploy.

O projeto foi criado como privado. Para a aplicação abrir sem login no
Netlify, foi preciso clicar em **Make public** na página do projeto.

Esse deploy não é automático: depois de mudar o código, rode
`npx netlify-cli deploy --prod` de novo.

### Validação realizada

- URL: <https://astratarefas.netlify.app>, publicada em 10/11/2026.
- `npm run build` gera `build/` com `index.html` e `_redirects`.
- `npm run check`: zero erros e avisos.
- `/`, `/tarefas/1`, `/projetos` e `/quadro` respondem `200` ao abrir direto
  pela URL.
- O JavaScript publicado contém `https://astra-api-4upe.onrender.com` e não
  contém `http://localhost:3000`.

```sh
S=https://astratarefas.netlify.app
for p in / /tarefas/1 /projetos /quadro; do
  echo "$p $(curl -s -o /dev/null -w '%{http_code}' $S$p)"
done
```

### Observações

- Na publicação inicial, os testes de `routes`, `projeto-page`, `tarefa-page` e
  `entrada` esperavam HTML renderizado no servidor e falhavam com `ssr = false`.
  Na integração do Planetário, essas 12 verificações foram adaptadas para
  Chromium com Playwright, mantendo as asserções e simulando a API no navegador.
- Os testes que sobem o Vite precisam de um `.env` com `PUBLIC_API_URL`; sem
  ele, falham com `env_invalid`.

### Integração da interface e testes

**Responsável:** Gabriel Crispim Galvão

O build estático documentado acima foi alinhado ao código usando
`@sveltejs/adapter-static` 4, compatível com SvelteKit 3, e
`fallback: 'index.html'`. O adapter-auto 3 presente na main exigia SvelteKit 2.
Foram conferidos os arquivos `build/index.html` e `build/_redirects`, gerados
com `PUBLIC_API_URL=https://astra-api-4upe.onrender.com`.

Para os testes das telas, executar uma vez `npx playwright install chromium`
e depois `npm test`. Os testes da API, componentes e lógica continuam na suíte.
Os testes de páginas usam contextos isolados e API simulada, sem acessar a
API de produção. As instruções completas estão no README.

O redesign não muda a URL nem a configuração do serviço Render. Como a publicação
do frontend foi realizada pelo CLI, atualizar o GitHub não publica automaticamente
o site: após integrar as alterações, executar novamente o deploy no projeto
Netlify existente, mantendo a variável `PUBLIC_API_URL` já cadastrada.
