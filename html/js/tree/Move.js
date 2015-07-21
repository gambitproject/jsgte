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

    Move.prototype.compare = function (a,b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    };

    Move.prototype.draw = function(parent, child) {
        var circleRadius = GTE.CONSTANTS.CIRCLE_SIZE/2;
        this.line = GTE.canvas.line(parent.x + circleRadius,
                                    parent.y + circleRadius,
                                    child.x + circleRadius,
                                    child.y + circleRadius)
                  .stroke({ width: GTE.CONSTANTS.LINE_THICKNESS });
        var middleX = ((child.x + circleRadius) - (parent.x + circleRadius))/2+(parent.x + circleRadius);
        var middleY = ((child.y + circleRadius) - (parent.y + circleRadius))/2+(parent.y + circleRadius);
        // TODO: create variables for growing left and right
        var growingDirectionOfText = 1;
        if (child.x < parent.x ) {
            growingDirectionOfText = -1;
        }
        var contentEditable = new GTE.UI.Widgets.ContentEditable(middleX, middleY, growingDirectionOfText, this.name);
    };

    // Add class to parent module
    parentModule.Move = Move;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
