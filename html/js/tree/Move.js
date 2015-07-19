GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Move.
    * @class
    * @param {ISet} atISet Parent information set where this move emanates from.
    */
    function Move (name, atISet) {
        this.name = name;
        this.atISet = atISet;
        this.line = {};
    }

    /**
    * ToString function
    */
    Move.prototype.toString = function () {
        return "Move: " + "name: " + this.name;
    };

    Move.prototype.draw = function(parent, child) {
        var circleRadius = GTE.CONSTANTS.CIRCLE_SIZE/2;
        this.line = GTE.canvas.line(parent.x + circleRadius,
                                    parent.y + circleRadius,
                                    child.x + circleRadius,
                                    child.y + circleRadius)
                  .stroke({ width: GTE.CONSTANTS.LINE_THICKNESS });
    };

    // Add class to parent module
    parentModule.Move = Move;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
