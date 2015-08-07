GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Player.
    * @class
    * @param {String} name Player's name.
    */
    function Player(id, colour) {
        this.id = id;
        if (this.id === 0) {
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

    Player.prototype.onClick = function () {
        var newName = window.prompt("Enter the new name");
        if (newName !== null) {
            newName = newName.trim();
            if (newName === "") {
                window.alert("Player name should not be empty.");
            } else {
                this.changeName(newName);
            }
        }
        GTE.tree.draw();
    };

    // Add class to parent module
    parentModule.Player = Player;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
