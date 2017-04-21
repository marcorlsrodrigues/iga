function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function windowToCanvas(canvas, x, y) {
   var bbox = canvas.getBoundingClientRect();
   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
}