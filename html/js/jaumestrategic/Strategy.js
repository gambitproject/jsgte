//GTE.STR = (function(parentModule) {
//    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function Strategy(id, name, player) {
        this.id = id; // number between 0 and n-1, n number of strategies
        this.name = name; 
        this.player = player;
    }


    // Add class to parent module
/*    parentModule.Strategy = Strategy;

    return parentModule;
}(GTE.STR)); // Add to GTE.TREE sub-module
*/