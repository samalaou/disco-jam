function getParentDimensions(container) {
    const containerRect = container.getBoundingClientRect();
    containerWidthVW = containerRect.width / window.innerWidth * 100; // Convert to vw
    containerHeightVH = containerRect.height / window.innerHeight * 100; // Convert to vh
    return [containerWidthVW, containerHeightVH];
}

function isOverlapping(positionA, dimensionA, positionB, dimensionB) {
    return (
        positionA.x < positionB.x + dimensionB.width &&
        positionA.x + dimensionA.width > positionB.x &&
        positionA.y < positionB.y + dimensionB.height &&
        positionA.y + dimensionA.height > positionB.y
    );
}
