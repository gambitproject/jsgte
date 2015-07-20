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
        this.isets = [];
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
        this.drawISets();
        this.drawNodes();
    };

    Tree.prototype.drawISets = function () {
        for (var i = 0; i < this.isets.length; i++) {
            this.isets[i].draw();
        }
    };

    Tree.prototype.drawNodes = function () {
        this.recursiveDrawNodes(this.root);
    };

    /**
    * Recursive function that draws the Game in the global canvas starting from a node
    * If no param is given it will start from root
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} [node] Node to start drawing from
    */
    Tree.prototype.recursiveDrawNodes = function (node) {
        // In case there is no arguments start from root
        if (node === undefined) { node = this.root; }

        if (!node.isLeaf()) {
            for (var i = 0; i < node.children.length; i++) {
                this.recursiveDrawNodes(node.children[i]);
            }
        }
        node.draw();
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
            }
        }
    };

    Tree.prototype.addNewISet = function () {
        var newISet = new GTE.TREE.ISet();
        this.isets.push(newISet);
        return newISet;
    };

    Tree.prototype.addNewNode = function (parent, reachedby, iset) {
        var newNode = new GTE.TREE.Node(parent, reachedby, iset);
        var nodesInIset = this.getNodesThatBelongTo(iset);

        // Update first and last one
        iset.firstNode = nodesInIset[0];
        iset.lastNode = nodesInIset[nodesInIset.length-1];
        return newNode;
    };

    // /**
    // * Adds a child to a given node
    // * @param  {Node} parentNode Node that will get a new child
    // * @return {Node} newNode    Node that has been added
    // */
    // Tree.prototype.addChildNodeTo = function (parentNode) {
    //     // Create a new move in parent ISet
    //     var newMove = parentNode.iset.addNewMove();
    //
    //     // Create a new Iset with only one node
    //     var newISet = this.addNewISet();
    //
    //     var newNode = new GTE.TREE.Node(parentNode, newMove, newISet);
    //
    //     if ((newNode.y + GTE.CONSTANTS.CIRCLE_SIZE) > GTE.canvas.viewbox().height) {
    //         this.zoomOut();
    //     }
    //     this.positionsUpdated = false;
    //     return newNode;
    // };

    /**
    * Creates two new moves for a given ISet and the new ISet that
    * the moves will lead to
    * @param  {ISet} parentISet ISet that will get two new moves
    */
    Tree.prototype.addChildISetTo = function (parentISet) {
        // Create new information set
        var newISet = this.addNewISet();

        // Get nodes that belong to parentISet as isets don't keep reference of nodes
        var nodesInParentISet = this.getNodesThatBelongTo(parentISet);
        parentISet.addChildISet(newISet, nodesInParentISet);
        this.positionsUpdated = false;
    };

    Tree.prototype.addNodesToChildISet = function (parent, child) {
        var newMove = parent.addNewMove();
        var nodesInParentISet = this.getNodesThatBelongTo(parent);

        for (var i = 0; i < nodesInParentISet.length; i++) {
            this.addNewNode(nodesInParentISet[i], newMove, child);
        }
        this.positionsUpdated = false;
    };

    Tree.prototype.addSingletonISets = function (parentISet) {
        var newMove = parentISet.addNewMove();
        var nodesInParentISet = this.getNodesThatBelongTo(parentISet);

        for (var i = 0; i < nodesInParentISet.length; i++) {
            this.addNewNode(nodesInParentISet[i], newMove, this.addNewISet());
        }
        this.positionsUpdated = false;
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


    Tree.prototype.getNodesThatBelongTo = function(iset) {
        var returnArray = [];
        this.recursiveGetNodesThatBelongTo(this.root, iset, returnArray);
        return returnArray;
    };

    Tree.prototype.recursiveGetNodesThatBelongTo = function(node, iset, returnArray) {
        if (node.iset === iset) {
            returnArray.push(node);
        }
        if (!node.isLeaf()) {
            for (var i = 0; i < node.children.length; i++) {
                this.recursiveGetNodesThatBelongTo(node.children[i], iset, returnArray);
            }
        }
    };

    Tree.prototype.getNextMoveName = function () {
        // Get all moves
        var listOfMoves = this.getAllMoves();
        if (listOfMoves.length === 0) return "A";
        var lastMove = listOfMoves[listOfMoves.length-1];
        var name = lastMove.name.substring(0, lastMove.name.length-1) +
               String.fromCharCode(lastMove.name.charCodeAt(lastMove.name.length-1) + 1);
        return name;
    };

    Tree.prototype.getAllMoves = function () {
        var listOfMoves = [];
        for (var i = 0; i < this.isets.length; i++) {
            for (var j = 0; j < this.isets[i].moves.length; j++) {
                listOfMoves.push(this.isets[i].moves[j]);
            }
        }
        return listOfMoves;
    };

    Tree.prototype.getChildrenNodes = function (iset) {
        // Get the nodes that belong to given iset
        var nodesInIset = this.getNodesThatBelongTo(iset);

        var children = [];
        // Iterate over nodes and get their children
        for (var i = 0; i < nodesInIset.length; i++) {
            for (var j = 0; j < nodesInIset[i].children.length; j++) {
                children.push(nodesInIset[i].children[j]);
            }
        }
        return children;
    };

    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
