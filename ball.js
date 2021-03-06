function Ball (radius, color,strokeColor) {
  if (radius === undefined) { radius = 6; }
  if (color === undefined) { color = "blue"; }
  if (strokeColor === undefined) { strokeColor = "black"; }
  this.x = 0;
  this.y = 0;
  this.radius = radius;
  this.diameter = radius*2;
  this.color = utils.parseColor(color);
  this.lineWidth = 0.5;
}

Ball.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y);
  
  context.lineWidth = this.lineWidth;
  context.fillStyle = this.color;
  context.beginPath();
  //x, y, radius, start_angle, end_angle, anti-clockwise
  context.arc(0, 0, this.radius, 0, (Math.PI * 2), true);
  context.closePath();
  context.fill();
  if (this.lineWidth > 0) {
    context.stroke();
  }
  context.restore();
};