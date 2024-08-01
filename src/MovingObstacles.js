class MovingObstacle extends Obstacle {
    constructor(container, containerWidthVW, containerHeightVH) {
        super(container, containerWidthVW, containerHeightVH);
        this.direction = 'right';
        this.movementSteps = 4;
        this.currentStep = 0;
        this.stepSize = 2;
        this.movementInterval = null;
        this.startMoving();
        this.element.classList.add('moving-obstacle');
    }

    startMoving() {
        this.movementInterval = setInterval(() => {
            this.move();
        }, BEAT_INTERVAL);
    }

    move() {
        if (this.direction === 'right') {
            this.position.x += this.stepSize;
            if (this.currentStep >= this.movementSteps) {
                this.currentStep = 0;
                this.direction = 'left';
            }
        } else {
            this.position.x -= this.stepSize;
            if (this.currentStep >= this.movementSteps) {
                this.currentStep = 0;
                this.direction = 'right';
            }
        }

        this.position.x = Math.max(0, Math.min(this.position.x, this.containerWidthVW - this.dimension.width));
        updatePosition(this.element, this.position);
        this.currentStep++;
    }

    stopMoving() {
        clearInterval(this.movementInterval);
    }
}