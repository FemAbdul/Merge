let gameActive = false;
let animationFrameId = null;

function initialize3DPingPong() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))//addded by femi
    // Scene setup
    const WIDTH = 800; // Fixed width instead of window.innerWidth
    const HEIGHT = 500; // Fixed height instead of window.innerHeight
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    document.getElementById("gameCanvas").appendChild(renderer.domElement);

    // Initial game state
    let playerScore = 0;
    let cpuScore = 0;
    
    // Game objects and variables setup (reuse your existing setup code)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 500, 500);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Table
    const tableGeometry = new THREE.BoxGeometry(400, 200, 10);
    const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = -5;
    table.receiveShadow = true;
    scene.add(table);

    // Net
    const netGeometry = new THREE.PlaneGeometry(400, 1);
    const netMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const net = new THREE.Mesh(netGeometry, netMaterial);
    net.position.z = 5;
    scene.add(net);

    // Player paddle
    const paddleGeometry = new THREE.BoxGeometry(10, 40, 10);
    const playerPaddleMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const playerPaddle = new THREE.Mesh(paddleGeometry, playerPaddleMaterial);
    playerPaddle.position.set(-180, 0, 5);
    playerPaddle.castShadow = true;
    scene.add(playerPaddle);

    // CPU paddle
    const cpuPaddleMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cpuPaddle = new THREE.Mesh(paddleGeometry, cpuPaddleMaterial);
    cpuPaddle.position.set(180, 0, 5);
    cpuPaddle.castShadow = true;
    scene.add(cpuPaddle);

    // Ball
    const ballGeometry = new THREE.SphereGeometry(5, 32, 32);
    const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0, 10);
    ball.castShadow = true;
    scene.add(ball);

    // Game variables
    const paddleSpeed = 3;
    let ballVelocity = { x: 3, y: 2 };
    let playerDirection = 0;

    // Event listeners for paddle control
    function handleKeyDown(event) {
        if (!gameActive) return;
        
        if (event.key === "ArrowUp") {
            playerDirection = 1;
            event.preventDefault();
        } else if (event.key === "ArrowDown") {
            playerDirection = -1;
            event.preventDefault();
        }
    }

    function handleKeyUp() {
        if (!gameActive) return;
        playerDirection = 0;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // CPU AI
    function updateCpuPaddle() {
        if (!gameActive) return;
        
        const targetY = ball.position.y;
        const randomness = Math.random() * 2 - 1;
        const speedFactor = 1 + Math.random() * 2;

        if (cpuPaddle.position.y < targetY - 10) {
            cpuPaddle.position.y += paddleSpeed * speedFactor + randomness;
        } else if (cpuPaddle.position.y > targetY + 10) {
            cpuPaddle.position.y -= paddleSpeed * speedFactor + randomness;
        }
    }

    function updateBall() {
        if (!gameActive) return;

        ball.position.x += ballVelocity.x;
        ball.position.y += ballVelocity.y;

        if (ball.position.y >= 100 || ball.position.y <= -100) {
            ballVelocity.y *= -1;
        }

        // Paddle collisions
        if (
            ball.position.x <= playerPaddle.position.x + 5 &&
            ball.position.y >= playerPaddle.position.y - 20 &&
            ball.position.y <= playerPaddle.position.y + 20
        ) {
            ballVelocity.x *= -1;
        }

        if (
            ball.position.x >= cpuPaddle.position.x - 5 &&
            ball.position.y >= cpuPaddle.position.y - 20 &&
            ball.position.y <= cpuPaddle.position.y + 20
        ) {
            ballVelocity.x *= -1;
        }

        // Scoring
        if (ball.position.x < -200) {
            cpuScore++;
            document.getElementById("cpuScore").textContent = cpuScore;
            resetBall();
        }

        if (ball.position.x > 200) {
            playerScore++;
            document.getElementById("playerScore").textContent = playerScore;
            resetBall();
        }

        // Check for game end
        if (playerScore === 5 || cpuScore === 5) {
            gameActive = false;
            alert(playerScore === 5 ? 'You Win!' : 'CPU Wins!');
            const result = playerScore === 5 ? 'win' : 'loss'; 
            const matchDetails = {
                opponent_display_name: "CPU",
                opponent_type: "cpu",
                result: result,  // Replace based on the game outcome
                user_score: playerScore,  // Replace with the actual user score
                opponent_score: cpuScore,  // Replace with the actual opponent score
            };

            // Call the reusable function for creating a match
            createMatch("Pong", matchDetails, currentUser.token);
            playerScore = 0;
            cpuScore = 0;
            document.getElementById("playerScore").textContent = "0";
            document.getElementById("cpuScore").textContent = "0";
            resetBall();
            document.getElementById("startButton").style.display = "block";
        }
    }

    function resetBall() {
        ball.position.set(0, 0, 10);
        ballVelocity = { 
            x: Math.random() < 0.5 ? 3 : -3, 
            y: Math.random() < 0.5 ? 2 : -2 
        };
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        if (gameActive) {
            if (playerDirection === 1 && playerPaddle.position.y < 80) {
                playerPaddle.position.y += paddleSpeed;
            } else if (playerDirection === -1 && playerPaddle.position.y > -80) {
                playerPaddle.position.y -= paddleSpeed;
            }

            updateCpuPaddle();
            updateBall();
        }

        renderer.render(scene, camera);
    }

    // Camera setup
    camera.position.set(0, -200, 200);
    camera.rotation.set(-Math.PI / 4, 0, 0);
    camera.lookAt(0, 0, 10);

    // Start button handler
    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", () => {
        gameActive = true;
        startButton.style.display = "none";
        resetBall();
        playerScore = 0;
        cpuScore = 0;
        document.getElementById("playerScore").textContent = "0";
        document.getElementById("cpuScore").textContent = "0";
    });

    // Start animation loop
    animate();

    // Cleanup function
    return function cleanup() {
        gameActive = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        const gameCanvas = document.getElementById("gameCanvas");
        if (gameCanvas) {
            gameCanvas.innerHTML = "";
        }
    };
}

//added by femi
async function createMatch(gameName, matchDetails, authToken) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,  // Include JWT token for authentication
        },
        body: JSON.stringify(matchDetails),
    };
    try{

        const response = await apiCallWithAutoRefresh(`http://127.0.0.1:8000/games/${gameName}/create-match/`, options);

        if (response.ok) {
            const data = await response.json();  // Parse the JSON response
        } else {
            throw new Error("Failed to create match. Please try again.");
        }
        } catch (error) {
            console.error("Error:", error.message);
        }
}