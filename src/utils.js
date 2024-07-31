function getParentDimensions(container) {
    const containerRect = container.getBoundingClientRect();
    containerWidthVW = containerRect.width / window.innerWidth * 100; // Convert to vw
    containerHeightVH = containerRect.height / window.innerHeight * 100; // Convert to vh
    return [containerWidthVW, containerHeightVH];
}