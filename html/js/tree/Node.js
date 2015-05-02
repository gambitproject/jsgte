GAMBIT.TREE = (function (parentModule) {
    "use strict";

    // Node constructor
    function Node(father) {
        this.father = father;
        this.children = [];
        this.x = 0;
        
        if (father === null) { // If this is root set level to 0
            this.level = 0;
        } else {
            father.addChild(this);
            this.level = father.level + 1;
        }
        this.y = this.level * 50;
    }

    // Function that draws the node in the global canvas
    Node.prototype.draw = function () {
        var thisNode = this;
        GAMBIT.canvas.circle(GAMBIT.CONSTANTS.CIRCLE_SIZE)
            .y(this.y)
            .x(this.x)
            .mouseover(function() {
                this.fill({ color: '#f06' });
            })
            .mouseout(function() {
                this.fill({ color: '#000' });
            })
            .click(function() {
                GAMBIT.tree.addChildNodeTo(thisNode);
            });
        console.log("Drawing at y " + this.level*50 + " and x " + this.x);
    };

    // Function that adds child to node
    Node.prototype.addChild = function (node) {
        this.children.push(node);
    };

    Node.prototype.isLeaf = function () {
        if (this.children.length === 0) {
            return true;
        }
        return false;
    };
    
    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module