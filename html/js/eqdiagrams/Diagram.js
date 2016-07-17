GTE = (function(parentModule) {
    "use strict";
    /**
     * Creates a new Diagrams Class.
     * @class
     */
    function Diagram() {
        this.precision = 1/document.getElementById("precision").value; // precision for payoffs.
        this.endpoints = []; //two dimension array [player][strat] that contains endpoints.
        this.lines = []; //two dimension array [player][strat_player] that contains lines.
        this.payoffs = [[]]; //two dimension array [player][strat] that contains payoffs
        this.best_response = [[]]; // two dimensions array [player][strat_other_player] that contains the best respons of a player. -1 means the two strategies are equivalent.
        this.envelopps= []; // two envelopp for each best response.
        this.moving_endpoint;
        this.moving_line;
        this.moving;
        this.prev_pos;
        this.rad=GTE.POINT_RADIUS;
        this.side=200;
        this.height=400;
        this.width=300;
        this.margin=50;
        this.max=10;
        this.min=0;
        this.step= (this.height-Number(2*this.margin))/(this.max-Number(this.min));
        
        this.assignEndpoints();
        this.assignEnvelopps();
        this.assignLines();
        this.ini_arrays();
    };
    
    Diagram.prototype.assignEnvelopps = function () {
        this.envelopps.push( new GTE.Envelopp(0) );
        this.envelopps.push( new GTE.Envelopp(1) );
    };
    
    Diagram.prototype.assignEndpoints = function() {
       var table_x=[[50,250,50,250],[450,450,650,650]];
        for (var j=0; j<2;j++){
            this.endpoints.push([]);
            for(var i=0;i<4;i++){
                this.endpoints[j].push( new GTE.Endpoint(table_x[j][i],this.height-this.margin,j,i));
            }
            this.endpoints[j].push( new GTE.Endpoint(table_x[j][0],this.height-this.margin,j,-1));
        }
    };
    
    Diagram.prototype.assignLines = function() {
        for (var j=0; j<2;j++){
            this.lines.push([]);
            for(var i=0;i<2;i++){
                this.lines[j].push( new GTE.Line(j,i));
            }
        }
    };
    
    Diagram.prototype.ini_arrays = function() {
        for (var i=0; i<2; i++){
            this.payoffs.push([]);
            this.best_response.push([]);
            for (var j=0; j<4; j++){
                this.payoffs[i].push(0);
            }
            for (var j=0; j<2; j++){
                this.best_response.push(-1);
            }
        }
    };
    
    /*
     Associate html element to endpoint object.
     */
    Diagram.prototype.doMouseDownEndpoint = function (event){
        //console.log("mouse down point");
        event.preventDefault();
        var strat=event.currentTarget.getAttribute("asso_strat");
        var player=event.currentTarget.getAttribute("asso_player");
        GTE.diag.moving_endpoint= GTE.diag.endpoints[player][strat];
        GTE.diag.moving=event.target;
        document.addEventListener("mousemove", GTE.diag.doMouseMoveEndpoint);
        document.addEventListener("mouseup", GTE.diag.doMouseupEndpoint);
        event.currentTarget.removeEventListener("mousedown", GTE.diag.doMouseDownEndpoint);
    };
    
    Diagram.prototype.doMouseDownLine = function (event){
        //console.log("mouse down line");
        event.preventDefault();
        GTE.diag.prev_pos=GTE.getMousePosition(event);
        var strat=event.currentTarget.getAttribute("asso_strat");
        var player=event.currentTarget.getAttribute("asso_player");
        GTE.diag.moving_line= GTE.diag.lines[player][strat];
        GTE.diag.prev_pros=GTE.getMousePosition(event);
        GTE.diag.moving=event.target;
        document.addEventListener("mousemove", GTE.diag.doMouseMoveLine);
        document.addEventListener("mouseup", GTE.diag.doMouseupLine);
        event.currentTarget.removeEventListener("mousedown", GTE.diag.doMouseDownLine);
    };
    
    /*
     Convert mouse's moves in endpoint's moves
     */
    Diagram.prototype.doMouseMoveEndpoint = function (event) {
        var mousePosition = GTE.getMousePosition(event);
        var svgPosition = GTE.svg.getBoundingClientRect();
        var newPos=Math.round((2*GTE.diag.height/(svgPosition.bottom-svgPosition.top)*(-mousePosition.y+svgPosition.top)+GTE.diag.height-GTE.diag.margin)/GTE.diag.step*GTE.diag.precision)/GTE.diag.precision;
        if (Number(newPos)<GTE.diag.min) newPos=GTE.diag.min;
        if (Number(newPos)>GTE.diag.max) newPos=GTE.diag.max;
        if( (Number(newPos)-GTE.diag.moving_endpoint.getPosy())*(Number(newPos)-GTE.diag.moving_endpoint.getPosy())>0.005){
            var player=GTE.diag.moving_endpoint.getPlayer();
            var strat=GTE.diag.moving_endpoint.getStrat();
            GTE.tree.matrix.matrix[strat].strategy.payoffs[player].value=newPos;
            GTE.tree.matrix.matrix[strat].strategy.payoffs[player].text=newPos;
            GTE.diag.redraw();
        }
    };
    
    Diagram.prototype.doMouseMoveLine = function (event) {
        var mousePosition = GTE.getMousePosition(event)
        var svgPosition = GTE.svg.getBoundingClientRect();
        var diff=mousePosition.y-GTE.diag.prev_pos.y;
        var player=GTE.diag.moving_line.getPlayer();
        var strat1=GTE.diag.moving_line.getStrat1();
        var strat2=GTE.diag.moving_line.getStrat2();
        var point1=GTE.tree.matrix.matrix[strat1].strategy.payoffs[player];
        var point2=GTE.tree.matrix.matrix[strat2].strategy.payoffs[player];
        var diffPos=~~((2*GTE.diag.height/(svgPosition.bottom-svgPosition.top)*(diff))/GTE.diag.step*GTE.diag.precision)/GTE.diag.precision;
        var pos1=Math.round((point1.value-diffPos)*GTE.diag.precision)/GTE.diag.precision;
        var pos2=Math.round((point2.value-diffPos)*GTE.diag.precision)/GTE.diag.precision;
        if (pos2>=GTE.diag.min && pos2<=GTE.diag.max && pos1>=GTE.diag.min && pos1<=GTE.diag.max && diffPos!=0  ){
            point1.value=pos1;
            point2.value=pos2;
            point1.text=pos1;
            point2.text=pos2;
            GTE.diag.prev_pos=mousePosition;
            point1.draw();
            point2.draw();
            GTE.diag.redraw();
        }
        //console.log("Moving: X = " + mousePosition.x + ", Y = " + mousePosition.y);
    };
    
    Diagram.prototype.doMouseupLine = function(event) {
        var mousePosition = GTE.getMousePosition(event)
        document.removeEventListener("mousemove", GTE.diag.doMouseMoveLine);
        document.removeEventListener("mouseup", GTE.diag.doMouseupEndpoint);
        GTE.diag.moving.addEventListener("mousedown", GTE.diag.doMouseDownLine);
        GTE.diag.moving=null;
    };
    
    Diagram.prototype.doMouseupEndpoint = function(event) {
        var mousePosition = GTE.getMousePosition(event)
        document.removeEventListener("mousemove", GTE.diag.doMouseMoveEndpoint);
        document.removeEventListener("mouseup", GTE.diag.doMouseupEndpoint);
        GTE.diag.moving.addEventListener("mousedown", GTE.diag.doMouseDownEndpoint);
        GTE.diag.moving=null;
    };
    
    /* Return the strategy couple of player i knowing the strategy of the other player
     */
    Diagram.prototype.couple_strat = function (i,j) {
        if (i==0){
            if (j==0)
            return [0,2]; // meaning 11 and 21 (player 1 plays 1 and 2 while player 2 plays 1)
            else
            return [1,3]; // meaning 12 and 22 (player 1 plays 1 and 2 while player 2 plays 2)
        }
        else {
            if (j==0)
            return [0,1]; // meaning 11 and 12
            else
            return [2,3]; // meaning 21 and 22
        }
    };
    
    Diagram.prototype.redraw = function (){
        if (Number(document.getElementById("precision").value) >0){
            GTE.diag.precision=1/Number(document.getElementById("precision").value);
            document.getElementById("precision").value=Number(document.getElementById("precision").value);
        }
        else{
            document.getElementById("precision").value=1/GTE.diag.precision;
        }
        GTE.tree.clear();
        document.getElementById('matrix-player-1').value = GTE.tree.matrix.getMatrixInStringFormat(0);
        document.getElementById('matrix-player-2').value = GTE.tree.matrix.getMatrixInStringFormat(1);
        GTE.tree.matrix.drawMatrix();
        this.compute_best_response();
        this.draw_up();
       this.draw_down();
    };
    
    Diagram.prototype.compute_best_response = function() {
        for ( var i=0;i<2;i++){
            for (var j=0;j<4;j++){ // updating payoff between matrix and drawing
                this.payoffs[i][j]=(Math.round(GTE.tree.matrix.matrix[j].strategy.payoffs[i].value*GTE.diag.precision)/GTE.diag.precision);
                GTE.tree.matrix.matrix[j].strategy.payoffs[i].value=this.payoffs[i][j];
                this.endpoints[i][j].move(this.height-this.margin-this.payoffs[i][j]*this.step);
            }
            for (var j=0;j<2;j++){
                if (Number(this.payoffs[i][this.couple_strat(i,j)[0]])==Number(this.payoffs[i][this.couple_strat(i,j)[1]])){
                    this.best_response[i][j]=-1;
                }
                else {
                    if (Number(this.payoffs[i][this.couple_strat(i,j)[0]])>Number(this.payoffs[i][this.couple_strat(i,j)[1]])){
                        this.best_response[i][j]=0;
                    }
                    else {
                        this.best_response[i][j]=1;
                    }
                }
            }
            if (this.best_response[i][0]==0 && this.best_response[i][1]==0) { ////If 0 is the best strategy, the middle point is on the left
                this.envelopps[i].setPoint(0, i*(this.width+2*this.margin)+this.margin, this.endpoints[i][this.couple_strat(i,0)[0]].getPosy());
                this.envelopps[i].setPoint(1, i*(this.width+2*this.margin)+this.margin, this.endpoints[i][this.couple_strat(i,0)[0]].getPosy());
                this.envelopps[i].setPoint(2, i*(this.width+2*this.margin)-this.margin+this.width, this.endpoints[i][this.couple_strat(i,1)[0]].getPosy());
            }
            else {
                if ((this.best_response[i][0]==1 && this.best_response[i][1]==1 )|| (this.best_response[i][0]==-1 && this.best_response[i][1]==-1)){ ////If 1 is the best strategy, the middle point is on the right
                    this.envelopps[i].setPoint(0, i*(this.width+2*this.margin)+this.margin, this.endpoints[i][this.couple_strat(i,0)[1]].getPosy());
                    this.envelopps[i].setPoint(1, i*(this.width+2*this.margin)+this.width-this.margin, this.endpoints[i][this.couple_strat(i,1)[1]].getPosy());
                    this.envelopps[i].setPoint(2, i*(this.width+2*this.margin)+this.width-this.margin, this.endpoints[i][this.couple_strat(i,1)[1]].getPosy());
                }
                else{
                    var middle_x=(this.payoffs[i][this.couple_strat(i,0)[1]]-Number(this.payoffs[i][this.couple_strat(i,0)[0]]))/(this.payoffs[i][this.couple_strat(i,0)[1]]- Number(this.payoffs[i][this.couple_strat(i,1)[1]]) + Number(this.payoffs[i][this.couple_strat(i,1)[0]]) - Number(this.payoffs[i][this.couple_strat(i,0)[0]]));
                    
                    var middle_y =(this.payoffs[i][this.couple_strat(i,1)[0]]-Number(this.payoffs[i][this.couple_strat(i,0)[0]]))*middle_x + this.payoffs[i][this.couple_strat(i,0)[0]];
                    if (this.best_response[i][0]>-1){
                        this.envelopps[i].setPoint(0, i*(this.width+2*this.margin)+this.margin, this.endpoints[i][this.couple_strat(i,0)[this.best_response[i][0]]].getPosy());
                    }
                    else {
                        this.envelopps[i].setPoint(0, i*(this.width+2*this.margin)+this.margin, this.endpoints[i][this.couple_strat(i,0)[0]].getPosy());
                    }
                    this.envelopps[i].setPoint(1, i*(this.width+2*this.margin)+this.margin+ middle_x*(this.width-2*this.margin), this.height-this.margin-middle_y*this.step);
                    if (this.best_response[i][1]>-1){
                        this.envelopps[i].setPoint(2, i*(this.width+2*this.margin)-this.margin+this.width, this.endpoints[i][this.couple_strat(i,1)[this.best_response[i][1]]].getPosy());
                    }
                    else{
                        this.envelopps[i].setPoint(2, i*(this.width+2*this.margin)-this.margin+this.width, this.endpoints[i][this.couple_strat(i,1)[0]].getPosy());
                    }
                    
                }
            }
        }
    };
    
    
    
    
    Diagram.prototype.draw_up = function(){
        //upates player's names
        var name_player=GTE.svg.getElementsByClassName("player1_name");
        for (var i=0;i<2;i++)
        name_player[i].textContent=GTE.tree.matrix.players[1].name;
        
        name_player=GTE.svg.getElementsByClassName("player2_name");
        for (var i=0;i<2;i++)
        name_player[i].textContent=GTE.tree.matrix.players[2].name;
        
        // Lines update svg1
        var lines=GTE.svg.getElementsByClassName("lined1");
        lines[0].setAttributeNS(null, "y1", this.endpoints[0][0].getPosy());
        lines[0].setAttributeNS(null, "y2", this.endpoints[0][1].getPosy());
        lines[1].setAttributeNS(null, "y1", this.endpoints[0][0].getPosy());
        lines[1].setAttributeNS(null, "y2", this.endpoints[0][1].getPosy());
        if (this.best_response[0][0]==1 || this.best_response[0][1]==1 || (this.best_response[0][0]==0 && this.best_response[0][1]==0)){//Label strategy iff they are part of a best reponse
            var labelline=GTE.svg.getElementById("text11");
            labelline.setAttributeNS(null, "y", Number(this.endpoints[0][0].getPosy())+(Number(this.endpoints[0][1].getPosy())-Number(this.endpoints[0][0].getPosy()))/200*30+Number(20));
            labelline.textContent=GTE.tree.matrix.strategies[1][0].moves[0].name;
        }
        else {
            labelline=GTE.svg.getElementById("text11");
            labelline.textContent="";
        }
        lines[2].setAttributeNS(null, "y1", this.endpoints[0][2].getPosy());
        lines[2].setAttributeNS(null, "y2", this.endpoints[0][3].getPosy());
        lines[3].setAttributeNS(null, "y1", this.endpoints[0][2].getPosy());
        lines[3].setAttributeNS(null, "y2", this.endpoints[0][3].getPosy());
        if(this.best_response[0][0]==2 || this.best_response[0][1]==2 || (this.best_response[0][0]==0 && this.best_response[0][1]==0)){//Label strategy iff they are part of a best reponse
            labelline=GTE.svg.getElementById("text12");
            labelline.setAttributeNS(null, "y", Number(this.endpoints[0][3].getPosy())+(Number(this.endpoints[0][2].getPosy())-Number(this.endpoints[0][3].getPosy()))/200*30+Number(20));
            labelline.textContent=GTE.tree.matrix.strategies[1][1].moves[0].name;
        }
        else {
            labelline=GTE.svg.getElementById("text12");
            labelline.textContent="";
        }
        // Lines update svg2
        lines=GTE.svg.getElementsByClassName("lined2");
        lines[0].setAttributeNS(null, "y1", this.endpoints[1][0].getPosy());
        lines[0].setAttributeNS(null, "y2", this.endpoints[1][2].getPosy());
        lines[1].setAttributeNS(null, "y1", this.endpoints[1][0].getPosy());
        lines[1].setAttributeNS(null, "y2", this.endpoints[1][2].getPosy());
        if (this.best_response[1][0]==1 || this.best_response[1][1]==1 || (this.best_response[1][0]==0 && this.best_response[1][1]==0)){//Label strategy iff they are part of a best reponse
            labelline=GTE.svg.getElementById("text21");
            labelline.setAttributeNS(null, "y", Number(this.endpoints[1][0].getPosy())+(Number(this.endpoints[1][2].getPosy())-Number(this.endpoints[1][0].getPosy()))/200*30+Number(20));
            labelline.textContent=GTE.tree.matrix.strategies[2][0].moves[0].name;
        }
        else {
            labelline=GTE.svg.getElementById("text21");
            labelline.textContent="";
        }
        lines[2].setAttributeNS(null, "y1", this.endpoints[1][1].getPosy());
        lines[2].setAttributeNS(null, "y2", this.endpoints[1][3].getPosy());
        lines[3].setAttributeNS(null, "y1", this.endpoints[1][1].getPosy());
        lines[3].setAttributeNS(null, "y2", this.endpoints[1][3].getPosy());
        if (this.best_response[1][0]==2 || this.best_response[1][1]==2 || (this.best_response[1][0]==0 && this.best_response[1][1]==0)){//Label strategy iff they are part of a best reponse
            labelline=GTE.svg.getElementById("text22");
            labelline.setAttributeNS(null, "y", Number(this.endpoints[1][3].getPosy())+(Number(this.endpoints[1][1].getPosy()-Number(this.endpoints[1][3].getPosy()))/200*30)+Number(20));
            labelline.textContent=GTE.tree.matrix.strategies[2][1].moves[0].name;
        }
        else {
            labelline=GTE.svg.getElementById("text22");
            labelline.textContent="";
        }
        //envelop svg1
        var envelop1=document.getElementById("envelop1");
        envelop1.setAttributeNS(null,"points", "50,50 "+this.envelopps[0].points[0][0]+","+this.envelopps[0].points[0][1]+" "+this.envelopps[0].points[1][0]+","+this.envelopps[0].points[1][1]+" "+this.envelopps[0].points[2][0]+","+this.envelopps[0].points[2][1]+" 250,50");
        var inter=GTE.svg.getElementById("inter1");
        inter.setAttributeNS(null,"cx", this.envelopps[0].points[1][0]);
        inter.setAttributeNS(null,"cy", this.envelopps[0].points[1][1]);
        var interlabel=GTE.svg.getElementById("interlabel1");
        interlabel.setAttributeNS(null, "x",this.envelopps[0].points[1][0]);
        interlabel.textContent=Math.round((Number(this.envelopps[0].points[1][0])-50)/2)/100;
        var stick=GTE.svg.getElementsByClassName("interstick1");
        for (i=0;i<stick.length;i++){
            stick[i].setAttributeNS(null, "x1",this.envelopps[0].points[1][0]);
            stick[i].setAttributeNS(null, "x2",this.envelopps[0].points[1][0]);}
        //envelop svg2
        var envelop2=document.getElementById("envelop2");
        envelop2.setAttributeNS(null,"points", "450,50 "+this.envelopps[1].points[0][0]+","+this.envelopps[1].points[0][1]+" "+this.envelopps[1].points[1][0]+","+this.envelopps[1].points[1][1]+" "+this.envelopps[1].points[2][0]+","+this.envelopps[1].points[2][1]+" 650,50");
        inter=GTE.svg.getElementById("inter2");
        inter.setAttributeNS(null,"cx", this.envelopps[1].points[1][0]);
        inter.setAttributeNS(null,"cy", this.envelopps[1].points[1][1]);
        interlabel=GTE.svg.getElementById("interlabel2");
        interlabel.setAttributeNS(null, "x",this.envelopps[1].points[1][0]);
        interlabel.textContent=Math.round((Number(this.envelopps[1].points[1][0])-450)/2)/100;
        var stick=GTE.svg.getElementsByClassName("interstick2");
        for (i=0;i<stick.length;i++){
            stick[i].setAttributeNS(null, "x1",this.envelopps[1].points[1][0]);
            stick[i].setAttributeNS(null, "x2",this.envelopps[1].points[1][0]);
        }
        
        var temp= GTE.svg.getElementsByClassName("strat22");
        for (i=0;i<temp.length;i++){
            temp[i].textContent=GTE.tree.matrix.strategies[2][1].moves[0].name;
        }
        temp= GTE.svg.getElementsByClassName("strat21");
        for (i=0;i<temp.length;i++){
            temp[i].textContent=GTE.tree.matrix.strategies[2][0].moves[0].name;
        }
        temp= GTE.svg.getElementsByClassName("strat12");
        for (i=0;i<temp.length;i++){
            temp[i].textContent=GTE.tree.matrix.strategies[1][1].moves[0].name;
        }
        temp= GTE.svg.getElementsByClassName("strat11");
        for (i=0;i<temp.length;i++){
            temp[i].textContent=GTE.tree.matrix.strategies[1][0].moves[0].name;
        }
    };
    
    Diagram.prototype.draw_down = function(){
        var temp=[];
        var temp2= GTE.svg.getElementsByClassName("brline");
        var path1="";
        var path2="";
        var path1_2="";
        var path2_2="";
        var path1_3="";
        var path2_3="";
        var nb=0;
        temp.push(GTE.svg.getElementsByClassName("p1")[0]);
        temp.push(GTE.svg.getElementsByClassName("p2")[0]);
        temp.push(GTE.svg.getElementsByClassName("p3")[0]);
        temp.push(GTE.svg.getElementsByClassName("p4")[0]);
        temp.push(GTE.svg.getElementsByClassName("m1")[0]);
        temp.push(GTE.svg.getElementsByClassName("m2")[0]);
        temp.push(GTE.svg.getElementsByClassName("m3")[0]);
        temp.push(GTE.svg.getElementsByClassName("m4")[0]);
        temp.push(GTE.svg.getElementsByClassName("m5")[0]);
       for (var i=0;i<4;i++){ //Initializing pure equilibria
            temp[i].setAttributeNS(null, "r", 2*this.rad);
       }
       for (var i=4;i<9;i++){ //Initializing mixed equilibria
            temp[i].setAttributeNS(null, "fill", "green");
            temp[i].setAttributeNS(null, "height", 0);
            temp[i].setAttributeNS(null, "width", 0);
       }
        //setting player 1 path
        // We remove pure equilibria that don't correspond to player 1.
        if (this.best_response[0][0]==this.best_response[0][1]){
            if (this.best_response[0][1]==-1){
       path1=this.margin+","+Number(2*this.margin+this.height)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side)+", "+this.margin+","+Number(2*this.margin+this.height+this.side)+", "+this.margin+","+Number(2*this.margin+this.height); //"50,500, 250,500, 250,700, 50,700, 50,500";
                temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                temp[8].setAttributeNS(null, "fill", "pink");
                
                temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                
                
                temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                temp[5].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                temp[5].setAttributeNS(null, "width", Number(2*this.rad));
                
                
                temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                temp[6].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                
                
                temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                temp[7].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                temp[7].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                temp[7].setAttributeNS(null, "width", Number(2*this.rad));
                //remove all pure equilibria
                temp[0].setAttributeNS(null, "r", 0);
                temp[1].setAttributeNS(null, "r", 0);
                temp[2].setAttributeNS(null, "r", 0);
                temp[3].setAttributeNS(null, "r", 0);
            }
            else{
                if (this.best_response[0][1]==0){
                    path1=Number(this.margin)+","+Number(this.height+2*this.margin)+","+ Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                    temp[2].setAttributeNS(null, "r", 0);
                    temp[3].setAttributeNS(null, "r", 0);
                    
                    temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                    temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                    temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                    temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                }
                else {
                    path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+","+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                    temp[0].setAttributeNS(null, "r", 0);
                    temp[1].setAttributeNS(null, "r", 0);
                    
                    temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                    temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                    temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                    temp[6].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                }
            }
            
        }
        else{
            if (this.best_response[0][0]==-1){
                temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                temp[7].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                temp[7].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                temp[7].setAttributeNS(null, "width", Number(2*this.rad));
                if (this.best_response[0][1]==0){
                    path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+ Number(this.margin)+","+Number(this.height+2*this.margin)+", "+ Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                    temp[2].setAttributeNS(null, "r", 0);
                    
                    temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                    temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                    temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                    temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                }
                else{
                    path1=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+ Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                    temp[1].setAttributeNS(null, "r", 0);
                    
                    temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                    temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                    temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                    temp[6].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                }
            }
            else{
                if (this.best_response[0][0]==0){
                    if (this.best_response[0][1]==-1){
                        path1=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+ Number(this.margin+this.side)+","+Number(this.height+2*this.margin)+", "+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        temp[3].setAttributeNS(null, "r", 0);
                        
                        temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                        temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[5].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[5].setAttributeNS(null, "width", Number(2*this.rad));
                        
                        temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                    }
                    else{
                        path1=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+this.envelopps[0].points[1][0]+","+Number(this.height+2*this.margin)+", "+this.envelopps[0].points[1][0]+","+Number(2*this.margin+this.height+this.side)+", "+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        temp[8].setAttributeNS(null, "x", this.envelopps[0].points[1][0]-5);
                        temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "width", Number(2*this.rad));
                        
                        temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[4].setAttributeNS(null, "width", ~~(this.envelopps[0].points[1][0]-Number(this.margin))+Number(2*this.rad));
                        
                        temp[6].setAttributeNS(null, "x", this.envelopps[0].points[1][0]-5);
                        temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                        temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[6].setAttributeNS(null, "width", ~~(Number(this.margin+this.side)-this.envelopps[0].points[1][0])+Number(2*this.rad));
                        
                        temp[1].setAttributeNS(null, "r", 0);
                        temp[3].setAttributeNS(null, "r", 0);
                    }
                }
                else{
                    if (this.best_response[0][1]==0){
                        path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+this.envelopps[0].points[1][0]+","+Number(2*this.margin+this.height+this.side)+", "+this.envelopps[0].points[1][0]+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                        temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[6].setAttributeNS(null, "width", ~~(this.envelopps[0].points[1][0]-Number(this.margin))+Number(2*this.rad));
                        
                        temp[8].setAttributeNS(null, "x", this.envelopps[0].points[1][0]-5);
                        temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "width", Number(2*this.rad));
                        
                        temp[4].setAttributeNS(null, "x", this.envelopps[0].points[1][0]-5);
                        temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[4].setAttributeNS(null, "width", ~~(Number(this.margin+this.side)-this.envelopps[0].points[1][0])+Number(2*this.rad));
                        
                        temp[0].setAttributeNS(null, "r", 0);
                        temp[2].setAttributeNS(null, "r", 0);
                    }
                    else{
                        path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        temp[0].setAttributeNS(null, "r", 0);
                        
                        temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                        temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[5].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[5].setAttributeNS(null, "width", Number(2*this.rad));
                        
                        temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                        temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[6].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                    }
                }
            }
        }
        
        //setting player 2 path
        // We remove pure and mixed equilibria that don't correspond to player 2.
        if (this.best_response[1][0]==this.best_response[1][1]){
            if (this.best_response[1][1]==-1){
                path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(this.height+2*this.margin);
                //remove all pure equilibria
                temp[0].setAttributeNS(null, "r", 0);
                temp[1].setAttributeNS(null, "r", 0);
                temp[2].setAttributeNS(null, "r", 0);
                temp[3].setAttributeNS(null, "r", 0);
                if (this.best_response[0][0]==-1 && this.best_response[0][1]==-1)
                temp[8].setAttributeNS(null, "fill", "green");
                else {
                    if (temp[8].getAttribute("width")==0){
                        temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "fill", "cyan");
                    }
                    else{
                        if (temp[5].getAttribute("width")==0){
                            temp[5].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[5].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                            temp[5].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                            temp[5].setAttributeNS(null, "fill", "cyan");
                            GTE.svg.insertBefore(temp[5],temp[8]);
                        }
                        else {
                            temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[7].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[7].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                            temp[7].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                            temp[7].setAttributeNS(null, "fill", "cyan");
                            GTE.svg.insertBefore(temp[7],temp[8]);
                        }
                    }
                }
            }
            else{
                if (this.best_response[1][1]==0){
                    path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin)+","+Number(2*this.margin+this.height+this.side);
                    temp[1].setAttributeNS(null, "r", 0);
                    temp[2].setAttributeNS(null, "r", 0);
                    temp[4].setAttributeNS(null, "height", 0);
                    temp[5].setAttributeNS(null, "height", 0);
                    temp[6].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);}
                    temp[4].setAttributeNS(null, "width", 0);
                    temp[5].setAttributeNS(null, "width", 0);
                    temp[6].setAttributeNS(null, "width", 0);
                    if (temp[7].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[7].getAttribute("width")>0)
                    temp[0].setAttributeNS(null, "r", 0);//remove end point
                    if (Number(temp[7].getAttribute("y"))+Number(temp[7].getAttribute("height"))==705)
                    temp[3].setAttributeNS(null, "r", 0);//remove end point
                }
                else {
                    path2=Number(this.margin+this.side)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                    temp[0].setAttributeNS(null, "r", 0);
                    temp[3].setAttributeNS(null, "r", 0);
                    temp[4].setAttributeNS(null, "height", 0);
                    temp[6].setAttributeNS(null, "height", 0);
                    temp[7].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >0){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);
                    }
                    temp[4].setAttributeNS(null, "width", 0);
                    temp[6].setAttributeNS(null, "width", 0);
                    temp[7].setAttributeNS(null, "width", 0);
                    if (temp[5].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[5].getAttribute("width")>0)
                    temp[1].setAttributeNS(null, "r", 0);//remove end point
                    if (Number(temp[5].getAttribute("y"))+Number(temp[5].getAttribute("height"))==705)
                    temp[2].setAttributeNS(null, "r", 0);//remove end point
                }
            }
            
        }
        else {
            if (this.best_response[1][0]==-1){
                if (this.best_response[1][1]==0){
                    path2=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                    temp[2].setAttributeNS(null, "r", 0);
                    temp[5].setAttributeNS(null, "height", 0);
                    temp[6].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >0){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);
                    }
                    temp[5].setAttributeNS(null, "width", 0);
                    temp[6].setAttributeNS(null, "width", 0);
                    if (temp[7].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[7].getAttribute("width")>0)
                    temp[0].setAttributeNS(null, "r", 0);//remove end point
                    if (Number(temp[7].getAttribute("y"))+Number(temp[7].getAttribute("height"))==705)
                    temp[3].setAttributeNS(null, "r", 0);//remove end point
                    if (temp[4].getAttribute("x")==Number(this.margin-this.rad) && temp[4].getAttribute("width")>0)
                    temp[0].setAttributeNS(null, "r", 0);//remove end point
                    if (Number(temp[4].getAttribute("x"))+Number(temp[4].getAttribute("width"))==255)
                    temp[1].setAttributeNS(null, "r", 0);//remove end point
                }
                else{
                    path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                    temp[3].setAttributeNS(null, "r", 0);
                    temp[6].setAttributeNS(null, "height", 0);
                    temp[7].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);
                    }
                    temp[6].setAttributeNS(null, "width", 0);
                    temp[7].setAttributeNS(null, "width", 0);
                    if (temp[5].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[5].getAttribute("width")>0 )
                    temp[1].setAttributeNS(null, "r", 0);//remove end point
                    if (Number(temp[5].getAttribute("y"))+Number(temp[5].getAttribute("height"))==705)
                    temp[2].setAttributeNS(null, "r", 0);//remove end point
                    if (temp[4].getAttribute("x")==Number(this.margin-this.rad) && temp[4].getAttribute("width")>0)
                    temp[0].setAttributeNS(null, "r", 0);//remove end point
                    if (Number(temp[4].getAttribute("x"))+Number(temp[4].getAttribute("width"))==255)
                    temp[1].setAttributeNS(null, "r", 0);//remove end point
                }
            }
            else{
                if (this.best_response[1][0]==0){
                    if (this.best_response[1][1]==-1){
                        path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        temp[1].setAttributeNS(null, "r", 0);
                        temp[4].setAttributeNS(null, "height", 0);
                        temp[5].setAttributeNS(null, "height", 0);
                        if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                            temp[8].setAttributeNS(null, "height", 0);
                            temp[8].setAttributeNS(null, "width", 0);
                        }
                        temp[4].setAttributeNS(null, "width", 0);
                        temp[5].setAttributeNS(null, "width", 0);
                        if (temp[7].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[7].getAttribute("width")>0)
                        temp[0].setAttributeNS(null, "r", 0);//remove end point
                        if (Number(temp[7].getAttribute("y"))+Number(temp[7].getAttribute("height"))==705)
                        temp[3].setAttributeNS(null, "r", 0);//remove end point
                        if (temp[6].getAttribute("x")==Number(this.margin-this.rad) && temp[6].getAttribute("width")>0)
                        temp[3].setAttributeNS(null, "r", 0);//remove end point
                        if (Number(temp[6].getAttribute("x"))+Number(temp[6].getAttribute("width"))==255)
                        temp[2].setAttributeNS(null, "r", 0);//remove end point
                    }
                    else{
                        path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin)+","+Number(this.envelopps[1].points[1][0]+Number(Number(this.margin)))+", "+Number(this.margin+this.side)+","+Number(this.envelopps[1].points[1][0]+Number(this.margin))+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        temp[1].setAttributeNS(null, "r", 0);
                        temp[3].setAttributeNS(null, "r", 0);
                        if (this.best_response[0][1]>-1 && this.best_response[0][0]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[5].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", 0);
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            temp[7].setAttributeNS(null, "width", 0);
                            temp[8].setAttributeNS(null, "y", Number(this.envelopps[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            if (this.best_response[0][0] ==-1 || this.best_response[0][1] ==-1){
                                temp[4].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                                temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                                temp[4].setAttributeNS(null, "fill", "pink");
                                GTE.svg.insertBefore(temp[4],temp[8]);
                            }
                        }
                        if (this.best_response[0][0]==-1 && this.best_response[0][1]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[5].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", Number(this.envelopps[1].points[1][0]-Number(Number(this.height+2*this.margin))+Number(60)));
                            if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                                temp[8].setAttributeNS(null, "height", 0);
                                temp[8].setAttributeNS(null, "width", 0);
                            }
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            temp[0].setAttributeNS(null, "r", 0);//remove end point
                        }
                        if (this.best_response[0][1]==-1 && this.best_response[0][0]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                                temp[8].setAttributeNS(null, "height", 0);
                                temp[8].setAttributeNS(null, "width", 0);
                            }
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "height",Number(Number(2*this.margin+this.height+this.side)-Number(this.envelopps[1].points[1][0])-Number(40)) );
                            temp[5].setAttributeNS(null, "y", Number(this.envelopps[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            temp[7].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            temp[2].setAttributeNS(null, "r", 0);//remove end point
                        }
                        if (this.best_response[0][1]==-1 && this.best_response[0][0]==-1){
                            
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            
                            temp[0].setAttributeNS(null, "r", 0);//remove end point
                            temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[7].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[7].setAttributeNS(null, "height", Number(this.envelopps[1].points[1][0]-Number(Number(this.height+2*this.margin))+Number(60)));
                            temp[7].setAttributeNS(null, "width", Number(2*this.rad));
                            
                            temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[8].setAttributeNS(null, "y", Number(this.envelopps[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                            
                            temp[2].setAttributeNS(null, "r", 0);//remove end point
                            temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                            temp[5].setAttributeNS(null, "y", Number(this.envelopps[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            temp[5].setAttributeNS(null, "height",Number(Number(2*this.margin+this.height+this.side)-Number(this.envelopps[1].points[1][0])-Number(40)) );
                            temp[5].setAttributeNS(null, "width", Number(2*this.rad));
                            
                            if (this.best_response[0][0] ==-1 || this.best_response[0][1] ==-1){
                                temp[4].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                                temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                                temp[4].setAttributeNS(null, "fill", "pink");
                                GTE.svg.insertBefore(temp[4],temp[8]);
                            }
                        }
                    }
                }
                else{
                    if (this.best_response[1][1]==0){
                        path2=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(this.envelopps[1].points[1][0]+Number(Number(this.margin)))+", "+Number(this.margin+this.side)+","+Number(this.envelopps[1].points[1][0]+Number(Number(this.margin)))+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        temp[0].setAttributeNS(null, "r", 0);
                        temp[2].setAttributeNS(null, "r", 0);
                        if (this.best_response[0][1]>-1 && this.best_response[0][0]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[5].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", 0);
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            temp[7].setAttributeNS(null, "width", 0);
                            temp[8].setAttributeNS(null, "y", Number(this.envelopps[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            if (this.best_response[0][0] ==-1 || this.best_response[0][1] ==-1){
                                temp[4].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                                temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                                temp[4].setAttributeNS(null, "fill", "pink");
                                GTE.svg.insertBefore(temp[4],temp[8]);
                            }
                        }
                        if (this.best_response[0][0]==-1 && this.best_response[0][1]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[5].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", Number(Number(2*this.margin+this.height+this.side)-Number(this.envelopps[1].points[1][0])-Number(40)));
                            temp[7].setAttributeNS(null, "y", Number(this.envelopps[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                                temp[8].setAttributeNS(null, "height", 0);
                                temp[8].setAttributeNS(null, "width", 0);
                            }
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            temp[3].setAttributeNS(null, "r", 0);//remove end point
                        }
                        if (this.best_response[0][1]==-1 && this.best_response[0][0]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                                temp[8].setAttributeNS(null, "height", 0);
                                temp[8].setAttributeNS(null, "width", 0);
                            }
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "height", Number(this.envelopps[1].points[1][0]-Number(Number(this.height+2*this.margin))+Number(60) ));
                            temp[7].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            temp[1].setAttributeNS(null, "r", 0);//remove end point
                        }
                        if (this.best_response[0][1]==-1 && this.best_response[0][0]==-1){
                            
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            
                            temp[3].setAttributeNS(null, "r", 0);//remove end point
                            temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[7].setAttributeNS(null, "y", Number(this.envelopps[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            temp[7].setAttributeNS(null, "height", Number(Number(2*this.margin+this.height+this.side)-Number(this.envelopps[1].points[1][0])-Number(40)));
                            temp[7].setAttributeNS(null, "width", Number(2*this.rad));
                            
                            temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[8].setAttributeNS(null, "y", Number(this.envelopps[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                            
                            temp[1].setAttributeNS(null, "r", 0);//remove end point
                            temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                            temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[5].setAttributeNS(null, "height",Number(this.envelopps[1].points[1][0]-Number(Number(this.height+2*this.margin))+Number(60) ));
                            temp[5].setAttributeNS(null, "width", Number(2*this.rad));
                            
                            if (this.best_response[0][0] ==-1 || this.best_response[0][1] ==-1){
                                temp[4].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                                temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                                temp[4].setAttributeNS(null, "fill", "pink");
                                GTE.svg.insertBefore(temp[4],temp[8]);
                            }
                        }
                    }
                    else{
                        path2=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        temp[0].setAttributeNS(null, "r", 0);
                        temp[4].setAttributeNS(null, "height", 0);
                        temp[7].setAttributeNS(null, "height", 0);
                        if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                            temp[8].setAttributeNS(null, "height", 0);
                            temp[8].setAttributeNS(null, "width", 0);
                        }
                        temp[4].setAttributeNS(null, "width", 0);
                        temp[7].setAttributeNS(null, "width", 0);
                        if (temp[5].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[5].getAttribute("width")>0)
                        temp[1].setAttributeNS(null, "r", 0);//remove end point
                        if (Number(temp[5].getAttribute("y"))+Number(temp[5].getAttribute("height"))==705)
                        temp[2].setAttributeNS(null, "r", 0);//remove end point
                        if (Number(temp[6].getAttribute("x"))==Number(this.margin-this.rad) && temp[6].getAttribute("width")>0)
                        temp[3].setAttributeNS(null, "r", 0);//remove end point
                        if (Number(temp[6].getAttribute("x"))+Number(temp[6].getAttribute("width"))==255)
                        temp[2].setAttributeNS(null, "r", 0);//remove end point
                    }
                }
            }
        }
        
        temp2[0].setAttributeNS(null, "points", path1);
        temp2[1].setAttributeNS(null, "points", path2);
        
        var stick=GTE.svg.getElementsByClassName("middle21");
        for (i=0;i<stick.length;i++){
            if(this.envelopps[1].points[1][0]==650){
                stick[i].textContent=""
            }
            if(this.best_response[1][1]==1)
           var  pos=(this.envelopps[1].points[1][0]+Number(450))/2;
            else
           var  pos=(this.envelopps[1].points[1][0]+Number(650))/2;
            
            stick[i].setAttributeNS(null, "x",pos);
        }
        var stick=GTE.svg.getElementsByClassName("middle22");
        for (i=0;i<stick.length;i++){
            if(this.envelopps[1].points[1][0]==450){
                stick[i].textContent=""
            }
            if(this.best_response[1][0]==1)
            pos=(this.envelopps[1].points[1][0]+Number(450))/2;
            else
            pos=(this.envelopps[1].points[1][0]+Number(650))/2;
            stick[i].setAttributeNS(null, "x",pos);
        }
        if (this.envelopps[1].points[1][0]>450 && this.envelopps[1].points[1][0] <650){
            var t1=Number(this.envelopps[1].points[1][0])-Number(410);
            var t2=460+Number(this.envelopps[1].points[1][0])-Number(410);
            GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d", "M"+this.envelopps[1].points[1][0]+",460 A"+t1+","+t1+" 0 0,1 410,"+t2);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y1", t2);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y2", t2);
        }
       if (this.envelopps[1].points[1][0]==450){
       GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d","M450,460 A40,40 0 0,1 410,500");
       }
       if (this.envelopps[1].points[1][0]==650){
       GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d","M650,460 A240,240 0 0,1 410,700");
       }
        if (this.envelopps[0].points[1][0]>Number(this.margin) && this.envelopps[0].points[1][0]<Number(this.margin+this.side)){
            GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x1", this.envelopps[0].points[1][0]);
            GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x2", this.envelopps[0].points[1][0]);
        }
        var stick=GTE.svg.getElementsByClassName("middle11");
        for (i=0;i<stick.length;i++){
            if(this.envelopps[0].points[1][0]==Number(this.margin+this.side)){
                stick[i].textContent=""
            }
            if(this.best_response[0][1]==1)
            pos=(this.envelopps[0].points[1][0]+Number(Number(this.margin)))/2;
            else
            pos=(this.envelopps[0].points[1][0]+Number(Number(this.margin+this.side)))/2;
            stick[i].setAttributeNS(null, "x",pos);
        }
        var stick=GTE.svg.getElementsByClassName("middle12");
        for (i=0;i<stick.length;i++){
            if(this.envelopps[0].points[1][0]==Number(this.margin)){
                stick[i].textContent=""
            }
            if(this.best_response[0][0]==1)
            pos=(this.envelopps[0].points[1][0]+Number(this.margin))/2;
            else
            pos=(this.envelopps[0].points[1][0]+Number(this.margin+this.side))/2;
            stick[i].setAttributeNS(null, "x",pos);
        }
        
        
        
        
    };
    
    
    // Add class to parent module
    parentModule.Diagram = Diagram;
    
    return parentModule;
}(GTE)); // Add to GTE.TREE sub-module
