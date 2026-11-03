# Interface orbital

A interface aprovada no protótipo foi integrada ao gerenciador: estrelas ASCII livres, lua branca com crateras e órbita em profundidade, estrelas cadentes raras e cartões flutuantes. A página `/inicio` e a transição original permanecem intactas.

## Organização

- `src/lib/visual/ceu.ts`: desenha o cenário em Canvas, movimenta as estrelas e aplica a reação local ao ponteiro. As estrelas continuam seu caminho, sem retornar a posições fixas.
- `src/lib/visual/orbita.ts`: calcula a posição da lua pelo relógio absoluto. Trocar ou reabrir páginas não reinicia a órbita de 175 segundos.
- `src/lib/components/CeuAscii.svelte`: monta o cenário no layout compartilhado e faz a limpeza ao sair.
- `src/lib/visual/interacao.ts`: ação Svelte reutilizada nos cartões de tarefas e projetos para inclinação e brilho pelo ponteiro.
- `src/lib/astra-theme.css`: flutuação compartilhada, inclusive no Kanban. O contêiner flutua e o cartão reage ao ponteiro, evitando que um movimento substitua o outro.

O cenário usa uma camada atrás do conteúdo e não captura cliques. Os cartões continuam ocupando a largura do layout. Não foram adicionadas dependências. A animação respeita movimento reduzido e suspende os frames quando a aba fica oculta.

A lista recupera título, alternador Lista/Quadro e callbacks de atualização/exclusão já implementados, preservando os estados de carregamento e erro da versão atual.

## Conferência manual

1. Execute `npm install`, `npx json-server db.json` e, em outro terminal, `npm run dev`.
2. Abra `/inicio`: confira a abertura e a transição originais.
3. Visite a lista, projetos e Kanban: os cartões flutuam; ao passar o ponteiro ou focar um controle, pausam e brilham. Os controles continuam funcionando.
4. Troque de página: o cenário acompanha a navegação sem reiniciar a órbita. A lua passa apenas em parte do ciclo.
5. Confira detalhes e formulários: o fundo permanece atrás dos campos e botões.
6. Confira celular e a preferência de movimento reduzido do sistema.

Validação automatizada: `npm run check`, `npm run build`, `npm test`. Os testes de órbita verificam continuidade e fase independente da montagem.
