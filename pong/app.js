var canvas;
var canvasContext;
var ball = {
	width: 10,
	height: 10,
	px: 395,
	py: 295,
	vx: 10,
	vy: 10
};
const paddleWidth = 10;
const paddleHeight = 100;
var paddlePlayerY = 250;
var paddleAiY = 250;
var score = {
	player: 0,
	ai: 0,
	max: 3
};
var gameOver = false;

function mouseMvt(e) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	mouseX = e.clientX - rect.left - root.scrollLeft;
	mouseY = e.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	};
}

window.onload = function() {
	canvas = document.querySelector('#app');
	canvasContext = canvas.getContext('2d');

	setInterval(function(){
		move();
		draw();
	}, 1000/30);

	canvas.addEventListener('mousemove', function(e){
		var mouse = mouseMvt(e);
		paddlePlayerY = mouse.y - paddleHeight/2;
	});

	canvas.addEventListener('mousedown', function(){
		if (gameOver) {
			score.player = score.ai = 0;
			gameOver = false;
		}
	});
}

function draw() {
	// BG
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	canvasContext.fillStyle = 'white';
	canvasContext.font = '50px Arial';

	if (gameOver) {
		canvasContext.fillText('GAME OVER', 260, 250);
		canvasContext.font = '30px Arial';
		canvasContext.fillText('Click to continue', 300, 350);
		return;
	}
	// Net
	for (var i = 0; i < canvas.height; i+=40) {
		canvasContext.fillRect(canvas.width/2-1, i, 2, 20);
	}

	// Paddles
	canvasContext.fillRect(0, paddlePlayerY, paddleWidth, paddleHeight)
	canvasContext.fillRect(canvas.width-paddleWidth, paddleAiY, paddleWidth, paddleHeight)
	// BALL
	canvasContext.fillRect(ball.px, ball.py, ball.width, ball.width);

	// Score
	canvasContext.fillText(score.player, 150, 100);
	canvasContext.fillText(score.ai, canvas.width-150, 100);
}

function moveAi() {
	paddleCenter = paddleAiY+paddleHeight/2;
	if (paddleCenter < ball.py-35) {
		paddleAiY += 6;
	} else if(paddleCenter > ball.py+35) {
		paddleAiY -= 6;
	}
}

function move() {
	if (gameOver) {
		return;
	}
	moveAi();

	ball.px += ball.vx;
	ball.py += ball.vy;
	// Right side / AI side
	if (ball.px >= canvas.width-ball.width-paddleWidth) {
		ballReset(paddleAiY, 'player');
	}
	// Left side / Player side
	if (ball.px <= paddleWidth) {
		ballReset(paddlePlayerY, 'ai');
	}
	// bounce top/bottom
	if (ball.py >= canvas.height-ball.height || ball.py <= 0) {
		ball.vy *= -1;
	}
}

function ballReset(paddleY, scorer) {
	ball.vx *= -1;
	// if hit paddle
	if (ball.py > paddleY && 
		ball.py < paddleY+paddleHeight) {
		var deltaY = ball.py - (paddleY+paddleHeight/2);
		ball.vy = deltaY * 0.35;
	} else { // else reset
		score[scorer]++;
		if (score[scorer] >= score.max) {
			gameOver = true;
		}
		ball.px = canvas.width/2 - ball.width/2;
		ball.py = canvas.height/2 - ball.height/2;
	}
}