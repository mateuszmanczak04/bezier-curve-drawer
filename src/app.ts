/**
 * Computes the binomial coefficient, also known as "n choose k", which represents
 * the number of ways to choose `k` elements from a set of `n` elements without regard to order.
 *
 * Mathematically, it's given by:
 *
 *          n!
 * C(n, k) = -----
 *          k!(n-k)!
 *
 * @param n - The total number of elements in the set.
 * @param k - The number of elements to choose.
 * @returns The binomial coefficient (n choose k), which is an integer value.
 */
const binomialCoefficient = (n: number, k: number): number => {
	let result = 1;
	for (let i = 1; i <= k; i++) {
		result = (result * (n - i + 1)) / i;
	}
	return result;
};

/**
 * Computes the value of a Bernstein polynomial, which is a part of the basis used in Bezier curves.
 * The polynomial is defined as:
 *
 * B_{n,k}(t) = C(n, k) * t^k * (1 - t)^(n - k)
 *
 * Where C(n, k) is the binomial coefficient "n choose k".
 *
 * @param n - The degree of the polynomial, representing the total number of control points - 1.
 * @param k - The index of the specific Bernstein polynomial.
 * @param t - The parameter in the range [0, 1], representing the interpolation value.
 * @returns The value of the Bernstein polynomial B_{n,k}(t), which is used for calculating Bezier curves.
 */
const bernsteinPolynomial = (n: number, k: number, t: number): number => {
	const binomialCoeff = binomialCoefficient(n, k);
	return binomialCoeff * Math.pow(t, k) * Math.pow(1 - t, n - k);
};

class Point {
	declare x;
	declare y;
	constructor(_x: number, _y: number) {
		this.x = _x;
		this.y = _y;
	}
}

class Chart {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private points: Point[];
	private drawingPrecision: number;
	private width: number;
	private height: number;
	private pointRadius: number;
	private lineWidth: number;
	private helperLineWidth: number;
	private lineColor: string;
	private helperLineColor: string;
	private canvasBackgroundColor: string;
	private pointColor: string;
	private curveDegree: number;

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
		this.curveDegree = 3;

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
	 * @param degree new degree of the bezier curve (default 3). Must be <= points.length - 1
	 */
	setDegree(degree: number) {
		this.curveDegree = degree;
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

	/**
	 * Resets state of the canvas.
	 */
	private clearCanvas() {
		this.ctx.reset();
	}

	/**
	 * Draws a line between main points (interpolates them)
	 * It has a width of this.lineWidth (default 3) and color of this.lineColor (default #000).
	 * @param points points of the current curve fragment. Their amount must be equal to this.drawingPrecision + 1
	 */
	private drawCurve(points: Point[]) {
		const ctx = this.ctx;
		ctx.moveTo(points[0].x, points[0].y);
		ctx.beginPath();

		for (let t = 0; t <= 1; t += this.drawingPrecision) {
			const x = points.reduce(
				(acc, point, index) =>
					acc + bernsteinPolynomial(this.curveDegree, index, t) * point.x,
				0,
			);
			const y = points.reduce(
				(acc, point, index) =>
					acc + bernsteinPolynomial(this.curveDegree, index, t) * point.y,
				0,
			);
			ctx.lineTo(x, y);
		}
		ctx.lineTo(points[this.curveDegree].x, points[this.curveDegree].y);
		ctx.strokeStyle = this.lineColor;
		ctx.lineWidth = this.lineWidth;
		ctx.stroke();
	}

	/**
	 * Draw helper lines to show how our control points affect the main curve.
	 * It has a width of this.helperLineWidth (default 1) and color of this.helperLineColor (default #444)
	 * @param A First point (interpolated)
	 * @param B Second point (control)
	 * @param C Third point (control)
	 * @param D Last point (interpolated)
	 */
	private drawHelperLines(points: Point[]) {
		const ctx = this.ctx;
		ctx.strokeStyle = this.helperLineColor;
		ctx.lineWidth = this.helperLineWidth;
		ctx.beginPath();
		for (let i = 0; i < points.length - 1; i++) {
			ctx.moveTo(points[i].x, points[i].y);
			ctx.lineTo(points[i + 1].x, points[i + 1].y);
		}
		ctx.stroke();
	}

	/**
	 * Draws dots where points should appear. It has a radius of this.pointsRadius (default 8) and color of this.pointColor (default #f00).
	 */
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

	/**
	 * Clears canvas and draws the expected chart based on it's points.
	 */
	repaint() {
		const points = this.points;
		this.clearCanvas();
		for (let i = 0; i < points.length - 1; i += this.curveDegree) {
			const pointsToPass = points.slice(i, i + this.curveDegree + 1);

			if (pointsToPass.length < this.curveDegree + 1) break;

			this.drawHelperLines(points.slice(i, i + this.curveDegree + 1));
			this.drawCurve(pointsToPass);
		}
		this.drawPoints();
	}
}

// Array of coordinates of points, it changes on every point drag
const points = [
	new Point(100, 100),
	new Point(100, 400),
	new Point(200, 480),
	new Point(600, 600),
	new Point(800, 300),
	new Point(300, 100),
	new Point(300, 200),
	new Point(600, 500),
	new Point(300, 600),
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
chart.setPoints(points);
chart.setDegree(points.length - 1); 
chart.repaint();


registerMouseEvents();
