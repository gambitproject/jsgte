GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Matrix Class.
     * @class
     */
    function Matrix() {
        this.players = [];
        this.isets = []; // multidimensional array containing corresponding isets of players
        this.strategies = []; // a multidimensional array containing strategicUnit objects
        this.matrix = [];
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
        // diagonal corner line outwards
        GTE.canvas.line(GTE.CONSTANTS.MATRIX_X,
                GTE.CONSTANTS.MATRIX_Y,
                GTE.CONSTANTS.MATRIX_X-50,
                GTE.CONSTANTS.MATRIX_Y-50)
            //.stroke({ width: parseInt(GTE.STORAGE.settingsLineThickness) });
            // need own linethickness for matrix, for
            // now same as linethickness for boxes
            .stroke({ width: 2 });

        // testing reference points for ContentEditable
        // with a 30px long line going outwards
        // player 1, horizontal left
        // GTE.canvas.line(GTE.CONSTANTS.MATRIX_X-40,
        //     GTE.CONSTANTS.MATRIX_Y-20,
        //     GTE.CONSTANTS.MATRIX_X -70,
        //     GTE.CONSTANTS.MATRIX_Y-20)
        //     .stroke({ width: 8 }) ;
        // // player 2, vertical down - testing 22 px
        // GTE.canvas.line(GTE.CONSTANTS.MATRIX_X-20,
        //     GTE.CONSTANTS.MATRIX_Y-62,
        //     GTE.CONSTANTS.MATRIX_X-20,
        //     GTE.CONSTANTS.MATRIX_Y -40)
        //     .stroke({ width: 8 }) ;
        // // player 2, vertical down - testing overlap
        // GTE.canvas.line(GTE.CONSTANTS.MATRIX_X-10,
        //     GTE.CONSTANTS.MATRIX_Y-62,
        //     GTE.CONSTANTS.MATRIX_X-10,
        //     GTE.CONSTANTS.MATRIX_Y -40)
        //     .stroke({ width: 1 }) ;
        // // player 2, vertical down - testing overlap
        // GTE.canvas.line(GTE.CONSTANTS.MATRIX_X-0,
        //     GTE.CONSTANTS.MATRIX_Y-62,
        //     GTE.CONSTANTS.MATRIX_X-0,
        //     GTE.CONSTANTS.MATRIX_Y -40)
        //     .stroke({ width: 1 }) ;

        this.player1 = new GTE.UI.Widgets.ContentEditable(
                // 6+4 is the magic text offset in the box in
                // guiutils/ContentEditable.js
                GTE.CONSTANTS.MATRIX_X - 40 + 6,
                GTE.CONSTANTS.MATRIX_Y - 20,
                // GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT,
                this.players[1].name, "player 1")
            .colour(this.players[1].colour)
            .onSave(function () {
                    // Removes all blankspaces. Substitutes &nbsp; characters
                    // with spaces and then trims the text so that there are no
                    // spaces both at the begin and end of the text
                   // console.log(GTE.tree)
                    var text = this.getCleanedText();
                    //console.log(text);
                    if (text === "") {
                    window.alert("Player name should not be empty.");
                    } else {
                    GTE.tree.matrix.players[1].changeName(text);
                    }
                    // Redraw all content editables that represent this Player
                    // across the tree
                    GTE.tree.updatePlayerNames(GTE.tree.matrix.players[1]);
                    });

        this.player2 = new GTE.UI.Widgets.ContentEditable(
                // 6+4 is the magic text offset in the box in
                // guiutils/ContentEditable.js
                GTE.CONSTANTS.MATRIX_X - 20 - 6,
                // 22 is the magic text height in
                // guiutils/ContentEditable.js
                GTE.CONSTANTS.MATRIX_Y - 40 - 22,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                this.players[2].name, "player 2")
            .colour(this.players[2].colour)
            .onSave(function () {
                    // Removes all blankspaces. Substitutes &nbsp; characters
                    // with spaces and then trims the text so that there are no
                    // spaces both at the begin and end of the text
                    var text = this.getCleanedText();
                    //console.log(text);
                    if (text === "") {
                    window.alert("Player name should not be empty.");
                    } else {
                    GTE.tree.matrix.players[2].changeName(text);
                    }
                    
                    //console.log(text);
                    // Redraw all content editables that represent this Player
                    // across the tree
                    GTE.tree.updatePlayerNames(GTE.tree.matrix.players[2]);
                    });

        for(var i=0; i<this.strategies[1].length; i++) {
            var string = "";
            for(var j = 0; j<this.strategies[1][i].moves.length;j++) {
                string+=this.strategies[1][i].moves[j].name
            }
            var thisMatrix=this;
            var str = new GTE.UI.Widgets.ContentEditable(
                GTE.CONSTANTS.MATRIX_X - 14,
                GTE.CONSTANTS.MATRIX_Y + 36 + i * GTE.CONSTANTS.MATRIX_SIZE,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT,
                string, "player 1")
            .colour(this.players[1].colour)
            .index(i)
            .onSave( function() {
                    var text = this.getCleanedText();
                    thisMatrix.strategies[1][this.index].moves[0].name=text;
                    GTE.diag.redraw();}
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
                    thisMatrix.strategies[2][this.index].moves[0].name=text;
                    GTE.diag.redraw();
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
