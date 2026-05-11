const COLS = 10;
const ROWS = 20;

let BLOCK = 30;
let NEXT_BLOCK = 24;

const COLORS = {
  I: '#00cfcf',
  O: '#cfcf00',
  T: '#9f00cf',
  S: '#00cf00',
  Z: '#cf0000',
  J: '#0000cf',
  L: '#cf7f00',
};

const SHAPES = {
  I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1],[0,0,0]],
  S: [[0,1,1],[1,1,0],[0,0,0]],
  Z: [[1,1,0],[0,1,1],[0,0,0]],
  J: [[1,0,0],[1,1,1],[0,0,0]],
  L: [[0,0,1],[1,1,1],[0,0,0]],
};

const PIECE_TYPES = Object.keys(SHAPES);
const SCORE_TABLE = [0, 100, 300, 500, 800];
const LEVEL_INTERVAL = 10;

const boardCanvas = document.getElementById('board');
const boardCtx = boardCanvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const linesEl = document.getElementById('lines');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayScore = document.getElementById('overlay-score');
const overlayBtn = document.getElementById('overlay-btn');
const touchControls = document.getElementById('touch-controls');

let board, current, next, score, level, lines, dropInterval, lastTime, rafId, paused, gameOver;

// ── Sizing ──────────────────────────────────────────────

function isMobile() {
  return window.innerWidth < 600;
}

function updateSizes() {
  if (isMobile()) {
    const sideH = document.getElementById('side-panel').offsetHeight || 56;
    const ctrlH = touchControls.offsetHeight || 126;
    const padding = 12;
    const availW = window.innerWidth - 4;
    const availH = window.innerHeight - sideH - ctrlH - padding;
    const byW = Math.floor(availW / COLS);
    const byH = Math.floor(availH / ROWS);
    BLOCK = Math.max(14, Math.min(byW, byH, 32));
    NEXT_BLOCK = Math.max(10, Math.floor(BLOCK * 0.45));
  } else {
    BLOCK = 30;
    NEXT_BLOCK = 24;
  }
  boardCanvas.width = COLS * BLOCK;
  boardCanvas.height = ROWS * BLOCK;
  nextCanvas.width = 5 * NEXT_BLOCK;
  nextCanvas.height = 5 * NEXT_BLOCK;
}

window.addEventListener('resize', () => {
  updateSizes();
  drawBoard();
  drawNext();
});

// ── Game logic ───────────────────────────────────────────

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece() {
  const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  return {
    type,
    color: COLORS[type],
    shape: SHAPES[type].map(row => [...row]),
    x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2),
    y: 0,
  };
}

function rotate(shape) {
  const n = shape.length;
  const m = shape[0].length;
  const result = Array.from({ length: m }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < m; c++) {
      result[c][n - 1 - r] = shape[r][c];
    }
  }
  return result;
}

function isValid(piece, dx = 0, dy = 0, shape = piece.shape) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = piece.x + c + dx;
      const ny = piece.y + r + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

function lock(piece) {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const ny = piece.y + r;
      const nx = piece.x + c;
      if (ny < 0) { endGame(); return; }
      board[ny][nx] = piece.color;
    }
  }
  clearLines();
  current = next;
  next = randomPiece();
  if (!isValid(current)) { endGame(); return; }
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== null)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(null));
      cleared++;
      r++;
    }
  }
  if (cleared > 0) {
    score += SCORE_TABLE[cleared] * level;
    lines += cleared;
    level = Math.floor(lines / LEVEL_INTERVAL) + 1;
    dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    scoreEl.textContent = score;
    levelEl.textContent = level;
    linesEl.textContent = lines;
  }
}

function ghostY() {
  let dy = 0;
  while (isValid(current, 0, dy + 1)) dy++;
  return current.y + dy;
}

function doRotate() {
  const rotated = rotate(current.shape);
  const kicks = [0, -1, 1, -2, 2];
  for (const kick of kicks) {
    if (isValid({ ...current, x: current.x + kick }, 0, 0, rotated)) {
      current.shape = rotated;
      current.x += kick;
      break;
    }
  }
}

function hardDrop() {
  const dy = ghostY() - current.y;
  current.y = ghostY();
  score += dy * 2;
  scoreEl.textContent = score;
  lock(current);
}

function softDrop() {
  if (isValid(current, 0, 1)) {
    current.y++;
    score++;
    scoreEl.textContent = score;
  }
}

// ── Drawing ──────────────────────────────────────────────

function drawBlock(ctx, x, y, color, size) {
  size = size || BLOCK;
  ctx.fillStyle = color;
  ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(x * size + 1, y * size + 1, size - 2, 4);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x * size + 1, y * size + size - 5, size - 2, 4);
}

function drawBoard() {
  boardCtx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);

  boardCtx.strokeStyle = 'rgba(255,255,255,0.03)';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      boardCtx.strokeRect(c * BLOCK, r * BLOCK, BLOCK, BLOCK);
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) drawBlock(boardCtx, c, r, board[r][c]);
    }
  }

  if (current) {
    const gy = ghostY();
    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (!current.shape[r][c]) continue;
        boardCtx.fillStyle = 'rgba(255,255,255,0.12)';
        boardCtx.fillRect((current.x + c) * BLOCK + 1, (gy + r) * BLOCK + 1, BLOCK - 2, BLOCK - 2);
      }
    }

    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (!current.shape[r][c]) continue;
        drawBlock(boardCtx, current.x + c, current.y + r, current.color);
      }
    }
  }
}

function drawNext() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  if (!next) return;
  const shape = next.shape;
  const offsetX = Math.floor((5 - shape[0].length) / 2);
  const offsetY = Math.floor((5 - shape.length) / 2);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      drawBlock(nextCtx, offsetX + c, offsetY + r, next.color, NEXT_BLOCK);
    }
  }
}

// ── Game loop ────────────────────────────────────────────

function loop(time) {
  if (paused || gameOver) return;
  const delta = time - lastTime;
  if (delta > dropInterval) {
    if (isValid(current, 0, 1)) {
      current.y++;
    } else {
      lock(current);
    }
    lastTime = time;
  }
  drawBoard();
  drawNext();
  rafId = requestAnimationFrame(loop);
}

function startGame() {
  board = createBoard();
  score = 0;
  level = 1;
  lines = 0;
  dropInterval = 1000;
  paused = false;
  gameOver = false;
  scoreEl.textContent = 0;
  levelEl.textContent = 1;
  linesEl.textContent = 0;
  current = randomPiece();
  next = randomPiece();
  overlay.classList.add('hidden');
  cancelAnimationFrame(rafId);
  lastTime = performance.now();
  rafId = requestAnimationFrame(loop);
  startBtn.textContent = '再スタート';
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(rafId);
  overlayTitle.textContent = 'GAME OVER';
  overlayScore.textContent = `スコア: ${score}`;
  overlay.classList.remove('hidden');
}

function togglePause() {
  if (gameOver) return;
  paused = !paused;
  if (!paused) {
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);
  }
}

// ── Keyboard ─────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (!current || gameOver) return;
  switch (e.key) {
    case 'ArrowLeft':  if (isValid(current, -1, 0)) current.x--; break;
    case 'ArrowRight': if (isValid(current,  1, 0)) current.x++; break;
    case 'ArrowDown':  softDrop(); break;
    case 'ArrowUp':    doRotate(); break;
    case ' ':          e.preventDefault(); hardDrop(); break;
    case 'p': case 'P': togglePause(); break;
  }
});

// ── Touch buttons ────────────────────────────────────────

function holdBtn(id, action) {
  const btn = document.getElementById(id);
  if (!btn) return;
  let iv = null;
  const start = e => {
    e.preventDefault();
    if (!current || gameOver || paused) return;
    action();
    iv = setInterval(() => {
      if (!current || gameOver || paused) { clearInterval(iv); return; }
      action();
    }, 110);
  };
  const stop = () => clearInterval(iv);
  btn.addEventListener('touchstart', start, { passive: false });
  btn.addEventListener('touchend',   stop,  { passive: false });
  btn.addEventListener('touchcancel',stop,  { passive: false });
  btn.addEventListener('mousedown',  start);
  btn.addEventListener('mouseup',    stop);
  btn.addEventListener('mouseleave', stop);
}

function tapBtn(id, action) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    if (!current || gameOver || paused) return;
    action();
  }, { passive: false });
  btn.addEventListener('click', () => {
    if (!current || gameOver || paused) return;
    action();
  });
}

holdBtn('btn-left',  () => { if (isValid(current, -1, 0)) current.x--; });
holdBtn('btn-right', () => { if (isValid(current,  1, 0)) current.x++; });
holdBtn('btn-down',  softDrop);
tapBtn('btn-rotate', doRotate);
tapBtn('btn-hard',   hardDrop);

const pauseBtn = document.getElementById('btn-pause');
if (pauseBtn) {
  pauseBtn.addEventListener('touchstart', e => { e.preventDefault(); togglePause(); }, { passive: false });
  pauseBtn.addEventListener('click', togglePause);
}

// ── Swipe on canvas ──────────────────────────────────────

let swipeX = 0, swipeY = 0, swipeT = 0;

boardCanvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const t = e.changedTouches[0];
  swipeX = t.clientX;
  swipeY = t.clientY;
  swipeT = Date.now();
}, { passive: false });

boardCanvas.addEventListener('touchend', e => {
  e.preventDefault();
  if (!current || gameOver || paused) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - swipeX;
  const dy = t.clientY - swipeY;
  const dt = Date.now() - swipeT;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx < 12 && absDy < 12 && dt < 250) {
    doRotate();
  } else if (absDx > absDy && absDx > 20) {
    if (dx < 0) { if (isValid(current, -1, 0)) current.x--; }
    else        { if (isValid(current,  1, 0)) current.x++; }
  } else if (dy > 30) {
    if (dy / dt > 0.4 || dy > 120) hardDrop();
    else softDrop();
  }
}, { passive: false });

// ── Init ─────────────────────────────────────────────────

startBtn.addEventListener('click', startGame);
overlayBtn.addEventListener('click', startGame);

updateSizes();
drawBoard();
drawNext();
