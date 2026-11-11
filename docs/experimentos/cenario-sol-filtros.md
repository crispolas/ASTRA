# Cenário solar e filtros arredondados

Branch: `feat/cenario-sol-filtros`.

- Lua, abertura e trajetória existentes preservadas. Sol em ASCII emissivo, com
  textura giratória, movimento lento e projeção no mesmo cenário persistente.
  Não havia um frame separado detalhando o Sol nas referências recebidas: o
  desenho solar é uma interpretação na linguagem ASCII para revisão visual.
- Estrelas luminosas adicionais na parte inferior; cada uma reage apenas à
  proximidade do cursor, com deslocamento amortecido e aumento local de brilho.
  Estrelas pequenas originais preservadas.
- `iluminacao.ts` registra as superfícies e calcula a luz pela distância entre
  cada cartão e as fontes do cenário. Atualização limitada a 10 Hz; a camada de
  iluminação é separada do glow de hover e não cobre os controles. Registro e
  estilos são removidos ao desmontar.
- Barra centralizada também nas larguras intermediárias, numa segunda linha
  quando necessário para não sobrepor a marca.
- `SeletorArredondado.svelte` usa botão e listbox com cantos arredondados,
  seleção indicada por texto/check, setas, Home/End, Enter, Escape, Tab,
  busca por letras e fechamento por clique fora. Mantém os stores e as opções
  existentes. Não substitui os seletores de status dos cartões ou formulários.

Validação: 45 testes passaram; check sem erros/avisos; build estático concluído.
Navegador em 1600×1000 e 390×844 com API simulada: Sol/Lua desenhados, estrelas
inferiores em movimento, reação ao cursor, intensidade de luz nos cartões,
menus arredondados, centro da navegação, Canvas persistente nas três vistas,
sem overflow e movimento reduzido respeitado. Capturas em
`/workspace/artifacts/cenario-sol/`. Nenhuma chamada à API de produção nos testes.

Não houve mudança em contratos, dados, rotas ou hospedagem. A indisponibilidade
relatada da API do Render não foi tratada nesta alteração visual.
