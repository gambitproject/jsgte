GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Node.
    * @class
    * @param {Node} [parent] Parent node. If null, this is root.
    */
    function Node(parent, player) {
        this.player = player;
        this.parent = parent;
        this.children = [];

        this.reachedBy = null;
        if (parent === null) { // If this is root set level to 0
            this.level = 0;
        } else {
            this.reachedBy = parent.addChild(this);
            this.level = parent.level + 1;
        }

        this.y = this.level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
    }

    /**
    * ToString function
    */
    Node.prototype.toString = function nodeToString() {
        return "Node: " + "children.length: " + this.children.length + "; level: " + this.level + "; move: " + this.reachedBy;
    };

    /**
    * Function that draws the node in the global canvas
    */
    Node.prototype.draw = function () {
        // The line has to be drawn before so that the circle is drawn on top of it
        if (this.reachedBy !== null) {
            this.reachedBy.draw();
        }
        var thisNode = this;
        var circle = GTE.canvas.circle(GTE.CONSTANTS.CIRCLE_SIZE)
            .addClass('node')
            .x(this.x)
            .y(this.y)
            .click(function() {
                thisNode.onClick();
            });
        if (this.player) {
            circle.fill(this.player.colour);
            GTE.canvas.plain(this.player.name)
                .x(this.x + GTE.CONSTANTS.TEXT_NODE_MARGIN)
                .y(this.y)
                .fill(this.player.colour);
        } else {
            circle.fill(GTE.COLOURS.BLACK);
        }
    };

    /**
    * Function that defines the behaviour of the node on click
    */
    Node.prototype.onClick = function () {
        switch (GTE.MODE) {
            case GTE.MODES.ADD:
                if (this.isLeaf()) {
                    // Always start with two nodes
                    GTE.tree.addChildNodeTo(this);
                }
                GTE.tree.addChildNodeTo(this);
                // Tell the tree to redraw itself
                GTE.tree.draw();
                break;
            case GTE.MODES.DELETE:
                // If it is a leaf, delete itself, if not, delete all children
                if (this.isLeaf()) {
                    this.delete();
                } else {
                    GTE.tree.deleteChildrenOf(this);
                }
                GTE.tree.draw();
                break;
            case GTE.MODES.PLAYERS:
                GTE.tree.assignSelectedPlayerToNode(this);
                GTE.tree.draw();
                break;
            default:
                break;
        }
    };


    /**
    * Function that adds child to node
    * @param {Node} node Node to add as child
    * @return {Move} The move that has been created for this child
    */
    Node.prototype.addChild = function (node) {
        this.children.push(node);
        return new GTE.TREE.Move(this, node);
    };

    /**
    * Function that removes child node from children
    * @param {Node} node Child node to remove
    */
    Node.prototype.removeChild = function (nodeToDelete) {
        var indexInList = this.children.indexOf(nodeToDelete);
        if (indexInList > -1) {
            this.children.splice(indexInList, 1);
        }
    };

    /**
    * Function that finds out if node is leaf
    * @return {Boolean} True if is leaf.
    */
    Node.prototype.isLeaf = function () {
        if (this.children.length === 0) {
            return true;
        }
        return false;
    };

    /**
    * Function that changes node's parent to a given one
    * @param {Node} newParent New parent for node
    */
    Node.prototype.changeParent = function (newParent) {
        if (this.parent !== null) {
            this.parent.removeChild(this);
        }
        this.parent = newParent;
        if (this.parent !== null) {
            this.parent.addChild(this);
        }
    };

    /**
    * Function that tells node to delete himself
    */
    Node.prototype.delete = function () {
        this.changeParent(null);
        GTE.tree.positionsUpdated = false;
    };

    Node.prototype.assignPlayer = function (player) {
        this.player = player;
    };

    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
