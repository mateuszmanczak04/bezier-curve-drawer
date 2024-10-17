var Point = (function () {
    function Point(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
    return Point;
}());
var CANVAS_WIDTH = 1200;
var CANVAS_HEIGHT = 800;
var POINT_RADIUS = 8;
var drawingPrecision = 0.01;
var canvas = document.querySelector('#canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.backgroundColor = '#DDD';
var wrapper = document.getElementById('wrapper');
var wrapperRect = wrapper.getBoundingClientRect();
var wrapperX = wrapperRect.left;
var wrapperY = wrapperRect.top;
var pointsWrapper = document.getElementById('points-wrapper');
pointsWrapper.style.width = "".concat(CANVAS_WIDTH, "px");
pointsWrapper.style.height = "".concat(CANVAS_HEIGHT, "px");
var points = [
    new Point(100, 100),
    new Point(400, 20),
    new Point(50, 480),
    new Point(400, 400),
    new Point(800, 300),
    new Point(500, 100),
    new Point(800, 200),
    new Point(1000, 500),
    new Point(900, 650),
    new Point(500, 700),
];
var pointsElements = points.map(function (point, index) {
    var pointElement = document.createElement('div');
    pointElement.classList.add('point');
    pointElement.style.left = "".concat(point.x - 8, "px");
    pointElement.style.top = "".concat(point.y - 8, "px");
    pointElement.style.width = "".concat(2 * POINT_RADIUS, "px");
    pointElement.style.height = "".concat(2 * POINT_RADIUS, "px");
    pointElement.addEventListener('mousedown', function () {
        currentPointIndex = index;
    });
    return pointElement;
});
pointsElements.forEach(function (pointElement) {
    pointsWrapper.appendChild(pointElement);
});
var currentPointIndex = -1;
var ctx = canvas.getContext('2d');
if (!ctx)
    throw new Error('Canvas context not found!');
var clearCanvas = function () {
    ctx.reset();
};
var drawCurve = function (A, B, C, D) {
    ctx.moveTo(A.x, A.y);
    ctx.beginPath();
    for (var t = 0; t <= 1; t += drawingPrecision) {
        var x = A.x * Math.pow((1 - t), 3) +
            3 * B.x * t * Math.pow((1 - t), 2) +
            3 * C.x * Math.pow(t, 2) * (1 - t) +
            D.x * Math.pow(t, 3);
        var y = A.y * Math.pow((1 - t), 3) +
            3 * B.y * t * Math.pow((1 - t), 2) +
            3 * C.y * Math.pow(t, 2) * (1 - t) +
            D.y * Math.pow(t, 3);
        ctx.lineTo(x, y);
    }
    ctx.lineTo(D.x, D.y);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
};
var drawHelperLines = function (A, B, C, D) {
    ctx.beginPath();
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
    ctx.moveTo(C.x, C.y);
    ctx.lineTo(D.x, D.y);
    ctx.stroke();
};
var drawPoints = function (points) {
    ctx.beginPath();
    ctx.fillStyle = '#444';
    points.forEach(function (point) {
        ctx.moveTo(point.x, point.y);
        ctx.ellipse(point.x, point.y, POINT_RADIUS, POINT_RADIUS, Math.PI, 0, Math.PI * 2);
    });
    ctx.fill();
};
var repaint = function (points) {
    clearCanvas();
    for (var i = 0; i < points.length - 1; i += 3) {
        drawHelperLines(points[i + 0], points[i + 1], points[i + 2], points[i + 3]);
        drawCurve(points[i + 0], points[i + 1], points[i + 2], points[i + 3]);
    }
    drawPoints(points);
};
var registerMouseEvents = function () {
    window.addEventListener('mouseup', function () {
        if (currentPointIndex === -1)
            return;
        currentPointIndex = -1;
    });
    window.addEventListener('mousemove', function (e) {
        if (currentPointIndex === -1)
            return;
        points[currentPointIndex].x = e.clientX - wrapperX;
        points[currentPointIndex].y = e.clientY - wrapperY;
        pointsElements[currentPointIndex].style.left = "".concat(e.clientX - wrapperX - POINT_RADIUS, "px");
        pointsElements[currentPointIndex].style.top = "".concat(e.clientY - wrapperY - POINT_RADIUS, "px");
        repaint(points);
    });
};
var precisionInputElement = document.getElementById('precision-input');
precisionInputElement.value = drawingPrecision.toString();
var precisionSubmitButton = document.getElementById('precision-button');
precisionSubmitButton.addEventListener('click', function () {
    drawingPrecision = parseFloat(precisionInputElement.value || '0.1');
    repaint(points);
});
repaint(points);
registerMouseEvents();
//# sourceMappingURL=app.js.map