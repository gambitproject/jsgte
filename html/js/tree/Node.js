GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Node.
    * @class
    * @param {Node} [parent] Parent node. If null, this is root.
    */
    function Node(parent, player) {
        this.player = player;
        this.parent = parent;
        this.children = [];

        this.reachedBy = null;
        if (parent === null) { // If this is root set level to 0
            this.level = 0;
        } else {
            this.reachedBy = parent.addChild(this);
            this.level = parent.level + 1;
        }

        this.y = this.level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
    }

    /**
    * ToString function
    */
    Node.prototype.toString = function nodeToString() {
        return "Node: " + "children.length: " + this.children.length + "; level: " + this.level + "; move: " + this.reachedBy;
    };

    /**
    * Function that draws the node in the global canvas
    */
    Node.prototype.draw = function () {
        // The line has to be drawn before so that the circle is drawn on top of it
        if (this.reachedBy !== null) {
            this.reachedBy.draw();
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
            this.drawPlayer();
        } else {
            this.shape.fill(GTE.COLOURS.BLACK);
        }

        if (GTE.MODE === GTE.MODES.PLAYERS && this.isLeaf()) {
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
                .onEnter(function () {
                    window.alert("sssave");
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

    /**
    * Function that defines the behaviour of the node on click
    */
    Node.prototype.onClick = function () {
        switch (GTE.MODE) {
            case GTE.MODES.ADD:
                if (this.isLeaf()) {
                    // Always start with two nodes
                    GTE.tree.addChildNodeTo(this);
                }
                GTE.tree.addChildNodeTo(this);
                // Tell the tree to redraw itself
                GTE.tree.draw();
                break;
            case GTE.MODES.DELETE:
                // If it is a leaf, delete itself, if not, delete all children
                if (this.isLeaf()) {
                    this.delete();
                } else {
                    GTE.tree.deleteChildrenOf(this);
                }
                GTE.tree.draw();
                break;
            case GTE.MODES.PLAYERS:
                if (!this.isLeaf()) {
                    // If player name is empty and default name is hidden,
                    // show the default name
                    if (this.player !== undefined) {
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
    * Function that tells node to delete himself
    */
    Node.prototype.delete = function () {
        this.changeParent(null);
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
