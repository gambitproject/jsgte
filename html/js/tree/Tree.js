GAMBIT.TREE = (function (parentModule) {
	"use strict";

	// Tree constructor
	function Tree(root) {
		this.root = root;
        this.positionsUpdated = false;
	}

    Tree.prototype.draw = function(argument){
        if (!this.positionsUpdated) {
            this.updatePositions();
        }
        GAMBIT.canvas.clear();
        this.recursiveDraw();
    };

	// Function that draws the Game in the global canvas starting from param node
	Tree.prototype.recursiveDraw = function (node) {
        // In case there is no arguments start from root
        if (node === undefined) { node = this.root; }
        
		if (!node.isLeaf()) {
            for (var i = 0; i < node.children.length; i++) {
                this.drawLineBetweenNodes(node, node.children[i]);
                this.recursiveDraw(node.children[i]);
            }
        }
        node.draw();
	};

    Tree.prototype.drawLineBetweenNodes = function(node1, node2){
        var circleRadius = GAMBIT.CONSTANTS.CIRCLE_SIZE/2;
        GAMBIT.canvas.line(node1.x + circleRadius, node1.y + circleRadius, node2.x + circleRadius, node2.y +circleRadius).stroke({ width: 1 });
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
        // this.root.x = 250/2-GAMBIT.CONSTANTS.CIRCLE_SIZE/2;
        
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
        var numberLeaves = this.numberLeaves();
        var widthPerNode = GAMBIT.canvas.viewbox().width/numberLeaves;
        // We start from the most right child so if we detect is going to be outside the viewport faster
        for (var i = numberLeaves-1; i >= 0; i--) {
            this.leaves[i].x = (widthPerNode*i)+(widthPerNode/2)-GAMBIT.CONSTANTS.CIRCLE_SIZE/2;
            // TODO: check if it goes outside the box from the bottom
            if ((this.leaves[i].x + GAMBIT.CONSTANTS.CIRCLE_SIZE) > GAMBIT.canvas.viewbox().width) {
                this.zoomOut();
                this.updateLeavesPositions();
            }
        }
    };

    Tree.prototype.addChildNodeTo = function(parentNode){
        var newNode = new GAMBIT.TREE.Node(parentNode);
        this.positionsUpdated = false;
        return newNode;
    };

    Tree.prototype.zoomOut = function(){
        GAMBIT.canvas.viewbox(0, 0, GAMBIT.canvas.viewbox().width+20, GAMBIT.canvas.viewbox().width+20);
    };

    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module