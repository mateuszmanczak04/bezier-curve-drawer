class Point {
	declare x;
	declare y;
	constructor(_x: number, _y: number) {
		this.x = _x;
		this.y = _y;
	}
}

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Canvas context not found!');

const points = [new Point(100, 100), new Point(400, 20), new Point(50, 480), new Point(400, 400)];

const clearCanvas = () => {
	console.log('clearCanvas');
	ctx.reset();
};

const drawCurve = (A: Point, B: Point, C: Point, D: Point) => {
	console.log('drawCurve');
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

const drawHelperLines = (A: Point, B: Point, C: Point, D: Point) => {
	console.log('drawHelperLines');
	ctx.strokeStyle = '#aaa';
	ctx.moveTo(A.x, A.y);
	ctx.lineTo(B.x, B.y);
	ctx.stroke();
	ctx.moveTo(C.x, C.y);
	ctx.lineTo(D.x, D.y);
	ctx.stroke();
};

const drawPoints = (points: Point[]) => {
	console.log('drawPoints');
	ctx.fillStyle = '#444';
	points.forEach((point) => {
		ctx.moveTo(point.x, point.y);
		ctx.ellipse(point.x, point.y, 8, 8, Math.PI, 0, Math.PI * 2);
	});
	ctx.fill();
};

const repaint = (points: Point[]) => {
	console.table(points);
	clearCanvas();
	drawCurve(points[0], points[1], points[2], points[3]);
	drawHelperLines(points[0], points[1], points[2], points[3]);
	drawPoints(points);
};

// Element wrapping entire canvas
const wrapper = document.getElementById('wrapper');
const wrapperRect = wrapper.getBoundingClientRect();
const wrapperX = wrapperRect.left;
const wrapperY = wrapperRect.top;
const pointsWrapper = document.getElementById('points');

// Used to track currently dragged point
// -1 means that no point is selected
let currentPointIndex: number = -1;

const recreateDOMPoints = (points: Point[]) => {
	pointsWrapper.innerHTML = null;

	points.forEach((p, index) => {
		const point = document.createElement('div');
		point.style.position = 'absolute';
		point.style.width = '16px';
		point.style.height = '16px';
		point.style.left = `${p.x - 8}px`;
		point.style.top = `${p.y - 8}px`;
		point.style.backgroundColor = 'red';
		point.style.borderRadius = '50%';

		point.addEventListener('mousedown', () => {
			currentPointIndex = index;
		});

		pointsWrapper.appendChild(point);
	});
};

const registerMouseEvents = () => {
	window.addEventListener('mouseup', () => {
		if (currentPointIndex === -1) return;
		currentPointIndex = -1;
		repaint(points);
		recreateDOMPoints(points);
	});

	window.addEventListener('mousemove', (e) => {
		if (currentPointIndex === -1) return;
		points[currentPointIndex].x = e.clientX - wrapperX;
		points[currentPointIndex].y = e.clientY - wrapperY;
	});
};

repaint(points);
recreateDOMPoints(points);
registerMouseEvents();
