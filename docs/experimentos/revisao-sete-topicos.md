# Revisão visual e de carregamento

Implementação na branch `feat/revisao-visual-carregamento`. Mantém rotas, contratos da API, operações de cadastro/edição/exclusão, filtros e a abertura lunar.

## 1. Carregamento

`leitura.ts` centraliza as leituras com quatro tentativas. Cada uma tem limite de 15 segundos; entre elas há pausas de 2, 4 e 8 segundos. Só falhas de rede e respostas temporárias são repetidas. POST, PATCH e DELETE continuam com uma tentativa, evitando duplicar alterações.

Lista, projetos e quadro carregam no cliente usando `criarColecao`, com skeleton, aviso após três segundos e erro com botão para tentar novamente. Isso permite mostrar a interface enquanto o Render acorda. Respostas de uma tela desmontada são ignoradas.

## 2. Canvas

Os loops da abertura e do gerenciador pausam quando a aba fica oculta ou o elemento deixa a viewport. O desenho é limitado a aproximadamente 30 fps, com DPR máximo de 2. Em telas menores que 768px, há menos estrelas e amostragem mais espaçada dos caracteres. Movimento reduzido gera uma cena estática, sem loop contínuo.

## 3. Cartões

Um wrapper externo recebe entrada em cascata, saída e FLIP do Svelte. O wrapper interno mantém a flutuação, separando os movimentos para que não disputem o mesmo `transform`. Cartões da mesma linha compartilham duração e fase; linhas seguintes têm defasagem. Hover e foco pausam a flutuação e elevam levemente o cartão. O quadro usa crossfade entre colunas.

## 4. Prioridade

Selos mantêm os nomes Alta, Média e Baixa e acrescentam cor âmbar, ciano e verde-azulado, respectivamente. Borda e brilho discretos acompanham a prioridade sem depender só da cor para informar seu significado.

## 5. Consistência

`opcoes.ts` fornece os quatro status e as prioridades para formulário, filtros, cartões e quadro. O mesmo seletor arredondado atende todos esses controles, com navegação por teclado e nomes acessíveis. Campos ocultos preservam os nomes e valores do formulário.

A navegação tem um único indicador que desliza com `transform`. Controles e rótulos usam Space Grotesk; datas e contagens mantêm a fonte mono. Os contadores do quadro usam texto escuro sobre fundo claro. A alça de arraste fica dentro do cartão; o seletor de status oferece a alternativa por teclado.

## 6. Mobile

Título do quadro com `clamp`, menus limitados ao viewport e cartões em coluna no celular. A revisão anterior que elimina as placas sobre a Lua e as legendas de observatório foi preservada. Capturas e testes cobrem 390px e 1440px.

## 7. HTML e publicação estática

HTML em `pt-BR` e títulos próprios para as páginas. A raiz e `/inicio` são pré-renderizadas: a raiz entrega o shell com skeleton e a abertura entrega seu conteúdo sem consultar a API. As páginas dependentes da API continuam usando o cliente. O fallback passa a `200.html` porque `index.html` contém a raiz pré-renderizada; a regra de entrada do domínio em `/inicio` é mantida.

O idioma do documento ajuda tecnologias assistivas, mas o formato visual do campo nativo de data também depende da configuração regional do navegador/sistema.

## Verificação

```sh
npm test
npm run check
npm run build
```

Os testes de navegador usam API simulada: verificam tentativas, skeleton, recuperação, filtros, controles, POST, arraste/PATCH, responsividade, flutuação, teclado e pausa dos canvas. Não dependem de o Render estar acordado. A validação da pausa usa eventos de visibilidade e ocultação real dos elementos para o IntersectionObserver.

O selo e o script injetados pela Netlify dependem de configuração no painel. Esta revisão não tenta escondê-los por CSS ou JavaScript.
