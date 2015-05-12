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
            node.y = node.level * 50;
        }
    };

    Tree.prototype.updateLeavesPositions = function () {
        var numberLeaves = this.numberLeaves();
        var widthPerNode = GAMBIT.canvas.viewbox().width/numberLeaves;
        if (widthPerNode < GAMBIT.CONSTANTS.CIRCLE_SIZE) {
            this.zoomOut();
            this.updateLeavesPositions();
        } else {
            for (var i = 0; i < numberLeaves; i++) {
                this.leaves[i].x = (widthPerNode*i)+(widthPerNode/2)-GAMBIT.CONSTANTS.CIRCLE_SIZE/2;
				this.leaves[i].y = this.leaves[i].level * 50;
            }
        }
    };

    Tree.prototype.addChildNodeTo = function (parentNode) {
        var newNode = new GAMBIT.TREE.Node(parentNode);
        if ((newNode.y + GAMBIT.CONSTANTS.CIRCLE_SIZE) > GAMBIT.canvas.viewbox().height) {
            this.zoomOut();
        }
        this.positionsUpdated = false;
        return newNode;
    };

	/**
	 * Function that deletes the node. It changes children's father to their
	 * grandfather.
	 * @param {Node} nodeToDelete Node to be deleted
	 */
	Tree.prototype.deleteNode = function (nodeToDelete) {
		// Check if it has children
		if (!nodeToDelete.isLeaf()) {
			// Change father of children to own father
			for (var i=0; i < nodeToDelete.children.length; i++) {
				nodeToDelete.children[i].changeFather(nodeToDelete.father);
			}
			// Change level of everything below
			this.recursiveDecreaseLevel(nodeToDelete);
		}
		// Delete node by deleting its reference from its parent
		nodeToDelete.father.deleteChild(nodeToDelete);
		this.positionsUpdated = false;
	};

	/**
	* Recursdive function that decreases the level of everything before a node.
	* @param {Node} node Starting node
	*/
	Tree.prototype.recursiveDecreaseLevel = function (node) {
		if (!node.isLeaf()) {
			for (var i=0; i < node.children.length; i++) {
				this.recursiveDecreaseLevel(node.children[i]);
			}
		}
		node.level = node.level - 1;
	};

    Tree.prototype.zoomOut = function(){
        GAMBIT.canvas.viewbox(0, 0, GAMBIT.canvas.viewbox().width*1.5, GAMBIT.canvas.viewbox().height*1.5);
    };

    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module
