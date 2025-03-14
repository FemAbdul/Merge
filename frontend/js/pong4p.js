
function initializePingPong4p() {
    const ball = document.getElementById('ball');
    const paddle1 = document.getElementById('paddle1');
    const paddle2 = document.getElementById('paddle2');
    const paddle3 = document.getElementById('paddle3');
    const paddle4 = document.getElementById('paddle4');
    const container = document.getElementById('pong-game-container');
    const scoreElements = {
        player1: document.getElementById('player1Score'),
        player2: document.getElementById('player2Score'),
        player3: document.getElementById('player3Score'),
        player4: document.getElementById('player4Score')
    };
    const startButton = document.getElementById('startButton');

    let scores = {
        player1: 0,
        player2: 0,
        player3: 0,
        player4: 0
    };

    const BALL_SPEED = 5;
    let ballX = container.offsetWidth / 2;
    let ballY = container.offsetHeight / 2;
    let ballSpeedX = BALL_SPEED;
    let ballSpeedY = BALL_SPEED;

    const paddleSpeed = 10;
    let isGameRunning = false;
    let gameInterval;
    let keys = {};

    // Paddle positions
    let positions = {
        paddle1: container.offsetWidth / 2 - paddle1.offsetWidth / 2,
        paddle2: container.offsetWidth / 2 - paddle2.offsetWidth / 2,
        paddle3: container.offsetHeight / 2 - paddle3.offsetHeight / 2,
        paddle4: container.offsetHeight / 2 - paddle4.offsetHeight / 2
    };

    // Event listeners for keyboard controls
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        // Prevent scrolling with arrow keys
        if(['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    });
    document.addEventListener('keyup', (e) => (keys[e.key.toLowerCase()] = false));
    startButton.addEventListener('click', startGame);

    function startGame() {
        if (isGameRunning) return;
        isGameRunning = true;
        resetGame();
        gameInterval = setInterval(updateGame, 16); // ~60fps
        startButton.textContent = 'Restart Game';
    }

    function resetGame() {
        scores = { player1: 0, player2: 0, player3: 0, player4: 0 };
        updateScores();
        resetPaddles();
        resetBall();
    }

    function resetPaddles() {
        positions = {
            paddle1: container.offsetWidth / 2 - paddle1.offsetWidth / 2,
            paddle2: container.offsetWidth / 2 - paddle2.offsetWidth / 2,
            paddle3: container.offsetHeight / 2 - paddle3.offsetHeight / 2,
            paddle4: container.offsetHeight / 2 - paddle4.offsetHeight / 2
        };
        updatePaddlePositions();
    }

    function updatePaddlePositions() {
        paddle1.style.left = `${positions.paddle1}px`;
        paddle2.style.left = `${positions.paddle2}px`;
        paddle3.style.top = `${positions.paddle3}px`;
        paddle4.style.top = `${positions.paddle4}px`;
    }

    function movePaddles() {
        // Player 1 (top)
        if (keys['a'] && positions.paddle1 > 0) {
            positions.paddle1 -= paddleSpeed;
        }
        if (keys['d'] && positions.paddle1 < container.offsetWidth - paddle1.offsetWidth) {
            positions.paddle1 += paddleSpeed;
        }

        // Player 2 (bottom)
        if (keys['arrowleft'] && positions.paddle2 > 0) {
            positions.paddle2 -= paddleSpeed;
        }
        if (keys['arrowright'] && positions.paddle2 < container.offsetWidth - paddle2.offsetWidth) {
            positions.paddle2 += paddleSpeed;
        }

        // Player 3 (left)
        if (keys['w'] && positions.paddle3 > 0) {
            positions.paddle3 -= paddleSpeed;
        }
        if (keys['s'] && positions.paddle3 < container.offsetHeight - paddle3.offsetHeight) {
            positions.paddle3 += paddleSpeed;
        }

        // Player 4 (right)
        if (keys['i'] && positions.paddle4 > 0) {
            positions.paddle4 -= paddleSpeed;
        }
        if (keys['k'] && positions.paddle4 < container.offsetHeight - paddle4.offsetHeight) {
            positions.paddle4 += paddleSpeed;
        }

        updatePaddlePositions();
    }

    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    }

    function checkCollisions() {
        const ballSize = 20;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Top paddle (Player 1)
        if (ballY <= 20 + ballSize && 
            ballX >= positions.paddle1 && 
            ballX <= positions.paddle1 + paddle1.offsetWidth) {
            ballY = 40;
            ballSpeedY = Math.abs(ballSpeedY);
            addRandomness();
        }
    
        // Bottom paddle (Player 2)
        if (ballY >= containerHeight - 40 && 
            ballX >= positions.paddle2 && 
            ballX <= positions.paddle2 + paddle2.offsetWidth) {
            ballY = containerHeight - 40;
            ballSpeedY = -Math.abs(ballSpeedY);
            addRandomness();
        }
    
        // Left paddle (Player 3)
        if (ballX <= 20 + ballSize && 
            ballY >= positions.paddle3 && 
            ballY <= positions.paddle3 + paddle3.offsetHeight) {
            ballX = 40;
            ballSpeedX = Math.abs(ballSpeedX);
            addRandomness();
        }
    
        // Right paddle (Player 4)
        if (ballX >= containerWidth - 40 && 
            ballY >= positions.paddle4 && 
            ballY <= positions.paddle4 + paddle4.offsetHeight) {
            ballX = containerWidth - 40;
            ballSpeedX = -Math.abs(ballSpeedX);
            addRandomness();
        }
    
        // Ensure ball touches all walls before scoring
        if (ballY <= 0 || ballY >= containerHeight || ballX <= 0 || ballX >= containerWidth) {
            addRandomness();
        }
    }
    
    function addRandomness() {
        // Add slight randomness to ball direction after paddle hits
        ballSpeedX += (Math.random() - 0.5) * 2;
        ballSpeedY += (Math.random() - 0.5) * 2;
        
        // Normalize speed
        const speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
        ballSpeedX = (ballSpeedX / speed) * BALL_SPEED;
        ballSpeedY = (ballSpeedY / speed) * BALL_SPEED;
    }

    function checkScoring() {
        const scored = {
            top: ballY <= 0,
            bottom: ballY >= container.offsetHeight,
            left: ballX <= 0,
            right: ballX >= container.offsetWidth
        };

        if (scored.top) { // Player 1 misses
            scores.player2++;
            scores.player3++;
            scores.player4++;
        }
        if (scored.bottom) { // Player 2 misses
            scores.player1++;
            scores.player3++;
            scores.player4++;
        }
        if (scored.left) { // Player 3 misses
            scores.player1++;
            scores.player2++;
            scores.player4++;
        }
        if (scored.right) { // Player 4 misses
            scores.player1++;
            scores.player2++;
            scores.player3++;
        }

        if (scored.top || scored.bottom || scored.left || scored.right) {
            resetBall();
            updateScores();
            checkWinCondition();
        }
    }

    function updateScores() {
        for (let player in scoreElements) {
            scoreElements[player].textContent = `${player.charAt(0).toUpperCase() + player.slice(1)}: ${scores[player]}`;
        }
    }

    function resetBall() {
        ballX = container.offsetWidth / 2;
        ballY = container.offsetHeight / 2;
        const angle = Math.random() * Math.PI * 2;
        ballSpeedX = BALL_SPEED * Math.cos(angle);
        ballSpeedY = BALL_SPEED * Math.sin(angle);
    }

    function updatePositions() {
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;
    }

    function updateGame() {
        if (!isGameRunning) return;
        movePaddles();
        moveBall();
        checkCollisions();
        checkScoring();
        updatePositions();
    }

    function checkWinCondition() {
        const winScore = 5;
        for (let player in scores) {
            if (scores[player] >= winScore) {
                endGame(`${player.charAt(0).toUpperCase() + player.slice(1)} wins!`);
                return;
            }
        }
    }

    function endGame(message) {
        isGameRunning = false;
        clearInterval(gameInterval);
        alert(message);
        startButton.textContent = 'Start Game';
    }

    // Start game automatically
    startGame();
}
