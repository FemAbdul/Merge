function initializePingPong3p() {
    const ball = document.getElementById('ball');
    const paddle1 = document.getElementById('paddle1');
    const paddle2 = document.getElementById('paddle2');
    const paddle3 = document.getElementById('paddle3');
    const container = document.getElementById('pong-game-container');
    const player1ScoreElement = document.getElementById('player1Score');
    const player2ScoreElement = document.getElementById('player2Score');
    const player3ScoreElement = document.getElementById('player3Score');
    const startButton = document.getElementById('startButton');

    let player1Score = 0;
    let player2Score = 0;
    let player3Score = 0;

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
    let paddle1Position = container.offsetWidth / 2 - paddle1.offsetWidth / 2;
    let paddle2Position = container.offsetWidth / 2 - paddle2.offsetWidth / 2;
    let paddle3Position = container.offsetHeight / 2 - paddle3.offsetHeight / 2;

    document.addEventListener('keydown', (e) => (keys[e.key.toLowerCase()] = true));
    document.addEventListener('keyup', (e) => (keys[e.key.toLowerCase()] = false));

    startButton.addEventListener('click', startGame);

    function startGame() {
        if (isGameRunning) return;
        isGameRunning = true;
        resetGame();
        gameInterval = setInterval(updateGame, 16);
        startButton.textContent = 'Restart Game';
    }

    function resetGame() {
        player1Score = player2Score = player3Score = 0;
        updateScores();
        resetPaddles();
        resetBall();
    }

    function resetPaddles() {
        paddle1Position = container.offsetWidth / 2 - paddle1.offsetWidth / 2;
        paddle2Position = container.offsetWidth / 2 - paddle2.offsetWidth / 2;
        paddle3Position = container.offsetHeight / 2 - paddle3.offsetHeight / 2;
        updatePaddlePositions();
    }

    function resetBall() {
        ballX = container.offsetWidth / 2;
        ballY = container.offsetHeight / 2;
        const angle = Math.random() * Math.PI * 2;
        ballSpeedX = BALL_SPEED * Math.cos(angle);
        ballSpeedY = BALL_SPEED * Math.sin(angle);
    }

    function updateGame() {
        if (!isGameRunning) return;
        movePaddles();
        moveBall();
        checkCollisions();
        checkScoring();
        updatePositions();
    }

    function movePaddles() {
        // Player 1 (top) movement
        if (keys['a'] && paddle1Position > 0) {
            paddle1Position -= paddleSpeed;
        }
        if (keys['d'] && paddle1Position < container.offsetWidth - paddle1.offsetWidth) {
            paddle1Position += paddleSpeed;
        }

        // Player 2 (bottom) movement
        if (keys['arrowleft'] && paddle2Position > 0) {
            paddle2Position -= paddleSpeed;
        }
        if (keys['arrowright'] && paddle2Position < container.offsetWidth - paddle2.offsetWidth) {
            paddle2Position += paddleSpeed;
        }

        // Player 3 (left) movement
        if (keys['w'] && paddle3Position > 0) {
            paddle3Position -= paddleSpeed;
        }
        if (keys['s'] && paddle3Position < container.offsetHeight - paddle3.offsetHeight) {
            paddle3Position += paddleSpeed;
        }

        updatePaddlePositions();
    }

    function updatePaddlePositions() {
        paddle1.style.left = `${paddle1Position}px`;
        paddle2.style.left = `${paddle2Position}px`;
        paddle3.style.top = `${paddle3Position}px`;
    }

    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    }

    function checkCollisions() {
		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;
		const ballSize = 20;
	
		// Top paddle (Player 1)
		if (ballY <= 20 + ballSize && 
			ballX >= paddle1Position && 
			ballX <= paddle1Position + paddle1.offsetWidth) {
			ballY = 40;
			ballSpeedY = Math.abs(ballSpeedY);
		}
	
		// Bottom paddle (Player 2)
		if (ballY >= containerHeight - 40 && 
			ballX >= paddle2Position && 
			ballX <= paddle2Position + paddle2.offsetWidth) {
			ballY = containerHeight - 40;
			ballSpeedY = -Math.abs(ballSpeedY);
		}
	
		// Left paddle (Player 3)
		if (ballX <= 20 + ballSize && 
			ballY >= paddle3Position && 
			ballY <= paddle3Position + paddle3.offsetHeight) {
			ballX = 40;
			ballSpeedX = Math.abs(ballSpeedX);
		}
	
		// Right wall collision (to make ball touch all walls)
		if (ballX >= containerWidth - ballSize) {
			ballSpeedX = -Math.abs(ballSpeedX);
		}
	
		// Add slight randomness to prevent predictable patterns
		if (ballY <= 0 || ballY >= containerHeight || ballX <= 0 || ballX >= containerWidth) {
			addRandomness();
		}
	}
	
	// Add this new function to add slight randomness to ball movement
	function addRandomness() {
		ballSpeedX += (Math.random() - 0.5);
		ballSpeedY += (Math.random() - 0.5);
		
		// Normalize speed to maintain consistent ball velocity
		const speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
		ballSpeedX = (ballSpeedX / speed) * BALL_SPEED;
		ballSpeedY = (ballSpeedY / speed) * BALL_SPEED;
	}

	

    function checkScoring() {
        if (ballY <= 0) { // Player 1 misses
            player2Score++;
            player3Score++;
            resetBall();
        } else if (ballY >= container.offsetHeight) { // Player 2 misses
            player1Score++;
            player3Score++;
            resetBall();
        } else if (ballX <= 0) { // Player 3 misses
            player1Score++;
            player2Score++;
            resetBall();
        }
        
        updateScores();
        checkWinCondition();
    }

    function updatePositions() {
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;
    }

    function updateScores() {
        player1ScoreElement.textContent = `Player 1: ${player1Score}`;
        player2ScoreElement.textContent = `Player 2: ${player2Score}`;
        player3ScoreElement.textContent = `Player 3: ${player3Score}`;
    }

    function checkWinCondition() {
        const winScore = 5;
        if (player1Score >= winScore || player2Score >= winScore || player3Score >= winScore) {
            let winner = player1Score >= winScore ? "Player 1" :
                        player2Score >= winScore ? "Player 2" : "Player 3";
            endGame(`${winner} wins!`);
        }
    }

    function endGame(message) {
        isGameRunning = false;
        clearInterval(gameInterval);
        alert(message);
        startButton.textContent = 'Start Game';
    }
}