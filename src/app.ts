const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
canvas.style.backgroundColor = '#ddd';

const ctx = canvas.getContext('2d');

// Reset canvas state
ctx.clearRect(0, 0, 500, 500);

// Setup colors
ctx.strokeStyle = '#222';
ctx.fillStyle = '#444';

ctx.moveTo(100, 100);
ctx.lineTo(200, 200);
ctx.stroke();
