class Player {
    constructor(container, obstacles) {
        this.position = { x: 0, y: 0 };
        this.container = container;
        this.obstacles = obstacles;
        this.widthVW = DEFAULT_WIDTH;
        this.heightVH = DEFAULT_HIEGHT;
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
        this.element.style.width = `${this.widthVW}vw`;
        this.element.style.height = `${this.heightVH}vh`;
    }

    move(dx, dy) {
        const newX = this.position.x + dx;
        const newY = this.position.y + dy;

        // Ensure the player stays within the container
        const withinBoundsX = newX >= 0 && newX + this.widthVW <= this.containerWidthVW;
        const withinBoundsY = newY >= 0 && newY + this.heightVH <= this.containerHeightVH;

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
                    game.handleGoalReached();
                } else {
                    game.handleGameOver();
                }
                return; // Exit the function after detecting collision
            }
        });
    }

}
