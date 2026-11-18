# Revisão da interface — títulos, controles, entrada e Lua

Branch: `fix/interface-lua-navegacao`.

## Correções

- Removidos fundos retangulares do título, legendas de observatório/vista e esse
  complemento dos contadores. Título e contagem usam apenas sombra de texto.
- Cabeçalho deixa de herdar a largura máxima de 1600 px do conteúdo: navbar
  centralizada no viewport útil, incluindo telas largas. Linhas inferiores
  removidas; seleção com brilho translúcido, texto claro e foco perceptível.
- Status reutiliza o listbox arredondado, agora compacto, com todos os quatro
  valores existentes. Aguarda o PATCH e mantém o valor anterior em caso de erro.
  Menu abre para cima quando falta espaço e devolve foco após a operação.
- Exclusão usa ícone no canto, área de toque 44 px, nome acessível e confirmação
  existentes. O ícone não muda o contrato nem remove a confirmação.
- Órbita calcula a profundidade relativa à câmera girada, não somente à vista
  original. Na projeção, a Lua entra e sai pelas laterais antes de passar atrás
  do observador. Relógio, período e textura permanecem contínuos.
- Disco lunar opaco é desenhado após as estrelas e antes dos glifos, cobrindo
  fontes atrás dele. A camada separada de meteoros também recebe uma máscara
  da esfera, para não atravessá-la.

## Entrada do Netlify

A regra anterior só reescrevia tudo para `/index.html`. Como `/` é a lista,
abrir o domínio iniciava diretamente no gerenciador.

`static/_redirects` agora começa com `/ /inicio 302!`, antes da regra genérica
`/* /index.html 200`. O `!` aplica o redirecionamento mesmo existindo o index.
O primeiro acesso pelo domínio entra em `/inicio`; clicar na Lua continua
navegando internamente pelo SvelteKit para `/`, sem nova requisição de documento
nem loop. Links diretos para tarefas, projetos e Kanban permanecem acessíveis.

A regra foi validada por simulação de hosting no navegador e conferência do
artefato estático. Não houve publicação nesta tarefa: o comportamento do domínio
só muda após publicar o build com essas regras no projeto Netlify existente.

## Verificação

- Suíte completa: menus por teclado/mouse, quatro status, PATCH correto, erro
  preservando valor, ícone de exclusão, cancelar/confirmar e entrada sem loop.
- Amostragem de 2.000 pontos da órbita em cada orientação (0°, 28°, 56°), em
  desktop/mobile, verificando que as mudanças de visibilidade ocorrem nas bordas.
- Chromium em 1914×1000, 1366×900 e 390×844: medida do centro da navbar,
  ausência de placas/legendas, ordem das camadas lunares, menus dentro do viewport,
  links, ícone, movimento reduzido e ausência de overflow horizontal.
- Capturas: `/workspace/artifacts/revisao-interface/`.

API, contratos, dados e configuração do Render não foram alterados.

## Sol da referência fornecida

O usuário forneceu a prancha “Sol / Fotosfera ASCII”. A textura foi substituída
por um disco denso de caracteres mistos (pontuação, x/X, o/O, 0, 8, %, #, @),
âmbar/laranja com granulação, iluminação mais forte à esquerda/acima, manchas
solares escuras e borda que se desfaz em pontuação. Não há preenchimento de células
ou esfera sólida. O renderizador fica em `src/lib/visual/sol.ts`; mantém a rotação,
posição no cenário e reflexo local existentes. A referência foi uma imagem
anexada nesta conversa, sem alegação de acesso direto ao Figma.
