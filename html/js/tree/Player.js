GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Player.
    * @class
    * @param {String} name Player's name.
    */
    function Player(id, name, colour) {
        this.id = id;
        this.name = name;
        if (this.id === 0) {
            this.defaultName = GTE.PLAYERS.DEFAULT_CHANCE_NAME;
        } else {
            this.defaultName = GTE.PLAYERS.DEFAULT_PLAYER_NAME + " " + this.id;
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
        this.name = newName;
    };

    /**
    * Draw function for the Player
    * @param {Number} x X coordinate
    * @param {Number} y Y coordinate
    */
    Player.prototype.draw = function (x, y) {
        var thisPlayer = this;
        this.text = GTE.canvas.plain(this.name)
            .x(x + GTE.CONSTANTS.TEXT_NODE_MARGIN)
            .y(y)
            .fill(this.colour)
            .click(function () {
                var newName = window.prompt("Enter the new name");
                if (newName !== null) {
                    thisPlayer.changeName(newName);
                }
                GTE.tree.draw();
            });
        this.defaultText = GTE.canvas.plain(this.defaultName)
            .x(x + GTE.CONSTANTS.TEXT_NODE_MARGIN)
            .y(y)
            .hide()
            .fill(this.colour)
            .click(function () {
                var newName = window.prompt("Enter the new name");
                if (newName !== null) {
                    thisPlayer.changeName(newName);
                }
                GTE.tree.draw();
            });
    };

    /**
    * Toggles the visibility of the default name text
    */
    Player.prototype.toggleDefault = function () {
        console.log("Toggling");
        if (this.defaultText.visible() === false) {
            console.log("Showing");
            this.defaultText.show();
        } else {
            console.log("Hiding");
            this.defaultText.hide();
        }
    };

    // Add class to parent module
    parentModule.Player = Player;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
