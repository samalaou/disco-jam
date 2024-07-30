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
        this.createDomElement();

        // Get container dimensions and player size
        const containerRect = this.container.getBoundingClientRect();
        this.containerWidthVW = containerRect.width / window.innerWidth * 100; // Convert to vw
        this.containerHeightVH = containerRect.height / window.innerHeight * 100; // Convert to vh

        const playerRect = this.element.getBoundingClientRect();
        this.playerWidthVW = playerRect.width / window.innerWidth * 100; // Convert to vw
        this.playerHeightVH = playerRect.height / window.innerHeight * 100; // Convert to vh
    
        this.directions = {
            'ArrowUp': () => this.move(0, -1),
            'ArrowDown': () => this.move(0, 1),
            'ArrowLeft': () => this.move(-1, 0),
            'ArrowRight': () => this.move(1, 0)
        };
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
                    GameOver();
                }
                return; // Exit the function after detecting collision
            }
        });
    }


}


class Obstacles {
    constructor(container, numObstacles) {
        this.container = container;
        this.numObstacles = numObstacles;
        this.obstacles = [];
        this.updateContainerDimensions();

        this.createObstacles();
    }

    updateContainerDimensions() {
        const containerRect = this.container.getBoundingClientRect();
        this.containerWidthVW = containerRect.width / window.innerWidth * 100; // Convert to vw
        this.containerHeightVH = containerRect.height / window.innerHeight * 100; // Convert to vh
    }

    createObstacles() {
        for (let i = 0; i < this.numObstacles; i++) {
            const obstacle = new Obstacle(this.container, this.containerWidthVW, this.containerHeightVH);
            this.obstacles.push(obstacle);
        }
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

// Setup
const container = document.querySelector('.container');
const obstacles = new Obstacles(container, NUM_OF_OBSTACLES);
const goal = new Goal(container, obstacles.containerWidthVW, obstacles.containerHeightVH);

obstacles.obstacles.push(goal);

const player = new Player(container, obstacles.obstacles);

document.addEventListener('keydown', (e) => {
    const currentTime = Date.now();
    const timeSinceLastBeat = currentTime - lastBeatTime;
    if (timeSinceLastBeat < BEAT_WINDOW || timeSinceLastBeat > BEAT_INTERVAL - BEAT_WINDOW) {
        player.handleKeyDown(e);
    }
});

const startButton = document.getElementById('startButton');
const timeRemaining = document.querySelector('#timeRemaining span');
const gameMusic = document.getElementById('gameMusic');

let timer;
let time = GAME_DURATION;

function startTimer() {
    updateTimeDisplay();
    timer = setInterval(() => {
        time--;
        updateTimeDisplay();
        if (time <= 0) {
            GameOver()
        }
    }, 1000);
}

function startGame(){
    player.isAllowedToMove = true;
    gameMusic.play();
    startTimer();
    trackBeats();
}
function updateTimeDisplay() {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    timeRemaining.innerText = `${minutes}:${seconds}`;
}


startButton.addEventListener('click', startGame);

function GameOver(){
    clearInterval(timer);
    clearInterval(beatTracker);
    player.isAllowedToMove = false
    gameMusic.pause()
    console.log('Game Over!')
}

let beatTracker;

function trackBeats() {
    beatTracker = setInterval(() => {
        lastBeatTime = Date.now();
    }, BEAT_INTERVAL);
}