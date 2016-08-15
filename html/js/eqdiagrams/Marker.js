GTE = (function (parentModule) {
    "use strict";
    
    /**
     * Creates a new end point.
     * @class
     */
    function Marker(i,x, y, color) {
        this.id=i;
        this.x=x;
        this.y=y;
        this.color=color;
        this.html=[];
        this.add_marker(i,x,y,color);
        
    };
    
    Marker.prototype.add_marker = function(i,x,y,color) {
        var temp;
        
        switch(i){
            case 0:
            temp=document.createElementNS("http://www.w3.org/2000/svg", "circle");
            temp.setAttribute("cx",x);
            temp.setAttribute("cy",y);
            temp.setAttribute("r",GTE.POINT_RADIUS);
            temp.setAttribute("style","fill:"+color+";stroke:#008f00");
            break;
            case 1:
            temp=document.createElementNS("http://www.w3.org/2000/svg", "rect");
            temp.setAttribute("x",x-GTE.POINT_RADIUS);
            temp.setAttribute("y",y-GTE.POINT_RADIUS);
            temp.setAttribute("width",2*GTE.POINT_RADIUS);
            temp.setAttribute("height",2*GTE.POINT_RADIUS);
            temp.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
            break;
            case 2:
            temp=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            temp.setAttribute("points",Number(x-GTE.POINT_RADIUS)+","+Number(y+GTE.POINT_RADIUS)+" "+Number(x)+","+Number(y-GTE.POINT_RADIUS)+" "+Number(x+GTE.POINT_RADIUS)+","+Number(GTE.POINT_RADIUS+y)+" "+Number(x-GTE.POINT_RADIUS)+","+Number(y+GTE.POINT_RADIUS));
            temp.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
            break;
            case 3:
            temp=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            temp.setAttribute("points",Number(x-GTE.POINT_RADIUS)+","+Number(y-GTE.POINT_RADIUS)+" "+Number(x)+","+Number(y+GTE.POINT_RADIUS)+" "+Number(x+GTE.POINT_RADIUS)+","+Number(y-GTE.POINT_RADIUS)+" "+Number(x-GTE.POINT_RADIUS)+","+Number(y-GTE.POINT_RADIUS));
            temp.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
            break;
            case 4:
            temp=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            temp.setAttribute("points",Number(x-GTE.POINT_RADIUS)+","+Number(y)+" "+Number(x)+","+Number(y-GTE.POINT_RADIUS)+" "+Number(x+GTE.POINT_RADIUS)+","+Number(y)+" "+Number(x)+","+Number(y+GTE.POINT_RADIUS)+" "+Number(x-GTE.POINT_RADIUS)+","+Number(y));
            temp.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
            break;
            
            case 5:
            temp=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            ttemp.setAttribute("points",Number(x-6.4)+","+Number(y+1.5)+" "+Number(x)+","+Number(y+6.8)+" "+Number(x+6.4)+","+Number(y+1.5)+" "+Number(x+3.5)+","+Number(y-6.2)+" "+Number(x-3.5)+","+Number(y-6.2)+" "+Number(x-6.4)+","+Number(y+1.5));
            temp.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
            break;
            
            case 6:
            temp=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            temp.setAttribute("points",Number(x-6.4)+","+Number(y-1.5)+" "+Number(x+6.4)+","+Number(y-1.5)+" "+Number(x-3.5)+","+Number(y+6.2)+" "+Number(x)+","+Number(y-6.8)+" "+Number(x+3.5)+","+Number(y+6.2)+" "+Number(x-6.4)+","+Number(y-1.5));
            temp.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
            break;
            
            case 7:
            temp=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            temp.setAttribute("points",Number(x-5)+","+Number(y-2.65)+", "+Number(x)+","+Number(y-5)+", "+Number(x+5)+","+Number(y-2.65)+", "+Number(x+5)+","+Number(y+2.65)+", "+Number(x)+","+Number(y+5)+", "+Number(x-5)+","+Number(y+2.65)+", "+Number(x-5)+","+Number(y-2.65));
            temp.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
            break;
            default:
            temp=null;
        }
        this.html.push(temp);
        GTE.svg.appendChild(temp);
        
    };
    
    
    Marker.prototype.clear = function (){
        for (var i=0;i<this.html.length;i++){
            GTE.svg.removeChild(this.html[i]);
        }
    };
    
    Marker.prototype.degenerated = function (x2){
        this.html.push(document.createElementNS("http://www.w3.org/2000/svg", "rect"));
        this.html[1].setAttribute("x",Number(this.x-GTE.POINT_RADIUS+1));
        this.html[1].setAttribute("y",Number(this.y-GTE.POINT_RADIUS+1));
        this.html[1].setAttribute("width",Number(2*(GTE.POINT_RADIUS-1)+x2-this.x));
        this.html[1].setAttribute("height",2*(GTE.POINT_RADIUS-1));
        this.html[1].setAttribute("style","fill:"+this.color);
        GTE.svg.appendChild(this.html[1]);
        GTE.svg.insertBefore(this.html[1], this.html[0]);
        this.add_marker(this.id,x2,this.y,this.color);
    };
    
    
    
    
    // Add class to parent module
    parentModule.Marker = Marker;
    
    return parentModule;
}(GTE)); // Add to GTE.DIAGRAM sub-module