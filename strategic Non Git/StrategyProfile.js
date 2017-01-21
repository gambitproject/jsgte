//GTE.STR = (function(parentModule) {
//   "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function StrategyProfile (id, payoffVector) {
        this.id = id; // string with the strategy id for each player
        //this.strategyTuple = strategyTuple; //actual n-tuple with the strategies, redundant???
        this.payoffVector = payoffVector; //payoff vector of the strategy profile initialised to 0 vector 
        this.bestResponse = []; // best response is a vector of booleans one for each strategy
                                // if (true, false, false) that means that the strategy of player 1 is a BR
    }

    // Add class to parent module
 /*   parentModule.Strategy = Strategy;

    return parentModule;
}(GTE.STR)); // Add to GTE.TREE sub-module
*/