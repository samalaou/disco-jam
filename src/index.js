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

// Setup
const container = document.querySelector('.container');
const player = new Player(container);

document.addEventListener('keydown', (e) => {
    player.handleKeyDown(e);
});
