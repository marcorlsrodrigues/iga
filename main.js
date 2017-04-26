var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    mouse = utils.captureMouse(canvas),
    ball = new Ball(6,'white'),
    hole = new Ball(10,'black'),
    seta = new Seta(),
    vx = 1,
    vy = 1,
    speed = 0.01,
    isMouseDown = false,
    start = false,
    oldX, oldY, angle, dy, dx,
    level = 1,
    friction = 0.75;

var level_text = 'Level ';
var speed_text = 'Speed ';

canvas.style.background = '#66ff66';
context.font = '18pt Helvetica';
context.strokeStyle = 'black';

drawObjects();

canvas.addEventListener('mousedown', OnMouseDown, false);
canvas.addEventListener('mouseup', OnMouseUp, false);


(function drawFrame () {
        window.requestAnimationFrame(drawFrame, canvas);
        if (isMouseDown) {
          speed = speed + 0.1;

          context.fillText(speed_text + Math.trunc(speed), canvas.width - 110, canvas.height - 10);
        } else {
          if(start){
            var dx = hole.x - ball.x,
                dy = hole.y - ball.y,
                dist = Math.sqrt(dx * dx + dy * dy);

            //acertou no buraco
            if (dist < 16) {
              ball.x = hole.x;
              ball.y = hole.y;
              vx = 0;
              vy = 0;

              context.clearRect(0, 0, canvas.width, canvas.height);
              hole.draw(context);
              ball.draw(context);
            }else{
              context.clearRect(0, 0, canvas.width, canvas.height);
              checkBoundaries();
              ball.draw(context);
              hole.draw(context);
            }
          }
        }
}());

function drawObjects(){
  ball.x = getRandomArbitrary(0,canvas.width/2);
  ball.y = getRandomArbitrary(0,canvas.height);
  ball.draw(context);

  hole.x = getRandomArbitrary(canvas.width/2,canvas.width);
  hole.y = getRandomArbitrary(0,canvas.height);
  hole.draw(context);
}

function checkBoundaries(){
    var left = 0,
    right = canvas.width,
    top = 0,
    bottom = canvas.height;


  if (ball.x + ball.radius > right) {
      ball.x = (right - ball.radius);
      vx *= -1;
      vx *= friction;
      vy *= friction;
    } else if (ball.x - ball.radius < left) {
      ball.x = (left + ball.radius);
      vx *= -1;
      vx *= friction;
      vy *= friction;
    }
    if (ball.y + ball.radius > bottom) {
      ball.y = (bottom - ball.radius);
      vy *= -1;
      vx *= friction;
      vy *= friction;
    } else if (ball.y - ball.radius < top) {
      ball.y = (top + ball.radius);
      vy *= -1;
      vx *= friction;
      vy *= friction;
    }

    ball.x += vx;
    ball.y += vy;
}

function OnMouseDown(e){
  isMouseDown = true;
  seta.x = ball.x;
  seta.y = ball.y;

  var loc = windowToCanvas(canvas,  e.clientX, e.clientY);

  dx = loc.x - seta.x;
  dy = loc.y - seta.y;
  angle = Math.atan2(dy, dx);
  seta.rotation = Math.atan2(dy, dx); //radians
  seta.draw(context);

  canvas.addEventListener('mousemove', OnMouseMove, false);
}

function OnMouseMove(e){
    var loc = windowToCanvas(canvas,  e.clientX, e.clientY);
    var hX = hole.x;
    var hY = hole.y;

    dx = loc.x - seta.x;
    dy = loc.y - seta.y;
    angle = Math.atan2(dy, dx);

    context.clearRect(0,0,canvas.width, canvas.height);
    seta.rotation = Math.atan2(dy, dx); //radians
    seta.draw(context);
    drawBall(seta.x,seta.y);
    drawHole(hX,hY);
}

function OnMouseUp(){
    isMouseDown = false;
    start = true;
    vx = Math.cos(angle) * speed;
    vy = Math.sin(angle) * speed;
    
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

function drawHole(x,y){
  hole.x = x;
  hole.y = y;
  hole.draw(context); 
}


