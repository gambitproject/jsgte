GTE.TREE = (function (parentModule) {
    "use strict";

    ChanceMove.prototype = new GTE.TREE.Move();
    ChanceMove.prototype.constructor=ChanceMove;

    /**
    * Creates a new chance move
    * @class
    * @param {Number} probability Chance move probability
    * @param {ISet}   atISet      Move's information set
    */
    function ChanceMove(probability, atISet){
        this.atISet = atISet;
        this.line = {};
        this.setProbability(probability);
    }

    /**
    * ToString function
    */
    ChanceMove.prototype.toString = function (){
        return "ChanceMove: " + "probability: " + this.name;
    };

    /**
    * Sets the probability for the given move. It also sets the name as a fraction
    * @param {Number} probability Move A that will be compared
    */
    ChanceMove.prototype.setProbability = function (probability) {
        this.probability = probability;
        var fraction = new GTE.TREE.UTILS.Fraction(probability, false);
        this.name = fraction.toString();
        this.originalName = this.name;
    };

    /**
    * Changes the name of the move
    * @param {String} text New move's name
    */
    ChanceMove.prototype.changeName = function (text) {
        // Parse probability from text
        var split = text.split('/');
        if (split.length === 2) {
            var probability = parseInt(split[0], 10) / parseInt(split[1], 10);
            if (probability >= 1) {
                alert("Probabilities must be smaller than 1.");
                return null;
            } else {
                this.setProbability(probability);
                // Rearrange the rest of the chance moves in the iset
                this.atISet.rearrangeProbabilities(this.getMovePosition());
                return this.probability;
            }
        } else { // If something different to a fraction is set
            alert("Probabilities should be either a decimal number or a fraction.");
            this.changeName(this.name);
            return this.probability;
        }
    };

    /**
    * Sets the onSave function that is trigger when the contentEditable is saved
    * @param {ContentEditable} contentEditable Move's ContentEditable
    */
    ChanceMove.prototype.setOnSaveFunction = function (contentEditable) {
        var thisMove = this;
        contentEditable.onSave(
            function () {
                var text = this.getCleanedText();
                if (text === "") {
                    window.alert("Probabilities cannot be empty.");
                    thisMove.changeName(thisMove.name);
                } else {
                    thisMove.changeName(text);
                }
        });
    };

    // Add class to parent module
    parentModule.ChanceMove = ChanceMove;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
