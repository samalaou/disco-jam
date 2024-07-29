const NUM_OF_OBSTACLES = 5;

class Player {
    constructor(container, obstacles) {
        this.position = { x: 0, y: 0 };
        this.container = container;
        this.obstacles = obstacles;
        this.createDomElement();

        // Get container dimensions and player size
        const containerRect = container.getBoundingClientRect();
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
                    console.log("Game Over!");
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
    player.handleKeyDown(e);
});
