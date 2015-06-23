GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Node.
    * @class
    * @param {Node} [parent] Parent node. If null, this is root.
    */
    function Node(parent) {
        this.parent = parent;
        this.children = [];

        if (parent === null) { // If this is root set level to 0
            this.level = 0;
        } else {
            parent.addChild(this);
            this.level = parent.level + 1;
        }
    }

    /**
    * ToString function
    */
    Node.prototype.toString = function nodeToString() {
        return "Node: " + "children.length: " + this.children.length + "; level: " + this.level;
    };

    /**
    * Function that draws the node in the global canvas
    */
    Node.prototype.draw = function () {
        var thisNode = this;
        var circle = GTE.canvas.circle(GTE.CONSTANTS.CIRCLE_SIZE)
            .addClass('node')
            .x(this.x)
            .y(this.y)
            .click(function() {
                thisNode.onClick();
            });
    };

    /**
    * Function that defines the behaviour of the node on click
    */
    Node.prototype.onClick = function () {
        if (GTE.MODE === GTE.MODES.ADD){
            if (this.children.length === 0) {
                // Always start with two nodes
                GTE.tree.addChildNodeTo(this);
            }
            GTE.tree.addChildNodeTo(this);
        } else {
            GTE.tree.deleteNode(this);
        }
        // Tell the tree to redraw itself
        GTE.tree.draw();
    };


    /**
    * Function that adds child to node
    * @param {Node} node Node to add as child
    */
    Node.prototype.addChild = function (node) {
        this.children.push(node);
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
    };

    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
