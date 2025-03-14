
function startTournamentTic() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div id="tournamentContainer">
            <h1>Tic-Tac-Toe Tournament Bracket</h1>

            <button id="backButton" class="btn btn-secondary" onclick="startTicTacToe()">Back</button>
			
			
			<div id="tournamentSetup" class="tournament-section">
                <h2>Tournament Setup</h2>
                <div class="setup-form">
                    <div class="input-group">
                        <label>Number of Players:</label>
                        <select id="playerCount">
                            <option value="4">4 Players</option>
                            <option value="8">8 Players</option>
                        </select>
                    </div>
                    <div id="playerInputs">
                        <!-- Player inputs will be added dynamically -->
                    </div>
                    <button id="startTournamentButton">Start Tournament</button>
                </div>
            </div>

            <div id="bracketView" class="tournament-section" style="display: none;">
                <div class="bracket-container">
                    <div id="bracket"></div>
                </div>
				<div id="winnerBox" class="winner-box" style="display: none;">
        			<h2>Match Winner</h2>
        			<div id="winnerName" class="winner-name"></div>
    			</div>
            </div>

            <div id="currentMatch" class="tournament-section" style="display: none;">
                <h2>Current Match</h2>
                <div id="matchInfo">
                    <h3><span id="player1Name"></span> vs <span id="player2Name"></span></h3>
                </div>
                <table id="ticTacToeBoard">
                    <tbody>
                        <tr><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td></tr>
                    </tbody>
                </table>
                <button id="resetGameButton">Reset Game</button>
            </div>
        </div>`;

	// content.innerHTML = content.innerHTML.replace(
	// 		'onclick="startTicTacToe()"',
	// 		'onclick="handleBackButton()"'
	// );


	    // Add the back button handler
		window.handleBackButton = function() {
			// Reset tournament state
			tournamentData = {
				players: [],
				matches: [],
				currentMatch: null,
				currentRound: 0,
				gameActive: false
			};
			
			// Show setup, hide other sections
			document.getElementById('tournamentSetup').style.display = 'block';
			document.getElementById('bracketView').style.display = 'none';
			document.getElementById('currentMatch').style.display = 'none';
			document.getElementById('winnerBox').style.display = 'none';
			
			// Reset player inputs
			//updatePlayerInputs();
		};

    // Add the styles
    const style = document.createElement('style');
    style.textContent = `
        #tournamentContainer {
            text-align: center;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

		.winner-box {
    background-color: #4CAF50;
    color: white;
    padding: 15px;
    border-radius: 8px;
    margin: 20px auto;
    max-width: 300px;
}

.winner-name {
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
}

.bracket-match .winner-indicator {
    color: #4CAF50;
    margin-left: 5px;
}

        .tournament-section {
            margin: 20px 0;
            padding: 20px;
            background-color: #000000;
            border-radius: 8px;
        }

        .setup-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            max-width: 400px;
            margin: 0 auto;
        }

        .input-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 10px 0;
        }

        .input-group input, .input-group select {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 200px;
        }

        .bracket-container {
            overflow-x: auto;
            padding: 20px;
        }

        #bracket {
            display: flex;
            justify-content: space-between;
            gap: 40px;
            margin: 0 auto;
        }

        .bracket-round {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            min-width: 200px;
        }

        .bracket-match {
            background: #000000;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            margin: 10px 0;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .bracket-match:hover {
            background-color: #000000;
        }

        .bracket-match.active {
            border: 2px solid #4CAF50;
        }

        .bracket-match.completed {
            background-color: #e8f5e9;
        }

        #ticTacToeBoard {
            border-collapse: collapse;
            margin: 20px auto;
        }

        #ticTacToeBoard td {
            width: 80px;
            height: 80px;
            border: 2px solid #333;
            text-align: center;
            font-size: 2em;
            cursor: pointer;
            background-color: #fff;
        }

        #ticTacToeBoard td:hover {
            background-color: #f7f7f7;
        }

        button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #45a049;
        }

        .player-name {
            font-weight: bold;
            margin: 5px 0;
        }

        .winner {
            color: #4CAF50;
        }
    `;
    document.head.appendChild(style);

    initializeTournamentTic();
}

function initializeTournamentTic() {
    let tournamentData = {
        players: [],
        matches: [],
        currentMatch: null,
        currentRound: 0,
        gameActive: false
    };

    const playerCount = document.getElementById('playerCount');
    const playerInputs = document.getElementById('playerInputs');
    const startTournamentButton = document.getElementById('startTournamentButton');

    // Update player input fields when player count changes
    playerCount.onchange = updatePlayerInputs;

    function updatePlayerInputs() {
        const count = parseInt(playerCount.value);
        playerInputs.innerHTML = '';
        
        for (let i = 1; i <= count; i++) {
            playerInputs.innerHTML += `
                <div class="input-group">
                    <label for="player${i}">Player ${i}:</label>
                    <input type="text" id="player${i}" value="Player ${i}">
                </div>
            `;
        }
    }

    // Initial player inputs
    updatePlayerInputs();

    startTournamentButton.onclick = function() {
        const count = parseInt(playerCount.value);
        tournamentData.players = [];
        
        // Collect player names
        for (let i = 1; i <= count; i++) {
            const name = document.getElementById(`player${i}`).value || `Player ${i}`;
            // tournamentData.players.push({ name, score: 0 });
            tournamentData.players.push({id: i, name});
        }

        // Initialize tournament bracket
        initializeBracket();
        
        // Hide setup, show bracket
        document.getElementById('tournamentSetup').style.display = 'none';
        document.getElementById('bracketView').style.display = 'block';
        document.getElementById('currentMatch').style.display = 'block';
    };

    function initializeBracket() {
        const playerCount = tournamentData.players.length;
        const rounds = Math.log2(playerCount);
        tournamentData.matches = [];

        // Create initial matches
        for (let i = 0; i < playerCount / 2; i++) {
            tournamentData.matches.push({
                round: 0,
                player1: tournamentData.players[i * 2],
                player2: tournamentData.players[i * 2 + 1],
                winner: null,
                completed: false
            });
        }

        // Create subsequent round placeholders
        for (let round = 1; round < rounds; round++) {
            const matchesInRound = playerCount / Math.pow(2, round + 1);
            for (let i = 0; i < matchesInRound; i++) {
                tournamentData.matches.push({
                    round: round,
                    player1: null,
                    player2: null,
                    winner: null,
                    completed: false
                });
            }
        }
        renderBracket();
        startNextMatch();
    }

    function renderBracket() {
        const bracket = document.getElementById('bracket');
        bracket.innerHTML = '';
        
        const rounds = Math.log2(tournamentData.players.length);
        const matchesByRound = {};
    
        tournamentData.matches.forEach(match => {
            if (!matchesByRound[match.round]) {
                matchesByRound[match.round] = [];
            }
            matchesByRound[match.round].push(match);
        });
    
        for (let round = 0; round < rounds; round++) {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'bracket-round';
            roundDiv.innerHTML = `<h3>Round ${round + 1}</h3>`;
    
            matchesByRound[round].forEach((match, index) => {
                const matchDiv = document.createElement('div');
                matchDiv.className = `bracket-match ${match.completed ? 'completed' : ''} ${match === tournamentData.currentMatch ? 'active' : ''}`;
                
                // Access player names from the player objects
                const player1Name = match.player1 ? match.player1.name : 'TBD';
                const player2Name = match.player2 ? match.player2.name : 'TBD';
                
                matchDiv.innerHTML = `
                    <div class="player-name ${match.winner === match.player1 ? 'winner' : ''}">
                        ${player1Name}
                        ${match.winner === match.player1 ? '<span class="winner-indicator">👑</span>' : ''}
                    </div>
                    <div class="player-name ${match.winner === match.player2 ? 'winner' : ''}">
                        ${player2Name}
                        ${match.winner === match.player2 ? '<span class="winner-indicator">👑</span>' : ''}
                    </div>
                `;
    
                roundDiv.appendChild(matchDiv);
            });
    
            bracket.appendChild(roundDiv);
        }
    }
    

	function startNextMatch() {
		// Find next incomplete match

		tournamentData.currentMatch = tournamentData.matches.find(match => 
			!match.completed && match.player1 !== null && match.player2 !== null);
	
		if (!tournamentData.currentMatch) {
			// const winner = tournamentData.players[tournamentData.matches[tournamentData.matches.length - 1].winner];
            
            const winner = tournamentData.matches[tournamentData.matches.length - 1].winner;
        
			// Show winner box at tournament end
			const winnerBox = document.getElementById('winnerBox');
			winnerBox.style.display = 'block';
			document.getElementById('winnerName').textContent = winner.name;
			document.getElementById('currentMatch').style.display = 'none'; // Hide the game board

            sendTournamentData("Tic-Tac-Toe", tournamentData.matches, tournamentData.players);
			return;
		}
	
		// Hide winner box during tournament
		document.getElementById('winnerBox').style.display = 'none';
	
		// Update current match display
        player1 = tournamentData.currentMatch.player1;
        player2 = tournamentData.currentMatch.player2;
		document.getElementById('player1Name').textContent = player1.name;
		document.getElementById('player2Name').textContent = player2.name;
	
		resetGameBoard();
	}

	function resetGameBoard() {
		const cells = document.getElementById('ticTacToeBoard').getElementsByTagName('td');
		Array.from(cells).forEach(cell => {
			cell.textContent = '';
			cell.style.color = '';
			cell.onclick = handleMove;
		});
	
		tournamentData.gameActive = true;
		tournamentData.currentPlayer = 'X';
	}

    function handleMove(e) {
		if (!tournamentData.gameActive) return;
		
		const cell = e.target;
		if (cell.textContent !== '') return;
	
		const currentMatch = tournamentData.currentMatch;
		
		cell.textContent = tournamentData.currentPlayer;
		cell.style.color = tournamentData.currentPlayer === 'X' ? '#4CAF50' : '#FF5722';
        
      
		if (checkWin()) {
			tournamentData.gameActive = false;
			const winner = tournamentData.currentPlayer === 'X' ? currentMatch.player1 : currentMatch.player2;
			currentMatch.winner = winner;
			currentMatch.completed = true;
			
			// Update next round
			const nextRoundIndex = tournamentData.matches.findIndex(match => 
				match.round === currentMatch.round + 1 && 
				(match.player1 === null || match.player2 === null));
	
			if (nextRoundIndex !== -1) {
				if (tournamentData.matches[nextRoundIndex].player1 === null) {
					tournamentData.matches[nextRoundIndex].player1 = winner;
				} else {
					tournamentData.matches[nextRoundIndex].player2 = winner;
				}
			}
	
			renderBracket();
			
			setTimeout(() => {
				// alert(`${tournamentData.players[winner].name} wins this match!`);
				alert(`${winner.name} wins this match!`);
                startNextMatch();
			}, 100);
			return;
		}
	
		if (Array.from(document.getElementsByTagName('td')).every(cell => cell.textContent !== '')) {
			tournamentData.gameActive = false;
			setTimeout(() => {
				alert("It's a draw! Replaying match...");
				startNextMatch();
			}, 100);
			return;
		}
	
		tournamentData.currentPlayer = tournamentData.currentPlayer === 'X' ? 'O' : 'X';
	}
	

    function checkWin() {
        const cells = document.getElementById('ticTacToeBoard').getElementsByTagName('td');
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];

        return winPatterns.some(pattern => {
            const values = pattern.map(index => cells[index].textContent);
            return values[0] !== '' && 
                   values[0] === values[1] && 
                   values[1] === values[2];
        });
    }

    // Reset button functionality
    document.getElementById('resetGameButton').onclick = function() {
		if (tournamentData.currentMatch && !tournamentData.currentMatch.completed) {
			resetGameBoard();
		}
        if (tournamentData.currentMatch) {
            const cells = document.getElementById('ticTacToeBoard').getElementsByTagName('td');
            Array.from(cells).forEach(cell => {
                cell.textContent = '';
                cell.style.color = '';
                cell.onclick = handleMove;  // Re-add click handlers
            });
            tournamentData.gameActive = true;
            tournamentData.currentPlayer = 'X'; 
        }
    };
}
