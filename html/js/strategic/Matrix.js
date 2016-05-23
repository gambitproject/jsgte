GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function Matrix() {
        this.players = [];
        this.nodes = []; // multidimensional array containing corresponding nodes of players
        this.strategies = [];
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

    Matrix.prototype.assignNodes = function(node) {
        var playerIndex = this.players.indexOf(node.player);
        if(playerIndex == -1)
            alert("player not present in player array.")
        else {
            if(this.nodes[playerIndex] == undefined)
                this.nodes[playerIndex] = [];
            this.nodes[playerIndex].push(node);
            for(var i=0;i<node.children.length;i++) {
                if(!node.children[i].isLeaf())
                    this.assignNodes(node.children[i]);
            }
        }
    };

    Matrix.prototype.getNodes = function(player) {
        if(this.players.indexOf(player) == -1 || this.nodes[this.players.indexOf(player)] == undefined)
            return [];
        else {
            var playerNodes = [];
            for(var i=0;i<this.nodes[this.players.indexOf(player)].length;i++)
                playerNodes.push(this.nodes[this.players.indexOf(player)][i]);
            return playerNodes;
        }
    };

    Matrix.prototype.createMovePermutations = function(moves, currentPermutations) {
        if(moves==undefined || moves.length ==0) {
            return currentPermutations;
        }
        else {
            var permutations = [];
            if(currentPermutations.length == 0) {
                for(var i=0;i<moves.length;i++) {
                    var perm = [];
                    perm.push(moves[i]);
                    permutations.push(perm);
                }
            }
            else {
                for(var i=0;i<moves.length;i++) {
                    for(var j = 0; j<currentPermutations.length ; j++) {
                        var perm = currentPermutations[j].slice(0);
                        perm.push(moves[i]);
                        permutations.push(perm);
                    }
                }
            }
            return permutations;
        }
    };

    Matrix.prototype.createMoves = function(nodes) {
        if(nodes == undefined || nodes.length==0)
            return [];
        else {
            var permutations = [];
            for(var i=0;i<nodes.length;i++) {
                permutations = this.createMovePermutations(nodes[i].iset.moves, permutations)
            }
            return permutations;
        }
    };


    Matrix.prototype.initialise = function() {
        this.assignPlayers(GTE.tree.players);
        this.assignNodes(GTE.tree.root);
        for(var i=0; i<this.players.length; i++) {
            var currentStrategy = this.createMoves(this.getNodes(this.players[i]));
            this.strategies.push(currentStrategy);
        }
        for(var i=0;i<this.strategies[1].length;i++) {
            this.matrix[i] = [];
            for(var j=0;j<this.strategies[2].length;j++) {
                this.matrix[i][j] = new GTE.TREE.StrategyBlock(i, j, [this.players[1], this.players[2]], [this.strategies[1][i], this.strategies[2][j]]);
                this.matrix[i][j].assignPayoffs();
                this.matrix[i][j].draw();
            }
        }
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
