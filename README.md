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

- [Diário técnico do Marco 5](docs/marco-5.md): implementação e testes da exclusão de tarefas (#31), com organização das próximas entregas.
- [Slides iniciais do Marco 5](docs/slides-marco-5/index.html): apresentação em HTML com letras grandes e notas ocultas; baixe o arquivo e abra no navegador.

- [Interface e abertura lunar](docs/tela-inicial.md): a entrada fica em `/inicio`; o gerenciador com céu ASCII e cartões flutuantes continua em `/`.
- [Issue 28 — Lista e quadro](docs/issue-28.md): alternância entre visões com busca e filtros compartilhados.

- [Diário técnico do Marco 2](docs/marco-2.md): dependências, registros de implementação, testes e orientações para continuidade entre integrantes.
- [Diário técnico do Marco 3](docs/marco-3.md): divisão das tarefas, cadastro e edição, validação e acessibilidade dos formulários.
- [Diário técnico do Marco 4](docs/marco-4.md): busca, filtros, quadro, alternância entre visões e mudança de status pelo cartão.

## Configuração do projeto

Para instalar as dependências:

```sh
npm install
```

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
