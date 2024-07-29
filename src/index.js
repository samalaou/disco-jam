const NUM_OF_OBSTACLES = 5;

class Player {
    constructor(container) {
        this.position = { x: 0, y: 0 };
        this.container = container;
        this.initializeElement();

        // Get container dimensions and player size
        const containerRect = container.getBoundingClientRect();
        this.containerWidth = containerRect.width;
        this.containerHeight = containerRect.height;

        const playerRect = this.element.getBoundingClientRect();
        this.playerWidth = playerRect.width;
        this.playerHeight = playerRect.height;

        this.directions = {
            'ArrowUp': () => this.move(0, -1),
            'ArrowDown': () => this.move(0, 1),
            'ArrowLeft': () => this.move(-1, 0),
            'ArrowRight': () => this.move(1, 0)
        };
    }

    initializeElement() {
        this.element = document.createElement('div');
        this.element.classList.add('player');
        this.container.appendChild(this.element);
    }

    move(dx, dy) {
        const newX = this.position.x + dx;
        const newY = this.position.y + dy;

        // Ensure the player stays within the container
        const withinBoundsX = newX >= 0 && newX + this.playerWidth <= this.containerWidth;
        const withinBoundsY = newY >= 0 && newY + this.playerHeight <= this.containerHeight;

        if (withinBoundsX && withinBoundsY) {
            this.position.x = newX;
            this.position.y = newY;
            this.updatePosition();
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
        this.domElement = document.createElement("div");
        this.domElement.className = "obstacle";
        this.domElement.style.width = `${this.widthVW}vw`;
        this.domElement.style.height = `${this.heightVH}vh`;
        this.domElement.style.left = `${this.positionXVW}vw`;
        this.domElement.style.top = `${this.positionYVH}vh`;

        this.container.appendChild(this.domElement);
    }
}

// Setup
const container = document.querySelector('.container');
const player = new Player(container);
const obstacles = new Obstacles(container, NUM_OF_OBSTACLES);

document.addEventListener('keydown', (e) => {
    player.handleKeyDown(e);
});
