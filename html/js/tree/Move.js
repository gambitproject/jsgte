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

    /**
    * Public static function that compares Moves. It is designed to be called as
    * a param for a sort function
    * @param {Move} a Move A that will be compared
    * @param {Move} b Move B that will be compared
    */
    Move.compare = function (a,b) {
        if (a.name.length !== b.name.length) {
            if (a.name.length < b.name.length)
                return -1;
            if (a.name.length > b.name.length)
                return 1;
        } else {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
        }
        return 0;
    };

    /**
    * Public static function that increments a given name
    * @param {String} str A Move name that will be incremented
    */
    Move.generateName = function (str) {
        for (var i = str.length-1; i >= 0 ; i--) {
            var nextChar = String.fromCharCode(str.charCodeAt(i) + 1);
            if (nextChar === "[") {
                nextChar = "A";
                str = str.substr(0, i) + nextChar + str.substr(i+1, str.length);
                if (i === 0) {
                    str = "A" + str;
                }
            } else {
                str = str.substr(0, i) + nextChar + str.substr(i+1, str.length);
                break;
            }
        }
        return str;
    };

    /**
    * Draws the line and creates a editable label
    * @param {Node} parent Parent node
    * @param {Node} child Child node
    */
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
