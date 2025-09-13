const boardSize = 20;
const boardElement = document.getElementById('boarde');
const scoreElement = document.querySelector('.par');
const startButton = document.querySelector('.bott');

let snake = [];
let direction = { x: 0, y: 0 };
let food = {};
let score = 0;
let gameInterval = null;
let isRunning = false;

function createBoard() {
  boardElement.style.display = 'grid';
  boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 20px)`;
  boardElement.style.gridTemplateRows = `repeat(${boardSize}, 20px)`;
  boardElement.style.width = `${boardSize * 20}px`;
  boardElement.style.height = `${boardSize * 20}px`;
  boardElement.style.backgroundColor = '#1e1e1e';
  boardElement.style.border = '2px solid #333';
  boardElement.innerHTML = '';
}

function draw() {
  boardElement.innerHTML = '';

  // Draw food
  const foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.backgroundColor = '#FF6B6B';
  foodElement.style.borderRadius = '50%';
  foodElement.style.width = '18px';
  foodElement.style.height = '18px';
  boardElement.appendChild(foodElement);

  // Draw the snake
  snake.forEach((segment, index) => {
    const segmentElement = document.createElement('div');
    segmentElement.style.gridRowStart = segment.y;
    segmentElement.style.gridColumnStart = segment.x;
    segmentElement.style.backgroundColor = index === 0 ? '#4ECDC4' : '#45B7D1';
    segmentElement.style.borderRadius = index === 0 ? '5px' : '3px';
    segmentElement.style.width = '18px';
    segmentElement.style.height = '18px';
    boardElement.appendChild(segmentElement);
  });
}

function randomFoodPosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * boardSize) + 1,
      y: Math.floor(Math.random() * boardSize) + 1,
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
  return position;
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check collision with walls
  if (head.x < 1 || head.x > boardSize || head.y < 1 || head.y > boardSize) {
    gameOver();
    return;
  }

  // Check collision with the body
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Check if the food is eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = `Score: ${score}`;
    food = randomFoodPosition();

    // Speed ​​up the game slightly with each food eaten
    if (score % 5 === 0) {
      clearInterval(gameInterval);
      const newSpeed = Math.max(50, 150 - (score * 2));
      gameInterval = setInterval(gameLoop, newSpeed);
    }
  } else {
    snake.pop();
  }
}

function gameOver() {
  clearInterval(gameInterval);
  isRunning = false;
  alert(`Game Over! Your score: ${score}`);
  startButton.disabled = false;
  startButton.textContent = 'Replay';
}

function gameLoop() {
  moveSnake();
  draw();
}

function startGame() {
  // Donner le focus à la fenêtre pour les événements clavier
  window.focus();

  snake = [
    { x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) },
    { x: Math.floor(boardSize / 2) - 1, y: Math.floor(boardSize / 2) },
    { x: Math.floor(boardSize / 2) - 2, y: Math.floor(boardSize / 2) }
  ];
  direction = { x: 1, y: 0 }; // Commence à droite
  food = randomFoodPosition();
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
  isRunning = true;
  startButton.disabled = true;
  startButton.textContent = 'In progress... ';
  createBoard();
  draw();

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 150);
}

// Keyboard key management
window.addEventListener('keydown', e => {
  if (!isRunning) return;

  switch (e.key) {
    case 'ArrowUp':
    case 'z':
    case 'Z':
      if (direction.y === 1) break; // Empêche de faire demi-tour
      direction = { x: 0, y: -1 };
      e.preventDefault();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (direction.y === -1) break;
      direction = { x: 0, y: 1 };
      e.preventDefault();
      break;
    case 'ArrowLeft':
    case 'q':
    case 'Q':
      if (direction.x === 1) break;
      direction = { x: -1, y: 0 };
      e.preventDefault();
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (direction.x === -1) break;
      direction = { x: 1, y: 0 };
      e.preventDefault();
      break;
  }
});

// Start the game when the button is clicked
startButton.addEventListener('click', startGame);

// Give focus to the page when clicked
document.addEventListener('click', () => {
  window.focus();
});

// Instruction message
console.log('🚀 Snake Game chargé !');
console.log('🕹️  Utilise les flèches ou ZQSD pour contrôler le serpent');
console.log('🎯 Mange la nourriture rouge pour grandir et marquer des points');
