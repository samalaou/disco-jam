class Obstacle {
    constructor(container, containerWidthVW, containerHeightVH) {
        this.container = container;
        this.containerWidthVW = containerWidthVW;
        this.containerHeightVH = containerHeightVH;
        this.widthVW = DEFAULT_WIDTH;
        this.heightVH = DEFAULT_HIEGHT;
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