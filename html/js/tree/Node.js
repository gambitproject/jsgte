GAMBIT.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Node.
    * @class
    * @param {Node} [parent] Parent node. If null, this is root.
    */
    function Node(parent) {
        this.parent = parent;
        this.children = [];
        this.circle = null;
        this.lineToParent = null;

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
        if (this.circle === null) {
            this.circle = GAMBIT.canvas.circle(GAMBIT.CONSTANTS.CIRCLE_SIZE)
                .addClass('node')
                .x(this.x)
                .y(this.y)
                .click(function() {
                    thisNode.onClick();
                });
        } else {
            this.circle.animate().move(this.x, this.y);
        }
        // console.log("Drawing at y " + this.level*50 + " and x " + this.x);
    };


    /**
    * Function that defines the behaviour of the node on click
    */
    Node.prototype.onClick = function () {
        if (GAMBIT.MODE === GAMBIT.MODES.ADD){
            if (this.children.length === 0) {
                // Always start with two nodes
                GAMBIT.tree.addChildNodeTo(this);
            }
            GAMBIT.tree.addChildNodeTo(this);
        } else {
            GAMBIT.tree.deleteNode(this);
        }
        // Tell the tree to redraw itself
        GAMBIT.tree.draw();
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
    Node.prototype.deleteChild = function (nodeToDelete) {
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
        console.log('changing parent to ' + newParent);
        if (this.parent !== null) {
            this.parent.deleteChild(this);
        }
        this.parent = newParent;
        if (this.parent !== null) {
            this.parent.addChild(this);
        }
    };

    /**
    * Function that tells node to delete himself
    * @param {Node} newParent New parent for node
    */
    Node.prototype.delete = function () {
        this.changeParent(null);
    };

    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module
