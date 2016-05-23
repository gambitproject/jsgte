GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function Matrix() {
        this.players = [];
        
    }

    Matrix.prototype.assignPlayers = function(players) {
        this.players = players;
    };

    Matrix.prototype.addPlayer = function(player) {
        if(this.players.indexOf(player) == -1)
            this.players.push(player);
    };


    // Add class to parent module
    parentModule.Matrix = Matrix;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
