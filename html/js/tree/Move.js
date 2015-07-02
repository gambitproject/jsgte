GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Move.
    * @class
    * @param {ISet} parent Parent ISet origin of the move.
    * @param {ISet} child Child ISet destination of the move.
    */
    function Move (parent, child) {
        this.parent = parent;
        this.child = child;
        this.line = {};
    }

    /**
    * ToString function
    */
    Move.prototype.toString = function () {
        return "Move: " + "parent: " + this.parent + "; child: " + this.child;
    };

    /**
    * Draws the move (a line) in the canvas
    */
    Move.prototype.draw = function() {
        var circleRadius = GTE.CONSTANTS.CIRCLE_SIZE/2;
        this.line = GTE.canvas.line(this.parent.node.x + circleRadius, this.parent.node.y + circleRadius, this.child.node.x + circleRadius, this.child.node.y +circleRadius)
                  .stroke({ width: GTE.CONSTANTS.LINE_THICKNESS });
    };

    // Add class to parent module
    parentModule.Move = Move;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module