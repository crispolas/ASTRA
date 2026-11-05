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
