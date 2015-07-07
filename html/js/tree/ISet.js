GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Information Set.
    * @class
    * @param {ISet} parent Parent information set. If null, this is root.
    * @param  {Number} [numOfNodes] Number of nodes of this new information set. If null 1
    */
    function ISet(parent, numOfNodes) {
        this.parent = parent;
        if (this.parent !== null) this.parent.addChild(this);
        this.numOfNodes = numOfNodes || 1;
         // TODO #11
        var newNodeLevel;
        if (parent === null) {
            newNodeLevel = 0;
        } else {
            newNodeLevel = parent.node.level + 1;
        }
        this.node = new GTE.TREE.Node(this, newNodeLevel);
        this.moves = [];
    }

    // TODO #12
    /**
    * ToString function
    */
    ISet.prototype.toString = function () {
        return "ISet: " + "parent " + this.parent + "; numOfNodes: " + this.numOfNodes + "; moves: " + this.moves;
    };


    /**
    * Function that adds a child ISet to the ISet
    * @param {ISet} childISet ISet to add
    */
    ISet.prototype.addChild = function (childISet) {
        // Create a move that leads to the child ISet
        this.moves.push(new GTE.TREE.Move(this, childISet));
    };

    /**
    * Function that finds the move that leads to a child ISet
    * @param {ISet}   childISet ISet to look for
    * @return {Number}          The index of the move in the list of
    *                           moves that contains the given iSet 
    */
    ISet.prototype.findMoveThatLeadsTo = function (iSet) {
        for (var indexInList = 0; indexInList < this.moves.length; indexInList++) {
            if (this.moves[indexInList].child === iSet) return indexInList;
        };
        return -1;
    };

    /**
    * Function that removes the move that contains a children iSet
    * @param {ISet} iSetToDelete Child ISet to remove
    */
    ISet.prototype.removeChild = function (iSetToDelete) {
        // Find the move that leads to this ISet
        var indexInList = this.findMoveThatLeadsTo(iSetToDelete);
        if (indexInList > -1) {
            this.moves.splice(indexInList, 1);
        }
    };

    /**
    * Function that finds out if ISet is leaf
    * @return {Boolean} True if is leaf.
    */
    ISet.prototype.isLeaf = function () {
        if (this.moves.length === 0) {
            return true;
        }
        return false;
    };

    /**
    * Function that changes iset's parent to a given one
    * @param {ISet} newParent New parent for iset
    */
    ISet.prototype.changeParent = function (newParent) {
        // Remove the move in parent that leads to this iset
        if (this.parent !== null) {
            this.parent.removeChild(this);
        }
        // Change current parent to the given one and add as a child in parent
        this.parent = newParent;
        if (this.parent !== null) {
            this.parent.addChild(this);
        }
    };

    /**
    * Function that draws the node in the global canvas
    */
    ISet.prototype.draw = function () {
        // TODO #13
        this.node.draw();
    };

    /**
    * Function that defines the behaviour of the ISet on click.
    * This function is called if one of the nodes is clicked
    */
    ISet.prototype.onClick = function () {
        if (GTE.MODE === GTE.MODES.ADD){
            if (this.isLeaf()) {
                // Add two new ISets if ISet is leaf
                GTE.tree.addChildISetTo(this);
            }
            GTE.tree.addChildISetTo(this);
        } else {
            // If it is a leaf, delete itself, if not, delete all children
            if (this.isLeaf()) {
                this.delete();
            } else {
                GTE.tree.deleteChildrenOf(this);
            }
        }
        // Tell the tree to redraw itself
        GTE.tree.draw();
    };

    /**
    * Function that tells ISet to delete itself
    */
    ISet.prototype.delete = function () {
        // Delete the move that leads to this iSet in current parent
        if (this.parent !== null) {
            this.parent.removeChild(this);
            // Set current parent to null
            this.parent = null;
            // Inform that tree needs to be redrawn
            GTE.tree.positionsUpdated = false;
        }
    };

    // Add class to parent module
    parentModule.ISet = ISet;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
