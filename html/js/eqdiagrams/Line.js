GTE = (function (parentModule) {
    "use strict";
    
    /**
     * Creates a new end point.
     * @class
     */
    function Line(p,strat) {
        this.player=p;
        this.strat=strat; // strategy of the player
        //if (p==0){
            this.strat1=strat*2; // couple of strategies of the left endpoint.
            this.strat2=strat*2+1; // couple of strategies of the right endpoint.
        /*}
        else{
            this.strat1=strat;
            this.strat2=strat+2;
        }*/
        this.html_element=[];
        this.draw();
        
    };
    /*Strategy does not have the same meaning for end point and line.
     For line strategy one correspond to the left endpoint and strategy two to the right end point.
     */
    
    Line.prototype.draw = function(){
        if (this.player==0){
            var l1=document.createElementNS("http://www.w3.org/2000/svg", "line");
            l1.setAttribute("x1","50");
            l1.setAttribute("y1","350");
            l1.setAttribute("x2","250");
            l1.setAttribute("y2","350");
            l1.setAttribute("class","line1 lined1");
            this.html_element.push(l1);
            var l2=document.createElementNS("http://www.w3.org/2000/svg", "line");
            l2.setAttribute("x1","50");
            l2.setAttribute("y1","350");
            l2.setAttribute("x2","250");
            l2.setAttribute("y2","350");
            l2.setAttribute("class","line_trans lined1");
            l2.setAttribute("asso_player","0");
            l2.setAttribute("asso_strat",this.strat);
            this.html_element.push(l2);
            var env=document.getElementsByClassName("stick");
            GTE.svg.appendChild(l1);
            GTE.svg.appendChild(l2);
            GTE.svg.insertBefore(l1,env[0]);
            GTE.svg.insertBefore(l2,env[0]);
        }
        else{
            var l1=document.createElementNS("http://www.w3.org/2000/svg", "line");
            l1.setAttribute("x1","450");
            l1.setAttribute("y1","350");
            l1.setAttribute("x2","650");
            l1.setAttribute("y2","350");
            l1.setAttribute("class","line2 lined2");
            this.html_element.push(l1);
            var l2=document.createElementNS("http://www.w3.org/2000/svg", "line");
            l2.setAttribute("x1","450");
            l2.setAttribute("y1","350");
            l2.setAttribute("x2","650");
            l2.setAttribute("y2","350");
            l2.setAttribute("class","line_trans lined2");
            l2.setAttribute("asso_player","1");
            l2.setAttribute("asso_strat",this.strat);
            this.html_element.push(l2);
            var env=document.getElementsByClassName("stick");
            GTE.svg.appendChild(l1);
            GTE.svg.appendChild(l2);
            GTE.svg.insertBefore(l1,env[18]);
            GTE.svg.insertBefore(l2,env[18]);
        }
        l2.addEventListener("mousedown", GTE.diag.doMouseDownLine);
    }
    /*
     Return player
     */
    Line.prototype.getPlayer = function(){
        return this.player;
    };
    
    /*
     Return strategy
     */
    Line.prototype.getStrat1 = function(){
        return this.strat1;
    };
    
    Line.prototype.getStrat2 = function(){
        return this.strat2;
    };
    
    // Add class to parent module
    parentModule.Line = Line;
    
    return parentModule;
}(GTE)); // Add to GTE.DIAGRAM sub-module
