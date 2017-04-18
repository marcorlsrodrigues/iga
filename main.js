var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    ball = new Ball(6,'blue'),
    vx = 1,
    vy = 1;

canvas.style.background = '#ead5ac';

ball.x = canvas.width/4;
ball.y = canvas.height*3/4;
//ball.draw(context);

(function drawFrame(){
    window.requestAnimationFrame(drawFrame, canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);

    ball.x += vx;
    ball.y += vy;
    ball.draw(context);
})();