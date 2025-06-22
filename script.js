// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// --- Simple Endless Runner Game: BucketHead ---
// This code is beginner-friendly and uses only the DOM (no libraries or Canvas)

// Get references to game elements
const gameArea = document.getElementById('game-area');
const buckethead = document.getElementById('buckethead');
const ground = document.getElementById('ground');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');

// Game variables
let isJumping = false;
let jumpHeight = 80; // How high BucketHead jumps (in px)
let jumpSpeed = 4;   // How fast BucketHead jumps
let gravity = 3;     // How fast BucketHead falls
let bucketY = 0;     // Current jump offset
let score = 0;
let lives = 3;
let gameOver = false;
let obstacles = [];
let obstacleSpeed = 3;
let obstacleInterval = 1500; // ms between obstacles

// Set how high above the ground BucketHead stands (lower value = closer to ground)
const bucketBase = 20; // px

// Helper: Update score and lives on screen
function updateUI() {
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
}

// Helper: Increase game speed every 10 points
function maybeIncreaseSpeed() {
    if (score > 0 && score % 10 === 0) {
        // Increase obstacle speed
        obstacleSpeed += 1;
        // Decrease interval, but not below 500ms
        obstacleInterval = Math.max(500, obstacleInterval - 150);
        // Optional: Show a message or effect to indicate speed up
        // console.log('Game speed increased!');
    }
}

// Make BucketHead jump
function jump() {
    if (!isJumping && !gameOver) {
        isJumping = true;
        let upInterval = setInterval(() => {
            if (bucketY < jumpHeight) {
                bucketY += jumpSpeed;
                // Set BucketHead's position: base + jump offset
                buckethead.style.bottom = `${bucketBase + bucketY}px`;
            } else {
                clearInterval(upInterval);
                // Fall down
                let downInterval = setInterval(() => {
                    if (bucketY > 0) {
                        bucketY -= gravity;
                        buckethead.style.bottom = `${bucketBase + bucketY}px`;
                    } else {
                        clearInterval(downInterval);
                        isJumping = false;
                        bucketY = 0;
                        buckethead.style.bottom = `${bucketBase}px`;
                    }
                }, 16);
            }
        }, 16);
    }
}

// Listen for spacebar to jump
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

// Listen for tap/touch on the game area to jump (for mobile)
gameArea.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Prevent scrolling
    jump();
});

// Create obstacles (spikes or holes)
function createObstacle() {
    if (gameOver) return;
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    // Randomly choose spike or hole
    if (Math.random() < 0.6) {
        obstacle.classList.add('spike');
    } else {
        obstacle.classList.add('hole');
    }
    // Start at right edge
    obstacle.style.left = '500px';
    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

// Move obstacles and check for collisions
function moveObstacles() {
    obstacles.forEach((obstacle, i) => {
        let left = parseInt(obstacle.style.left);
        left -= obstacleSpeed;
        obstacle.style.left = `${left}px`;

        // Remove if off screen
        if (left < -40) {
            obstacle.remove();
            obstacles.splice(i, 1);
            score++;
            updateUI();
            maybeIncreaseSpeed(); // Check if we should speed up
        } else {
            // Collision detection
            const bucketRect = buckethead.getBoundingClientRect();
            const obsRect = obstacle.getBoundingClientRect();
            // Check overlap (simple)
            if (
                obsRect.left < bucketRect.right - 10 &&
                obsRect.right > bucketRect.left + 10 &&
                obsRect.bottom > bucketRect.top + 10 &&
                obsRect.top < bucketRect.bottom - 10
            ) {
                // Only count collision if BucketHead is on ground (for spikes)
                if (
                    obstacle.classList.contains('spike') &&
                    bucketY < 10
                ) {
                    loseLife(obstacle);
                }
                // For holes, only if BucketHead is on ground
                if (
                    obstacle.classList.contains('hole') &&
                    bucketY < 10
                ) {
                    loseLife(obstacle);
                }
            }
        }
    });
}

// Lose a life and check for game over
function loseLife(obstacle) {
    if (!gameOver) {
        lives--;
        updateUI();
        obstacle.remove();
        // Remove from array
        obstacles = obstacles.filter(o => o !== obstacle);
        if (lives <= 0) {
            endGame();
        }
    }
}

// End the game
function endGame() {
    gameOver = true;
    const msg = document.createElement('div');
    msg.textContent = 'Game Over! Press F5 to restart.';
    msg.style.position = 'absolute';
    msg.style.top = '120px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.background = '#FFC907';
    msg.style.color = '#222';
    msg.style.padding = '16px 32px';
    msg.style.fontSize = '1.5em';
    msg.style.borderRadius = '8px';
    msg.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    gameArea.appendChild(msg);
}

// Main game loop
function gameLoop() {
    if (!gameOver) {
        moveObstacles();
        requestAnimationFrame(gameLoop);
    }
}

// Start creating obstacles at intervals
function startObstacles() {
    createObstacle();
    if (!gameOver) {
        setTimeout(startObstacles, obstacleInterval);
    }
}

// Set BucketHead's initial position at the start
buckethead.style.bottom = `${bucketBase}px`;

// Start the game
updateUI();
gameLoop();
startObstacles();

// --- End of game code ---
