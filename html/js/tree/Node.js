GAMBIT.TREE = (function (parentModule) {
	"use strict";

	// Node constructor
	function Node(terminal, father) {
		this.terminal = terminal;
		this.father = father;
	}

	// Function that draws the node in the global canvas
	Node.prototype.draw = function () {
		GAMBIT.canvas.circle(25);
	};
    
    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module