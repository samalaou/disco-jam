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
