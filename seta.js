function Seta () {
  this.x = 0;
  this.y = 0;
  this.color = "black";
  this.rotation = 0;
}

Seta.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);

  context.lineWidth = 0.5;
  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.beginPath();
  context.moveTo(-15, -7);
  context.lineTo(0, -7);
  context.lineTo(0, -15);
  context.lineTo(15, 0);
  context.lineTo(0, 15);
  context.lineTo(0, 7);
  context.lineTo(-15, 7);
  context.lineTo(-15, -7);
  context.closePath();
  context.fill();
  context.stroke();  

  context.restore();
};