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


    for(i=0;i<boxes.length;i++){

      var res = bounces (boxes[i]);

      if(res.bounce){
        if(res.x != 0){
          console.log(res);
          console.log('vx ' + vx);
          
          if(Math.abs(vx)>5){
            vx *= friction;            
          }
          
          vx *= -1;
          //vx *= friction;
          //vy *= friction;
        }
        if(res.y != 0){
          console.log(res);
          console.log('vy ' + vy);
          
          if(Math.abs(vy) > 5){
            vy *= friction;
          }
          vy *= -1;
          //vx *= friction;
          //vy *= friction;
        }
      }
    }
    
    ball.x += vx;
    ball.y += vy;
}


function ballBoxColliding(box) {
    var distX = Math.abs(ball.x - box.x - box.width / 2);
    var distY = Math.abs(ball.y - box.y - box.height / 2);
    
    if (distX > (box.width / 2 + ball.radius)) {
        return false;
    }
    if (distY > (box.height / 2 + ball.radius)) {
        return false;
    }

    if (distX <= (box.width / 2)) {
        return 'x';
    }
    if (distY <= (box.height / 2)) {
        return 'y';
    }

    /*var dx = distX - box.height / 2;
    var dy = distY - box.height / 2;
    return (dx * dx + dy * dy <= (ball.radius * ball.radius));*/
}

  function bounces (box)
  {
        // compute a center-to-center vector
    var half = { x: box.width/2, y: box.height/2 };
        var center = {
            x: ball.x - (box.x+half.x),
            y: ball.y - (box.y+half.y)};
            
        // check circle position inside the rectangle quadrant
        var side = {
            x: Math.abs (center.x) - half.x,
            y: Math.abs (center.y) - half.y};
        //console.log ("center "+center.x+" "+center.y+" side "+side.x+" "+side.y);           
        if (side.x >  ball.radius || side.y >  ball.radius) // outside
        return { bounce: false }; 
        if (side.x < -ball.radius && side.y < -ball.radius) // inside
        return { bounce: false }; 
        if (side.x < 0 || side.y < 0) // intersects side or corner
        {
          var dx = 0, dy = 0;
            if (Math.abs (side.x) < ball.radius && side.y < 0)
          {
              dx = center.x*side.x < 0 ? -1 : 1;
          }
            else if (Math.abs (side.y) < ball.radius && side.x < 0)
          {
              dy = center.y*side.y < 0 ? -1 : 1;
          }
          
                return { bounce: true, x:dx, y:dy };
        }
        // circle is near the corner
        bounce = side.x*side.x + side.y*side.y  < ball.radius*ball.radius;
      if (!bounce) return { bounce:false }
      var norm = Math.sqrt (side.x*side.x+side.y*side.y);
      var dx = center.x < 0 ? -1 : 1;
      var dy = center.y < 0 ? -1 : 1;
      return { bounce:true, x: dx*side.x/norm, y: dy*side.y/norm };
    
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


