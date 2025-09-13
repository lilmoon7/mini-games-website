// Tic-Tac-Toe-PP.js (Player vs AI, Minimax)
// Human = 'X', AI = 'O'

const board = document.getElementById('board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X'; // X starts (human)
let gameActive = true;
let gameState = Array(9).fill('');

// Winning combinations
const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Difficulty: 'hard' = Minimax (unbeatable), 'easy' = random move
const DIFFICULTY = 'hard'; // change to 'easy' for a simpler AI

function createBoard() {
  board.innerHTML = '';
  gameState.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.dataset.index = index;
    cellElement.addEventListener('click', handleCellClick);
    cellElement.textContent = cell;
    if (cell) cellElement.classList.add('taken');
    board.appendChild(cellElement);
  });
}

function handleCellClick(e) {
  const cellIndex = Number(e.target.dataset.index);

  if (!gameActive || gameState[cellIndex]) return;
  if (currentPlayer !== 'X') return; // Ensure only human plays on their turn

  playMove(cellIndex, 'X');

  if (!gameActive) return;

  // After human move, AI move (small delay for UX)
  if (DIFFICULTY === 'easy') {
    setTimeout(() => aiMoveRandom(), 250);
  } else {
    setTimeout(() => aiMoveMinimax(), 250);
  }
}

function playMove(index, player) {
  gameState[index] = player;
  const cellEl = board.querySelector(`.cell[data-index='${index}']`);
  if (cellEl) {
    cellEl.textContent = player;
    cellEl.classList.add('taken');
  }

  if (checkWin(player)) {
    message.textContent = player === 'X' ? `The Player ${player} Win !` : `The Computer (${player}) Win !`;
    gameActive = false;
    return;
  }

  if (gameState.every(cell => cell !== '')) {
    message.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  // switch player
  currentPlayer = player === 'X' ? 'O' : 'X';
  message.textContent = currentPlayer === 'X' ? "Turn of player !" : "Computer Thinks...";
}

function checkWin(player) {
  return winningCombinations.some(comb => comb.every(i => gameState[i] === player));
}

// --- AI: Random (easy) ---
function aiMoveRandom() {
  if (!gameActive) return;
  const emptyIndexes = gameState.map((v,i) => v === '' ? i : null).filter(i => i !== null);
  if (emptyIndexes.length === 0) return;
  const choice = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  playMove(choice, 'O');
}

// --- AI: Minimax (hard / perfect) ---
function aiMoveMinimax() {
  if (!gameActive) return;

  // If first move and board empty, prefer a random corner or center for variety
  const empties = gameState.map((v,i) => v === '' ? i : null).filter(i => i !== null);
  if (empties.length === 9) {
    const openings = [0,2,4,6,8]; // corners + center
    const choice = openings[Math.floor(Math.random() * openings.length)];
    playMove(choice, 'O');
    return;
  }

  const best = minimax(gameState.slice(), 'O');
  if (best.index !== undefined) {
    playMove(best.index, 'O');
  } else {
    // fallback
    aiMoveRandom();
  }
}

// Minimax implementation
function minimax(boardState, player) {
  // Available spots
  const availableSpots = boardState.map((v,i) => v === '' ? i : null).filter(i => i !== null);

  // Terminal states
  if (isWinner(boardState, 'X')) {
    return {score: -10};
  } else if (isWinner(boardState, 'O')) {
    return {score: 10};
  } else if (availableSpots.length === 0) {
    return {score: 0};
  }

  // Collect moves
  const moves = [];

  for (let i = 0; i < availableSpots.length; i++) {
    const idx = availableSpots[i];
    const move = {};
    move.index = idx;
    boardState[idx] = player;

    if (player === 'O') {
      const result = minimax(boardState, 'X');
      move.score = result.score;
    } else {
      const result = minimax(boardState, 'O');
      move.score = result.score;
    }

    // undo move
    boardState[idx] = '';
    moves.push(move);
  }

  // Choose best move
  let bestMove;
  if (player === 'O') {
    // maximize
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    // minimize
    let bestScore = +Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }

  return bestMove;
}

function isWinner(boardState, player) {
  return winningCombinations.some(comb => comb.every(i => boardState[i] === player));
}

// Reset
resetButton.addEventListener('click', resetGame);
function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  gameState = Array(9).fill('');
  message.textContent = 'Turn of player !';
  createBoard();
}

// Initialize board
createBoard();
