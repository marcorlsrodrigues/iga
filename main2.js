    function collides (rect, circle, collide_inside)
    {
        // compute a center-to-center vector
		var half = { x: rect.w/2, y: rect.h/2 };
        var center = {
            x: circle.x - (rect.x+half.x),
            y: circle.y - (rect.y+half.y)};
            
        // check circle position inside the rectangle quadrant
        var side = {
            x: Math.abs (center.x) - half.x,
            y: Math.abs (center.y) - half.y};
        if (side.x >  circle.r || side.y >  circle.r) // outside
		    return false; 
        if (side.x < -circle.r && side.y < -circle.r) // inside
            return collide_inside;
		if (side.x < 0 || side.y < 0) // intersects side or corner
            return true;
			
        // circle is near the corner
        return side.x*side.x + side.y*side.y  < circle.r*circle.r;
    }
    
    function bounces (rect, circle)
    {
        // compute a center-to-center vector
		var half = { x: rect.w/2, y: rect.h/2 };
        var center = {
            x: circle.x - (rect.x+half.x),
            y: circle.y - (rect.y+half.y)};
            
        // check circle position inside the rectangle quadrant
        var side = {
            x: Math.abs (center.x) - half.x,
            y: Math.abs (center.y) - half.y};
 //console.log ("center "+center.x+" "+center.y+" side "+side.x+" "+side.y);           
        if (side.x >  circle.r || side.y >  circle.r) // outside
		    return { bounce: false }; 
        if (side.x < -circle.r && side.y < -circle.r) // inside
		    return { bounce: false }; 
		if (side.x < 0 || side.y < 0) // intersects side or corner
		{
			var dx = 0, dy = 0;
		    if (Math.abs (side.x) < circle.r && side.y < 0)
			{
			    dx = center.x*side.x < 0 ? -1 : 1;
			}
		    else if (Math.abs (side.y) < circle.r && side.x < 0)
			{
			    dy = center.y*side.y < 0 ? -1 : 1;
			}
			
            return { bounce: true, x:dx, y:dy };
		}
        // circle is near the corner
        bounce = side.x*side.x + side.y*side.y  < circle.r*circle.r;
		if (!bounce) return { bounce:false }
		var norm = Math.sqrt (side.x*side.x+side.y*side.y);
		var dx = center.x < 0 ? -1 : 1;
		var dy = center.y < 0 ? -1 : 1;
		return { bounce:true, x: dx*side.x/norm, y: dy*side.y/norm };
		
    }
    
// --------------------------------------------------------
// demo code
// --------------------------------------------------------
function Demo ()
{
	function getCursorPosition(e)
	{
		var x, y;
		if (e.pageX != undefined && e.pageY != undefined)
		{
			x = e.pageX;
			y = e.pageY;
		}
		else
		{
			x = e.clientX + document.body.scrollLeft +
					document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop +
					document.documentElement.scrollTop;
		}

		return { x: x - this.canvas.offsetLeft, y: y - this.canvas.offsetTop };
	}
	
	function pointSelect (e)
	{		
		this.dragging = true;
	}
	
	function pointDrag (e)
	{
	    if (!this.dragging) return;
		var p = getCursorPosition.call (this,e);
		
 		this.circle.x = p.x;
		this.circle.y = p.y;
		this.redraw();
	}
	
	function pointRelease ()
	{
		this.dragging = false;
	}

	this.redraw = function ()
	{
	    this.canvas.height = this.canvas.height; // reset canvas
	
		// draw rectangles
		this.draw.fillStyle = this.draw.strokeStyle = 'green';
		this.draw.beginPath();
		this.draw.rect (this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h);
		this.draw.closePath();
		this.draw.stroke();
		
		this.draw.beginPath();
		this.draw.rect (this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h);
		this.draw.closePath();
		this.fill ? this.draw.fill() : this.draw.stroke();
		
		
		
		// draw circle
		this.draw.beginPath();
		this.draw.arc(this.circle.x, this.circle.y,this.circle.r,0,2*Math.PI);
		this.draw.closePath();
		this.draw.fill();
		
		// draw bounce vector
		var              res = bounces (this.rect1, this.circle);
		if (!res.bounce) res = bounces (this.rect2, this.circle); 
		if (res.bounce)
		{
		    // update speed vector
			this.bounce (res);
			
		    // draw rebound vector
			this.draw.strokeStyle = 'blue';
			this.draw.beginPath();
			this.draw.moveTo (this.circle.x, this.circle.y);
			this.draw.lineTo (
			    this.circle.x + this.circle.r * res.x,
			    this.circle.y + this.circle.r * res.y);
			this.draw.closePath();
			this.draw.stroke();
		}
	}
	
	this.set_fill = function (f)
	{ 
		this.fill = f;
		this.redraw(); 
	}
	
	this.bounce = function (bounce)
	{
		var normal_len = bounce.x*this.speed.x + bounce.y*this.speed.y;
		var normal = { x: bounce.x*normal_len, y: bounce.y*normal_len };
		this.speed = { x: this.speed.x-2*normal.x, y: this.speed.y-2*normal.y };
	}
	
	this.canvas = document.getElementById('canvas');
	this.draw   = this.canvas.getContext('2d');
    this.rect1 = { x:1, y:1, w:this.canvas.width-2, h:this.canvas.height-2 };
    this.rect2 = { x:100, y:90, w:200, h:120 };
    this.circle = { x:30, y:30, r:20 };
    var period = 30; // milliseconds
	var speed = 570; // pixels/second
	this.speed = { x:speed*period/1000, y:speed*period/1000 };
	this.redraw ();

	this.canvas.addEventListener("mousedown", pointSelect. bind(this), false);
	this.canvas.addEventListener("mousemove", pointDrag.   bind(this), false);
	this.canvas.addEventListener("mouseup"  , pointRelease.bind(this), false);
	
    var timer_id; // reference of the timer, needed to stop it
	
	this.dragging = false;

    function animate ()
    {
	    if (this.dragging) return;
        this.circle.x += this.speed.x;
        this.circle.y += this.speed.y;
		this.redraw();
    }
	
    timer_id = setInterval (animate.bind(this), period);
	
}

demo = new Demo();
