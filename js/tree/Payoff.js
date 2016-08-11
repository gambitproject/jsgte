GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Payoff.
     * @class
     * @param {Node}   leaf   Leaf where Payoff is attached
     * @param {Player} player Player that gets this payoff
     */
    function Payoff(leaf, player) {
        this.value = null;
        this.text = null;
        this.editable = null;
        this.changeText("0");
        this.leaf = leaf;
        this.player = player;
    }

    /**
     * Changes the value of the payoff
     * @param {Number} value New payoff's value
     */
    Payoff.prototype.setValue = function(value) {
        this.value = value;
    };

    /**
     * Draws the editable label
     */
    Payoff.prototype.draw = function(x1, y1, orientation) {
        var x = x1 || this.leaf.x;
        var y = y1 || this.leaf.y + (this.player.id * 20);
        orientation = orientation || GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT;
        var thisPayoff = this;
        this.editable = new GTE.UI.Widgets.ContentEditable(
                x, y,
                orientation,
                this.text, "payoff")
            .colour(this.player.colour)
            .onSave(
                function() {
                    switch (GTE.STRATEGICFORMMODE) {
                        case GTE.STRATEGICFORMMODES.TREE:
                            var text = this.getCleanedText();
                            if (text === "") {
                                window.alert("Payoff should not be empty.");
                            } else {
                                thisPayoff.changeText(text);
                            }
                            break;
                        case GTE.STRATEGICFORMMODES.GENERAL:
                            var text = this.getCleanedText();
                            if (text === "") {
                                window.alert("Payoff should not be empty.");
                            } else {
                                thisPayoff.changeText(text);
                            }
                            break;
                        case GTE.STRATEGICFORMMODES.ZEROSUM:
                            var text = this.getCleanedText();
                            if (text === "") {
                                window.alert("Payoff should not be empty.");
                            } else {
                                thisPayoff.changeText(text);
                                if(text[0]!='-') {
                                    //it is a negative number
                                    thisPayoff.partner.changeText("-"+text);
                                } else {
                                    //it is a positive number
                                    thisPayoff.partner.changeText(text.substr(1));
                                }
                            }
                            break;
                        case GTE.STRATEGICFORMMODES.SYMMETRIC:
                            var text = this.getCleanedText();
                            if (text === "") {
                                window.alert("Payoff should not be empty.");
                            } else {
                                thisPayoff.changeText(text);
                                thisPayoff.partner.changeText(text);
                            }
                            break;
                        default:
                            break;
                }
                });
    };

    /**
     * Changes the text of the editable label
     * @param {String} text New payoff's text
     */
    Payoff.prototype.changeText = function(text) {
        // Remove leading 0
        var value = parseFloat(text, 10);
        // Check if it's a fraction
        var split = text.split('/');
        if (split.length === 2) {
            value = parseInt(split[0], 10) / parseInt(split[1], 10);
        }
        // Check if it is not a number
        if (!isNaN(value)) {
            // Set the value
            this.setValue(value);
            // If decimal
            if (value % 1 !== 0) {
                // Display the label as a fraction
                this.text = new GTE.TREE.UTILS.Fraction(value, false).toString();
            } else {
                // If it is not decimal, display the value itself
                this.text = this.value;
            }
            if (this.editable !== null) {
                // Update the ContentEditable text
                this.editable.setText(this.text);
            }
        } else {
            window.alert("Payoff should be a number.");
            // In order to get the previous text back, change text to current this.text
            this.changeText(this.text);
        }
        return this.value;
    };

    // Add class to parent module
    parentModule.Payoff = Payoff;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
