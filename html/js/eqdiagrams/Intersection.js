GTE = (function (parentModule) {
    "use strict";
    
    /**
     * Creates a new end point.
     * @class
     */
    function Intersection(i,j,k) {
        this.x = 250;
        this.y = 350;
        this.player = i;
        this.strat1 = j;
        this.strat2 = k;
        this.lines = []; // the element is the intersection of two line or the right endpoint of the first line.
        this.label = null; // label on the x axis.
        this.point = null; // html circle.
        this.stick = null; // stick on the x axis.
        this.draw();
    };
    
    Intersection.prototype.draw = function (){
        if (this.player==0){
            this.x=250;
            this.point=document.createElementNS("http://www.w3.org/2000/svg", "circle");
            this.point.setAttribute("cx",this.x);
            this.point.setAttribute("cy",this.y);
            this.point.setAttribute("r",GTE.POINT_RADIUS);
            this.point.setAttribute("id","inter1");
            this.point.setAttribute("class","inter");
            var env=document.getElementsByClassName("sticklabel");
            GTE.svg.appendChild(this.point);
            GTE.svg.insertBefore(this.point,env[17]);
            GTE.svg.insertBefore(env[17],this.point);
            this.stick=document.createElementNS("http://www.w3.org/2000/svg", "line");
            this.stick.setAttribute("x1",this.x);
            this.stick.setAttribute("y1",Number(GTE.diag.height)-Number(GTE.diag.margin));
            this.stick.setAttribute("x2",this.x);
            this.stick.setAttribute("y2",Number(GTE.diag.height)-Number(GTE.diag.margin)+Number(GTE.diag.rad));
            this.stick.setAttribute("class","line2 interstick1");
            GTE.svg.appendChild(this.stick);
            GTE.svg.insertBefore(this.stick,env[17]);
            GTE.svg.insertBefore(env[17],this.stick);
            this.label =document.createElementNS("http://www.w3.org/2000/svg", "text");
            this.label.setAttribute("x",this.x);
            this.label.setAttribute("y",Number(GTE.diag.height)-Number(GTE.diag.margin)+Number(GTE.diag.rad)+17);
            this.label.setAttribute("id","interlabel1");
            this.label.setAttribute("class","player2 legendh");
            GTE.svg.appendChild(this.label);
            GTE.svg.insertBefore(this.label,env[17]);
            GTE.svg.insertBefore(env[17],this.label);
        }
        else{
            this.x=650;
            this.point=document.createElementNS("http://www.w3.org/2000/svg", "circle");
            this.point.setAttribute("cx",this.x);
            this.point.setAttribute("cy",this.y);
            this.point.setAttribute("r",GTE.POINT_RADIUS);
            this.point.setAttribute("id","inter2");
            this.point.setAttribute("class","inter");
            var env=document.getElementsByClassName("sticklabel");
            GTE.svg.appendChild(this.point);
            GTE.svg.insertBefore(this.point,env[35]);
            GTE.svg.insertBefore(env[35],this.point);
            this.stick=document.createElementNS("http://www.w3.org/2000/svg", "line");
            this.stick.setAttribute("x1",this.x);
            this.stick.setAttribute("y1",Number(GTE.diag.height)-Number(GTE.diag.margin));
            this.stick.setAttribute("x2",this.x);
            this.stick.setAttribute("y2",Number(GTE.diag.height)-Number(GTE.diag.margin)+Number(GTE.diag.rad));
            this.stick.setAttribute("class","line1 interstick2");
            GTE.svg.appendChild(this.stick);
            GTE.svg.insertBefore(this.stick,env[35]);
            GTE.svg.insertBefore(env[35],this.stick);
            this.label =document.createElementNS("http://www.w3.org/2000/svg", "text");
            this.label.setAttribute("x",this.x);
            this.label.setAttribute("y",Number(GTE.diag.height)-Number(GTE.diag.margin)+Number(GTE.diag.rad)+17);
            this.label.setAttribute("id","interlabel2");
            this.label.setAttribute("class","player1 legendh");
            this.label.value=1;
            GTE.svg.appendChild(this.label);
            GTE.svg.insertBefore(this.label,env[35]);
            GTE.svg.insertBefore(env[35],this.label);
        }
        //e.addEventListener("mousedown", GTE.diag.doMouseDownIntersection);
        //this.html_element=e;
    };
    
    
    Intersection.prototype.attachLine = function(l){
        this.lines.push[l];
    }
    
    Intersection.prototype.clear = function(){
        GTE.svg.removeChild(this.label);
        GTE.svg.removeChild(this.point);
        GTE.svg.removeChild(this.stick);
    }
    
    
    /*
     Return player
     */
    Intersection.prototype.getPlayer = function(){
        return this.player;
    };
    
    /*
     Return strategy
     */
    Intersection.prototype.getStrat1 = function(){
        return this.strat1;
    };
    
    /*
     Return strategy
     */
    Intersection.prototype.getStrat2 = function(){
        return this.strat2;
    };
    
    /*
     Return y position
     */
    Intersection.prototype.getPosy = function(){
        return this.y;
    };
    
    /*
     Return x position
     */
    Intersection.prototype.getPosx = function(){
        return this.x;
    };
    
    
    /**
     * Change position
     */
    Intersection.prototype.move = function (new_x, new_y) {
        this.x = new_x;
        this.y = new_y;
        this.point.setAttributeNS(null, "cx", new_x);
        this.point.setAttributeNS(null, "cy", new_y);
        this.label.setAttributeNS(null, "cx", new_x);
        if (this.player==0)
        this.label.value=(Number(new_x)-Number(GTE.diag.margin))/(Number(GTE.width)-2*Number(GTE.margin));
        else
        this.label.value=(Number(new_x)-4*Number(GTE.diag.margin)-Number(GTE.width))/(Number(GTE.width)-2*Number(GTE.margin));
        this.stick.setAttributeNS(null, "x1", new_x);
        this.stick.setAttributeNS(null, "x2", new_x);
    };
    
    
    // Add class to parent module
    parentModule.Intersection = Intersection;
    
    return parentModule;
}(GTE)); // Add to GTE.DIAGRAM sub-module
