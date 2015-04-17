GAMBIT.TREE = (function (parentModule) {
	"use strict";

	// Tree constructor
	function Tree(root) {
		this.root = root;
        this.positionsUpdated = false;
	}

	// Function that draws the Game in the global canvas starting from param node
	Tree.prototype.draw = function (node) {
        // In case there is no arguments start from root
        if (node === undefined) { node = this.root; }
        
		if (!node.isLeaf()) {
            for (var i = 0; i < node.children.length; i++) {
                this.draw(node.children[i]);
            }
        }
        node.draw();
	};
    
    // @return (int) the number of leaves (nodes without children) of the tree */
    Tree.prototype.numberLeaves = function () {
        this.leaves = [];
        return this.recursiveNumberLeaves(this.root);
    };

    
    // Recursive function that returns the number of leaves below a determinate node
    // Stopping criteria: that the current node is a leaf
    // Recursive expansion: to all of the node's children
    Tree.prototype.recursiveNumberLeaves = function (node) {
        if (node.isLeaf()) {
            this.leaves.push(node);
            return 1;
        } else {
            var leafCounter = 0;
            for (var i = 0; i < node.children.length; i++) {
                leafCounter += this.recursiveNumberLeaves(node.children[i]);
            }
            return leafCounter;
        }
    };

    Tree.prototype.updatePositions = function () {
        this.root.x = 300/2;
        
        this.updateLeavesPositions();
        this.recursiveUpdatePositions(this.root);
        this.positionsUpdated = true;
    };

    Tree.prototype.recursiveUpdatePositions = function (node) {
        if (!node.isLeaf()) {
            for (var i = 0; i < node.children.length; i++) {
                this.recursiveUpdatePositions(node.children[i]);
            }
            // Get middle point between the children most in the left and most in the right
            // TODO: apply level weighted function for special cases
            node.x = node.children[0].x + (node.children[node.children.length-1].x-node.children[0].x)/2;
        }
    };
    
    Tree.prototype.updateLeavesPositions = function (){
        var widthPerNode = 300/this.leaves.length;
        for (var i = 0; i < this.leaves.length; i++) {
            this.leaves[i].x = (widthPerNode*i)+(widthPerNode/2);
        }
    };

    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module