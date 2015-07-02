GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new ISet.
    * @class
    * @param {ISet} [parent] Parent ISet. If null, this is root.
    * @param  {Integer} numOfNodes Number of nodes of this new information set
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
    * Function that adds a node to ISet
    * @param {Node} node Node to add
    */
    ISet.prototype.addNode = function (node) {
        this.nodes.push(node);
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
    * Function that removes child ISet from children
    * @param {ISet} iSetToDelete Child ISet to remove
    */
    ISet.prototype.removeChild = function (iSetToDelete) {
        // Find the move that leads to this ISet
        var indexInList = findMoveThatLeadsTo(iSetToDelete);
        if (indexInList > -1) {
            this.moves.splice(indexInList, 1);
        }
    };

    ISet.prototype.findMoveThatLeadsTo = function (iSet) {
        for (var indexInList = 0; indexInList < moves.length; indexInList++) {
            if (moves[indexInList].child == this.iSetToDelete) return indexInList;
        };
        return -1;
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
    * Function that defines the behaviour of the ISet on click. This function is called if one of the nodes is clicked
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
    * Function that tells ISet to delete himself
    */
    ISet.prototype.delete = function () {
        // Delete the move that leads to this iSet in current parent
        this.parent.removeChild(this);
        // Set current parent to null
        this.parent = null;
        // Inform that tree needs to be redrawn
        GTE.tree.positionsUpdated = false;
    };

    // Add class to parent module
    parentModule.ISet = ISet;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
