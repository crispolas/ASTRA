# ASTRA — Marco 3

Diário técnico de cadastro e edição, atualizado pela equipe conforme o desenvolvimento avança.

**Equipe:** Brenno Milhomem Farias, Eurípedes Rocha Neto, Gabriel Crispim Galvão e Felipe Borges Barros.

**Tecnologias:** SvelteKit + TypeScript e json-server.

**Prazo:** 21/10/2026 às 23h59 para a turma de quinta, conforme o PDF da professora. Para a turma de quarta, o prazo indicado é 20/10/2026 às 23h59.

## Objetivo do marco

Implementar cadastro e edição de tarefas e projetos, gravando as alterações na API. O formulário de tarefa será compartilhado pelas telas de criação e edição, com validação e acessibilidade.

O escopo abaixo segue o documento da professora “Projeto em equipe: issues dos Marcos 1 a 6”, página 3. As seções descrevem resultados esperados. As issues #16 e #17 têm implementação e verificações registradas nesta branch; a integração na main depende do PR. Os demais campos permanecem **A preencher**.

## Divisão das tarefas

| Issue | Tarefa | Responsável |
| --- | --- | --- |
| #16 | Ampliar o módulo da API (escrita) | Gabriel Crispim Galvão |
| #17 | Criar o componente de formulário de tarefa | Gabriel Crispim Galvão |
| #18 | Criar a tela de nova tarefa | Brenno Milhomem Farias |
| #19 | Criar a tela de edição de tarefa | Eurípedes Rocha Neto |
| #20 | Validar o formulário | Eurípedes Rocha Neto |
| #21 | Tornar o formulário acessível | Brenno Milhomem Farias |
| #22 | Criar cadastro e edição de projeto | Felipe Borges Barros |
| #23 | Criar o slide de apresentação do Marco 3 | Gabriel Crispim Galvão |

Divisão planejada nesta conversa. Se a equipe combinar alguma mudança, atualize a tabela e a seção da issue.

## Ordem de trabalho combinada

1. **Crispim assumiu a #16 e a implementa antes da #17.** Documenta as funções de escrita, os parâmetros e os retornos para que as telas possam utilizá-las.
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
- `src/lib/api.ts` já fornece `listarTarefas()`, `buscarTarefa(id)`, `listarProjetos()` e `buscarProjeto(id)`. As funções de escrita foram implementadas nesta branch e estão registradas na #16; a integração depende do PR.
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

**Responsável:** Gabriel Crispim Galvão (assumiu a tarefa inicialmente atribuída a Felipe).

### Objetivo

Criar funções tipadas para criar e atualizar tarefas e projetos, como pede o PDF da professora na página 3.

### O que foi feito

O módulo `src/lib/api.ts` agora exporta:

| Função | Parâmetros | Requisição | Retorno |
| --- | --- | --- | --- |
| `criarTarefa` | `dados: NovaTarefa` | POST `/tarefas` | `Promise<Tarefa>` |
| `atualizarTarefa` | `id: string`, `dados: Partial<NovaTarefa>` | PATCH `/tarefas/:id` | `Promise<Tarefa>` |
| `criarProjeto` | `dados: NovoProjeto` | POST `/projetos` | `Promise<Projeto>` |
| `atualizarProjeto` | `id: string`, `dados: Partial<NovoProjeto>` | PATCH `/projetos/:id` | `Promise<Projeto>` |

Foi acrescentado `NovoProjeto = Omit<Projeto, 'id'>` em `src/tipos.ts`. Nenhum campo de Tarefa ou Projeto foi alterado. As consultas do Marco 2 continuam disponíveis.

### Como foi feito e por quê

1. O helper existente passou a aceitar opções da requisição, preservando a leitura e o tratamento de respostas HTTP sem sucesso.
2. Um helper de envio prepara o JSON e o cabeçalho `Content-Type: application/json`, evitando repetir essa preparação nas quatro funções.
3. POST cria um registro; o json-server gera seu ID. PATCH atualiza os campos enviados sem substituir os demais. Essa é a escolha de implementação, não um método imposto pelo PDF.
4. Os parâmetros e retornos reutilizam os tipos da equipe. `Omit` retira o ID do tipo de cadastro; `Partial` permite atualizar parte dos campos; `Promise` representa a resposta futura da API.
5. As funções ficam em `api.ts` porque várias telas vão usá-las. Não dependem de um componente Svelte nem criam rotas; a tela decide quando chamar e para onde navegar após salvar.

Exemplo para quem implementará a tela:

```ts
// Em um arquivo dentro de src/routes, este import chega a src/lib/api.
import { criarTarefa } from '../lib/api';

const salva = await criarTarefa(dadosDoFormulario);
```

Ajuste o caminho relativo à localização da tela. Para atualizar, use `atualizarTarefa(id, dadosDoFormulario)`. O ID é um argumento separado e não é um campo que o usuário precisa preencher.

### Como testar

```sh
npm test
npm run check
npm run build
```

Os seis testes novos em `tests/api-escrita.test.mjs` conferem os métodos, endereços, JSON, respostas, preservação dos dados de entrada e propagação de falhas. Também foram feitos POST e PATCH reais para tarefas e projetos em uma cópia do banco: as consultas seguintes confirmaram a gravação, os campos não enviados foram preservados e o projeto retornou sua tarefa via `_embed=tarefas`.

A suíte completa terminou com **23 testes aprovados, nenhuma falha e nenhum teste ignorado**. A verificação Svelte/TypeScript terminou com **zero erros e avisos**, e o build concluiu. Os testes reais não alteraram o `db.json` versionado.

### Dificuldades e decisões

Foi necessário distinguir os dados de cadastro dos dados salvos: o objeto retornado pela API contém ID, mas o cadastro recebe os campos sem ID. TypeScript descreve o formato; ele não apaga propriedades extras de um objeto em execução. O formulário da #17 prepara os campos explicitamente por esse motivo.

### GitHub

- Issue: [#16 - Ampliar o módulo da API (escrita)](https://github.com/crispolas/ASTRA/issues/16).
- Branch: `feat/issues-16-17-api-formulario`.
- Commit: mensagem `Implementa API de escrita e formulário reutilizável das issues 16 e 17`; consulte o identificador com `git log -1 --oneline` nessa branch.
- PR: a registrar após a abertura. Integração na main pendente.

---

## Issue 17 - Criar o componente de formulário de tarefa

**Responsável:** Gabriel Crispim Galvão.

### Objetivo

Criar um formulário com os campos do contrato e um seletor de projetos carregado da API. Reutilizar o mesmo componente no cadastro e na edição, conforme o PDF da professora.

### O que foi feito

Foi criado `src/lib/components/TarefaFormulario.svelte`. Ele oferece título, descrição, projeto, status, prioridade, responsável e prazo. O ID não é um campo editável.

| Prop | Tipo | Uso |
| --- | --- | --- |
| `valoresIniciais` | `Partial<NovaTarefa>`, opcional | Preencher o formulário ao editar ou pré-selecionar um projeto. |
| `aoEnviar` | `(dados: NovaTarefa) => void ou Promise<void>`, obrigatória | Entregar os campos à tela que utiliza o formulário. |
| `textoBotao` | `string`, opcional | Personalizar o botão; padrão “Salvar tarefa”. |

O componente carrega as opções com `listarProjetos()` da API. A tela que o utiliza recebe os dados pelo callback e pode chamar as funções da #16. O formulário não define uma rota ou redirecionamento.

### Como foi feito e por quê

1. **Receber dados por props.** `$props()` declara as entradas do componente. A mesma peça atende cadastro, edição e projeto pré-selecionado sem copiar o formulário.
2. **Preparar uma cópia dos campos editáveis.** O formulário copia somente os sete campos do contrato, sem alterar a prop nem levar o ID para o envio. Para um cadastro vazio, usa textos vazios, status `a-fazer` e prioridade `media` como valores iniciais.
3. **Acompanhar a digitação.** `$state` guarda os valores locais e `bind:value` conecta cada campo à sua variável: a digitação atualiza o estado, e o estado preenche o campo.
4. **Receber valores de edição.** O estado inicial é lido com `untrack`, e um `$effect` atualiza os campos quando a tela entrega novos valores iniciais. Assim, uma tarefa obtida de forma assíncrona pode preencher o formulário.
5. **Buscar os projetos ao montar.** `onMount` executa `listarProjetos()` no navegador. O seletor usa IDs como valores e nomes como texto; não há projetos fixos no componente.
6. **Entregar o envio à tela.** `preventDefault()` evita o envio HTML que recarregaria a página. `aoEnviar` recebe uma cópia de `NovaTarefa`, podendo ser uma função assíncrona. A página continua responsável por salvar e navegar.
7. **Manter as instâncias independentes.** `$props.id()` gera os identificadores usados pelos campos e labels, evitando IDs repetidos ao mostrar duas instâncias do componente.

### Exemplo para as próximas telas

```svelte
<script lang="ts">
    import TarefaFormulario from '#lib/components/TarefaFormulario.svelte';
    import { criarTarefa } from '../lib/api';
    import type { NovaTarefa } from '../tipos';

    async function salvar(dados: NovaTarefa) {
        await criarTarefa(dados);
        // A tela da #18 definirá a navegação após salvar.
    }
</script>

<TarefaFormulario aoEnviar={salvar} />
```

Os caminhos relativos acima correspondem a uma página em `src/routes`; ajuste-os nas pastas das novas rotas. Para editar, passe `valoresIniciais={tarefa}` e use `atualizarTarefa(tarefa.id, dados)` no callback. Para iniciar com um projeto selecionado, passe `valoresIniciais={{ projetoId: idDoProjeto }}`. Os exemplos explicam o contrato; não criam as telas #18 e #19.

### Como testar

Execute as verificações do projeto:

```sh
npm test
npm run check
npm run build
```

A suíte de rotas existente consulta a tarefa 1 e espera o título inicial “Criar o repositório”. Execute-a com a API ligada e os dados iniciais da cópia antes de alterar essa tarefa na demonstração. Se já a editou, use uma nova cópia do banco para repetir a suíte.

Os dois testes em `tests/tarefa-formulario.test.mjs` verificam os campos e o preenchimento para edição. Adicionalmente, o formulário foi testado em Chromium com API real: opções de projetos, duas instâncias independentes, campos iniciais, criação e edição persistidas, objeto original intacto e envio sem ID. Falhas na consulta de projetos e no callback de envio também foram verificadas com respostas controladas. Essas verificações de navegador são adicionais e não são casos extras dentro dos 23 testes de `npm test`.

Para conferir no Windows sem criar as rotas das próximas issues, use a página isolada de teste:

1. Na raiz do projeto, abra um terminal PowerShell e crie uma cópia única do banco:

```powershell
$bancoTeste = Join-Path $env:TEMP ("astra-16-17-" + [guid]::NewGuid() + ".json")
Copy-Item db.json $bancoTeste
npx.cmd --no-install json-server $bancoTeste --port 3000
```

A porta 3000 deve estar livre. Encerre uma API sua que já esteja rodando nessa porta antes de iniciar a cópia.

2. Em outro terminal, execute:

```powershell
node scripts/testar-formulario.mjs
```

3. Abra `http://127.0.0.1:5174/__teste-formulario` no seu navegador. A porta 5174 também deve estar livre.
4. O formulário de criação começa vazio e mostra os projetos da API. Preencha os campos, escolha o projeto e clique em “Criar exemplo”; o resultado da API aparece abaixo.
5. O formulário de edição carrega a tarefa 1. Mude o título e clique em “Atualizar exemplo”; confira o resultado abaixo.
6. Recarregue para confirmar a persistência. Consulte também `http://localhost:3000/tarefas` para conferir os registros.
7. Encerre os dois comandos com Ctrl+C quando terminar.

A página é fornecida por `scripts/testar-formulario.mjs` e `tests/fixtures/TarefaFormularioDemo.svelte`, apenas para teste. Ela não é uma rota do produto e não aparece ao executar o `npm run dev` normal. Seus botões gravam na cópia da API, por isso usamos um banco isolado.

### Dificuldades e soluções

**Cópia de objetos e ID.** O primeiro teste de edição revelou que espalhar o objeto inteiro copiava também o ID. A preparação passou a selecionar explicitamente os campos editáveis; o teste no navegador confirmou que o ID não segue no corpo de POST ou PATCH pelo formulário.

**Testar sem adiantar telas.** Foi criada uma página isolada de demonstração para montar o componente e conectar callbacks à API. As rotas `/tarefas/nova` e `/tarefas/:id/editar` permanecem para #18 e #19.

### O que fica para os colegas

- #18 e #19: criar as telas, conectar o envio e implementar a navegação prevista.
- #20: definir campos obrigatórios, mensagens junto aos campos e bloqueio do botão durante o envio.
- #21: concluir e conferir acessibilidade do fluxo, incluindo teclado e associação dos erros aos campos. Os labels básicos já existem, mas a issue não é declarada concluída por esta implementação.
- #22: cadastro e edição de projetos, usando as funções da #16.

### GitHub

- Issue: [#17 - Criar o componente de formulário de tarefa](https://github.com/crispolas/ASTRA/issues/17).
- Branch e commit: os mesmos registrados na #16.
- PR: a registrar após a abertura. Integração na main pendente.

---

## Issue 18 - Criar a tela de nova tarefa

**Responsável:** Felipe Borges Barros, que assumiu a tarefa de Brenno Milhomem Farias.

### Objetivo

Criar a rota `/tarefas/nova`, gravar a tarefa na API e voltar para a lista. Quando aberta pela página de um projeto, a tela deve apresentar esse projeto já selecionado. O segmento `nova` não pode ser interpretado como ID de tarefa.

Depende da API de escrita #16 e do formulário #17 para concluir o fluxo; a estrutura da rota pode ser preparada antes.

### O que foi feito

Criada a rota `src/routes/tarefas/nova/+page.svelte`, que reaproveita o `TarefaFormulario` da #17. Ao enviar, a tela chama `criarTarefa` da #16 e, depois da confirmação da API, navega para a lista (`/`) com `goto`. Se a API falhar, a navegação não ocorre e o formulário mostra a mensagem de erro.

O projeto pré-selecionado vem do parâmetro `projeto` da URL (`/tarefas/nova?projeto=ID`), lido com `page.url.searchParams` e passado ao formulário em `valoresIniciais`. Sem o parâmetro, o campo abre em "Selecione um projeto".

Foram adicionados links "Nova tarefa" na lista de tarefas (`/`) e na página do projeto, esta com `?projeto=ID`.

O segmento `nova` não é interpretado como ID: o SvelteKit dá prioridade à rota estática `tarefas/nova` sobre a dinâmica `tarefas/[id]`, sem tratamento extra no código.

### Como foi feito e por quê

1. **Criar a rota pela pasta.** O SvelteKit usa roteamento por pastas: `src/routes/tarefas/nova/+page.svelte` vira `/tarefas/nova`. Começamos só com a casca (título e link Voltar) para confirmar que a rota existia antes de acrescentar lógica. Como `nova` é uma pasta estática, tem prioridade sobre `tarefas/[id]`, e por isso não é lida como ID.
2. **Reaproveitar o formulário.** A tela monta o `TarefaFormulario` da #17 com `aoEnviar` e `textoBotao="Criar tarefa"`, em vez de criar outro formulário. A mesma peça atende criação, edição e a validação da #20. O formulário só entrega os dados; quem decide o destino deles é a tela.
3. **Gravar e navegar.** `salvar` chama `await criarTarefa(dados)` (POST, que gera o `id` no json-server) e só depois `await goto('/')`. Se a API falhar, `criarTarefa` lança erro, o `goto` não roda e o `catch` do formulário mostra a mensagem. Por isso a tela não precisa de `try/catch`. A lista fica em `/`, que é o destino pedido pela issue.
4. **Pré-selecionar o projeto pela URL.** A página do projeto aponta para `/tarefas/nova?projeto=ID`. A tela lê o parâmetro com `page.url.searchParams.get('projeto') ?? ''` e o passa em `valoresIniciais`. O `?? ''` cobre o acesso direto, sem parâmetro, para o seletor abrir em "Selecione um projeto". O objeto é criado uma única vez no `<script>`, e não dentro do markup, para o `$effect` do formulário não redefinir o que o usuário digitou.
5. **Adicionar os links.** "Nova tarefa" na lista (sem parâmetro) e na página do projeto (com `?projeto=ID`), para a tela ser alcançável pela navegação.
6. **Importar a API por caminho relativo.** Ao rodar `npm run check`, o import `#lib/api` não foi resolvido pelo TypeScript, porque o alias `#lib/*` aponta para `./src/lib/*` e só funciona com a extensão completa, como em `.svelte`. As outras rotas usam caminho relativo, e a tela passou a fazer o mesmo (commit `8fc0299`).

### Como testar

Com a API (`npx --no-install json-server db.json`) e o `npm run dev` ligados:

1. Em `/`, clique em "Nova tarefa", preencha, envie e confira que a tarefa aparece na lista.
2. Abra um projeto em `/projetos`, clique em "Nova tarefa" e confira que o projeto já vem selecionado.
3. Acesse `/tarefas/nova` direto e confira que o projeto não vem selecionado e que a tela abre como formulário, não como detalhe de tarefa.

Os testes criam tarefas no `db.json`. Para repetir `npm test`, restaure com `git checkout db.json`.

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

Criada a rota `src/routes/tarefas/[id]/editar/`. O `+page.ts` busca a tarefa com `buscarTarefa(params.id)` e, se a API não a encontrar, lança `error(404, 'Tarefa não encontrada')`. O `+page.svelte` reaproveita o `TarefaFormulario` da #17, preenchido com `valoresIniciais={data.tarefa}`. Ao enviar, chama `atualizarTarefa` da #16 (PATCH) e, depois da confirmação da API, navega para o detalhe `/tarefas/ID` com `goto`. O formulário não envia o `id` no corpo da requisição, só na URL.

Foi adicionado o link "Editar" na página de detalhe da tarefa.

### Como foi feito e por quê

1. **Rota dentro de `[id]`.** A pasta `src/routes/tarefas/[id]/editar/` gera `/tarefas/ID/editar`, e o ID chega em `params.id`. Fica ao lado da rota de detalhe que já existia.
2. **Carregar a tarefa no `load`.** O `+page.ts` roda antes de a tela abrir e retorna `{ tarefa }`, que chega ao `+page.svelte` como `data`. Assim o formulário já nasce com os dados, sem estado de carregamento próprio. Usa `buscarTarefa`, que já existia no módulo da API, e importa por caminho relativo (quatro níveis até `src/lib/api`).
3. **Tratar tarefa inexistente.** Quando a API responde 404, `buscarTarefa` lança erro. O `load` o converte em `error(404, 'Tarefa não encontrada')`, para o SvelteKit mostrar a página de erro em vez de um formulário vazio que, ao salvar, falharia.
4. **Preencher o formulário.** `valoresIniciais={data.tarefa}` entrega a tarefa ao formulário da #17. Ele copia só os sete campos editáveis, então o `id` não entra no corpo do envio.
5. **Gravar e voltar ao detalhe.** `salvar` chama `await atualizarTarefa(data.tarefa.id, dados)` (PATCH em `/tarefas/ID`, com o ID na URL) e depois `await goto('/tarefas/ID')`. Voltamos ao detalhe, e não à lista, porque quem edita quer ver o resultado; a rota de detalhe refaz o `load`, e os dados novos aparecem sem recarregar. Como na #18, o `await` impede a navegação quando a API falha.
6. **Adicionar o link "Editar".** No detalhe, para a tela ser alcançável pela navegação.

### Como testar

Com a API e o `npm run dev` ligados:

1. Abra `/tarefas/ID`, clique em "Editar" e confira que o formulário vem com os dados atuais.
2. Altere um campo e salve. Confira que o detalhe mostra o valor novo e que a lista (`/`) também.
3. Abra `/tarefas/9999/editar` e confira que aparece o erro 404.

A edição altera o `db.json`. Para repetir `npm test`, restaure com `git checkout db.json`.

### Observações

- Ao abrir `/tarefas/ID/editar` com um ID que não existe (por exemplo `/tarefas/12/editar`), a tela mostra apenas "Página não encontrada / Erro 404", sem dizer que a tarefa não existe. O `load` da rota já lança `error(404, 'Tarefa não encontrada')`, mas o `src/routes/+error.svelte`, compartilhado por todas as rotas, usa um texto fixo e não exibe a mensagem recebida. O comportamento é o mesmo nas outras rotas e foi mantido fora do escopo da #19, para não alterar um arquivo comum sem combinar com a equipe. Ajuste previsto: exibir `page.error?.message` (e `page.status`) no `+error.svelte`.

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

Acrescentada a validação ao `src/lib/components/TarefaFormulario.svelte`, o mesmo formulário usado pelas telas de nova tarefa e de edição.

Regras adotadas: **título** e **projeto** são obrigatórios. O título é validado com `trim`, então um valor só com espaços é recusado. Descrição, responsável e prazo continuam opcionais, porque o contrato de dados (`Tarefa`) não os exige.

A função `validar` guarda uma mensagem por campo em `erros` e é chamada no envio. Se há erro, `aoEnviar` não é chamada e nada é gravado na API. A mensagem ("Informe o título." ou "Selecione um projeto.") aparece logo abaixo do campo, com `role="alert"`.

Durante o envio, o estado `enviando` desabilita o botão, troca o texto para "Enviando..." e impede um segundo envio, inclusive por Enter. O `finally` libera o formulário no sucesso e na falha, para o usuário poder tentar de novo.

A ligação formal entre mensagem e campo (`aria-describedby`, `aria-invalid`) fica para a #21.

### Como foi feito e por quê

1. **Validar no componente compartilhado.** A validação foi para o `TarefaFormulario`, e não para cada tela, porque criação e edição usam o mesmo formulário. Assim as duas telas ganham a regra de uma vez e não há duas cópias para manter.
2. **Escolher os campos obrigatórios.** Título e projeto: o título identifica a tarefa, e o projeto a liga ao restante do sistema. Os demais campos seguem opcionais, porque o contrato não os exige e o doc pede para não presumir regras extras.
3. **Guardar um erro por campo.** O estado `erros` tem uma chave por campo com problema, e `validar` o esvazia antes de conferir. Sem isso, a mensagem de uma tentativa anterior ficaria na tela depois da correção. `validar` devolve `true` ou `false`, e quem chama decide o que fazer. O título usa `trim` para recusar valores só com espaços.
4. **Interromper o envio quando há erro.** Em `enviar`, `if (enviando || !validar()) return;` vem antes de `aoEnviar`, então a API nunca recebe uma tarefa inválida.
5. **Mostrar a mensagem junto do campo.** Um `<p role="alert">` dentro do mesmo `<div>` do campo, que mantém o texto encostado nele, e `role="alert"` faz leitores de tela o anunciarem. É o mesmo padrão das mensagens de erro já existentes.
6. **Bloquear durante o envio.** O estado `enviando` liga antes do `await aoEnviar(...)`, e um `finally` o desliga no sucesso e na falha, para um erro de API não deixar o formulário travado. O botão usa `disabled={enviando}` e mostra "Enviando...". A checagem de `enviando` em `enviar` cobre o Enter dentro de um campo, que também envia o formulário sem passar pelo botão.

### Como testar

Com a API e o `npm run dev` ligados:

1. Em `/tarefas/nova`, clique em "Criar tarefa" com tudo vazio. Devem aparecer "Informe o título." e "Selecione um projeto." junto dos campos, sem gravar nada.
2. Preencha só o título e envie. Deve ficar apenas a mensagem do projeto.
3. Digite só espaços no título e envie. A mensagem do título deve aparecer.
4. Em `/tarefas/ID/editar`, apague o título e salve. A mensagem deve aparecer e a tarefa não deve ser alterada.
5. Preencha tudo e envie. A tarefa deve ser criada normalmente.
6. Para ver o bloqueio, use o DevTools (aba Network, throttling "Slow 3G") e envie. O botão fica desabilitado com "Enviando...", e cliques extras não duplicam a tarefa.
7. Pare a API e envie. Deve aparecer "Não foi possível enviar a tarefa.", e o botão deve voltar ao normal.

Verificações automáticas: `npm run check` (0 erros), `npm test` (23 testes) e `npm run build`.

### Dificuldades e soluções

**Quatro testes de rota falharam em `npm test`.** Na execução completa, os testes de `tests/routes.test.mjs` (`/`, `/projetos`, `/tarefas/1` e a URL desconhecida) falharam juntos, e as verificações de `npm run check` e dos demais arquivos passaram. A princípio parecia um erro causado pela validação, mas a mensagem mostrava outra causa: `ENOENT: no such file or directory, rename '.../node_modules/.vite/deps_ssr' -> '.../deps_ssr_temp_...'`. O `npm test` executa os arquivos de teste em paralelo, e `routes.test.mjs` e `projeto-page.test.mjs` sobem, cada um, um servidor Vite que usa a mesma pasta de cache. Quando um renomeia a pasta enquanto o outro a usa, o `before` do primeiro falha e derruba todos os seus testes.

Não era defeito do código. Rodando só `node --test tests/routes.test.mjs`, os quatro testes passaram. Repetindo `npm test` (depois de `rm -rf node_modules/.vite`), os 23 testes passaram. Caso a falha volte, a alternativa é executar em série: `node --test --test-concurrency=1 tests/*.test.mjs`. Não alteramos o script `test` do `package.json`, porque é um arquivo compartilhado e fora do escopo da #20.

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
| #16 e #17 | Crispim assumiu a #16 para entregar API e formulário com um contrato comum | Funções de escrita em api.ts; formulário entrega NovaTarefa pelo callback aoEnviar | Gabriel Crispim Galvão | Implementação nesta branch |
| A preencher | A preencher | A preencher | A preencher | A preencher |

## Quando uma issue está concluída?

- [ ] O resultado esperado está implementado.
- [ ] O fluxo foi testado e os resultados foram registrados.
- [ ] O código ou material está integrado.
- [ ] A seção correspondente deste diário está atualizada.
- [ ] O commit ou PR real está identificado.
- [ ] As informações necessárias para as próximas tarefas estão disponíveis.

Mantenha o histórico do Marco 2 em seu próprio documento. Este diário deve receber os resultados reais conforme cada responsável concluir seu trabalho.
