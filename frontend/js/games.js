function showGames() {
    console.log("showGames() triggered");  // Debugging statement

    const content = document.getElementById('content');
    content.innerHTML = `
        <div id="game" class="page">
            <h2>Select a Game to Play</h2>
            <div class="game-buttons">
                <!-- Ping Pong Game Card -->
                <div class="game-card">
                    <img src="images/pong.png" alt="Ping Pong" class="game-icon">
                    <button class="game-button" onclick="startPingPong()">Play</button>
                </div>

                <!-- Tic-Tac-Toe Game Card -->
                <div class="game-card">
                    <img src="images/tictactoe.png" alt="Tic Tac Toe" class="game-icon">
                    <button class="game-button" onclick="startTicTacToe()">Play</button>
                </div>

				<!-- Rock Paper Scissors Game Card -->
                <div class="game-card">
                    <img src="images/rps.png" alt="Rock Paper Scissors" class="game-icon">
                    <button class="game-button" onclick="startRockPaperScissors()">Play</button>
                </div>

            </div>
        </div>`;
}


function startPingPong() {
	
    const content = document.getElementById('content');
    content.innerHTML = `
        <div id="pingPong" class="page">
            <h2>Choose Your Ping Pong Mode</h2>
            <button id="backButton" class="btn btn-secondary" onclick="showGames()">Back</button>
            <div class="game-options">
                <button class="game-option" onclick="startTraining()">Training</button>
                <button class="game-option" onclick="startSinglePlayer()">Single Player (CPU)</button>
                <button class="game-option" onclick="startMultiplayer()">Multiplayer (Local)</button>

				<button class="game-option" onclick="tournamentButtonClick()">Tournament</button>
            </div>
        </div>
    `;
    
    // Add styles for the game options buttons
    const pongOptionsStyle = document.createElement('style');
    pongOptionsStyle.textContent = `


        #pingPong {
            text-align: center;
            padding: 20px;
        }
        .game-options {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 30px;
        }
        .game-option {
            padding: 15px 30px;
            font-size: 18px;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        .game-option:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(pongOptionsStyle);
}



function startMultiplayer() {
    console.log("Multiplayer (Local) mode selected");

    // Add your multilocal mode logic here
    content.innerHTML = `
    <button id="backButton" class="btn btn-secondary" onclick="startPingPong()">Back</button>
    <div id="playerSelection">
        <h3>Select Number of Players</h3>
        <button onclick="startMultiplayerMode('twoPlayer')">2 Players</button>
        <button onclick="startMultiplayerMode('threePlayer')">3 Players</button>
        <button onclick="startMultiplayerMode('fourPlayer')">4 Players</button>
    </div>

    <style>
        #playerSelection {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            background: #000000;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        #playerSelection h3 {
            margin: 0 0 20px;
            font-size: 20px;
            font-weight: bold;
        }

        #playerSelection button {
            margin: 10px 0;
            padding: 12px 25px;
            font-size: 18px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
            background-color: #4CAF50;
            color: white;
            transition: background-color 0.3s;
        }

        #playerSelection button:hover {
            background-color: #45a049;
        }
    </style>
    `;
}

// Helper function to store the selected mode and reload
function startMultiplayerMode(mode) {
    // Store which mode was selected
    localStorage.setItem('selectedMode', mode);
    // Reload the page
    location.reload();
}

// Add this to your page initialization code (window.onload or similar)
function checkForSelectedMode() {
    const selectedMode = localStorage.getItem('selectedMode');
    if (selectedMode) {
        // Clear the stored value
        localStorage.setItem('selectedMode', '');
        
        // Navigate to the correct mode
        if (selectedMode === 'twoPlayer') {
            startTraining();
        } else if (selectedMode === 'threePlayer') {
            startThreePlayerMode();
        } else if (selectedMode === 'fourPlayer') {
            startFourPlayerMode();
        }
    }
}

// Make sure to call this function when the page loads
window.addEventListener('load', checkForSelectedMode);








window.addEventListener('load', function() {
    checkForSelectedMode();
});







function startSinglePlayer() {
    console.log("Single Player (CPU) mode selected");

    const content = document.getElementById('content');
    content.innerHTML = `
        <div id="pingPong" class="page">
            <div class="game-header">
                <button id="backButton" class="btn btn-secondary">Back</button>
                <div class="title-section">
                    <h2>Single Player (CPU) - 3D Ping Pong</h2>
                    <h3>Reach 5 points to win!</h3>
                </div>
            </div>
            <div id="gameContainer">
                <div id="scoreBoard">
                    <div class="score-item">
                        <span class="player-label">Player:</span>
                        <span id="playerScore" class="score">0</span>
                    </div>
                    <div class="score-item">
                        <span class="player-label">CPU:</span>
                        <span id="cpuScore" class="score">0</span>
                    </div>
                </div>
                <div id="gameCanvas"></div>
                <button id="startButton" class="btn btn-primary">Start Game</button>
                <div id="controls-help">
                    <p>Use ↑ Up and ↓ Down arrow keys to move your paddle</p>
                </div>
            </div>
        </div>
    `;

    // Add styles for 3D game container
    const pongStyle = document.createElement('style');
    pongStyle.textContent = `
        #pingPong {
            text-align: center;
            min-height: 100vh;
            background-color: #1a1a1a;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 20px;
        }

        .game-header {
            position: relative;
            margin-bottom: 20px;
        }

        .title-section {
            margin-bottom: 20px;
        }

        .title-section h2 {
            color: #ffffff;
            margin-bottom: 10px;
        }

        .title-section h3 {
            color: #4CAF50;
            margin: 0;
        }

        #gameContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
            margin: 0 auto;
            max-width: 1000px;
        }

        #gameCanvas {
            width: 800px;
            height: 500px;
            background-color: #000000;
            border: 3px solid #333333;
            border-radius: 8px;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
            margin: 20px 0;
        }

        #scoreBoard {
            display: flex;
            justify-content: center;
            gap: 50px;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 15px 40px;
            border-radius: 10px;
            margin-bottom: 20px;
        }

        .score-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .player-label {
            font-size: 24px;
            color: #ffffff;
        }

        .score {
            font-size: 32px;
            font-weight: bold;
            color: #4CAF50;
        }

        #controls-help {
            margin-top: 20px;
            color: #aaaaaa;
            font-size: 16px;
        }

        .btn {
            font-size: 18px;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background-color: #4CAF50;
            color: white;
        }

        .btn-primary:hover {
            background-color: #45a049;
            transform: translateY(-2px);
        }

        .btn-secondary {
            position: absolute;
            left: 20px;
            top: 20px;
            background-color: #666666;
            color: white;
        }

        .btn-secondary:hover {
            background-color: #555555;
        }

        @media (max-width: 850px) {
            #gameCanvas {
                width: 100%;
                height: auto;
                aspect-ratio: 16/10;
            }
        }
    `;
    document.head.appendChild(pongStyle);

    // Initialize game and setup cleanup
    const cleanup = initialize3DPingPong();

    // Back button handler with proper cleanup
    document.getElementById("backButton").addEventListener("click", () => {
        if (typeof cleanup === 'function') {
            cleanup();
        }
        startPingPong();
    });

    // Initialize scores
    document.getElementById("playerScore").textContent = "0";
    document.getElementById("cpuScore").textContent = "0";
}




function startTraining() {
    console.log("Training mode selected");
	const content = document.getElementById('content');
	    content.innerHTML = `
	        	<div id="pingPong" class="page">
							<h2>Two Player Ping Pong</h2>
							<h3>Reach 5 points to win!</h3>
	                        <button id="backButton" class="btn btn-secondary" onclick="startPingPong()">Back</button>
							<div class="scores">
								<div id="player1Score">Player 1: 0</div>
								<div id="player2Score">Player 2: 0</div>
							</div>
							<div id="pong-game-container">
								<div id="paddle1" class="paddle"></div>
								<div id="paddle2" class="paddle"></div>
								<div id="ball"></div>
							</div>
							<button id="startButton">Start Game</button>
							<div class="instructions">
								<p>Player 1 (Top): Use A and D keys to move</p>
								<p>Player 2 (Bottom): Use ← and → arrow keys to move</p>
							</div>
						</div>`;
				
					// Add the styles
					const pongStyle = document.createElement('style');
					pongStyle.textContent = `
						#pong-game-container {
							position: relative;
							width: 800px;
							height: 500px;
							border: 2px solid #333;
							overflow: hidden;
							background-color: #f0f0f0;
							margin: 20px auto;
						}
				
						.paddle {
							position: absolute;
							width: 100px;
							height: 20px;
							background-color: #4CAF50;
						}
				
						#paddle1 {
							top: 20px;
							left: 350px;
							background-color: #2196F3;
						}
				
						#paddle2 {
							bottom: 20px;
							left: 350px;
							background-color: #FF5722;
						}
				
						#ball {
							position: absolute;
							width: 20px;
							height: 20px;
							background-color: #333;
							border-radius: 50%;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						}
				
						#startButton {
							display: block;
							margin: 20px auto;
							padding: 10px 20px;
							font-size: 16px;
							cursor: pointer;
						}
				
						.scores {
							display: flex;
							justify-content: center;
							gap: 50px;
							margin: 20px;
							font-size: 24px;
						}
				
						.instructions {
							text-align: center;
							margin: 20px;
						}
					`;
					document.head.appendChild(pongStyle);
				
					// Initialize the game
					initializePingPong();


}

function startThreePlayerMode() {
    console.log("Three Player mode selected");

	const existingStyle = document.getElementById('pingPongStyle');
    if (existingStyle) {
        existingStyle.remove();
    }

    const content = document.getElementById('content');

    // Create the HTML structure for the game UI
    content.innerHTML = `
        <div id="pingPong" class="page">
            <h2>Three Player Ping Pong</h2>
            <h3>Reach 5 points to win!</h3>
            <button id="backButton" class="btn btn-secondary">Back</button>
            <div class="scores">
                <div id="player1Score">Player 1: 0</div>
                <div id="player2Score">Player 2: 0</div>
                <div id="player3Score">Player 3: 0</div>
            </div>
            <div id="pong-game-container">
                <div id="paddle1" class="paddle"></div>
                <div id="paddle2" class="paddle"></div>
                <div id="paddle3" class="paddle"></div>
                <div id="ball"></div>
            </div>
            <button id="startButton">Start Game</button>
            <div class="instructions">
                <p>Player 1 (Top): Use A and D keys to move</p>
                <p>Player 2 (Bottom): Use ← and → arrow keys to move</p>
                <p>Player 3 (Left): Use W and S keys to move</p>
            </div>
        </div>`;

    // Back button handler to go back to single-player mode
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        // Implement logic for switching back to the main game mode, e.g., single-player
        startPingPong();  // Assuming startPingPong() is the function to start the main game
    });

    // Styles for the game
    const pongStyle = document.getElementById('pingPongStyle');
    if (!pongStyle) {
        const newStyle = document.createElement('style');
        newStyle.id = 'pingPongStyle';
        newStyle.textContent = `
            #pong-game-container {
                position: relative;
                width: 800px;
                height: 500px;
                border: 2px solid #333;
                overflow: hidden;
                background-color: #f0f0f0;
                margin: 20px auto;
            }

            .paddle {
                position: absolute;
                width: 100px;
                height: 20px;
                background-color: #4CAF50;
            }

            #paddle1 {
                top: 0; /* Player 1 on the top */
                left: 350px;
                background-color: #2196F3;
            }

            #paddle2 {
                bottom: 0; /* Player 2 on the bottom */
                left: 350px;
                background-color: #FF5722;
            }

            #paddle3 {
                top: 230px; /* Player 3 on the left */
                left: 0;
                background-color: #FFC107;
                width: 20px; /* Make it thinner */
                height: 100px; /* Make it taller */
            }

            #ball {
                position: absolute;
                width: 20px;
                height: 20px;
                background-color: #333;
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            #startButton {
                display: block;
                margin: 20px auto;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
            }

            .scores {
                display: flex;
                justify-content: center;
                gap: 50px;
                margin: 20px;
                font-size: 24px;
            }

            .instructions {
                text-align: center;
                margin: 20px;
            }
        `;
        document.head.appendChild(newStyle);
    }

    // Initialize the game when the start button is clicked
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', initializePingPong3p);
}

function startFourPlayerMode() {
    console.log("Four Player mode selected");

	const existingStyle = document.getElementById('pingPongStyle');
    if (existingStyle) {
        existingStyle.remove();
    }

    const content = document.getElementById('content');

    // Create the HTML structure for the game UI
    content.innerHTML = `
        <div id="pingPong" class="page">
            <h2>Four Player Ping Pong</h2>
            <h3>Reach 5 points to win!</h3>
            <button id="backButton" class="btn btn-secondary" onclick="startPingPong()">Back</button>
            <div class="scores">
                <div id="player1Score">Player 1: 0</div>
                <div id="player2Score">Player 2: 0</div>
                <div id="player3Score">Player 3: 0</div>
                <div id="player4Score">Player 4: 0</div>
            </div>
            <div id="pong-game-container">
                <div id="paddle1" class="paddle horizontal-paddle"></div>
                <div id="paddle2" class="paddle horizontal-paddle"></div>
                <div id="paddle3" class="paddle vertical-paddle"></div>
                <div id="paddle4" class="paddle vertical-paddle"></div>
                <div id="ball"></div>
            </div>
            <button id="startButton">Start Game</button>
            <div class="instructions">
                <p>Player 1 (Top): Use A and D keys to move</p>
                <p>Player 2 (Bottom): Use ← and → arrow keys to move</p>
                <p>Player 3 (Left): Use W and S keys to move</p>
                <p>Player 4 (Right): Use I and K keys to move</p>
            </div>
        </div>`;

    // Add styles for the game
    const pongStyle = document.getElementById('pingPongStyle');
    if (!pongStyle) {
        const newStyle = document.createElement('style');
        newStyle.id = 'pingPongStyle';
        newStyle.textContent = `
            #pingPong {
                text-align: center;
                padding: 20px;
            }

            #pong-game-container {
                position: relative;
                width: 800px;
                height: 500px;
                border: 2px solid #333;
                overflow: hidden;
                background-color: #f0f0f0;
                margin: 20px auto;
            }

            .paddle {
                position: absolute;
                background-color: #4CAF50;
            }

            .horizontal-paddle {
                width: 100px;
                height: 20px;
            }

            .vertical-paddle {
                width: 20px;
                height: 100px;
            }

            #paddle1 {
                top: 0;
                left: 350px;
                background-color: #2196F3;
            }

            #paddle2 {
                bottom: 0;
                left: 350px;
                background-color: #FF5722;
            }

            #paddle3 {
                top: 200px;
                left: 0;
                background-color: #FFC107;
            }

            #paddle4 {
                top: 200px;
                right: 0;
                background-color: #9C27B0;
            }

            #ball {
                position: absolute;
                width: 20px;
                height: 20px;
                background-color: #333;
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            #startButton {
                display: block;
                margin: 20px auto;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
            }

            #startButton:hover {
                background-color: #45a049;
            }

            .scores {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin: 20px;
                font-size: 24px;
                flex-wrap: wrap;
            }

            .instructions {
                text-align: center;
                margin: 20px;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
            }

            .instructions p {
                margin: 5px 0;
                color: #333;
            }

            #backButton {
                margin: 10px;
                padding: 8px 16px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            #backButton:hover {
                background-color: #5a6268;
            }
        `;
        document.head.appendChild(newStyle);
    }

    // Initialize the game when the start button is clicked
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', initializePingPong4p);
}

// Function to clean up the game
function cleanupPingPong4p() {
    // Remove event listeners and clear intervals
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    if (gameInterval) {
        clearInterval(gameInterval);
    }
}




function startRockPaperScissors() {
	const content = document.getElementById('content');
	content.innerHTML = `
		<div id="rpsGame" class="page">
			<h2>Rock, Paper, Scissors</h2>
			<h3>Reach 7 points to win!</h3>
			<button id="backButton" class="btn btn-secondary" onclick="showGames()">Back</button>
			<div id="gameArea">
				<div class="choices">
					<button class="choiceButton" id="rock">Rock</button>
					<button class="choiceButton" id="paper">Paper</button>
					<button class="choiceButton" id="scissors">Scissors</button>
				</div>
				
				<!-- Display the computer's choice here -->
				<div id="computerChoice"></div>
				
				<div id="result"></div>
				<div id="score">
					<p>Player: <span id="playerScore">0</span></p>
					<p>Computer: <span id="computerScore">0</span></p>
				</div>
			</div>
		</div>`;
	
		// Add the styles for the game
		const rpsStyle = document.createElement('style');
		rpsStyle.textContent = `
			#rpsGame {
				text-align: center;
				padding: 20px;
			}
			.choices {
				margin: 20px;
			}
			.choiceButton {
				padding: 10px 20px;
				font-size: 18px;
				cursor: pointer;
				margin: 10px;
				background-color: #4CAF50;
				color: white;
				border: none;
				border-radius: 5px;
			}
			.choiceButton:hover {
				background-color: #45a049;
			}
			#computerChoice {
				font-size: 20px;
				margin: 20px;
			}
			#result {
				font-size: 24px;
				margin: 20px;
			}
			#score p {
				font-size: 20px;
			}
		`;
	document.head.appendChild(rpsStyle);
	
			

	initializeRPS();

}

