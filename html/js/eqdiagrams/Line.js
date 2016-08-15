GTE = (function (parentModule) {
    "use strict";
    
    /**
     * Creates a new end point.
     * @class
     */
    function Line(p,strat,max) {
        this.player=p;
        this.strat=strat; // strategy of the player
        this.strat1=strat*2; // couple of strategies of the left endpoint.
        this.strat2=strat*2+1; // couple of strategies of the right endpoint.
        this.html_element=[];
        if(p==0 || max >1)
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
            var txt=document.createElementNS("http://www.w3.org/2000/svg", "text");
            txt.textContent=GTE.tree.matrix.strategies[1][this.strat].moves[0].name;
            txt.setAttribute("x",GTE.diag.margin+Number(this.strat+0.5)*Number((GTE.diag.width-2*GTE.diag.margin)/(GTE.diag.nb_strat[this.player])));
            txt.setAttribute("y","370");
            txt.setAttribute("class","player1 strat"+this.player+this.strat);
            txt.setAttribute("id","text11");
            txt.setAttribute("visibility","visible");
            this.txt=txt;
            var txt2=document.createElementNS("http://www.w3.org/2000/svg", "text");
            txt2.textContent=GTE.tree.matrix.strategies[1][this.strat].moves[0].name;
            txt2.setAttribute("x",GTE.diag.margin+Number(this.strat+0.5)*Number((GTE.diag.width-2*GTE.diag.margin)/(GTE.diag.nb_strat[this.player])));
            txt2.setAttribute("y","430");
            txt2.setAttribute("class","player1 strat"+this.player+this.strat);
            txt2.setAttribute("id","text11");
            txt2.setAttribute("visibility","visible");
            this.txt2=txt2;
            var env=document.getElementsByClassName("sticklabel");
            GTE.svg.appendChild(l1);
            GTE.svg.appendChild(l2);
            GTE.svg.appendChild(txt);
            GTE.svg.insertBefore(l1,env[0]);
            GTE.svg.insertBefore(l2,env[0]);
            GTE.svg.appendChild(txt,env[0]);
            GTE.svg.appendChild(txt2,env[0]);
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
            var txt=document.createElementNS("http://www.w3.org/2000/svg", "text");
            txt.textContent=GTE.tree.matrix.strategies[2][this.strat].moves[0].name;
            txt.setAttribute("x",2*GTE.diag.margin+GTE.diag.width+GTE.diag.margin+Number(this.strat+0.5)*Number((GTE.diag.width-2*GTE.diag.margin)/(GTE.diag.nb_strat[this.player])));
            txt.setAttribute("y","370");
            txt.setAttribute("class","player2 strat"+this.player+this.strat);
            txt.setAttribute("id","text21");
            txt.setAttribute("visibility","visible");
            this.txt=txt;
            
            var txt2=document.createElementNS("http://www.w3.org/2000/svg", "text");
            txt2.textContent=GTE.tree.matrix.strategies[2][this.strat].moves[0].name;
            txt2.setAttribute("x",2*GTE.diag.margin+GTE.diag.width+GTE.diag.margin+Number(this.strat+0.5)*Number((GTE.diag.width-2*GTE.diag.margin)/(GTE.diag.nb_strat[this.player])));
            txt2.setAttribute("y","430");
            txt2.setAttribute("class","player2 strat"+this.player+this.strat);
            txt2.setAttribute("id","text21");
            txt2.setAttribute("visibility","visible");
            this.txt2=txt2;
            var env=document.getElementsByClassName("sticklabel");
            GTE.svg.appendChild(txt);
            GTE.svg.appendChild(l1);
            GTE.svg.appendChild(l2);
            GTE.svg.insertBefore(l1,env[18]);
            GTE.svg.insertBefore(l2,env[18]);
            GTE.svg.appendChild(txt,env[18]);
            GTE.svg.appendChild(txt2,env[18]);
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
    
    Line.prototype.hideName = function(){
        this.txt.setAttribute("visibility","hidden");
        this.txt2.setAttribute("visibility","hidden");
    };
    
    Line.prototype.showName = function(){
        this.txt.setAttribute("visibility","visible");
        this.txt2.setAttribute("visibility","visible");
    };
    
    Line.prototype.moveLabel = function(x,y){
        this.txt2.setAttribute("visibility","visible");
        this.txt2.setAttribute("x",x);
        this.txt.setAttribute("visibility","visible");
        this.txt.setAttribute("x",x);
        this.txt.setAttribute("y",y);
        this.txt.textContent=GTE.tree.matrix.strategies[this.player+1][this.strat].moves[0].name;
    };
    
    Line.prototype.moveUnder = function(x,y){
        this.txt.setAttribute("visibility","visible");
        this.txt2.setAttribute("visibility","hidden");
        var x_step=Number(GTE.diag.width-2*GTE.diag.margin)/GTE.diag.nb_strat[this.player];
        var y_step=(Number(this.html_element[1].getAttribute("y2"))-Number(this.html_element[1].getAttribute("y1")))/GTE.diag.nb_strat[this.player];
        this.txt.setAttribute("x",Number(Number(this.html_element[1].getAttribute("x1"))+Number(x_step*Number(this.strat+0.5))));
        this.txt.setAttribute("y",Number(Number(this.html_element[1].getAttribute("y1"))+Number(y_step*Number(this.strat+0.5))+Number(15)));
        this.txt.textContent=GTE.tree.matrix.strategies[this.player+1][this.strat].moves[0].name;
    };
    
    // Add class to parent module
    parentModule.Line = Line;
    
    return parentModule;
}(GTE)); // Add to GTE.DIAGRAM sub-module
