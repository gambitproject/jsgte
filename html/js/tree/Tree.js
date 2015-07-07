GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Tree.
    * @class
    * @param {ISet} root Root information set
    */
    function Tree(root) {
        this.root = root;
        this.positionsUpdated = false;
    }

    /**
    * Function that draws the Game in the global canvas starting from an information set
    * Takes care of updating the positions, clearing the drawing and redrawing in it
    */
    Tree.prototype.draw = function(){
        if (!this.positionsUpdated) {
            this.updatePositions();
        }
        this.clear();
        this.recursiveDraw();
    };

    /**
    * Function that takes care of clearing the canvas and deleting all labels
    */
    Tree.prototype.clear = function(){
        // Clear canvas
        GTE.canvas.clear();
    };

    /**
    * Recursive function that draws the Game in the global canvas
    * starting from a given iSet. If no param is given it will
    * start from root.
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {ISet} [iSet] ISet to start drawing from
    */
    Tree.prototype.recursiveDraw = function (iSet) {
        // In case there is no arguments start from root
        if (iSet === undefined) { iSet = this.root; }

        if (!iSet.isLeaf()) {
            for (var i = 0; i < iSet.moves.length; i++) {
                // Draw the moves first
                iSet.moves[i].draw();
                this.recursiveDraw(iSet.moves[i].child);
            }
        }
        iSet.draw();
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
    * Recursive function that returns the number of leaves
    * below a determinate information set. Leaves positions
    * are updated in a different function.
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param    {ISet}      iSet        ISet to start from
    * @return   {Number}    leafCounter Number of Leaves
    */
    Tree.prototype.recursiveNumberLeaves = function (iSet) {
        // TODO #16
        if (iSet.isLeaf()) {
            this.leaves.push(iSet);
            return 1;
        } else {
            var leafCounter = 0;
            for (var i = 0; i < iSet.moves.length; i++) {
                leafCounter += this.recursiveNumberLeaves(iSet.moves[i].child);
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
    * Recursive function that updates the positions of the nodes
    * inside the information sets. Leaves positions are updated
    * in a different function.
    * Stopping criteria: that the current information set is a leaf
    * Recursive expansion: to all of the isets that moves lead to
    * @param {ISet} iSet ISet that will get their children's positions updated
    */
    Tree.prototype.recursiveUpdatePositions = function (iSet) {
        if (!iSet.isLeaf()) {
            for (var i = 0; i < iSet.moves.length; i++) {
                this.recursiveUpdatePositions(iSet.moves[i].child);
            }
            // Get middle point between the children most in the left and most
            // in the right
            // TODO #9
            iSet.node.x = iSet.moves[0].child.node.x +
                (iSet.moves[iSet.moves.length - 1].child.node.x - iSet.moves[0].child.node.x)/2;
            iSet.node.y = iSet.node.level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
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
                this.leaves[i].node.x = (widthPerNode*i)+(widthPerNode/2) -
                                        GTE.CONSTANTS.CIRCLE_SIZE/2 + offset;
            }
        }
    };

    /**
    * Adds a child to a given iSet
    * @param  {ISet} parentISet ISet that will get a new child
    * @return {ISet} newISet    ISet that has been added
    */
    Tree.prototype.addChildISetTo = function (parentISet) {
        // Create a new ISet
        // TODO #15
        var newISet = new GTE.TREE.ISet(parentISet, 1);
        // Check none of the new nodes of the ISet is out of the canvas
        // TODO #14
        if ((newISet.node.y + GTE.CONSTANTS.CIRCLE_SIZE) > GTE.canvas.viewbox().height) {
            this.zoomOut();
        }
        // Inform that tree needs to be redrawn
        this.positionsUpdated = false;
        return newISet;
    };

    /**
     * Function that deletes the iSet children
     * @param {ISet} iSet iSet whose children will be deleted
     */
    Tree.prototype.deleteChildrenOf = function (iSet) {
        // Delete everything below every child
        while(iSet.moves.length !== 0){
            // Send moves[0] because moves[] will decrease in size
            this.recursiveDeleteChildren(iSet.moves.pop().child);
        }
        this.positionsUpdated = false;
    };

    /**
    * Recursive function that deletes everything below an iSet.
    * Stopping criteria: that the current iSet is a leaf
    * Recursive expansion: to all of the iSet's children
    * @param {ISet} iSet Starting iSet
    */
    Tree.prototype.recursiveDeleteChildren = function (iSet) {
        if (!iSet.isLeaf()) {
            for (var i=0; i < iSet.moves.length; i++) {
                this.recursiveDeleteChildren(iSet.moves[i].child);
            }
        }
        iSet.delete();
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
