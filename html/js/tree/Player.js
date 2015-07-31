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

    // Add class to parent module
    parentModule.Player = Player;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
