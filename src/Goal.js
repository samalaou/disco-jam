class Goal extends Obstacle {
    constructor(container, containerWidthVW, containerHeightVH) {
        super(container, containerWidthVW, containerHeightVH);

        this.position.x = (containerWidthVW - this.dimension.width) / 2; // Center horizontally
        this.position.y = containerHeightVH - this.dimension.height; // Position at the bottom

        updatePosition(this.element, this.position);
        this.element.id = "goal";
    }
}