const NUM_OF_OBSTACLES = 5;
const GAME_DURATION = 20;
const BPM = 82;
const BEAT_INTERVAL = (60 / BPM) * 1000;
const BEAT_WINDOW = 200; // Allowable window around the beat

class Player {
    constructor(container, obstacles) {
        this.position = { x: 0, y: 0 };
        this.container = container;
        this.obstacles = obstacles;
        this.isAllowedToMove = false;
        this.containerWidthVW = null;
        this.containerHeightVH = null;
        this.playerWidthVW = null;
        this.playerHeightVH = null;
        this.createDomElement();
        this.updateDimensions();
    
        this.directions = {
            'ArrowUp': () => this.move(0, -1),
            'ArrowDown': () => this.move(0, 1),
            'ArrowLeft': () => this.move(-1, 0),
            'ArrowRight': () => this.move(1, 0)
        };
    }

    updateDimensions() {
        const containerRect = this.container.getBoundingClientRect();
        this.containerWidthVW = containerRect.width / window.innerWidth * 100; // Convert to vw
        this.containerHeightVH = containerRect.height / window.innerHeight * 100; // Convert to vh

        const playerRect = this.element.getBoundingClientRect();
        this.playerWidthVW = playerRect.width / window.innerWidth * 100; // Convert to vw
        this.playerHeightVH = playerRect.height / window.innerHeight * 100; // Convert to vh
    }

    createDomElement() {
        this.element = document.createElement('div');
        this.element.classList.add('player');
        this.container.appendChild(this.element);
    }

    move(dx, dy) {
        const newX = this.position.x + dx;
        const newY = this.position.y + dy;

        // Ensure the player stays within the container
        const withinBoundsX = newX >= 0 && newX + this.playerWidthVW <= this.containerWidthVW;
        const withinBoundsY = newY >= 0 && newY + this.playerHeightVH <= this.containerHeightVH;

        if (withinBoundsX && withinBoundsY) {
            this.position.x = newX;
            this.position.y = newY;
            this.updatePosition();
            this.checkCollisions();
        }
    }

    updatePosition() {
        this.element.style.left = `${this.position.x}vw`;
        this.element.style.top = `${this.position.y}vh`;
    }

    handleKeyDown(e) {
        const moveFunction = this.directions[e.code];
        if (moveFunction) {
            moveFunction();
        }
    }

    isColliding(obstacle) {
        return (
            this.position.x < obstacle.positionXVW + obstacle.widthVW &&
            this.position.x + this.playerWidthVW > obstacle.positionXVW &&
            this.position.y < obstacle.positionYVH + obstacle.heightVH &&
            this.position.y + this.playerHeightVH > obstacle.positionYVH
        );
    }

    checkCollisions() {
        this.obstacles.forEach(obstacle => {
            if (this.isColliding(obstacle)) {
                if (obstacle instanceof Goal){
                    console.log("You reached the Goal!")
                } else {
                    game.gameOver();
                }
                return; // Exit the function after detecting collision
            }
        });
    }


}

class Obstacle {
    constructor(container, containerWidthVW, containerHeightVH) {
        this.container = container;
        this.containerWidthVW = containerWidthVW;
        this.containerHeightVH = containerHeightVH;
        this.widthVW = 5;
        this.heightVH = 5;
        this.positionXVW = Math.floor(Math.random() * (this.containerWidthVW - this.widthVW));
        this.positionYVH = Math.floor(Math.random() * (this.containerHeightVH - this.heightVH));

        this.createDomElement();
    }

    createDomElement() {
        this.element = document.createElement("div");
        this.element.className = "obstacle";
        this.element.style.width = `${this.widthVW}vw`;
        this.element.style.height = `${this.heightVH}vh`;
        this.element.style.left = `${this.positionXVW}vw`;
        this.element.style.top = `${this.positionYVH}vh`;

        this.container.appendChild(this.element);
    }
}


class Goal extends Obstacle {
    constructor(container, containerWidthVW, containerHeightVH) {
        super(container, containerWidthVW, containerHeightVH);

        this.positionXVW = (containerWidthVW - this.widthVW) / 2; // Center horizontally
        this.positionYVH = containerHeightVH - this.heightVH; // Position at the bottom

        this.createDomElement();

        this.element.style.backgroundColor = 'red';
        this.element.id = "goal";

    }
}


class Game {
    constructor() {
        this.container = document.querySelector('.container');
        this.startButton = document.getElementById('startButton');
        this.timeDisplay = document.querySelector('#timeRemaining span');
        this.gameMusic = document.getElementById('gameMusic');

        this.timeRemaining = GAME_DURATION;
        this.isGameActive = false;
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
    }

    setupGame(){
        const containerRect = this.container.getBoundingClientRect();
        this.containerWidthVW = containerRect.width / window.innerWidth * 100; // Convert to vw
        this.containerHeightVH = containerRect.height / window.innerHeight * 100; // Convert to vh

        this.createObstacles()

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
        this.player.isAllowedToMove = true;
        this.gameMusic.play();
        this.startTimer();
        this.trackBeats();
    }

    startTimer() {
        this.updateTimeDisplay();
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimeDisplay();
            if (this.timeRemaining <= 0) {
                this.gameOver();
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
        const currentTime = Date.now();
        const timeSinceLastBeat = currentTime - this.lastBeatTime;
        if (timeSinceLastBeat < BEAT_WINDOW || timeSinceLastBeat > BEAT_INTERVAL - BEAT_WINDOW) {
            this.player.handleKeyDown(e);
        }
    }

    gameOver() {
        clearInterval(this.timer);
        clearInterval(this.beatTracker);
        this.player.isAllowedToMove = false;
        this.gameMusic.pause();
        this.isGameActive = false;
        console.log('Game Over!');
    }
}

const game = new Game();
