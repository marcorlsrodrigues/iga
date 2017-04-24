var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    mouse = utils.captureMouse(canvas),
    ball = new Ball(6,'blue'),
    seta = new Seta(),
    vx = 1,
    vy = 1,
    speed = 0.01,
    isMouseDown = false,
    start = false,
    oldX, oldY, angle, dy, dx,
    level = 1;

var level_text = 'Level ';
var speed_text = 'Speed ';

canvas.style.background = '#66ff66';
context.font = '18pt Helvetica';
context.strokeStyle = 'yellow';

ball.x = getRandomArbitrary(0,canvas.width);
ball.y = getRandomArbitrary(0,canvas.height);
ball.draw(context);

canvas.addEventListener('mousedown', OnMouseDown, false);
canvas.addEventListener('mouseup', OnMouseUp, false);


(function drawFrame () {
        window.requestAnimationFrame(drawFrame, canvas);
        if (isMouseDown) {
          speed = speed + 0.5;

          context.fillText(speed_text + Math.trunc(speed), canvas.width - 110, canvas.height - 10);
        } else {
          if(start){
            context.clearRect(0, 0, canvas.width, canvas.height);
            checkBoundaries();
            ball.draw(context);
          }
        }
}());

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

function OnMouseDown(e){
  isMouseDown = true;
  seta.x = ball.x;
  seta.y = ball.y;

  seta.draw(context);

  var loc = windowToCanvas(canvas,  e.clientX, e.clientY);

  dx = loc.x - seta.x;
  dy = loc.y - seta.y;
  angle = Math.atan2(dy, dx);

  canvas.addEventListener('mousemove', OnMouseMove, false);
}

function OnMouseMove(e){
    var loc = windowToCanvas(canvas,  e.clientX, e.clientY);

    dx = loc.x - seta.x;
    dy = loc.y - seta.y;
    angle = Math.atan2(dy, dx);
    console.log('angle');
    console.log(angle);

    context.clearRect(0,0,canvas.width, canvas.height);
    seta.rotation = Math.atan2(dy, dx); //radians
    seta.draw(context);
    drawBall(seta.x,seta.y);
}

function OnMouseUp(){
    isMouseDown = false;
    start = true;
    vx = Math.cos(angle) * speed;
    vy = Math.sin(angle) * speed;
    console.log('vx');
    console.log(vx);
    canvas.removeEventListener('mousemove', OnMouseMove, false);
    canvas.removeEventListener('mousedown', OnMouseDown, false);
    canvas.removeEventListener('mouseup', OnMouseUp, false);
//    window.requestAnimationFrame(OnMouseUp, canvas);
    //context.clearRect(0, 0, canvas.width, canvas.height);

    //checkBoundaries();

//    ball.draw(context);
};

function drawBall(x,y){
  ball.x = x;
  ball.y = y;
  ball.draw(context);
}


