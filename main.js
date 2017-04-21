var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    mouse = utils.captureMouse(canvas),
    ball = new Ball(6,'blue'),
    seta = new Seta(),
    vx = 1,
    vy = 1,
    oldX, oldY;

canvas.style.background = '#66ff66';

ball.x = getRandomArbitrary(0,canvas.width);
ball.y = getRandomArbitrary(0,canvas.height);
ball.draw(context);

canvas.addEventListener('mousedown', OnMouseDown, false);
canvas.addEventListener('mouseup', OnMouseUp, false);


function OnMouseUp(){
    canvas.removeEventListener('mousedown', OnMouseDown, false);
    canvas.removeEventListener('mouseup', OnMouseUp, false);
    canvas.removeEventListener('mousemove', OnMouseMove, false);
    window.requestAnimationFrame(OnMouseUp, canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);

    checkBoundaries();

    ball.draw(context);
};

function checkBoundaries(){
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
}

function OnMouseDown(){
  seta.x = ball.x;
  seta.y = ball.y;
  oldX = ball.x;
  oldY = ball.y;
  
  canvas.addEventListener('mousemove', OnMouseMove, false);

  seta.draw(context);
}

function OnMouseMove(){
    trackDirection();
    var loc = windowToCanvas(canvas, mouse.x, mouse.y),
        dx = loc.x - seta.x,
        dy = loc.y - seta.y;

    context.clearRect(0,0,canvas.width, canvas.height);
    seta.rotation = Math.atan2(dy, dx); //radians
    seta.draw(context);
    drawBall(seta.x,seta.y);
}

function drawBall(x,y){
  ball.x = x;
  ball.y = y;
  ball.draw(context);
}

function trackDirection () {
  vx = mouse.x - oldX;
  vy = mouse.y - oldY;
  
  oldX = ball.x;
  oldY = ball.y;
}
