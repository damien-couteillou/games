export default class Tetris {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        // Loop
        let lastTime;
        const callback = (millis) => {
            if (lastTime) {
                // this.update((millis - lastTime) / 1000);
                this.draw();
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();
    }

    // Draw on canvas
    draw() {
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
