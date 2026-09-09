// ============================================
// إعداد الكانفاس
// ============================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ============================================
// الأصوات
// ============================================
const sounds = {
  music: new Audio('sounds/Audio/spaceEngineLow_000.ogg'),
  jump: new Audio('sounds/Audio/thrusterFire_000.ogg'),
  stomp: new Audio('sounds/Audio/impactMetal_002.ogg'),
  hurt: new Audio('sounds/Audio/explosionCrunch_001.ogg'),
  levelComplete: new Audio('sounds/Audio/doorOpen_000.ogg'),
  win: new Audio('sounds/Audio/forceField_004.ogg')
};

sounds.music.loop = true;
sounds.music.volume = 0.25;
sounds.jump.volume = 0.5;
sounds.stomp.volume = 0.6;
sounds.hurt.volume = 0.6;
sounds.levelComplete.volume = 0.6;
sounds.win.volume = 0.7;

let musicStarted = false;
function startMusicOnce() {
  if (!musicStarted) {
    sounds.music.play().catch(() => {});
    musicStarted = true;
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// ============================================
// اللاعب
// ============================================
const player = {
  x: 100,
  y: 100,
  width: 40,
  height: 40,
  velocityX: 0,
  velocityY: 0,
  isJumping: false
};

const gravity = 0.6;
let walkCycle = 0;

// ============================================
// التحكم بالكيبورد
// ============================================
const keys = { right: false, left: false };

document.addEventListener('keydown', (e) => {
  startMusicOnce();

  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
  if ((e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') && !player.isJumping) {
    player.velocityY = -13;
    player.isJumping = true;
    playSound(sounds.jump);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
});

// ============================================
// توليد عناصر الخلفية (سحاب وتلال) حسب عرض المستوى
// ============================================
function generateScenery(worldWidth) {
  const clouds = [];
  const hills = [];

  let cx = 150;
  while (cx < worldWidth) {
    clouds.push({
      x: cx,
      y: 50 + Math.random() * 70,
      size: 30 + Math.random() * 30
    });
    cx += 350 + Math.random() * 250;
  }

  let hx = 100;
  while (hx < worldWidth) {
    hills.push({
      x: hx,
      y: 340,
      size: 150 + Math.random() * 100
    });
    hx += 500 + Math.random() * 300;
  }

  return { clouds, hills };
}

// ============================================
// المستويات
// ============================================
const levels = [
  {
    worldWidth: 3000,
    platforms: [
      { x: 0,    y: 360, width: 400, height: 40, type: 'ground' },
      { x: 480,  y: 300, width: 120, height: 20, type: 'normal' },
      { x: 650,  y: 240, width: 120, height: 20, type: 'normal' },
      { x: 850,  y: 300, width: 150, height: 20, type: 'normal' },
      { x: 1050, y: 300, width: 500, height: 40, type: 'ground' },
      { x: 1650, y: 250, width: 100, height: 20, type: 'small' },
      { x: 1820, y: 200, width: 100, height: 20, type: 'small' },
      { x: 2000, y: 300, width: 200, height: 20, type: 'normal' },
      { x: 2300, y: 300, width: 700, height: 40, type: 'ground' }
    ],
    enemies: [
      { x: 500,  y: 328, width: 32, height: 32, minX: 480,  maxX: 600,  speed: 2,   direction: 1,  alive: true },
      { x: 700,  y: 268, width: 32, height: 32, minX: 650,  maxX: 770,  speed: 1.5, direction: 1,  alive: true },
      { x: 1100, y: 268, width: 32, height: 32, minX: 1050, maxX: 1300, speed: 2.5, direction: 1,  alive: true },
      { x: 1400, y: 268, width: 32, height: 32, minX: 1300, maxX: 1550, speed: 2,   direction: -1, alive: true },
      { x: 2400, y: 268, width: 32, height: 32, minX: 2300, maxX: 2600, speed: 2.5, direction: 1,  alive: true },
      { x: 2700, y: 268, width: 32, height: 32, minX: 2600, maxX: 2900, speed: 3,   direction: -1, alive: true }
    ],
    goal: { x: 2900, y: 240, width: 30, height: 120 }
  },
  {
    worldWidth: 4000,
    platforms: [
      { x: 0,    y: 360, width: 300, height: 40, type: 'ground' },
      { x: 400,  y: 280, width: 100, height: 20, type: 'small' },
      { x: 600,  y: 200, width: 100, height: 20, type: 'small' },
      { x: 800,  y: 280, width: 100, height: 20, type: 'small' },
      { x: 1000, y: 300, width: 600, height: 40, type: 'ground' },
      { x: 1700, y: 250, width: 150, height: 20, type: 'normal' },
      { x: 1950, y: 200, width: 150, height: 20, type: 'normal' },
      { x: 2200, y: 250, width: 150, height: 20, type: 'normal' },
      { x: 2500, y: 300, width: 400, height: 40, type: 'ground' },
      { x: 3050, y: 260, width: 100, height: 20, type: 'small' },
      { x: 3250, y: 210, width: 100, height: 20, type: 'small' },
      { x: 3450, y: 300, width: 550, height: 40, type: 'ground' }
    ],
    enemies: [
      { x: 1050, y: 268, width: 32, height: 32, minX: 1000, maxX: 1300, speed: 2.5, direction: 1,  alive: true },
      { x: 1350, y: 268, width: 32, height: 32, minX: 1300, maxX: 1600, speed: 2,   direction: -1, alive: true },
      { x: 2550, y: 268, width: 32, height: 32, minX: 2500, maxX: 2750, speed: 3,   direction: 1,  alive: true },
      { x: 2800, y: 268, width: 32, height: 32, minX: 2750, maxX: 2900, speed: 2.5, direction: -1, alive: true },
      { x: 3500, y: 268, width: 32, height: 32, minX: 3450, maxX: 3700, speed: 3,   direction: 1,  alive: true },
      { x: 3750, y: 268, width: 32, height: 32, minX: 3700, maxX: 3950, speed: 2.5, direction: -1, alive: true },
      { x: 3900, y: 268, width: 32, height: 32, minX: 3850, maxX: 3980, speed: 3.5, direction: 1,  alive: true }
    ],
    goal: { x: 3900, y: 240, width: 30, height: 120 }
  },
  {
    worldWidth: 5000,
    platforms: [
      { x: 0,    y: 360, width: 350, height: 40, type: 'ground' },
      { x: 450,  y: 300, width: 100, height: 20, type: 'normal' },
      { x: 650,  y: 240, width: 100, height: 20, type: 'normal' },
      { x: 850,  y: 180, width: 100, height: 20, type: 'normal' },
      { x: 1050, y: 300, width: 500, height: 40, type: 'ground' },
      { x: 1650, y: 260, width: 90,  height: 20, type: 'small' },
      { x: 1820, y: 210, width: 90,  height: 20, type: 'small' },
      { x: 1990, y: 260, width: 90,  height: 20, type: 'small' },
      { x: 2200, y: 300, width: 400, height: 40, type: 'ground' },
      { x: 2700, y: 250, width: 150, height: 20, type: 'normal' },
      { x: 2950, y: 200, width: 150, height: 20, type: 'normal' },
      { x: 3200, y: 300, width: 500, height: 40, type: 'ground' },
      { x: 3800, y: 260, width: 100, height: 20, type: 'small' },
      { x: 4000, y: 210, width: 100, height: 20, type: 'small' },
      { x: 4200, y: 300, width: 750, height: 40, type: 'ground' }
    ],
    enemies: [
      { x: 500,  y: 268, width: 32, height: 32, minX: 450,  maxX: 550,  speed: 2,   direction: 1,  alive: true },
      { x: 1100, y: 268, width: 32, height: 32, minX: 1050, maxX: 1300, speed: 2.5, direction: 1,  alive: true },
      { x: 1350, y: 268, width: 32, height: 32, minX: 1300, maxX: 1550, speed: 3,   direction: -1, alive: true },
      { x: 2250, y: 268, width: 32, height: 32, minX: 2200, maxX: 2450, speed: 2.5, direction: 1,  alive: true },
      { x: 2500, y: 268, width: 32, height: 32, minX: 2450, maxX: 2600, speed: 3,   direction: -1, alive: true },
      { x: 3250, y: 268, width: 32, height: 32, minX: 3200, maxX: 3450, speed: 3,   direction: 1,  alive: true },
      { x: 3500, y: 268, width: 32, height: 32, minX: 3450, maxX: 3700, speed: 2.5, direction: -1, alive: true },
      { x: 4250, y: 268, width: 32, height: 32, minX: 4200, maxX: 4450, speed: 3.5, direction: 1,  alive: true },
      { x: 4500, y: 268, width: 32, height: 32, minX: 4450, maxX: 4700, speed: 3,   direction: -1, alive: true },
      { x: 4750, y: 268, width: 32, height: 32, minX: 4700, maxX: 4900, speed: 4,   direction: 1,  alive: true }
    ],
    goal: { x: 4850, y: 240, width: 30, height: 120 }
  }
];

let currentLevelIndex = 0;
let worldWidth, platforms, enemies, goal, clouds, hills;
let cameraX = 0;

function loadLevel(index) {
  const level = levels[index];
  worldWidth = level.worldWidth;
  platforms = level.platforms.map(p => ({ ...p }));
  enemies = level.enemies.map(e => ({ ...e }));
  goal = { ...level.goal };

  const scenery = generateScenery(worldWidth);
  clouds = scenery.clouds;
  hills = scenery.hills;

  player.x = 100;
  player.y = 100;
  player.velocityX = 0;
  player.velocityY = 0;
  player.isJumping = false;
  cameraX = 0;
}

function resetPlayer() {
  playSound(sounds.hurt);
  player.x = 100;
  player.y = 100;
  player.velocityX = 0;
  player.velocityY = 0;
}

// ============================================
// تحديث الأعداء
// ============================================
function updateEnemies() {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    enemy.x += enemy.speed * enemy.direction;

    if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) {
      enemy.direction *= -1;
    }
  }
}

function checkEnemyCollisions() {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    const touchesX = player.x + player.width > enemy.x && player.x < enemy.x + enemy.width;
    const touchesY = player.y + player.height > enemy.y && player.y < enemy.y + enemy.height;

    if (touchesX && touchesY) {
      const playerBottom = player.y + player.height;
      const stompedFromAbove = player.velocityY > 0 && playerBottom - player.velocityY <= enemy.y + 10;

      if (stompedFromAbove) {
        enemy.alive = false;
        player.velocityY = -10;
        playSound(sounds.stomp);
      } else {
        resetPlayer();
      }
    }
  }
}

function checkGoal() {
  const touchesX = player.x + player.width > goal.x && player.x < goal.x + goal.width;
  const touchesY = player.y + player.height > goal.y && player.y < goal.y + goal.height;

  if (touchesX && touchesY) {
    if (currentLevelIndex < levels.length - 1) {
      playSound(sounds.levelComplete);
      currentLevelIndex++;
      loadLevel(currentLevelIndex);
    } else {
      playSound(sounds.win);
      alert('خلصت كل المستويات! 🎉');
      currentLevelIndex = 0;
      loadLevel(0);
    }
  }
}

// ============================================
// التحديث الرئيسي
// ============================================
function update() {
  const speed = 5;
  if (keys.right) player.velocityX = speed;
  else if (keys.left) player.velocityX = -speed;
  else player.velocityX = 0;

  if (player.velocityX !== 0) {
    walkCycle += 0.3;
  } else {
    walkCycle = 0;
  }

  player.velocityY += gravity;
  player.y += player.velocityY;
  player.x += player.velocityX;

  player.isJumping = true;

  for (const platform of platforms) {
    const isFalling = player.velocityY >= 0;
    const wasAbove = (player.y + player.height - player.velocityY) <= platform.y;

    const touchesX = player.x + player.width > platform.x && player.x < platform.x + platform.width;
    const touchesY = player.y + player.height >= platform.y && player.y + player.height <= platform.y + platform.height;

    if (isFalling && wasAbove && touchesX && touchesY) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.isJumping = false;
    }
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > worldWidth) player.x = worldWidth - player.width;

  updateEnemies();
  checkEnemyCollisions();
  checkGoal();

  cameraX = player.x - canvas.width / 3;
  if (cameraX < 0) cameraX = 0;
  if (cameraX > worldWidth - canvas.width) cameraX = worldWidth - canvas.width;
}

// ============================================
// الرسم
// ============================================
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87ceeb');
  gradient.addColorStop(1, '#e0f6ff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#a8d8a0';
  for (const hill of hills) {
    const hx = hill.x - cameraX * 0.4;
    if (hx > -hill.size && hx < canvas.width + hill.size) {
      ctx.beginPath();
      ctx.arc(hx, hill.y, hill.size, Math.PI, 0);
      ctx.fill();
    }
  }

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (const cloud of clouds) {
    const cx = cloud.x - cameraX * 0.2;
    if (cx > -cloud.size && cx < canvas.width + cloud.size) {
      ctx.beginPath();
      ctx.arc(cx, cloud.y, cloud.size * 0.5, 0, Math.PI * 2);
      ctx.arc(cx + cloud.size * 0.4, cloud.y + 5, cloud.size * 0.4, 0, Math.PI * 2);
      ctx.arc(cx - cloud.size * 0.4, cloud.y + 5, cloud.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawPlatforms() {
  for (const platform of platforms) {
    const px = platform.x - cameraX;

    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(px + 3, platform.y + 3, platform.width, platform.height);

    if (platform.type === 'ground') ctx.fillStyle = '#5a3921';
    else if (platform.type === 'small') ctx.fillStyle = '#8b6f47';
    else ctx.fillStyle = '#6b4a2e';
    ctx.fillRect(px, platform.y, platform.width, platform.height);

    ctx.fillStyle = '#5fae4a';
    ctx.fillRect(px, platform.y, platform.width, 6);

    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(px, platform.y, platform.width, platform.height);
  }
}

function drawPlayer() {
  const px = player.x - cameraX;
  const py = player.y;
  const legOffset = Math.sin(walkCycle) * 6;

  ctx.fillStyle = '#8b2020';
  ctx.fillRect(px + 6, py + player.height, 8, 8 + legOffset);
  ctx.fillRect(px + 26, py + player.height, 8, 8 - legOffset);

  ctx.fillStyle = '#e63946';
  ctx.fillRect(px, py, player.width, player.height);

  ctx.fillStyle = 'white';
  ctx.fillRect(px + 6, py + 8, 8, 8);
  ctx.fillRect(px + 24, py + 8, 8, 8);
  ctx.fillStyle = 'black';
  ctx.fillRect(px + 9, py + 11, 4, 4);
  ctx.fillRect(px + 27, py + 11, 4, 4);

  ctx.fillStyle = '#c1121f';
  ctx.fillRect(px - 2, py - 6, player.width + 4, 8);
}

function drawEnemies() {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    const ex = enemy.x - cameraX;

    ctx.fillStyle = '#6a2c70';
    ctx.beginPath();
    ctx.ellipse(ex + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, enemy.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.fillRect(ex + 6, enemy.y + 8, 6, 6);
    ctx.fillRect(ex + 20, enemy.y + 8, 6, 6);
    ctx.fillStyle = 'black';
    ctx.fillRect(ex + 8, enemy.y + 10, 3, 3);
    ctx.fillRect(ex + 22, enemy.y + 10, 3, 3);
  }
}

function drawGoal() {
  const gx = goal.x - cameraX;
  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(gx, goal.y, 6, goal.height);
  ctx.fillStyle = '#2ecc71';
  ctx.beginPath();
  ctx.moveTo(gx + 6, goal.y);
  ctx.lineTo(gx + 36, goal.y + 15);
  ctx.lineTo(gx + 6, goal.y + 30);
  ctx.fill();
}

function draw() {
  drawBackground();
  drawPlatforms();
  drawPlayer();
  drawEnemies();
  drawGoal();
}

// ============================================
// حلقة اللعبة
// ============================================
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

loadLevel(currentLevelIndex);
gameLoop();