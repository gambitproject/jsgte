GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Bimatrix Class.
     * @class
     */
    function Bimatrix() {
        this.players = [];
        this.strategies = []; // a multidimensional array containing strategicUnit objects
        this.matrix = [];
        this.profiles = {}; // object that has strategy profile properties
        this.cycles = []
    }
    // number of times payoffs are drawn
    var num = 0;

    Bimatrix.prototype.assignPlayers = function(players) {
        this.players = [];
        for(var i=0;i<players.length;i++)
            this.players.push(players[i]);
    };

    Bimatrix.prototype.initialise = function(x, y) {
        //alert('x = ' + x + ' y = ' + y);

        //alert(GTE.tree.players); 
        // Here we have 5 players; chance = 0, plus 4 more
		// We just want players 1 and 2, so we just takes those via slice
        this.assignPlayers(GTE.tree.players.slice(1,3));

		var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
		var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
		
		var strategies1 = [];
		for(var i=0; i < x; i++) { 
			strategies1.push(new GTE.TREE.PureStrategy(0,ALPHABET[i], i));
		}
		this.strategies.push(strategies1);

		var strategies2 = [];
		for(var i=0; i < y; i++) { 
			strategies2.push(new GTE.TREE.PureStrategy(1,alphabet[i], i));
		}
		this.strategies.push(strategies2);
          
        var strBimatrix = this.createStrategies();
        console.log(strBimatrix);
        for(var i = 0; i< strBimatrix.length; i++) {
			var currentStrategyBlock = new GTE.TREE.NewStrategyBlock(strBimatrix[i] , parseInt(i/(this.strategies[0].length)), parseInt(i%(this.strategies[0].length)));
			//currentStrategyBlock.assignPayoffs();
			this.matrix.push(currentStrategyBlock);
			this.initialiseProfiles(strBimatrix, i, parseInt(i/(this.strategies[0].length)), parseInt(i%(this.strategies[0].length)));
        }
		for(var i = 0; i<this.matrix.length; i++) {
			this.matrix[i].assignPartners();
		}
		//this.drawMatrix();
        //this.generateBestResponses();
    };
      
      
    Bimatrix.prototype.initialiseProfiles = function (strBimatrix, index, width, height) {
    // initialises the profiles object and includes correct strategy profiles
    // problem is they are not affected by the editable functionality
        var player1 = new GTE.TREE.Player(1, "#FF0000");
		var player2 = new GTE.TREE.Player(2, "#0000FF");
		var payoff1 = new GTE.TREE.Payoff(player1); //, leafNode);
		var payoff2 = new GTE.TREE.Payoff(player2); //, leafNode);
		// Initialisation of profiles object in Bimatrix constructor, later will be made a function
		payoff1.changeText("0");
		payoff2.changeText("0");
		var payoffs = [payoff1,payoff2];
		var ID = "";
		for (var j=0; j<strBimatrix[index].length; j++) {
			ID = ID + strBimatrix[index][j].id;
			if (j !== (strBimatrix[index].length-1)) ID = ID + ",";
		}
		this.profiles[ID] = {id: ID, payoff: payoffs, bestResponse: [], w: width, h: height, shape: null};
    };

    // Sets best responses to false false for a 2 or 3 player game
    Bimatrix.prototype.initialiseBestResponseToFalse = function () {
        if (this.players.length === 2) {
            for (var property in this.profiles) { 
                if (this.profiles.hasOwnProperty(property)) {
                    this.profiles[property].bestResponse = [false, false];
                    this.profiles[property].payoff[0].bestResponseBool = false;
                    this.profiles[property].payoff[1].bestResponseBool = false;
                }
            }
        } else {
            if (this.players.length === 3) {
                for (var property in this.profiles) { 
                    if (this.profiles.hasOwnProperty(property)) {
                        this.profiles[property].bestResponse = [false, false, false];
                        this.profiles[property].payoff[0].bestResponseBool = false;
                        this.profiles[property].payoff[1].bestResponseBool = false;
                        this.profiles[property].payoff[2].bestResponseBool = false;
                    }
                }
            }
        }
    };

    Bimatrix.prototype.generateBestResponses = function() {
        this.initialiseBestResponseToFalse();
        var payoffMax;
        for (var i=0; i< this.players.length; i++) {
            var combs = this.partialProfilesCombinations(i);
            for (var k=0; k<combs.length; k++) {
                var pfs = [];
                var profs = [];
                for (var j=0; j<this.strategies[i].length; j++) {
                    var comb = combs[k];
                    comb.splice(i, 0, j);
                    var id = comb.toString();
                    combs[k].splice(i,1);
                    pfs.push(this.profiles[id].payoff[i].value);
                    profs.push(this.profiles[id]);
                    if (j === 0) {
                        payoffMax = pfs[j];
                    }
                    else {
                        if (payoffMax <= pfs[j]) {
                            payoffMax = pfs[j];
                        }
                    } 
                }
                for (var l=0; l<pfs.length; l++) {
                    if (pfs[l] === payoffMax) {
                        profs[l].bestResponse[i] = true;
                        profs[l].payoff[i].bestResponseBool = true;
                    }
                }
            }
        }
    };

    // gets the BR for a player given another player strategy, returns the profile not the strategy
    Bimatrix.prototype.getIndividualBR = function(player, strategy){
        var profiles = []
        var otherPlayer = Math.abs(player - 1)
        for(var property in this.profiles) {
            if (this.profiles.hasOwnProperty(property)) {
                var strat = property[player]
                if (player === 1) {
                    strat = property[2]
                }
                if (strat === strategy) {
                    //console.log(strat, strategy)
                    if (this.profiles[property].bestResponse[otherPlayer] === true) {
                        profiles.push(property)
                        return property
                        //console.log(property)
                    }
                }
            }
        }
        //return profiles
    };
    Bimatrix.prototype.genCycles = function() {
        var possibleCycles = new Set([]);
        for(var property in this.profiles) {
            if (this.profiles.hasOwnProperty(property)) {
                possibleCycles.add(property);
            }
        }
        console.log(possibleCycles)

    };


    Bimatrix.prototype.generateCycles = function() {
        var possibleCycles = new Set([]);
        for(var property in this.profiles) {
            if (this.profiles.hasOwnProperty(property)) {
                possibleCycles.add(property);
            }
        }
        var iter = Array.from(possibleCycles)
        while (true) {
            var iter2 = Array.from(possibleCycles);
            if (iter2.length === 0) {
                break;
            }
            else 
            {   
                var cycle = []
                var profile = iter2[0]
                //console.log(profile)
                possibleCycles.delete(profile)
                iter2 = Array.from(possibleCycles)
                var response = this.profiles[profile].bestResponse
                if (response === [1,1]) {
                    this.cycles.push(profile)
                }
                else
                {   
                    cycle.push(profile)
                    var count = 0
                    console.log("START OF NEW CYCLE")
                    while(true) {
                        // HACK need to think about optimal stopping rule
                        if (count === iter.length) {
                            break;
                        }

                        //optimal stopping rule
                        if (iter2.length < 1) {
                            break;
                        }
                        var end = false
                        var response = this.profiles[profile].bestResponse.toString()
                        console.log(iter2)
                        console.log(profile)

                        if (response == [true,false].toString()) {
                        	var previousProfile = profile.toString()
                            for (var i=0; i<iter2.length; i++) {
                            	console.log(iter2[i])
                                if (iter2[i][0] === profile[0]) {
                                    var response2 = this.profiles[iter2[i]].bestResponse[1];
                                    if (response2 === true) {
                                    	console.log(profile)
                                        profile = iter2[i]
                                        possibleCycles.delete(profile)
                                        cycle.push(profile)                                       
                                        iter2 = Array.from(possibleCycles)
                                        break;
                                    }                                  
                                }
                            }
                            console.log("tf")
                            console.log(previousProfile, profile)
                            if (previousProfile[0] !== profile[0]) {
                            	if (previousProfile[2] !== profile[2]){
                            		end = true
                            	}
                            }                            
                        }

                        if (response == [false,true].toString()) {
                        	var previousProfile = profile.toString()
                            for (var i=0; i<iter2.length; i++) {
                                if (iter2[i][2] === profile[2]) {
                                    var response2 = this.profiles[iter2[i]].bestResponse[0]
                                    if (response2 === true){
                                        profile = iter2[i]
                                        possibleCycles.delete(profile)
                                        cycle.push(profile)
                                        iter2 = Array.from(possibleCycles)
                                        break;
                                    }
                                }
                            }
                            console.log("ft")
                            console.log(previousProfile, profile)
                            if (previousProfile[2] !== profile[2]) {
                            	if (previousProfile[0] !== profile[0]) {
                               		end = true                            		
                            	}
                            }
                        }

                        var coordOne, coordTwo
                        if (response == [false,false].toString()) {
                            var player1Best = GTE.tree.matrix.getIndividualBR(1, profile[2])
                            var player2Best = GTE.tree.matrix.getIndividualBR(0, profile[0])
                            coordOne = player1Best[0]
                            coordTwo = player2Best[2]
                            profile = coordOne + "," + coordTwo
                            //console.log(profile)
                            possibleCycles.delete(profile)
                            var alreadyIn = false
                            for (var i = 0; i<cycle.length; i++) {
                                if (cycle[i] === profile) {
                                    alreadyIn = true
                                    break;
                                }
                            }
                            if (alreadyIn === true){
                                break;
                            }
                            cycle.push(profile)
                            iter2 = Array.from(possibleCycles)
                        }
                        count = count + 1
                        console.log(end)
                        if (end === true) {
                        	var element = cycle.pop()
                        	possibleCycles.add(element)
                        	iter2 = Array.from(possibleCycles)
                        	break;
                        }
                    }
                    this.cycles.push(cycle)
                } 
            }
        }
    console.log("Cycles")
    console.log(this.cycles)
    };

    // function that returns all strategy profiles combinations as strings ids in an array
    Bimatrix.prototype.profilesCombinations = function() {
        var numplayers = this.players.length;
        var strategyNumbers = [];
        var currentprofile = [];
        var k;
        for (var i=0; i<this.players.length; i++) {
            strategyNumbers.push(this.strategies[i].length);
            currentprofile.push(0);
        }
        var profiles = [];
        while (true) {
            profiles.push(currentprofile.toString());
            k = numplayers - 1;
            while (k >= 0) {
                currentprofile[k] += 1;
                if (currentprofile[k] < strategyNumbers[k]) {
                    break;
                }
                currentprofile[k]=0;
                k = k - 1;
            }
            if (k<0) break;
        }
        return profiles;
    };

    // function that returns the profiles combinations without the exceptPlayer
    Bimatrix.prototype.partialProfilesCombinations = function(exceptPlayer) {
        var numplayers = this.players.length;
        var strategyNumbers = [];
        var currentprofile = [];
        var k;
        for (var i=0; i<this.players.length; i++) {
            strategyNumbers.push(this.strategies[i].length);
            currentprofile.push(0);
        }
        var partprofiles = [];
        while (true) {
            var auxprofile = [];
            for (var i=0; i<currentprofile.length; i++) {
                if (i !== exceptPlayer) {
            auxprofile.push(currentprofile[i]);
                }
            }
            partprofiles.push(auxprofile);
            k = numplayers -1;
            while (k >= 0) {
                if (k !== exceptPlayer) {
                    currentprofile[k] += 1;
                    if (currentprofile[k] < strategyNumbers[k]) {
                        break;
                    }
                    currentprofile[k] = 0;
                }
                k = k - 1;
            }
            if (k < 0) break;
        }

        for (var i=0; i<partprofiles.length; i++) {

        }
        return partprofiles;
    }

    Bimatrix.prototype.drawMatrixWithProfiles = function() {
        //this.drawUtilities();
        console.log("this is: " + num);
        if (num === 0) {
                GTE.tree.matrix.initialiseBestResponseToFalse();
                num++;
            }
        else 
        {
                GTE.tree.matrix.generateBestResponses();
        }
            
        for(var property in this.profiles) {
            if (this.profiles.hasOwnProperty(property)) {
                this.drawProfile(this.profiles[property]);
            }
        }
    };

    Bimatrix.prototype.drawCycles = function() {
        var colors = ["#FFA500", "#8FBC8F", "#7B68EE", "#87CEEB", "#F08080", "#FF0000", "#0000FF", "#00FF00", "#F5DEB3", "#1E90FF", "#5F9EA0"]
        var letters = 'CDEFGHIJKLMNOP'
        for (var i = 0; i<this.cycles.length; i++){
            for (var j = 0; j<this.cycles[i].length; j++){
                this.drawCycle(this.profiles[this.cycles[i][j]], colors[i], j+1, letters[i])
            }
        }
        this.cycles = []
    };

    Bimatrix.prototype.drawCycle = function(propt, color, text, letter) {
        var x = GTE.CONSTANTS.MATRIX_X;
        var y = GTE.CONSTANTS.MATRIX_Y;
        var size = GTE.CONSTANTS.MATRIX_SIZE;
        //propt.shape = GTE.canvas.rect(10, 10).attr({fill: color, 'fill-opacity': 0.3});
        //propt.shape = GTE.canvas.fillText("Hello", 10, 50)
        //propt.shape.translate(x + propt.w*100 + 43, y + propt.h*100 +43);
        new GTE.UI.Widgets.ContentEditable(
                x + propt.w*100 +45,  y + propt.h*100 +45,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                text, "")
            .colour(color)
            .onSave();  
        new GTE.UI.Widgets.ContentEditable(
                x + propt.w*100 +35,  y + propt.h*100 +35,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                letter, "")
            .colour(color)
            .onSave();    
        return;  
    };

    Bimatrix.prototype.drawProfile = function(propt) {
        var x = GTE.CONSTANTS.MATRIX_X;
        var y = GTE.CONSTANTS.MATRIX_Y;
        var size = GTE.CONSTANTS.MATRIX_SIZE;
        if(propt.payoff.length == 2) {
            //render a 2 player game
            propt.shape = GTE.canvas.rect(size, size).attr({fill: '#fff', 'fill-opacity': 1, stroke: '#000', 'stroke-width': 2});
            propt.shape.translate(x + propt.w*size, y + size * propt.h);
            propt.payoff[0].draw(x + propt.w*size, y + size * propt.h + size * .7);
            propt.payoff[1].draw(x + propt.w*size + size*1.06, y + size * propt.h ,GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT);
            return;
        }
        // render a n player game
        /*
        for(var i = 0; i<this.strategy.strategicUnits.length;i++) {
            for(var j = 0;j<this.strategy.strategicUnits[i].moves.length;j++) {
                this.editable = new GTE.UI.Widgets.ContentEditable(
                    x+j*20+ i*100, 100*this.height,
                    GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                    this.strategy.strategicUnits[i].moves[j].name , "strategy")
                .colour(this.strategy.strategicUnits[i].player.colour);
            }
        }

        for(var i = 0; i<this.strategy.payoffs.length;i++) {
            this.strategy.payoffs[i].draw(500 + x + i*100, 100 * this.height);
        }*/
    };

    Bimatrix.prototype.drawMatrix = function() {
        this.drawUtilities();
        //for(var i = 0;i<this.matrix.length; i++) {
        //    this.matrix[i].draw();
        //}
        // for the payoffs to be drawn with the profiles object
        this.drawMatrixWithProfiles();
    };

    Bimatrix.prototype.drawUtilities = function() {
        // diagonal corner line outwards
        GTE.canvas.line(GTE.CONSTANTS.MATRIX_X,
                GTE.CONSTANTS.MATRIX_Y,
                GTE.CONSTANTS.MATRIX_X-50,
                GTE.CONSTANTS.MATRIX_Y-50)
            //.stroke({ width: parseInt(GTE.STORAGE.settingsLineThickness) });
            // need own linethickness for matrix, for
            // now same as linethickness for boxes
            .stroke({ width: 2 });

        // testing reference points for ContentEditable
        // with a 30px long line going outwards
        // player 1, horizontal left
        // GTE.canvas.line(GTE.CONSTANTS.MATRIX_X-40,
        //     GTE.CONSTANTS.MATRIX_Y-20,
        //     GTE.CONSTANTS.MATRIX_X -70,
        //     GTE.CONSTANTS.MATRIX_Y-20)
        //     .stroke({ width: 8 }) ;
        // // player 2, vertical down - testing 22 px
        // GTE.canvas.line(GTE.CONSTANTS.MATRIX_X-20,
        //     GTE.CONSTANTS.MATRIX_Y-62,
        //     GTE.CONSTANTS.MATRIX_X-20,
        //     GTE.CONSTANTS.MATRIX_Y -40)
        //     .stroke({ width: 8 }) ;
        // // player 2, vertical down - testing overlap
        // GTE.canvas.line(GTE.CONSTANTS.MATRIX_X-10,
        //     GTE.CONSTANTS.MATRIX_Y-62,
        //     GTE.CONSTANTS.MATRIX_X-10,
        //     GTE.CONSTANTS.MATRIX_Y -40)
        //     .stroke({ width: 1 }) ;
        // // player 2, vertical down - testing overlap
        // GTE.canvas.line(GTE.CONSTANTS.MATRIX_X-0,
        //     GTE.CONSTANTS.MATRIX_Y-62,
        //     GTE.CONSTANTS.MATRIX_X-0,
        //     GTE.CONSTANTS.MATRIX_Y -40)
        //     .stroke({ width: 1 }) ;

        this.player1 = new GTE.UI.Widgets.ContentEditable(
                // 6+4 is the magic text offset in the box in
                // guiutils/ContentEditable.js
                GTE.CONSTANTS.MATRIX_X - 40 + 6,
                GTE.CONSTANTS.MATRIX_Y - 20,
                // GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT,
                "I", "player 1")
            .colour(this.players[0].colour) 

        this.player2 = new GTE.UI.Widgets.ContentEditable(
                // 6+4 is the magic text offset in the box in
                // guiutils/ContentEditable.js
                GTE.CONSTANTS.MATRIX_X - 20 - 6,
                // 22 is the magic text height in
                // guiutils/ContentEditable.js
                GTE.CONSTANTS.MATRIX_Y - 40 - 22,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                "II", "player 2")
            .colour(this.players[1].colour) 

        //for(var i=0; i<this.strategies[1].length; i++) {
    	// NO CHANCE PLAYER
        
        for(var i=0; i<this.strategies[0].length; i++) {
           //var string = "";
            //for(var j = 0; j<this.strategies[1][i].moves.length;j++) {
                //string+=this.strategies[1][i].moves[j].name
            //}
            var string = this.strategies[0][i].name;
            var str = new GTE.UI.Widgets.ContentEditable(
                GTE.CONSTANTS.MATRIX_X - 14,
                GTE.CONSTANTS.MATRIX_Y + 36 + i * GTE.CONSTANTS.MATRIX_SIZE,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT,
                string, "player 1")
            .colour(this.players[0].colour);
        }

        //for(var i=0; i<this.strategies[1].length; i++) {
        // NO CHANCE PLAYER
        for(var i=0; i<this.strategies[1].length; i++) {
            //var string = "";
            //for(var j = 0; j<this.strategies[2][i].moves.length;j++) {
                //string+=this.strategies[2][i].moves[j].name
            //}
            var string = this.strategies[1][i].name;
            var str = new GTE.UI.Widgets.ContentEditable(
                GTE.CONSTANTS.MATRIX_X + 35 + i * GTE.CONSTANTS.MATRIX_SIZE,
                GTE.CONSTANTS.MATRIX_Y - 40 ,
                GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                string, "player 2")
            .colour(this.players[1].colour);
        }
        while( GTE.canvas.viewbox().width - GTE.CONSTANTS.MATRIX_X < GTE.tree.matrix.strategies[1].length * GTE.CONSTANTS.MATRIX_SIZE
        ||  GTE.canvas.viewbox().height - GTE.CONSTANTS.MATRIX_Y < GTE.tree.matrix.strategies[0].length * GTE.CONSTANTS.MATRIX_SIZE) {
            GTE.tools.zoomOut();
        }
    };

    Bimatrix.prototype.createStrategiesPermutations = function(strategy, currentPermutations) {
        //alert('Made in to Bimatrix.prototype.createStrategiesPermutations')
        if(strategy==undefined || strategy.length ==0) {
            return currentPermutations;
        }
        else {
            var permutations = [];
            if(currentPermutations.length == 0) {
                for(var i=0;i<strategy.length;i++) {
                    var perm = [];
                    perm.push(strategy[i]);
                    permutations.push(perm);
                }
            }
            else {
                for(var i=0;i<strategy.length;i++) {
                    for(var j = 0; j<currentPermutations.length ; j++) {
                        var perm = currentPermutations[j].slice(0);
                        perm.push(strategy[i]);
                        permutations.push(perm);
                    }
                }
            }
            console.log(permutations);
            return permutations;
        }
    };

    Bimatrix.prototype.createStrategies = function() {
        var strategies = this.strategies;
        if(strategies == undefined || strategies.length == 0) {
            return [];
        } else {
            var str = [];
            for(var i  = 0;i<strategies.length;i++) {
                str = this.createStrategiesPermutations(strategies[i], str);
            }
            return str;
        }
    };

    Bimatrix.prototype.getAllStrategies = function() {
        var st = [];
        for(var i = 0; i<this.strategies.length; i++) {
            st.push(this.strategies[i]);
        }
        return st;
    };

    Bimatrix.prototype.getAllPlayers = function() {
        var pl = [];
        for(var i = 0; i<this.players.length; i++) {
            pl.push(this.players[i]);
        }
        return pl;
    };

    Bimatrix.prototype.strategiesToString = function() {
        for(var i = 0;i<this.strategies.length;i++) {
            for(var j=0;j<this.strategies[i].length;j++) {
                var str = "";
                for (var k = 0;k<this.strategies[i][j].length;k++) {
                    str = str + this.strategies[i][j][k].name;
                }
            }
        }
    };

    Bimatrix.prototype.getMatrixInStringFormat = function(playerIn) {
        var str = "";
        for(var i=0; i<this.strategies[0].length; i++) {
            for(var j=0; j<this.strategies[1].length; j++) {
                var id = i + "," + j;
                str += this.profiles[id].payoff[playerIn].value;
                //str += this.matrix[i*this.strategies[1].length+j].strategy.payoffs[playerIn].value;
                str +=" ";
            }
            str+="\n";
        }
        return str;
    };

    Bimatrix.prototype.setMatrixFromStringFormat = function(playerIn, matrixToSet) {
        matrixToSet = matrixToSet.trim();
        matrixToSet = matrixToSet.split("\n");
        for(var i=0; i<this.strategies[0].length; i++) {
            matrixToSet[i] = matrixToSet[i].trim();
            matrixToSet[i] = matrixToSet[i].split(" ");
            for(var j=0; j<this.strategies[1].length; j++) {
                //alert("i = " + i + " j = " + j)
                var id = i + "," + j;
                this.profiles[id].payoff[playerIn].value =  parseInt(matrixToSet[i][j]);
                this.profiles[id].payoff[playerIn].text = (matrixToSet[i][j]);
                this.matrix[i*this.strategies[1].length+j].strategy.payoffs[playerIn].value = parseInt(matrixToSet[i][j]);
                this.matrix[i*this.strategies[1].length+j].strategy.payoffs[playerIn].text = (matrixToSet[i][j]);
            }
        }
    };

    Bimatrix.prototype.getNumberOfStrategies = function(player) {
        var index = this.players.indexOf(player);
        if(index != -1) {
            return this.strategies[index].length;
        }
    };
    // Add class to parent module
    parentModule.Bimatrix = Bimatrix;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
