GAMBIT.TREE = (function (parentModule) {
    "use strict";

    // Node constructor
    function Node(father, value) {
        this.value = value;
        this.father = father;
        this.children = [];
        this.x = 0;
        
        if (father === null) { // If this is root set level to 0
            this.level = 0;
        } else {
            father.addChild(this);
            this.level = father.level + 1;
        }
    }

    // Function that draws the node in the global canvas
    Node.prototype.draw = function () {
        GAMBIT.canvas.circle(25).y(this.level * 50).x(this.x);
        console.log("Drawing " + this.value + " at y " + this.level*50 + " and x " + this.x);
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