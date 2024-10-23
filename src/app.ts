class Point {
	declare x;
	declare y;
	constructor(_x: number, _y: number) {
		this.x = _x;
		this.y = _y;
	}
}

class Chart {
	declare canvas: HTMLCanvasElement;
	declare ctx: CanvasRenderingContext2D;
	declare points: Point[];
	declare drawingPrecision: number;
	declare width: number;
	declare height: number;
	declare pointRadius: number;
	declare lineWidth: number;
	declare helperLineWidth: number;
	declare lineColor: string;
	declare helperLineColor: string;
	declare canvasBackgroundColor: string;
	declare pointColor: string;

	/**
	 * @param canvasId id of the canvas in DOM
	 */
	constructor(canvasId: string) {
		const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.points = [];
		this.drawingPrecision = 0.01;
		this.width = 1200;
		this.height = 800;
		this.pointRadius = 8;
		this.lineWidth = 3;
		this.lineColor = '#000';
		this.helperLineWidth = 1;
		this.helperLineColor = '#444';
		this.canvasBackgroundColor = '#eee';
		this.pointColor = '#f00';

		this.canvas.style.backgroundColor = this.canvasBackgroundColor;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}

	/**
	 * @param precision The smaller number is passed here, the better precision we get. By default Chart's class objects have it equal to 0.01
	 */
	setDrawingPrecision(precision: number) {
		this.drawingPrecision = precision;
	}

	/**
	 * Replace all existing points with new array.
	 */
	setPoints(points: Point[]) {
		this.points = points;
	}

	/**
	 * Appends a new point to the points array
	 * @param x horizontal position of the point (from left)
	 * @param y vertical position of the point (from top)
	 */
	addPoint(x: number, y: number) {
		this.points.push(new Point(x, y));
	}

	// Rest canvas to the start state
	private clearCanvas() {
		this.ctx.reset();
	}

	// Bezier curve joining A-D
	private drawCurve(A: Point, B: Point, C: Point, D: Point) {
		const ctx = this.ctx;
		ctx.moveTo(A.x, A.y);
		ctx.beginPath();

		for (let t = 0; t <= 1; t += this.drawingPrecision) {
			const x =
				A.x * (1 - t) ** 3 +
				3 * B.x * t * (1 - t) ** 2 +
				3 * C.x * t ** 2 * (1 - t) +
				D.x * t ** 3;
			const y =
				A.y * (1 - t) ** 3 +
				3 * B.y * t * (1 - t) ** 2 +
				3 * C.y * t ** 2 * (1 - t) +
				D.y * t ** 3;
			ctx.lineTo(x, y);
		}
		ctx.lineTo(D.x, D.y);
		ctx.strokeStyle = this.lineColor;
		ctx.lineWidth = this.lineWidth;
		ctx.stroke();
	}

	// Lines between A-B and C-D
	private drawHelperLines(A: Point, B: Point, C: Point, D: Point) {
		const ctx = this.ctx;
		ctx.beginPath();
		ctx.strokeStyle = this.helperLineColor;
		ctx.lineWidth = this.helperLineWidth;
		ctx.moveTo(A.x, A.y);
		ctx.lineTo(B.x, B.y);
		ctx.stroke();
		ctx.moveTo(C.x, C.y);
		ctx.lineTo(D.x, D.y);
		ctx.stroke();
	}

	// Draws points circles
	private drawPoints() {
		const points = this.points;
		const ctx = this.ctx;
		ctx.beginPath();
		ctx.fillStyle = this.pointColor;
		points.forEach((point) => {
			ctx.moveTo(point.x, point.y);
			ctx.ellipse(
				point.x,
				point.y,
				this.pointRadius,
				this.pointRadius,
				Math.PI,
				0,
				Math.PI * 2,
			);
		});
		ctx.fill();
	}

	// Clears canvas and paints all we need to see
	repaint() {
		const points = this.points;
		this.clearCanvas();
		for (let i = 0; i < points.length - 1; i += 3) {
			this.drawHelperLines(points[i + 0], points[i + 1], points[i + 2], points[i + 3]);
			this.drawCurve(points[i + 0], points[i + 1], points[i + 2], points[i + 3]);
		}
		this.drawPoints();
	}
}

// Array of coordinates of points, it changes on every point drag
const points = [
	new Point(100, 100), // Starting point
	new Point(400, 20),
	new Point(50, 480),
	new Point(400, 400), // Common point
	new Point(800, 300),
	new Point(500, 100),
	new Point(800, 200), // Common point
	new Point(1000, 500),
	new Point(900, 650),
	new Point(500, 700), // End point
];

// Drawing with mouse functionality
let isDrawing = false;
const registerMouseEvents = () => {
	// Press mouse button and start drawing
	window.addEventListener('mousedown', () => {
		isDrawing = true;
	});

	// Release mouse button and stop drawing
	window.addEventListener('mouseup', () => {
		isDrawing = false;
	});

	// Draw a custom mouse shape
	window.addEventListener('mousemove', (e) => {
		if (isDrawing) {
			// TODO: draw line
		}
	});
};

// Start app
const chart = new Chart('canvas');
chart.setPoints(points)
chart.repaint();

registerMouseEvents();
