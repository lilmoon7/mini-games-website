const board = document.getElementById('board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');

const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
function createBoard() {
  board.innerHTML = '';
  gameState.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.dataset.index = index;
    cellElement.addEventListener('click', handleCellClick);
    board.appendChild(cellElement);
  });
}

function handleCellClick(e) {
  const cellIndex = e.target.dataset.index;

  if (!gameActive || gameState[cellIndex]) return;

  gameState[cellIndex] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add('taken');

  if (checkWin()) {
    message.textContent = `The Player ${currentPlayer} win !`;
    gameActive = false;
  } else if (gameState.every(cell => cell)) {
    message.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}, it\'s your turn !`;
  }
}

function checkWin() {
  return winningCombinations.some(combination => {
    return combination.every(index => gameState[index] === currentPlayer);
  });
}

resetButton.addEventListener('click', resetGame);

function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  gameState = Array(9).fill('');
  message.textContent = 'Player X, it\'s your turn !';
  createBoard();
}

createBoard();
