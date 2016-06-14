GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Move.
    * @class
    * @param {ISet} atISet Parent information set where this move emanates from.
    */
    function Move (name, atISet) {
        this.originalName = name;
        this.name = name;
        this.atISet = atISet;
        this.line = {};
        this.editable = null;
    }

    /**
    * ToString function
    */
    Move.prototype.toString = function () {
        return "Move: " + "name: " + this.name;
    };

    /**
    * Public static function that compares Moves. It is designed to be called as
    * a param for a sort function
    * @param {Move} a Move A that will be compared
    * @param {Move} b Move B that will be compared
    */
    Move.compare = function (a,b) {
        if (a.originalName.length !== b.originalName.length) {
            if (a.originalName.length < b.originalName.length)
                return -1;
            if (a.originalName.length > b.originalName.length)
                return 1;
        } else {
            if (a.originalName < b.originalName)
                return -1;
            if (a.originalName > b.originalName)
                return 1;
        }
        return 0;
    };

    /**
    * Public static function that increments a given name
    * @param {String}  str         A Move name that will be incremented
    * @param {Boolean} capitalized Whether the name should be capitalized or not
    */
    Move.generateName = function (str, capitalized) {
        // Convert to lowercase always to normalize the process
        str = str.toLowerCase();
        for (var i = str.length-1; i >= 0 ; i--) {
            var nextChar = String.fromCharCode(str.charCodeAt(i) + 1);
            if (nextChar === "{") {
                nextChar = "a";
                str = str.substr(0, i) + nextChar + str.substr(i+1, str.length);
                if (i === 0) {
                    str = "a" + str;
                }
            } else {
                str = str.substr(0, i) + nextChar + str.substr(i+1, str.length);
                break;
            }
        }
        if (capitalized === true) {
            return str.toUpperCase();
        }
        return str;
    };

    /**
    * Changes the name of the move
    * @param {String} text New move's name
    */
    Move.prototype.changeName = function (text) {
        if (GTE.tree.checkMoveNameIsUnique(text)) {
            this.name = text;
            return this.name;
        } else {
            return null;
        }
    };

    /**
    * Draws the line and creates a editable label
    * @param {Node} parent Parent node
    * @param {Node} child Child node
    */
    Move.prototype.draw = function(parent, child) {
        var circleRadius = parseInt(GTE.STORAGE.settingsCircleSize)/2;
        var line = GTE.canvas.line(parent.x + circleRadius,
                                    parent.y + circleRadius,
                                    child.x + circleRadius,
                                    child.y + circleRadius)
                              .stroke({ color: parent.player.colour, width: parseInt(GTE.STORAGE.settingsLineThickness) });
        var middleX = ((child.x + circleRadius) - (parent.x + circleRadius))/2+
                        (parent.x);
        var middleY = ((child.y + circleRadius) - (parent.y + circleRadius))/2+
                        (parent.y);

        // Compute a unit vector perpendicular to the line and get point
        // where the label has to be drawn at a distance CONTENT_EDITABLE_MARGIN_TO_LINE
        var dx;
        var dy;
        if (child.x > parent.x) {
            dx = child.x-parent.x;
            dy = child.y-parent.y;
        } else {
            dx = parent.x-child.x;
            dy = parent.y-child.y;
        }
        var distance = Math.sqrt(dx*dx + dy*dy);
        dx = dx/distance;
        dy = dy/distance;
        if (child.x < parent.x ) {
            middleX = middleX - (GTE.CONSTANTS.CONTENT_EDITABLE_MARGIN_TO_LINE/2)*dy;
        } else {
            middleX = middleX + (GTE.CONSTANTS.CONTENT_EDITABLE_MARGIN_TO_LINE/2)*dy;
        }
        middleY = middleY - (GTE.CONSTANTS.CONTENT_EDITABLE_MARGIN_TO_LINE/2)*dx;

        var growingDirectionOfText = GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT;
        if (child.x <= parent.x ) {
            growingDirectionOfText = GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT;
        }
        var contentEditable = new GTE.UI.Widgets.ContentEditable(
                        middleX, middleY, growingDirectionOfText, this.name, "move")
                        .colour(parent.player.colour);
        this.editable = contentEditable;
        // ChanceMove inherits from Move so in order not to having to rewrite this
        // whole function, create a function with all that needs to be modified
        // by ChanceMove
        this.setOnSaveFunction(contentEditable);

        return {
            contentEditable: contentEditable,
            line: line
        };
    };

    /**
    * Sets the onSave function that is trigger when the contentEditable is saved
    * @param {ContentEditable} contentEditable Move's ContentEditable
    */
    Move.prototype.setOnSaveFunction = function (contentEditable) {
        var thisMove = this;
        contentEditable.onSave(
            function () {
                var text = this.getCleanedText();
                if (text === "") {
                    window.alert("Move name should not be empty.");
                } else {
                    thisMove.changeName(text);
                }
                GTE.tree.updateMoveNames(thisMove);
        });
    };

    /**
     * Changes the text of the editable label
     * @param {String} text New Move's text
     */
    Move.prototype.changeText = function(text) {
        this.editable.setText("text");
    };

    /**
    * Get current move position within the set of moves
    * @return {Number} index This move's index in the array of moves
    */
    Move.prototype.getMovePosition = function () {
        return this.atISet.moves.indexOf(this);
    };

    // Add class to parent module
    parentModule.Move = Move;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
