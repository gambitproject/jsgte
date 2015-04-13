var GAMBIT = (function (my) {
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
    
    // Add function to module
    my.Node = Node;

    return my;
}(GAMBIT || {})); // Add to GAMBIT module. If module does not exist, create it