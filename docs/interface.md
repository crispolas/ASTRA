# Interface do ASTRA: abertura lunar e observatório

A rota `/inicio` integra a abertura aprovada no protótipo. A lista de tarefas permanece em `/`, preservando as rotas e as telas existentes.

## Comportamento

- Lua branca em ASCII, com rotação contínua, ampliação ao passar o mouse e brilho constante.
- Estrelas em órbita que brilham e se afastam do cursor.
- Ao clicar na lua, as estrelas se expandem e depois voltam para formar ASTRA progressivamente.
- A lua diminui até o tamanho zero, mantendo opacidade 100%.
- A constelação permanece no centro por um instante. O SvelteKit abre o gerenciador, e a marca se encaixa no cabeçalho.
- A marca no cabeçalho leva de volta a `/inicio`. Escape cancela a formação antes da navegação.
- A preferência do sistema por movimento reduzido encurta a entrada e desativa os movimentos contínuos.

## O que foi preservado

O gerenciador inteiro usa fundo preto, branco e cinza. Os cartões de tarefa flutuam lentamente e ganham brilho branco e inclinação discreta sob o cursor. O céu desenha estrelas com caracteres de texto. O nome ASTRA no cabeçalho conecta essa tela à abertura lunar.

A variante `catalogo` é a apresentação padrão do cartão nas listas, nos projetos e no quadro Kanban. O tema compartilhado também cobre detalhes, cadastro e edição. O quadro adapta as quatro colunas para duas e depois uma em telas menores. Busca, filtros compartilhados, dados, cadastro, edição e rotas mantêm seu funcionamento. O cabeçalho preserva Tarefas, Projetos e Quadro Kanban, com indicação da seção atual e brilho branco em cada item no hover e no foco. Os textos decorativos acima do título da lista foram removidos. Nenhuma tela fictícia do HTML foi incorporada.

## Organização

- `src/routes/inicio/+page.svelte`: tela preta da abertura e navegação para `/`.
- `src/lib/entrada/animacao.ts`: desenho e interação da lua e das estrelas; cancela eventos, frames e timers ao sair da rota.
- `src/lib/entrada/constelacao.ts`: geometria compartilhada das letras.
- `src/lib/entrada/transicao.ts`: estado temporário da passagem da marca entre as duas telas.
- `MarcaAstra.svelte` e `TransicaoEntrada.svelte`: marca persistente e animação até o cabeçalho, dentro do layout.
- `CeuAscii.svelte`: céu decorativo em Canvas, montado no layout compartilhado das páginas do gerenciador; é desmontado ao entrar na abertura lunar. Pausa na aba oculta e respeita movimento reduzido.
- `TarefaCard.svelte`: variante visual opcional com flutuação, brilho e reação ao cursor; o mesmo visual é reutilizado em projetos e no quadro.
- `Filtros.svelte`: apresentação dos controles existentes, com rótulos visíveis e adaptação a telas pequenas.

O uso de `onMount` mantém Canvas e eventos no navegador. `goto` troca a rota sem recarregar o documento. A transição fica no layout para que o nome não desapareça quando a abertura é desmontada.

## Como conferir

Na raiz do repositório, inicie a API em um terminal:

```sh
npx --no-install json-server db.json
```

Em outro terminal:

```sh
npm run dev -- --open /inicio
```

No PowerShell, use `npm.cmd` e `npx.cmd` se necessário. Acesse a porta indicada pelo Vite e adicione `/inicio` ao endereço.

Confira a ampliação da lua, a reação das estrelas, a formação do nome e a chegada ao gerenciador. Teste a marca para voltar, Escape durante a formação, entrada por Enter e a preferência por movimento reduzido. Em `/`, confira que a busca, os filtros e os links dos colegas continuam funcionando.

## Verificação nesta alteração

As duas verificações novas de rota estão em `tests/entrada.test.mjs`. A abertura e a passagem real foram verificadas também em Chromium, incluindo teclado, celular, filtros, retorno pela marca e ausência de recarregamento do documento.

Os imports da lista inicial e os imports de tipos do quadro foram ajustados para os caminhos existentes. A main já utiliza subpath imports; não foi necessário manter o alias depreciado `$lib` que havia sido usado no protótipo anterior.

`npm run check`, `npm run build` e os 29 testes da suíte passaram. As expectativas antigas de apresentação foram atualizadas para conferir o rótulo em `astra-eyebrow`, contar cartões por classe independente da ordem e aceitar a capitalização da mensagem já existente. As verificações de título, campos, quantidade de cartões, URL da API e alerta de erro permanecem.

Para verificar o efeito, passe o mouse sobre os cartões e aproxime-o das estrelas nas margens. Com movimento reduzido, o céu fica estático e os cartões não flutuam nem inclinam. No celular, os filtros se empilham e os metadados usam duas colunas. A alteração não adiciona mudança de status, exclusão, novos filtros ou funcionalidades de marcos futuros.

## Conferência da consistência visual

Verificadas no navegador, em desktop e celular: lista, quadro, lista de projetos, detalhe do projeto, detalhe da tarefa, nova tarefa e edição. Conferidos também o brilho da navegação, filtros, alternância de visões, preenchimento da edição, abertura lunar e gravação de status pelo cartão. O status usado no teste foi restaurado ao final. A mudança é de apresentação e não altera os contratos da API nem os fluxos de cadastro e edição.
