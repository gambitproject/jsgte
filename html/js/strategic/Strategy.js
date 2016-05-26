GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function Strategy(strategicUnits) {
        this.strategicUnits = strategicUnits;  // array of strategic units of players present in this strategy
        this.payoffs = [];
    }

    Strategy.prototype.findPayoff = function(node) {
        if(node.isLeaf()) {
            for(var i = 0; i<node.iset.payoffs.length; i++) {
                this.payoffs.push(node.iset.payoffs[i]);
            }
        }
        var index = this.findStrategyUnitIndexOfPlayer(node.player);
        for(var i = 0; i<node.iset.moves.length; i++) {
            if(this.strategicUnits[index].moves.indexOf(node.iset.moves[i]) != -1) {
                //this move is present in the strategy
                this.findPayoff(node.children[i]);
                return ;
            }
        }
    };

    Strategy.prototype.findStrategyUnitIndexOfPlayer = function(player) {
        for(var i=0;i<this.strategicUnits.length;i++) {
            if(this.strategicUnits[i].player == player) {
                return i;
            }
        }
    };


    // Add class to parent module
    parentModule.Strategy = Strategy;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
