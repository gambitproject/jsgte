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
        this.payoffs = []; //three dimension array [player][strat_p1][strat_p2] that contains payoffs
        this.best_response = []; // two dimensions array [player][strat_other_player] that contains the best respons of a player. -1 means the two strategies are equivalent.
        this.envelopes= []; // two envelope for each best response.
        this.nb_strat= [2,2];// Player's number of strategies.
        this.intersect= []; // 2 arrays containing the mixed equilibrium.
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
        
    };
    
    Diagram.prototype.ini =function (){
        this.nb_strat=[GTE.tree.matrix.strategies[1].length,GTE.tree.matrix.strategies[2].length];
        this.assignEndpoints();
        this.assignEnvelopes();
        this.assignLines();
        this.assignIntersections();
        this.ini_arrays();
    }
    
    Diagram.prototype.assignEnvelopes = function () {
        this.envelopes.push( new GTE.Envelope(0) );
        this.envelopes.push( new GTE.Envelope(1) );
    };
    
    Diagram.prototype.assignEndpoints = function() {
        var table_x=[[50,250],[450,650]];
        for (var j=0; j<2;j++){
            this.endpoints.push([]);
            for(var i=0;i<this.nb_strat[j];i++){
                if (j==0){
                    this.endpoints[j].push( new GTE.Endpoint(table_x[j%2][i%2],this.height-this.margin,j,i,i));
                }
                else{
                    this.endpoints[j].push( new GTE.Endpoint(table_x[j%2][i%2],this.height-this.margin,j,i,2*i));
                }
            }
            for(var i=0;i<this.nb_strat[j];i++){
                var ind=this.nb_strat[j]+i;
                if (j==0){
                    this.endpoints[j].push( new GTE.Endpoint(table_x[j%2][ind%2],this.height-this.margin,j,ind,ind));
                }
                else{
                    this.endpoints[j].push( new GTE.Endpoint(table_x[j%2][ind%2],this.height-this.margin,j,ind,Number(2*i+1)));
                }
            }
        }
        
    };
    
    Diagram.prototype.assignLines = function() {
        for (var j=0; j<2;j++){
            this.lines.push([]);
            for(var i=0;i<this.nb_strat[j];i++){
                this.lines[j].push( new GTE.Line(j,i));
            }
        }
    };
    
    Diagram.prototype.assignIntersections = function(){
        for (var i=0; i<2 ; i++){
            this.intersect.push([]);
            for (var j=0 ; j< this.nb_strat[i]-1 ; j++){
                for (var k=j+1; k<this.nb_strat[i]; k++){
                    var temp=new GTE.Intersection(i, j, k);
                    temp.attachLine(this.lines[i][j]);
                    temp.attachLine(this.lines[i][k]);
                    this.intersect[i].push( temp);
                    
                }
            }
        }
    };
    
    Diagram.prototype.ini_arrays = function() {
        for (var i=0; i<2; i++){
            this.payoffs.push([]);
            this.best_response.push([]);
            for (var j=0; j<this.nb_strat[0]; j++){
                this.payoffs[i].push([]);
                for (var k=0;k<this.nb_strat[1] ; k++){
                    this.payoffs[i][j].push(0);
                }
            }
            for (var j=0; j<GTE.tree.matrix.strategies[1+i].length; j++){
                this.best_response[i].push(-1);
            }
        }
    };
    
    /*
     Associate html element to endpoint object.
     */
    Diagram.prototype.doMouseDownEndpoint = function (event){
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
        //console.log(GTE.diag.moving_endpoint);
        var mousePosition = GTE.getMousePosition(event);
        var svgPosition = GTE.svg.getBoundingClientRect();
        var newPos=Math.round((2*GTE.diag.height/(svgPosition.bottom-svgPosition.top)*(-mousePosition.y+svgPosition.top)+GTE.diag.height-GTE.diag.margin)/GTE.diag.step*GTE.diag.precision)/GTE.diag.precision;
        if (Number(newPos)<GTE.diag.min) newPos=GTE.diag.min;
        if (Number(newPos)>GTE.diag.max) newPos=GTE.diag.max;
        if( (Number(newPos)-GTE.diag.moving_endpoint.getPosy())*(Number(newPos)-GTE.diag.moving_endpoint.getPosy())>0.005){
            var player=GTE.diag.moving_endpoint.getPlayer();
            var strat=GTE.diag.moving_endpoint.getStrat_mat();
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
        document.removeEventListener("mouseup", GTE.diag.doMouseupLine);
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
        this.nb_strat=[GTE.tree.matrix.strategies[1].length,GTE.tree.matrix.strategies[2].length];
        GTE.tree.clear();
        document.getElementById('matrix-player-1').value = GTE.tree.matrix.getMatrixInStringFormat(0);
        document.getElementById('matrix-player-2').value = GTE.tree.matrix.getMatrixInStringFormat(1);
        GTE.tree.matrix.drawMatrix();
        /*for (var i=0;i<this.nb_strat[0]-1;i++){
         for (var j=i+1; j<this.nb_strat[0];j++){
         
         this.compute_best_response_bis(i,j,0,1);
         }
         }*/
        this.compute_best_response(0,1,0,1);
        this.draw_up();
        this.draw_down();
    };
    
    Diagram.prototype.compute_best_response = function(strat11=0, strat12=1, strat21=0, strat22=1) {
        for (var i=0;i<this.nb_strat[0];i++){
            this.payoffs[0][i][strat21]=(Math.round(GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+strat21)].strategy.payoffs[0].value*GTE.diag.precision)/GTE.diag.precision);
            GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+strat21)].strategy.payoffs[0].value=this.payoffs[0][i][strat21];
            this.payoffs[0][i][strat22]=(Math.round(GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+strat22)].strategy.payoffs[0].value*GTE.diag.precision)/GTE.diag.precision);
            GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+strat22)].strategy.payoffs[0].value=this.payoffs[0][i][strat22];
        }
        for (var j=0;j<this.nb_strat[1];j++){
            this.payoffs[1][strat11][j]=(Math.round(GTE.tree.matrix.matrix[Number(strat11*this.nb_strat[1]+j)].strategy.payoffs[1].value*GTE.diag.precision)/GTE.diag.precision);
            GTE.tree.matrix.matrix[Number(strat11*this.nb_strat[1]+j)].strategy.payoffs[1].value=this.payoffs[1][strat11][j];
            this.payoffs[1][strat12][j]=(Math.round(GTE.tree.matrix.matrix[Number(strat12*this.nb_strat[1]+j)].strategy.payoffs[1].value*GTE.diag.precision)/GTE.diag.precision);
            GTE.tree.matrix.matrix[Number(strat12*this.nb_strat[1]+j)].strategy.payoffs[1].value=this.payoffs[1][strat12][j];
        }
        for (var i=0;i<this.nb_strat[0];i++){
            this.endpoints[0][i*2].move(this.height-this.margin-this.payoffs[0][i][strat21]*this.step);
            this.endpoints[0][Number(i*2+1)].move(this.height-this.margin-this.payoffs[0][i][strat22]*this.step);
        }
        for (var i=0;i<this.nb_strat[1];i++){
            this.endpoints[1][i*2].move(this.height-this.margin-this.payoffs[1][strat11][i]*this.step);
            this.endpoints[1][Number(i*2+1)].move(this.height-this.margin-this.payoffs[1][strat12][i]*this.step);
        }
        // compute all intersect points
        var strat=[[strat21,strat22],[strat11,strat12]]
        var Y11; //left extremity of the first line
        var Y12; //right extremity of the first line
        var Y21; //left extremity of the second line
        var Y22; //right extremity of the second line
        for (var i=0;i<2;i++){
            for (var j=0; j< this.nb_strat[i]-1;j++){
                for (var k=j+1 ; k<this.nb_strat[i];k++){
                    var temp= GTE.svg.getElementsByClassName("strat"+""+i+""+j);
                    for ( var l=0;l<temp.length;l++){
                        temp[l].textContent=GTE.tree.matrix.strategies[i+1][j].moves[0].name;
                    }
                    if (i==0){
                        Y11=this.payoffs[i][j][strat[i][0]];
                        Y12=this.payoffs[i][j][strat[i][1]];
                        Y21=this.payoffs[i][k][strat[i][0]];
                        Y22=this.payoffs[i][k][strat[i][1]];}
                    else{
                        Y11=this.payoffs[i][strat[i][0]][j];
                        Y12=this.payoffs[i][strat[i][1]][j];
                        Y21=this.payoffs[i][strat[i][0]][k];
                        Y22=this.payoffs[i][strat[i][1]][k];
                    }
                    var middle_x=(Y21-Number(Y11))/(Y21-Number(Y22)+Y12-Number(Y11));
                    var middle_y=(Y12-Number(Y11))*middle_x+Number(Y11);
                    this.envelopes[i].setPoint(1,i*(2*this.margin+this.width)+Number(this.margin)+middle_x*(this.width-2*Number(this.margin)), this.height-this.margin-(middle_y)*this.step);
                    if (Y11>Y21){
                        this.envelopes[i].setPoint(0,i*(2*this.margin+this.width)+this.margin, this.endpoints[i][2*j].getPosy());
                    }
                    else{
                        this.envelopes[i].setPoint(0,i*(2*this.margin+this.width)+this.margin, this.endpoints[i][2*k].getPosy());
                    }
                    if (Y12>Y22){
                        this.envelopes[i].setPoint(2,i*(2*this.margin+this.width)+this.width-Number(this.margin), this.endpoints[i][2*j+1].getPosy());
                    }
                    else{
                        this.envelopes[i].setPoint(2,i*(2*this.margin+this.width)+this.width-Number(this.margin), this.endpoints[i][2*k+1].getPosy());
                    }
                    if (Number(Y11)>Number(Y21) && Number(Y12)>Number(Y22)){
                        var middle_x=0;
                        var middle_y=0; //there is no intersection point
                        this.best_response[i][0]=0;
                        this.best_response[i][1]=0;
                        this.envelopes[i].setPoint(0,i*(2*this.margin+this.width)+this.margin, this.endpoints[i][2*j].getPosy());
                        this.envelopes[i].setPoint(1,i*(2*this.margin+this.width)+this.margin, this.endpoints[i][2*j].getPosy());
                        this.envelopes[i].setPoint(2,i*(2*this.margin+this.width)+this.width-Number(this.margin), this.endpoints[i][2*j+1].getPosy());
                    }
                    else{
                        if (Y11<Y21 && Y12<Y22){
                            var middle_x=1;
                            var middle_y=0; //there is no intersection point
                            this.best_response[i][0]=1;
                            this.best_response[i][1]=1;
                            this.envelopes[i].setPoint(0,i*(2*this.margin+this.width)+this.margin, this.endpoints[i][2*k].getPosy());
                            this.envelopes[i].setPoint(1,i*(2*this.margin+this.width)+this.width-Number(this.margin), this.endpoints[i][2*k+1].getPosy());
                            this.envelopes[i].setPoint(2,i*(2*this.margin+this.width)+this.width-Number(this.margin), this.endpoints[i][2*k+1].getPosy());
                        }
                        else {
                            if (Y11==Y21){
                                var middle_x=0;
                                var middle_y=Y21; //there is no intersection point
                                this.best_response[i][0]=-1;
                                this.envelopes[i].setPoint(0,i*(2*this.margin+this.width)+this.margin, this.endpoints[i][2*k].getPosy());
                                this.envelopes[i].setPoint(1,i*(2*this.margin+this.width)+this.margin, this.endpoints[i][2*k].getPosy());
                                if (Y12>Y22){
                                    this.best_response[i][1]=0;
                                    this.envelopes[i].setPoint(2,i*(2*this.margin+this.width)+this.width-Number(this.margin), this.endpoints[i][2*j+1].getPosy());
                                }
                                else{
                                    if (Y12==Y22){
                                        this.best_response[i][1]=-1;
                                        this.envelopes[i].setPoint(2,i*(2*this.margin+this.width)+this.width-Number(this.margin), this.endpoints[i][2*k+1].getPosy());
                                    }
                                    else {
                                        this.best_response[i][1]=1;
                                        this.envelopes[i].setPoint(2,i*(2*this.margin+this.width)+this.width-Number(this.margin), this.endpoints[i][2*k+1].getPosy());
                                    }
                                }
                            }else{
                                if (Y12==Y22){
                                    var middle_x=1;
                                    var middle_y=Y22; //there is no intersection point
                                    this.best_response[i][1]=-1;
                                    this.envelopes[i].setPoint(1,i*(2*this.margin+this.width)+this.width-Number(this.margin), this.endpoints[i][2*k+1].getPosy());
                                    this.envelopes[i].setPoint(2,i*(2*this.margin+this.width)+this.width-Number(this.margin), this.endpoints[i][2*k+1].getPosy());
                                    if (Y11>Y21){
                                        this.envelopes[i].setPoint(0,i*(2*this.margin+this.width)+this.margin, this.endpoints[i][2*j].getPosy());
                                        this.best_response[i][0]=0;}
                                    else{
                                        this.envelopes[i].setPoint(0,i*(2*this.margin+this.width)+this.margin, this.endpoints[i][2*k].getPosy());
                                        this.best_response[i][0]=1;}
                                }
                                else {
                                    if(Y11 > Y21){
                                        this.best_response[i][0]=0;
                                    }
                                    else{
                                        this.best_response[i][0]=1;
                                    }
                                    if(Y12 > Y22){
                                        this.best_response[i][1]=0;
                                    }
                                    else{
                                        this.best_response[i][1]=1;
                                    }
                                }
                            }
                        }
                    }
                    this.intersect[i][j*this.nb_strat[i]-2*Number(j)+k-1].move(i*(2*this.margin+this.width)+this.margin+middle_x*(this.width-2*Number(this.margin)),this.height-Number(this.margin)-Number(this.step)*middle_y);
                }
            }
        }
        
        
        this.computeEnvelope(strat11, strat12, strat21, strat22);
        var envelope1=document.getElementById("envelope1");
        envelope1.setAttributeNS(null,"points", "50,50 "+this.envelopes[0].points[0][0]+","+this.envelopes[0].points[0][1]+" "+this.envelopes[0].points[1][0]+","+this.envelopes[0].points[1][1]+" "+this.envelopes[0].points[2][0]+","+this.envelopes[0].points[2][1]+" 250,50");
        var envelope2=document.getElementById("envelope2");
        envelope2.setAttributeNS(null,"points", "450,50 "+this.envelopes[1].points[0][0]+","+this.envelopes[1].points[0][1]+" "+this.envelopes[1].points[1][0]+","+this.envelopes[1].points[1][1]+" "+this.envelopes[1].points[2][0]+","+this.envelopes[1].points[2][1]+" 650,50");
        
        //upates player's names
        var name_player=GTE.svg.getElementsByClassName("player1_name");
        for (var i=0;i<2;i++)
        name_player[i].textContent=GTE.tree.matrix.players[1].name;
        
        name_player=GTE.svg.getElementsByClassName("player2_name");
        for (var i=0;i<2;i++)
        name_player[i].textContent=GTE.tree.matrix.players[2].name;
        
        // Lines update
        for (var i=0 ; i< this.lines.length ; i++){
            for (var j=0 ; j< this.lines[i].length ; j++){
                var temp=this.lines[i][j];
                for (var h=0; h<2; h++){
                    temp.html_element[h].setAttributeNS(null, "y1", this.endpoints[temp.getPlayer()][temp.getStrat1()].getPosy());
                    
                    temp.html_element[h].setAttributeNS(null, "y2", this.endpoints[temp.getPlayer()][temp.getStrat2()].getPosy());
                }
            }
        }
    }
    
    
    Diagram.prototype.computeEnvelope = function(strat11=0, strat12=1, strat21=0, strat22=1){
        var strat=[[strat21,strat22],[strat11,strat12]];
        
        var y_max=350;
        var strat_act;
        var strat_new;
        for (var i=0;i<2;i++){ //player
            var point=[];
            var x_new=Number(i*(this.width+2*Number(this.margin))+this.width-this.margin);
            
            var x_min=Number(i*(this.width+Number(2*this.margin))+Number(this.margin));
            for (var j=0;j<this.nb_strat[i];j++){
                if (i==0){
                    if (Number(this.height-this.margin-this.step*Number(this.payoffs[i][j][strat[i][0]]))<= Number(y_max)){
                        strat_act=j;
                        y_max=this.height-this.margin-this.step*Number(this.payoffs[i][j][strat[i][0]]);
                        point.push([i*(this.width+2*this.margin)+this.margin,y_max]);
                        //console.log(strat_act);
                    }
                }
                else{
                    if (Number(this.height-this.margin-this.step*Number(this.payoffs[i][strat[i][0]][j]))<= Number(y_max)){
                        strat_act=j;
                        y_max=this.height-this.margin-this.step*Number(this.payoffs[i][strat[i][0]][j]);
                        point.push([i*(this.width+2*this.margin)+this.margin, y_max]);
                    }
                }
            }
            while(Number(x_min)<Number(i*(this.width+2*this.margin)+this.width-this.margin)){
                for (var l=0;l<this.intersect[i].length;l++){
                    
                    //console.log(x_min+" "+x_new+" "+this.intersect[i][l].getPosx()+" "+this.intersect[i][l].getStrat1()+" "+strat_act+" "+this.intersect[i][l].getStrat2());
                    if ((this.intersect[i][l].getStrat1()==strat_act|| this.intersect[i][l].getStrat2()==strat_act)&&  Number(this.intersect[i][l].getPosx())>Number(x_min) && Number(this.intersect[i][l].getPosx())<=Number(x_new) ){
                       // console.log(x_min+" "+x_new+" "+this.intersect[i][l].getPosx());
                        x_new=this.intersect[i][l].getPosx();
                        strat_new=l;
                    }
                }
                
                if (Number(x_new)<Number(i*(this.width+2*this.margin)+this.width-this.margin)){
                    
                    x_min=x_new;
                    strat_act=strat_new;
                    x_new=Number(i*(this.width+2*this.margin)+this.width-this.margin);
                    point.push([this.intersect[i][strat_act].getPosx(),this.intersect[i][strat_act].getPosy()]);
                }
                else{
                    point.push([Number(i*(this.width+2*this.margin)+this.width-this.margin),this.endpoints[i][this.lines[i][strat_act].getStrat2()].getPosy()]);
                    x_min=Number(i*(this.width+2*this.margin)+this.width-this.margin);
                }
                //x_min=1000;
            }
            console.log(point);
        }
    }
    
    
    Diagram.prototype.draw_up = function(){
        //upates player's names
        var name_player=GTE.svg.getElementsByClassName("player1_name");
        for (var i=0;i<2;i++)
        name_player[i].textContent=GTE.tree.matrix.players[1].name;
        
        name_player=GTE.svg.getElementsByClassName("player2_name");
        for (var i=0;i<2;i++)
        name_player[i].textContent=GTE.tree.matrix.players[2].name;
        // Lines update
        for (var i=0 ; i< this.lines.length ; i++){
            for (var j=0 ; j< this.lines[i].length ; j++){
                var temp=this.lines[i][j];
                for (var h=0; h<2; h++){
                    temp.html_element[h].setAttributeNS(null, "y1", this.endpoints[temp.getPlayer()][temp.getStrat1()].getPosy());
                    
                    temp.html_element[h].setAttributeNS(null, "y2", this.endpoints[temp.getPlayer()][temp.getStrat2()].getPosy());
                }
            }
        }
        
        
        if (this.best_response[0][0]==0 || this.best_response[0][1]==0 || (this.best_response[0][0]==-1 && this.best_response[0][1]==-1)){//Label strategy iff they are part of a best reponse
            var labelline=GTE.svg.getElementById("text11");
            labelline.setAttributeNS(null, "y", Number(this.endpoints[0][0].getPosy())+(Number(this.endpoints[0][1].getPosy())-Number(this.endpoints[0][0].getPosy()))/200*30+Number(20));
            labelline.textContent=GTE.tree.matrix.strategies[1][0].moves[0].name;
        }
        else {
            labelline=GTE.svg.getElementById("text11");
            labelline.textContent="";
        }
        if(this.best_response[0][0]==1 || this.best_response[0][1]==1 || (this.best_response[0][0]==-1 && this.best_response[0][1]==-1)){//Label strategy iff they are part of a best reponse
            labelline=GTE.svg.getElementById("text12");
            labelline.setAttributeNS(null, "y", Number(this.endpoints[0][3].getPosy())+(Number(this.endpoints[0][2].getPosy())-Number(this.endpoints[0][3].getPosy()))/200*30+Number(20));
            labelline.textContent=GTE.tree.matrix.strategies[1][1].moves[0].name;
        }
        else {
            labelline=GTE.svg.getElementById("text12");
            labelline.textContent="";
        }
        // Lines update svg2
        if (this.best_response[1][0]==0 || this.best_response[1][1]==0 || (this.best_response[1][0]==-1 && this.best_response[1][1]==-1)){//Label strategy iff they are part of a best reponse
            labelline=GTE.svg.getElementById("text21");
            labelline.setAttributeNS(null, "y", Number(this.endpoints[1][0].getPosy())+(Number(this.endpoints[1][2].getPosy())-Number(this.endpoints[1][0].getPosy()))/200*30+Number(20));
            labelline.textContent=GTE.tree.matrix.strategies[2][0].moves[0].name;
        }
        else {
            labelline=GTE.svg.getElementById("text21");
            labelline.textContent="";
        }
        if (this.best_response[1][0]==1 || this.best_response[1][1]==1 || (this.best_response[1][0]==-1 && this.best_response[1][1]==-1)){//Label strategy iff they are part of a best reponse
            labelline=GTE.svg.getElementById("text22");
            labelline.setAttributeNS(null, "y", Number(this.endpoints[1][3].getPosy())+(Number(this.endpoints[1][1].getPosy()-Number(this.endpoints[1][3].getPosy()))/200*30)+Number(20));
            labelline.textContent=GTE.tree.matrix.strategies[2][1].moves[0].name;
        }
        else {
            labelline=GTE.svg.getElementById("text22");
            labelline.textContent="";
        }
        //envelop svg1
        var envelope1=document.getElementById("envelope1");
        envelope1.setAttributeNS(null,"points", "50,50 "+this.envelopes[0].points[0][0]+","+this.envelopes[0].points[0][1]+" "+this.envelopes[0].points[1][0]+","+this.envelopes[0].points[1][1]+" "+this.envelopes[0].points[2][0]+","+this.envelopes[0].points[2][1]+" 250,50");
        var inter=GTE.svg.getElementById("inter1");
        inter.setAttributeNS(null,"cx", this.envelopes[0].points[1][0]);
        inter.setAttributeNS(null,"cy", this.envelopes[0].points[1][1]);
        var interlabel=GTE.svg.getElementById("interlabel1");
        interlabel.setAttributeNS(null, "x",this.envelopes[0].points[1][0]);
        interlabel.textContent=Math.round((Number(this.envelopes[0].points[1][0])-50)/2)/100;
        var stick=GTE.svg.getElementsByClassName("interstick1");
        for (i=0;i<stick.length;i++){
            stick[i].setAttributeNS(null, "x1",this.envelopes[0].points[1][0]);
            stick[i].setAttributeNS(null, "x2",this.envelopes[0].points[1][0]);}
        //envelop svg2
        var envelope2=document.getElementById("envelope2");
        envelope2.setAttributeNS(null,"points", "450,50 "+this.envelopes[1].points[0][0]+","+this.envelopes[1].points[0][1]+" "+this.envelopes[1].points[1][0]+","+this.envelopes[1].points[1][1]+" "+this.envelopes[1].points[2][0]+","+this.envelopes[1].points[2][1]+" 650,50");
        inter=GTE.svg.getElementById("inter2");
        inter.setAttributeNS(null,"cx", this.envelopes[1].points[1][0]);
        inter.setAttributeNS(null,"cy", this.envelopes[1].points[1][1]);
        interlabel=GTE.svg.getElementById("interlabel2");
        interlabel.setAttributeNS(null, "x",this.envelopes[1].points[1][0]);
        interlabel.textContent=Math.round((Number(this.envelopes[1].points[1][0])-450)/2)/100;
        var stick=GTE.svg.getElementsByClassName("interstick2");
        for (i=0;i<stick.length;i++){
            stick[i].setAttributeNS(null, "x1",this.envelopes[1].points[1][0]);
            stick[i].setAttributeNS(null, "x2",this.envelopes[1].points[1][0]);
        }
        
        var temp= GTE.svg.getElementsByClassName("strat11");
        for (i=0;i<temp.length;i++){
            temp[i].textContent=GTE.tree.matrix.strategies[2][1].moves[0].name;
        }
        temp= GTE.svg.getElementsByClassName("strat10");
        for (i=0;i<temp.length;i++){
            temp[i].textContent=GTE.tree.matrix.strategies[2][0].moves[0].name;
        }
        temp= GTE.svg.getElementsByClassName("strat01");
        for (i=0;i<temp.length;i++){
            temp[i].textContent=GTE.tree.matrix.strategies[1][1].moves[0].name;
        }
        temp= GTE.svg.getElementsByClassName("strat00");
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
                        path1=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+this.envelopes[0].points[1][0]+","+Number(this.height+2*this.margin)+", "+this.envelopes[0].points[1][0]+","+Number(2*this.margin+this.height+this.side)+", "+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        temp[8].setAttributeNS(null, "x", this.envelopes[0].points[1][0]-5);
                        temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "width", Number(2*this.rad));
                        
                        temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[4].setAttributeNS(null, "width", ~~(this.envelopes[0].points[1][0]-Number(this.margin))+Number(2*this.rad));
                        
                        temp[6].setAttributeNS(null, "x", this.envelopes[0].points[1][0]-5);
                        temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                        temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[6].setAttributeNS(null, "width", ~~(Number(this.margin+this.side)-this.envelopes[0].points[1][0])+Number(2*this.rad));
                        
                        temp[1].setAttributeNS(null, "r", 0);
                        temp[3].setAttributeNS(null, "r", 0);
                    }
                }
                else{
                    if (this.best_response[0][1]==0){
                        path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+this.envelopes[0].points[1][0]+","+Number(2*this.margin+this.height+this.side)+", "+this.envelopes[0].points[1][0]+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                        temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[6].setAttributeNS(null, "width", ~~(this.envelopes[0].points[1][0]-Number(this.margin))+Number(2*this.rad));
                        
                        temp[8].setAttributeNS(null, "x", this.envelopes[0].points[1][0]-5);
                        temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "width", Number(2*this.rad));
                        
                        temp[4].setAttributeNS(null, "x", this.envelopes[0].points[1][0]-5);
                        temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[4].setAttributeNS(null, "width", ~~(Number(this.margin+this.side)-this.envelopes[0].points[1][0])+Number(2*this.rad));
                        
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
                        path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin)+","+Number(this.envelopes[1].points[1][0]+Number(Number(this.margin)))+", "+Number(this.margin+this.side)+","+Number(this.envelopes[1].points[1][0]+Number(this.margin))+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
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
                            temp[8].setAttributeNS(null, "y", Number(this.envelopes[1].points[1][0]+Number(Number(this.margin-this.rad))));
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
                            temp[7].setAttributeNS(null, "height", Number(this.envelopes[1].points[1][0]-Number(Number(this.height+2*this.margin))+Number(60)));
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
                            temp[5].setAttributeNS(null, "height",Number(Number(2*this.margin+this.height+this.side)-Number(this.envelopes[1].points[1][0])-Number(40)) );
                            temp[5].setAttributeNS(null, "y", Number(this.envelopes[1].points[1][0]+Number(Number(this.margin-this.rad))));
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
                            temp[7].setAttributeNS(null, "height", Number(this.envelopes[1].points[1][0]-Number(Number(this.height+2*this.margin))+Number(60)));
                            temp[7].setAttributeNS(null, "width", Number(2*this.rad));
                            
                            temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[8].setAttributeNS(null, "y", Number(this.envelopes[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                            
                            temp[2].setAttributeNS(null, "r", 0);//remove end point
                            temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                            temp[5].setAttributeNS(null, "y", Number(this.envelopes[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            temp[5].setAttributeNS(null, "height",Number(Number(2*this.margin+this.height+this.side)-Number(this.envelopes[1].points[1][0])-Number(40)) );
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
                        path2=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(this.envelopes[1].points[1][0]+Number(Number(this.margin)))+", "+Number(this.margin+this.side)+","+Number(this.envelopes[1].points[1][0]+Number(Number(this.margin)))+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
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
                            temp[8].setAttributeNS(null, "y", Number(this.envelopes[1].points[1][0]+Number(Number(this.margin-this.rad))));
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
                            temp[7].setAttributeNS(null, "height", Number(Number(2*this.margin+this.height+this.side)-Number(this.envelopes[1].points[1][0])-Number(40)));
                            temp[7].setAttributeNS(null, "y", Number(this.envelopes[1].points[1][0]+Number(Number(this.margin-this.rad))));
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
                            temp[5].setAttributeNS(null, "height", Number(this.envelopes[1].points[1][0]-Number(Number(this.height+2*this.margin))+Number(60) ));
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
                            temp[7].setAttributeNS(null, "y", Number(this.envelopes[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            temp[7].setAttributeNS(null, "height", Number(Number(2*this.margin+this.height+this.side)-Number(this.envelopes[1].points[1][0])-Number(40)));
                            temp[7].setAttributeNS(null, "width", Number(2*this.rad));
                            
                            temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[8].setAttributeNS(null, "y", Number(this.envelopes[1].points[1][0]+Number(Number(this.margin-this.rad))));
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                            
                            temp[1].setAttributeNS(null, "r", 0);//remove end point
                            temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                            temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[5].setAttributeNS(null, "height",Number(this.envelopes[1].points[1][0]-Number(Number(this.height+2*this.margin))+Number(60) ));
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
            if(this.envelopes[1].points[1][0]==650){
                stick[i].textContent=""
            }
            if(this.best_response[1][1]==1)
            var  pos=(this.envelopes[1].points[1][0]+Number(450))/2;
            else
            var  pos=(this.envelopes[1].points[1][0]+Number(650))/2;
            
            stick[i].setAttributeNS(null, "x",pos);
        }
        var stick=GTE.svg.getElementsByClassName("middle22");
        for (i=0;i<stick.length;i++){
            if(this.envelopes[1].points[1][0]==450){
                stick[i].textContent=""
            }
            if(this.best_response[1][0]==1)
            pos=(this.envelopes[1].points[1][0]+Number(450))/2;
            else
            pos=(this.envelopes[1].points[1][0]+Number(650))/2;
            stick[i].setAttributeNS(null, "x",pos);
        }
        if (this.envelopes[1].points[1][0]>450 && this.envelopes[1].points[1][0] <650){
            var t1=Number(this.envelopes[1].points[1][0])-Number(410);
            var t2=460+Number(this.envelopes[1].points[1][0])-Number(410);
            GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d", "M"+this.envelopes[1].points[1][0]+",460 A"+t1+","+t1+" 0 0,1 410,"+t2);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y1", t2);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y2", t2);
        }
        if (this.envelopes[1].points[1][0]==450){
            GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d","M450,460 A40,40 0 0,1 410,500");
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y1", 500);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y2", 500);
        }
        if (this.envelopes[1].points[1][0]==650){
            GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d","M650,460 A240,240 0 0,1 410,700");
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y1", 700);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y2", 700);
        }
        
        GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x1", Number(this.margin));
        GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x2", Number(this.margin));
        if (this.envelopes[0].points[1][0]>Number(this.margin) && this.envelopes[0].points[1][0]<Number(this.margin+this.side)){
            GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x1", this.envelopes[0].points[1][0]);
            GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x2", this.envelopes[0].points[1][0]);
        }
        var stick=GTE.svg.getElementsByClassName("middle11");
        for (i=0;i<stick.length;i++){
            if(this.envelopes[0].points[1][0]==Number(this.margin+this.side)){
                stick[i].textContent=""
            }
            if(this.best_response[0][1]==1)
            pos=(this.envelopes[0].points[1][0]+Number(Number(this.margin)))/2;
            else
            pos=(this.envelopes[0].points[1][0]+Number(Number(this.margin+this.side)))/2;
            stick[i].setAttributeNS(null, "x",pos);
        }
        var stick=GTE.svg.getElementsByClassName("middle12");
        for (i=0;i<stick.length;i++){
            if(this.envelopes[0].points[1][0]==Number(this.margin)){
                stick[i].textContent=""
            }
            if(this.best_response[0][0]==1)
            pos=(this.envelopes[0].points[1][0]+Number(this.margin))/2;
            else
            pos=(this.envelopes[0].points[1][0]+Number(this.margin+this.side))/2;
            stick[i].setAttributeNS(null, "x",pos);
        }
        
        
        
        
    };
    
    Diagram.prototype.clear = function(){
        for (var i=0;i<this.lines.length;i++){
            for (var j=0;j<this.lines[i].length;j++){
                var temp=this.lines[i][j].html_element[0];
                GTE.svg.removeChild(temp);
                temp=this.lines[i][j].html_element[1];
                GTE.svg.removeChild(temp);
            }
        }
        for (var i=0;i<this.endpoints.length;i++){
            for (var j=0;j<this.endpoints[i].length;j++){
                temp=this.endpoints[i][j].html_element;
                GTE.svg.removeChild(temp);
            }
        }
        this.endpoints=[];
        this.lines=[];
        this.best_response=[];
        this.payoffs=[];
        for (var i=0;i<this.intersect.length;i++){
            for (var j=0; j<this.intersect[i].length;j++){
                this.intersect[i][j].clear();
            }
        }
        this.intersect=[];
        var envelope1=document.getElementById("envelope1");
        envelope1.setAttributeNS(null,"points", "50,50, 50,350, 250,350, 250,50");
        var envelope2=document.getElementById("envelope2");
        envelope2.setAttributeNS(null,"points", "450,50, 450,350, 650,350,  650,50");
        this.envelopes= [];
    }
    
    
    // Add class to parent module
    parentModule.Diagram = Diagram;
    
    return parentModule;
}(GTE)); // Add to GTE.TREE sub-module
