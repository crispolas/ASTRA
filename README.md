# ASTRA

Projeto desenvolvido para a disciplina de Desenvolvimento Frontend.

## Equipe

- Brenno Milhomem Farias
- Eurípedes Rocha Neto
- Gabriel Crispim Galvão
- Felipe Borges Barros

## Framework

SvelteKit com TypeScript.

## Documentação técnica

- [Índice da documentação](docs/README.md).
- Diários: [Marco 2](docs/marco-2/diario.md) · [Marco 3](docs/marco-3/diario.md) · [Marco 4](docs/marco-4/diario.md) · [Marco 5](docs/marco-5/diario.md) · [Marco 6](docs/marco-6/diario.md).
- [Apresentação do Marco 5](docs/marco-5/slides/index.html) · [PDF](docs/marco-5/slides/apresentacao.pdf).
- [Interface e abertura lunar](docs/interface.md).

## Configuração do projeto

Para instalar as dependências:

```sh
npm install
```

Copie `.env.example` para `.env` antes de iniciar a aplicação. No CMD do Windows,
use `copy .env.example .env`; no Linux/macOS, `cp .env.example .env`.
O arquivo define `PUBLIC_API_URL=http://localhost:3000` para a API local.
Reinicie o servidor de desenvolvimento depois de mudar esse valor.

Para produção, configure `PUBLIC_API_URL` com o endereço real da API hospedada
no ambiente onde `npm run build` será executado. O SvelteKit incorpora esse valor
ao build; trocar o endereço exige gerar outro build. A URL da API hospedada
está na seção [Publicação](#publicação). A variável é pública e não deve
conter credenciais. O `.env` local não é versionado; `.env.test` configura a API
simulada dos testes.

Para iniciar o projeto:

```sh
npm run dev
```

Para iniciar a API local:

```sh
npx json-server db.json
```

A aplicação estará disponível em `http://localhost:5173` e a API em `http://localhost:3000`.

## Build

Para gerar a versão de produção:

```sh
npm run build
```

O site estático é gerado em `build/` (adapter-static, com `index.html` como
fallback para as rotas internas).

## Publicação

- Aplicação: https://astratarefas.netlify.app
- API: https://astra-api-4upe.onrender.com

A API roda o mesmo `json-server` com os dados de `db.seed.json`, empacotado no
`Dockerfile` da raiz. A aplicação é publicada como site estático (`netlify.toml`),
com `PUBLIC_API_URL` apontando para a API hospedada.
