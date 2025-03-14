

function initializePingPong() {

	const ball = document.getElementById('ball');
    const paddle1 = document.getElementById('paddle1');
    const paddle2 = document.getElementById('paddle2');
    
    // Set paddle orientations explicitly
    paddle1.style.left = '';
    paddle1.style.right = '';
    paddle1.style.top = '0';
    paddle1.style.width = '100px';
    paddle1.style.height = '20px';
    
    paddle2.style.left = '';
    paddle2.style.right = '';
    paddle2.style.bottom = '0';
    paddle2.style.width = '100px';
    paddle2.style.height = '20px';
    
    // Set ball initial position
    ball.style.left = '50%';
    ball.style.top = '50%';
    ball.style.transform = 'translate(-50%, -50%)';



    // Game elements

    const startButton = document.getElementById('startButton');
    const container = document.getElementById('pong-game-container');
    const player1ScoreElement = document.getElementById('player1Score');
    const player2ScoreElement = document.getElementById('player2Score');

    // Game state




	const BALL_SPEED = 3; // Constant ball speed
	let ballSpeedX = BALL_SPEED;
	let ballSpeedY = BALL_SPEED;
	const paddleSpeed = 10;
    let player1Score = 0;
    let player2Score = 0;
    let gameInterval;
    let isGameRunning = false;




    // Paddle positions
    let paddle1Position = container.offsetWidth / 2 - paddle1.offsetWidth / 2;
    let paddle2Position = container.offsetWidth / 2 - paddle2.offsetWidth / 2;
    let keys = {};

    // Event Listeners
    document.addEventListener('keydown', (e) => (keys[e.key.toLowerCase()] = true));
    document.addEventListener('keyup', (e) => (keys[e.key.toLowerCase()] = false));
    startButton.addEventListener('click', startGame);

    function startGame() {
        if (isGameRunning) {
			// Stop the current game
			clearInterval(gameInterval);
		}
        
        isGameRunning = true;
        resetGame();
        gameInterval = setInterval(updateGame, 16); // ~60fps
        startButton.textContent = 'Restart Game';
    }

    function resetGame() {
        // Reset scores
        player1Score = 0;
        player2Score = 0;
        updateScores();

        // Reset paddle positions
        paddle1Position = container.offsetWidth / 2 - paddle1.offsetWidth / 2;
        paddle2Position = container.offsetWidth / 2 - paddle2.offsetWidth / 2;
        paddle1.style.left = `${paddle1Position}px`;
        paddle2.style.left = `${paddle2Position}px`;

        // Reset ball
        resetBall();
    }

    function resetBall() {
        const containerRect = container.getBoundingClientRect();
        ball.style.left = `${containerRect.width / 2 - ball.offsetWidth / 2}px`;
        ball.style.top = `${containerRect.height / 2 - ball.offsetHeight / 2}px`;
        ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
    }

    function updateGame() {
        movePaddles();
        moveBall();
        checkCollisions();
    }

    function movePaddles() {
        // Player 1 controls (WASD)
        if (keys['a'] && paddle1Position > 0) {
            paddle1Position -= paddleSpeed;
        }
        if (keys['d'] && paddle1Position < container.offsetWidth - paddle1.offsetWidth) {
            paddle1Position += paddleSpeed;
        }

        // Player 2 controls (Arrow keys)
        if (keys['arrowleft'] && paddle2Position > 0) {
            paddle2Position -= paddleSpeed;
        }
        if (keys['arrowright'] && paddle2Position < container.offsetWidth - paddle2.offsetWidth) {
            paddle2Position += paddleSpeed;
        }

        // Update paddle positions
        paddle1.style.left = `${paddle1Position}px`;
        paddle2.style.left = `${paddle2Position}px`;
    }

    // Add these variables to your game state
let isScoring = false;

// function moveBall() {
// 	if (isScoring) return;

// 	const ballRect = ball.getBoundingClientRect();
// 	const containerRect = container.getBoundingClientRect();

// 	let currentLeft = parseFloat(ball.style.left) || containerRect.width / 2;
// 	let currentTop = parseFloat(ball.style.top) || containerRect.height / 2;

// 	// Update position
// 	currentLeft += ballSpeedX;
// 	currentTop += ballSpeedY;

// 	// Wall collisions
// 	if (currentLeft <= 0) {
// 		currentLeft = 0;
// 		ballSpeedX = BALL_SPEED; // Reverse direction with constant speed
// 	}
// 	// if (currentLeft + ballRect.width >= containerRect.width) {
// 	// 	currentLeft = containerRect.width - ballRect.width;
// 	// 	ballSpeedX = -BALL_SPEED; // Reverse direction with constant speed
// 	// }


// 	if (currentLeft + ball.offsetWidth >= containerRect.width) {
//         // Fix for right wall collision
//         currentLeft = containerRect.width - ball.offsetWidth;
//         ballSpeedX = -BALL_SPEED; // Force negative X speed (leftward)
//     }



// 	// Scoring
// 	if (currentTop <= 0) {
// 		if (!isScoring) {
// 			isScoring = true;
// 			player2Score++;
// 			updateScores();
// 			setTimeout(() => {
// 				resetBall();
// 				checkWinner();
// 				isScoring = false;
// 			}, 1000);
// 		}
// 		return;
// 	}
// 	if (currentTop + ballRect.height >= containerRect.height) {
// 		if (!isScoring) {
// 			isScoring = true;
// 			player1Score++;
// 			updateScores();
// 			setTimeout(() => {
// 				resetBall();
// 				checkWinner();
// 				isScoring = false;
// 			}, 1000);
// 		}
// 		return;
// 	}

// 	// Move ball
// 	ball.style.left = `${currentLeft}px`;
// 	ball.style.top = `${currentTop}px`;
// }









function moveBall() {
    if (isScoring) return;

    const ballRect = ball.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Add debug logging to see what's happening
    // console.log("Ball position:", ball.style.left, ball.style.top);
    // console.log("Ball speed:", ballSpeedX, ballSpeedY);
    
    // Get current position using more accurate position calculation
    let currentLeft = ball.offsetLeft;
    let currentTop = ball.offsetTop;

    // Update position
    currentLeft += ballSpeedX;
    currentTop += ballSpeedY;

    // Wall collisions - Fixed version with explicit boundary checks
    if (currentLeft <= 0) {
        // Left wall collision
        currentLeft = 0; 
        ballSpeedX = Math.abs(BALL_SPEED); // Force rightward direction
    } else if (currentLeft + ball.offsetWidth >= container.offsetWidth) {
        // Right wall collision
        currentLeft = container.offsetWidth - ball.offsetWidth;
        ballSpeedX = -Math.abs(BALL_SPEED); // Force leftward direction
    }

    // Scoring - only reset for top/bottom, not left/right
    if (currentTop <= 0) {
        if (!isScoring) {
            isScoring = true;
            player2Score++;
            updateScores();
            setTimeout(() => {
                resetBall();
                checkWinner();
                isScoring = false;
            }, 1000);
        }
        return;
    }
    
    if (currentTop + ball.offsetHeight >= container.offsetHeight) {
        if (!isScoring) {
            isScoring = true;
            player1Score++;
            updateScores();
            setTimeout(() => {
                resetBall();
                checkWinner();
                isScoring = false;
            }, 1000);
        }
        return;
    }

    // Move ball - use direct offset properties for more consistent positioning
    ball.style.left = `${currentLeft}px`;
    ball.style.top = `${currentTop}px`;
}









function calculateDeflection(ballRect, paddleRect) {
	const ballCenter = ballRect.left + ballRect.width / 2;
	const paddleCenter = paddleRect.left + paddleRect.width / 2;
	const maxDeflection = BALL_SPEED; // Use constant speed for max deflection
	const difference = (ballCenter - paddleCenter) / (paddleRect.width / 2);
	return difference * maxDeflection;
}

function resetBall() {
	const containerRect = container.getBoundingClientRect();
	ball.style.left = `${containerRect.width / 2 - ball.offsetWidth / 2}px`;
	ball.style.top = `${containerRect.height / 2 - ball.offsetHeight / 2}px`;
	// Reset to constant speed with random direction
	ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
	ballSpeedY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}



function checkWinner() {
    const winningScore = 5; // Set the winning score to 5
    if (player1Score >= winningScore || player2Score >= winningScore) {
        const winner = player1Score > player2Score ? "Player 1" : "Player 2";
        alert(`Game Over! ${winner} wins!`);
        isGameRunning = false;
        clearInterval(gameInterval);
        startButton.textContent = 'Start New Game';
    }
}



function checkCollisions() {
	const ballRect = ball.getBoundingClientRect();
	const paddle1Rect = paddle1.getBoundingClientRect();
	const paddle2Rect = paddle2.getBoundingClientRect();

	// Paddle 1 collision
	if (ballRect.left < paddle1Rect.right &&
		ballRect.right > paddle1Rect.left &&
		ballRect.top < paddle1Rect.bottom &&
		ballRect.bottom > paddle1Rect.top) {
		// Keep constant speed, only change direction
		ballSpeedY = BALL_SPEED;
		// Calculate horizontal deflection but maintain constant speed
		const deflection = calculateDeflection(ballRect, paddle1Rect);
		ballSpeedX = Math.min(Math.max(deflection, -BALL_SPEED), BALL_SPEED);
	}

	// Paddle 2 collision
	if (ballRect.left < paddle2Rect.right &&
		ballRect.right > paddle2Rect.left &&
		ballRect.bottom > paddle2Rect.top &&
		ballRect.top < paddle2Rect.bottom) {
		// Keep constant speed, only change direction
		ballSpeedY = -BALL_SPEED;
		// Calculate horizontal deflection but maintain constant speed
		const deflection = calculateDeflection(ballRect, paddle2Rect);
		ballSpeedX = Math.min(Math.max(deflection, -BALL_SPEED), BALL_SPEED);
	}
}


    function updateScores() {
        player1ScoreElement.textContent = `Player 1: ${player1Score}`;
        player2ScoreElement.textContent = `Player 2: ${player2Score}`;
    }



    // Initialize paddle positions
    paddle1.style.left = `${paddle1Position}px`;
    paddle2.style.left = `${paddle2Position}px`;
}