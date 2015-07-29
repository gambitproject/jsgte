GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Player.
    * @class
    * @param {String} name Player's name.
    */
    function Player(name) {
        this.name = name;
    }

    /**
    * ToString function
    */
    Player.prototype.toString = function () {
        return "Player: " + this.name;
    };

    // Add class to parent module
    parentModule.Player = Player;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
