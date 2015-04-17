GAMBIT.TREE = (function (parentModule) {
	"use strict";

	// Node constructor
	function Node(father) {
		this.father = father;
		if (father !== null) {father.add_child(this);}
		this.terminal = true;
		this.children = [];
	}

	// Function that draws the node in the global canvas
	Node.prototype.draw = function () {
		GAMBIT.canvas.circle(25);
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