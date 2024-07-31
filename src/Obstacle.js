class Obstacle {
    constructor(container, containerWidthVW, containerHeightVH) {
        this.container = container;
        this.containerWidthVW = containerWidthVW;
        this.containerHeightVH = containerHeightVH;
        this.dimension = {
            width: DEFAULT_WIDTH,
            height: OBSTACLES_HIEGHT
        };
        this.position = {
            x: null,
            y: null
        };

        this.getObstaclePosition();
        this.createDomElement();
    }

    getRandomPosition(containerSize, elementSize) {
        return Math.floor(Math.random() * (containerSize - elementSize));
    }

    getObstaclePosition() {
        let isPositionValid = false;
        while (!isPositionValid) {
            this.position.x = this.getRandomPosition(this.containerWidthVW, this.dimension.width);
            this.position.y = this.getRandomPosition(this.containerHeightVH, this.dimension.height);
            isPositionValid = !isOverlapping(this.position, this.dimension, PLAYER_STARTING_POSITON, PLAYER_DIMENSION);
        }
    }

    createDomElement() {
        this.element = document.createElement("div");
        this.element.className = "obstacle";
        this.element.style.width = `${this.dimension.width}vw`;
        this.element.style.height = `${this.dimension.height}vh`;
        this.element.style.left = `${this.position.x}vw`;
        this.element.style.top = `${this.position.y}vh`;

        this.container.appendChild(this.element);
    }
}
