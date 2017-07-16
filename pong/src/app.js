import Pong from './pong';

const canvas = document.querySelector('#app');
const pong = new Pong(canvas);

// Mouse mvt for player 1
canvas.addEventListener('mousemove', (event) => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
});

// Click to start
canvas.addEventListener('click', () => {
    pong.start();
});
