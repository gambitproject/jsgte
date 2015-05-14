GAMBIT.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Tree.
    * @class
    * @param {Node} root Root node for the tree
    */
    function Tree(root) {
        this.root = root;
        this.positionsUpdated = false;
    }

    /**
    * Function that draws the Game in the global canvas starting from a node
    * Takes care of updating the positions, clearing the canvas and drawing in it
    */
    Tree.prototype.draw = function(){
        if (!this.positionsUpdated) {
            this.updatePositions();
        }
        // GAMBIT.canvas.clear();
        this.recursiveDraw();
    };

    /**
    * Recursive function that draws the Game in the global canvas starting from a node
    * If no param is given it will start from root
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} [node] Node to start drawing from
    */
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

    /**
    * Function that draws a line between two given nodes
    * @param {Node} node1 Node A
    * @param {Node} node2 Node B
    */
    Tree.prototype.drawLineBetweenNodes = function(node1, node2){
        var circleRadius = GAMBIT.CONSTANTS.CIRCLE_SIZE/2;
        if (node2.lineToParent === null) {
            node2.lineToParent = GAMBIT.canvas.line(node1.x + circleRadius, node1.y + circleRadius, node2.x + circleRadius, node2.y + circleRadius)
                                              .stroke({ width: 1 });
        } else {
            node2.lineToParent.attr({
                'x1': node2.lineToParent.attr().x1,
                'y1': node2.lineToParent.attr().y1,
                'x2': node2.lineToParent.attr().x2,
                'y2': node2.lineToParent.attr().y2
            }).animate().attr({
                'x1': node1.x + circleRadius,
                'y1': node1.y + circleRadius,
                'x2': node2.x + circleRadius,
                'y2': node2.y + circleRadius,
            });
        }
    };

    /**
    * Function that returns the number of leaves in the tree
    * @return {Number} leafCounter Number of Leaves
    */
    Tree.prototype.numberLeaves = function () {
        this.leaves = [];
        return this.recursiveNumberLeaves(this.root);
    };


    /**
    * Recursive function that returns the number of leaves below a determinate node
    * Leaves positions are updated in a different function.
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param    {Node}      node        Node to start from
    * @return   {Number}    leafCounter Number of Leaves
    */
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

    /**
    * Function that updates the positions of the nodes in the tree
    */
    Tree.prototype.updatePositions = function () {
        this.updateLeavesPositions();
        this.recursiveUpdatePositions(this.root);
        this.positionsUpdated = true;
    };

    /**
    * Recursive function that updates the positions of the node children.
    * Leaves positions are updated in a different function.
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} node Node that will get their children's positions updated
    */
    Tree.prototype.recursiveUpdatePositions = function (node) {
        if (!node.isLeaf()) {
            for (var i = 0; i < node.children.length; i++) {
                this.recursiveUpdatePositions(node.children[i]);
            }
            // Get middle point between the children most in the left and most
            // in the right
            // TODO: apply level weighted function for special cases
            node.x = node.children[0].x +
                (node.children[node.children.length-1].x - node.children[0].x)/2;
            node.y = node.level * GAMBIT.CONSTANTS.DIST_BETWEEN_LEVELS;
        }
    };

    /**
    * Updates the positions (x and y) of the Tree leaves
    */
    Tree.prototype.updateLeavesPositions = function () {
        var numberLeaves = this.numberLeaves();
        var widthPerNode = GAMBIT.canvas.viewbox().width/numberLeaves;
        if (widthPerNode < GAMBIT.CONSTANTS.CIRCLE_SIZE) {
            this.zoomOut();
            this.updateLeavesPositions();
        } else {
            for (var i = 0; i < numberLeaves; i++) {
                this.leaves[i].x = (widthPerNode*i)+(widthPerNode/2) -
                                        GAMBIT.CONSTANTS.CIRCLE_SIZE/2;
                this.leaves[i].y = this.leaves[i].level * GAMBIT.CONSTANTS.DIST_BETWEEN_LEVELS;
            }
        }
    };

    /**
    * Adds a child to a given node
    * @param  {Node} parentNode Node that will get a new child
    * @return {Node} newNode    Node that has been added
    */
    Tree.prototype.addChildNodeTo = function (parentNode) {
        var newNode = new GAMBIT.TREE.Node(parentNode);
        if ((newNode.y + GAMBIT.CONSTANTS.CIRCLE_SIZE) > GAMBIT.canvas.viewbox().height) {
            this.zoomOut();
        }
        this.positionsUpdated = false;
        return newNode;
    };

    /**
     * Function that deletes the node. It changes children's parent to their
     * grandparent.
     * @param {Node} nodeToDelete Node to be deleted
     */
    Tree.prototype.deleteNode = function (nodeToDelete) {
        // Check if it has children
        if (!nodeToDelete.isLeaf()) {
            // Change level of everything below
            this.recursiveDecreaseLevel(nodeToDelete);
            // Change parent of children to own parent
            while(nodeToDelete.children.length !== 0){
                nodeToDelete.children[0].changeParent(nodeToDelete.parent);
            }
        }
        nodeToDelete.delete();
        this.positionsUpdated = false;
    };

    /**
    * Recursive function that decreases the level of everything before a node.
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
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

    /**
    * Zooms out the canvas by making the viewbox bigger
    */
    Tree.prototype.zoomOut = function(){
        GAMBIT.canvas.viewbox(0, 0, GAMBIT.canvas.viewbox().width*1.5, GAMBIT.canvas.viewbox().height*1.5);
    };

    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GAMBIT.TREE)); // Add to GAMBIT.TREE sub-module
