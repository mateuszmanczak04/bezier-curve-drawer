var canvas = document.querySelector('#canvas');
canvas.style.backgroundColor = '#ddd';
var ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, 500, 500);
ctx.strokeStyle = '#222';
ctx.fillStyle = '#444';
ctx.moveTo(100, 100);
ctx.lineTo(200, 200);
ctx.stroke();
//# sourceMappingURL=app.js.map