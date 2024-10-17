class Point {
	_radiusX = 5;
	_radiusY = 5;

	constructor(
		private _x: number,
		private _y: number,
		private _ctx: CanvasRenderingContext2D,
	) {}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	draw() {
		this._ctx.ellipse(this._x, this._y, this._radiusX, this._radiusY, Math.PI, 0, 2 * Math.PI);
		this._ctx.fill();
		this._ctx.closePath();
	}
}

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
canvas.style.backgroundColor = '#ddd';

const ctx = canvas.getContext('2d');

if (!ctx) throw new Error('Canvas context not found!');

// Reset canvas state
ctx.clearRect(0, 0, 500, 500);

// Setup colors
ctx.strokeStyle = '#222';
ctx.fillStyle = '#444';

const points = [
	new Point(100, 100, ctx),
	new Point(300, 120, ctx),
	new Point(150, 300, ctx),
	new Point(400, 400, ctx),
];

points.forEach((point) => point.draw());

const [A, B, C, D] = points;
