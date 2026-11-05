# Planetário navegável — implementação experimental

## Plano

Referências: cinco imagens fornecidas pelo usuário (tarefas, projetos, Kanban,
ilha e storyboard). As imagens são a referência disponível, sem alegar acesso
direto ao documento Figma. Mobile será uma adaptação responsiva destas vistas.

- `observatorio.ts`: configuração por setor e orientação contínua, separada das
  órbitas locais. Sem Three.js ou dependências novas.
- Layout persistente: `onNavigate` do SvelteKit coordena saída/entrada em um
  wrapper com perspectiva. A ilha e a marca ficam fora do wrapper.
- Céu: mesmo componente Canvas entre rotas internas; estrelas pequenas mantidas,
  estrelas luminosas adicionais, projeção por profundidade e Lua apenas no setor
  de tarefas, sem reiniciar fase ou trajetória.
- Cartões: preservar ações/dados e os wrappers independentes de flutuação e tilt;
  retirar a superfície orgânica de tarefas/projetos em favor de bordas simples.
- Estilos: substituir a composição lateral pela ilha superior, grade regular
  de duas colunas com último item limitado e quatro colunas Kanban no desktop.

## Riscos e verificações

Transição não deve prender navegação, foco ou cliques; efeitos precisam ser
cancelados na desmontagem, ocultação da aba e mudança para movimento reduzido.
Não duplicar conteúdo funcional para animar a troca. Links continuam reais,
incluindo abertura direta, histórico e modificação com Ctrl/Cmd. Testar
desktop/mobile, teclado, busca/filtros, status, exclusão, formulários, detalhes,
0/1/2/7/15/30 itens, preferências de movimento e continuidade do Canvas.

Parallax vertical será discreto e limitado. A câmera usa seu próprio relógio;
Lua mantém `orbita.ts` e crateras existentes. A abertura é preservada integralmente.
Não modificar contratos, rotas, API, deploy ou funcionalidades acadêmicas.

## Pendências funcionais preexistentes

Cartões no detalhe de projeto não recebem callback de status, e o quadro não
fornece callback de exclusão. Permanecem como estão nesta revisão visual.
O retorno da edição pode exibir o detalhe anterior em cache: a API persiste o novo
título, e recarregar apresenta o valor atualizado. Nenhuma alteração foi feita
nos módulos de edição/carregamento para tratar essa pendência.

## Implementação

Não foram instaladas dependências do projeto. CSS 3D e Web Animations fazem a
saída/entrada no wrapper de rota, com `onNavigate` preservando links e histórico
do SvelteKit. A passagem dura aproximadamente 860 ms; o conteúdo funcional não é
duplicado para animar. A câmera interpola a orientação enquanto o Canvas mantém
as órbitas locais. Os controles da rota ficam inertes durante o giro; o título
recebe foco ao terminar, após `tick` remover a inércia.

A Lua só pertence ao setor de tarefas; os objetos repetidos nas imagens não foram
interpretados como Luas distintas. A referência de tempo, trajetória e textura
ASCII/crateras existentes foram preservadas. Há cinco estrelas luminosas com
posições angulares, profundidades e oscilações próprias, além das 90 pequenas
estrelas originais com velocidades, interação e cintilação independentes.
Um parallax vertical limitado dá profundidade sem interferir no scroll natural.

`SuperficieOrbital.svelte` foi inspecionado e preservado no repositório, mas deixou
de ser montado nos cartões. A superfície minimalista reutiliza a camada de glow
radial e `interacaoOrbital`. Um atraso negativo baseado no relógio mantém os
cartões na fase corrente ao remontar. Flutuação e tilt continuam em wrappers
separados da câmera.

No mobile, a ilha aparece abaixo da marca; os cartões e o Kanban passam para uma
coluna. Não foi fornecido frame mobile do Planetário: essa composição é uma
adaptação das imagens desktop, sujeita à revisão do usuário.

## Validação

- `npm run check`: zero erros e avisos.
- `npm test`: 43 testes; suíte sequencial para evitar a colisão dos arquivos
  gerados do SvelteKit entre instâncias Vite. Nenhuma asserção desabilitada.
- `npm run build`: concluído, mantendo o adapter existente, sem publicação.
- Navegador real: desktop 1600×1080 e mobile 390×844, navegação completa,
  histórico, foco, documento/Canvas persistentes e preferência de movimento.
- 1/2/7/15/30 tarefas em 1600/1280/1024/768/420/390/320 px; conteúdo longo,
  ausência de sobreposição/overflow, ímpares limitados, busca/filtros e vazios.
- 0/1/2/7/15/30 projetos em 1600/768/390/320 px, sem overflow ou expansão do
  último cartão ímpar. Respostas simuladas apenas no navegador de teste.
- Cliques rápidos interrompendo giros não deixam a rota inerte; navegação com
  Enter e foco no título de destino confirmados. Um identificador de transição
  impede que callbacks de uma passagem cancelada alterem a passagem seguinte.
- Cadastro, edição persistida na API (recarregamento para contornar o cache
  preexistente), status e reorganização no quadro, cancelamento/confirmação de
  exclusão, falha de envio preservando campos e detalhes em desktop/mobile.
- Abertura completa: Tab/Enter, Escape, constelação e entrega da marca ao layout.
- Instrumentação apenas no navegador comprovou movimento das duas camadas,
  rotação da textura lunar em fase visível, reação ao cursor, tilt/glow/pausa em
  tarefas/projetos/quadro e suspensão do Canvas em aba oculta/movimento reduzido.

Capturas e vídeos ficam fora do código-fonte, em
`/workspace/artifacts/planetario/`. A apresentação visual foi comparada com as
imagens anexadas, mantendo como diferenças deliberadas a Lua apenas em tarefas,
os dados reais do banco e os controles funcionais já existentes em cada tela.
