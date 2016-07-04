GTE = (function(parentModule) {
   "use strict";
   /**
   * Creates a new Diagrams Class.
   * @class
   */
   function Diagram() {
      this.precision = 1/document.getElementById("precision").value;; // precision for payoffs.
      this.endpoints = []; //two dimension array [player][strat] that contains endpoints.
      this.lines = []; //two dimension array [player][strat_player] that contains lines.
      this.payoffs = [][]; //two dimension array [player][strat] that contains payoffs
      this.best_response = [][]; // two dimensions array [player][strat_other_player] that contains the best respons of a player. -1 means the two strategies are equivalent.
      this.envelopps= []; // two envelopp for each best response. 
      this.moving_endpoint;
      this.moving_line;
      this.prev_pos;
      this.height=400;
      this.width=300;
      this.margin=50;
      this.max=10;
      this.min=0;
      this.step= (this.height-Number(2*this.margin))/(this.max-Number(this.min));
      assignEnvelopps();
      assignEndpoints();
      assignLines();
      ini_arrays();
   }

   Diagram.assignEnvelopps = function () {
       this.envelopps.push( new GTE.diagram.envelopp(0) );
       this.envelopps.push( new GTE.diagram.envelopp(1) );
    }
    
   Diagram.prototype.assignEndpoints = function() {
      for (var j=0; j<2;j++){
         this.endpoints.push([]);
         for(var i=0;i<4;i++){
            this.endpoints[j].push( new GTE.diagram.endpoint(this.margin,this.margin,j,i));
         }
         this.endpoints.push( new GTE.diagram.endpoint(this.margin,this.margin,j,-1));
      }
   };
       
   Diagram.prototype.assignLines = function() {
      for (var j=0; j<2;j++){
         this.lines.push([]);
         for(var i=0;i<2;i++){
            this.lines[j].push( new GTE.diagram.line(j,i));
         }
      }
   };

   Diagram.prototypr.ini_arrays = function() {
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
   }
   
   /*
   Associate html element to endpoint object.
   */
   Diagram.prototype.doMouseDownEndpoint = function (event){
      event.preventDefault();
      var strat=event.currentTarget.getAttribute("asso_strat");
      var player=event.currentTarget.getAttribute("asso_player");
      this.moving_endpoint= this.endpoints[player][strat];
      document.addEventListener("mousemove", doMouseMoveEndpoint);
      document.addEventListener("mouseup", doMouseupEndpoint);
      event.currentTarget.removeEventListener("mousedown", doMouseDownEndpoint);
   }
       
   Diagram.prototype.doMouseDownLine = function (event){
      event.preventDefault();
      var strat=event.currentTarget.getAttribute("asso_strat");
      var player=event.currentTarget.getAttribute("asso_player");
      this.moving_line= this.lines[player][strat];
      this.prev_pros=GTE.getMousePosition(event);
      document.addEventListener("mousemove", doMouseMoveLine);
      document.addEventListener("mouseup", doMouseupLine);
      event.currentTarget.removeEventListener("mousedown", doMouseDownLine);
   }
   
   /*
   Convert mouse's moves in endpoint's moves
   */
   Diagram.prototype.doMouseMoveEndpoint = function (event) {
      var mousePosition = GTE.getMousePosition(event)
      var svgPosition = GTE.svg.getBoundingClientRect();
      var newPos=Math.round((2*this.height/(svgPosition.bottom-svgPosition.top)*(-mousePosition.y+svgPosition.top)+this.height-this.margin)/this.step*this.precision)/this.precision;
      if (Number(newPos)<this.min) newPos=this.min;
      if (Number(newPos)>this.max) newPos=this.max;
      if( (Number(newPos)-this.moving_endpoint.getpos())*(Number(newPos)-this.moving_endpoint.getpos())>0.005){
         var player=this.moving_endpoint.getplayer();
         var strat=this.moving_endpoint.getstrat();
          GTE.tree.matrix.matrix[strat].strategy.payoffs[player].value=newPos;
          GTE.tree.matrix.matrix[strat].strategy.payoffs[player].text=newPos;
          redraw();
       }
   }
       
   Diagram.prototype.doMouseMoveLine = function (event) {
      var mousePosition = getMousePosition(event)
      var svgPosition = GTE.svg.getBoundingClientRect();
      diff=mousePosition.y-Pos_prev.y;
      var player=moving_line.getplayer();
      var strat1=moving_line.getstrat1();
      var strat2=moving_line.getstrat2();
      var point1=GTE.tree.matrix.matrix[strat1].strategy.payoffs[player];
      var point2=GTE.tree.matrix.matrix[strat2].strategy.payoffs[player];
      var diffPos=~~((2*this.height/(svgPosition.bottom-svgPosition.top)*(diff))/this.step*this.precision)/this.precision;
      var pos1=Math.round((point1.value-diffPos)*this.precision)/this.precision;
      var pos2=Math.round((point2.value-diffPos)*this.precision)/this.precision;
      if (pos2>=this.min && pos2<=this.max && pos1>=this.min && pos1<=this.max && diffPos!=0  ){
         point1.value=pos1;
         point2.value=pos2;
         point1.text=pos1;
         point2.text=pos2;
         Pos_prev=mousePosition;
         point1.draw();
         point2.draw();
         redraw();
      }
      console.log("Moving: X = " + mousePosition.x + ", Y = " + mousePosition.y);
   }
       
   Diagram.prototype.doMouseupLine = function(event) {
      mousePosition = getMousePosition(event)
      document.removeEventListener("mousemove", doMouseMoveLine);
      document.removeEventListener("mouseup", doMouseupEndpoint);
      moving_line.addEventListener("mousedown", doMouseDownLine);
      moving_line=null;
   }
       
   Diagram.prototype.doMouseupEndpoint = function(event) {
      mousePosition = getMousePosition(event)
      document.removeEventListener("mousemove", doMouseMoveEndpoint);
      document.removeEventListener("mouseup", doMouseupEndpoint);
      moving_line.addEventListener("mousedown", doMouseDownEndpoint);
      moving_line=null;
   }

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
   }
       
   Diagram.prototype.compute_best_response = function() {
      for ( var i=0;i<2;i++){
         for (var j=0;j<4;j++){
            this.payoffs[i][j](Math.round(GTE.tree.matrix.matrix[i].strategy.payoffs[j].value*precision)/precision);
            GTE.tree.matrix.matrix[i].strategy.payoffs[j].value=this.payoffs[i][j];
            this.endpoints[i][j].move(this.height-this.margin-this.payoffs[i][j]*this.step);
         }
         for (var j=0;j<2;j++){
            if (Number(this.payoffs[i][couple_strat(i,j)[0]])==Number(this.payoffs[i][couple_strat(i,j)[1]])){
               this.best_response[i][j]=-1;
            }
            else {
               if (Number(this.payoffs[i][couple_strat(i,j)[0]])>Number(this.payoffs[i][couple_strat(i,j)[1]])){
                  this.best_response[i][j]=0;
               }
               else {
                  this.best_response[i][j]=1;
               }
            }
         }
         if (this.best_response[i][0]==0 && this.best_response[i][1]==0) { ////If 0 is the best strategy, the middle point is on the left
       this.envelopps[i].setPoint(0, i*(this.width+2*this.margin)+this.margin, this.endpoints[i][couple_strat(i,0)[0]].getPosy());
            this.envelopps[i].setPoint(1, i*(this.width+2*this.margin)+this.margin, this.endpoints[i][couple_strat(i,0)[0]].getPosy());
            this.envelopps[i].setPoint(2, i*(this.width+2*this.margin)-this.margin+this.width, this.endpoints[i][couple_strat(i,1)[0]].getPosy());
          }
          else {
             if (this.best_response[i][0]==1 && this.best_response[i][1]==1){ ////If 1 is the best strategy, the middle point is on the right
                this.envelopps[i].setPoint(0, i*(this.width+2*this.margin)+this.margin, this.endpoints[i][couple_strat(i,0)[1]].getPosy());
                this.envelopps[i].setPoint(1, i*(this.width+2*this.margin)+this.width+this.margin, this.endpoints[i][couple_strat(i,1)[1]].getPosy());
                this.envelopps[i].setPoint(2, i*(this.width+2*this.margin)+this.width-this.margin, this.endpoints[i][couple_strat(i,1)[1]].getPosy());
             }
             else{
                var middle_x=(this.payoffs[i][couple_strat(i,0)[1]]-Number(this.payoffs[i][couple_strat(i,0)[0]]))/(this.payoffs[i][couple_strat(i,0)[1]]- Number(this.payoffs[i][couple_strat(i,1)[1]]) + Number(this.payoffs[i][couple_strat(i,1)[0]]) - Number(this.payoffs[i][couple_strat(i,0)[0]]));
                var middle_y =(this.payoffs[i][couple_strat(i,0)[1]]-Number(this.payoffs[i][couple_strat(i,0)[0]]))*middle_x/this.payoffs[i][couple_strat(i,0)[0]];
                this.envelopps[i].setPoint(0, i*(this.width+2*this.margin)+this.margin, this.endpoints[i][couple_strat(i,0)[best_response[i][0]]].getPosy());
                this.envelopps[i].setPoint(0, i*(this.width+2*this.margin)+this.margin+ middle_x*(this.width- Number( 2*this.margin)), middle_y*this.step);
                this.envelopps[i].setPoint(2, i*(this.width+2*this.margin)-this.margin+this.width, this.endpoints[i][couple_strat(i,1)[best_response[i][1]]].getPosy());
       
             }
          }
       }
    }

       
       // Add class to parent module
       parentModule.Diagram = Diagram;
       
       return parentModule;
       }(GTE)); // Add to GTE.TREE sub-module
