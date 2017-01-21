GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Node.
    * @class
    * @param {Node}   parent Parent node. If null, this is root.
    * @param {Player} player Node's player
    */
    function Node(parent, player, reachedBy, iset) {
        this.player = player || null;
        this.parent = parent || null;
        this.children = [];
        this.iset = iset || null;
        this.reachedBy = reachedBy || null;
        if (this.parent === null) { // If this is root set level to 0
            this.level = 0;
        } else {
            this.parent.addChild(this);
            this.level = this.parent.level + 1;
        }
        this.depth = this.level;
        this.line = null;
        this.shape = null;
        this.x = null;
        this.y = null;
        this.shape = null;
        this.playerNameText = null;
        this.reachedByText = null;
        this.deleted = false;
    }

    /**
    * ToString function
    */
    Node.prototype.toString = function () {
        return "Node: " + "children.length: " + this.children.length +
               "; level: " + this.level + "; reachedBy: " + this.reachedBy +
               "; depth: " + this.depth +
               "; iset: " + this.iset;
    };

    /**
    * Function that draws the node in the global canvas
    */
    Node.prototype.draw = function () {
        // TODO #19
        // The line has to be drawn before so that the circle is drawn on top of it
        // Draw line if there are is no iset in parent
        if (this.parent !== null && this.reachedBy === null) {
            var circleRadius = parseInt(GTE.STORAGE.settingsCircleSize)/2;
            this.line = GTE.canvas.line(this.parent.x + circleRadius,
                                        this.parent.y + circleRadius,
                                        this.x + circleRadius,
                                        this.y + circleRadius)
                                    .stroke({ width: parseInt(GTE.STORAGE.settingsLineThickness) });

        }else if (this.reachedBy !== null) {
            this.drawReachedBy();
        }
        var thisNode = this;
        if (this.player && this.player.id === GTE.TREE.Player.CHANCE){
            this.shape = GTE.canvas.rect(
                          parseInt(GTE.STORAGE.settingsCircleSize), parseInt(GTE.STORAGE.settingsCircleSize));
        } else {
            this.shape = GTE.canvas.circle(parseInt(GTE.STORAGE.settingsCircleSize));
        }
        this.shape.addClass('node')
                  .x(this.x)
                  .y(this.y)
                  .click(function() {
                      thisNode.onClick();
                  });
        if (this.player) {
            this.shape.fill(this.player.colour);
        } else {
            this.shape.fill(GTE.COLOURS.BLACK);
        }

        if (this.iset === null) {
            // If if belongs to an iset, the iset will draw the player
            if (this.player) {
                this.drawPlayer();
            }
        }

        if ((GTE.MODE === GTE.MODES.PLAYER_ASSIGNMENT ||
            GTE.MODE === GTE.MODES.MERGE ||
            GTE.MODE === GTE.MODES.DISSOLVE) &&
            this.isLeaf()) {
            this.shape.hide();
        }
    };

    /**
    * Draws move that reaches this node
    */
    Node.prototype.drawReachedBy = function () {
        var ret = this.reachedBy.draw(this.parent, this);
        this.line = ret.line;
        this.reachedByText = ret.contentEditable;
    };

    /**
    * Draws the player. It needs to be done within the Node so that there is
    * an instance of ContentEditable per Node
    */
    Node.prototype.drawPlayer = function () {
        var thisPlayer = this.player;
        this.playerNameText = thisPlayer.draw(
            this.x + GTE.CONSTANTS.TEXT_NODE_MARGIN, this.y);
        if (this.player.id === GTE.TREE.Player.CHANCE && !GTE.tree.showChanceName) {
            this.playerNameText.hide();
        }
    };

    /**
    * Toggles the visibility of the name text
    */
    Node.prototype.togglePlayerNameVisibility = function () {
        this.playerNameText.toggle();
    };

    /**
    * Updates player name. It sets the content editable text to the current
    * player name
    */
    Node.prototype.updatePlayerName = function () {
        this.playerNameText.setText(this.player.name);
    };

    /**
    * Function that defines the behaviour of the node on click
    */
    Node.prototype.onClick = function () {
        switch (GTE.MODE) {
            case GTE.MODES.ADD:
                // As talked in email "the phases of creating a game tree"
                // on 26th July 2015, nodes won't have any particular behaviour
                // by clicking on them. The behaviour will be the same as if
                // the click was on an iset
                // // If there are more nodes in the information set
                // // Remove the node from the iset since the iset will
                // // not be coherent
                // if (this.iset.numberOfNodes > 1) {
                //     this.createSingletonISetWithNode();
                // }
                if (this.iset === null) {
                    if (this.isLeaf()) {
                        // If no children, add two, since one child only doesn't
                        // make sense
                        GTE.tree.addChildNodeTo(this);
                    }
                    GTE.tree.addChildNodeTo(this);
                    // Tell the tree to redraw itself
                    GTE.tree.draw();
                } else {
                    this.iset.onClick();
                }
                break;
            case GTE.MODES.DELETE:
                if (this.iset === null) {
                    // If it is a leaf, delete itself, if not, delete all children
                    if (this.isLeaf()) {
                        this.delete();
                    } else {
                        GTE.tree.deleteChildrenOf(this);
                        this.deassignPlayer();
                    }
                    // Tell the tree to redraw itself
                    GTE.tree.draw();
                } else {
                    this.iset.onClick();
                }
                break;
            case GTE.MODES.MERGE:
                // This is controlled by the information set
                this.iset.onClick();
                break;
            case GTE.MODES.DISSOLVE:
                // This is controlled by the information set
                this.iset.onClick();
                break;
            case GTE.MODES.PLAYER_ASSIGNMENT:
                if (!this.isLeaf()) {
                    // If player name is empty and default name is hidden,
                    // show the default name
                    if (this.player !== null && this.player !== undefined) {
                        if (GTE.tree.getActivePlayer().id === GTE.TREE.Player.CHANCE &&
                                this.player.id === GTE.TREE.Player.CHANCE) {
                            GTE.tree.toggleChanceName();
                            break;
                        }
                    }
                    // If there is an iset, let the iset handle the click
                    if (this.iset !== null) {
                        this.iset.onClick();
                    } else {
                        GTE.tree.assignSelectedPlayerToNode(this);
                        GTE.tree.draw();
                    }
                }
                break;
            default:
                break;
        }
    };

    /**
    * Function that adds child to node
    * @param {Node} node Node to add as child
    */
    Node.prototype.addChild = function (node) {
        this.children.push(node);
    };

    /**
    * Function that removes child node from children
    * @param {Node} node Child node to remove
    */
    Node.prototype.removeChild = function (nodeToDelete) {
        var indexInList = this.children.indexOf(nodeToDelete);
        if (indexInList > -1) {
            this.children.splice(indexInList, 1);
        }
        if (this.iset !== null) {
            // Create a new singleton iset containing this node
            // When a child is deleted, the iset is not consistent anymore, since
            // different nodes in the same iset cannot have different number of
            // children
            GTE.tree.convertToSingleton(this);
            this.iset.removeChild(nodeToDelete);
        }
    };

    /**
    * Gets information sets that are connected to this node
    * @return {Array} isets Array that contains all the information sets connected to This
    *                       node.
    */
    Node.prototype.getChildrenISets = function () {
        var isets = [];
        for (var i = 0; i < this.children.length; i++) {
            if (isets.indexOf(this.children[i].iset) === -1) {
                isets.push(this.children[i].iset);
            }
        }
        return isets;
    };

    /**
    * Gets all the information sets below this node
    */
    Node.prototype.getISetsBelow = function () {
        var isets = [];
        for (var i = 0; i < this.children.length; i++) {
            this.recursiveGetISetsBelow(this.children[i], isets);
        }
        return isets;
    };

    /**
    * Recursive function that gets all the information sets below this node
    * Stopping criteria: that the current node is a leaf
    * Recursive expansion: to all of the node's children
    * @param {Node}  node Node to get isets below from
    * @param {Array} isets Return array that contains all the isets
    */
    Node.prototype.recursiveGetISetsBelow = function (node, isets) {
        var iset = node.iset;
        if (isets.indexOf(iset) === -1) {
            isets.push(iset);
        }
        for (var i = 0; i < node.children.length; i++) {
            this.recursiveGetISetsBelow(node.children[i], isets);
        }
    };

    /**
    * Function that finds out if node is leaf
    * @return {Boolean} True if is leaf.
    */
    Node.prototype.isLeaf = function () {
        if (this.children.length === 0) {
            return true;
        }
        return false;
    };

    /**
    * Function that changes node's parent to a given one
    * @param {Node} newParent New parent for node
    */
    Node.prototype.changeParent = function (newParent) {
        if (this.parent !== null) {
            this.parent.removeChild(this);
        }
        this.parent = newParent;
        if (this.parent !== null) {
            this.parent.addChild(this);
        }
    };

    /**
    * Changes current information set to a given one
    * @param {ISet} newISet New information set for current node
    */
    Node.prototype.changeISet = function (newISet) {
        // Remove the node for current information set
        this.iset.removeNode(this);
        // Add the node to the new information set
        newISet.addNode(this);
    };

    /**
    * Function that tells node to delete himself
    */
    Node.prototype.delete = function () {
        // Delete all references to current node
        this.changeParent(null);
        if (this.iset !== null) {
            this.iset.removeNode(this);
        }
        this.reachedBy = null;
        this.deleted = true;
        GTE.tree.positionsUpdated = false;
    };

    /** Assigns a specific player to current node
    * @param {Player} player Player that will be assigned to the node
    */
    Node.prototype.assignPlayer = function (player) {
        this.player = player;
    };

    /**
    * Hides the node shape
    */
    Node.prototype.hide = function () {
        this.shape.hide();
    };

    /**
    * Shows the node shape
    */
    Node.prototype.show = function () {
        this.shape.show();
    };

    /**
    * Updates Move name widget text
    */
    Node.prototype.updateMoveName = function () {
        this.reachedByText.setText(this.reachedBy.name);
    };

    /**
    * Deassigns player
    */
    Node.prototype.deassignPlayer = function () {
        this.player = null;
    };

    /**
    * Get node's children
    * @return {Array} Node's children
    */
    Node.prototype.getChildren = function () {
        return this.children;
    };

    /**
    * Update this node children's reachedBys to match the moves in the ISet
    */
    Node.prototype.updateChildrenReachedBy = function () {
        if (this.iset.moves.length === this.children.length) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].reachedBy = this.iset.moves[i];
            }
        } else {
            console.log("ERROR: MOVES NUMBER DIFFER FROM CHILDREN NUMBER");
        }
    };

    /**
    * Removes from memory unused properties
    */
    Node.prototype.cleanAfterISetCreation = function () {
        if (this.iset !== null) {
            this.playerNameText = null;
        }
    };

    /**
    * Marks current node as selected
    */
    Node.prototype.select = function () {
        if (this.shape !== null) {
            this.shape.toggleClass('selected');
        }
    };

    /**
    * Compare function used for sort() function. It sorts nodes depending on its x position
    * @param  {Node}   a Node a to be compared
    * @param  {Node}   b Node b to be compared
    * @return {Number} Returns -1 if a <= b, 1 if a > b
    */
    Node.compareX = function (a, b) {
        if (parseInt(a.x) <= parseInt(b.x)) {
            return -1;
        } else {
            return 1;
        }
        return 0;
    };

    Node.prototype.getPathToRoot = function () {
        return GTE.tree.getPathToRoot(this);
    };

    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
