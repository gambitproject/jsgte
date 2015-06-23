GTE.TREE = (function (parentModule) {
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
        GTE.canvas.clear();
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
        var circleRadius = GTE.CONSTANTS.CIRCLE_SIZE/2;
        GTE.canvas.line(node1.x + circleRadius, node1.y + circleRadius, node2.x + circleRadius, node2.y +circleRadius)
                  .stroke({ width: GTE.CONSTANTS.LINE_THICKNESS });
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
            node.y = node.level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
        }
    };

    /**
    * Updates the positions (x and y) of the Tree leaves
    */
    Tree.prototype.updateLeavesPositions = function () {
        var numberLeaves = this.numberLeaves();
        var widthPerNode = GTE.canvas.viewbox().width/numberLeaves;
        var offset = 0;
        // Avoid nodes to be too spreaded out
        if (widthPerNode > GTE.CONSTANTS.MAX_HORIZONTAL_DISTANCE_BW_NODES) {
            widthPerNode = GTE.CONSTANTS.MAX_HORIZONTAL_DISTANCE_BW_NODES;
            // Calculate the offset so the nodes are centered on the screen
            offset = (GTE.canvas.viewbox().width-widthPerNode*numberLeaves)/2;
        }
        if (widthPerNode < GTE.CONSTANTS.CIRCLE_SIZE) {
            this.zoomOut();
            this.updateLeavesPositions();
        } else {
            for (var i = 0; i < numberLeaves; i++) {
                this.leaves[i].x = (widthPerNode*i)+(widthPerNode/2) -
                                        GTE.CONSTANTS.CIRCLE_SIZE/2 + offset;
                this.leaves[i].y = this.leaves[i].level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
            }
        }
    };

    /**
    * Adds a child to a given node
    * @param  {Node} parentNode Node that will get a new child
    * @return {Node} newNode    Node that has been added
    */
    Tree.prototype.addChildNodeTo = function (parentNode) {
        var newNode = new GTE.TREE.Node(parentNode);
        if ((newNode.y + GTE.CONSTANTS.CIRCLE_SIZE) > GTE.canvas.viewbox().height) {
            this.zoomOut();
        }
        this.positionsUpdated = false;
        return newNode;
    };

    /**
     * Function that deletes the node. It changes children's parent to their
     * grandparent.
     * @param {Node} node Node to be deleted
     */
    Tree.prototype.deleteChildrenOf = function (node) {
        // Delete everything below every child
        while(node.children.length !== 0){
            this.recursiveDeleteChildren(node.children[0]);
        }
        this.positionsUpdated = false;
    };

    /**
    * Recursive function that deletes everything below a node.
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} node Starting node
    */
    Tree.prototype.recursiveDeleteChildren = function (node) {
        if (!node.isLeaf()) {
            for (var i=0; i < node.children.length; i++) {
                this.recursiveDeleteChildren(node.children[i]);
            }
        }
        node.delete();
    };

    /**
    * Zooms out the canvas by making the viewbox bigger
    */
    Tree.prototype.zoomOut = function(){
        GTE.canvas.viewbox(0, 0, GTE.canvas.viewbox().width*1.5, GTE.canvas.viewbox().height*1.5);
    };

    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
