GAMBIT.TREE = (function (parentModule) {
	"use strict";

	// Node constructor
	function Node(father) {
		this.father = father;
		this.terminal = true;
		this.children = [];
		this.x = 0;
		
		if (father === null) { // If this is root set level to 0
			this.level = 0;
		} else {
			father.add_child(this);
			this.level = father.level + 1;
		}
	}

	// Function that draws the node in the global canvas
	Node.prototype.draw = function () {
		GAMBIT.canvas.circle(25).y(this.level * 50);
	};

	// Function that adds child to node
	Node.prototype.add_child = function (node) {
		this.children.push(node);
		// As there is a child now change to not terminal
		if (this.terminal) {
			this.terminal = false;
		}
	};
    
    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module