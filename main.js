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
    friction = 0.75,
    axis='',
    boxes = [];

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
            boxes.forEach(drawBoxes);
          }
        }
}());

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

    console.log(vx);
    console.log(vy);

    for(i=0;i<boxes.length;i++){
      if(((ball.x + ball.radius) > boxes[i].x) && ((ball.x + ball.radius) < (boxes[i].x + boxes[i].width))){
        ball.x = (boxes[i].x - ball.radius);
        vx *= -1;
      }else if(((ball.x - ball.radius) > boxes[i].x) && ((ball.x - ball.radius) < (boxes[i].x + boxes[i].width))){
        ball.x = (boxes[i].x + ball.radius);
        vx *= -1;
      }
    }

    /*for(i=0;i<boxes.length;i++){
      if(utils.containsPoint(boxes[i],ball.x,ball.y)){
          if(((ball.x + ball.radius) > boxes[i].x) && ((ball.x + ball.radius) < (boxes[i].x + boxes[i].width))){
            ball.x = (boxes[i].x - ball.radius);
            vx *= -1;
          }else if(((ball.x - ball.radius) > boxes[i].x) && ((ball.x - ball.radius) < (boxes[i].x + boxes[i].width))){
            ball.x = (boxes[i].x + ball.radius);
            vx *= -1;
          }

          if(((ball.y + ball.radius) > boxes[i].y) && ((ball.y + ball.radius) < (boxes[i].y + boxes[i].height))){
            ball.y = (boxes[i].y - ball.radius);
            vy *= -1;
          }else if(((ball.y - ball.radius) > boxes[i].y) && ((ball.y - ball.radius) < (boxes[i].y + boxes[i].height))){
            ball.y = (boxes[i].y + ball.radius);
            vy *= -1;
          }
        
        vx *= friction;
        vy *= friction;
      }

      if(((ball.x + ball.radius) > boxes[i].x) && ((ball.x + ball.radius) > boxes[i].x)){
        ball.x = (right - ball.radius);
        vx *= -1;
        vx *= friction;
        vy *= friction;
      }else if (ball.x - ball.radius < left) {
        ball.x = (left + ball.radius);
        vx *= -1;
        vx *= friction;
        vy *= friction;
      }
    }*/
    

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
  boxes.forEach(drawBoxes);
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
    boxes.forEach(drawBoxes);
}

function OnMouseUp(){
    isMouseDown = false;
    start = true;
    vx = Math.cos(angle) * speed;
    vy = Math.sin(angle) * speed;
    
    canvas.removeEventListener('mousemove', OnMouseMove, false);
    canvas.removeEventListener('mousedown', OnMouseDown, false);
    canvas.removeEventListener('mouseup', OnMouseUp, false);
};

function drawObjects(){
  ball.x = getRandomArbitrary(0,canvas.width/2);
  ball.y = getRandomArbitrary(0,canvas.height);
  ball.draw(context);

  hole.x = getRandomArbitrary(canvas.width/2,canvas.width);
  hole.y = getRandomArbitrary(0,canvas.height);
  hole.draw(context);

  createBoxes(level);
}

function createBoxes (level) {
  for (i = 0; i < level; i++) { 
    var box = new Box(Math.random() * 40 + 50, Math.random() * 40 + 50);
    box.x = Math.random() * canvas.width;
    box.y = Math.random() * canvas.height;
    box.draw(context);
    boxes.push(box);
  }
}

function drawBoxes (box) {
  box.draw(context);
}


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


