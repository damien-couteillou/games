import { Ball, Player } from './shapes';

export default class Pong {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.accumulator = 0;
        this.step = 1 / 120;

        this.ball = new Ball();

        // Init players
        this.players = [
            new Player(),
            new Player(),
        ];
        this.players[0].pos.x = 40;
        this.players[1].pos.x = this.canvas.width - 40;
        this.players.forEach((player) => {
            player.pos.y = this.canvas.height / 2;
        });

        // Loop
        let lastTime;
        const callback = (millis) => {
            if (lastTime) {
                this.update((millis - lastTime) / 1000);
                this.draw();
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();

        // Score chars
        this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',
        ].map((str) => {
            const canvasTmp = document.createElement('canvas');
            canvasTmp.height = 50;
            canvasTmp.width = 30;
            const context = canvasTmp.getContext('2d');
            context.fillStyle = '#ffffff';
            str.split('').forEach((fill, i) => {
                if (fill === '1') {
                    context.fillRect(((i % 3) * 10), (i / 3 | 0) * 10, 10, 10);
                }
            });
            return canvasTmp;
        });

        this.reset();
    }

    // Check collision
    collide(player, ball) {
        if (player.left < ball.right && player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top) {
            ball.vel.x = -ball.vel.x * 1.05;
            ball.vel.y = (ball.pos.y - player.pos.y) * 3.5;
        }
    }

    // Draw on canvas
    draw() {
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawNet();

        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));

        this.drawScore();
    }

    // Draw the net
    drawNet() {
        this.context.fillStyle = '#ffffff';
        for (let i = -10; i < this.canvas.height; i += 40) {
            this.context.fillRect((this.canvas.width / 2) - 1, i, 2, 20);
        }
    }

    // Draw ball and players
    drawRect(rect) {
        this.context.fillStyle = '#ffffff';
        this.context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    // Draw score
    drawScore() {
        const align = this.canvas.width / 3;
        this.players.forEach((player, i) => {
            const chars = player.score.toString().split('');
            const offset = ((align * (i + 1)) - ((40 * chars.length) / 2)) + (10 / 2);
            chars.forEach((char, pos) => {
                this.context.drawImage(this.CHARS[char | 0], offset + (pos * 40), 20);
            });
        });
    }

    // Reset ball to center if a player win
    reset() {
        this.ball.pos.x = this.canvas.width / 2;
        this.ball.pos.y = this.canvas.height / 2;

        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }

    // Init velocity for ball
    start() {
        if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
            this.ball.vel.x = 200 * (Math.random() > 0.5 ? 1 : -1);
            this.ball.vel.y = 200 * Math.random();
        }
    }

    // Calculate movements
    simulate(dt) {
        // Move ball
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;

        // Check if player win
        if (this.ball.left < 0 || this.ball.right > this.canvas.width) {
            const playerId = this.ball.vel.x < 0 | 0;
            this.players[playerId].score += 1;
            this.reset();
        }

        // Bounce on top and bottom
        if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {
            this.ball.vel.y *= -1;
        }

        // Basic AI
        if (this.ball.pos.y < this.players[1].bottom - 20) {
            this.players[1].pos.y -= 1;
        }
        if (this.ball.pos.y > this.players[1].top + 20) {
            this.players[1].pos.y += 1;
        }

        // Check ball collision with player
        this.players.forEach(player => this.collide(player, this.ball));
    }

    // Safe update method with constant dt
    update(dt) {
        this.accumulator += dt;
        while (this.accumulator > this.step) {
            this.simulate(this.step);
            this.accumulator -= this.step;
        }
    }
}
