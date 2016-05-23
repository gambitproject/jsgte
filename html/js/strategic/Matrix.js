GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function Matrix() {
        this.players = [];
        this.nodes = []; // multidimensional array containing corresponding nodes of players
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
        if(this.players.indexOf(player) == -1)
            return []
        else
            return this.nodes[this.players.indexOf(player)];
    };

    Matrix.prototype.initialise = function() {
        this.assignPlayers(GTE.tree.players);
        this.assignNodes(GTE.tree.root);

    };


    // Add class to parent module
    parentModule.Matrix = Matrix;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
