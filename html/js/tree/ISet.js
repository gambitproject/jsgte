GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new information set.
    * @class
    * @param {Number} numberOfNodes Number of nodes in this information set
    */
    function ISet() {
        this.moves = [];
        this.shape = null;
        this.firstNode = null;
        this.lastNode = null;
        this.numberOfNodes = 0;
    }

    /**
    * ToString function
    */
    ISet.prototype.toString = function () {
        return "ISet: " + "moves: " + this.moves;
    };

    /**
    * Returns the number of moves that belong to current information set
    * @return {Number} numberOfMoves Number of moves that belong to this
    */
    ISet.prototype.numberOfMoves = function () {
        return this.moves.length;
    };

    /**
    * Adds a new move to current information set
    * @return {Move} newMove Move that has been created
    */
    ISet.prototype.addNewMove = function () {
        // Create a new move and add to the list of moves
        var newMove = new GTE.TREE.Move(GTE.tree.getNextMoveName(), this);
        this.moves.push(newMove);
        return newMove;
    };

    /**
    * Adds a given node to current information set
    * @param {Node} node Node that will be added to current information set
    */
    ISet.prototype.addNode = function (node) {
        node.iset = this;
        this.numberOfNodes++;
        this.updateFirstAndLast();
    };

    /**
    * Function that adds a new node to the tree. It creates it and checks
    * if the node is the first or last in its information set
    * @param {Node} parent Node that will be set as parent to the new one
    * @param {Move} reachedBy Move that leads to this new node
    * @param {ISet} iset Information set that will contain it
    * @return {Node} newNode New node that has been created
    */
    ISet.prototype.addNewNode = function (parent, player, reachedBy) {
        var newNode = new GTE.TREE.Node(parent, player, reachedBy, this);
        this.numberOfNodes++;
        this.updateFirstAndLast();
        return newNode;
    };

    /**
    * Adds a newly created child iset as children for current information set
    * nodes
    * @param {ISet} childISet New information set that current information set
    *                         will be connected to through moves
    * @param {Array} nodesInThis Array that contains the nodes that belong to
    *                            this iset
    */
    ISet.prototype.addChildISet = function (childISet) {
        // Create two new moves
        var move = this.addNewMove();
        var nodesInThis = this.getNodes();
        // Add one node per move per node in set
        for (var i = 0; i < nodesInThis.length; i++) {
            childISet.addNewNode(nodesInThis[i], null, move);
        }
    };

    /**
    * Get isets that are connected to this iset through its moves
    * @return {Array} childrenISets Children information sets
    */
    ISet.prototype.getChildrenISets = function () {
        // Get children nodes
        var childrenNodes = this.getChildrenNodes();
        // Check number of different isets in children
        var childrenISets = [];
        for (var i = 0; i < childrenNodes.length; i++) {
            if (childrenISets.indexOf(childrenNodes[i].iset) === -1) {
                childrenISets.push(childrenNodes[i].iset);
            }
        }
        return childrenISets;
    };

    /**
    * Gets all the nodes that belong to current iset
    * @return {Array} nodes Nodes that belong to current iset
    */
    ISet.prototype.getNodes = function () {
        return GTE.tree.getNodesThatBelongTo(this);
    };

    /**
    * Gets all the children nodes to current iset
    * @return {Array} children Nodes whose parents belong to current iset
    */
    ISet.prototype.getChildrenNodes = function () {
        // Get the nodes that belong to given iset
        var nodesInIset = this.getNodes();

        var children = [];
        // Iterate over nodes and get their children
        for (var i = 0; i < nodesInIset.length; i++) {
            for (var j = 0; j < nodesInIset[i].children.length; j++) {
                children.push(nodesInIset[i].children[j]);
            }
        }
        return children;
    };

    /**
    * Draws the information set
    */
    ISet.prototype.draw = function () {
        if (this.lastNode !== this.firstNode) {
            var width = (this.lastNode.x + GTE.CONSTANTS.CIRCLE_SIZE*2) -
                        (this.firstNode.x - GTE.CONSTANTS.CIRCLE_SIZE);

            this.shape = GTE.canvas.rect(width, GTE.CONSTANTS.ISET_HEIGHT)
                                    .stroke({ color: '#000', width: 2 })
                                    .radius(GTE.CONSTANTS.ISET_HEIGHT/2)
                                    .addClass('iset');
            this.shape.translate(this.firstNode.x - GTE.CONSTANTS.CIRCLE_SIZE,
                                this.firstNode.y - GTE.CONSTANTS.CIRCLE_SIZE + 4);
            var thisISet = this;
            this.shape.click(function() {
                thisISet.onClick();
            });
        }
        if (this.getPlayer()) {
            this.drawPlayer();
        }
    };

    ISet.prototype.drawPlayer = function () {
        var thisPlayer = this.getPlayer();
        var x;
        if (this.isSingleton()) {
            x = this.firstNode.x + GTE.CONSTANTS.TEXT_NODE_MARGIN;
        } else {
            x = (this.lastNode.x + GTE.CONSTANTS.CIRCLE_SIZE - this.firstNode.x)/2 +
                    this.firstNode.x - (this.playerNameText.width/2);
        }
        this.playerNameText = thisPlayer.draw(x, this.firstNode.y);
        if (thisPlayer.id === 0 && !GTE.tree.showChanceName) {
            this.playerNameText.hide();
        }
    };

    /**
    * Calculates the y of the iset depending on the level. It needs to check for
    * the positions of the other nodes in the same iset
    */
    // ISet.prototype.calculateY = function () {
    //     var nodesInSameISet = this.getNodes();
    //     this.y = nodesInSameISet[0].level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
    // };

    // ISet.prototype.calculateDepth = function () {
    //     this.depth = -1;
    //     var nodesInSameISet = this.getNodes();
    //     for (var i = 0; i < nodesInSameISet.length; i++) {
    //         this.depth = Math.max(this.depth, nodesInSameISet[i].level);
    //     }
    //     // Get maximum parents depth
    //     var parents = this.getParentISets();
    //     var parentsMaxDepth = -1;
    //     for (i = 0; i < parents.length; i++) {
    //         parentsMaxDepth = Math.max(parentsMaxDepth, parents[i].depth);
    //     }
    //     this.depth = Math.max(this.depth, parentsMaxDepth+1);
    // };

    // ISet.prototype.allign = function () {
    //     var nodesInSameISet = this.getNodes();
    //     // If it is singleton
    //     if (nodesInSameISet.length !== 1) {
    //         var levels = [];
    //         var node;
    //         // Iterate over the nodes in same iset and get the deepest level of all
    //         for (var i = 0; i < nodesInSameISet.length; i++) {
    //             node = nodesInSameISet[i];
    //             if (levels.indexOf(node.level) === -1) {
    //                 levels.push(node.level);
    //             }
    //         }
    //         levels.sort();
    //         var y = levels[levels.length-1] * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
    //         while (nodesInSameISet.length > 0) {
    //             node = nodesInSameISet.pop();
    //             if (node.level < levels[levels.length-1]) {
    //                 GTE.tree.moveDownEverythingBelowNode(node,
    //                         y - node.level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS);
    //             }
    //         }
    //         // if (levels.length > 1 && levels[levels.length-1] !== this.level) {
    //         //     GTE.tree.recursiveMoveDownEverythingBelowNode(this,
    //         //                 y - this.level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS);
    //         // }
    //         if (y > this.y) {
    //             this.y = y;
    //         }
    //     }
    // };



    /**
    * Updates the first and last node of the iset
    */
    ISet.prototype.updateFirstAndLast = function () {
        var nodesInIset = this.getNodes();

        // Update first and last one
        this.firstNode = nodesInIset[0];
        this.lastNode = nodesInIset[nodesInIset.length-1];
        GTE.tree.positionsUpdated = false;
    };

    /**
    * Removes the node from the iset
    * @param {Node} node Node that will be removed
    */
    ISet.prototype.removeNode = function (node) {
        this.numberOfNodes--;
        node.iset = null;
        if (this.numberOfNodes === 0) {
            this.delete();
        } else {
            this.updateFirstAndLast();
        }
    };

    /**
    * Removes the move from the iset
    * @param {Move} move Move that will be removed
    */
    ISet.prototype.removeMove = function (move) {
        var indexInList = this.moves.indexOf(move);
        if (indexInList > -1) {
            this.moves.splice(indexInList, 1);
        }
    };


    /**
    * On click function for the information set
    */
    ISet.prototype.onClick = function () {
        switch (GTE.MODE) {
            case GTE.MODES.ADD:
                if (this.numberOfMoves() === 0) {
                    // If no children, add two, since one child only doesn't
                    // make sense
                    GTE.tree.addChildISetTo(this);
                    GTE.tree.addChildISetTo(this);
                } else {
                    var childrenIsets = this.getChildrenISets();
                    // If there is more than one children iset or there is only one,
                    // but it already has moves, add children nodes as single node
                    // isets
                    if (childrenIsets.length > 1 || childrenIsets[0].moves.length > 0) {
                        // Add new isets as singletons by not specifying an iset
                        GTE.tree.addNodesToChildISet(this);
                    } else {
                        // If there is a single child iset and it has no moves
                        // Add new nodes to child iset
                        GTE.tree.addNodesToChildISet(this, childrenIsets[0]);
                    }
                }// Tell the tree to redraw itself
                GTE.tree.draw();
                break;
            case GTE.MODES.DELETE:
                var children = this.getChildrenNodes();
                if (children.length === 0) {
                    // Delete node
                    GTE.tree.deleteNode(this.firstNode);
                } else {
                    // Delete all children
                    for (var i = 0; i < children.length; i++) {
                        // deleteNode() will delete everything below as well
                        GTE.tree.deleteNode(children[i]);
                    }
                    // This iset's nodes will turn into leaves and...
                    // leaves cannot have players!!!
                    var nodesInIset = this.getNodes();
                    for (i = 0; i < nodesInIset.length; i++) {
                        nodesInIset[i].deassignPlayer();
                    }
                    // Dissolve current iset
                    this.dissolve();
                }
                break;
            case GTE.MODES.MERGE:
                this.select();
                break;
            case GTE.MODES.DISSOLVE:
                this.dissolve();
                GTE.tree.draw();
                break;
            default:
                break;
        }

    };

    /**
    * Deletes current information set
    */
    ISet.prototype.delete = function () {
        // If there are nodes, remove all of them to get rid of all the references
        if (this.numberOfNodes > 0) {
            var nodes = this.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                this.removeNode(nodes[i]);
            }
        } else { // If there are no nodes
            this.moves = []; //remove references to moves
            GTE.tree.deleteISetFromList(this);
        }
    };

    /**
    * Marks current information set as selected and does the proper if there is another
    * information set selected
    */
    ISet.prototype.select = function () {
        if (GTE.tree.selected.length > 0 ) {
            // There are two selected nodes. Merge
            var firstSelected = GTE.tree.selected.pop();
            GTE.tree.merge(firstSelected, this);
            GTE.tree.draw();
        } else {
            if (this.shape !== null) {
                this.shape.toggleClass('selected');
            }
            var nodes = this.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].shape.toggleClass('selected');
            }
            GTE.tree.selected.push(this);
        }
    };

    /**
    * Function that dissolves current iset
    */
    ISet.prototype.dissolve = function () {
        // Remove Moves
        for (var i = 0; i < this.moves.length; i++) {
            this.removeMove(this.moves[i]);
        }
        var nodes = this.getNodes();
        if (nodes.length > 1) {
            this.delete();
            GTE.tree.createSingletonISets(nodes);
        }
    };

    ISet.prototype.getISetsBelow = function (isets) {
        var nodes = this.getNodes();
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].getISetsBelow(isets);
        }
    };

    ISet.compare = function (a, b) {
        if (parseInt(a.firstNode.x) <= parseInt(b.firstNode.x)) {
            return -1;
        } else {
            return 1;
        }
        return 0;
    };

    ISet.prototype.hasChildren = function () {
        var nodes = this.getNodes();
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].children.length > 0) {
                return true;
            }
        }
        return false;
    };

    ISet.prototype.getParentISets = function () {
        var nodes = this.getNodes();
        var parents = [];
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].parent !== null) {
                var parentISet = nodes[i].parent.iset;
                if (parents.indexOf(parentISet) === -1) {
                    parents.push(parentISet);
                }
            }
        }
        return parents;
    };

    ISet.prototype.getPlayer = function () {
        return this.firstNode.player;
    };

    ISet.prototype.updatePlayerName = function () {
        this.playerNameText.setText(this.getPlayer().name);
        if (!this.isSingleton()) {
            var x = (this.lastNode.x + GTE.CONSTANTS.CIRCLE_SIZE - this.firstNode.x)/2 +
                    this.firstNode.x - (this.playerNameText.width/2);
            this.playerNameText.translate(x);
        }
    };

    ISet.prototype.isSingleton = function () {
        return this.firstNode === this.lastNode;
    };

    /*
    * Removes child from the information set, which means that if the information
    * set is a singleton, the move that leads to the node will be removed
    */
    ISet.prototype.removeChild = function (node) {
        if (this.isSingleton()) {
            this.removeMove(node.reachedBy);
        }
    };

    // Add class to parent module
    parentModule.ISet = ISet;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
