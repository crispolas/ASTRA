# Órbita Viva — Revisão compacta e lunar

Protótipo na branch `experiment/orbita-viva-compacta-lunar`, baseado nos exports desktop, mobile e na prancha de escala/percurso da quarta proposta. Não altera a main, contratos, rotas ou dependências.

## Implementação

- `src/lib/orbita-viva.css`: tema restrito ao gerenciador pelas classes `ov-shell orbita-viva`. Essa especificidade mantém o experimento acima dos estilos locais existentes, sem mudar os estilos da abertura.
- `src/routes/+layout.svelte`: reutiliza `MarcaAstra`, `TransicaoEntrada` e `CeuAscii`. A navegação ocupa o trilho lateral no desktop e volta ao fluxo no mobile. O destino `data-astra-brand` continua sendo a referência da transição da constelação.
- `src/lib/components/SuperficieOrbital.svelte`: três contornos SVG decorativos, com gradiente opaco e reflexo no hover/foco. O ResizeObserver acompanha a altura do cartão para preservar as curvas das bordas sem deformar textos ou controles. O observador é desconectado ao desmontar.
- `TarefaCard.svelte`: preserva props e lógica de status e exclusão; acrescenta a superfície. Projetos reutilizam a mesma superfície e a ação de interação existente.
- `visual/ceu.ts`: ajusta apenas a escala visual da lua. A escala usa 22% da área útil no desktop e até 168px no mobile na fase frontal de referência, conservando a variação por profundidade. O cálculo de posição, período de 175 segundos, profundidade e relógio absoluto permanece em `visual/orbita.ts`, sem alterações.

A lista usa uma coleção plana com chave por ID. As proporções dos cartões se repetem a cada seis posições: 672/568, 568/672 e 640/600. A posição visual considera a ordem após a filtragem. Um item ímpar mantém sua proporção, sem expandir pela linha inteira. No mobile e em larguras intermediárias, os cartões ficam em uma coluna; o Kanban mantém suas próprias colunas responsivas.

O desnível está na propriedade CSS `translate` do contêiner, independente do `transform` que realiza a flutuação. O cartão interno preserva a inclinação da ação `interacaoOrbital`. Hover e foco pausam a flutuação e mostram reflexo e brilho. Com movimento reduzido, não há flutuação ou inclinação. Os controles de status e exclusão têm área de toque de pelo menos 44px no mobile.

Cabeçalho textual, navegação, rótulos e campos têm áreas opacas de leitura. A lua e as estrelas continuam atrás, sem capturar cliques. O cenário não é reiniciado entre páginas do gerenciador.

## Limites de escopo

Nenhuma nova funcionalidade, rota, opção de filtro, paginação, alteração da API ou tarefa do Marco 6. A abertura lunar, constelação, geometria da marca, contratos e arquivo de dados do repositório foram preservados. Problemas funcionais anteriores ao experimento não são corrigidos silenciosamente por esta mudança visual. Os slides não fazem parte desta alteração.

## Execução

Instale as dependências existentes com `npm ci` se necessário. Para experimentação, use uma cópia do banco:

```sh
cp db.json /tmp/astra-ov-db.json
npx --no-install json-server /tmp/astra-ov-db.json --port 3000
```

Em outro terminal, execute `npm run dev`. O PowerShell pode usar `Copy-Item` e um caminho temporário do Windows, além de `npm.cmd`/`npx.cmd` quando necessário. A API continua na porta 3000, conforme a implementação atual.

## Conferência

- Casos de 1, 2, 7, 15 e 30 tarefas, em 1600, 1280, 1024, 768, 420, 390 e 320px, incluindo títulos e descrições extensos: sem sobreposição ou overflow horizontal; último cartão ímpar limitado.
- Busca, filtros combinados, alternância Lista/Quadro e estados vazios: os critérios e as mensagens existentes foram preservados.
- Interações no navegador: estrelas se movem e respondem ao ponteiro; cartões de tarefas, projetos e Kanban flutuam, inclinam, brilham e pausam no foco/hover; movimento reduzido desativa as transformações.
- Observação real do ciclo orbital completo em desktop e mobile: 181s e 179s, respectivamente, com passagem visível, saída de campo e ausência de erros JavaScript ou overflow. As áreas de texto permanecem protegidas pelas superfícies opacas.
- Cadastro, edição, mudança de status, movimentação para a coluna do Kanban, cancelamento/exclusão e falha de envio com preservação dos campos foram conferidos usando apenas a cópia temporária do banco.
- Entrada por teclado, Escape, formação da constelação e chegada da marca ao novo trilho de navegação também foram conferidos, incluindo o encaixe da marca no novo destino.

Verificações finais: `npm run check` sem erros/avisos, `npm run build` aprovado e 39 testes aprovados com `node --test --test-concurrency=1 tests/*.test.mjs`. A execução sequencial evita concorrência entre os servidores Vite iniciados pela suíte; uma execução paralela durante o desenvolvimento apresentou instabilidade na geração dos módulos. As asserções não foram alteradas.

Após refinar a escala pela largura útil, também foram conferidas 36 fases em desktop e mobile, além da observação real do ciclo. As capturas de fases isoladas são complementares e não substituem a observação temporal.
