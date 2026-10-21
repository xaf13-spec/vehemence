const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const levelDisplay = document.getElementById('level');

let gameActive = false;
let score = 0;
let highScores = { easy: 0, medium: 0, hard: 0 };
let selectedDifficulty = 'easy';
let circleSizeRange = [100, 150];
let shrinkTime = 2500;

//Difficulty buttons
const difficultyButtons = document.querySelectorAll('.difficulty-button');
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedDifficulty = button.getAttribute('data-level');
        setDifficulty(selectedDifficulty);

        //Hides difficulty selection
        document.getElementById('difficulty-selection').style.display = 'none';
        startButton.classList.remove('hidden');

        //Updates level display and high score display
        levelDisplay.textContent = capitalizeFirstLetter(selectedDifficulty);
        highScoreDisplay.textContent = highScores[selectedDifficulty];
    });
});

//Set levels
function setDifficulty(level) {
    if (level === 'easy') {
        circleSizeRange = [150, 200];
        shrinkTime = 3000;
    } else if (level === 'medium') {
        circleSizeRange = [100, 150];
        shrinkTime = 2500;
    } else if (level === 'hard') {
        circleSizeRange = [50, 100];
        shrinkTime = 2000;
    }
}

//Start game function
startButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    gameActive = true;

    //Updates score display
    document.getElementById('score').textContent = score;

    //Hides Start Game button
    startButton.classList.add('hidden');

    //Starts game
    spawnCircle();
}

//Spawn new circle
function spawnCircle() {
    if (!gameActive) return;

    const circle = document.createElement('div');
    circle.classList.add('circle');

    //Random size calculator
    const size = Math.floor(Math.random() * (circleSizeRange[1] - circleSizeRange[0])) + circleSizeRange[0];
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;

    //Keeps circle inside grid
    const maxTop = gameContainer.clientHeight - size;
    const maxLeft = gameContainer.clientWidth - size;
    const topPosition = Math.random() * maxTop;
    const leftPosition = Math.random() * maxLeft;

    circle.style.top = `${topPosition}px`;
    circle.style.left = `${leftPosition}px`;

    gameContainer.appendChild(circle);

    //Apply shrinking animation
    circle.style.animation = `shrink ${shrinkTime}ms linear forwards`;


    circle.addEventListener('click', () => {
        if (!gameActive) return;

        score++;
        document.getElementById('score').textContent = score;
        circle.remove();

        spawnCircle();
    });

    // Game over when circle disappears
    setTimeout(() => {
        if (circle.parentElement) {
            gameActive = false;

            endGame();
        }
    }, shrinkTime);
}

//End game
function endGame() {
    const currentHighScore = highScores[selectedDifficulty];
    if (score > currentHighScore) {
        highScores[selectedDifficulty] = score;
        alert(`New High Score for ${capitalizeFirstLetter(selectedDifficulty)}: ${score}!`);
    } else {
        alert(`Game Over! You missed the circle. Good try!`);
    }

    //Update high score display
    highScoreDisplay.textContent = highScores[selectedDifficulty];

    //Clear game
    gameContainer.innerHTML = '';

    //Show difficulty selection again
    document.getElementById('difficulty-selection').style.display = 'block';
    startButton.classList.add('hidden');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}