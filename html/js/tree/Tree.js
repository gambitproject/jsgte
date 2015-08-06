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

        this.players = [];
        this.newPlayer("", GTE.COLOURS.BLACK);
        this.newPlayer(GTE.PLAYERS.DEFAULT_PLAYER_NAME + " 1", GTE.COLOURS.RED);
        this.newPlayer(GTE.PLAYERS.DEFAULT_PLAYER_NAME + " 2", GTE.COLOURS.BLUE);
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
                this.recursiveDraw(node.children[i]);
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
    Tree.prototype.zoomOut = function () {
        GTE.canvas.viewbox(0, 0, GTE.canvas.viewbox().width*1.5, GTE.canvas.viewbox().height*1.5);
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
    * Removes last player from the list of players
    */
    Tree.prototype.removeLastPlayer = function () {
        if (this.players.length === 3) {
            return -1;
        }
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

    Tree.prototype.deassignNodesWithPlayer = function (playerId) {
        var nodes = this.getAllNodes();
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].player !== null && nodes[i].player !== undefined) {
                if (nodes[i].player.id === playerId) {
                    nodes[i].player = null;
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

    Tree.prototype.getAllNodes = function () {
        var listOfNodes = [];
        this.recursiveGetAllNodes(this.root, listOfNodes);
        return listOfNodes;
    };

    Tree.prototype.recursiveGetAllNodes = function (node, listOfNodes) {
        for (var i = 0; i < node.children.length; i++) {
            this.recursiveGetAllNodes(node.children[i], listOfNodes);
        }
        listOfNodes.push(node);
    };

    // Add class to parent module
    parentModule.Tree = Tree;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
