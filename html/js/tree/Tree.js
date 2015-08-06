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
        this.depths = [];
        this.leaves = [];
        this.isetsByLevel = [];
        // this.nodesByLevel = [];
        // this.nodesByDepth = [];

        this.players = [];
        this.newPlayer("", GTE.COLOURS.BLACK);
        this.newPlayer(GTE.PLAYERS.DEFAULT_PLAYER_NAME + " 1", GTE.COLOURS.RED);
        this.newPlayer(GTE.PLAYERS.DEFAULT_PLAYER_NAME + " 2", GTE.COLOURS.BLUE);
    }

    /**
    * Function that draws the Game in the global canvas
    * Takes care of updating the positions, clearing the canvas and drawing in it
    */
    Tree.prototype.draw = function(){
        if (!this.positionsUpdated) {
            this.updatePositions();
        }
        this.clear();
        if (this.isets.length >= 0) {
            this.drawISets();
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
    * Function that draws the nodes in the global canvas by calling the recursive
    * function that goes along the tree drawing each node
    */
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
        return this.leaves.length;
    };

    /**
    * Function that updates the different structures used while drawing
    */
    Tree.prototype.updateDataStructures = function () {
        this.leaves = [];
        this.isetsByLevel = [];
        // this.nodesByLevel = [];
        // this.nodesByDepth = [];
        this.depths = [];
        this.recursiveUpdateDataStructures(this.root);
    };

    /**
    * Recursive function that updates the data structures used while drawing
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} node Node to start from
    */
    Tree.prototype.recursiveUpdateDataStructures = function (node) {
        // if (node.iset !== null) {
        //     if (this.isetsByLevel[node.level] === undefined) {
        //         this.isetsByLevel[node.level] = [];
        //     }
        //     if (this.isetsByLevel[node.level].indexOf(node.iset) === -1){
        //         this.isetsByLevel[node.level].push(node.iset);
        //     }
        // }
        // if (this.nodesByLevel[node.level] === undefined) {
        //     this.nodesByLevel[node.level] = [];
        // }
        // this.nodesByLevel[node.level].push(node);
        if (this.depths[node.depth] === undefined) {
            this.depths[node.depth] = [];
        }
        this.depths[node.depth].push(node);
        if (node.isLeaf()) {
            this.leaves.push(node);
        } else {
            for (var i = 0; i < node.children.length; i++) {
                this.recursiveUpdateDataStructures(node.children[i]);
            }
        }
    };

    /**
    * Function that updates the positions of the nodes in the tree
    * This function is called if the drawing function detects that the positions
    * have changed
    */
    Tree.prototype.updatePositions = function () {
        this.updateDataStructures();
        this.updateLeavesPositions();
        this.recursiveUpdatePositions(this.root);
        // this.updateDepths();
        // this.recursiveCheckForCollisions(this.root);
        this.recursiveCalculateYs(this.root);
        this.centerParents(this.root);
        this.positionsUpdated = true;

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

    // Tree.prototype.updateDepths = function () {
    //     this.depths = [];
    //     for (var i = 0; i < this.nodesByDepth.length; i++) {
    //         for (var j = 0; j < this.nodesByDepth[i].length; j++) {
    //             this.nodesByDepth[i][j].calculateDepth();
    //             if (this.depths[this.nodesByDepth[i][j].depth] === undefined){
    //                 this.depths[this.nodesByDepth[i][j].depth] = [];
    //             }
    //             if (this.depths[this.nodesByDepth[i][j].depth].indexOf(this.nodesByDepth[i][j]) === -1) {
    //                 this.depths[this.nodesByDepth[i][j].depth].push(this.nodesByDepth[i][j]);
    //             }
    //         }
    //     }
    // };

    Tree.prototype.recursiveCalculateYs = function (node) {
        for (var i = 0; i < node.children.length; i++) {
            this.recursiveCalculateYs(node.children[i]);
        }
        node.y = node.depth * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
        if ((node.y + GTE.CONSTANTS.CIRCLE_SIZE) > GTE.canvas.viewbox().height) {
            this.zoomOut();
            this.updatePositions();
        }
    };

    Tree.prototype.recursiveCheckForCollisions = function () {
        // Iterate over the depths array
        // for (var i = 0; i < this.depths.length; i++) {
        //     this.depths[i].sort(function (a, b) {
        //         if (parseInt(a.firstNode.x) <= parseInt(b.firstNode.x)) {
        //             return -1;
        //         } else {
        //             return 1;
        //         }
        //         return 0;
        //     });
        //     for (var j = 0; j < this.depths[i].length; j++) {
        //         // For every iset check if there are nodes in the same depth but
        //         // different iset that collide with that iset
        //         var currentIset = this.depths[i][j];
        //         for (var k = j+1; k < this.depths[i].length; k++) {
        //             if ((currentIset.firstNode.x <= this.depths[i][k].firstNode.x) &&
        //                 (this.depths[i][k].lastNode.x <= currentIset.lastNode.x)) {
        //                     this.moveDownEverythingBelow(this.depths[i][k]);
        //             }
        //         }
        //     }
        // }
    };

    /**
    * Recursive function that checks for collisions between leaves and isets.
    * It checks if any leaf is positioned between first and last node of the iset
    * In that case, it will move everything down so that the leaves don't collide
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} node Node that will be checked
    */
    Tree.prototype.recursiveCheckForCollisionsOld = function (node) {
        if (!node.isLeaf()) {
            for (var i = 0; i < node.children.length; i++) {
                this.recursiveCheckForCollisions(node.children[i]);
            }
        }
        // It is only needed to check if current node is the last one
        // in its iset
        if (node.iset.lastNode === node) {
            // Check if iset collides with any other node at different iset
            for (var j = 0; j < this.isets.length; j++) {
                if (this.isets[j] !== node.iset) {
                    var nodesInISet = this.isets[j].getNodes();
                    // Iterate over the nodes in the iset
                    for (var k = 0; k < nodesInISet.length; k++) {
                        if (node.iset.firstNode.x < nodesInISet[k].x &&
                        nodesInISet[k].x < node.iset.lastNode.x) {
                            if (nodesInISet[k].iset.y === node.iset.y) {
                                // They collide
                                // If it collides move everything below a little bit down
                                this.moveDownEverythingBelowNode(node,
                                        GTE.CONSTANTS.VERTICAL_SHIFTING_ON_COLLISIONS);
                                // Only one collision is sufficient to move everything
                                break;
                            }
                        }
                    }
                }
            }
        }
    };

    Tree.prototype.moveDownEverythingBelow = function (iset) {
        var indexInList = this.depths[iset.depth].indexOf(iset);
        this.depths[iset.depth].splice(indexInList, 1);
        iset.depth++;
        if (this.depths[iset.depth] === undefined) {
            this.depths[iset.depth] = [];
        }
        // Check iset is not already in array
        indexInList = this.depths[iset.depth].indexOf(iset);
        if (indexInList === -1) {
            this.depths[iset.depth].push(iset);
        }
        var iSetsToMoveDown = this.getISetsToMoveDown(iset);
        for (var i = 0; i < iSetsToMoveDown.length; i++) {
            this.moveDownEverythingBelow(iSetsToMoveDown[i]);
        }
    };

    /**
    * Function that will shift everything below a given level down
    * @param {ISet} iset ISet that collides
    * @param {Number} level Level to start moving down from
    */
    Tree.prototype.moveDownEverythingBelowISet = function (iset, level, howMuch) {
        iset.y += howMuch;
        var iSetsBelow = iset.getISetsBelow();
        for (var i = 0; i < iSetsBelow.length; i++) {
            this.moveDownEverythingBelowISet(iSetsBelow[i], level, howMuch);
        }
    };

    /**
    * Recursive function that moves everything below down
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node} node Node that will be moved
    */
    Tree.prototype.moveDownEverythingBelowNode = function (node, howMuch) {
        var iSetsToMoveDown = this.getISetsToMoveDown(node);
        for (var i = 0; i < iSetsToMoveDown.length; i++) {
            iSetsToMoveDown[i].y += howMuch;
        }
    };

    // Tree.prototype.getISetsToMoveDown = function (node) {
    Tree.prototype.getISetsToMoveDown = function (iset) {
        // var isets = node.getChildrenISets();
        var isets = iset.getChildrenISets();
        for (var i = 0; i < isets.length; i++) {
            isets[i].getISetsBelow(isets);
        }
        return isets;
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
                // this.leaves[i].y = this.leaves[i].depth * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
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

    Tree.prototype.createSingletonISets = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var newISet = this.addNewISet();
            newISet.addNode(nodes[i]);
            // Add as many moves as node's children
            for (var j = 0; j < nodes[i].children.length; j++) {
                nodes[i].children[j].reachedBy = newISet.addNewMove();
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
        }
        // Delete node. This will also remove the node from the iset
        node.delete();
        if (isetThatContainsNode !== null) {
            // If iset is empty delete it
            if (isetThatContainsNode.getNodes().length === 0) {
                this.deleteISetFromList(isetThatContainsNode);
            }
        }
        if (parent.iset !== null) {
            // Check integrity of parent iset
            this.checkISetIntegrity(parent.iset);
        }
        // Check the tree for collisions
        this.recursiveCheckForCollisions(this.root);
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
                nodesInIset[i].createSingletonISetWithNode();
                // Create a new move that reaches each children of the node
                for (var j = 0; j < nodesInIset[i].children.length; j++) {
                    nodesInIset[i].children[j].reachedBy = nodesInIset[i].iset.addNewMove();
                }
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
        this.positionsUpdated = false;
        return newNode;
    };

    /**
    * Creates two new moves for a given ISet and the new ISet that
    * the moves will lead to
    * @param  {ISet} parentISet ISet that will get two new moves
    */
    Tree.prototype.addChildISetTo = function (parentISet) {
        // Create new information set
        var newISet = this.addNewISet();
        // Get nodes that belong to parentISet as isets don't keep reference of nodes
        var nodesInParentISet = parentISet.getNodes();
        parentISet.addChildISet(newISet, nodesInParentISet);
        this.positionsUpdated = false;
    };

    /**
    * Creates a new move for a given parent information set and adds as many
    * nodes needed in a given child information set. It connects the nodes in
    * parent information set with this new nodes in child information set by
    * through a new move
    * @param  {ISet} parentISet ISet that will get the new move
    * @param  {ISet} [childISet] ISet that will get the new nodes. If null, a
    *                            new information set will be created
    */
    Tree.prototype.addNodesToChildISet = function (parentISet, childISet) {
        // Create a new move
        var newMove = parentISet.addNewMove();
        // Get the nodes in parent information set
        var nodesInParentISet = parentISet.getNodes();
        // Iterate over the nodes in the parent and create a child node
        // for each of them. This new node will be connected by the new move
        for (var i = 0; i < nodesInParentISet.length; i++) {
            (childISet || this.addNewISet()).addNewNode(nodesInParentISet[i], null, newMove);
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

    /**
    * Finds out the next move name
    * @return {String} name Next move name
    */
    Tree.prototype.getNextMoveName = function () {
        // Get all moves
        var listOfMoves = this.getAllMoves();
        if (listOfMoves.length === 0) return "A";
        var lastMoveName = listOfMoves[listOfMoves.length-1].name;
        var name =  GTE.TREE.Move.generateName(lastMoveName);
        return name;
    };

    /**
    * Gets all the moves used in the tree
    * @return {Array} listOfMoves Array that contains all the moves in the tree
    */
    Tree.prototype.getAllMoves = function () {
        var listOfMoves = [];
        // Iterate over the list of isets and get its moves
        for (var i = 0; i < this.isets.length; i++) {
            for (var j = 0; j < this.isets[i].moves.length; j++) {
                listOfMoves.push(this.isets[i].moves[j]);
            }
        }
        // Sort the list alphabetically
        listOfMoves.sort(GTE.TREE.Move.compare);
        return listOfMoves;
    };

    /**
    * Merges two isets
    * @param {ISet} a Information set A
    * @param {ISet} b Information set B
    */
    Tree.prototype.merge = function (a, b) {
        if (a.numberOfMoves() !== b.numberOfMoves()) {
            window.alert("Couldn't merge the information sets." +
                "Please select two information sets with same number of moves.");
        } else if (a.getPlayer() !== b.getPlayer()) {
            window.alert("Couldn't merge the information sets." +
                "Please select two information sets that belong to same player.");
        }else {
            // Add Node A to Node B ISet
            var nodesInA = a.getNodes();
            for (var i = 0; i < nodesInA.length; i++) {
                nodesInA[i].changeISet(b);
            }
        }
        this.positionsUpdated = false;
    };

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
    * Creates a new player with a random unique colour and adds it to the list
    * of players
    * @param  {String}  [name]  The name of the player. If null, it will be the same
    *                           as the player id
    * @param  {String} [colour] Hex code of the player's colour
    * @return {Player} player   Created player
    */
    Tree.prototype.newPlayer = function (name, colour) {
        // Player ID is incremental
        var id;
        if (this.players.length >= 1) {
            id = this.players[this.players.length-1].id+1;
        } else {
            id = 0;
        }
        // If there is no specified name, the name is the same as the id
        if (name === undefined) {
            if (id !== 0){
                name = GTE.PLAYERS.DEFAULT_PLAYER_NAME + " " + id;
            }
        }

        colour = colour || GTE.tools.getColour(this.players.length);
        // Create the new player
        var player = new GTE.TREE.Player(id, name, colour);
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
        } catch (err) {
            console.log("EXCEPTION: " + err);
            return null;
        }
        return player;
    };

    /**
    * Removes a player from the list of players
    * @param  {Player} player Player to be removed
    * @return {Number} index  Index of the removed player. -1 if not found
    */
    Tree.prototype.removePlayer = function (player) {
        try {
            // Get the index of the player in the list
            var index = this.players.indexOf(player);
            if (index === -1) {
                throw "Player not found";
            }
            // Extract that player from the list
            this.players.splice(index, 1);
            return index;
        } catch (err) {
            console.log("EXCEPTION: " + err);
            return -1;
        }
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

    Tree.prototype.hideLeaves = function () {
        var numberLeaves = this.numberLeaves();
        for (var i = 0; i < numberLeaves; i++) {
            this.leaves[i].hide();
        }
    };

    Tree.prototype.showLeaves = function () {
        var numberLeaves = this.numberLeaves();
        for (var i = 0; i < numberLeaves; i++) {
            this.leaves[i].show();
        }
    };

    /**
    * Returns the active player
    * @return {Player} player Active Player
    */
    Tree.prototype.getActivePlayer = function () {
        return this.players[GTE.tools.getActivePlayer()];
    };

    Tree.prototype.recursiveCheckAllNodesHavePlayer = function (node) {
        if (node === undefined) {
            node = this.root;
        }
        if (node.children.length !== 0 && node.player === null) {
            return false;
        }
        for (var i = 0; i < node.children.length; i++) {
            if (this.recursiveCheckAllNodesHavePlayer(node.children[i]) === false) {
                return false;
            }
        }
        return true;
    };

    Tree.prototype.initializeISets = function () {
        var nodes = this.getAllNodes();
        this.createSingletonISets(nodes);
        this.draw();
    };

    Tree.prototype.getAllNodes = function () {
        var listOfNodes = [];
        // Iterate over the list of depths
        for (var i = 0; i < this.depths.length; i++) {
            for (var j = 0; j < this.depths[i].length; j++) {
                listOfNodes.push(this.depths[i][j]);
            }
        }
        return listOfNodes;
    };
    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
