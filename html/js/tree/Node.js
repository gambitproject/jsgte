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

        if (parent === null) { // If this is root set level to 0
            this.level = 0;
        } else {
            parent.addChild(this);
            this.level = parent.level + 1;
        }
    }

    /**
    * Function that draws the node in the global canvas
    */
    Node.prototype.draw = function () {
        var thisNode = this;
        var circle = GAMBIT.canvas.circle(GAMBIT.CONSTANTS.CIRCLE_SIZE)
            .addClass('node')
            .x(this.x)
            .y(this.y)
            .click(function() {
                if (GAMBIT.MODE === GAMBIT.MODES.ADD){
                    if (thisNode.children.length === 0) {
                        // Always start with two nodes
                        GAMBIT.tree.addChildNodeTo(thisNode);
                    }
                    GAMBIT.tree.addChildNodeTo(thisNode);
                } else {
                    GAMBIT.tree.deleteNode(thisNode);
                }
                // Tell the tree to redraw itself
                GAMBIT.tree.draw();
            });
        // console.log("Drawing at y " + this.level*50 + " and x " + this.x);
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
        this.parent = newParent;
        this.parent.addChild(this);
    };

    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module
