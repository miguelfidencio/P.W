// --- ESTADO DO JOGO ---
let deckBase = [];
let playerHand = [];
let cpuHand = [];
let playerScore = 0;
let cpuScore = 0;

// Elementos da DOM
const elPlayerHand = document.getElementById('player-hand');
const elCardPlayer = document.getElementById('card-player');
const elCardCpu = document.getElementById('card-cpu');
const elStatus = document.getElementById('game-status');
const elHandCount = document.getElementById('hand-count');
const elScorePlayer = document.getElementById('score-player');
const elScoreCpu = document.getElementById('score-cpu');
const btnResetScore = document.getElementById('btn-reset-score');
const btnRestart = document.getElementById('btn-restart');

// INICIALIZAÇÃO 
// Carrega os dados das cartas do cartas.json
fetch('cartas.json')
  .then(res => res.json())
  .then(data => {
    deckBase = data;
    startNewGame();
  })
  .catch(err => console.error("Erro ao carregar cartas.json:", err));

// regra do jogo e distribuição das cartas
function startNewGame() {
  // Embaralha uma cópia do baralho base
  const shuffled = [...deckBase].sort(() => Math.random() - 0.5);
  
  // Divide as 26 cartas para cada jogador
  playerHand = shuffled.slice(0, 26);
  cpuHand = shuffled.slice(26, 52);

  // Reseta arena
  elCardPlayer.innerHTML = '?';
  elCardCpu.innerHTML = '?';
  elStatus.textContent = 'Escolha uma carta da sua mão para jogar';

  renderPlayerHand();
}

// renderização
function renderCardHTML(card) {
  return `
    <div class="card ${card.cor}">
      <div class="card-corner top-left">
        <span>${card.valor}</span>
        <span>${card.naipe}</span>
      </div>
      <div class="card-center-suit">${card.naipe}</div>
      <div class="card-corner bottom-right">
        <span>${card.valor}</span>
        <span>${card.naipe}</span>
      </div>
    </div>
  `;
}

function renderPlayerHand() {
  elPlayerHand.innerHTML = '';
  elHandCount.textContent = playerHand.length;

  playerHand.forEach((card, index) => {
    const cardWrapper = document.createElement('div');
    cardWrapper.innerHTML = renderCardHTML(card);
    const cardEl = cardWrapper.firstElementChild;
    
    // Adiciona o evento de clique para jogar a carta
    cardEl.addEventListener('click', () => playRound(index));
    elPlayerHand.appendChild(cardEl);
  });
}

// executa a rodada
function playRound(playerCardIndex) {
  if (playerHand.length === 0 || cpuHand.length === 0) return;

  // Jogador remove a carta escolhida da sua mão
  const playerCard = playerHand.splice(playerCardIndex, 1)[0];

  // Computador escolhe uma carta aleatória da mão dele
  const cpuCardIndex = Math.floor(Math.random() * cpuHand.length);
  const cpuCard = cpuHand.splice(cpuCardIndex, 1)[0];

  // Atualiza os slots da arena
  elCardPlayer.innerHTML = renderCardHTML(playerCard);
  elCardCpu.innerHTML = renderCardHTML(cpuCard);

  // Compara pesos e calcula pontuação
  if (playerCard.peso > cpuCard.peso) {
    playerScore++;
    elStatus.textContent = `Você ganhou a rodada! (${playerCard.valor} vs ${cpuCard.valor})`;
  } else if (cpuCard.peso > playerCard.peso) {
    cpuScore++;
    elStatus.textContent = `Computador ganhou a rodada! (${cpuCard.valor} vs ${playerCard.valor})`;
  } else {
    elStatus.textContent = `Empate! (${playerCard.valor} vs ${cpuCard.valor})`;
  }

  // Atualiza o placar no topo
  updateScoreboard();

  // Atualiza a mão exibida na tela
  renderPlayerHand();

  // Verifica fim de jogo
  if (playerHand.length === 0) {
    elStatus.textContent += " — Fim de jogo! Clique em 'Nova Partida' para reembaralhar.";
  }
}

function updateScoreboard() {
  elScorePlayer.textContent = playerScore;
  elScoreCpu.textContent = cpuScore;
}

// açao dos botões
btnResetScore.addEventListener('click', () => {
  playerScore = 0;
  cpuScore = 0;
  updateScoreboard();
});

btnRestart.addEventListener('click', () => {
  startNewGame();
});