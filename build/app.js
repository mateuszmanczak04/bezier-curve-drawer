var Point = (function () {
    function Point(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
    return Point;
}());
var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
if (!ctx)
    throw new Error('Canvas context not found!');
var points = [new Point(100, 100), new Point(400, 20), new Point(50, 480), new Point(400, 400)];
var clearCanvas = function () {
    console.log('clearCanvas');
    ctx.reset();
};
var drawCurve = function (A, B, C, D) {
    console.log('drawCurve');
    ctx.moveTo(A.x, A.y);
    for (var t = 0; t <= 1; t += 0.001) {
        var x = A.x * Math.pow((1 - t), 3) +
            3 * B.x * t * Math.pow((1 - t), 2) +
            3 * C.x * Math.pow(t, 2) * (1 - t) +
            D.x * Math.pow(t, 3);
        var y = A.y * Math.pow((1 - t), 3) +
            3 * B.y * t * Math.pow((1 - t), 2) +
            3 * C.y * Math.pow(t, 2) * (1 - t) +
            D.y * Math.pow(t, 3);
        ctx.moveTo(x, y);
        ctx.ellipse(x, y, 1, 1, Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
};
var drawHelperLines = function (A, B, C, D) {
    console.log('drawHelperLines');
    ctx.strokeStyle = '#aaa';
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
    ctx.moveTo(C.x, C.y);
    ctx.lineTo(D.x, D.y);
    ctx.stroke();
};
var drawPoints = function (points) {
    console.log('drawPoints');
    ctx.fillStyle = '#444';
    points.forEach(function (point) {
        ctx.moveTo(point.x, point.y);
        ctx.ellipse(point.x, point.y, 8, 8, Math.PI, 0, Math.PI * 2);
    });
    ctx.fill();
};
var repaint = function (points) {
    console.table(points);
    clearCanvas();
    drawCurve(points[0], points[1], points[2], points[3]);
    drawHelperLines(points[0], points[1], points[2], points[3]);
    drawPoints(points);
};
var wrapper = document.getElementById('wrapper');
var wrapperRect = wrapper.getBoundingClientRect();
var wrapperX = wrapperRect.left;
var wrapperY = wrapperRect.top;
var pointsWrapper = document.getElementById('points');
var currentPointIndex = -1;
var recreateDOMPoints = function (points) {
    pointsWrapper.innerHTML = null;
    points.forEach(function (p, index) {
        var point = document.createElement('div');
        point.style.position = 'absolute';
        point.style.width = '16px';
        point.style.height = '16px';
        point.style.left = "".concat(p.x - 8, "px");
        point.style.top = "".concat(p.y - 8, "px");
        point.style.backgroundColor = 'red';
        point.style.borderRadius = '50%';
        point.addEventListener('mousedown', function () {
            currentPointIndex = index;
        });
        pointsWrapper.appendChild(point);
    });
};
var registerMouseEvents = function () {
    window.addEventListener('mouseup', function () {
        if (currentPointIndex === -1)
            return;
        currentPointIndex = -1;
        repaint(points);
        recreateDOMPoints(points);
    });
    window.addEventListener('mousemove', function (e) {
        if (currentPointIndex === -1)
            return;
        points[currentPointIndex].x = e.clientX - wrapperX;
        points[currentPointIndex].y = e.clientY - wrapperY;
    });
};
repaint(points);
recreateDOMPoints(points);
registerMouseEvents();
//# sourceMappingURL=app.js.map