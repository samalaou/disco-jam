class Goal extends Obstacle {
    constructor(container, containerWidthVW, containerHeightVH) {
        super(container, containerWidthVW, containerHeightVH);

        this.position.x = (containerWidthVW - this.dimension.width) / 2; // Center horizontally
        this.position.y = containerHeightVH - this.dimension.height; // Position at the bottom

        this.updateDomElement();
        this.element.id = "goal";
    }

    updateDomElement() {
        this.element.style.left = `${this.position.x}vw`;
        this.element.style.top = `${this.position.y}vh`;
    }
}
