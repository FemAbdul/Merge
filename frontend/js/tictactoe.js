function startTicTacToe() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div id="TicTacToe" class="page">
            <h2>Choose Your Tic Tac Toe Mode</h2>
            <button id="backButton" class="btn btn-secondary" onclick="showGames()">Back</button>
            <div class="game-options">
                <button class="game-option" onclick="startSinglePlayerTic()">Single Player (CPU)</button>
                <button class="game-option" onclick="startMultiTic()">Multiplayer (Local)</button>
				<button class="game-option" onclick="startTournamentTic()">Tournament</button>
				
            </div>
        </div>
    `;
    
    // Add styles for the game options buttons
    const pongOptionsStyle = document.createElement('style');
    pongOptionsStyle.textContent = `


        #TicTacToe {
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

function startSinglePlayerTic() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div id="gameContainer">
            <h1>Player vs CPU</h1>
            <button id="backButton" class="btn btn-secondary" onclick="startTicTacToe()">Back</button>
            <table id="ticTacToeBoard">
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <button id="resetButton">Reset Game</button>
        </div>`;
    
    // Add the styles
    const style = document.createElement('style');
    style.textContent = `
        #gameContainer {
            text-align: center;
            padding: 20px;
        }

        #ticTacToeBoard {
            border-collapse: collapse;
            margin: 20px auto;
        }

        #ticTacToeBoard td {
            width: 100px;
            height: 100px;
            border: 2px solid #333;
            text-align: center;
            font-size: 2em;
            cursor: pointer;
            background-color: #fff;
        }

        #ticTacToeBoard td:hover {
            background-color: #f7f7f7;
        }

        #resetButton {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
        }
    `;
    document.head.appendChild(style);

    // Initialize the game immediately
    initializeSinglePlayerGame();
}

function initializeSinglePlayerGame() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))//addded by femi
    const board = document.getElementById('ticTacToeBoard');
    const cells = board.getElementsByTagName('td');
    const resetButton = document.getElementById('resetButton');
    const PLAYER = 'X';
    const CPU = 'O';
    let gameActive = true;

    // Clear any existing content and listeners
    Array.from(cells).forEach(cell => {
        cell.textContent = '';
        cell.onclick = handlePlayerMove;
    });

    function handlePlayerMove(e) {
        const cell = e.target;
        
        // Check if the cell is empty and game is active
        if (cell.textContent !== '' || !gameActive) {
            return;
        }

        // Player move
        makeMove(cell, PLAYER);

        // Check game state after player move
        if (checkGameState()) {
            return;
        }

        // CPU move
        setTimeout(makeCPUMove, 500);
    }

    function makeCPUMove() {
        if (!gameActive) return;

        // Get available cells
        const availableCells = Array.from(cells).filter(cell => cell.textContent === '');
        
        if (availableCells.length === 0) return;

        // First, check if CPU can win
        const winningMove = findWinningMove(CPU);
        if (winningMove !== null) {
            makeMove(cells[winningMove], CPU);
            checkGameState();
            return;
        }

        // Second, block player's winning move
        const blockingMove = findWinningMove(PLAYER);
        if (blockingMove !== null) {
            makeMove(cells[blockingMove], CPU);
            checkGameState();
            return;
        }

        // If no winning or blocking moves, try to take center
        if (cells[4].textContent === '') {
            makeMove(cells[4], CPU);
            checkGameState();
            return;
        }

        // Otherwise, make a random move
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        makeMove(availableCells[randomIndex], CPU);
        checkGameState();
    }

    function findWinningMove(player) {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]           // diagonals
        ];

        for (let pattern of winPatterns) {
            const values = pattern.map(index => cells[index].textContent);
            const emptyIndex = pattern[values.indexOf('')];
            
            if (values.filter(v => v === player).length === 2 && 
                values.includes('')) {
                return emptyIndex;
            }
        }
        return null;
    }

    function makeMove(cell, player) {
        cell.textContent = player;
        cell.style.color = player === PLAYER ? '#4CAF50' : '#FF5722';
    }

    function checkGameState() {
        if (checkWin()) {
            const winner = cells[winningCombination[0]].textContent;
            const result = winner === PLAYER ? "win" : "loss";
            const playerScore = winner === PLAYER ? 1 : 0;
            const cpuScore = winner === PLAYER ? 0 : 1;
            setTimeout(() => {
                alert(`${winner === PLAYER ? 'You win!' : 'CPU wins!'}`);
                gameActive = false;
                const matchDetails = {
                    opponent_display_name: "CPU",
                    opponent_type: "cpu",
                    result: result,
                    user_score: playerScore,
                    opponent_score: cpuScore,
                };
    
                // Call the reusable function
                createMatch("Tic-Tac-Toe", matchDetails, currentUser.token);
            }, 100);

            return true;
        }

        if (Array.from(cells).every(cell => cell.textContent !== '')) {
            setTimeout(() => {
                alert("It's a draw!");
                gameActive = false;
                // Prepare match details for a draw
                const matchDetails = {
                opponent_display_name: "CPU",
                opponent_type: "cpu",
                result: "draw",
                user_score: 0,
                opponent_score: 0,
                };

                // Call the reusable function
                createMatch("Tic-Tac-Toe", matchDetails, currentUser.token);
            }, 100);
            return true;
        }

        return false;
    }

    let winningCombination = null;
    function checkWin() {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]           // diagonals
        ];

        for (let pattern of winPatterns) {
            const values = pattern.map(index => cells[index].textContent);
            if (values[0] !== '' && 
                values[0] === values[1] && 
                values[1] === values[2]) {
                winningCombination = pattern;
                return true;
            }
        }
        return false;
    }

    // Reset button functionality
    resetButton.onclick = () => {
        Array.from(cells).forEach(cell => {
            cell.textContent = '';
            cell.style.color = '';
        });
        gameActive = true;
        winningCombination = null;
    };
}


// Start the Tic-Tac-Toe game (called from the button click)
function startMultiTic() {
    const content = document.getElementById('content');
    content.innerHTML = `
       	<div id="gameContainer">
						<h1>Tic-Tac-Toe</h1>
                        <button id="backButton" class="btn btn-secondary" onclick="startTicTacToe()">Back</button>
						<table id="ticTacToeBoard">
							<tbody>
								<tr>
									<td></td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td></td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
						<button id="resetButton">Reset Game</button>
                        
					</div>`;
			
				// Add the styles
				const style = document.createElement('style');
				style.textContent = `
					#gameContainer {
						text-align: center;
						padding: 20px;
					}
			
					#ticTacToeBoard {
						border-collapse: collapse;
						margin: 20px auto;
					}
			
					#ticTacToeBoard td {
						width: 100px;
						height: 100px;
						border: 2px solid #333;
						text-align: center;
						font-size: 2em;
						cursor: pointer;
						background-color: #fff;
					}
			
					#ticTacToeBoard td:hover {
						background-color: #f7f7f7;
					}
			
					#resetButton {
						padding: 10px 20px;
						font-size: 16px;
						cursor: pointer;
						margin-top: 20px;
					}
				`;
				document.head.appendChild(style);
			
				// Initialize the game immediately
				initializeGame();
}





function initializeGame() {
    const board = document.getElementById('ticTacToeBoard');
    const cells = board.getElementsByTagName('td');
    const resetButton = document.getElementById('resetButton');
    let currentPlayer = 'X';
    let gameActive = true;

    // Clear any existing content and listeners
    Array.from(cells).forEach(cell => {
        cell.textContent = '';
        cell.onclick = handleCellClick;
    });

    function handleCellClick(e) {
        const cell = e.target;
        
        // Check if the cell is empty and game is active
        if (cell.textContent !== '' || !gameActive) {
            return;
        }

        // Make the move
        cell.textContent = currentPlayer;
        cell.style.color = currentPlayer === 'X' ? '#4CAF50' : '#FF5722';

        // Check for win
        if (checkWin()) {
            setTimeout(() => {
                alert(`Player ${currentPlayer} wins!`);
                gameActive = false;
            }, 100);
            return;
        }

        // Check for draw
        if (Array.from(cells).every(cell => cell.textContent !== '')) {
            setTimeout(() => {
                alert("It's a draw!");
                gameActive = false;
            }, 100);
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function checkWin() {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]           // diagonals
        ];

        return winPatterns.some(pattern => {
            const values = pattern.map(index => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                return cells[row * 3 + col].textContent;
            });
            return values[0] !== '' && 
                   values[0] === values[1] && 
                   values[1] === values[2];
        });
    }

    // Reset button functionality
    resetButton.onclick = () => {
        Array.from(cells).forEach(cell => {
            cell.textContent = '';
            cell.style.color = '';
        });
        currentPlayer = 'X';
        gameActive = true;
    };
}