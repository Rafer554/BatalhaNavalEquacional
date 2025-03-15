# BatalhaNavalEquacional


## Visão Geral

Este é um jogo educativo de "Batalha Naval Matemática" que combina o tradicional jogo de batalha naval com desafios matemáticos. Os jogadores devem resolver equações para descobrir as coordenadas dos navios escondidos em um tabuleiro 12x12.

## Funcionalidades

- Tabuleiro de jogo 12x12 com coordenadas de A a L (colunas) e 1 a 12 (linhas)
- Cinco navios de diferentes tamanhos (5, 4, 3, 3 e 2 casas)
- Equações matemáticas para determinar a posição de cada navio
- Sistema de pontuação: ganhe 150 pontos por acerto e perca 100 pontos por erro
- Revelação automática de navios completamente destruídos

## Como Jogar

1. O jogo gera automaticamente cinco navios em posições aleatórias no tabuleiro
2. Para cada navio, são fornecidas três informações:
   - Equação para determinar a linha inicial
   - Equação para determinar a coluna inicial
   - Direção do navio (horizontal ou vertical)
3. Resolva as equações para determinar as coordenadas de cada navio
4. Clique nas células do tabuleiro para atacar
   - Acerto: célula fica vermelha e você ganha 150 pontos
   - Erro: célula fica cinza e você perde 100 pontos
5. O objetivo é destruir todos os navios antes que sua pontuação chegue a zero

## Mecânica de Equações

- As equações incluem operações de adição (+), subtração (-) e multiplicação (*)
- As soluções das equações sempre estarão entre 1 e 12, correspondendo às coordenadas do tabuleiro
- Exemplo: Se a equação da linha for "2 + 3 = ?" e a da coluna for "4 * 2 = ?", a coordenada inicial seria (5, H)

## Pontuação

- Cada jogador começa com 1000 pontos
- Acertar um navio: +150 pontos
- Errar um tiro: -100 pontos
- O jogo termina quando todos os navios são destruídos ou quando a pontuação chega a zero

## Requisitos Técnicos

- Navegador web moderno com suporte a JavaScript
- Não requer instalação adicional

## Implementação

O jogo é implementado em JavaScript puro e HTML/CSS. O arquivo `script.js` contém toda a lógica do jogo, incluindo:

- Geração de equações matemáticas
- Posicionamento aleatório dos navios
- Verificação de jogadas e atualização do tabuleiro
- Sistema de pontuação e condições de término de jogo

Para iniciar uma nova partida, basta chamar a função `initGame()`.