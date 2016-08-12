//GTE.STR = (function(parentModule) {
//    "use strict";

    /**
     * Creates a new Matrix Class.
     * @class
     * New structure started by Jaume
     */

    /*
     * NormalForm class has an array of players and strategy profiles that have a payoff vector
     */

    function NormalForm() {
        this.players = [];
        this.numberOfPlayers;
        this.strategyProfiles = []; // list of strategy profiles as comma separated strategy.id ("2,1")
    }

    //function to see if it works!
    NormalForm.prototype.displayWindow = function() {
        console.log(this.players);
    };

    NormalForm.prototype.assignPlayers = function(players) {
        this.players = [];
        for(var i=0;i<players.length;i++)
            this.addPlayer(players[i]);
    };

    NormalForm.prototype.addPlayer = function(player) {
        if(this.players.indexOf(player) == -1)
            this.players.push(player);
    };

    NormalForm.prototype.getNumberOfStrategies = function(player) {
        var index = this.players.indexOf(player);
        if(index != -1) {
            return this.players[index].strategies.length;
        }
    };     

    NormalForm.prototype.addStrategyProfile = function (StrategyProfile) {
        this.strategyProfiles.push(StrategyProfile);  
    };

    // input is a vector of strategies one for each player and the payoff vector
    // this function may only be used if the id is not input correctly
    NormalForm.prototype.newSrategyProfile = function (strategies, payoffs) {
        var id;
        for (var i = 0; i<strategies.length; i++) {
            id = strategies[i].id + " ";
        }
        var strProfile = new StrategyProfile(id, strategies, payoffs);

        return this.addStrategyProfile(strProfile);
    };

    NormalForm.prototype.findStrategyName = function (player, stratid) {
        for (var i=0; i<this.players[player].numberOfStrategies; i++) {
            if (this.players[player].strategies[i].id === stratid) {
                return this.players[player].strategies[i].name;
                break;
            }
        }
    };

    // function that retrieves the payoff vector given strategyProfile Id
    NormalForm.prototype.getPayoffVector = function (strategyProfileId) {
        var strProfile = this.findStrategyProfile(strategyProfileId);
            return strProfile.payoffVector;
    };

    // given id retrieves the whole strategyprofile object
    NormalForm.prototype.findStrategyProfile = function (strategyProfileId) {
        for (var i = 0; i<this.strategyProfiles.length; i++) {
            if (this.strategyProfiles[i].id === strategyProfileId) {
                //console.log(this.strategyProfiles[i]);
                return this.strategyProfiles[i];
                break;
            }
        }
    };


    // generates the combinations of strategy profiles (1,1), (1,2) (2,1) (2,2) for a 2x2 game
    // assumes that the information is imputed correctly by another function that retrieves infor from the tree
    NormalForm.prototype.generateStrategyProfiles = function() {
        var strp = [];
        for (var i = 0; i<this.players.length; i++) {
            for (var j = 0; j<this.players[i].strategies.length; j++) {

            // NEEDS to be recursive and maybe compute the permutations
            }

        }

    };

    //initialises the Best Response vector for each strategy profile to false
    NormalForm.prototype.initialiseBestResponsesToFalse = function () {
        var bool = false;
        var profile;
        for (var i=0; i<Normal.strategyProfiles.length; i++) {
            for (var j=0; j<Normal.players.length; j++) {
                this.strategyProfiles[i].bestResponse.push(bool);
            }
        }

    };

    //function that returns the strategy profiles that are pure NE
    NormalForm.prototype.findNE = function () {
        var compare = [];
        for (var i=0; i<this.numberOfPlayers; i++) {
            compare.push(true);
        }
        var strats = [];
        for (var i=0; i<this.strategyProfiles.length; i++) {
            if (this.strategyProfiles[i].bestResponse.toString() === compare.toString()) {
                strats.push(this.strategyProfiles[i]);
            }
        }
        return strats;
    }


    // function that finds the payoff for a given player in a payoff vector
    NormalForm.prototype.playerPayoff = function(player, payoffVector) {
        var str;
        var number = player;
        if (number === 1) {
            str = payoffVector[number - 1]; 
        }
        else {
            if (number === 2) {
                str = payoffVector[number];
            }
            else {
                str = payoffVector[number*2 - 2];
            }
        }
        return str;
    };

    // Finds the BR and fills the strategy profiles BR vector with either False or True values
    // The NE can be derived from here 
    NormalForm.prototype.generateBestResponses = function () {
        var payoff = [];
        var payoffMax;
        var profiles = [];
        var profile;
        Normal.initialiseBestResponsesToFalse();
        for (var i=1; i<=this.numberOfPlayers; i++) {
            var input = Normal.generateStrategiesToCombineRestricted(i);
            var result = Normal.getAllCombinations(input);
            for (var k=0; k<result.length; k++) {
                payoff = [];
                profiles = [];
                for (var j=0; j<this.players[i-1].numberOfStrategies; j++) {
                    var comb = result[k];
                    comb.splice(i-1,0,j);
                    var strat = comb.toString();
                    result[k].splice(i-1,1);
                    //console.log(result);
                    //console.log("strat: " + strat);
                    var stratprofile = Normal.findStrategyProfile(strat);
                    //console.log("stratprofile: " + stratprofile);
                    profiles.push(stratprofile);
                    //console.log("payoff: " + Normal.playerPayoff(i, stratprofile.payoffVector));
                    payoff.push(Normal.playerPayoff(i,stratprofile.payoffVector));
                    if (j === 0) {
                        payoffMax = payoff[j];
                    }
                    else {
                        if (payoffMax <= payoff[j]) {
                            payoffMax = payoff[j];
                        }
                    }                    
                }
                for (var l=0; l<payoff.length; l++) {
                    if (payoff[l] === payoffMax) {
                        profiles[l].bestResponse[i - 1] = true;
                    }
                }
            }
        }
    };

    //returns a vector with the strategy ids for a given player
    NormalForm.prototype.generateStrategiesIdsPlayer = function (player) {
        var strat = [];
        for (var i = 0; i< GTE.STR.player.strategies.length; i++) {
            strat.push(GTE.STR.player.strategies[i].id);
        }
        return strat;
    };

    // generates an array from which we can compute the possible combinations for a given player
    NormalForm.prototype.generateStrategiesToCombineRestricted = function (playerid) {
        var strats = [];
        for (var i = 0; i<this.numberOfPlayers; i++) {
            if (this.players[i].id !== playerid) {
                var strat = [];
                for (var j = 0; j<this.players[i].numberOfStrategies; j++) {
                    strat.push(this.players[i].strategies[j].id);
                }
                strats.push(strat);
            }
        }
        return strats;

    };

    // generates strategies to combine for the set of 1,2 players or the others
    NormalForm.prototype.generateStrategiesToCombineSet = function (LastorFirst) {
        if (LastorFirst === 1) {
            var strats = [];
            for (var i = 2; i<this.numberOfPlayers; i++) {
                var strat = [];
                for (var j = 0; j<this.players[i].numberOfStrategies; j++) {
                strat.push(this.players[i].strategies[j].id);
                }
                strats.push(strat);
            }
            return strats;
        }
        else 
        {
            var strats = [];
            for (var i = 0; i<2; i++) {
                var strat = [];
                for (var j = 0; j<this.players[i].numberOfStrategies; j++) {
                strat.push(this.players[i].strategies[j].id);
                }
                strats.push(strat);
            }
            return strats;
        }
    };

    // generates the strategy array in a format for which we can find the combinations
    NormalForm.prototype.generateStrategiesToCombine = function () {
        var strats = [];
        for (var i = 0; i<this.numberOfPlayers; i++) {
            var strat = [];
            for (var j = 0; j<this.players[i].numberOfStrategies; j++) {
            strat.push(this.players[i].strategies[j].id);
            }
            strats.push(strat);
        }
        return strats;
    };

    // a vector must be given containing all the strategy vectors of ids in an array
    //function found in http://jsfiddle.net/7EakX/
    // aim is to be able to have all the strategy ids combined to create the profiles
    //minor adaptions have to be made to have an output that can be used for the id of Strategy Profiles
    NormalForm.prototype.getAllCombinations = function(arraysToCombine) {
        var divisors = [];
        for (var i = arraysToCombine.length - 1; i >= 0; i--) {
           divisors[i] = divisors[i + 1] ? divisors[i + 1] * arraysToCombine[i + 1].length : 1;
        }
        
        function getPermutation(n, arraysToCombine) {
           var result = [], 
               curArray;    
           for (var i = 0; i < arraysToCombine.length; i++) {
              curArray = arraysToCombine[i];
              result.push(curArray[Math.floor(n / divisors[i]) % curArray.length]);
           }    
           return result;
        }
        
        var numPerms = arraysToCombine[0].length;
        for(var i = 1; i < arraysToCombine.length; i++) {
            numPerms *= arraysToCombine[i].length;
        }
        
        var combinations = [];
        for(var i = 0; i < numPerms; i++) {
            combinations.push(getPermutation(i, arraysToCombine));
        }
        return combinations;
    };

    // given id of profile and payoff vector we assign it to the profile
    NormalForm.prototype.assignPayoffVector = function(strategyProfileId, payoff) {
        if (typeOf(payoff) === array) {
        NormalForm.findStrategyProfile(strategyProfileId).payoffVector = payoff;
        }
        else 
        {
            console.log("Type of payoff must be an array");
        }

    };

 /*   
    parentModule.NormalForm = NormalForm;

    return parentModule;
}(GTE.STR)); // Add to GTE.TREE sub-module*/