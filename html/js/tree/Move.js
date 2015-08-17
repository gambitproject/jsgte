GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Move.
    * @class
    * @param {Node} parent Parent node origin of the move.
    * @param {Node} child Child node destination of the move.
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
    * Drawing function
    */
    Move.prototype.draw = function() {
        var circleRadius = GTE.CONSTANTS.CIRCLE_SIZE/2;
        this.line = GTE.canvas.line(this.parent.x + circleRadius, this.parent.y + circleRadius, this.child.x + circleRadius, this.child.y +circleRadius)
                  .stroke({ width: GTE.CONSTANTS.LINE_THICKNESS });
    };

    // Add class to parent module
    parentModule.Move = Move;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
