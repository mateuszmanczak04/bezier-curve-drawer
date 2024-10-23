var Point = (function () {
    function Point(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
    return Point;
}());
var Chart = (function () {
    function Chart(canvasId) {
        var canvas = document.getElementById(canvasId);
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
    Chart.prototype.setDrawingPrecision = function (precision) {
        this.drawingPrecision = precision;
    };
    Chart.prototype.addPoint = function (x, y) {
        this.points.push(new Point(x, y));
    };
    Chart.prototype.clearCanvas = function () {
        this.ctx.reset();
    };
    Chart.prototype.drawCurve = function (A, B, C, D) {
        var ctx = this.ctx;
        ctx.moveTo(A.x, A.y);
        ctx.beginPath();
        for (var t = 0; t <= 1; t += this.drawingPrecision) {
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
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    };
    Chart.prototype.drawHelperLines = function (A, B, C, D) {
        var ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = this.helperLineColor;
        ctx.lineWidth = this.helperLineWidth;
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
        ctx.moveTo(C.x, C.y);
        ctx.lineTo(D.x, D.y);
        ctx.stroke();
    };
    Chart.prototype.drawPoints = function () {
        var _this = this;
        var points = this.points;
        var ctx = this.ctx;
        ctx.beginPath();
        ctx.fillStyle = this.pointColor;
        points.forEach(function (point) {
            ctx.moveTo(point.x, point.y);
            ctx.ellipse(point.x, point.y, _this.pointRadius, _this.pointRadius, Math.PI, 0, Math.PI * 2);
        });
        ctx.fill();
    };
    Chart.prototype.repaint = function () {
        var points = this.points;
        this.clearCanvas();
        for (var i = 0; i < points.length - 1; i += 3) {
            this.drawHelperLines(points[i + 0], points[i + 1], points[i + 2], points[i + 3]);
            this.drawCurve(points[i + 0], points[i + 1], points[i + 2], points[i + 3]);
        }
        this.drawPoints();
    };
    return Chart;
}());
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
var isDrawing = false;
var registerMouseEvents = function () {
    window.addEventListener('mousedown', function () {
        isDrawing = true;
    });
    window.addEventListener('mouseup', function () {
        isDrawing = false;
    });
    window.addEventListener('mousemove', function (e) {
        if (isDrawing) {
        }
    });
};
var chart = new Chart('canvas');
points.forEach(function (p) { return chart.addPoint(p.x, p.y); });
chart.repaint();
registerMouseEvents();
//# sourceMappingURL=app.js.map