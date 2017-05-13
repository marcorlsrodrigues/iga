var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    mouse = utils.captureMouse(canvas),
    ball = new Ball(6,'white'),
    hole = new Ball(10,'black'),
    seta = new Seta(),
    vx = 1,
    vy = 1,
    speed = 0.01,
    speed_aux = 0.30,
    isMouseDown = false,
    start = false,
    oldX, oldY, angle, dy, dx,
    level = 1,
    friction = 0.5,
    gravity = 0.99,
    axis='',
    boxes = [],
    animation,
    bounce = -0.6,
    distVictory = 12,
    lineForce = 1,
    lineForceStep = 1,
    shots = 0,
    points = 0.0,
    img = new Image();
    img.src = 'success.jpeg';

canvas.style.background = '#66ff66';

context.strokeStyle='black';
context.font="18px Arial";

initialize();

(function drawFrame () {
        animation = window.requestAnimationFrame(drawFrame, canvas);
        if (isMouseDown) {
          if(speed < 7){
            speed = speed + speed_aux;
          }

          if(lineForce <= 150){
            lineForce += lineForceStep;
          }
          context.moveTo(ball.x, ball.y);
          context.lineTo(ball.x - lineForce * Math.cos(angle), ball.y - lineForce * Math.sin(angle));
          context.stroke();
        } else {
          if(start){
            var dx = hole.x - ball.x,
                dy = hole.y - ball.y,
                dist = Math.sqrt(dx * dx + dy * dy);

            if(checkStopBall()){
              ball.color='white';
            }

            //acertou no buraco
            if (dist < distVictory) {
              ball.x = hole.x;
              ball.y = hole.y;
              vx = 0;
              vy = 0;
              lineForce = 1;
              speed = 0.01;
              boxes = [];

              context.clearRect(0, 0, canvas.width, canvas.height);
              
              if(level+1 > 5){

                context.drawImage(img, 0,0,900,700);
                canvas.addEventListener('mousedown', reinitialize, false);
              }else{
                level += 1;
                start=false;
                initialize();
              }
            }else{
              context.clearRect(0, 0, canvas.width, canvas.height);

              vx *= gravity;
              vy *= gravity;
              speed *= gravity;
              
              checkBoundaries();

              console.log('vx: '+vx);
              console.log('vy: '+vy);
              console.log('speed: '+speed);

              boxCollision();

              ball.x += vx;
              ball.y += vy;

              ball.draw(context);
              hole.draw(context);
            }
            boxes.forEach(drawBoxes);
            drawText();
          }else{
            ball.color = 'white';
            lineForce = 1;
            speed = 0.01;
            addMouseUpDown();
          }
        }
}());


function initialize(){
  drawObjects();
  addMouseUpDown();
  drawText();
}

function reinitialize(){
  level = 0;
  points = 0;
  shots = -1;
  boxes = [];
  canvas.removeEventListener('mousedown', reinitialize, false);
  canvas.addEventListener('mousedown', start, false);
}

function start(){
  start=false;
  canvas.removeEventListener('mousedown', start, false);
}

function addMouseUpDown(){
  canvas.addEventListener('mousedown', OnMouseDown, false);
  canvas.addEventListener('mouseup', OnMouseUp, false);
}

function checkStopBall(){
  var stop = false;

    if(vx < 0.05 && vx > 0 && speed < 0.5){
      vx = 0;
      vy = 0;
      speed=0.01;
    }
    if(vy < 0.05 && vy > 0 && speed < 0.5){
      vy = 0;
      vx = 0;
      speed=0.01;
    }

    if(vx > -0.05 && vx < 0 && speed < 0.5){
      vy = 0;
      vx = 0;
      speed=0.01;
    }
    if(vy > -0.05 && vy < 0 && speed < 0.5){
      vy = 0;
      vx = 0;
      speed=0.01;
    }

    if(vx == 0 || vy == 0 && speed < 0.5){
      start = false;
      stop = true;
    }
    return stop;
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
      speed *= friction;
    } else if (ball.x - ball.radius < left) {
      ball.x = (left + ball.radius);
      vx *= -1;
      vx *= friction;
      vy *= friction;
      speed *= friction;
    }
    if (ball.y + ball.radius > bottom) {
      ball.y = (bottom - ball.radius);
      vy *= -1;
      vx *= friction;
      vy *= friction;
      speed *= friction;
    } else if (ball.y - ball.radius < top) {
      ball.y = (top + ball.radius);
      vy *= -1;
      vx *= friction;
      vy *= friction;
      speed *= friction;
    }
}

function boxCollision(){
    for(i=0;i<boxes.length;i++){
        var res = bounces (boxes[i]);
        /*console.log(res);
        console.log('vx ' + vx);
        console.log('vy ' + vy);*/
        if(res.bounce){
          var normal_len = res.x*vx + res.y*vy;
          var normal = { x: res.x*normal_len, y: res.y*normal_len };
          vx = vx-2*normal.x;
          vy = vy-2*normal.y;
          
          if(Math.abs(vx)>5){
            speed *= friction;
            vx *= friction;            
          }
          if(Math.abs(vy)>5){
            speed *= friction;
            vy *= friction;
          }
        }
    }
}

function bounces (box)
{
    // compute a center-to-center vector
    var half = { x: box.width/2, y: box.height/2 };
        var center = {
            x: (ball.x+vx) - (box.x+half.x),
            y: (ball.y+vy) - (box.y+half.y)};
            
        // check circle position inside the rectangle quadrant
        var side = {
            x: Math.abs (center.x) - half.x,
            y: Math.abs (center.y) - half.y};
 //console.log ("center "+center.x+" "+center.y+" side "+side.x+" "+side.y);           
        if (side.x >  ball.radius || side.y >  ball.radius) // outside
        return { bounce: false }; 
        /*if (side.x < -ball.radius && side.y < -ball.radius) // inside
        return { bounce: false }; */
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
  angleLineForce = angle * 180/Math.PI;
  seta.rotation = Math.atan2(dy, dx);
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
    drawText();
}

function OnMouseUp(){
    isMouseDown = false;
    start = true;
    vx = Math.cos(angle) * speed;
    vy = Math.sin(angle) * speed;
    ball.color = '#b3b3b3';

    shots += 1;
    if(shots>0 && level > 0){
      points = (level/shots)*100;
    }else{
      points = 0;
    }
    
    console.log('level: '+level);
    console.log('shots: ' +shots);

    points = Math.round(points * 100) / 100;
    console.log('Points: ' + points);
    canvas.removeEventListener('mousemove', OnMouseMove, false);
    canvas.removeEventListener('mousedown', OnMouseDown, false);
    canvas.removeEventListener('mouseup', OnMouseUp, false);
}



function createBoxes (level) {
  
  for (i = 0; i < level; i++) { 
    var box = new Box(Math.random() * 40 + 50, Math.random() * 40 + 50);
    var acceptBox = false;

    while(!acceptBox){
      box.x = Math.random() * canvas.width;
      box.y = Math.random() * canvas.height;

      if(box.x <= canvas.width/2){
        box.x += box.width;
      }else{
        box.x -= box.width;
      }

      if(box.y <= canvas.height/2){
        box.y += box.height;
      }else{
        box.y -= box.height;
      }

      acceptBox = checkBoxCircles(box,ball);
      if(acceptBox){
        acceptBox = checkBoxCircles(box,hole);
      }
      if(acceptBox){
        acceptBox = checkBoxBoxes(box); 
      }
    }

    box.draw(context);
    boxes.push(box);

    console.log('box.x:' + box.x);
    console.log('box.y:' + box.y);

    console.log('box.width:' + box.width);
    console.log('box.height:' + box.height);
  }
}


function checkBoxCircles(box,circle){
  var ret = true;

  if(utils.containsPoint(box,circle.x+circle.radius,circle.y)){
    ret = false;
  }
  if(utils.containsPoint(box,circle.x-circle.radius,circle.y)){
    ret = false;
  }
  if(utils.containsPoint(box,circle.x,circle.y+circle.radius)){
    ret = false;
  }
  if(utils.containsPoint(box,circle.x,circle.y-circle.radius)){
    ret = false;
  }

  return ret;
}

function checkBoxBoxes(box){
  var ret = true;

  for(var j=0;j<boxes.length;j++){
    if((box.x != boxes[j].x || box.y != boxes[j].y) && utils.intersects(box,boxes[j])){
      ret = false;
    }
  }

  return ret;
}

