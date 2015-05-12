GAMBIT.TREE = (function (parentModule) {
    "use strict";

    // Node constructor
    function Node(father) {
        this.father = father;
        this.children = [];

        if (father === null) { // If this is root set level to 0
            this.level = 0;
        } else {
            father.addChild(this);
            this.level = father.level + 1;
        }
    }

    // Function that draws the node in the global canvas
    Node.prototype.draw = function () {
        var thisNode = this;
        var circle = GAMBIT.canvas.circle(GAMBIT.CONSTANTS.CIRCLE_SIZE)
            .y(this.y)
            .x(this.x)
            .mouseover(function() {
                this.fill({ color: '#f06' });
            })
            .mouseout(function() {
                this.fill({ color: '#000' });
            })
            .click(function() {
                if (GAMBIT.MODE_ADD){
                    if (thisNode.children.length === 0) {
                        // Always start with two nodes
                        GAMBIT.tree.addChildNodeTo(thisNode);
                    }
                    GAMBIT.tree.addChildNodeTo(thisNode);
                    // Tell the tree to redraw itself
                } else {
                    GAMBIT.tree.deleteNode(thisNode);
                }
                GAMBIT.tree.draw();
            });
        console.log("Drawing at y " + this.level*50 + " and x " + this.x);
    };

    // Function that adds child to node
    Node.prototype.addChild = function (node) {
        this.children.push(node);
    };

    Node.prototype.deleteChild = function (nodeToDelete) {
        var indexInList = this.children.indexOf(nodeToDelete);
		if (indexInList > -1) {
			this.children.splice(indexInList, 1);
		}
    };

    Node.prototype.isLeaf = function () {
        if (this.children.length === 0) {
            return true;
        }
        return false;
    };

    Node.prototype.changeFather = function (newFather) {
        this.father = newFather;
        this.father.addChild(this);
    };

    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module
