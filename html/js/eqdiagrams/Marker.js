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
        this.html=null;
        this.add_marker(i,x,y,color);
        
    };
    
    Marker.prototype.add_marker = function(i,x,y,color) {
        switch(i){
            case 0:
                this.html=document.createElementNS("http://www.w3.org/2000/svg", "circle");
                this.html.setAttribute("cx",x);
                this.html.setAttribute("cy",y);
                this.html.setAttribute("r",GTE.POINT_RADIUS);
                this.html.setAttribute("style","fill:"+color+";stroke:#008f00");
                GTE.svg.appendChild(this.html);
                break;
            case 1:
                this.html=document.createElementNS("http://www.w3.org/2000/svg", "rect");
                this.html.setAttribute("x",x-GTE.POINT_RADIUS);
                this.html.setAttribute("y",y-GTE.POINT_RADIUS);
                this.html.setAttribute("width",2*GTE.POINT_RADIUS);
                this.html.setAttribute("height",2*GTE.POINT_RADIUS);
                this.html.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
                GTE.svg.appendChild(this.html);
                break;
            case 2:
                this.html=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                this.html.setAttribute("points",Number(x-GTE.POINT_RADIUS)+","+Number(y+GTE.POINT_RADIUS)+" "+Number(x)+","+Number(y-GTE.POINT_RADIUS)+" "+Number(x+GTE.POINT_RADIUS)+","+Number(GTE.POINT_RADIUS+y)+" "+Number(x-GTE.POINT_RADIUS)+","+Number(y+GTE.POINT_RADIUS));
                this.html.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
                GTE.svg.appendChild(this.html);
                break;
            case 3:
                this.html=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                this.html.setAttribute("points",Number(x-GTE.POINT_RADIUS)+","+Number(y-GTE.POINT_RADIUS)+" "+Number(x)+","+Number(y+GTE.POINT_RADIUS)+" "+Number(x+GTE.POINT_RADIUS)+","+Number(y-GTE.POINT_RADIUS)+" "+Number(x-GTE.POINT_RADIUS)+","+Number(y-GTE.POINT_RADIUS));
                this.html.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
                GTE.svg.appendChild(this.html);
                break;
            case 4:
                this.html=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                this.html.setAttribute("points",Number(x-GTE.POINT_RADIUS)+","+Number(y)+" "+Number(x)+","+Number(y-GTE.POINT_RADIUS)+" "+Number(x+GTE.POINT_RADIUS)+","+Number(y)+" "+Number(x)+","+Number(y+GTE.POINT_RADIUS)+" "+Number(x-GTE.POINT_RADIUS)+","+Number(y));
                this.html.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
                GTE.svg.appendChild(this.html);
                break;
            
            case 5:
            this.html=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            this.html.setAttribute("points",Number(x-6.4)+","+Number(y+1.5)+" "+Number(x)+","+Number(y+6.8)+" "+Number(x+6.4)+","+Number(y+1.5)+" "+Number(x+3.5)+","+Number(y-6.2)+" "+Number(x-3.5)+","+Number(y-6.2)+" "+Number(x-6.4)+","+Number(y+1.5));
            this.html.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
            GTE.svg.appendChild(this.html);
            break;
            
            case 6:
            this.html=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            this.html.setAttribute("points",Number(x-6.4)+","+Number(y-1.5)+" "+Number(x+6.4)+","+Number(y-1.5)+" "+Number(x-3.5)+","+Number(y+6.2)+" "+Number(x)+","+Number(y-6.8)+" "+Number(x+3.5)+","+Number(y+6.2)+" "+Number(x-6.4)+","+Number(y-1.5));
            this.html.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
            GTE.svg.appendChild(this.html);
            break;
            
            case 7:
            this.html=document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            this.html.setAttribute("points",Number(x-5)+","+Number(y-2.65)+", "+Number(x)+","+Number(y-5)+", "+Number(x+5)+","+Number(y-2.65)+", "+Number(x+5)+","+Number(y+2.65)+", "+Number(x)+","+Number(y+5)+", "+Number(x-5)+","+Number(y+2.65)+", "+Number(x-5)+","+Number(y-2.65));
            this.html.setAttribute("style","fill:"+color+";stroke:#008f00;stroke-width:1;stroke-linejoin:miter; stroke-linecap:butt;");
            GTE.svg.appendChild(this.html);
            break;
            default:
        }
    };
    
    
    Marker.prototype.clear = function (){
        GTE.svg.removeChild(this.html);
    };
    
    
    
    
    // Add class to parent module
    parentModule.Marker = Marker;
    
    return parentModule;
}(GTE)); // Add to GTE.DIAGRAM sub-module