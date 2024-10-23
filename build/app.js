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
        this.startingLineColor = '#00f';
        this.isDrawingWithMouse = false;
        this.isDrawingWithMouseEnabled = false;
        this.canvas.style.backgroundColor = this.canvasBackgroundColor;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.registerMouseDrawingFunctionality();
    }
    Chart.prototype.setDrawingWithMouseEnabled = function (value) {
        this.isDrawingWithMouseEnabled = value;
    };
    Chart.prototype.registerMouseDrawingFunctionality = function () {
        var _this = this;
        window.addEventListener('mousedown', function () {
            if (!_this.isDrawingWithMouseEnabled)
                return;
            _this.isDrawingWithMouse = true;
        });
        window.addEventListener('mouseup', function () {
            if (!_this.isDrawingWithMouseEnabled)
                return;
            _this.isDrawingWithMouse = false;
        });
        window.addEventListener('mousemove', function (e) {
            if (!_this.isDrawingWithMouseEnabled)
                return;
            if (_this.isDrawingWithMouse) {
                _this.ctx.fillStyle = _this.startingLineColor;
                _this.ctx.beginPath();
                _this.ctx.ellipse(e.clientX, e.clientY, 5, 5, Math.PI, 0, Math.PI * 2);
                _this.ctx.fill();
            }
        });
    };
    Chart.prototype.setDrawingPrecision = function (precision) {
        this.drawingPrecision = precision;
    };
    Chart.prototype.setDegree = function (degree) {
        this.curveDegree = degree;
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
        ctx.strokeStyle = this.helperLineColor;
        ctx.lineWidth = this.helperLineWidth;
        ctx.beginPath();
        for (var i = 0; i < points.length - 1; i++) {
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[i + 1].x, points[i + 1].y);
        }
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
            this.drawHelperLines(points.slice(i, i + this.curveDegree + 1));
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
    new Point(300, 200),
    new Point(600, 500),
    new Point(300, 600),
];
var chart = new Chart('canvas');
chart.setPoints(points);
chart.setDegree(points.length - 1);
chart.repaint();
var drawingWithMouseCheckbox = document.getElementById('drawing-mouse');
drawingWithMouseCheckbox.addEventListener('change', function (e) {
    var target = e.target;
    chart.setDrawingWithMouseEnabled(target.checked);
});
//# sourceMappingURL=app.js.map