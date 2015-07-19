GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new information set.
    * @class
    * @param {Number} numberOfNodes Number of nodes in this information set
    */
    function ISet(name) {
        this.name = name;
        this.moves = [];
        this.shape = {};
        this.firstNode = null;
        this.lastNode = null;
    }

    ISet.prototype.toString = function () {
        return "ISet: " + "name: " + this.name;
    };

    ISet.prototype.numberOfMoves = function () {
        return this.moves.length;
    };

    ISet.prototype.addChildISet = function (childISet, nodesInThis) {
        // Create two new moves
        var newMove = new GTE.TREE.Move(this);
        this.moves.push(newMove);
        newMove = new GTE.TREE.Move(this);
        this.moves.push(newMove);
        console.log("nodesInThis " + nodesInThis.length);
        // Add one node per move per node in set
        for (var i = 0; i < nodesInThis.length; i++) {
            for (var j = 0; j < this.numberOfMoves(); j++) {
                console.log("i " + i);
                console.log("j " + j);

                var node = new GTE.TREE.Node(nodesInThis[i], this.moves[j], childISet);
                console.log("Node " + node);
                // If first node
                if (i === 0 && j === 0) {
                    childISet.firstNode = node;
                }
                // If last node
                if (i === nodesInThis.length-1 && j === this.numberOfMoves()-1) {
                    childISet.lastNode = node;
                }
            }
        }
    };

    ISet.prototype.draw = function () {
        console.log(this);
        if (this.lastNode) {
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


    ISet.prototype.onClick = function () {
        if (GTE.MODE === GTE.MODES.ADD){
            if (this.numberOfMoves() === 0) {
                GTE.tree.addChildISetTo(this);
            } else {
                // GTE.tree.addChildNodeTo(this);
            }
        } else {
            // If it is a leaf, delete itself, if not, delete all children
            if (this.numberOfMoves() === 0) {
                this.delete();
            } else {
                GTE.tree.deleteChildrenOf(this);
            }
        }
        // Tell the tree to redraw itself
        GTE.tree.draw();
    };

    // Add class to parent module
    parentModule.ISet = ISet;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
