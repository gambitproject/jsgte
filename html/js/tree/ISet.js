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

    /**
    * ToString function
    */
    ISet.prototype.toString = function () {
        return "ISet: " + "moves: " + this.moves;
    };

    /**
    * Returns the number of moves that belong to current information set
    * @return {Number} numberOfMoves Number of moves that belong to this
    */
    ISet.prototype.numberOfMoves = function () {
        return this.moves.length;
    };

    /**
    * Adds a new move to current information set
    * @return {Move} newMove Move that has been created
    */
    ISet.prototype.addNewMove = function () {
        // Create a new move and add to the list of moves
        var newMove = new GTE.TREE.Move(GTE.tree.getNextMoveName(), this);
        this.moves.push(newMove);
        return newMove;
    };

    /**
    * Adds a given node to current information set
    * @param {Node} node Node that will be added to current information set
    */
    ISet.prototype.addNode = function (node) {
        node.iset = this;
        this.numberOfNodes++;
        this.lastNode = node;
    };

    /**
    * Adds a newly created child iset as children for current information set
    * nodes
    * @param {ISet} childISet New information set that current information set
    *                         will be connected to through moves
    * @param {Array} nodesInThis Array that contains the nodes that belong to
    *                            this iset
    */
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

    /**
    * Draws the information set
    */
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
    };

    /**
    * Updates the first and last node of the iset
    */
    ISet.prototype.updateFirstAndLast = function () {
        var nodesInIset = GTE.tree.getNodesThatBelongTo(this);

        // Update first and last one
        this.firstNode = nodesInIset[0];
        this.lastNode = nodesInIset[nodesInIset.length-1];
        GTE.tree.positionsUpdated = false;
    };

    /**
    * Removes the node from the iset
    * @param {Node} node Node that will be removed
    */
    ISet.prototype.removeNode = function (node) {
        this.numberOfNodes--;
        node.iset = null;
        this.updateFirstAndLast();
    };
    /**
    * On click function for the information set
    */
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
