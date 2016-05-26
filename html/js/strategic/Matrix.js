GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
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
            var currentStrategyBlock = new GTE.TREE.StrategyBlock(strMatrix[i] , i+1);
            currentStrategyBlock.assignPayoffs();
            currentStrategyBlock.draw();
            this.matrix.push(currentStrategyBlock);
        }
    //    this.createStrategies(this.getAllStrategies());
    /*    for(var i=0;i<this.strategies[1].length;i++) {
            this.matrix[i] = [];
            for(var j=0;j<this.strategies[2].length;j++) {
                var currentStrategies = this.getAllStrategies();
                this.matrix[i][j] = new GTE.TREE.StrategyBlock(i, j,[this.strategies[1][i], this.strategies[2][j]]);
                this.matrix[i][j].assignPayoffs();
                this.matrix[i][j].draw();
            }
        }
    */
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
                console.log(str);
            }
        }
    };

    // Add class to parent module
    parentModule.Matrix = Matrix;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
