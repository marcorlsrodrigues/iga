var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    ball = new Ball(6,'blue'),
    vx = 1,
    vy = 1;

canvas.style.background = '#66ff66';

ball.x = getRandomArbitrary(0,canvas.width);
ball.y = getRandomArbitrary(0,canvas.height);

ball.draw(context);

canvas.addEventListener('mouseup', drawFrame, false);

function drawFrame(){
    window.requestAnimationFrame(drawFrame, canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);

    var left = 0,
    right = canvas.width,
    top = 0,
    bottom = canvas.height;

    ball.x += vx;
    ball.y += vy;

	if (ball.x + ball.radius > right) {
      ball.x = right - ball.radius;
      vx *= -1;
    } else if (ball.x - ball.radius < left) {
      ball.x = left + ball.radius;
      vx *= -1;
    }
    if (ball.y + ball.radius > bottom) {
      ball.y = bottom - ball.radius;
      vy *= -1;
    } else if (ball.y - ball.radius < top) {
      ball.y = top + ball.radius;
      vy *= -1;
    }

    ball.draw(context);
};


function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}