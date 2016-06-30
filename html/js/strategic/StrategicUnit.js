GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
     
    function StrategicUnit(player) {
        this.player = player
        this.moves = [];
    }

    StrategicUnit.prototype.assignMoves = function(moves) {
        this.moves = [];
        for(var i=0;i<moves.length;i++)
            this.addMove(moves[i]);
    };

    StrategicUnit.prototype.addMove = function(move) {
        this.moves.push(move);
    };

    // Add class to parent module
    parentModule.StrategicUnit = StrategicUnit;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
