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
        console.log(111)
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
