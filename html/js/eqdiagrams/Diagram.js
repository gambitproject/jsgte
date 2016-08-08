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
        this.nb_strat= [2,2];// Player's number of strategies.
        this.intersect= []; // 2 arrays containing the mixed equilibrium.
        this.equilibrium=[[],[]];
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
        this.strat=[[0,1],[0,1]];
        this.step= (this.height-Number(2*this.margin))/(this.max-Number(this.min));
        
    };
    
    Diagram.prototype.ini =function (){
        this.strat=[[0,1],[0,1]];
        this.nb_strat=[GTE.tree.matrix.strategies[1].length,GTE.tree.matrix.strategies[2].length];
        if (this.nb_strat[0]==2 && this.nb_strat[1]==2){
            this.ini_html(2);
            this.assignEndpoints(2);
            this.assignLines(2);
            this.assignIntersections(2);
        }
        else {
            this.ini_html(1);
            this.assignEndpoints(1);
            this.assignLines(1);
            this.assignIntersections(1);
        }
        this.ini_arrays();
    }
    
    Diagram.prototype.ini_html = function (max){
        var x_shift = Number(2*this.margin+this.width);
        var temp= GTE.svg.getElementsByClassName("up").length;
        for( var k=0;k<temp;k++){
            GTE.svg.removeChild(GTE.svg.getElementsByClassName("up")[0]);
        }
        for (var i=0;i<max;i++){
            temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            temp.setAttribute("class","contour up");
            temp.setAttribute("points", Number(this.margin+i*x_shift)+", "+this.margin+" "+Number(this.margin+i*x_shift)+", "+Number(this.height-this.margin)+" "+Number(this.width-this.margin+i*x_shift)+","+Number(this.height-this.margin)+" "+Number(this.width-this.margin+i*x_shift)+","+this.margin);
            
            GTE.svg.appendChild(temp);
            temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
            if (i==0){
                temp.textContent="Payoff to I";
            }else{
                temp.textContent="Payoff to II";
            }
            temp.setAttribute("class", "player"+Number(i+1)+" player"+Number(i+1)+"_title title up");
            temp.setAttribute("x",Number(i*x_shift+150));
            temp.setAttribute("y",40);
            GTE.svg.appendChild(temp);
            
            
            temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
            if (i==0){
                var j=2;
                temp.textContent="II";
            }
            else{
                var j=1;
                temp.textContent="I";}
            temp.setAttribute("class", "player"+j+"_name player"+j+" align_right legendh up");
            temp.setAttribute("x",Number(i*x_shift+95));
            temp.setAttribute("y",390);
            GTE.svg.appendChild(temp);
            
            temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
            temp.textContent="'s probability of";
            temp.setAttribute("class", "player"+j+" legendh up");
            temp.setAttribute("x",Number(i*x_shift+150));
            temp.setAttribute("y",390);
            GTE.svg.appendChild(temp);
            
            temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
            temp.textContent="d";
            temp.setAttribute("class", "player"+j+" strat"+Number(j-1)+"1 legendh up");
            temp.setAttribute("x",Number(i*x_shift+215));
            temp.setAttribute("y",390);
            GTE.svg.appendChild(temp);
            
            /* temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
             temp.textContent="against";
             temp.setAttribute("class", "player"+j+" legendh up");
             temp.setAttribute("x",Number(i*x_shift+207));
             temp.setAttribute("y",390);
             GTE.svg.appendChild(temp);*/
            
            temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
            temp.textContent="0";
            temp.setAttribute("class", "player"+j+" legendh up");
            temp.setAttribute("x",Number(i*x_shift+50));
            temp.setAttribute("y",372);
            GTE.svg.appendChild(temp);
            
            temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
            temp.textContent="1";
            temp.setAttribute("class", "player"+j+" legendh up");
            temp.setAttribute("x",Number(i*x_shift+250));
            temp.setAttribute("y",372);
            GTE.svg.appendChild(temp);
            
            temp = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            temp.setAttribute("class", "up");
            temp.setAttribute("id", "envelope"+Number(i+1));
            temp.setAttribute("points",Number(this.margin+i*x_shift)+", "+this.margin+" "+Number(this.margin+i*x_shift)+", "+Number(this.height-this.margin)+" "+Number(this.width-this.margin+i*x_shift)+","+Number(this.height-this.margin)+" "+Number(this.width-this.margin+i*x_shift)+","+this.margin);
            GTE.svg.appendChild(temp);
            
            for (var k=0;k<9;k++){
                for (var h=0;h<2;h++){
                    temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    temp.setAttribute("class", "stick up");
                    temp.setAttribute("x1",Number(i*x_shift+50+h*200));
                    temp.setAttribute("x2",Number(i*x_shift+45+h*210));
                    temp.setAttribute("y1",Number(80+k*this.step));
                    temp.setAttribute("y2",Number(80+k*this.step));
                    GTE.svg.appendChild(temp);
                    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    temp.setAttribute("class", "sticklabel up");
                    temp.setAttribute("x",Number(i*x_shift+35+h*230));
                    temp.setAttribute("y",Number(85+k*this.step));
                    temp.textContent=Number(9-k);
                    GTE.svg.appendChild(temp);
                }
            }
            
        }
        if (max <2){
            temp= GTE.svg.getElementsByClassName("bottom");
            for (var k=0;k<temp.length;k++){
                temp[k].setAttribute("visibility","hidden");
            }
        }
        if (max==2){
            temp= GTE.svg.getElementsByClassName("bottom");
            for (var k=0;k<temp.length;k++){
                temp[k].setAttribute("visibility","visible");
            }
        }
        
    }
    
    
    Diagram.prototype.assignEndpoints = function(max) {
        var table_x=[[50,250],[450,650]];
        for (var j=0; j<2;j++){
            this.endpoints.push([]);
            for (var i=0;i<2*this.nb_strat[j];i++){
                if (j==0){
                    this.endpoints[j].push( new GTE.Endpoint(table_x[j%2][i%2],this.height-this.margin,j,i,this.nb_strat[1]*(~~(i/2))+i%2, max));
                }
                else{
                    this.endpoints[j].push( new GTE.Endpoint(table_x[j%2][i%2],this.height-this.margin,j,i,this.nb_strat[1]*(i%2)+(~~(i/2)),max));
                }
            }
        }
        
    };
    
    Diagram.prototype.assignLines = function(max) {
        for (var j=0; j<2;j++){
            this.lines.push([]);
            for(var i=0;i<this.nb_strat[j];i++){
                this.lines[j].push( new GTE.Line(j,i, max));
            }
        }
    };
    
    Diagram.prototype.assignIntersections = function(max){
        for (var i=0; i<2 ; i++){
            this.intersect.push([]);
            for (var j=0 ; j< this.nb_strat[i]-1 ; j++){
                for (var k=j+1; k<this.nb_strat[i]; k++){
                    var temp=new GTE.Intersection(i, j, k,max);
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
        var point1=GTE.tree.matrix.matrix[GTE.diag.endpoints[player][strat1].getStrat_mat()].strategy.payoffs[player];
        var point2=GTE.tree.matrix.matrix[GTE.diag.endpoints[player][strat2].getStrat_mat()].strategy.payoffs[player];
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
        var x=[196,225,596,625];
        var p=[2,1];
        if (this.nb_strat[0]==2 && this.nb_strat[1]==2){
            var max=2;
        }
        else {
            var max=1;}
        /* for (var i=0;i<max;i++){
         var strat11= new GTE.UI.Widgets.ContentEditable(x[Number(2*i)],390,GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT, GTE.tree.matrix.strategies[p[i]][GTE.diag.strat[p[i]-1][1]].moves[0].name, "player"+Number(p[i])+" legendh align_left",1)
         .index(p[i]-1)
         .onSave(function () {
         var text = this.getCleanedText();
         if (text === "") {
         window.alert("Strategy name should not be empty.");
         } else {
         var test=0;
         for (var j=0;j<GTE.diag.nb_strat[this.index];j++){
         if (text==GTE.tree.matrix.strategies[Number(this.index+1)][j].moves[0].name){
         if (j==GTE.diag.strat[this.index][0]){
         window.alert("The two strategies have to be different.");
         this.text=GTE.diag.strat[this.index][1];
         }
         else{
         GTE.diag.strat[this.index][1]=j;
         }
         test=1;
         }
         }
         if (test==0){
         window.alert("Strategy name should correspond to a strategy.");
         this.text=GTE.diag.strat[this.index][1];
         }
         }
         GTE.diag.cleanForeign();
         GTE.diag.redraw();    });
         
         var strat12= new GTE.UI.Widgets.ContentEditable(x[Number(2*i+1)],375,GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT, GTE.tree.matrix.strategies[p[i]][GTE.diag.strat[p[i]-1][0]].moves[0].name, "player"+Number(p[i])+" strat",1)
         .index(p[i]-1)
         .onSave(function () {
         var text = this.getCleanedText();
         if (text === "") {
         window.alert("Strategy name should not be empty.");
         } else {
         var test=0;
         for (var j=0;j<GTE.diag.nb_strat[this.index];j++){
         if (text==GTE.tree.matrix.strategies[Number(this.index+1)][j].moves[0].name){
         if (j==GTE.diag.strat[this.index][1]){
         window.alert("The two strategies have to be different.");
         this.text=GTE.diag.strat[this.index][0];}
         else{
         GTE.diag.strat[this.index][0]=j;
         }
         test=1;
         }
         }
         if (test==0){
         window.alert("Strategy name should correspond to a strategy.");
         this.text=GTE.diag.strat[this.index][0];
         }
         }
         GTE.diag.cleanForeign();
         GTE.diag.redraw();    });
         }*/
        this.compute_best_response(this.strat[0][0],this.strat[0][1],this.strat[1][0],this.strat[1][1],max);
        if (max >1){
            this.draw_square_down(this.strat[0][0],this.strat[0][1],this.strat[1][0],this.strat[1][1]);
        }
        else {
            if (GTE.svg.getElementsByTagName("svg").length >0){
                GTE.svg.removeChild(GTE.svg.getElementsByTagName("svg")[0]);}
            //init();
            //animate();
        }
    };
    
    Diagram.prototype.compute_best_response = function(strat11=0, strat12=1, strat21=0, strat22=1, max) {
        for (var i=0;i<this.nb_strat[0];i++){
            this.endpoints[0][i*2].strat_matrix=Number(i*this.nb_strat[1]+strat21);
            this.endpoints[0][Number(i*2+1)].strat_matrix=Number(i*this.nb_strat[1]+strat22);
        }
        if (max>1)
        for (var i=0;i<this.nb_strat[0];i++){
            this.endpoints[1][i*2].strat_matrix=Number(strat11*this.nb_strat[1]+i);
            this.endpoints[1][Number(i*2+1)].strat_matrix=Number(strat12*this.nb_strat[1]+i);
        }
        /* for (var i=0;i<this.nb_strat[0];i++){
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
         }*/
        for( var i=0;i<this.nb_strat[0];i++){
            for (var j=0;j<this.nb_strat[1];j++){
                this.payoffs[0][i][j]=(Math.round(GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+j)].strategy.payoffs[0].value*GTE.diag.precision)/GTE.diag.precision);
                GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+j)].strategy.payoffs[0].value=this.payoffs[0][i][j];;
                this.payoffs[1][i][j]=(Math.round(GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+j)].strategy.payoffs[1].value*GTE.diag.precision)/GTE.diag.precision);
                GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+j)].strategy.payoffs[1].value=this.payoffs[1][i][j];
                
            }
        }
        
        for (var i=0;i<this.nb_strat[0];i++){
            this.endpoints[0][i*2].move(this.height-this.margin-this.payoffs[0][i][strat21]*this.step);
            this.endpoints[0][Number(i*2+1)].move(this.height-this.margin-this.payoffs[0][i][strat22]*this.step);
        }
        if (max>1){
            for (var i=0;i<this.nb_strat[1];i++){
                this.endpoints[1][i*2].move(this.height-this.margin-this.payoffs[1][strat11][i]*this.step);
                this.endpoints[1][Number(i*2+1)].move(this.height-this.margin-this.payoffs[1][strat12][i]*this.step);
            }
        }
        // compute all intersect points
        var strat=[[strat21,strat22],[strat11,strat12]]
        var Y11; //left extremity of the first line
        var Y12; //right extremity of the first line
        var Y21; //left extremity of the second line
        var Y22; //right extremity of the second line
        for (var i=0;i<2;i++){
            for (var j=0;j<this.nb_strat[i];j++){
                var temp= GTE.svg.getElementsByClassName("strat"+""+i+""+j);
                for ( var l=0;l<temp.length;l++){
                    temp[l].textContent=GTE.tree.matrix.strategies[i+1][j].moves[0].name;
                }
            }
        }
        for (var i=0;i<2;i++){
            for (var j=0; j< this.nb_strat[i]-1;j++){
                for (var k=j+1 ; k<this.nb_strat[i];k++){
                    
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
                    if (Number(Y11)>Number(Y21) && Number(Y12)>Number(Y22)){
                        var middle_x=0;
                        var middle_y=0; //there is no intersection point
                        this.best_response[i][0]=0;
                        this.best_response[i][1]=0;
                    }
                    else{
                        if (Y11<Y21 && Y12<Y22){
                            var middle_x=1;
                            var middle_y=0; //there is no intersection point
                            this.best_response[i][0]=1;
                            this.best_response[i][1]=1;
                        }
                        else {
                            if (Y11==Y21){
                                var middle_x=0;
                                var middle_y=Y21; //there is no intersection point
                                this.best_response[i][0]=-1;
                                if (Y12>Y22){
                                    this.best_response[i][1]=0;
                                }
                                else{
                                    if (Y12==Y22){
                                        this.best_response[i][1]=-1;
                                    }
                                    else {
                                        this.best_response[i][1]=1;
                                    }
                                }
                            }else{
                                if (Y12==Y22){
                                    var middle_x=1;
                                    var middle_y=Y22; //there is no intersection point
                                    this.best_response[i][1]=-1;
                                    if (Y11>Y21){
                                        this.best_response[i][0]=0;}
                                    else{
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
                    if (i==0 || max >1)
                    this.intersect[i][Number((this.nb_strat[i]*(this.nb_strat[i]-1))/2-((this.nb_strat[i]-j)*(this.nb_strat[i]-j-1))/2+(k-j)-1)].move(i*(2*this.margin+this.width)+this.margin+middle_x*(this.width-2*Number(this.margin)),this.height-Number(this.margin)-Number(this.step)*middle_y);
                }
            }
        }
        //To make sure that best_response are set for the right strategies.
        for (var i=0;i<2;i++){
            if (i==0){
                Y11=this.payoffs[i][strat11][strat21];
                Y12=this.payoffs[i][strat11][strat22];
                Y21=this.payoffs[i][strat12][strat21];
                Y22=this.payoffs[i][strat12][strat22];}
            else{
                Y11=this.payoffs[i][strat11][strat21];
                Y12=this.payoffs[i][strat12][strat21];
                Y21=this.payoffs[i][strat11][strat22];
                Y22=this.payoffs[i][strat12][strat22];
            }
            var middle_x=(Y21-Number(Y11))/(Y21-Number(Y22)+Y12-Number(Y11));
            var middle_y=(Y12-Number(Y11))*middle_x+Number(Y11);
            if (Number(Y11)>Number(Y21) && Number(Y12)>Number(Y22)){
                this.best_response[i][0]=0;
                this.best_response[i][1]=0;
            }
            else{
                if (Y11<Y21 && Y12<Y22){
                    this.best_response[i][0]=1;
                    this.best_response[i][1]=1;
                }
                else {
                    if (Y11==Y21){
                        this.best_response[i][0]=-1;
                        if (Y12>Y22){
                            this.best_response[i][1]=0;
                        }
                        else{
                            if (Y12==Y22){
                                this.best_response[i][1]=-1;
                            }
                            else {
                                this.best_response[i][1]=1;
                            }
                        }
                    }else{
                        if (Y12==Y22){
                            this.best_response[i][1]=-1;
                            if (Y11>Y21){
                                this.best_response[i][0]=0;}
                            else{
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
        }
        for (var f=0;f<max;f++){
            for (var g=0;g<this.intersect[f].length;g++){
                this.intersect[f][g].hide();
            }
        }
        
        // Lines update
        for (var i=0 ; i< this.lines.length ; i++){
            if (i==0 || max >1){
                for (var j=0 ; j< this.lines[i].length ; j++){
                    var temp=this.lines[i][j];
                    for (var h=0; h<2; h++){
                        temp.html_element[h].setAttributeNS(null, "y1", this.endpoints[temp.getPlayer()][temp.getStrat1()].getPosy());
                        temp.html_element[h].setAttributeNS(null, "y2", this.endpoints[temp.getPlayer()][temp.getStrat2()].getPosy());
                    }
                }
            }
        }
        
        this.computeEnvelope(strat11, strat12, strat21, strat22,max);
        //upates player's names
        var name_player=GTE.svg.getElementsByClassName("player1_name");
        for (var i=0;i<name_player.length;i++){
            name_player[i].textContent=GTE.tree.matrix.players[1].name;
        }
        var name_player=GTE.svg.getElementsByClassName("player1_title");
        for (var i=0;i<name_player.length;i++){
            name_player[i].textContent="Payoff to "+GTE.tree.matrix.players[1].name;
        }
        
        if (max >1){
            name_player=GTE.svg.getElementsByClassName("player2_name");
            for (var i=0;i<name_player.length;i++)
            name_player[i].textContent=GTE.tree.matrix.players[2].name;
            name_player=GTE.svg.getElementsByClassName("player2_title");
            for (var i=0;i<name_player.length;i++)
            name_player[i].textContent="Payoff to "+GTE.tree.matrix.players[2].name;
        }
        
        
    }
    
    
    Diagram.prototype.computeEnvelope = function(strat11=0, strat12=1, strat21=0, strat22=1, max){
        var strat=[[strat21,strat22],[strat11,strat12]];
        var cmp=0;
        
        var strat_point = [[],[]] // to reccord to which strategies if point on the envelope corresponds to
        var point=[[],[]];
        for (var i=0;i<2;i++){ //player
            for (var f=0;f<this.nb_strat[i];f++){ //hide labelline
                if (i==0 || max>1){
                    this.lines[i][f].moveUnder();
                }
            }
            var strat_act=[];//line on wich point will be.
            var strat_prev=[];//line on wich point was.
            var strat_new=[];
            var strat_mix=[];
            var y_max=350;
            var x_min=Number(i*(this.width+Number(2*this.margin))+Number(this.margin));
            var inter;
            for (var j=0;j<this.nb_strat[i];j++){ //select all higher left endpoints
                if (i==0){
                    if (Number(this.height-this.margin-this.step*Number(this.payoffs[i][j][strat[i][0]]))< Number(y_max)){
                        strat_act=[j];
                        y_max=this.height-this.margin-this.step*Number(this.payoffs[i][j][strat[i][0]]);
                    }
                    else {
                        if (Number(this.height-this.margin-this.step*Number(this.payoffs[i][j][strat[i][0]]))== Number(y_max)){
                            strat_act.push(j);
                        }
                    }
                }
                else{
                    if (Number(this.height-this.margin-this.step*Number(this.payoffs[i][strat[i][0]][j]))< Number(y_max)){
                        strat_act=[j];
                        y_max=this.height-this.margin-this.step*Number(this.payoffs[i][strat[i][0]][j]);
                    }
                    else {
                        if (Number(this.height-this.margin-this.step*Number(this.payoffs[i][strat[i][0]][j]))== Number(y_max)){
                            strat_act.push(j);
                        }
                    }
                }
            }
            strat_prev=strat_act;
            point[i].push([i*(this.width+2*this.margin)+this.margin,y_max]);
            strat_point[i].push(strat_act);
            while(Number(x_min)<Number(i*(this.width+2*this.margin)+this.width-this.margin)){
                cmp=cmp+1;
                inter=[];
                var x_new=point[i][point[i].length-1][0];
                var y_new=point[i][point[i].length-1][1];;
                for (var x=0;x<strat_act.length;x++){
                    var S=strat_act[x];
                    for (var l=0;l<this.intersect[i].length;l++){
                        if ((this.intersect[i][l].getStrat1()==S|| this.intersect[i][l].getStrat2()==S)&&  Number(this.intersect[i][l].getPosx())>Number(x_min)){
                            if (x_new==point[i][point[i].length-1][0])
                            {
                                x_new=this.intersect[i][l].getPosx();
                                y_new=Number(this.intersect[i][l].getPosy());
                                strat_mix=[l];
                                inter=[true];
                                if (i==0 || max>1)
                                this.intersect[i][l].show();
                                strat_new=[this.intersect[i][l].getStrat1(),this.intersect[i][l].getStrat2()];
                                strat_prev=[S];
                            }
                            else{
                                if( Math.round(Number((point[i][point[i].length-1][1]-y_new)/(x_new-point[i][point[i].length-1][0]))*1000)/1000 <Math.round(Number((point[i][point[i].length-1][1]-this.intersect[i][l].getPosy())/(this.intersect[i][l].getPosx()-point[i][point[i].length-1][0]))*1000)/1000  || (Math.round(Number((point[i][point[i].length-1][1]-y_new)/(x_new-point[i][point[i].length-1][0]))*1000)/1000 ==Math.round(Number((point[i][point[i].length-1][1]-this.intersect[i][l].getPosy())/(this.intersect[i][l].getPosx()-point[i][point[i].length-1][0]))*1000)/1000  && Number(this.intersect[i][l].getPosx())<Number(x_new))){
                                    x_new=this.intersect[i][l].getPosx();
                                    y_new=Number(this.intersect[i][l].getPosy());
                                    
                                    for (f=0;f<strat_mix.length;f++){
                                        if (inter[f]==true){
                                            this.intersect[i][strat_mix[f]].hide();
                                        }
                                    }
                                    strat_mix=[l];
                                    inter=[true];
                                    
                                    if (i==0 || max>1)
                                    this.intersect[i][l].show();
                                    strat_new=[this.intersect[i][l].getStrat1(),this.intersect[i][l].getStrat2()];
                                    strat_prev=[S];
                                    
                                }
                                else{
                                    if (Number(x_new)==Number(this.intersect[i][l].getPosx())&&Number(y_new)==Number(this.intersect[i][l].getPosy())){
                                        x_new=this.intersect[i][l].getPosx();
                                        y_new=Number(this.intersect[i][l].getPosy());
                                        strat_mix.push(l);
                                        
                                        if (i==0 || max>1)
                                        this.intersect[i][l].show();
                                        inter.push(true);
                                        strat_new.push(this.intersect[i][l].getStrat1());
                                        strat_new.push(this.intersect[i][l].getStrat2());
                                        strat_prev.push(S);
                                    }
                                }
                            }
                        }
                        
                    }
                    var temp=this.endpoints[i][this.lines[i][S].getStrat2()];
                    if (  Number(temp.getPosx())>Number(x_min)){
                        if (x_new==point[i][point[i].length-1][0])
                        {
                            x_new=temp.getPosx();
                            y_new=temp.getPosy();
                            strat_mix=[l];
                            inter=[false];
                            strat_new=[S];
                            strat_prev=[S];
                            
                        }
                        else{
                            if( Math.round(Number((point[i][point[i].length-1][1]-y_new)/(x_new-point[i][point[i].length-1][0]))*1000)/1000 <Math.round(Number((point[i][point[i].length-1][1]-temp.getPosy())/(temp.getPosx()-point[i][point[i].length-1][0]))*1000)/1000  ||(Math.round(Number((point[i][point[i].length-1][1]-y_new)/(x_new-point[i][point[i].length-1][0]))*1000)/1000 ==Math.round(Number((point[i][point[i].length-1][1]-temp.getPosy())/(temp.getPosx()-point[i][point[i].length-1][0]))*1000)/1000  &&Number(temp.getPosx())<Number(x_new))){
                                x_new=temp.getPosx();
                                y_new=Number(temp.getPosy());
                                for (f=0;f<strat_mix.length;f++){
                                    if (inter[f]==true){
                                        this.intersect[i][strat_mix[f]].hide();
                                    }
                                }
                                strat_mix=[l];
                                inter=[false];
                                strat_new=[S];
                                strat_prev=[S];
                                
                            }
                            else{
                                if (Number(x_new)==Number(temp.getPosx())&& Number(y_new)==Number(temp.getPosy())){
                                    x_new=temp.getPosx();
                                    y_new=Number(temp.getPosy());
                                    strat_mix.push(l);
                                    inter.push(false);
                                    strat_new.push(S);
                                    strat_prev.push(S);}
                            }
                        }
                    }
                }
                
                if (Number(x_new)>x_min && Number(x_new)<Number(i*(this.width+2*this.margin)+this.width-this.margin)){
                    x_min=x_new;
                    strat_act=strat_new;
                    point[i].push([this.intersect[i][strat_mix[0]].getPosx(),this.intersect[i][strat_mix[0]].getPosy()]);
                    strat_point[i].push(strat_act);
                    strat_mix=[];
                }
                else{
                    point[i].push([x_new,y_new]);
                    x_min=x_new;
                    strat_point[i].push(strat_new);
                    
                }
                for (var f=0;f<strat_prev.length;f++){
                    if (i==0 || max >1){
                        var y_step=(point[i][point[i].length-1][1]-point[i][point[i].length-2][1])/strat_prev.length;
                        var x_step=(point[i][point[i].length-1][0]-point[i][point[i].length-2][0])/strat_prev.length;
                        var line=this.lines[i][strat_prev[f]];
                        var pos_y=Number(point[i][point[i].length-2][1]+(f+0.5)*y_step-this.step/2);
                        var pos_x=Number(point[i][point[i].length-2][0]+(f+0.5)*x_step);
                        line.moveLabel(pos_x,pos_y);
                    }
                }
            }
            var s=Number(i*(this.width+2*this.margin)+this.margin)+",50 ,";
            for (var k=0;k<point[i].length;k++){
                s=s+point[i][k][0]+","+point[i][k][1]+" ,";
            }
            s=s+Number(i*(this.width+2*this.margin)+this.width-this.margin)+",50";
            if (i==0){
                var envelope=document.getElementById("envelope1");
                envelope.setAttributeNS(null,"points", s);
                
            }
            else{
                if (max>1){
                    var envelope=document.getElementById("envelope2");
                    envelope.setAttributeNS(null,"points", s);}
            }
        }
        
        this.draw_line_down(strat_point,point,max);
    };
    
    
    Diagram.prototype.pos_to_prob = function(i,pos){
        var temp= pos - i* (2*this.margin+this.width)- this.margin;
        return Math.round(temp/(this.width-2*this.margin)*100)/100;
    }
    
    Diagram.prototype.add_eq_text = function(s1,s2, id){
        var div= document.getElementById("eq_list");
        var h=document.createElement("h3");
        var temp = document.createTextNode("Equilibrium     ");
        var temp2 = document.createElement("img");
        temp2.setAttribute("src", "images/eq"+id+".png");
        temp2.setAttribute("width", 10);
        h.appendChild(temp);
        h.appendChild(temp2);
        div.appendChild(h);
        var h = document.createElement("p");
        var font1 = document.createElement("font");
        var temp = document.createTextNode(GTE.tree.matrix.players[1].name);
        font1.style.cssText ='color:red;';
        var temp2 = document.createTextNode(" plays "+s1);
        font1.appendChild(temp);
        font1.appendChild(temp2);
        h.appendChild(font1);
        div.appendChild(h);
        var h = document.createElement("p");
        var font2 = document.createElement("font");
        font2.style.cssText ='color:blue;';
        var temp = document.createTextNode(GTE.tree.matrix.players[2].name);
        var temp2 = document.createTextNode(" plays "+s2);
        font2.appendChild(temp);
        font2.appendChild(temp2);
        h.appendChild(font2);
        div.appendChild(h);
        
    }
    
    
    Diagram.prototype.draw_line_down = function(strat_point,point, max){
        var temp= document.getElementsByClassName("line_down").length;
        for (var i=0;i<temp;i++){
            GTE.svg.removeChild(document.getElementsByClassName("line_down")[0]);
        }
        for (var j=0;j<this.equilibrium.length;j++){
            for (var i=0;i<this.equilibrium[j].length;i++){
                this.equilibrium[j][i].clear();
            }
        }
        this.equilibrium=[[],[],[]];
        var div=document.getElementById("eq_list");
        temp= div.children.length;
        for (var i=0;i<temp;i++){
            div.removeChild(div.children[0]);}

        var temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "line2 line_down");
        temp.setAttribute("x1",this.margin);
        temp.setAttribute("x2",this.width-this.margin);
        temp.setAttribute("y1",Number(this.height+this.margin));
        temp.setAttribute("y2",Number(this.height+this.margin));
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "stick line_down");
        temp.setAttribute("x1",this.margin);
        temp.setAttribute("x2",this.margin);
        temp.setAttribute("y1",445);
        temp.setAttribute("y2",455);
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "stick line_down");
        temp.setAttribute("x1",this.width-this.margin);
        temp.setAttribute("x2",this.width-this.margin);
        temp.setAttribute("y1",445);
        temp.setAttribute("y2",455);
        GTE.svg.appendChild(temp);
        var cmp=0;
        var x1;
        var x2;
        //degenerated equilibrium
        for (var i=0;i<strat_point[0].length-1;i++){
            var dege=[];
            var dege2=[];
            for (var j=0;j<strat_point[0][i].length;j++){
                if (this.payoffs[1][strat_point[0][i][j]][this.strat[1][0]]== this.payoffs[1][strat_point[0][i][j]][this.strat[1][1]]){
                    var in_test=false;
                    for (var k=0;k<strat_point[0][i+1].length;k++){
                        if (strat_point[0][i][j]==strat_point[0][i+1][k]){
                            in_test=false;
                            for (var l=0;l<dege.length;l++){
                                if (dege[l]==strat_point[0][i][j])
                                in_test=true;
                            }
                            if (in_test==false){
                                dege.push(strat_point[0][i][j]);
                                in_test=true;}
                        }
                    }
                    if (in_test==false && ( (this.payoffs[0][this.strat[0][0]][this.strat[1][0]]== this.payoffs[0][this.strat[0][1]][this.strat[1][0]]) ||( this.payoffs[0][this.strat[0][0]][this.strat[1][1]]== this.payoffs[0][this.strat[0][1]][this.strat[1][1]]  ) ) ){
                        for (var l=0;l<dege2.length;l++){
                            if (dege2[l]==strat_point[0][i][j])
                            in_test=true;
                        }
                        for (var l=0;l<dege.length;l++){
                            if (dege[l]==strat_point[0][i][j])
                            in_test=true;
                        }
                        if (in_test==false){
                            dege2.push(strat_point[0][i][j]);
                            in_test=true;}
                    }
                }
            }
            if (dege.length>0){
                this.equilibrium[0][cmp]=new GTE.Marker(cmp,point[0][i][0],Number(this.height+this.margin),"#00ff00");
                this.equilibrium[0][cmp].degenerated(point[0][i+1][0]);
                if (max>1){
                    if (dege.length==1 && dege[0]==this.strat[0][0]){
                        this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.margin+this.width+this.margin),Number(this.height+this.margin),"#00ff00");
                        this.equilibrium[2][cmp]=new GTE.Marker(cmp,Number(point[0][i][0]/2+point[0][i+1][0]/2),Number(this.height+2*this.margin),"#00ff00");
                        var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" between "+this.pos_to_prob(0,point[0][i][0])+" and "+this.pos_to_prob(0,point[0][i+1][0]);
                        var s1=GTE.tree.matrix.strategies[1][dege[0]].moves[0].name;
                        this.add_eq_text(s1,s2,cmp);
                    }
                    if (dege.length==1 && dege[0]==this.strat[0][1]){
                        this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.width+this.margin),Number(this.height+this.margin),"#00ff00");
                        this.equilibrium[2][cmp]=new GTE.Marker(cmp,Number(point[0][i][0]/2+point[0][i+1][0]/2),Number(2*this.height-2*this.margin),"#00ff00");
                        var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" between "+this.pos_to_prob(0,point[0][i][0])+" and "+this.pos_to_prob(0,point[0][i+1][0]);
                        var s1=GTE.tree.matrix.strategies[1][dege[0]].moves[0].name;
                        this.add_eq_text(s1,s2,cmp);
                    }
                    if (dege.length==2){
                        this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.margin+this.width+this.margin),Number(this.height+this.margin),"#00ff00");
                        this.equilibrium[1][cmp].degenerated(Number(2*this.width+this.margin));
                        this.equilibrium[2][cmp]=new GTE.Marker(cmp,Number(point[0][i][0]/2+point[0][i+1][0]/2),Number(3*this.height/2),"#00ff00");
                        var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" between "+this.pos_to_prob(0,point[0][i][0])+" and "+this.pos_to_prob(0,point[0][i+1][0]);
                        var s1=GTE.tree.matrix.strategies[1][dege[0]].moves[0].name+" between 0 and 1";
                        this.add_eq_text(s1,s2,cmp);
                    }
                }
                
                cmp=cmp+1;
            }
            if(dege2.length>0){
                this.equilibrium[0][cmp]=new GTE.Marker(cmp,point[0][i][0],Number(this.height+this.margin),"#00ff00");
       if (max==2){
                this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.margin+this.width+this.margin),Number(this.height+this.margin),"#00ff00");
                this.equilibrium[1][cmp].degenerated(Number(2*this.width+this.margin));
                this.equilibrium[2][cmp]=new GTE.Marker(cmp,Number(point[0][i][0]),Number(3*this.height/2),"#00ff00");
                var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,point[0][i][0]);
                var s1=GTE.tree.matrix.strategies[1][dege2[0]].moves[0].name+" between 0 and 1";
                this.add_eq_text(s1,s2,cmp);
       }
                cmp=cmp+1;
                
            }
        }
        
        //degenrated equilibrium of the 2nd player.
        var i= strat_point[0].length-1;
        var dege2=[];
        for (var j=0;j<strat_point[0][i].length;j++){
            if (this.payoffs[1][strat_point[0][i][j]][this.strat[1][0]]== this.payoffs[1][strat_point[0][i][j]][this.strat[1][1]]){
                var in_test=false;
                if  ( (this.payoffs[0][this.strat[0][0]][this.strat[1][0]]== this.payoffs[0][this.strat[0][1]][this.strat[1][0]]) ||( this.payoffs[0][this.strat[0][0]][this.strat[1][1]]== this.payoffs[0][this.strat[0][1]][this.strat[1][1]]  ) ){
                    for (var l=0;l<dege2.length;l++){
                        if (dege2[l]==strat_point[0][i][j])
                        in_test=true;
                    }
                    for (var l=0;l<dege.length;l++){
                        if (dege[l]==strat_point[0][i][j])
                        in_test=true;
                    }
                    if (in_test==false){
                        dege2.push(strat_point[0][i][j]);
                        in_test=true;}
                }
            }
        }
        if(dege2.length>0){
            this.equilibrium[0][cmp]=new GTE.Marker(cmp,point[0][i][0],Number(this.height+this.margin),"#00ff00");
       if (max==2){
            this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.margin+this.width+this.margin),Number(this.height+this.margin),"#00ff00");
            this.equilibrium[1][cmp].degenerated(Number(2*this.width+this.margin));
            this.equilibrium[2][cmp]=new GTE.Marker(cmp,Number(point[0][i][0]),Number(3*this.height/2),"#00ff00");
            var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,point[0][i][0]);
            var s1=GTE.tree.matrix.strategies[1][dege2[0]].moves[0].name+" between 0 and 1";
            this.add_eq_text(s1,s2,cmp);
       }
            cmp=cmp+1;
            
        }
        
        
        
        //Non degenerated equilibrium for the first player.
        for (var i=0;i<strat_point[0].length;i++){
            var test=false;
            var dege=false;
            for (var j=0;j<strat_point[0][i].length;j++){
                if (i==0 && this.payoffs[1][strat_point[0][i][j]][this.strat[1][0]]> this.payoffs[1][strat_point[0][i][j]][this.strat[1][1]]){
                    test=true;
                    x1=this.margin;
                    if (strat_point[0][i][j]==this.strat[0][1]){
                        x2=Number(2*this.width+this.margin);
                    }else{
                        x2=Number(2*this.margin+this.width+this.margin);
                        
                    }
                }
                if (i>0 && i<strat_point[0].length-1 && this.payoffs[1][strat_point[0][i][j]][this.strat[1][0]] > this.payoffs[1][strat_point[0][i][j]][this.strat[1][1]]){
                    for (var k=0;k<strat_point[0][i].length;k++){
                        if (k!=j && this.payoffs[1][strat_point[0][i][k]][this.strat[1][0]] < this.payoffs[1][strat_point[0][i][k]][this.strat[1][1]]){
                            test=true;
                            x1=point[0][i][0];
                            x2=this.intersect[1][0].getPosx();
                        }
                    }
                }
                if (i==strat_point[0].length-1 && this.payoffs[1][strat_point[0][i][j]][this.strat[1][0]]< this.payoffs[1][strat_point[0][i][j]][this.strat[1][1]]){
                    test=true;
                    x1=this.width-this.margin;
                    if (strat_point[0][i][j]==this.strat[0][1]){
                        x2=Number(2*this.width+this.margin);
                    }else{
                        x2=Number(2*this.margin+this.width+this.margin);
                    }
                }
            }
            
            if (test){
                this.equilibrium[0][cmp]=new GTE.Marker(cmp,x1,Number(this.height+this.margin),"#00ff00");
                if (max==2){
                    if (x2==Number(2*this.margin+this.width+this.margin)){
                        this.equilibrium[1][cmp]=new GTE.Marker(cmp,x2,Number(this.height+this.margin),"#00ff00");
                        if ((this.payoffs[0][this.strat[0][0]][this.strat[1][0]]== this.payoffs[0][this.strat[0][1]][this.strat[1][0]] && (this.best_response[1][0]==0||this.best_response[1][0]==-1)) ||( this.payoffs[0][this.strat[0][0]][this.strat[1][1]]== this.payoffs[0][this.strat[0][1]][this.strat[1][1]] && (this.best_response[1][0]==1||this.best_response[1][0]==-1))){
                            this.equilibrium[1][cmp].degenerated(this.intersect[1][0].getPosx());
                            this.equilibrium[2][cmp]=new GTE.Marker(cmp,x1,Number(x2/2+this.intersect[1][0].getPosx()/2+this.margin),"#00ff00");
                            var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,x1);
                            var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" between 0 and "+this.pos_to_prob(1,this.intersect[1][0].getPosx());
                            this.add_eq_text(s1,s2,cmp);
                        }
                        else {
                            this.equilibrium[2][cmp]=new GTE.Marker(cmp,x1,Number(x2+this.margin),"#00ff00");
                            var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,x1);
                            var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" with probability "+this.pos_to_prob(1,x2);
                            this.add_eq_text(s1,s2,cmp);
                        }
                    }
                    else{
                        
                        if (x2==Number(2*this.width+this.margin)){
                            if ((this.payoffs[0][this.strat[0][0]][this.strat[1][0]]== this.payoffs[0][this.strat[0][1]][this.strat[1][0]] && (this.best_response[1][1]==0||this.best_response[1][1]==-1)) ||(this.payoffs[0][this.strat[0][0]][this.strat[1][1]]== this.payoffs[0][this.strat[0][1]][this.strat[1][1]] && (this.best_response[1][1]==1||this.best_response[1][1]==-1))){
       if (this.intersect[1][0].getPosx()>Number(2*this.margin+this.width+this.margin) && this.intersect[1][0].getPosx()<Number(2*this.width+this.margin)){
           this.equilibrium[1][cmp]=new GTE.Marker(cmp,this.intersect[1][0].getPosx(),Number(this.height+this.margin),"#00ff00");
           }
           
           else{
           this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.margin+this.width+this.margin),Number(this.height+this.margin),"#00ff00");}
                                this.equilibrium[1][cmp].degenerated(x2);
                                this.equilibrium[2][cmp]=new GTE.Marker(cmp,x1,Number(this.intersect[1][0].getPosx()/2+this.margin/2+this.width+this.margin),"#00ff00");
                                var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,x1);
                                var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" between 0 and 1";
                                this.add_eq_text(s1,s2,cmp);
                            }else{
                                
                                this.equilibrium[1][cmp]=new GTE.Marker(cmp,x2,Number(this.height+this.margin),"#00ff00");
                                this.equilibrium[2][cmp]=new GTE.Marker(cmp,x1,Number(x2+this.margin),"#00ff00");
                                var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,x1);
                                var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" with probability "+this.pos_to_prob(1,x2);
                                this.add_eq_text(s1,s2,cmp);
                            }
                        }else {
                            this.equilibrium[1][cmp]=new GTE.Marker(cmp,x2,Number(this.height+this.margin),"#00ff00");
                            this.equilibrium[2][cmp]=new GTE.Marker(cmp,x1,Number(x2+this.margin),"#00ff00");
                            var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,x1);
                            var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" with probability "+this.pos_to_prob(1,x2);
                            this.add_eq_text(s1,s2,cmp);
                        }
                    }
                }
                cmp=cmp+1;
            }
        }
    }
    
    
    Diagram.prototype.draw_square_down = function(strat11=0, strat12=1, strat21=0, strat22=1){
        var strat=[[strat11,strat12],[strat21,strat22]];
        var inter=[[0,0],[0,0]];
        for (var i=0;i<this.intersect[0].length;i++){
            if ((this.intersect[0][i].getStrat1()==strat11 &&this.intersect[0][i].getStrat2()==strat12) || (this.intersect[0][i].getStrat2()==strat11 &&this.intersect[0][i].getStrat1()==strat12)){
                inter[0]=[this.intersect[0][i].getPosx(),this.intersect[0][i].getPosy()];
            }
        }
        for (var i=0;i<this.intersect[1].length;i++){
            if ((this.intersect[1][i].getStrat1()==strat21 &&this.intersect[1][i].getStrat2()==strat22) || (this.intersect[1][i].getStrat2()==strat21 &&this.intersect[1][i].getStrat1()==strat22)){
                inter[1]=[this.intersect[1][i].getPosx(),this.intersect[1][i].getPosy()];
            }
        }
        for (var i=0;i<2;i++){
            for (var j=0;j<2;j++){
                var temp=GTE.svg.getElementsByClassName("strat"+i+""+j+" change");
                for (var k=0;k<temp.length;k++)
                temp[k].textContent=GTE.tree.matrix.strategies[Number(i+1)][strat[i][j]].moves[0].name;
            }
        }
        
        
        
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
        /*for (var i=0;i<4;i++){ //Initializing pure equilibria
         temp[i].setAttributeNS(null, "r", 2*this.rad);
         }*/
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
                /*temp[0].setAttributeNS(null, "r", 0);
                 temp[1].setAttributeNS(null, "r", 0);
                 temp[2].setAttributeNS(null, "r", 0);
                 temp[3].setAttributeNS(null, "r", 0);*/
            }
            else{
                if (this.best_response[0][1]==0){
                    path1=Number(this.margin)+","+Number(this.height+2*this.margin)+","+ Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                    //temp[2].setAttributeNS(null, "r", 0);
                    //temp[3].setAttributeNS(null, "r", 0);
                    
                    temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                    temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                    temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                    temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                }
                else {
                    path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+","+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                    //temp[0].setAttributeNS(null, "r", 0);
                    //temp[1].setAttributeNS(null, "r", 0);
                    
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
                    //temp[2].setAttributeNS(null, "r", 0);
                    
                    temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                    temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                    temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                    temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                }
                else{
                    path1=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+ Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                    //temp[1].setAttributeNS(null, "r", 0);
                    
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
                        // temp[3].setAttributeNS(null, "r", 0);
                        
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
                        path1=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+inter[0][0]+","+Number(this.height+2*this.margin)+", "+inter[0][0]+","+Number(2*this.margin+this.height+this.side)+", "+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        temp[8].setAttributeNS(null, "x", inter[0][0]-5);
                        temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "width", Number(2*this.rad));
                        
                        temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[4].setAttributeNS(null, "width", ~~(inter[0][0]-Number(this.margin))+Number(2*this.rad));
                        
                        temp[6].setAttributeNS(null, "x", inter[0][0]-5);
                        temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                        temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[6].setAttributeNS(null, "width", ~~(Number(this.margin+this.side)-inter[0][0])+Number(2*this.rad));
                        
                        //temp[1].setAttributeNS(null, "r", 0);
                        //temp[3].setAttributeNS(null, "r", 0);
                    }
                }
                else{
                    if (this.best_response[0][1]==0){
                        path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+inter[0][0]+","+Number(2*this.margin+this.height+this.side)+", "+inter[0][0]+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                        temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[6].setAttributeNS(null, "width", ~~(inter[0][0]-Number(this.margin))+Number(2*this.rad));
                        
                        temp[8].setAttributeNS(null, "x", inter[0][0]-5);
                        temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "width", Number(2*this.rad));
                        
                        temp[4].setAttributeNS(null, "x", inter[0][0]-5);
                        temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[4].setAttributeNS(null, "width", ~~(Number(this.margin+this.side)-inter[0][0])+Number(2*this.rad));
                        
                        //temp[0].setAttributeNS(null, "r", 0);
                        //temp[2].setAttributeNS(null, "r", 0);
                    }
                    else{
                        path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        //temp[0].setAttributeNS(null, "r", 0);
                        
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
                /*temp[0].setAttributeNS(null, "r", 0);
                 temp[1].setAttributeNS(null, "r", 0);
                 temp[2].setAttributeNS(null, "r", 0);
                 temp[3].setAttributeNS(null, "r", 0);*/
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
                    //temp[1].setAttributeNS(null, "r", 0);
                    //temp[2].setAttributeNS(null, "r", 0);
                    temp[4].setAttributeNS(null, "height", 0);
                    temp[5].setAttributeNS(null, "height", 0);
                    temp[6].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);}
                    temp[4].setAttributeNS(null, "width", 0);
                    temp[5].setAttributeNS(null, "width", 0);
                    temp[6].setAttributeNS(null, "width", 0);
                    //if (temp[7].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[7].getAttribute("width")>0)
                    //temp[0].setAttributeNS(null, "r", 0);//remove end point
                    //if (Number(temp[7].getAttribute("y"))+Number(temp[7].getAttribute("height"))==705)
                    //temp[3].setAttributeNS(null, "r", 0);//remove end point
                }
                else {
                    path2=Number(this.margin+this.side)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                    // temp[0].setAttributeNS(null, "r", 0);
                    // temp[3].setAttributeNS(null, "r", 0);
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
                    //if (temp[5].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[5].getAttribute("width")>0)
                    //temp[1].setAttributeNS(null, "r", 0);//remove end point
                    //if (Number(temp[5].getAttribute("y"))+Number(temp[5].getAttribute("height"))==705)
                    //temp[2].setAttributeNS(null, "r", 0);//remove end point
                }
            }
            
        }
        else {
            if (this.best_response[1][0]==-1){
                if (this.best_response[1][1]==0){
                    path2=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                    //temp[2].setAttributeNS(null, "r", 0);
                    temp[5].setAttributeNS(null, "height", 0);
                    temp[6].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >0){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);
                    }
                    temp[5].setAttributeNS(null, "width", 0);
                    temp[6].setAttributeNS(null, "width", 0);
                    //if (temp[7].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[7].getAttribute("width")>0)
                    // temp[0].setAttributeNS(null, "r", 0);//remove end point
                    //if (Number(temp[7].getAttribute("y"))+Number(temp[7].getAttribute("height"))==705)
                    //temp[3].setAttributeNS(null, "r", 0);//remove end point
                    //if (temp[4].getAttribute("x")==Number(this.margin-this.rad) && temp[4].getAttribute("width")>0)
                    //temp[0].setAttributeNS(null, "r", 0);//remove end point
                    //if (Number(temp[4].getAttribute("x"))+Number(temp[4].getAttribute("width"))==255)
                    //temp[1].setAttributeNS(null, "r", 0);//remove end point
                }
                else{
                    path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                    //temp[3].setAttributeNS(null, "r", 0);
                    temp[6].setAttributeNS(null, "height", 0);
                    temp[7].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);
                    }
                    temp[6].setAttributeNS(null, "width", 0);
                    temp[7].setAttributeNS(null, "width", 0);
                    //if (temp[5].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[5].getAttribute("width")>0 )
                    //temp[1].setAttributeNS(null, "r", 0);//remove end point
                    // if (Number(temp[5].getAttribute("y"))+Number(temp[5].getAttribute("height"))==705)
                    // temp[2].setAttributeNS(null, "r", 0);//remove end point
                    // if (temp[4].getAttribute("x")==Number(this.margin-this.rad) && temp[4].getAttribute("width")>0)
                    // temp[0].setAttributeNS(null, "r", 0);//remove end point
                    // if (Number(temp[4].getAttribute("x"))+Number(temp[4].getAttribute("width"))==255)
                    // temp[1].setAttributeNS(null, "r", 0);//remove end point
                }
            }
            else{
                if (this.best_response[1][0]==0){
                    if (this.best_response[1][1]==-1){
                        path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        // temp[1].setAttributeNS(null, "r", 0);
                        temp[4].setAttributeNS(null, "height", 0);
                        temp[5].setAttributeNS(null, "height", 0);
                        if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                            temp[8].setAttributeNS(null, "height", 0);
                            temp[8].setAttributeNS(null, "width", 0);
                        }
                        temp[4].setAttributeNS(null, "width", 0);
                        temp[5].setAttributeNS(null, "width", 0);
                        //if (temp[7].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[7].getAttribute("width")>0)
                        //temp[0].setAttributeNS(null, "r", 0);//remove end point
                        //if (Number(temp[7].getAttribute("y"))+Number(temp[7].getAttribute("height"))==705)
                        //temp[3].setAttributeNS(null, "r", 0);//remove end point
                        //if (temp[6].getAttribute("x")==Number(this.margin-this.rad) && temp[6].getAttribute("width")>0)
                        //temp[3].setAttributeNS(null, "r", 0);//remove end point
                        //if (Number(temp[6].getAttribute("x"))+Number(temp[6].getAttribute("width"))==255)
                        //temp[2].setAttributeNS(null, "r", 0);//remove end point
                    }
                    else{
                        path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin)+","+Number(inter[1][0]+this.margin)+", "+Number(this.margin+this.side)+","+Number(inter[1][0]+Number(this.margin))+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        //temp[1].setAttributeNS(null, "r", 0);
                        //temp[3].setAttributeNS(null, "r", 0);
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
                            temp[8].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
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
                            temp[7].setAttributeNS(null, "height", Number(inter[1][0]-Number(Number(this.height+2*this.margin))+Number(60)));
                            if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                                temp[8].setAttributeNS(null, "height", 0);
                                temp[8].setAttributeNS(null, "width", 0);
                            }
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            //temp[0].setAttributeNS(null, "r", 0);//remove end point
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
                            temp[5].setAttributeNS(null, "height",Number(Number(2*this.margin+this.height+this.side)-Number(inter[1][0])-Number(40)) );
                            temp[5].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            temp[7].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            //temp[2].setAttributeNS(null, "r", 0);//remove end point
                        }
                        if (this.best_response[0][1]==-1 && this.best_response[0][0]==-1){
                            
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            
                            //temp[0].setAttributeNS(null, "r", 0);//remove end point
                            temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[7].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[7].setAttributeNS(null, "height", Number(inter[1][0]-Number(Number(this.height+2*this.margin))+Number(60)));
                            temp[7].setAttributeNS(null, "width", Number(2*this.rad));
                            
                            temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[8].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                            
                            //temp[2].setAttributeNS(null, "r", 0);//remove end point
                            temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                            temp[5].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            temp[5].setAttributeNS(null, "height",Number(Number(2*this.margin+this.height+this.side)-Number(inter[1][0])-Number(40)) );
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
                        path2=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(inter[1][0]+this.margin)+", "+Number(this.margin+this.side)+","+Number(inter[1][0]+Number(Number(this.margin)))+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        //temp[0].setAttributeNS(null, "r", 0);
                        //temp[2].setAttributeNS(null, "r", 0);
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
                            temp[8].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
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
                            temp[7].setAttributeNS(null, "height", Number(Number(2*this.margin+this.height+this.side)-Number(inter[1][0])-Number(40)));
                            temp[7].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                                temp[8].setAttributeNS(null, "height", 0);
                                temp[8].setAttributeNS(null, "width", 0);
                            }
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            //temp[3].setAttributeNS(null, "r", 0);//remove end point
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
                            temp[5].setAttributeNS(null, "height", Number(inter[1][0]-Number(Number(this.height+2*this.margin))+Number(60) ));
                            temp[7].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            //temp[1].setAttributeNS(null, "r", 0);//remove end point
                        }
                        if (this.best_response[0][1]==-1 && this.best_response[0][0]==-1){
                            
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            
                            // temp[3].setAttributeNS(null, "r", 0);//remove end point
                            temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[7].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            temp[7].setAttributeNS(null, "height", Number(Number(2*this.margin+this.height+this.side)-Number(inter[1][0])-Number(40)));
                            temp[7].setAttributeNS(null, "width", Number(2*this.rad));
                            
                            temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[8].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                            
                            // temp[1].setAttributeNS(null, "r", 0);//remove end point
                            temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                            temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[5].setAttributeNS(null, "height",Number(inter[1][0]-Number(Number(this.height+2*this.margin))+Number(60) ));
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
                        // temp[0].setAttributeNS(null, "r", 0);
                        temp[4].setAttributeNS(null, "height", 0);
                        temp[7].setAttributeNS(null, "height", 0);
                        if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                            temp[8].setAttributeNS(null, "height", 0);
                            temp[8].setAttributeNS(null, "width", 0);
                        }
                        temp[4].setAttributeNS(null, "width", 0);
                        temp[7].setAttributeNS(null, "width", 0);
                        //if (temp[5].getAttribute("y")==Number(2*this.margin+this.height-this.rad) && temp[5].getAttribute("width")>0)
                        //temp[1].setAttributeNS(null, "r", 0);//remove end point
                        //if (Number(temp[5].getAttribute("y"))+Number(temp[5].getAttribute("height"))==705)
                        //temp[2].setAttributeNS(null, "r", 0);//remove end point
                        //if (Number(temp[6].getAttribute("x"))==Number(this.margin-this.rad) && temp[6].getAttribute("width")>0)
                        //temp[3].setAttributeNS(null, "r", 0);//remove end point
                        //if (Number(temp[6].getAttribute("x"))+Number(temp[6].getAttribute("width"))==255)
                        //temp[2].setAttributeNS(null, "r", 0);//remove end point
                    }
                }
            }
        }
        
        temp2[0].setAttributeNS(null, "points", path1);
        temp2[1].setAttributeNS(null, "points", path2);
        
        var stick=GTE.svg.getElementsByClassName("interstick1");
        for (i=0;i<stick.length;i++){
            stick[i].setAttributeNS(null, "x1",inter[0][0]);
            stick[i].setAttributeNS(null, "x2",inter[0][0]);
        }
        var stick=GTE.svg.getElementsByClassName("interstick2");
        for (i=0;i<stick.length;i++){
            stick[i].setAttributeNS(null, "x1",Number(inter[1][0]));
            stick[i].setAttributeNS(null, "x2",Number(inter[1][0]));
        }
        var pos1=Number((inter[0][0]+Number(Number(this.margin)))/2);
        var pos2=Number((inter[0][0]+Number(Number(this.margin+this.side)))/2);
        var middle=Number(this.margin+(this.width-2*this.margin)/2);
        if (this.best_response[0][0]==0){
            GTE.svg.getElementsByClassName("middle11")[0].setAttributeNS(null, "x", pos1);
            GTE.svg.getElementsByClassName("middle12")[0].setAttributeNS(null, "x", pos2);
            if (this.best_response[0][1]!=1)
            GTE.svg.getElementsByClassName("middle12")[0].textContent="";
            if (this.best_response[0][1]==0)
            GTE.svg.getElementsByClassName("middle11")[0].setAttributeNS(null, "x", middle);
        }
        else {
            if (this.best_response[0][0]==1){
                GTE.svg.getElementsByClassName("middle11")[0].setAttributeNS(null, "x", pos2);
                GTE.svg.getElementsByClassName("middle12")[0].setAttributeNS(null, "x", pos1);
                if (this.best_response[0][1]!=0)
                GTE.svg.getElementsByClassName("middle11")[0].textContent="";
                if (this.best_response[0][1]==1)
                GTE.svg.getElementsByClassName("middle11")[0].setAttributeNS(null, "x", middle);
            }
            else {
                if (this.best_response[0][1]==0){
                    GTE.svg.getElementsByClassName("middle11")[0].setAttributeNS(null, "x", middle);
                    GTE.svg.getElementsByClassName("middle12")[0].textContent="";
                }
                if (this.best_response[0][1]==1){
                    GTE.svg.getElementsByClassName("middle12")[0].setAttributeNS(null, "x", middle);
                    GTE.svg.getElementsByClassName("middle11")[0].textContent="";
                }
                if (this.best_response[0][1]==-1){
                    GTE.svg.getElementsByClassName("middle11")[0].setAttributeNS(null, "x", Number(this.margin+(this.width-2*this.margin)/3));
                    GTE.svg.getElementsByClassName("middle12")[0].setAttributeNS(null, "x", Number(this.margin+2*(this.width-2*this.margin)/3));
                }
                
            }
        }
        
        pos1=Number((inter[1][0]+3*this.margin+this.width)/2);
        pos2=Number((inter[1][0]+this.margin+2*this.width)/2);
        middle=Number(3*this.margin+this.width+(this.width-2*this.margin)/2);
        if (this.best_response[1][0]==0){
            GTE.svg.getElementsByClassName("middle21")[0].setAttributeNS(null, "x", pos1);
            GTE.svg.getElementsByClassName("middle22")[0].setAttributeNS(null, "x", pos2);
            if (this.best_response[1][1]!=1)
            GTE.svg.getElementsByClassName("middle22")[0].textContent="";
            if (this.best_response[1][1]==0)
            GTE.svg.getElementsByClassName("middle21")[0].setAttributeNS(null, "x", middle);
        }
        else {
            if (this.best_response[1][0]==1){
                GTE.svg.getElementsByClassName("middle21")[0].setAttributeNS(null, "x", pos2);
                GTE.svg.getElementsByClassName("middle22")[0].setAttributeNS(null, "x", pos1);
                if (this.best_response[1][1]!=0)
                GTE.svg.getElementsByClassName("middle21")[0].textContent="";
                if (this.best_response[1][1]==1)
                GTE.svg.getElementsByClassName("middle21")[0].setAttributeNS(null, "x", middle);
            }
            else {
                if (this.best_response[1][1]==0){
                    GTE.svg.getElementsByClassName("middle21")[0].setAttributeNS(null, "x", middle);
                    GTE.svg.getElementsByClassName("middle22")[0].textContent="";
                }
                if (this.best_response[1][1]==1){
                    GTE.svg.getElementsByClassName("middle22")[0].setAttributeNS(null, "x", middle);
                    GTE.svg.getElementsByClassName("middle21")[0].textContent="";
                }
                if (this.best_response[1][1]==-1){
                    GTE.svg.getElementsByClassName("middle21")[0].setAttributeNS(null, "x", Number(this.width+3*this.margin+(this.width-2*this.margin)/3));
                    GTE.svg.getElementsByClassName("middle22")[0].setAttributeNS(null, "x", Number(this.width+3*this.margin+2*(this.width-2*this.margin)/3));
                }
                
            }
        }
        
        
        if (inter[1][0]>450 && inter[1][0] <650){
            var t1=Number(inter[1][0])-Number(410);
            var t2=460+Number(inter[1][0])-Number(410);
            GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d", "M"+inter[1][0]+",460 A"+t1+","+t1+" 0 0,1 410,"+t2);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y1", t2);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y2", t2);
        }
        if (inter[1][0]==450){
            GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d","M450,460 A40,40 0 0,1 410,500");
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y1", 500);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y2", 500);
        }
        if (inter[1][0]==650){
            GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d","M650,460 A240,240 0 0,1 410,700");
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y1", 700);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y2", 700);
        }
        
        GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x1", Number(this.margin));
        GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x2", Number(this.margin));
        if (inter[0][0]>Number(this.margin) && inter[0][0]<Number(this.margin+this.side)){
            GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x1", inter[0][0]);
            GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x2", inter[0][0]);
        }
        
        
    };
    
    Diagram.prototype.clear = function(){
        var max =1;
        if(this.nb_strat[0]==2 && this.nb_strat[1]==2)
        max=2
        for (var i=0;i<this.lines.length;i++){
            if (i==0 || max >1){
                for (var j=0;j<this.lines[i].length;j++){
                    var temp=this.lines[i][j].html_element[0];
                    GTE.svg.removeChild(temp);
                    temp=this.lines[i][j].html_element[1];
                    GTE.svg.removeChild(temp);
                    temp=this.lines[i][j].txt;
                    GTE.svg.removeChild(temp);
                }
            }
        }
        for (var i=0;i<this.endpoints.length;i++){
            if (i==0 || max >1){
                for (var j=0;j<this.endpoints[i].length;j++){
                    temp=this.endpoints[i][j].html_element;
                    GTE.svg.removeChild(temp);
                }
            }
        }
        this.endpoints=[];
        this.lines=[];
        this.best_response=[];
        this.payoffs=[];
        for (var i=0;i<this.intersect.length;i++){
            if (i==0 || max >1){
                for (var j=0; j<this.intersect[i].length;j++){
                    this.intersect[i][j].clear();
                }
            }
        }
        this.intersect=[];
        var envelope1=document.getElementById("envelope1");
        envelope1.setAttributeNS(null,"points", "50,50, 50,350, 250,350, 250,50");
        if (this.nb_strat[0]==2 && this.nb_strat[1]==2 ){
            var envelope2=document.getElementById("envelope2");
            envelope2.setAttributeNS(null,"points", "450,50, 450,350, 650,350,  650,50");}
        this.cleanForeign();
        
    }
    
    Diagram.prototype.cleanForeign = function (){
        
        var temp=GTE.svg.getElementsByTagName("foreignObject").length;
        for( var k=0;k<temp;k++){
            GTE.svg.removeChild(GTE.svg.getElementsByTagName("foreignObject")[0]);
        }
    }
    
    // Add class to parent module
    parentModule.Diagram = Diagram;
    
    return parentModule;
}(GTE)); // Add to GTE.TREE sub-module
