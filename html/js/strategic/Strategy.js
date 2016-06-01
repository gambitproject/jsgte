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

    Strategy.prototype.assignPartner = function(x, y) {
        switch (GTE.STRATEGICFORMMODE) {
            case GTE.STRATEGICFORMMODES.TREE:
                break;
            case GTE.STRATEGICFORMMODES.GENERAL:
                break;
            case GTE.STRATEGICFORMMODES.ZEROSUM:
                this.payoffs[0].partner = this.payoffs[1];
                this.payoffs[1].partner = this.payoffs[0];
                break;
            case GTE.STRATEGICFORMMODES.SYMMETRIC:
                this.payoffs[0].partner = GTE.tree.matrix.matrix[x*(GTE.tree.matrix.strategies[2].length)+y].strategy.payoffs[1];
                this.payoffs[1].partner = GTE.tree.matrix.matrix[x*(GTE.tree.matrix.strategies[2].length)+y].strategy.payoffs[0];
                break;
            default:
                break;
        }

    };


    // Add class to parent module
    parentModule.Strategy = Strategy;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
