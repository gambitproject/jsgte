GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new pure Strategy.
     * @class
     */
     
    function PureStrategy(player, name) {
        this.player = player
        this.name = name;
    }

//    pureStrategy.prototype.assignMoves = function(moves) {
//        this.moves = [];
//        for(var i=0;i<moves.length;i++)
//            this.addMove(moves[i]);
//    };
//
//    pureStrategy.prototype.addMove = function(move) {
//        this.moves.push(move);
//    };

    // Add class to parent module
    parentModule.PureStrategy = PureStrategy;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
