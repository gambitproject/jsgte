// sets up basic parameters
"use strict";
var Npoints = 13;
// for triangle drawing
var leftstep = 60;
var rightstep = 30;
var rightup = 54;
var dotradius = 4; // radius of dot
var linewidth = 3; // linewidth
// for loop drawing
var sRight = 50; // straight right
var qLeft = 30; // quadratic curve left step
var qUp = 50; // quadratic curve up-left  step
var qDown = 50; // quadratic curve down-left step

// path power color
var powerColor = { 1:"black", 2:"orange", 3:"red", };
var CanvasBorderWidth = 10; // Border of the selection canvas
// for timer
var repeatStep= 400;   // time next node added
var howMuchSlower = 10; // waiting time between the two displays

// these are derived parameters
var CanvasWidth, CanvasHeight ;
var xorigin, yorigin;

function setupCanvas() { // with the above parameters
    var mycanvas = document.getElementById("myCanvas");
    CanvasWidth = Math.round(Npoints * leftstep * 0.08) * 16;
    CanvasHeight = Math.round(CanvasWidth * .6) ;
    xorigin = Math.round(CanvasWidth * .36);
    yorigin = CanvasHeight/2;
    // 
    mycanvas.width = CanvasWidth;
    mycanvas.height= CanvasHeight;
    // check if set here by making it blueish
    // (will stay grey in older browsers, meaning
    // CanvasBorderWidth must be set in HTML file)
    mycanvas.style = "border:"+CanvasBorderWidth +"px solid #d3d3d3"; 
}
var mycanvas = document.getElementById("myCanvas");
var ctx = mycanvas.getContext("2d");

function clearCanvas() {
    ctx.clearRect(0,0,CanvasWidth,CanvasHeight);
}

var triangleOn = false ; // start with drawing triangle path

function pointCoord(n) {
    var x = xorigin;
    var y = yorigin;
    if (triangleOn) {
        var k = n % 3;
        var n3 = Math.floor (n/3);
        if (k == 1) // go left
            x -= n3 * leftstep;
        else if (k == 0 ) { // go down right
            x += n3 * rightstep;
            y += n3 * rightup;
        } else { // k==2, go up right 
            x += (n3+.6) * rightstep;
            y -= (n3+.6) * rightup;
        }
    } else { // loops
        x += (n-1) * sRight;
    }
    return { x:x, y:y }
}

function numberPoint(n) {
    ctx.textBaseline = "middle";
    var p = pointCoord(n); 
    var xpos = p.x, ypos = p.y;
    if (triangleOn) {
        var k = n % 3; 
        if (k==0) {
            ctx.textAlign = "left";
            xpos += 6;
        } else {
            ctx.textAlign = "right";
            if (k==1)
                ypos += 15;
            else // k==2
                ypos -= 11;
        }
    } else { // loops
        ctx.textAlign = "left";
        xpos += 2;
        ypos -= 10;

    }
    ctx.font = "16px Helvetica"; 
    ctx.fillStyle = powerColor[1];
    ctx.fillText(n,xpos,ypos);
}

function drawPoint(n) {
    var p = pointCoord(n); // find center 
    ctx.beginPath();
    ctx.fillStyle = powerColor[1];
    ctx.arc(p.x, p.y, dotradius, 0, 2*Math.PI); 
    ctx.fill();
}

function drawDots() {
    for (var i=1; i<=Npoints; i++) {
        drawPoint(i);
        numberPoint(i);
    }
}

function connectPoint(n, power) { //  connect n to n+power
    var s = n + power;
    if (power == 0) { // just number point 
        numberPoint(n);
    } else if (s <= Npoints) {
        var p = pointCoord(n);
        var q = pointCoord(s);
        ctx.lineWidth = linewidth;
        ctx.strokeStyle = powerColor[power];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        if (triangleOn || (power == 1) )
            ctx.lineTo(q.x, q.y);
        else { // loop, draw curves
            // intermediate points
            var extra = (power == 2) ? 0 : 0.5 ;
            var iy = yorigin;
            var ix = xorigin - (n - 0.3 + extra) * qLeft ;
            var iyup = iy - (n - 0.6 + extra) * qUp;
            var iydown= iy + (n - 0.4 + extra) * qDown;
            ctx.quadraticCurveTo(ix,iyup, ix,iy);
            ctx.quadraticCurveTo(ix,iydown, q.x,q.y);
        }
        ctx.stroke();
    }
    drawPoint(n); // redraw point
}

function drawPath(power) { //  power=1: path
    // power=2: square  
    // power=3: cube
    for (var i=1; i<Npoints; i+=1) 
        connectPoint(i, power);
}

// function toPrev(n, power) { // connect n to n - power  in correct color
//     var s = n - power;
//     if (s < 1) return;
//     connectPoint(s, power);
// }
    
var lastDot = 0;    // dot drawn last
var thisPower = 0;  // which path currently being drawn
var waitCount = 0 ; // to wait until switching

function draw(n) { // draw up to n but in the right order
    clearCanvas();
    for ( ;n>0; n--)
        drawPath(n);
    drawDots();
}

// http://stackoverflow.com/questions/729921/settimeout-or-setinterval
// http://ejohn.org/blog/how-javascript-timers-work/
function animate() { // only one event-driven function
    if (lastDot < Npoints) { // increment and draw next dot
        lastDot++ ;
        connectPoint(lastDot, thisPower);
        // drawPoint(lastDot); 
    } else { // draw main path again, go to next power
        draw(thisPower);
        if (thisPower < 3) {
            thisPower++;
            lastDot = 0;
        } else { // wait a bit
            if (waitCount < howMuchSlower)
                waitCount ++ ;    
            else { // start over with different style
                waitCount = 0 ;    
                lastDot = 0;
                thisPower = 0;
                triangleOn = !triangleOn ;
                clearCanvas();
            }
        }
    }
    // c_show(lastDot + " for power " + thisPower);
}

var anim; // stop handle
// var animOn = true;
// anim = setInterval(animate, repeatStep); 
var animOn = false;

// triggered by button
function stopStartAnimation() {
    if (animOn) { // stop animation
        clearInterval(anim);
        animOn = false;
        // window.alert("animation stopped -\nreload page to start again");
        var button = document.getElementById("animButton");
        button.innerHTML = "Resume animation" ;
    } else { // resume animation
        animOn = true;
        var button = document.getElementById("animButton");
        button.innerHTML = "Pause animation" ;
        anim = setInterval(animate, repeatStep); 
    }
}

// for debug etc. display
function c_show(text) {
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(10,40,180,30);
    ctx.fillStyle = "#FF0000";
    ctx.font = "30px Times";
    ctx.fillText(text,15,55);
}
