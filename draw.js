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


function drawText(){
  context.fillText("Points: " + points + "%",5,canvas.height-5);
}



function drawObjects(){
  var dist_ball_hole_x = 0,
    dist_ball_hole_y = 0;
  ball.color = 'white';
  ball.x = getRandomArbitrary(0,canvas.width/2);
  ball.y = getRandomArbitrary(0,canvas.height);

  if(ball.x <= canvas.width/2){
    ball.x += ball.radius;
  }else{
    ball.x -= ball.radius;
  }

  if(ball.y <= canvas.height/2){
    ball.y += ball.radius;
  }else{
    ball.y -= ball.radius;
  }

  ball.draw(context);

  //atribui valores random para hole x e y
  hole.x = getRandomArbitrary(canvas.width/2,canvas.width);
  hole.y = getRandomArbitrary(0,canvas.height);

  //soma sempre o raiu do hole para evitar que fique metade fora do canvas
  if(hole.x <= canvas.width/2){
    hole.x += hole.radius;
  }else{
    hole.x -= hole.radius;
  }

  if(hole.y <= canvas.height/2){
    hole.y += hole.radius;
  }else{
    hole.y -= hole.radius;
  }

  //se distância do centro da ball e hole for menor que a soma dos raios, 
  //então calcula outro ponto para o hole para que não se interceptem
  dist_ball_hole_x = Math.abs(hole.x-ball.x);
  dist_ball_hole_y = Math.abs(hole.y-ball.y);

  while((dist_ball_hole_x || dist_ball_hole_y) <(hole.radius + ball.radius)){
      //atribui valores random para hole x e y
      hole.x = getRandomArbitrary(canvas.width/2,canvas.width);
      hole.y = getRandomArbitrary(0,canvas.height);

      //soma sempre o raiu do hole para evitar que fique metade fora do canvas
      if(hole.x <= canvas.width/2){
        hole.x += hole.radius;
      }else{
        hole.x -= hole.radius;
      }

      if(hole.y <= canvas.height/2){
        hole.y += hole.radius;
      }else{
        hole.y -= hole.radius;
      }

      dist_ball_hole_x= Math.abs(hole.x-ball.x);
      dist_ball_hole_y = Math.abs(hole.y-ball.y);
  }
  
  hole.draw(context);

  createBoxes(level);
}