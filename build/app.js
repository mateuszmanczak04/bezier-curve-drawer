var Point = (function () {
    function Point(_x, _y, _ctx) {
        this._x = _x;
        this._y = _y;
        this._ctx = _ctx;
        this._radiusX = 5;
        this._radiusY = 5;
    }
    Object.defineProperty(Point.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: false,
        configurable: true
    });
    Point.prototype.draw = function () {
        this._ctx.ellipse(this._x, this._y, this._radiusX, this._radiusY, Math.PI, 0, 2 * Math.PI);
        this._ctx.fill();
        this._ctx.closePath();
    };
    return Point;
}());
var canvas = document.querySelector('#canvas');
canvas.style.backgroundColor = '#ddd';
var ctx = canvas.getContext('2d');
if (!ctx)
    throw new Error('Canvas context not found!');
ctx.clearRect(0, 0, 500, 500);
ctx.strokeStyle = '#222';
ctx.fillStyle = '#444';
var points = [
    new Point(100, 100, ctx),
    new Point(300, 120, ctx),
    new Point(150, 300, ctx),
    new Point(400, 400, ctx),
];
points.forEach(function (point) { return point.draw(); });
var A = points[0], B = points[1], C = points[2], D = points[3];
//# sourceMappingURL=app.js.map