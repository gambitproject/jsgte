GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Node.
    * @class
    * @param {Node} [parent] Parent node. If null, this is root.
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
    }

    /**
    * ToString function
    */
    Node.prototype.toString = function () {
        return "Node: " + "children.length: " + this.children.length +
               "; level: " + this.level + "; reachedBy: " + this.reachedBy +
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
            var circleRadius = GTE.CONSTANTS.CIRCLE_SIZE/2;
            this.line = GTE.canvas.line(this.parent.x + circleRadius,
                                        this.parent.y + circleRadius,
                                        this.x + circleRadius,
                                        this.y + circleRadius)
                                    .stroke({ width: GTE.CONSTANTS.LINE_THICKNESS });

        }else if (this.reachedBy !== null) {
            this.reachedBy.draw(this.parent, this);
        }
        var thisNode = this;
        if (this.player && this.player.id === 0){
            this.shape = GTE.canvas.rect(
                          GTE.CONSTANTS.CIRCLE_SIZE, GTE.CONSTANTS.CIRCLE_SIZE);
        } else {
            this.shape = GTE.canvas.circle(GTE.CONSTANTS.CIRCLE_SIZE);
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

        if ((GTE.MODE === GTE.MODES.PLAYERS ||
            GTE.MODE === GTE.MODES.MERGE ||
            GTE.MODE === GTE.MODES.MERGE)
            && this.isLeaf()) {
            this.shape.hide();
        }
    };

    Node.prototype.drawPlayer = function () {
        var thisPlayer = this.player;
        // this.playerNameText = GTE.canvas.plain(thisPlayer.name)
        //     .x(this.x + GTE.CONSTANTS.TEXT_NODE_MARGIN)
        //     .y(this.y)
        //     .fill(thisPlayer.colour)
        //     .click(function() {
        //         thisPlayer.onClick();
        //     });
        this.playerNameText = new GTE.UI.Widgets.ContentEditable(
                this.x + GTE.CONSTANTS.TEXT_NODE_MARGIN,
                this.y,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                thisPlayer.name)
                .colour(thisPlayer.colour)
                .onEnter(function () {
                    thisPlayer.changeName(this.getText());
                    GTE.tree.updatePlayerNames(thisPlayer);
                });
        if (this.player.id === 0 && !GTE.tree.showChanceName) {
            this.playerNameText.hide();
        }
    };

    /**
    * Toggles the visibility of the default name text
    */
    Node.prototype.togglePlayerName = function () {
        if (this.playerNameText.visible() === false) {
            this.playerNameText.show();
        } else {
            this.playerNameText.hide();
        }
    };

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
                } else {
                    this.iset.onClick();
                }
                // Tell the tree to redraw itself
                GTE.tree.draw();
                break;
            case GTE.MODES.DELETE:
                GTE.tree.deleteNode(this);
                // Tell the tree to redraw itself
                GTE.tree.draw();
                break;
            case GTE.MODES.MERGE:
                // This is controlled by the information set
                this.iset.onClick();
                break;
            case GTE.MODES.DISSOLVE:
                // This is controlled by the information set
                this.iset.onClick();
                break;
            case GTE.MODES.PLAYERS:
                if (!this.isLeaf()) {
                    // If player name is empty and default name is hidden,
                    // show the default name
                    if (this.player !== null && this.player !== undefined) {
                        if (GTE.tree.getActivePlayer().id === 0 &&
                                this.player.id === 0) {
                            GTE.tree.toggleChanceName();
                            break;
                        }
                    }
                    GTE.tree.assignSelectedPlayerToNode(this);
                    GTE.tree.draw();
                }
                break;
            default:
                break;
        }
    };

    /**
    * Function that adds child to node
    * @param {Node} node Node to add as child
    * @return {Move} The move that has been created for this child
    */
    Node.prototype.addChild = function (node) {
        this.children.push(node);
        return new GTE.TREE.Move(this, node);
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
    };

    Node.prototype.getChildrenISets = function () {
        var isets = [];
        for (var i = 0; i < this.children.length; i++) {
            if (isets.indexOf(this.children[i].iset) === -1) {
                isets.push(this.children[i].iset);
            }
        }
        return isets;
    };

    Node.prototype.getISetsBelow = function (isets) {
        for (var i = 0; i < this.children.length; i++) {
            this.recursiveGetISetsBelow(this.children[i], isets);
        }
    };

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
    * Creates a new singleton information set with given node.
    * It creates a new move for each node's children
    */
    Node.prototype.createSingletonISetWithNode = function () {
        // Remove current node from current iset
        this.iset.removeNode(this);
        // Create a new iset and add current node to it
        GTE.tree.addNewISet().addNode(this);
        // Add as many moves as node's children
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].reachedBy = this.iset.addNewMove();
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
        // Set the new moves for current children
        // children[] and moves[] will have the same length
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].reachedBy = newISet.moves[i];
        }
    };

    /**
    * Function that tells node to delete himself
    */
    Node.prototype.delete = function () {
        // Delete all references to current node
        if (this.parent.iset !== null) {
            this.parent.iset.removeMove(this.reachedBy);
        }
        this.changeParent(null);
        if (this.iset !== null) {
            this.iset.removeNode(this);
        }
        this.reachedBy = null;
        GTE.tree.positionsUpdated = false;
    };

    /** Assigns a specific player to current node
    * @param {Player} player Player that will be assigned to the node
    */
    Node.prototype.assignPlayer = function (player) {
        this.player = player;
    };

    Node.prototype.hide = function () {
        this.shape.hide();
    };

    Node.prototype.show = function () {
        this.shape.show();
    };

    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
