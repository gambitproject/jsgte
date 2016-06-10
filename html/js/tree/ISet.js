/*jshint multistr: true */
GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new information set.
    * @class
    */
    function ISet() {
        this.moves = [];
        this.shape = null;
        this.firstNode = null;
        this.lastNode = null;
        this.numberOfNodes = 0;
        this.maxNodesDepth = -1;
        this.dirty = true;
        this.payoffs = [];
    }

    /**
    * ToString function
    */
    ISet.prototype.toString = function () {
        var string = "ISet: ";
        if (this.firstNode !== null && this.firstNode.reachedBy !== null) {
            string +=  this.firstNode.reachedBy.name;
            if (this.firstNode !== this.lastNode) {
                string +=  "-" + this.lastNode.reachedBy.name;
            }
        }
        return string;
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
    * @param  {Number} [playerId] Player ID of the player that will have the new move
    * @return {Move}   newMove  Move that has been created
    */
    ISet.prototype.addNewMove = function (playerId) {
        // Create a new move and add to the list of moves
        if (playerId === null || playerId === undefined) {
            playerId = this.getPlayer().id;
        }
        var oddOrEvenPlayer = playerId % 2; // 1 if odd
        var newMove;
        if (playerId === 0) {
            // If chance player, calculate probabilities
            var numberOfMoves = this.moves.length + 1;
            var distributedProbability = 1/numberOfMoves;
            // Distribute probabilities across the moves
            for (var i = 0; i < this.moves.length; i++) {
                this.moves[i].setProbability(distributedProbability);
            }
            newMove = new GTE.TREE.ChanceMove(distributedProbability, this);
        } else {
            newMove = new GTE.TREE.Move(
                                GTE.tree.getNextMoveName(oddOrEvenPlayer), this);
        }
        this.moves.push(newMove);
        return newMove;
    };

    /**
    * Adds a given node to current information set
    * @param {Node} node Node that will be added to current information set
    */
    ISet.prototype.addNode = function (node) {
        if (node.children.length === this.moves.length) {
            node.iset = this;
            this.numberOfNodes++;
            this.dirty = true;
            this.updateFirstAndLast();
            // Reaches the children through the moves in the iset
            for (var i = 0; i < node.children.length; i++) {
                node.children[i].reachedBy = this.moves[i];
            }
        } else {
            console.log("ERROR: Could not add node to information set. Number of \
            moves and number of children differ.");
        }
    };

    /**
    * Function that adds a new node to the tree. It creates it and checks
    * if the node is the first or last in its information set
    * @param {Node} parent Node that will be set as parent to the new one
    * @param {Player} player Player to which the node will be assigned
    * @param {Move} reachedBy Move that leads to this new node
    * @return {Node} newNode New node that has been created
    */
    ISet.prototype.addNewNode = function (parent, player, reachedBy) {
        var newNode = new GTE.TREE.Node(parent, player, reachedBy, this);
        this.addNode(newNode);
        return newNode;
    };

    /**
    * Adds a newly created child iset as children for current information set
    * nodes
    * @param {ISet} childISet New information set that current information set
    *                         will be connected to through moves
    */
    ISet.prototype.addChildISet = function (childISet) {
        // Create a new move
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
        // Avoid duplicates
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
        // If it's dirty look for this iset nodes in GTE.tree
        if (this.dirty) {
            this.nodes = GTE.tree.getNodesThatBelongTo(this);
            this.dirty = false;
        }
        return this.nodes;
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
        if (!this.isSingleton()) {
            var width = (this.lastNode.x + parseInt(GTE.STORAGE.settingsCircleSize)*2) -
                        (this.firstNode.x - parseInt(GTE.STORAGE.settingsCircleSize));

            this.shape = GTE.canvas.rect(width, GTE.CONSTANTS.ISET_HEIGHT)
                                    .stroke({ color: this.getPlayer().colour, width: 2 })
                                    .radius(GTE.CONSTANTS.ISET_HEIGHT/2)
                                    .addClass('iset');
            this.shape.translate(this.firstNode.x - parseInt(GTE.STORAGE.settingsCircleSize),
                                this.firstNode.y - parseInt(GTE.STORAGE.settingsCircleSize) + 4);
            var thisISet = this;
            this.shape.click(function() {
                thisISet.onClick();
            });
        }
        if (this.getPlayer()) {
            this.drawPlayer();
        }
    };

    /**
    * Draws the player
    */
    ISet.prototype.drawPlayer = function () {
        var thisPlayer = this.getPlayer();
        var x;
        if (this.isSingleton()) {
            x = this.firstNode.x + GTE.CONSTANTS.TEXT_NODE_MARGIN;
        } else {
            x = (this.lastNode.x + parseInt(GTE.STORAGE.settingsCircleSize) - this.firstNode.x)/2 +
                    this.firstNode.x - (this.playerNameText.width/2);
        }
        this.playerNameText = thisPlayer.draw(x, this.firstNode.y);
        if (thisPlayer.id === 0 && !GTE.tree.showChanceName) {
            this.playerNameText.hide();
        }
    };

    /**
    * Aligns the information set. Sets the nodes in the information set at the same depth.
    */
    ISet.prototype.align = function () {
        // If it is not singleton
        if (this.isSingleton()) {
            // And the depth of the node is not yet set
            if (this.firstNode.depth == -1) {
                // The depth of the node is the same as the level
                this.firstNode.depth = this.firstNode.level;
            }
        } else {
            var nodesInSameISet = this.getNodes();
            for (var i = 0; i < nodesInSameISet.length; i++) {
                // Set the depth of the node to the depth of the deepest
                // node in the iset. This maximum depth is calculated when
                // before in Tree.align().
                nodesInSameISet[i].depth = this.maxNodesDepth;
                // If the node is being pushed down
                if (nodesInSameISet[i].depth > nodesInSameISet[i].level) {
                    GTE.tree.moveDownEverythingBelowNode(nodesInSameISet[i]);
                }
            }
        }
    };



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
        this.dirty = true;
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
                    GTE.tree.addChildNodeToISet(this);
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
                    // Dissolve current iset
                    this.dissolve();
                }
                // Tell the tree to redraw itself
                GTE.tree.draw();
                break;
            case GTE.MODES.PLAYER_ASSIGNMENT:
                // Change the player of every node in the iset
                var nodes = this.getNodes();
                for (var j = 0; j < nodes.length; j++) {
                    GTE.tree.assignSelectedPlayerToNode(nodes[j]);
                }
                // Reassign moves (create new moves and assign them to the
                // children nodes as reachedBy)
                this.reassignMoves();
                GTE.tree.draw();
                break;
            case GTE.MODES.MERGE:
                if (this.getPlayer().id !== 0) {
                    this.select();
                }
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
    * Deletes current moves and creates new ones. It then updates children reachedBys
    */
    ISet.prototype.reassignMoves = function () {
        var numberOfMoves = this.moves.length;
        if (numberOfMoves > 0 ) {
            this.moves = [];
            for (var j = 0; j < numberOfMoves; j++) {
                this.addNewMove();
            }
            // Reassign children
            var nodes = this.getNodes();
            for (j = 0; j < nodes.length; j++) {
                nodes[j].updateChildrenReachedBy();
            }
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
            var firstSelected = GTE.tree.selected.pop();
            // There are two selected nodes. Merge
            if (this !== firstSelected) {
                GTE.tree.merge(firstSelected, this);
            }
            GTE.tree.draw();
        } else {
            if (this.shape !== null) {
                this.shape.toggleClass('selected');
            }
            var nodes = this.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].select();
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

    /**
    * Get all the isets below a given iset. It adds isets below nodes in iset to a given
    * isets array
    */
    ISet.prototype.getISetsBelow = function () {
        var nodes = this.getNodes();
        var isets = [];
        for (var i = 0; i < nodes.length; i++) {
            isets.concat(nodes[i].getISetsBelow());
        }
        return isets;
    };

    /**
    * Gets first node's player: the iset player
    * @return {Player} player Player that has this information set nodes assigned
    */
    ISet.prototype.getPlayer = function () {
        if (this.firstNode !== null) {
            return this.firstNode.player;
        } else {
            return null;
        }
    };

    /**
    * Updates the player text widget
    */
    ISet.prototype.updatePlayerName = function () {
        this.playerNameText.setText(this.getPlayer().name);
        // If there is more than one node, draw the name in the middle point of the iset
        if (!this.isSingleton()) {
            var x = (this.lastNode.x + parseInt(GTE.STORAGE.settingsCircleSize) - this.firstNode.x)/2 +
                    this.firstNode.x - (this.playerNameText.width/2);
            this.playerNameText.translate(x);
        }
    };

    /**
    * Checks if there is more than one node in the information set
    * @return {Boolean} True if there is only one node
    */
    ISet.prototype.isSingleton = function () {
        return this.firstNode === this.lastNode;
    };

    /**
    * Removes child from the information set, which means that if the information
    * set is a singleton, the move that leads to the node will be removed
    * @param {Node} node Child node to remove
    */
    ISet.prototype.removeChild = function (node) {
        if (this.isSingleton()) {
            this.removeMove(node.reachedBy);
        }
    };

    /**
    * Compare function used for sort() function. It sorts isets depending on its x position
    * @param  {ISet}   a ISet a to be compared
    * @param  {ISet}   b ISet b to be compared
    * @return {Number} Returns -1 if a <= b, 1 if a > b
    */
    ISet.compareX = function (a, b) {
        if (parseInt(a.firstNode.x) <= parseInt(b.firstNode.x)) {
            return -1;
        } else {
            return 1;
        }
        return 0;
    };

    /**
    * Compare function used for sort() function. It sorts isets depending on its max depth
    * @param  {ISet}   a ISet a to be compared
    * @param  {ISet}   b ISet b to be compared
    * @return {Number} Returns -1 if a <= b, 1 if a > b
    */
    ISet.compareY = function (a, b) {
        if (parseInt(a.maxNodesDepth) <= parseInt(b.maxNodesDepth)) {
            return -1;
        } else {
            return 1;
        }
        return 0;
    };

    /**
    * Calculates the max depth for all the nodes in the information set. It sets this maximum
    * depth as this.maxNodesDepth for further reference
    * @return {Number} this.maxNodesDepth Max depth for all the nodes in the information set
    */
    ISet.prototype.calculateMaxDepth = function () {
        var nodes = this.getNodes();
        var depths = [];
        for (var i = 0; i < nodes.length; i++) {
            var max = Math.max(nodes[i].depth, nodes[i].level);
            if (depths.indexOf(max) === -1) {
                depths.push(max);
            }
        }
        depths.sort();
        this.maxNodesDepth = depths[depths.length-1];
        return this.maxNodesDepth;
    };

    /**
    * Toggles the visibility of the name text
    */
    ISet.prototype.togglePlayerNameVisibility = function () {
        this.playerNameText.toggle();
    };

    /**
    * Rearranges this iset's chance moves' probabilities
    * @param {Number} position Depending of the position of the move that was
    *                          originally modified, the way the probabilities are
    *                          rearranged differs.
    */
    ISet.prototype.rearrangeProbabilities = function (position) {
        // Define a variable that will store the sum of probability from the leftmost
        // move to the one in "position"
        var probabilityToSet;
        // If the move that was originally modified is the rightmost move
        if (position === this.moves.length - 1) {
            // Assign the spare probability across the other moves of the iset
            probabilityToSet = (1-this.moves[position].probability)/(this.moves.length -1);
            for (var i = 0; i < this.moves.length-1; i++) {
                this.moves[i].setProbability(probabilityToSet);
            }
        } else {
            // Otherwise rearrange to the right
            var totalProbabilityUpToPosition = 0;
            for (var j = 0; j < this.moves.length; j++) {
                // Sum up all the probabilities to the left of position. Include position
                if (j <= position) {
                    totalProbabilityUpToPosition += this.moves[j].probability;
                    if (j === position) {
                        // Distribute the spare probability across the moves to the right
                        probabilityToSet = (1-totalProbabilityUpToPosition)/(this.moves.length-1-position);
                    }
                } else {
                    // Rearrange probabilities to the right of position
                    this.moves[j].setProbability(probabilityToSet);
                }
            }
        }
        // Update all the moves content editables text
        // ContentEditables are saved inside the node so get all the children
        // nodes and update the text
        var nodes = this.getChildrenNodes();
        for (var k = 0; k < nodes.length; k++) {
            nodes[k].updateMoveName();
        }
    };

    // Add class to parent module
    parentModule.ISet = ISet;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
