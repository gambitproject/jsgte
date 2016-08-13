//GTE.STR = (function (parentModule) {
//    "use strict";

    Player.CHANCE = 0;
    /**
    * Creates a new Player.
    * @class
    * @param {Number} id     Player's id.
    * @param {String} colour Player's hex colour.
    * new structure started by Jaume
    * function is missing the colour property
    */
    function Player(id, numberOfStrategies) {
        this.id = id;
        this.name = "" + this.id;
        this.numberOfStrategies = numberOfStrategies;
        this.strategies = [];
    }

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

    Player.prototype.addStrategy = function (strategy) {
        this.strategies.push(strategy);
    }

    Player.prototype.getStrategies = function () {
        return this.strategies;
    };

    // Add class to parent module
/*    parentModule.Player = Player;

    return parentModule;
}(GTE.STR)); // Add to GTE.TREE sub-module
*/
