class Vec {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
}

class Rect {
	constructor(width, height) {
		this.pos = new Vec;
		this.size = new Vec(width, height);
	}

	get top() {
		return this.pos.y - this.size.y / 2;
	}

	get left() {
		return this.pos.x - this.size.x / 2;
	}

	get bottom() {
		return this.pos.y + this.size.y / 2;
	}

	get right() {
		return this.pos.x + this.size.x / 2;
	}
}

class Ball extends Rect {
	constructor() {
		super(10, 10);
		this.vel = new Vec;
	}
}

class Player extends Rect {
	constructor() {
		super(10, 80);
		this.score = 0;
	}
}