GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function Strategy(players, moves) {
        this.players = players;
        this.moves = moves;
        this.payoffs = [];
    }

    Strategy.prototype.setMoves = function(moves) {
        this.moves = moves;
    };

    Strategy.prototype.setPlayers = function(players) {
        this.players = players;
    };

    Strategy.prototype.toString = function(players) {
        var str = "";
        for(var i=0; i<this.moves[0].length;i++)
            str += this.moves[0][i].name;
        console.log(str);
        var str = "";
        for(var i=0; i<this.moves[1].length;i++)
            str += this.moves[1][i].name;
        console.log(str);
    };

    Strategy.prototype.findPayoff = function(node) {
        if(node.isLeaf()) {
            this.payoffs.push(node.iset.payoffs[0]);
            this.payoffs.push(node.iset.payoffs[1]);
        }
        var index = this.players.indexOf(node.player);
        for(var i = 0; i<node.iset.moves.length; i++) {
            if(this.moves[index].indexOf(node.iset.moves[i]) != -1) {
                //this move is present in the strategy
                this.findPayoff(node.children[i]);
                return ;
            }
        }
    };

    // Add class to parent module
    parentModule.Strategy = Strategy;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
