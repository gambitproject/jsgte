GAMBIT.TREE = (function (parentModule) {
	"use strict";

	// Tree constructor
	function Tree(root) {
		this.root = root;
	}

	// Function that draws the Game in the global canvas starting from param node
	Tree.prototype.draw = function (node) {
        // In case there is no arguments start from root
        if (node === undefined) { node = this.root; }
        
		if (node.children != []) {
            for (var i = 0; i < node.children.length; i++) {
                this.draw(node.children[i]);
            }
            node.draw();
        }
	};
    
    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module