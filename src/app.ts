class Point {
	declare x;
	declare y;
	constructor(_x: number, _y: number) {
		this.x = _x;
		this.y = _y;
	}
}

// Setup consts and DOM elements
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const POINT_RADIUS = 8;

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.backgroundColor = '#DDD';

// Element wrapping entire canvas, we need its bounding rect
// to position points absolutely
const wrapper = document.getElementById('wrapper');
const wrapperRect = wrapper.getBoundingClientRect();
const wrapperX = wrapperRect.left;
const wrapperY = wrapperRect.top;

// Overlay for the canvas where points are displayed absolutely
const pointsWrapper = document.getElementById('points-wrapper');
pointsWrapper.style.width = `${CANVAS_WIDTH}px`;
pointsWrapper.style.height = `${CANVAS_HEIGHT}px`;

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

// Array of points as DOM elements
const pointsElements: HTMLDivElement[] = points.map((point, index) => {
	const pointElement = document.createElement('div');
	pointElement.classList.add('point');
	pointElement.style.left = `${point.x - 8}px`;
	pointElement.style.top = `${point.y - 8}px`;
	pointElement.style.width = `${2 * POINT_RADIUS}px`;
	pointElement.style.height = `${2 * POINT_RADIUS}px`;

	pointElement.addEventListener('mousedown', () => {
		currentPointIndex = index;
	});

	return pointElement;
});

pointsElements.forEach((pointElement) => {
	pointsWrapper.appendChild(pointElement);
});

// Used to track currently dragged point
// -1 means that no point is selected
let currentPointIndex: number = -1;

// Ensure that canvas context is found
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Canvas context not found!');

// Rest canvas to the start state
const clearCanvas = () => {
	ctx.reset();
};

// Bezier curve joining A-D
const drawCurve = (A: Point, B: Point, C: Point, D: Point) => {
	ctx.moveTo(A.x, A.y);
	for (let t = 0; t <= 1; t += 0.001) {
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
		ctx.moveTo(x, y);
		ctx.ellipse(x, y, 1, 1, Math.PI, 0, Math.PI * 2);
		ctx.fill();
	}
};

// Lines between A-B and C-D
const drawHelperLines = (A: Point, B: Point, C: Point, D: Point) => {
	ctx.strokeStyle = '#aaa';
	ctx.moveTo(A.x, A.y);
	ctx.lineTo(B.x, B.y);
	ctx.stroke();
	ctx.moveTo(C.x, C.y);
	ctx.lineTo(D.x, D.y);
	ctx.stroke();
};

// Draws points circles
const drawPoints = (points: Point[]) => {
	ctx.fillStyle = '#444';
	points.forEach((point) => {
		ctx.moveTo(point.x, point.y);
		ctx.ellipse(point.x, point.y, POINT_RADIUS, POINT_RADIUS, Math.PI, 0, Math.PI * 2);
	});
	ctx.fill();
};

// Clears canvas and paints all we need to see
const repaint = (points: Point[]) => {
	clearCanvas();
	for (let i = 0; i < points.length - 1; i += 3) {
		drawCurve(points[i + 0], points[i + 1], points[i + 2], points[i + 3]);
		drawHelperLines(points[i + 0], points[i + 1], points[i + 2], points[i + 3]);
	}
	drawPoints(points);
};

const registerMouseEvents = () => {
	// Fired after releasing a point
	window.addEventListener('mouseup', () => {
		if (currentPointIndex === -1) return;
		currentPointIndex = -1;
		repaint(points);
	});

	// Fired when dragging a point to another position
	window.addEventListener('mousemove', (e) => {
		if (currentPointIndex === -1) return;
		points[currentPointIndex].x = e.clientX - wrapperX;
		points[currentPointIndex].y = e.clientY - wrapperY;
		pointsElements[currentPointIndex].style.left = `${e.clientX - wrapperX - POINT_RADIUS}px`;
		pointsElements[currentPointIndex].style.top = `${e.clientY - wrapperY - POINT_RADIUS}px`;
	});
};

repaint(points);
registerMouseEvents();
