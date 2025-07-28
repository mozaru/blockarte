PROJETO: Blockmarte

DESCRIÇÃO:
Blockmarte é um jogo de quebra-blocos (estilo Blockout) onde o jogador destrói criaturas alienígenas criadas a partir de fórmulas matemáticas. Cada fase representa uma criatura diferente, com visual orgânico, procedural e animado, representada por milhares de pontos gerados matematicamente.

O jogo é feito com HTML, CSS e JavaScript puro, e roda em navegador (web). O jogador usa teclado ou controle virtual (mobile) para mover a raquete e rebater a bola, destruindo os pontos da criatura.

ESTRUTURA DO JOGO:

1. TELAS HTML:
- #home-screen – tela inicial com botões "Jogar", "Sobre", "Créditos"
- #level-select – grade de 9 fases + 1 boss
- #game-screen – tela do jogo, com <canvas id="game-canvas">
- #modal-about e #modal-credits – popups com descrição do jogo e créditos

2. CANVAS:
- Um único <canvas> de 400x400 desenha a cena: criatura, bola, raquete, HUD.

3. ESTILO VISUAL:
- Estilo sci-fi com fonte Orbitron
- Botões com bordas neon e fundo escuro
- Fases trancadas mostram cadeado; liberadas mostram mini-GIF da criatura

ESTRUTURA DE CLASSES:

- Raquete
  - Atributos: posição (x,y), largura, altura, cor
  - Métodos: update(dt, input), getRetangulo(), desenhar(ctx)

- Bola
  - Atributos: posição, raio, cor, direção (dx, dy)
  - Métodos: update(dt), colisaoComRaquete(raquete), desenhar(ctx)

- CriaturaBase
  - Representa 10.000 pontos animados no tempo
  - Contém os pontos, os acertos (hit[]) e função update(t)
  - Método checarColisoes(bola) retorna acertos

- CriaturaFase1 a CriaturaFase10
  - Herdam de CriaturaBase
  - Cada uma implementa sua própria fórmula matemática no update(t)

- Cena
  - Responsável por gerenciar a lógica do jogo:
    - instância de Raquete, Bola, Criatura
    - leitura de inputs (Input)
    - controle de pontuação, fim de jogo, estado atual

- CenaCanvas
  - Responsável por desenhar a cena no canvas:
    - bola, raquete, criatura e textos do HUD

- Input
  - Unifica controles físicos e virtuais
  - Leitura de teclado (ArrowLeft/ArrowRight)
  - Botões móveis (#btn-left, #btn-right) ativam esquerda e direita

FASES:
- Existem 9 fases + 1 boss (total: 10 criaturas diferentes)
- A criatura muda por fase, o resto da cena é constante
- Criaturas são geradas com fórmulas no método update(t) da classe específica
- Progresso salvo via localStorage com chave "blockmarte_progress"

ESTRUTURA DE ARQUIVOS (SUGESTÃO):

blockmarte/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js         ← loop principal e controle de telas
│   ├── cena.js
│   ├── cenaCanvas.js
│   ├── input.js
│   ├── raquete.js
│   ├── bola.js
│   ├── criaturaBase.js
│   ├── criaturaFase1.js ... criaturaFase10.js
├── assets/
│   ├── fase1.gif ... fase9.gif
│   ├── boss.gif
│   └── lock.png

STATUS ATUAL DO PROJETO:
[x] Telas HTML básicas implementadas
[x] Tela de seleção de fases funcional com fases trancadas/desbloqueadas
[x] Raquete, bola e criatura funcionando com sistema de colisão
[x] Input unificado (teclado + touch)
[x] Classe CriaturaFase1 implementada com fórmula procedural
[x] Tela do jogo funcionando no <canvas>
[ ] Fases 2 a 10 ainda precisam de suas fórmulas
[ ] Detecção de vitória/morte mostra mensagem mas ainda sem botões de próxima fase/reinício
[ ] Sistema de música e som ausente

COMO CONTINUAR:
1. Adicionar novas criaturas (CriaturaFase2, etc.)
2. Ampliar o sistema de fim de fase (exibir botão “Próxima Fase” após vitória)
3. Adicionar som, efeitos visuais, animações extras
4. Opcional: melhorar mobile com haptics, vibração, multitouch
5. Empacotar com PWA para rodar offline ou exportar para Android com capacitor/cordova

IMPORTANTE:
Este prompt documenta todo o projeto atual. Ele pode ser usado após reiniciar ou para colaboração com outro desenvolvedor ou modelo de IA. É uma base confiável para continuar o projeto de onde parou.
