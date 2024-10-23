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
        this.width = 500;
        this.height = 500;
        this.pointRadius = 8;
        this.lineWidth = 3;
        this.lineColor = '#000';
        this.helperLineWidth = 1;
        this.helperLineColor = '#444';
        this.canvasBackgroundColor = '#eee';
        this.pointColor = '#f00';
        this.curveDegree = 3;
        this.startingLineColor = '#00f';
        this.canvas.style.backgroundColor = this.canvasBackgroundColor;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.isDrawingLine = false;
        this.isDrawignLineEnabled = false;
        this.isDrawingPointsEnabled = false;
        this.registerLineDrawingEvents();
        this.registerPointsDrawingEvents();
    }
    Chart.prototype.setDimensions = function (width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    };
    Chart.prototype.setDrawingLineEnabled = function (value) {
        this.isDrawignLineEnabled = value;
    };
    Chart.prototype.registerLineDrawingEvents = function () {
        var _this = this;
        window.addEventListener('mousedown', function () {
            if (!_this.isDrawignLineEnabled)
                return;
            _this.isDrawingLine = true;
        });
        window.addEventListener('mouseup', function () {
            if (!_this.isDrawignLineEnabled)
                return;
            _this.isDrawingLine = false;
        });
        window.addEventListener('mousemove', function (e) {
            if (!_this.isDrawignLineEnabled)
                return;
            if (_this.isDrawingLine) {
                _this.ctx.fillStyle = _this.startingLineColor;
                _this.ctx.beginPath();
                _this.ctx.ellipse(e.clientX, e.clientY, 5, 5, Math.PI, 0, Math.PI * 2);
                _this.ctx.fill();
            }
        });
    };
    Chart.prototype.setDrawingPointsEnabled = function (value) {
        this.isDrawingPointsEnabled = value;
    };
    Chart.prototype.registerPointsDrawingEvents = function () {
        var _this = this;
        if (!this.canvas)
            return;
        this.canvas.addEventListener('click', function (e) {
            if (!_this.isDrawingPointsEnabled)
                return;
            _this.addPoint(e.clientX, e.clientY);
            _this.drawPoints();
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
var chart = new Chart('canvas');
chart.setDegree(3);
chart.setDimensions(window.innerWidth, window.innerHeight);
var drawingLineCheckbox = document.getElementById('drawing-line');
drawingLineCheckbox.addEventListener('change', function (e) {
    var target = e.target;
    chart.setDrawingLineEnabled(target.checked);
});
var drawingPointsCheckbox = document.getElementById('drawing-points');
drawingPointsCheckbox.addEventListener('change', function (e) {
    var target = e.target;
    chart.setDrawingPointsEnabled(target.checked);
});
var curveDegreeInput = document.getElementById('curve-degree');
var saveCurveDegreeButton = document.getElementById('save-degree');
saveCurveDegreeButton.addEventListener('click', function () {
    chart.setDegree(parseInt(curveDegreeInput.value));
});
var drawButton = document.getElementById('draw-button');
drawButton.addEventListener('click', function () {
    chart.repaint();
});
var resetPointsButton = document.getElementById('reset-points-button');
resetPointsButton.addEventListener('click', function () {
    chart.setPoints([]);
});
var clearCanvasButton = document.getElementById('clear-canvas-button');
clearCanvasButton.addEventListener('click', function () {
    chart.clearCanvas();
});
//# sourceMappingURL=app.js.map