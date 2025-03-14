// Initialize RPS game by setting up event listeners for choices
function initializeRPS() {
    // Reset scores
    playerScore = 0;
    computerScore = 0;

    // Set initial score display
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
    
    // Attach event listeners to choice buttons
    document.getElementById('rock').addEventListener('click', function() { playerChoice('rock'); });
    document.getElementById('paper').addEventListener('click', function() { playerChoice('paper'); });
    document.getElementById('scissors').addEventListener('click', function() { playerChoice('scissors'); });
}

// Get a random choice for the computer
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

// Determine the result of the round
function playRound(playerSelection, computerSelection) {
    if (playerSelection === computerSelection) {
        return "drew";
    } else if (
        (playerSelection === 'rock' && computerSelection === 'scissors') ||
        (playerSelection === 'paper' && computerSelection === 'rock') ||
        (playerSelection === 'scissors' && computerSelection === 'paper')
    ) {
        return "won";
    } else {
        return "lost";
    }
}

// Function that handles the player's choice and updates the game
async function playerChoice(playerSelection) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))//addded by femi
    const computerSelection = getComputerChoice();
    let resultMessage = '';

    // Display the computer's choice
    document.getElementById('computerChoice').textContent = `Computer chose: ${computerSelection}`;

    // Determine the winner
    const result = playRound(playerSelection, computerSelection);

    if (result === 'won') {
        playerScore++;
        resultMessage = `You win! ${playerSelection} beats ${computerSelection}`;
    } else if (result === 'lost') {
        computerScore++;
        resultMessage = `You lose! ${computerSelection} beats ${playerSelection}`;
    } else {
        resultMessage = `It's a draw! Both chose ${playerSelection}`;
    }

    // Update the result and scores on the page
    document.getElementById('result').textContent = resultMessage;
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;

    // Check if anyone won the game (you can set this to a desired score limit)
    if (playerScore === 7) {
        alert("You win the game!");
        const matchDetails = {
            opponent_display_name: "CPU",
            opponent_type: "cpu",
            result: "win",  // Replace based on the game outcome
            user_score: playerScore,  // Replace with the actual user score
            opponent_score: computerScore,  // Replace with the actual opponent score
        };

        // Call the reusable function for creating a match
        createMatch("Rock-Paper-Scissor", matchDetails, currentUser.token);
        resetGame();
    } else if (computerScore === 7) {
        alert("Computer wins the game!");
        const matchDetails = {
            opponent_display_name: "CPU",
            opponent_type: "cpu",
            result: "loss",  // Replace based on the game outcome
            user_score: playerScore,  // Replace with the actual user score
            opponent_score: computerScore,  // Replace with the actual opponent score
        };

        // Call the reusable function for creating a match
        createMatch("Rock-Paper-Scissor", matchDetails, currentUser.token);
        resetGame();
    }
}

// Reset the game
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
    document.getElementById('result').textContent = '';
    document.getElementById('computerChoice').textContent = '';  // Clear the computer's choice display
}