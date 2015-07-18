GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Move.
    * @class
    * @param {ISet} atISet Parent information set where this move emanates from.
    */
    function Move (atISet) {
        this.atISet = atISet;
        // this.line = {};
    }

    /**
    * ToString function
    */
    Move.prototype.toString = function () {
        return "Move: " + "atISet: " + this.atISet;
    };

    // Move.prototype.draw = function() {
    //     var circleRadius = GTE.CONSTANTS.CIRCLE_SIZE/2;
    //     this.line = GTE.canvas.line(this.atISet.x + circleRadius, this.atISet.y + circleRadius, this.child.x + circleRadius, this.child.y +circleRadius)
    //               .stroke({ width: GTE.CONSTANTS.LINE_THICKNESS });
    // };

    // Add class to parent module
    parentModule.Move = Move;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
