GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new information set.
    * @class
    * @param {Number} numberOfNodes Number of nodes in this information set
    */
    function ISet() {
        this.name = "";
        this.moves = [];
    }

    ISet.prototype.numberOfMoves = function () {
        return this.moves.length;
    };

    ISet.prototype.addChildISet = function (childISet, nodesInThis) {
        // Create two new moves
        var newMove = new GTE.TREE.Move(this);
        this.moves.push(newMove);
        newMove = new GTE.TREE.Move(this);
        this.moves.push(newMove);
        // Add one node per move per node in set
        for (var i = 0; i < nodesInThis.length; i++) {
            for (var j = 0; j < this.numberOfMoves(); j++) {
                new GTE.TREE.Node(nodesInThis[i], this.moves[j], childISet);
            }
        }
    };

    // Add class to parent module
    parentModule.ISet = ISet;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
