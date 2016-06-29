GTE.TREE = (function (parentModule) {
    "use strict";

    Player.CHANCE = 0;
    /**
    * Creates a new Player.
    * @class
    * @param {Number} id     Player's id.
    * @param {String} colour Player's hex colour.
    */
    function Player(id, colour, name) {
        this.id = id;
        if(name != null) {
            this.name = name;
        }
        else if (this.id === Player.CHANCE) {
            this.name = GTE.PLAYERS.DEFAULT_CHANCE_NAME;
        } else {
            this.name = "" + this.id;
        }
        this.colour = colour;
        this.payoffs = [];
    }

    /**
    * ToString function
    */
    Player.prototype.toString = function () {
        return "Player: " + "id: " + this.id + "; name: " + this.name +
        "; colour: " + this.colour;
    };

    /**
    * Changes player's name to a given one
    * @param {String} newName New player's name
    */
    Player.prototype.changeName = function (newName) {
        try {
            if (newName !== "") {
                this.name = newName;
            } else {
                throw "Empty name";
            }
        } catch (err) {
            console.log("EXCEPTION: " + err);
        }
    };

    /**
    * Draws the player in a Content Editable
    * @param  {Number}          x               Content editable's x coordinate
    * @param  {Number}          y               Content editable's y coordinate
    * @return {ContentEditable} contentEditable New contentEditable widget that
    *                                           contains player's name
    */
    Player.prototype.draw = function (x, y) {
        var thisPlayer = this;
        return new GTE.UI.Widgets.ContentEditable(x, y,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                thisPlayer.name, "player")
                .colour(thisPlayer.colour)
                .onSave(function () {
                    // Removes all blankspaces. Substitutes &nbsp; characters
                    // with spaces and then trims the text so that there are no
                    // spaces both at the begin and end of the text
                    var text = this.getCleanedText();
                    if (text === "") {
                        window.alert("Player name should not be empty.");
                    } else {
                        thisPlayer.changeName(text);
                    }
                    // Redraw all content editables that represent this Player
                    // across the tree
                    GTE.tree.updatePlayerNames(thisPlayer);
                });
    };

    Player.prototype.changeColour = function(colour) {
        this.colour = colour;
    };

    /**
    * Draws the player's payoffs
    */
    Player.prototype.drawPayoffs = function () {
        for (var i = 0; i < this.payoffs.length; i++) {
            this.payoffs[i].draw();
        }
    };

    /**
    * When adding or deleting nodes from the tree, some nodes could stop being
    * a leaf. This player payoffs will have a payoff.leaf that is not a leaf
    * anymore or that has been deleted. This function checks that every payoff.leaf
    * still exists and it's still a leaf
    */
    Player.prototype.clearOldPayoffs = function () {
        for (var i = 0; i < this.payoffs.length; i++) {
            // If node has been deleted or is not a leaf anymore
            if (this.payoffs[i].leaf.deleted || !this.payoffs[i].leaf.isLeaf()) {
                this.payoffs.splice(i, 1);
                i--;
            }
        }
    };

    // Add class to parent module
    parentModule.Player = Player;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
