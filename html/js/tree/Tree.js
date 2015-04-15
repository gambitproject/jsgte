GAMBIT.TREE = (function (parentModule) {
	"use strict";

	// Tree constructor
	function Tree(root) {
		this.root = root;
	}

	// Function that draws the Game in the global canvas
	Tree.prototype.draw = function () {
		// TODO
	};
    
    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module