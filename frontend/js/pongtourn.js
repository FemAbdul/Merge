// Core game state variables
let players = [];
let matches = [];
let currentMatch = null;
let gameState = {
    paddle1Y: 170,
    paddle2Y: 170,
    ballX: 395,
    ballY: 195,
    ballSpeedX: 5,
    ballSpeedY: 5,
    score1: 0,
    score2: 0,
    keys: {}
};

let gameLoopId = null;
let keydownListener = null;
let keyupListener = null;

// Main game loop
function gameLoop() {
    // Move paddles
    if ((gameState.keys['w'] || gameState.keys['W']) && gameState.paddle1Y > 0) {
        gameState.paddle1Y -= 5;
    }
    if ((gameState.keys['s'] || gameState.keys['S']) && gameState.paddle1Y < 340) {
        gameState.paddle1Y += 5;
    }
    if (gameState.keys['ArrowUp'] && gameState.paddle2Y > 0) {
        gameState.paddle2Y -= 5;
    }
    if (gameState.keys['ArrowDown'] && gameState.paddle2Y < 340) {
        gameState.paddle2Y += 5;
    }
    
    // Move ball
    gameState.ballX += gameState.ballSpeedX;
    gameState.ballY += gameState.ballSpeedY;
    
    // Ball collisions
    handleCollisions();
    
    // Update display
    updateDisplay();
    
    // Check for match end
    if (gameState.score1 >= 5 || gameState.score2 >= 5) {
        endMatch();
        return;
    }
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

function handleCollisions() {
    // Ball collision with top and bottom
    if (gameState.ballY <= 0 || gameState.ballY >= 390) {
        gameState.ballSpeedY = -gameState.ballSpeedY;
    }
    
    // Ball collision with paddles
    if (gameState.ballX <= 20 && 
        gameState.ballY > gameState.paddle1Y && 
        gameState.ballY < gameState.paddle1Y + 60) {
        gameState.ballSpeedX = -gameState.ballSpeedX;
    }
    
    if (gameState.ballX >= 770 && 
        gameState.ballY > gameState.paddle2Y && 
        gameState.ballY < gameState.paddle2Y + 60) {
        gameState.ballSpeedX = -gameState.ballSpeedX;
    }
    
    // Scoring
    if (gameState.ballX <= 0) {
        gameState.score2++;
        resetBall();
    }
    if (gameState.ballX >= 790) {
        gameState.score1++;
        resetBall();
    }
}

function updateDisplay() {
    const paddle1 = document.getElementById('paddle1');
    const paddle2 = document.getElementById('paddle2');
    const ball = document.getElementById('ball');
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
    
    if (paddle1 && paddle2 && ball && score1 && score2) {
        // Set both top and left/right positions for paddles
        paddle1.style.top = `${gameState.paddle1Y}px`;
        paddle1.style.left = '10px';  // Fixed left position
        
        paddle2.style.top = `${gameState.paddle2Y}px`;
        paddle2.style.right = '10px'; // Fixed right position
        
        ball.style.left = `${gameState.ballX}px`;
        ball.style.top = `${gameState.ballY}px`;
        score1.textContent = `${currentMatch?.player1.name}: ${gameState.score1}`;
        score2.textContent = `${currentMatch?.player2.name}: ${gameState.score2}`;
    }
}

function resetBall() {
    gameState.ballX = 395;
    gameState.ballY = 195;
    gameState.ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    gameState.ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function startTournamentGame() {

	
    // Reset game state
    gameState = {
        paddle1Y: 170,
        paddle2Y: 170,
        ballX: 395,
        ballY: 195,
        ballSpeedX: 5,
        ballSpeedY: 5,
        score1: 0,
        score2: 0,
        keys: {}
    };
    
    // Remove old event listeners if they exist
    cleanupTournamentGame();
    
    // Add new keyboard controls
    keydownListener = function(e) {
        gameState.keys[e.key] = true;
        if(['ArrowUp', 'ArrowDown', 'w', 's'].includes(e.key)) {
            e.preventDefault();
        }
    };
    
    keyupListener = function(e) {
		const key = e.key.toLowerCase();
        gameState.keys[e.key] = false;
    };
    
    document.addEventListener('keydown', keydownListener);
    document.addEventListener('keyup', keyupListener);
    
    // Start game loop
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Go back to menu
function goBack() {
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    cleanup();
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
}





function startTournament() {


	






    const content = document.getElementById('content');
    content.innerHTML = `
        <div id="tournament-screen">
            <h2>Pong Tournament</h2>
            <div class="tournament-setup">
                <div class="player-selection">
                    <label>Number of Players:</label>
                    <select id="player-count" onchange="createPlayerInputs()">
                        <option value="4">4 Players</option>
                        <option value="8">8 Players</option>
                    </select>
                    <div id="player-inputs"></div>
                    <button onclick="initializeTournament()" class="control-btn">Start Tournament</button>
                    <button onclick="showPingPong()" class="control-btn">Back</button>
                </div>
            </div>
            <div id="tournament-bracket"></div>
        </div>
    `;

    // Add tournament-specific styles
    if (!document.getElementById('tournamentStyles')) {
		// Add this near the top where the other styles are added

        const styles = `
			

            .tournament-setup {
                max-width: 800px;
                margin: 20px auto;
                padding: 20px;
                background: #000000;
                border-radius: 8px;
            }
            .player-selection {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .player-input {
                margin: 5px 0;
            }
            #tournament-bracket {
                max-width: 800px;
                margin: 20px auto;
            }
            .match-box {
                border: 1px solid #ddd;
                padding: 10px;
                margin: 10px 0;
                background: 000000;
                border-radius: 4px;
            }
            .winner {
                color: #4CAF50;
                font-weight: bold;
                margin-top: 5px;
            }
            .player-input input {
                padding: 5px;
                margin-left: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            select {
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-left: 10px;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.id = 'tournamentStyles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    createPlayerInputs();







}

function createPlayerInputs() {
    const count = parseInt(document.getElementById('player-count').value);
    const container = document.getElementById('player-inputs');
    container.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const input = document.createElement('div');
        input.className = 'player-input';
        input.innerHTML = `
            <label>Player ${i}:</label>
            <input type="text" id="player${i}" placeholder="Enter name">
        `;
        container.appendChild(input);
    }
}

function initializeTournament() {


	



    const count = parseInt(document.getElementById('player-count').value);
    players = [];
    matches = [];
    
    // Collect player names
    for (let i = 1; i <= count; i++) {
        const name = document.getElementById(`player${i}`).value || `Player ${i}`;
        players.push({ id: i, name: name });
    }
    
    // Shuffle players
    players.sort(() => Math.random() - 0.5);
    
    // Create initial matches
    for (let i = 0; i < players.length; i += 2) {
        matches.push({
            player1: players[i],
            player2: players[i + 1],
            winner: null,
            round: 1
        });
    }
    




    // Store the tournament state and the last visited page
    sessionStorage.setItem("tournamentState", JSON.stringify({ players, matches }));
    sessionStorage.setItem("lastPage", "tournamentScreen");

    updateBracketDisplay();

	}
	
	// Function to restore state after page reload
	function restoreTournamentState() {
		const savedState = sessionStorage.getItem("tournamentState");
		if (savedState) {
			const { players: savedPlayers, matches: savedMatches } = JSON.parse(savedState);
			players = savedPlayers;
			matches = savedMatches;
			updateBracketDisplay(); // Continue from where the user left off

		}




}
window.onload = function() {
    const lastPage = sessionStorage.getItem("lastPage");
    
    if (lastPage === "tournament") {
        const savedState = sessionStorage.getItem("tournamentState");
        if (savedState) {
            const { players: savedPlayers, matches: savedMatches } = JSON.parse(savedState);
            players = savedPlayers;
            matches = savedMatches;
            
            // First make sure the tournament UI is displayed
            startTournament();
            
            // Then update the bracket with the saved data
            updateBracketDisplay();
        }
    }
};




function updateBracketDisplay() {
    const bracket = document.getElementById('tournament-bracket');
    bracket.innerHTML = '<h3>Tournament Bracket</h3>';
    
    // Group matches by round
    const roundMatches = {};
    matches.forEach(match => {
        if (!roundMatches[match.round]) {
            roundMatches[match.round] = [];
        }
        roundMatches[match.round].push(match);
    });
    
    // Display each round
    Object.keys(roundMatches).sort((a, b) => a - b).forEach(round => {
        const roundDiv = document.createElement('div');
        roundDiv.innerHTML = `<h4>Round ${round}</h4>`;
        
        roundMatches[round].forEach(match => {
            const matchBox = document.createElement('div');
            matchBox.className = 'match-box';
            
            if (match.winner) {
                matchBox.innerHTML = `
                    <div>${match.player1.name} vs ${match.player2.name}</div>
                    <div class="winner">Winner: ${match.winner.name}</div>
                `;
            } else {
                matchBox.innerHTML = `
                    <div>${match.player1.name} vs ${match.player2.name}</div>
                    <button onclick="startMatch(${matches.indexOf(match)})" class="control-btn">
                        Play Match
                    </button>
                `;
            }
            
            roundDiv.appendChild(matchBox);
        });
        
        bracket.appendChild(roundDiv);
    });

    // Check if tournament is complete
    const finalRound = Math.max(...matches.map(m => m.round));
    const finalMatches = matches.filter(m => m.round === finalRound);
    if (finalMatches.length === 1 && finalMatches[0].winner) {
        bracket.innerHTML += `
            <div class="tournament-winner">
                <h3>🏆 Tournament Winner 🏆</h3>
                <h4>${finalMatches[0].winner.name}</h4>
            </div>
        `;
        // Send the entire tournament data to the backend
        sendTournamentData("Pong", matches, players);
    }
    
}

function startMatch(matchIndex) {
    currentMatch = matches[matchIndex];
    const content = document.getElementById('content');
    content.innerHTML = `
        <div id="game-screen">
            <h2>Tournament Match</h2>
            <div class="match-info">${currentMatch.player1.name} vs ${currentMatch.player2.name}</div>
            <div id="scores">
                <div id="score1">0</div>
                <div id="score2">0</div>
            </div>
            <div id="game-container">
                <div id="paddle1" class="paddle"></div>
                <div id="ball"></div>
                <div id="paddle2" class="paddle"></div>
            </div>
            <div class="controls-info">
                Player 1: W/S keys | Player 2: Up/Down arrow keys
            </div>
            <div class="game-controls">
                <button onclick="startTournamentGame()" class="control-btn">Start Game</button>
                <button onclick="returnToBracket()" class="control-btn">Back to Bracket</button>
            </div>
        </div>
    `;
// Add this near the top where the other styles are added
const gameStyles = `
    #game-container {
        width: 800px;
        height: 400px;
        background: #000;
        position: relative;
        margin: 20px auto;
        overflow: hidden;  // Add this to prevent paddles from going outside
    }
    .paddle {
        width: 10px;
        height: 60px;
        background: white;
        position: absolute;
        top: 170px;  // Set initial vertical position
    }
    #paddle1 { 
        left: 10px;
    }
    #paddle2 { 
        right: 10px;
    }
    #ball {
        width: 10px;
        height: 10px;
        background: white;
        position: absolute;
        border-radius: 50%;
    }
    #scores {
        display: flex;
        justify-content: space-around;
        margin: 10px 0;
        font-size: 24px;
    }
`;

    // Add game styles if not already present
    if (!document.getElementById('gameStyles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'gameStyles';
        styleSheet.textContent = gameStyles;
        document.head.appendChild(styleSheet);
    }
}

function cleanupTournamentGame() {
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    if (keydownListener) {
        document.removeEventListener('keydown', keydownListener);
    }
    if (keyupListener) {
        document.removeEventListener('keyup', keyupListener);
    }
}

function returnToBracket() {
    cleanupTournamentGame();
    startTournament();
    updateBracketDisplay();
}

// Modify the existing endMatch function
function endMatch() {
    if (!currentMatch) return;
    
    const winner = gameState.score1 > gameState.score2 ? currentMatch.player1 : currentMatch.player2;
    currentMatch.winner = winner;
    
    // Check if we need to create next round matches
    const roundMatches = matches.filter(m => m.round === currentMatch.round);
    if (roundMatches.every(m => m.winner)) {
        const winners = roundMatches.map(m => m.winner);
        if (winners.length > 1) {
            // Create next round matches
            for (let i = 0; i < winners.length; i += 2) {
                if (i + 1 < winners.length) {
                    matches.push({
                        player1: winners[i],
                        player2: winners[i + 1],
                        winner: null,
                        round: currentMatch.round + 1
                    });
                }
            }
        }
    }
    
    cleanupTournamentGame();
    returnToBracket();
}

//added by fmi
async function sendTournamentData(gameName, matches, players) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))//addded by femi
    token = currentUser.token
    const tournamentData = {
        players: players.map(player => player.name),
        matches: matches.map(match => ({
            player1: match.player1.name,
            player2: match.player2.name,
            winner: match.winner.name,
            round_number: match.round
        })),
        winner_name: matches.find(m => m.round === Math.max(...matches.map(m => m.round)))?.winner?.name || null
    };

    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Include JWT token for authentication
            },
            body: JSON.stringify(tournamentData),
        };
        const response = await apiCallWithAutoRefresh(`http://127.0.0.1:8000/games/${gameName}/tournament/`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        alert("Tournament saved successfully!");
    } catch (error) {
        console.error("Error saving tournament:", error);
        alert("Failed to save tournament.");
    }
}

function clearTournamentState() {
    sessionStorage.removeItem("tournamentState");
    sessionStorage.removeItem("lastPage");
}

// Modify your existing showPingPong function to include cleanup
function showPingPong() {
    cleanupTournamentGame();
    clearTournamentState();
    startPingPong(); // Your existing function to show the ping pong menu
}





// Create a function to handle clicking on the tournament button
function tournamentButtonClick() {
    // Set a flag to indicate we should start the tournament after reload
    sessionStorage.setItem("startTournamentAfterReload", "true");
    
    // Reload the page
    location.reload();
}

// Update the window.onload function to check for this flag
window.onload = function() {
    // Check if we should start tournament directly
    if (sessionStorage.getItem("startTournamentAfterReload") === "true") {
        // Clear the flag
        sessionStorage.removeItem("startTournamentAfterReload");
        
        // Start the tournament
        startTournament();
        
        // Also restore tournament state if exists
        const savedState = sessionStorage.getItem("tournamentState");
        if (savedState) {
            const { players: savedPlayers, matches: savedMatches } = JSON.parse(savedState);
            players = savedPlayers;
            matches = savedMatches;
            updateBracketDisplay();
        }
        return;
    }
    
    // Continue with regular state restoration
    const lastPage = sessionStorage.getItem("lastPage");
    if (lastPage === "tournament") {
        const savedState = sessionStorage.getItem("tournamentState");
        if (savedState) {
            const { players: savedPlayers, matches: savedMatches } = JSON.parse(savedState);
            players = savedPlayers;
            matches = savedMatches;
            startTournament();
            updateBracketDisplay();
        }
    }
};