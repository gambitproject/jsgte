GTE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Diagrams Class.
     * @class
     */
    function Diagrams() {
        this.precision = 1; // precision for payoffs.
        this.endpoints = [];
        this.lines = []; 
       this.moving_endpoint;
       this.moving_line;
        this.prev_pos;
        this.height=400;
        this.width=300;
        this.margin=50;
       this.assignEndpoints();
    }
    
    
       Matrix.prototype.assignEndpoints = function() {
       for(var i=0;i<4;i++){
       for (var j=0; j<2;j++){
       this.endpoints.push( new GTE.diagrams.endpoint(50,50,j,i));
       }
       }
       };
    /*
    Associate html element to endpoint object.
    */
   Diagrams.prototype.doMouseDownEndpoint = function (event){
      event.preventDefault();
      var strat=event.currentTarget.getAttribute("asso_strat");
      var player=event.currentTarget.getAttribute("asso_player")-1;
      this.moving_endpoint= this.endpoints[player][strat];
      document.addEventListener("mousemove", doMouseMoveEndpoint);
      document.addEventListener("mouseup", doMouseupEndpoint);
      event.currentTarget.removeEventListener("mousedown", doMouseDownEndpoint);
    }
       
   Diagrams.prototype.doMouseDownLine = function (event){
      event.preventDefault();
      var strat=event.currentTarget.getAttribute("asso_strat");
      var player=event.currentTarget.getAttribute("asso_player")-1;
      this.moving_line= this.lines[player][strat];
      this.prev_pros=GTE.getMousePosition(event);
      document.addEventListener("mousemove", doMouseMoveLine);
      document.addEventListener("mouseup", doMouseupLine);
      event.currentTarget.removeEventListener("mousedown", doMouseDownLine);
    }
    /*
     Convert mouse's moves in endpoint's moves
     */
   Diagrams.prototype.doMouseMoveEndpoint = function (event) {
       var mousePosition = GTE.getMousePosition(event)
       svgPosition = GTE.svg.getBoundingClientRect();
       var newPos=Math.round((2*this.height/(svgPosition.bottom-svgPosition.top)*(-mousePosition.y+svgPosition.top)+this.height-this.margin)/30*this.precision)/this.precision;
       if (Number(newPos)<0) newPos=0;
       if (Number(newPos)>10) newPos=10;
       if( (Number(newPos)-this.moving_endpoint.getpos())*(Number(newPos)-this.moving_endpoint.getpos())>0.005){
       var player=this.moving_endpoint.getplayer()+1;
       var strat=this.moving_endpoint.getstrat();
       GTE.tree.matrix.matrix[strat].strategy.payoffs[player].value=newPos;
       GTE.tree.matrix.matrix[strat].strategy.payoffs[player].text=newPos;
       redraw();
       }
       }
       
    Diagrams.prototype.doMouseMoveLine = function (event) {
       var mousePosition = getMousePosition(event)
       diff=mousePosition.y-Pos_prev.y;
       var player1=moving_line.getplayer1();
       var strat1=moving_line.getstrat1();
       var player2=moving_line.getplayer2();
       var strat1=moving_line.getstrat2();
       var point1=GTE.tree.matrix.matrix[strat1].strategy.payoffs[player1];
       var point2=GTE.tree.matrix.matrix[strat2].strategy.payoffs[player2];
       var diffPos=~~((2*this.height/(svgPosition.bottom-svgPosition.top)*(diff))/30*this.precision)/this.precision;
       var pos1=Math.round((point1.value-diffPos)*this.precision)/this.precision;
       var pos2=Math.round((point2.value-diffPos)*this.precision)/this.precision;
       if (pos2>=0 && pos2<=10 && pos1>=0 && pos1<=10 && diffPos!=0  ){
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
     
     Diagrams.prototype.doMouseupLine = function(event) {
       mousePosition = getMousePosition(event)
       document.removeEventListener("mousemove", doMouseMoveLine);
       document.removeEventListener("mouseup", doMouseupEndpoint);
       moving_line.addEventListener("mousedown", doMouseDownLine);
       moving_line=null;
       }
       
       Diagrams.prototype.doMouseupEndpoint = function(event) {
       mousePosition = getMousePosition(event)
       document.removeEventListener("mousemove", doMouseMoveEndpoint);
       document.removeEventListener("mouseup", doMouseupEndpoint);
       moving_line.addEventListener("mousedown", doMouseDownEndpoint);
       moving_line=null;
       }
       
    Matrix.prototype.assignPlayers = function(players) {
        this.players = [];
        for(var i=0;i<players.length;i++)
            this.addPlayer(players[i]);
    };

    Matrix.prototype.addPlayer = function(player) {
        if(this.players.indexOf(player) == -1)
            this.players.push(player);
    };

    Matrix.prototype.assignIsets = function(node) {
        var playerIndex = this.players.indexOf(node.player);
        if(playerIndex == -1)
            alert("player not present in player array.")
        else {
            if(this.isets[playerIndex] == undefined)
                this.isets[playerIndex] = [];
            if(this.isets[playerIndex].indexOf(node.iset) == -1) {
                this.isets[playerIndex].push(node.iset);
            }
            for(var i=0;i<node.children.length;i++) {
                if(!node.children[i].isLeaf())
                    this.assignIsets(node.children[i]);
            }
        }
    };

    Matrix.prototype.getIsets = function(player) {
        if(this.players.indexOf(player) == -1 || this.isets[this.players.indexOf(player)] == undefined)
            return [];
        else {
            var playerIsets = [];
            for(var i=0;i<this.isets[this.players.indexOf(player)].length;i++)
                playerIsets.push(this.isets[this.players.indexOf(player)][i]);
            return playerIsets;
        }
    };

    Matrix.prototype.createMovePermutations = function(moves, currentPermutations, player) {
        if(moves==undefined || moves.length ==0) {
            return currentPermutations;
        } else {
            var permutations = [];
            if(currentPermutations.length == 0) {
                for(var i=0;i<moves.length;i++) {
                    var currentStrategy = new GTE.TREE.StrategicUnit(player);
                    currentStrategy.addMove(moves[i]);
                    permutations.push(currentStrategy);
                }
            }
            else {
                for(var i=0;i<moves.length;i++) {
                    for(var j = 0; j<currentPermutations.length ; j++) {
                        var perm = new GTE.TREE.StrategicUnit(player) 
                        perm.assignMoves(currentPermutations[j].moves);
                        perm.addMove(moves[i]);
                        permutations.push(perm);
                    }
                }
            }
            return permutations;
        }
    };

    Matrix.prototype.createMoves = function(player) {
        var isets = this.getIsets(player)
        if(isets == undefined || isets.length==0)
            return [];
        else {
            var permutations = [];
            for(var i=0;i<isets.length;i++) {
                permutations = this.createMovePermutations(isets[i].moves, permutations, player)
            }
            return permutations;
        }
    };

    Matrix.prototype.initialise = function() {
        this.assignPlayers(GTE.tree.players);
        this.assignIsets(GTE.tree.root);
        for(var i=0; i<this.players.length; i++) {
            var currentStrategy = this.createMoves(this.players[i]);  
            this.strategies.push(currentStrategy);
        }
        var currentPlayers = this.getAllPlayers();
        var strMatrix = this.createStrategies();
        for(var i = 0; i< strMatrix.length; i++) {
            if(this.players.length == 3) {
                var currentStrategyBlock = new GTE.TREE.StrategyBlock(strMatrix[i] , parseInt(i/(this.strategies[2].length)), parseInt(i%(this.strategies[2].length)));
                currentStrategyBlock.assignPayoffs();
                this.matrix.push(currentStrategyBlock);
            } else {
                var currentStrategyBlock = new GTE.TREE.StrategyBlock(strMatrix[i] , i+1);
                currentStrategyBlock.assignPayoffs();
                currentStrategy.draw();
                this.matrix.push(currentStrategyBlock);
            }
        }
        if(this.players.length == 3) {
            for(var i = 0; i<this.matrix.length; i++) {
                this.matrix[i].assignPartners();
            }
            this.drawMatrix();
        }
    };

    Matrix.prototype.drawMatrix = function() {
        this.drawUtilities();
        for(var i = 0;i<this.matrix.length; i++) {
            this.matrix[i].draw();
        }
    };

    Matrix.prototype.drawUtilities = function() {
        GTE.canvas.line(GTE.CONSTANTS.MATRIX_X -50,
                GTE.CONSTANTS.MATRIX_Y -50,
                GTE.CONSTANTS.MATRIX_X,
                GTE.CONSTANTS.MATRIX_Y)
            .stroke({ width: parseInt(GTE.STORAGE.settingsLineThickness) });

        this.player1 = new GTE.UI.Widgets.ContentEditable(
                GTE.CONSTANTS.MATRIX_X - 50, GTE.CONSTANTS.MATRIX_Y,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                "I", "player 1")
            .colour(this.players[1].colour)

        this.player2 = new GTE.UI.Widgets.ContentEditable(
                GTE.CONSTANTS.MATRIX_X , GTE.CONSTANTS.MATRIX_Y - 50,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                "II", "player 2")
            .colour(this.players[2].colour)

        for(var i=0; i<this.strategies[1].length; i++) {
            var string = "";
            for(var j = 0; j<this.strategies[1][i].moves.length;j++) {
                string+=this.strategies[1][i].moves[j].name
            }
            var thisMatrix=this;
            var str = new GTE.UI.Widgets.ContentEditable(
                GTE.CONSTANTS.MATRIX_X - 40,
                GTE.CONSTANTS.MATRIX_Y + 40 + i * GTE.CONSTANTS.MATRIX_SIZE,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                string, "player 2")
            .colour(this.players[1].colour)
            .index(i)
            .onSave( function() {
                    var text = this.getCleanedText();
                        if (text === "") {
                        window.alert("Strategy's name should not be empty.");
                        } else {
                    thisMatrix.strategies[1][this.index].moves[0].name=text;
                        }
                    }
                    );
        }

        for(var i=0; i<this.strategies[2].length; i++) {
            var string = "";
            for(var j = 0; j<this.strategies[2][i].moves.length;j++) {
                string+=this.strategies[2][i].moves[j].name
            }
            var thisMatrix=this;
            var str = new GTE.UI.Widgets.ContentEditable(
                GTE.CONSTANTS.MATRIX_X + 35 + i * GTE.CONSTANTS.MATRIX_SIZE,
                GTE.CONSTANTS.MATRIX_Y - 40 ,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                string, "player 2")
            .colour(this.players[2].colour)
            .index(i)
            .onSave( function() {
                    var text = this.getCleanedText();
                        if (text === "") {
                        window.alert("Strategy's name should not be empty.");
                        } else {
                    thisMatrix.strategies[2][this.index].moves[0].name=text;
                        }
                    }
                    );
        }
        while( GTE.canvas.viewbox().width - GTE.CONSTANTS.MATRIX_X < GTE.tree.matrix.strategies[2].length * GTE.CONSTANTS.MATRIX_SIZE
        ||  GTE.canvas.viewbox().height - GTE.CONSTANTS.MATRIX_Y < GTE.tree.matrix.strategies[1].length * GTE.CONSTANTS.MATRIX_SIZE) {
            GTE.tools.zoomOut();
        }
    };

    Matrix.prototype.createStrategiesPermutations = function(strategy, currentPermutations) {
        if(strategy==undefined || strategy.length ==0) {
            return currentPermutations;
        }
        else {
            var permutations = [];
            if(currentPermutations.length == 0) {
                for(var i=0;i<strategy.length;i++) {
                    var perm = [];
                    perm.push(strategy[i]);
                    permutations.push(perm);
                }
            }
            else {
                for(var i=0;i<strategy.length;i++) {
                    for(var j = 0; j<currentPermutations.length ; j++) {
                        var perm = currentPermutations[j].slice(0);
                        perm.push(strategy[i]);
                        permutations.push(perm);
                    }
                }
            }
            return permutations;
        }
    };

    Matrix.prototype.createStrategies = function() {
        var strategies = this.strategies;
        if(strategies == undefined || strategies.length == 0) {
            return [];
        } else {
            var str = [];
            for(var i  = 0;i<strategies.length;i++) {
                str = this.createStrategiesPermutations(strategies[i], str);
            }
            return str;
        }
    };

    Matrix.prototype.getAllStrategies = function() {
        var st = [];
        for(var i = 0; i<this.strategies.length; i++) {
            st.push(this.strategies[i]);
        }
        return st;
    };

    Matrix.prototype.getAllPlayers = function() {
        var pl = [];
        for(var i = 0; i<this.players.length; i++) {
            pl.push(this.players[i]);
        }
        return pl;
    };

    Matrix.prototype.strategiesToString = function() {
        for(var i = 0;i<this.strategies.length;i++) {
            for(var j=0;j<this.strategies[i].length;j++) {
                var str = "";
                for (var k = 0;k<this.strategies[i][j].length;k++) {
                    str = str + this.strategies[i][j][k].name;
                }
            }
        }
    };

    Matrix.prototype.getMatrixInStringFormat = function(playerIn) {
        var str = "";
        for(var i=0; i<this.strategies[1].length; i++) {
            for(var j=0; j<this.strategies[2].length; j++) {
                str += this.matrix[i*this.strategies[2].length+j].strategy.payoffs[playerIn].value;
                str +=" ";
            }
            str+="\n";
        }
        return str;
    };

    Matrix.prototype.setMatrixFromStringFormat = function(playerIn, matrixToSet) {
        matrixToSet = matrixToSet.trim();
        matrixToSet = matrixToSet.split("\n");
        for(var i=0; i<this.strategies[1].length; i++) {
            matrixToSet[i] = matrixToSet[i].trim();
            matrixToSet[i] = matrixToSet[i].split(" ");
            for(var j=0; j<this.strategies[2].length; j++) {
                this.matrix[i*this.strategies[2].length+j].strategy.payoffs[playerIn].value = parseInt(matrixToSet[i][j]);
                this.matrix[i*this.strategies[2].length+j].strategy.payoffs[playerIn].text = (matrixToSet[i][j]);
            }
        }
    };

    Matrix.prototype.getNumberOfStrategies = function(player) {
        var index = this.players.indexOf(player);
        if(index != -1) {
            return this.strategies[index].length;
        }
    };
    // Add class to parent module
    parentModule.Matrix = Matrix;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
