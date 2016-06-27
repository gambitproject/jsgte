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
        this.selected = [];

        this.nodes = []; // Never reference directly.
                         //It might not be updated!! Use this.getAllNodes()
        this.depths = [];
        this.leaves = [];
        this.oldLeaves = [];
        this.players = [];
        this.multiActionLines = [];
        
        this.showChanceName = true;
    }

    /**
    * Function that draws the Game in the global canvas
    * Takes care of updating the positions, clearing the canvas and drawing in it
    */
    Tree.prototype.draw = function(forced){
        forced = forced || false;
        if (this.isets.length > 0) {
            this.align();
        }
        if (!this.positionsUpdated || forced) {
            this.updatePositions();
        }

        if (this.isets.length > 0) {
            this.sortOutCollisions();
        }

        if (!this.positionsUpdated || forced) {
            this.recursiveCalculateYs(this.root);
            this.centerParents(this.root);
            this.positionsUpdated = true;
        }
        this.clear();
        // Draw MultiAction first so that nodes clicks have higher priority
        this.drawMultiactionLines();
        if (this.isets.length > 0) {
            this.drawISets();
            this.drawPayoffs();
        }
        this.drawNodes();
    };

    /**
    * Function that clears the canvas
    * Takes care of removing the foreigns used during inline editing
    */
    Tree.prototype.clear = function(){
        // Clear canvas
        GTE.canvas.clear();
        // Remove labels
        var foreigns = document.getElementsByTagName("foreignObject");
        for (var index = foreigns.length - 1; index >= 0; index--) {
            foreigns[index].parentNode.removeChild(foreigns[index]);
        }
    };


    /**
    * Function that draws the isets in the global canvas by calling the drawing
    * function of each of the isets in the game
    */
    Tree.prototype.drawISets = function () {
        for (var i = 0; i < this.isets.length; i++) {
            this.isets[i].draw();
        }
    };

    /**
    * Updates payoffs across the tree
    */
    Tree.prototype.updatePayoffs = function () {
        // Clear old payoffs. This means to remove payoffs from those nodes that
        // have been deleted or that are not leaves anymore
        for (var i = 1; i < this.players.length; i++) {
            this.players[i].clearOldPayoffs();
        }

        // Look for new leaves. newLeaves will contain new leaves added to the tree
        var thisTree = this;
        var newLeaves = this.leaves.filter(
            function(current){
                return thisTree.oldLeaves.filter(
                        function(current_b){
                            return current_b == current;
                        }).length === 0;
        });
        // Create one new payoff per player and per new leaf
        for (i = 1; i < this.players.length; i++) {
            for (var j = 0; j < newLeaves.length; j++) {
                this.players[i].payoffs.push(
                            new GTE.TREE.Payoff(newLeaves[j], this.players[i]));
            }
        }
    };

    /**
    * Function that draws the payoffs in the global canvas
    */
    Tree.prototype.drawPayoffs = function () {
        // Remove old payoffs and create new ones
        this.updatePayoffs();
        // Draw each payoff across the tree
        for (var i = 1; i < this.players.length; i++) {
            this.players[i].drawPayoffs();
        }
    };

    /**
    * Function that draws the nodes in the global canvas by calling the recursive
    * function that goes along the tree drawing each node
    */
    Tree.prototype.drawNodes = function () {
        this.recursiveDrawNodes(this.root);
    };

    /**
    * Draws the multiaction lines across the tree
    */
    Tree.prototype.drawMultiactionLines = function () {
        this.multiActionLines = [];
        for (var i = 0; i < this.depths.length; i++) {
            // If there is only one node/iset do not draw
            if (this.depths[i].length === 1) {
                continue;
            }
            var nodesInLine = [];
            // Only draw multiAction line if no isets or all in line are singleton
            if (this.depths[i][0] instanceof GTE.TREE.ISet) {
                // Remember that if there are isets, depths contains isets and
                // no single nodes
                var draw = true;
                for (var j = 0; j < this.depths[i].length; j++) {
                    if (!this.depths[i][j].isSingleton()) {
                        draw = false;
                        break;
                    }
                    // Push the only node that this iset contains
                    nodesInLine.push(this.depths[i][j].getNodes()[0]);
                }
                if (!draw) {
                    // Skip to next level
                    continue;
                }
            } else {
                nodesInLine = this.depths[i].slice();
            }

            var multiAction = new GTE.TREE.MultiAction(i, nodesInLine);
            this.multiActionLines.push(multiAction);
            multiAction.draw();
            if (multiAction.containsLeaves &&
                (GTE.MODE === GTE.MODES.PLAYER_ASSIGNMENT ||
                GTE.MODE === GTE.MODES.MERGE ||
                GTE.MODE === GTE.MODES.DISSOLVE)) {
                multiAction.hide();
            }
        }
    };

    /**
    * Function that clears the canvas
    * Takes care of removing the foreigns used during inline editing
    */
    Tree.prototype.clear = function(){
        // Clear canvas
        GTE.canvas.clear();
        // Remove labels
        var foreigns = document.getElementsByTagName("foreignObject");
        for (var index = foreigns.length - 1; index >= 0; index--) {
            foreigns[index].parentNode.removeChild(foreigns[index]);
        }
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
        return this.leaves.length;
    };

    /**
    * Function that updates the different structures used while drawing
    */
    Tree.prototype.updateLeaves = function () {
        // Create a estructure that holds isets depending on the depth
        // of its nodes and sort it
        this.oldLeaves = this.leaves;
        this.leaves = [];
        this.recursiveupdateLeaves(this.root);
        this.updateLeavesPositions();
    };

    /**
    * Recursive function that updates the data structures used while drawing
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} node Node to start from
    */
    Tree.prototype.recursiveupdateLeaves = function (node) {
        if (node.isLeaf()) {
            this.leaves.push(node);
        } else {
            for (var i = 0; i < node.children.length; i++) {
                this.recursiveupdateLeaves(node.children[i]);
            }
        }
    };

    /**
    * Recursive function that updated the depths array in the tree
    */
    Tree.prototype.updateDepths = function () {
        // If there are isets, depths will contain isets, if not, it will
        // contain nodes
        this.depths = [];
        if (this.isets.length > 0) {
            for (var i = 0; i < this.isets.length; i++) {
                if (this.depths[this.isets[i].maxNodesDepth] === undefined) {
                    this.depths[this.isets[i].maxNodesDepth] = [];
                }
                this.depths[this.isets[i].maxNodesDepth].push(this.isets[i]);
            }
            for (i = 0; i < this.depths.length; i++) {
                this.depths[i].sort(GTE.TREE.ISet.compareX);
            }
        } else {
            var nodes = this.getAllNodes();
            for (var j = 0; j < nodes.length; j++) {
                if (this.depths[nodes[j].depth] === undefined) {
                    this.depths[nodes[j].depth] = [];
                }
                this.depths[nodes[j].depth].push(this.nodes[j]);
            }
            for (j = 0; j < this.depths.length; j++) {
                this.depths[j].sort(GTE.TREE.Node.compareX);
            }
        }
    };

    /**
    * Function that updates the positions of the nodes in the tree
    * This function is called if the drawing function detects that the positions
    * have changed
    */
    Tree.prototype.updatePositions = function () {
        this.updateLeaves();
        this.recursiveUpdatePositions(this.root);
        this.updateDepths();
    };

    /**
    * Recursive function that updates the positions of the children nodes.
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
            node.x = node.children[0].x +
                (node.children[node.children.length-1].x - node.children[0].x)/2;
        }
    };

    /**
    * Recursive function that updates the y positions of the nodes
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} node Node to expand through
    */
    Tree.prototype.recursiveCalculateYs = function (node) {
        for (var i = 0; i < node.children.length; i++) {
            this.recursiveCalculateYs(node.children[i]);
        }
        node.y = node.depth * parseInt(GTE.STORAGE.settingsDistLevels);
        if ((node.y + parseInt(GTE.STORAGE.settingsCircleSize)) > GTE.canvas.viewbox().height) {
            this.zoomOut();
            this.updatePositions();
        }
    };

    /**
    * Function that moves everything below a node down
    * @param {Node} node Everything below this node will be moved down
    */
    Tree.prototype.moveDownEverythingBelowNode = function (node) {
        var nodesToMoveDown = this.getNodesToMoveDown(node);
        for (var i = 0; i < nodesToMoveDown.length; i++) {
            if (nodesToMoveDown[i].parent.depth == -1) {
                console.log("ERROR THIS SHOULDNT HAPPEN. PARENT SHOULD HAVE DEPTH SET");
            } else {
                nodesToMoveDown[i].depth = Math.max(
                    nodesToMoveDown[i].parent.depth + 1, nodesToMoveDown[i].iset.maxNodesDepth);
            }
            if (nodesToMoveDown[i].depth > nodesToMoveDown[i].iset.maxNodesDepth) {
                nodesToMoveDown[i].iset.maxNodesDepth = nodesToMoveDown[i].depth;
                var nodesInSameISet = nodesToMoveDown[i].iset.getNodes();
                for (var j = 0; j < nodesInSameISet.length; j++) {
                    nodesInSameISet[j].depth = nodesToMoveDown[i].iset.maxNodesDepth;
                }
            }
        }
    };

    /**
    * Function that moves an iset and everything below down
    * @param {ISet} iset ISet that will be moved down. Everything below this ISet
    *                    will also be moved down
    */
    Tree.prototype.moveDownISetAndEverythingBelow = function (iset) {
        var dirtyISetsToMoveDown = [];
        var nodesInIset = iset.getNodes();
        for (var i = 0; i < nodesInIset.length; i++) {
            dirtyISetsToMoveDown = dirtyISetsToMoveDown.concat(
                                        this.getISetsToMoveDown(nodesInIset[i]));
        }
        dirtyISetsToMoveDown.push(iset);

        var iSetsToMoveDown = [];
        for (i = 0; i < dirtyISetsToMoveDown.length; i++) {
            if (iSetsToMoveDown.indexOf(dirtyISetsToMoveDown[i]) === -1){
                iSetsToMoveDown.push(dirtyISetsToMoveDown[i]);
            }
        }

        for (i = 0; i < iSetsToMoveDown.length; i++) {
            nodesInIset = iSetsToMoveDown[i].getNodes();
            for (var j = 0; j < nodesInIset.length; j++) {
                nodesInIset[j].depth++;
                if (nodesInIset[j].depth > iSetsToMoveDown[i].maxNodesDepth) {
                    // Delete from the depths array at old maxNodesDepth
                    var index = this.depths[iSetsToMoveDown[i].maxNodesDepth].indexOf(iSetsToMoveDown[i]);
                    this.depths[iSetsToMoveDown[i].maxNodesDepth].splice(index, 1);
                    iSetsToMoveDown[i].maxNodesDepth = nodesInIset[j].depth;
                    // Push to depths array at new maxNodesDepth
                    if (this.depths[iSetsToMoveDown[i].maxNodesDepth] === undefined) {
                        this.depths[iSetsToMoveDown[i].maxNodesDepth] = [];
                    }
                    this.depths[iSetsToMoveDown[i].maxNodesDepth].push(iSetsToMoveDown[i]);
                    this.depths[iSetsToMoveDown[i].maxNodesDepth].sort(GTE.TREE.ISet.compareX);
                }
            }
        }
    };

    /**
    * Function that gets the information sets that have to be moved down
    * @param {Node} node Parent on top of everything that has to be moved down
    */
    Tree.prototype.getISetsToMoveDown = function (node) {
        var dirtyISetsToMoveDown = node.getChildrenISets();
        for (var i = 0; i < dirtyISetsToMoveDown.length; i++) {
            dirtyISetsToMoveDown.concat(dirtyISetsToMoveDown[i].getISetsBelow());
        }
        // Look for duplicates
        var isets = [];
        for (i = 0; i < dirtyISetsToMoveDown.length; i++) {
            if (isets.indexOf(dirtyISetsToMoveDown[i]) === -1){
                isets.push(dirtyISetsToMoveDown[i]);
            }
        }
        isets.sort(GTE.TREE.ISet.compareY);
        return isets;
    };

    /**
    * Function that gets the nodes that have to be moved down
    * @param {Node} node Parent on top of everything that has to be moved down
    */
    Tree.prototype.getNodesToMoveDown = function (node) {
        var nodes = [];
        this.recursiveGetNodesToMoveDown(node, nodes);
        return nodes;
    };

    /**
    * Recursive function that gets all the nodes that have to be moved down
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node}  node  Node expand through
    * @param {Array} nodes Array of nodes that contains the nodes will be moved down
    */
    Tree.prototype.recursiveGetNodesToMoveDown = function (node, nodes) {
        for (var i = 0; i < node.children.length; i++) {
            nodes.push(node.children[i]);
            this.recursiveGetNodesToMoveDown(node.children[i], nodes);
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
        if (widthPerNode < parseInt(GTE.STORAGE.settingsCircleSize)) {
            this.zoomOut();
            this.updateLeavesPositions();
        } else {
            for (var i = 0; i < numberLeaves; i++) {
                this.leaves[i].x = (widthPerNode*i)+(widthPerNode/2) -
                                        parseInt(GTE.STORAGE.settingsCircleSize)/2 + offset;
            }
        }
    };

    /**
    * Function that adds a new information set to the tree. It creates it and
    * adds it to the list of isets
    * @return {ISet} newISet New information set that has been created
    */
    Tree.prototype.addNewISet = function () {
        var newISet = new GTE.TREE.ISet();
        this.isets.push(newISet);
        return newISet;
    };

    /**
    * Function that creates a new singleton information set that will contain
    * the node. It creates as many moves as children has the node. The node is
    * added to the new information set.
    * @param  {Node} node    Node that will be contained in the singleton iset
    * @return {ISet} newISet New information set that has been created
    */
    Tree.prototype.createSingletonISet = function (node) {
        var newISet = this.addNewISet();
        // Add as many moves as node's children
        for (var i = 0; i < node.children.length; i++) {
            // We cannot do this.getPlayer().id because, the neither the iset does
            // not have a firstNode assigned. We could move this piece of code
            // after node.changeISet(newISet) or newISet.addNode(node) but moves
            // have to be created before the addNode() function is called
            newISet.addNewMove(node.player.id);
        }
        if (node.iset !== null) {
            node.changeISet(newISet);
        } else {
            newISet.addNode(node);
        }
        return newISet;
    };

    /**
    * Function that creates a new singleton information set that will contain
    * the node. It creates as many moves as children has the node. The node is
    * added to the new information set.
    * @param  {Node} node    Node that will be contained in the singleton iset
    * @return {ISet} newISet New information set that has been created
    */
    Tree.prototype.createSingletonISets = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            this.createSingletonISet(nodes[i]);
        }
    };

    /**
    * Function that is ran the first time that a information set tool is selected
    */
    Tree.prototype.createPayoffs = function () {
        // Create one payoff for each player and each leaf
        for (var i = 1; i < this.players.length; i++) {
            for (var j = 0; j < this.leaves.length; j++) {
                this.players[i].payoffs.push(
                        new GTE.TREE.Payoff(this.leaves[j], this.players[i]));
            }
        }
    };

    /**
    * Function that removes a node from the tree
    * @param {Node} node Node that will be deleted
    */
    Tree.prototype.deleteNode = function (node) {
        var isetThatContainsNode = node.iset;
        var parent = node.parent;
        // If it has children, delete all of them
        if (!node.isLeaf()) {
            this.deleteChildrenOf(node);
            node.deassignPlayer();
        }
        // Remove the node from the Tree
        node.delete();
        // Check if old parent is a leaf
        if (parent.isLeaf()) {
            // Deassign the player
            parent.deassignPlayer();
        }
    };

    /**
    * Function that removes a given iset from the list of isets
    * @param {ISet} iset ISet that will be deleted
    */
    Tree.prototype.deleteISetFromList = function (iset) {
        var index = this.isets.indexOf(iset);
        if (index > -1) {
            this.isets.splice(index, 1);
        }
    };

    /**
    * Function that checks that all the nodes in a given iset have the same
    * number of children. If any node is not consistent it deletes it from the
    * information set and creates its own singgleton information set
    * @param {ISet} iset ISet that will be checked
    */
    Tree.prototype.checkISetIntegrity = function (iset) {
        // Get nodes in iset
        var nodesInIset = iset.getNodes();
        // Check all nodes have same number of children
        for (var i = 0; i < nodesInIset.length; i++) {
            if (iset.moves.length !== nodesInIset[i].children.length) {
                // This node is not consistent
                // Create a new iset for this node
                this.createSingletonISet(nodesInIset[i]);
            }
        }
    };

    /**
    * Adds a child to a given node
    * @param  {Node} parentNode Node that will get a new child
    * @return {Node} newNode    Node that has been added
    */
    Tree.prototype.addChildNodeTo = function (parentNode, player, reachedBy, iset) {
        var newNode = new GTE.TREE.Node(parentNode, player, reachedBy, iset);
        this.positionsUpdated = false;
        return newNode;
    };

    /**
    * Creates two new moves for a given ISet and the new ISet that
    * the moves will lead to
    * @param {ISet} parentISet ISet that will get two new moves
    */
    Tree.prototype.addChildISetTo = function (parentISet) {
        // Create new information set
        var newISet = this.addNewISet();
        if (parentISet.getPlayer() === null) {
            // Assign parentISet player. Player will be parentISet grandparent player
            var playerToAssign;
            if (parentISet.firstNode.parent.parent !== null) {
                playerToAssign = parentISet.firstNode.parent.parent.player;
            } else {
                // When adding a child to a root's child increment the player
                var rootPlayerId = parentISet.firstNode.parent.player.id;
                if (this.players[rootPlayerId+1] !== null &&
                    this.players[rootPlayerId+1] !== undefined){
                    playerToAssign = this.players[rootPlayerId+1];
                } else {
                    // If incremented player doesn't exist, use 1 to avoid errors
                    playerToAssign = this.players[1];
                }
            }
            parentISet.firstNode.assignPlayer(playerToAssign);
        }
        parentISet.addChildISet(newISet);
        this.positionsUpdated = false;
    };

    /**
    * Creates a new move for a given parent information set and adds a node as
    * child for each member of the information set. It creates a new move and
    * reaches the new children through it
    * @param {ISet} parentISet ISet that will get the new move
    */
    Tree.prototype.addChildNodeToISet = function (parentISet) {
        // Create a new move
        var newMove = parentISet.addNewMove();
        // Get the nodes in parent information set
        var nodesInParentISet = parentISet.getNodes();
        // Iterate over the nodes in the parent and create a child node
        // for each of them. This new node will be connected by the new move
        for (var i = 0; i < nodesInParentISet.length; i++) {
            this.addNewISet().addNewNode(nodesInParentISet[i], null, newMove);
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
    Tree.prototype.zoomOut = function () {
        GTE.canvas.viewbox(0, 0, GTE.canvas.viewbox().width*1.5, GTE.canvas.viewbox().height*1.5);
    };

    /**
    * Gets the nodes that belong to a given information set
    * @param {ISet} iset Information set to get the nodes from
    * @return {Array} returnArray Array that contains the nodes in given iset
    */
    Tree.prototype.getNodesThatBelongTo = function(iset) {
        var returnArray = [];
        this.recursiveGetNodesThatBelongTo(this.root, iset, returnArray);
        return returnArray;
    };

    /**
    * Recursive function that gets nodes that belong to an iset.
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} node Starting node
    * @param {ISet} iset Information set that nodes should belong to
    * @param {Array} returnArray Array that will be returned by the main function
    */
    Tree.prototype.recursiveGetNodesThatBelongTo = function(
                                            node, iset, returnArray) {
        if (node.iset === iset) {
            returnArray.push(node);
        }
        if (!node.isLeaf()) {
            for (var i = 0; i < node.children.length; i++) {
                this.recursiveGetNodesThatBelongTo(
                                    node.children[i], iset, returnArray);
            }
        }
    };

    /**
    * Finds out the next move name
    * @return {String} name Next move name
    */
    Tree.prototype.getNextMoveName = function (oddOrEven) {
        // Get all moves
        var listOfMoves = this.getAllMoves(oddOrEven);
        if (listOfMoves.length === 0) {
            if (oddOrEven === 1) {
                return "A";
            } else {
                return "a";
            }
        }
        var lastMoveName = listOfMoves[listOfMoves.length-1].originalName;
        var capitalized = false;
        // If the player number is odd, capitalize the move name
        if (oddOrEven === 1) {
            capitalized = true;
        }
        var name =  GTE.TREE.Move.generateName(lastMoveName, capitalized);
        return name;
    };

    /**
    * Gets all the moves used in the tree
    * @return {Array} listOfMoves Array that contains all the moves in the tree
    */
    Tree.prototype.getAllMoves = function (oddOrEven) {
        var listOfMoves = [];
        // Iterate over the list of isets and get its moves
        for (var i = 0; i < this.isets.length; i++) {
            if (this.isets[i].moves.length > 0) {
                // Don't include the chance isets into the list
                if (this.isets[i].getPlayer() !== null && this.isets[i].getPlayer().id === 0){
                    continue;
                } else {
                    var comparison = this.isets[i].moves[0].name.toUpperCase() === this.isets[i].moves[0].name;
                    if (comparison == oddOrEven) {
                        for (var j = 0; j < this.isets[i].moves.length; j++) {
                            listOfMoves.push(this.isets[i].moves[j]);
                        }
                    }
                }
            }
        }
        // Sort the list alphabetically
        listOfMoves.sort(GTE.TREE.Move.compare);
        return listOfMoves;
    };

    /**
    * Merges two isets
    * @param  {ISet} a Information set A
    * @param  {ISet} b Information set B
    * @return {ISet}   Merged information set
    */
    Tree.prototype.merge = function (a, b) {
        if (a.numberOfMoves() !== b.numberOfMoves()) {
            window.alert("Couldn't merge the information sets." +
                "Please select two information sets with same number of moves.");
        } else if (a.getPlayer() !== b.getPlayer()) {
            window.alert("Couldn't merge the information sets." +
                "Please select two information sets that belong to same player.");
        } else if (this.iSetsSharePathFromRoot(a, b)) {
            window.alert("Couldn't merge the information sets." +
            "Please select two information sets that do not share a path from root.");
        } else if (a.firstNode === this.root && b.firstNode === this.root) {
            window.alert("Couldn't merge the information sets." +
            "Please select two information sets that do not share a path from root.");
        }else {
            // Add Node A to Node B ISet
            var nodesInA = a.getNodes();
            for (var i = 0; i < nodesInA.length; i++) {
                nodesInA[i].changeISet(b);
            }
        }
        this.positionsUpdated = false;
        return b;
    };

    Tree.prototype.iSetsSharePathFromRoot = function (a, b) {
        // Get path to root for each node in both isets
        var pathsA = [];
        var pathsB = [];

        var nodesInA = a.getNodes();
        var nodesInB = b.getNodes();
        for (var i = 0; i < nodesInA.length; i++) {
            pathsA.push(nodesInA[i].getPathToRoot());
        }
        for (var j = 0; j < nodesInB.length; j++) {
            pathsB.push(nodesInB[j].getPathToRoot());
        }

        var compareLenghts = function (a, b) {
            if (a.length <= b.length) {
                return -1;
            } else {
                return 1;
            }
            return 0;
        };

        // Sort the paths by length
        pathsA.sort(compareLenghts);
        pathsB.sort(compareLenghts);

        // Check if the shortest path is contained in the others
        for (i = 0; i < pathsA.length; i++) {
            for (j = 0; j < pathsB.length; j++) {
                var indexA = pathsA[i].pop();
                var indexB;
                while (indexA) {
                    indexB = pathsB[j].pop();
                    if (indexA === indexB) {
                        if (pathsA[i].length === 0 || pathsB[j].length === 0) {
                            return true;
                        }
                        indexA = pathsA[i].pop();
                    } else {
                        break;
                    }
                }
            }
        }

        // Otherwise return false
        return false;
    };

    /**
    * Centers a node's parents
    * @param {Node} node Node whose parents will be centered
    */
    Tree.prototype.centerParents = function (node) {
        if (!node.isLeaf()) {
            for (var i = 0; i < node.children.length; i++) {
                this.centerParents(node.children[i]);
            }
            var depthDifferenceToLeft = node.children[0].depth - node.depth;
            var depthDifferenceToRight = node.children[node.children.length-1].depth - node.depth;
            var total = depthDifferenceToLeft + depthDifferenceToRight;

            var horizontalDistanceToLeft = depthDifferenceToLeft *
                    (node.children[node.children.length-1].x - node.children[0].x)/total;

            node.x = node.children[0].x + horizontalDistanceToLeft;
        }
    };

    /**
    * Creates a new player with a unique colour and adds it to the list
    * of players
    * @param  {String} [colour] Hex code of the player's colour. If not specified
    *                           get this player's colour from the list of colours
    * @return {Player} player   Created player
    */
    Tree.prototype.newPlayer = function (colour, id, name) {
        // Player ID is incremental
        var id;
        if(id == null) {
            if (this.players.length >= 1) {
                    id = this.players[this.players.length-1].id+1;
                } else {
                    id = GTE.TREE.Player.CHANCE;
            }
        }
        colour = colour || GTE.tools.getColour(this.players.length);
        // Create the new player
        var player = new GTE.TREE.Player(id, colour, name);
        // Add the player to the list of players and return it
        return this.addPlayer(player);
    };

    /**
    * Adds a player to the list of players
    * @param  {Player} player  Player that will be added to the list
    * @return {Player} player  Player added to the list. Null if error.
    */
    Tree.prototype.addPlayer = function (player) {
        try {
            // Check for the player not to be already in the list
            if (this.players.indexOf(player) !== -1) {
                throw "Player already in list";
            }
            // Add the player to the list
            this.players.push(player);
            // If there are payoffs, add new player payoffs
            if (this.isets.length !== 0) {
                for (var j = 0; j < this.leaves.length; j++) {
                    player.payoffs.push(new GTE.TREE.Payoff(this.leaves[j], player));
                }
                player.drawPayoffs();
            }
        } catch (err) {
            console.log("EXCEPTION: " + err);
            return null;
        }
        return player;
    };

    /**
    * Removes last player from the list of players
    * @return {Number} playerId ID of the removed player
    */
    Tree.prototype.removeLastPlayer = function () {
        var playerId = this.players.length-1;
        this.players.splice(playerId, 1);
        this.deassignNodesWithPlayer(playerId);
        this.draw();
        return playerId;
    };

    /**
    * Assigns the current active player to a node
    * @param {Node} node Node that will get the player assigned
    */
    Tree.prototype.assignSelectedPlayerToNode = function (node) {
        // This function simply calls the proper function in the Node and
        // specifies the current active player as the player to assign
        node.assignPlayer(this.players[GTE.tools.getActivePlayer()]);
    };

    /**
    * Deassigns a given player's nodes
    * @param {Number} playerId Player Id that should get its nodes deassigned
    */
    Tree.prototype.deassignNodesWithPlayer = function (playerId) {
        var nodes = this.getAllNodes();
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].player !== null && nodes[i].player !== undefined) {
                if (nodes[i].player.id === playerId) {
                    nodes[i].deassignPlayer();
                }
            }
        }
    };

    /**
    * Checks a colour is unique in the list of players
    * @param  {String}  colour Hex code of the colour to check
    * @return {Boolean} unique Returns false if the colour is not unique
    */
    Tree.prototype.checkColourIsUnique = function (colour) {
        // Iterate over the list of players trying to find that specific colour
        for (var i = 0; i < this.players.length; i++) {
            if (colour === this.players[i].colour) {
                // Return false if colour found
                return false;
            }
        }
        return true;
    };

    /**
    * Hides tree's leaves
    */
    Tree.prototype.hideLeaves = function () {
        var numberLeaves = this.numberLeaves();
        for (var i = 0; i < numberLeaves; i++) {
            this.leaves[i].hide();
        }
        // Also hide all the multiaction lines that contain at least one leaf
        for (var i = 0; i < this.multiActionLines.length; i++) {
            if (this.multiActionLines[i].containsLeaves) {
                this.multiActionLines[i].hide();
            }
        }
    };

    /**
    * Shows tree's leaves
    */
    Tree.prototype.showLeaves = function () {
        var numberLeaves = this.numberLeaves();
        for (var i = 0; i < numberLeaves; i++) {
            this.leaves[i].show();
        }
        // Also show all the multiaction lines that contain at least one leaf
        for (var i = 0; i < this.multiActionLines.length; i++) {
            if (this.multiActionLines[i].containsLeaves) {
                this.multiActionLines[i].show();
            }
        }
    };

    /**
    * Returns the active player
    * @return {Player} player Active Player
    */
    Tree.prototype.getActivePlayer = function () {
        return this.players[GTE.tools.getActivePlayer()];
    };

    /**
    * Recursive function that checks taht all nodes in the tree have a player
    * assigned.
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} [node] Node to start drawing from
    */
    Tree.prototype.recursiveCheckAllNodesHavePlayer = function (node) {
        // In case there is no arguments start from root
        if (node === undefined) {
            node = this.root;
        }
        if (node.children.length !== 0 && (node.player === null || node.player === undefined)) {
            return false;
        }
        for (var i = 0; i < node.children.length; i++) {
            if (this.recursiveCheckAllNodesHavePlayer(node.children[i]) === false) {
                return false;
            }
        }
        return true;
    };

    /**
    * Creates a new singleton information set for each node
    */
    Tree.prototype.initializeISets = function () {
        // Get nodes breadth first
        var nodes = this.getAllNodes(true);
        this.createSingletonISets(nodes);
        this.createPayoffs();
        this.draw();
        // Clean memory
        this.cleanMemoryAfterISetInitialization();
    };

    /**
    * Gets all nodes in tree
    * @param  {Boolean} breadthFirst Whether the list should be breadthFirst or not
    * @return {List}    listOfNodes  List of tree's nodes
    */
    Tree.prototype.getAllNodes = function (breadthFirst) {
        if (breadthFirst) {
            this.nodes = [];
            this.nodes = this.getAllNodesBreadthFirst();
        } else {
            if (this.nodes.length === 0 || this.positionsUpdated === false) {
                this.nodes = [];
                this.recursiveGetAllNodes(this.root, this.nodes);
            }
        }
        return this.nodes;
    };

    /**
    * Recursive function that gets all nodes in tree
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} node        Node to expand through
    * @param {List} listOfNodes List where nodes should be added and that will
    *                           be returned by the non recursive function that
    *                           calls this function
    */
    Tree.prototype.recursiveGetAllNodes = function (node, listOfNodes) {
        for (var i = 0; i < node.children.length; i++) {
            this.recursiveGetAllNodes(node.children[i], listOfNodes);
        }
        listOfNodes.push(node);
    };

    /**
    * Gets all nodes in tree in a breadth first traversal
    * @return {List} listOfNodes List of all the nodes in the tree
    */
    Tree.prototype.getAllNodesBreadthFirst = function () {
        var queue = [];
        var listOfNodes = [];
        queue.push(this.root);
        while (queue.length > 0) {
            var aux = queue.shift();
            listOfNodes.push(aux);
            for (var i = 0; i < aux.children.length; i++) {
                queue.push(aux.children[i]);
            }
        }
        return listOfNodes;
    };

    /**
    * Get all player's nodes accross the tree
    * @param {Number} playerId Id of the player
    * @return {List} playerNodes List of nodes that belong to that player
    */
    Tree.prototype.getPlayerNodes = function (playerId) {
        var allNodes = this.getAllNodes();
        var playerNodes = [];
        for (var i = 0; i < allNodes.length; i++) {
            if (allNodes[i].player !== undefined &&
                allNodes[i].player !== null &&
                allNodes[i].player.id === playerId) {
                playerNodes.push(allNodes[i]);
            }
        }
        return playerNodes;
    };

    /**
    * Get all player's isets accross the tree
    * @param  {Number} playerId    Id of the player
    * @return {List}   playerNodes List of isets that belong to that player
    */
    Tree.prototype.getPlayerISets = function (playerId) {
        var playerISets = [];
        for (var i = 0; i < this.isets.length; i++) {
            if (this.isets[i].getPlayer() !== undefined &&
                this.isets[i].getPlayer() !== null &&
                this.isets[i].getPlayer().id === playerId) {
                playerISets.push(this.isets[i]);
            }
        }
        return playerISets;
    };

    /**
    * Toggles visibility of the chance name
    */
    Tree.prototype.toggleChanceName = function () {
        this.showChanceName = !this.showChanceName;
        if (this.isets.length !== 0) {
            // Get all chance isets
            var isets = this.getPlayerISets(0);
            for (var i = 0; i < isets.length; i++) {
                isets[i].togglePlayerNameVisibility();
            }
        }  else {
            // Get all chance nodes
            var nodes = this.getPlayerNodes(0);
            for (var j = 0; j < nodes.length; j++) {
                nodes[j].togglePlayerNameVisibility();
            }
        }
    };

    /**
    * Updates a given player names accross the tree
    * @param {Player} player Player to be re drawn
    */
    Tree.prototype.updatePlayerNames = function (player) {
        // Get all player's nodes
        var nodes = this.getPlayerNodes(player.id);
        for (var i = 0; i < nodes.length; i++) {
            // Update the text widget
            if (nodes[i].iset !== null && nodes[i].iset.firstNode === nodes[i]) {
                nodes[i].iset.updatePlayerName();
            } else {
                nodes[i].updatePlayerName();
            }
        }
    };

    /**
    * Updates given move names accross the tree
    * @param {Move} move Move to be re drawn
    */
    Tree.prototype.updateMoveNames = function (move) {
        // Get all nodes reached by given move
        var nodes = this.getNodesReachedByMove(move);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].updateMoveName();
        }
    };

    /**
    * Gets all the nodes that are reached by a certain move
    * @param  {Move}  move Certain move that nodes should reached by
    * @return {Array} ret  Array of nodes that are reached by that move
    */
    Tree.prototype.getNodesReachedByMove = function (move) {
        var nodes = move.atISet.getChildrenNodes();
        var ret = [];
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].reachedBy === move) {
                ret.push(nodes[i]);
            }
        }
        return ret;
    };

    /**
    * Returns number of players. Does not include the chance player
    * @return {Number} Number of players
    */
    Tree.prototype.numberOfPlayers = function () {
        return this.players.length - 1;
    };

    /**
    * Checks that a move name is unique throughout the Tree
    * @param  {String}  text Move name to check is unique
    * @return {Boolean}      True if the name is unique
    */
    Tree.prototype.checkMoveNameIsUnique = function (text) {
        var moves = this.getAllMoves();
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].name === text) {
                return false;
            }
        }
        return true;
    };

    /**
    * Gets everything below a given information set
    * @param  {ISet} iset             Information set to get everything below from
    * @return {List} everythingBelow  Everything below given iset
    */
    Tree.prototype.getEverythingBelowISet = function (iset) {
        // Create the list that will be returned
        var everythingBelow = [];
        // Get nodes in given iset and call the recursive function for each
        var nodesInIset = iset.getNodes();
        for (var i = 0; i < nodesInIset.length; i++) {
            this.recursiveGetEverythingBelowISet(nodesInIset[i], everythingBelow);
        }
        return everythingBelow;
    };

    /**
    * Recursive function that fills an array with all the nodes below a given ISet
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param  {Node} node             Node to expand through
    * @param  {List} everythingBelow  List that will be filled
    */
    Tree.prototype.recursiveGetEverythingBelowISet = function (node, everythingBelow) {
        // For each child, call this funcion
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            everythingBelow.push(children[i]);
            this.recursiveGetEverythingBelowISet(children[i], everythingBelow);
        }
    };

    /**
    * Function that aligns the nodes in every information set across the tree
    */
    Tree.prototype.align = function () {
        // Reset all the nodes depths
        var nodes = this.getAllNodes();
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].depth = -1;
        }

        // Calculate max depths for every iset
        for (i = 0; i < this.isets.length; i++) {
            this.isets[i].calculateMaxDepth();
        }
        // Sort the isets by maxNodesDepth
        this.isets.sort(GTE.TREE.ISet.compareY);

        // align all isets
        for (i = 0; i < this.isets.length; i++) {
            this.isets[i].align();
        }
    };

    /**
    * Function that sort outs the collisions across the tree
    */
    Tree.prototype.sortOutCollisions = function () {
        for (var i = 0; i < this.depths.length; i++) {
            // Save current depth. this.depths will be updated during the moving
            // so iterating over the array that is being modified would throw errors
            // like some isets being skipped
            var currentDepth = this.depths[i].slice(0);
            for (var j = 0; j < currentDepth.length; j++) {
                var currentISet = currentDepth[j];
                if (currentISet.isSingleton()) {
                    continue;
                }
                // Check currentISet against the ones on its right
                for (var k = j+1; k < currentDepth.length; k++) {
                    var toCheckAgainst = currentDepth[k];
                    if (currentISet.firstNode.x < toCheckAgainst.firstNode.x &&
                        toCheckAgainst.firstNode.x < currentISet.lastNode.x) {
                        // TODO: IF toCheckAgainst DOES NOt have children, move down
                        // currentISet instead
                        // Remove the ones moved down from the this.depths[i] list, they
                        // are not at this level anymore
                        this.moveDownISetAndEverythingBelow(toCheckAgainst);
                    }
                }
            }
        }
    };

    /**
    * Function that converts a node to a singleton information set
    * @param {Node} node Node to be converted
    */
    Tree.prototype.convertToSingleton = function (node) {
        if (!node.iset.isSingleton()) {
            var oldISet = node.iset;
            // Create a new information set containing given node
            this.createSingletonISet(node);
        }
    };

    /**
    * Function that cleans memory after singleton iset initialization
    */
    Tree.prototype.cleanMemoryAfterISetInitialization = function () {
        var nodes  = this.getAllNodes();
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].cleanAfterISetCreation();
        }
    };

    Tree.prototype.getPathToRoot = function(node) {
        // We need to save the whole move in the path
        // and not only the name because chance nodes
        // cannot be compared by name
        var path = [];
        while(node.reachedBy !== null) {
            path.push(node.reachedBy);
            node = node.parent;
        }
        return path;
    };

    Tree.prototype.changePlayerColour = function(playerId, colour) {
        var player = this.players[playerId];
        if (player && player.colour !== colour) {
            player.changeColour(colour);
            GTE.tools.changePlayerColour(playerId, colour);
        }
    };

    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
