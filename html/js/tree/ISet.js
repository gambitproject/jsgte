GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new information set.
    * @class
    * @param {Number} numberOfNodes Number of nodes in this information set
    */
    function ISet() {
        this.moves = [];
        this.shape = {};
        this.firstNode = null;
        this.lastNode = null;
        this.numberOfNodes = 0;
    }

    ISet.prototype.toString = function () {
        return "ISet: " + "moves: " + this.moves;
    };

    ISet.prototype.numberOfMoves = function () {
        return this.moves.length;
    };

    ISet.prototype.addNewMove = function () {
        console.log("addNewMove");
        var newMove = new GTE.TREE.Move(GTE.tree.getNextMoveName(), this);
        this.moves.push(newMove);
        return newMove;
    };

    ISet.prototype.addChildISet = function (childISet, nodesInThis) {
        // Create two new moves
        this.addNewMove();
        this.addNewMove();

        // Add one node per move per node in set
        for (var i = 0; i < nodesInThis.length; i++) {
            for (var j = 0; j < this.numberOfMoves(); j++) {
                GTE.tree.addNewNode(nodesInThis[i], this.moves[j], childISet);
            }
        }
    };

    ISet.prototype.draw = function () {
        if (this.lastNode !== this.firstNode) {
            var width = (this.lastNode.x + GTE.CONSTANTS.CIRCLE_SIZE*2) -
                        (this.firstNode.x-GTE.CONSTANTS.CIRCLE_SIZE);

            this.shape = GTE.canvas.rect(width, 50)
                                    .stroke({ color: '#000', width: 2 })
                                    .radius(10)
                                    .addClass('iset');
            this.shape.translate(this.firstNode.x - GTE.CONSTANTS.CIRCLE_SIZE,
                                this.firstNode.y - GTE.CONSTANTS.CIRCLE_SIZE + 4);
            var thisISet = this;
            this.shape.click(function() {
                thisISet.onClick();
            });
        }
        this.updateNumberOfNodes();
    };

    ISet.prototype.updateNumberOfNodes = function () {
        return GTE.tree.getNodesThatBelongTo(this).length;
    };

    ISet.prototype.onClick = function () {
        if (GTE.MODE === GTE.MODES.ADD){
            if (this.numberOfMoves() === 0) {
                GTE.tree.addChildISetTo(this);
            } else {
                // Get children nodes
                var children = GTE.tree.getChildrenNodes(this);
                // Check number of different isets in children
                var childrenIsets = [];
                for (var i = 0; i < children.length; i++) {
                    if (childrenIsets.indexOf(children[i].iset) === -1) {
                        childrenIsets.push(children[i].iset);
                    }
                }
                // If there is more than one children iset or there is only one,
                // but it already has moves, add children nodes as single node
                // isets
                if (childrenIsets.length > 1 || childrenIsets[0].moves.length > 0) {
                    console.log("Add new child iset");
                    // Add new isets as singletons by not specifying an iset
                    GTE.tree.addNodesToChildISet(this);
                } else {
                    console.log("Add to child iset");
                    // If there is a single child iset and it has no moves
                    // Add new nodes to child iset
                    GTE.tree.addNodesToChildISet(this, childrenIsets[0]);
                }
            }
        }
        // Tell the tree to redraw itself
        GTE.tree.draw();
    };

    // Add class to parent module
    parentModule.ISet = ISet;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
