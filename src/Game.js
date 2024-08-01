class Game {
    constructor() {
        this.container = document.querySelector('.container');
        this.startButton = document.getElementById('startButton');
        this.timeDisplay = document.querySelector('#timeRemaining span');
        this.gameMusic = document.getElementById('gameMusic');
        this.optionScreen = document.querySelector('.option-screen');
        this.finalMessage = document.querySelector('#final-message');
        this.restartButton = document.getElementById('option-restart-btn');

        this.directionKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
        this.timeRemaining = GAME_DURATION;
        this.isGameActive = false;
        this.isFinalScreen = false;
        this.isPaused = false;
        this.isGameOver = false;
        this.timer = null;
        this.player = null;
        this.obstacles = [];
        this.goal = null;
        this.beatTracker = null;
        this.lastBeatTime = 0;
        this.containerHeightVH = null;
        this.containerWidthVW = null;
        
        this.setupGame();

        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.restartButton.addEventListener('click', () => this.restartGame());

    }

    setupGame() {
        this.updateButtonVisibility();

        [this.containerWidthVW, this.containerHeightVH] = getParentDimensions(this.container);

        this.createObstacles();

        this.goal = new Goal(this.container, this.containerWidthVW, this.containerHeightVH);
        this.obstacles.push(this.goal);
        this.player = new Player(this.container, this.obstacles);
    }

    createObstacles() {
        for (let i = 0; i < NUM_OF_OBSTACLES; i++) {
            const obstacle = new Obstacle(this.container, this.containerWidthVW, this.containerHeightVH);
            this.obstacles.push(obstacle);
        }
    }

    startGame() {
        if (this.isGameActive) return;

        this.isGameActive = true;
        this.isGameOver = false;
        this.player.isAllowedToMove = true;
        this.gameMusic.play();
        this.startTimer();
        this.trackBeats();
        this.closeOptionScreen();
        this.updateButtonVisibility();
    }

    startTimer() {
        this.updateTimeDisplay();
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimeDisplay();
            if (this.timeRemaining <= 0) {
                this.handleGameOver();
            }
        }, 1000);
    }

    updateTimeDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60).toString().padStart(2, "0");
        const seconds = (this.timeRemaining % 60).toString().padStart(2, "0");
        this.timeDisplay.innerText = `${minutes}:${seconds}`;
    }

    trackBeats() {
        this.beatTracker = setInterval(() => {
            this.lastBeatTime = Date.now();
        }, BEAT_INTERVAL);
    }

    handleKeyDown(e) {
        if (e.code === "Space") {
            this.handleSpace();
            return;
        }

        if (!this.isGameActive || !this.player.isAllowedToMove) {
            return;
        }

        if (this.directionKeys.includes(e.code)) {
            if (this.isWithinBeatWindow()) {
                this.player.handleKeyDown(e);
            } else {
                this.applyMissedBeatPenalty();
            }
        }
    }

    handleSpace() {
        if (this.isFinalScreen) {
            this.restartGame();
        } else if (this.isPaused) {
            this.resumeGame();
        } else if (this.isGameActive) {
            this.pauseGame();
        } else {
            this.startGame();
        }
    }

    isWithinBeatWindow() {
        const currentTime = Date.now();
        const timeSinceLastBeat = currentTime - this.lastBeatTime;
        return timeSinceLastBeat < BEAT_WINDOW || timeSinceLastBeat > BEAT_INTERVAL - BEAT_WINDOW;
    }

    applyMissedBeatPenalty() {
        this.timeRemaining -= MISSED_BEAT_PENALTY;
        if (this.timeRemaining < 0) {
            this.timeRemaining = 0;
        }
        this.updateTimeDisplay();

        if (this.timeRemaining <= 0) {
            this.handleGameOver();
        }
    }

    endGame() {
        clearInterval(this.timer);
        clearInterval(this.beatTracker);
        this.player.isAllowedToMove = false;
        this.gameMusic.pause();
        this.isGameActive = false;
        this.isGameOver = true;
        this.isFinalScreen = true;
        this.optionScreen.style.display = 'flex';
        this.updateButtonVisibility();
    }

    closeOptionScreen() {
        this.optionScreen.style.display = 'none';
    }

    restartGame() {
        this.timeRemaining = GAME_DURATION;
        this.gameMusic.currentTime = 0;
        this.isFinalScreen = false;
        this.isGameOver = false;
        this.closeOptionScreen();
        this.clearGame();
        this.setupGame();
        this.startGame();
    }

    clearGame() {
        this.obstacles.forEach(obstacle => obstacle.element.remove());
        this.player.element.remove();
        this.obstacles = [];
        this.player = null;
        this.goal = null;
    }

    handleGameOver() {
        this.endGame();
        this.finalMessage.textContent = 'You lost';
    }

    handleGoalReached() {
        this.endGame();
        this.finalMessage.textContent = 'You won!';
    }

    pauseGame() {
        this.isPaused = true;
        clearInterval(this.timer);
        clearInterval(this.beatTracker);
        this.gameMusic.pause();
        this.optionScreen.style.display = 'flex';
        this.finalMessage.textContent = 'Game Paused';
        this.updateButtonVisibility();
    }

    resumeGame() {
        this.isPaused = false;
        this.startTimer();
        this.trackBeats();
        this.gameMusic.play();
        this.closeOptionScreen();
        this.updateButtonVisibility();
    }

    updateButtonVisibility() {
        if (this.isGameOver) {
            this.startButton.style.display = 'none';
            this.restartButton.style.display = 'block';
        } else if (this.isPaused) {
            this.startButton.style.display = 'none';
            this.restartButton.style.display = 'none';
        } else {
            this.startButton.style.display = 'block';
            this.restartButton.style.display = 'none';
        }
    }
}
