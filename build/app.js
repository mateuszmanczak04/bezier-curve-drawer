var binomialCoefficient = function (n, k) {
    var result = 1;
    for (var i = 1; i <= k; i++) {
        result = (result * (n - i + 1)) / i;
    }
    return result;
};
var bernsteinPolynomial = function (n, k, t) {
    var binomialCoeff = binomialCoefficient(n, k);
    return binomialCoeff * Math.pow(t, k) * Math.pow(1 - t, n - k);
};
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
        this.curveDegree = 3;
        this.canvas.style.backgroundColor = this.canvasBackgroundColor;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    Chart.prototype.setDrawingPrecision = function (precision) {
        this.drawingPrecision = precision;
    };
    Chart.prototype.setPoints = function (points) {
        this.points = points;
    };
    Chart.prototype.addPoint = function (x, y) {
        this.points.push(new Point(x, y));
    };
    Chart.prototype.clearCanvas = function () {
        this.ctx.reset();
    };
    Chart.prototype.drawCurve = function (points) {
        var _this = this;
        var ctx = this.ctx;
        ctx.moveTo(points[0].x, points[0].y);
        ctx.beginPath();
        var _loop_1 = function (t) {
            var x = points.reduce(function (acc, point, index) {
                return acc + bernsteinPolynomial(_this.curveDegree, index, t) * point.x;
            }, 0);
            var y = points.reduce(function (acc, point, index) {
                return acc + bernsteinPolynomial(_this.curveDegree, index, t) * point.y;
            }, 0);
            ctx.lineTo(x, y);
        };
        for (var t = 0; t <= 1; t += this.drawingPrecision) {
            _loop_1(t);
        }
        ctx.lineTo(points[this.curveDegree].x, points[this.curveDegree].y);
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    };
    Chart.prototype.drawHelperLines = function (points) {
        var ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = this.helperLineColor;
        ctx.lineWidth = this.helperLineWidth;
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.stroke();
        ctx.moveTo(points[2].x, points[2].y);
        ctx.lineTo(points[3].x, points[3].y);
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
        for (var i = 0; i < points.length - 1; i += this.curveDegree) {
            var pointsToPass = points.slice(i, i + this.curveDegree + 1);
            if (pointsToPass.length < this.curveDegree + 1)
                break;
            this.drawCurve(pointsToPass);
        }
        this.drawPoints();
    };
    return Chart;
}());
var points = [
    new Point(100, 100),
    new Point(100, 400),
    new Point(200, 480),
    new Point(600, 600),
    new Point(800, 300),
    new Point(300, 100),
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
chart.setPoints(points);
chart.repaint();
registerMouseEvents();
//# sourceMappingURL=app.js.map