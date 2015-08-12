GTE.TREE = (function (parentModule) {
    "use strict";

    Player.CHANCE = 0;
    /**
    * Creates a new Player.
    * @class
    * @param {String} name Player's name.
    */
    function Player(id, colour) {
        this.id = id;
        if (this.id === this.CHANCE) {
            this.name = GTE.PLAYERS.DEFAULT_CHANCE_NAME;
            this.defaultName = GTE.PLAYERS.DEFAULT_CHANCE_NAME;
        } else {
            this.name = "" + this.id;
            this.defaultName = "" + this.id;
        }
        this.colour = colour;
    }

    /**
    * ToString function
    */
    Player.prototype.toString = function () {
        return "Player: " + this.name;
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

    Player.prototype.draw = function (x, y) {
        var thisPlayer = this;
        return new GTE.UI.Widgets.ContentEditable(x, y,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                thisPlayer.name)
                .colour(thisPlayer.colour)
                .onSave(function () {
                    var text = this.getText().replace(/&nbsp;/gi,'').trim();
                    if (text === "") {
                        window.alert("Player name should not be empty.");
                    } else {
                        thisPlayer.changeName(text);
                    }
                    GTE.tree.updatePlayerNames(thisPlayer);
                });
    };

    // Add class to parent module
    parentModule.Player = Player;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
