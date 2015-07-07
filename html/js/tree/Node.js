GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Node. A Node only represents the circle in the tree.
    * @class
    * @param {ISet} iSet iSet that contains the node. Needed for sending onClicks to it
    * @param {Number} level Level of the node
    */
    function Node(iSet, level) {
        this.iSet = iSet;
        this.level = level;
        this.y = this.level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
    }

    /**
    * ToString function
    */
    Node.prototype.toString = function () {
        return "Node: " + "iSet: " + this.iSet + "; level: " + this.level;
    };

    /**
    * Function that draws the node in the global canvas
    */
    Node.prototype.draw = function () {
        var thisNode = this;
        this.circle = GTE.canvas.circle(GTE.CONSTANTS.CIRCLE_SIZE)
            .addClass('node')
            .x(this.x)
            .y(this.y)
            .click(function() {
                thisNode.iSet.onClick();
            });
    };

    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
