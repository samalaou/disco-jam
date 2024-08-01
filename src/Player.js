class Player {
    constructor(container, obstacles) {
        this.position = {...PLAYER_STARTING_POSITON};
        this.container = container;
        this.obstacles = obstacles;
        this.dimension = {
            width: DEFAULT_WIDTH,
            height: PLAYER_HIEGHT
        };
        this.isAllowedToMove = false;
        this.containerWidthVW = null;
        this.containerHeightVH = null;
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
        [this.containerWidthVW, this.containerHeightVH] = getParentDimensions(this.container);
    }

    createDomElement() {
        this.element = document.createElement('div');
        this.element.classList.add('player');
        this.container.appendChild(this.element);
        this.element.style.width = `${this.dimension.width}vw`;
        this.element.style.height = `${this.dimension.height}vh`;
    }

    move(dx, dy) {
        const newX = this.position.x + dx;
        const newY = this.position.y + dy;
        const withinBoundsX = newX >= 0 && newX + this.dimension.width <= this.containerWidthVW;
        const withinBoundsY = newY >= 0 && newY + this.dimension.height <= this.containerHeightVH;

        if (withinBoundsX && withinBoundsY) {
            this.position.x = newX;
            this.position.y = newY;
            updatePosition(this.element, this.position);
            this.checkCollisions();
        }
    }

    handleKeyDown(e) {
        const moveFunction = this.directions[e.code];
        if (moveFunction) {
            moveFunction();
        }
    }

    checkCollisions() {
        this.obstacles.forEach(obstacle => {
            if (isOverlapping(this.position, this.dimension, obstacle.position, obstacle.dimension)) {
                if (obstacle instanceof Goal) {
                    game.handleGoalReached();
                } else {
                    game.handleGameOver();
                }
                return; // Exit the function after detecting collision
            }
        });
    }
}
