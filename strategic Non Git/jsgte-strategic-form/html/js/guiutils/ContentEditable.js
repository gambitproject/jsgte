GTE.UI.Widgets = (function (parentModule) {
    "use strict";

    /**
    * Creates a new ContentEditable object.
    * @class
    * @param {Number} x             Widget's x coordinate
    * @param {Number} y             Widget's y coordinate
    * @param {Number} growingOfText Growing direction of text
    * @param {String} text          Widget's text
    * @param {String} cssClass      Widget's cssClass
    */
    function ContentEditable(x, y, growingOfText, text, cssClass) {
        this.x = x;
        this.y = y;
        this.growingOfText = growingOfText;
        // Foreigns are needed in order to insert normal HTML elements within a
        // SVG object. The idea behind the ContentEditable object is to introduce
        // a div with the contenteditable attribute on true so that the user can
        // edit the text inside the div as a normal input field.
        this.myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        this.myforeign.setAttribute("height", "22px");
        this.myforeign.classList.add("content-editable-foreign"); //to make div fit text

        // Create a plain HTML text element with the parameter text
        this.textnode = document.createTextNode(text);
        // Create a div that will contain the text inside it
        this.textdiv = document.createElement("div");
        this.textdiv.style.color = this.colour;
        this.textdiv.appendChild(this.textnode);
        this.textdiv.className = "content-editable";
        if (cssClass !== undefined) {
            this.textdiv.className += " " + cssClass;
        }
        if (growingOfText === GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT) {
            this.textdiv.className += " grow-to-left";
        }
        this.textdiv.setAttribute("contenteditable", "true");
        this.textdiv.setAttribute("width", "auto");
        //to make div fit text
        this.textdiv.classList.add("content-editable-inside-foreign");

        if (growingOfText === GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT) {
            // If text is at left of line in the case of the moves, translate
            // will set the left top corner of the text at the X position.
            // If X is not adjusted, the text will be on top of the line.
            this.x -= GTE.CONSTANTS.CONTENT_EDITABLE_OFFSET_LEFT;
        } else {
            this.x += GTE.CONSTANTS.CONTENT_EDITABLE_OFFSET_RIGHT;
        }
        // Translate the foreign and append it to the svg
        this.translate();
        document.getElementsByTagName('svg')[0].appendChild(this.myforeign);
        this.myforeign.appendChild(this.textdiv);

        // The size of the foreign will be dinamically adjusted depending on the
        // size of the text. This is the only way to achieve text growing to left.
        // The idea is to adjust the width of the foreign and then translate it
        // to the left the same amount it has grown

        // Apply some extra width so that the editing flashy line is shown in
        // firefox. If foreign width is the same as the this.textdiv width, firefox
        // will render the flashy line outside the visible area. Making the
        // foreign a little bit bigger does the trick
        this.width = this.textdiv.scrollWidth +
                            GTE.CONSTANTS.CONTENT_EDITABLE_FOREIGN_EXTRA_WIDTH;
        this.previousWidth = GTE.CONSTANTS.CONTENT_EDITABLE_INSIDE_FOREIGN_MIN_WIDTH;

        this.myforeign.setAttribute("width", this.width);
        if (growingOfText === GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT) {
            // Calculate how much has the foreign grown
            this.x -= (this.width - this.previousWidth);
            // Translate the foreign object that amount to the left
            this.translate();
        }
        this.previousWidth = this.width;
        // Save this for further use
        var thisContentEditable = this;
        this.textdiv.addEventListener('input', function(e) {
            // Check text is not longer than max
            var max = 30;
            if(this.innerHTML.length > max) {
                this.innerHTML = this.innerHTML.slice(0, max);
                e.preventDefault();
                this.blur();
                window.getSelection().removeAllRanges();
            }
            // Set the new width based on the text width
            thisContentEditable.width = thisContentEditable.textdiv.scrollWidth +
                            GTE.CONSTANTS.CONTENT_EDITABLE_FOREIGN_EXTRA_WIDTH;
            thisContentEditable.myforeign.setAttribute("width", thisContentEditable.width);
            if (growingOfText === GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT) {
                // Calculate how much has the foreign grown
                thisContentEditable.x -=
                    (thisContentEditable.width - thisContentEditable.previousWidth);
                // Translate the foreign object that amount to the left
                thisContentEditable.translate();
            }
            thisContentEditable.previousWidth = thisContentEditable.width;
        });

        // blur event is used to detect when the contenteditable loses focus
        this.textdiv.addEventListener('blur', function(e) {
            if (thisContentEditable.functionOnSave !== null){
                // Run functionOnSave
                thisContentEditable.functionOnSave();
            }
        });

        this.textdiv.addEventListener('focus', function(e) {
            if (thisContentEditable.functionOnSave !== null){
                //Select the div completely
                document.execCommand('selectAll',false,null);
            }
        });

        // keypress is used to detect the RETURN key and to apply a max number
        // of characters allowed
        this.textdiv.addEventListener('keypress', function(e) {
            // TODO #21
            if(e.which == 13) {
                // If RETURN is pressed
                // Blur the input instead of adding a line break
                e.preventDefault();
                this.blur();
                window.getSelection().removeAllRanges();
                return false;
            }
        });
        return this;
    }

    /**
    * Function that shows the foreign object by modifying its CSS display property
    * @return {ContentEditable} this Returns this instance
    */
    ContentEditable.prototype.show = function () {
        this.myforeign.style.display = "block";
        return this;
    };

    /**
    * Function that hides the foreign object by modifying its CSS display property
    * @return {ContentEditable} this Returns this instance
    */
    ContentEditable.prototype.hide = function () {
        this.myforeign.style.display = "none";
        return this;
    };

    /**
    * Function that returns current object visibility
    * @return {Boolean} visible Returns true if object is visible
    */
    ContentEditable.prototype.visible = function () {
        if (this.myforeign.style.display === "none") {
            return false;
        } else {
            return true;
        }
    };

    /**
    * Function that toggles the visibility of the ContentEditable
    * @return {Boolean} visible Returns true if object is visible
    */
    ContentEditable.prototype.toggle = function () {
        if (this.visible() === false) {
            this.show();
        } else {
            this.hide();
        }
        return this.visible();
    };

    /**
    * Function that specifies the function to be run on save (when the input
    * gets out of focus). It saves the function pointer specified on params
    * as this.functionOnSave. When the Object detects a blur event on the input,
    * it will run the function saved in this.functionOnSave.
    * @param {Function} fun Function to be run on save
    * @return {ContentEditable} this Returns this instance
    */
    ContentEditable.prototype.onSave = function (fun) {
        this.functionOnSave = fun;
        return this;
    };

    ContentEditable.prototype.getCleanedText = function () {
        return this.getText().replace(/&nbsp;/gi,' ')
                        .replace(/<br>/gi, '')
                        .replace(/<\/br>/gi, '').trim();
    };

    /**
    * Returns the current displayed text
    * @return {String} text Current text
    */
    ContentEditable.prototype.getText = function () {
        return this.textdiv.innerHTML;
    };

    /**
    * Sets current text to the text specified on params
    * @param {String} text Text to be set
    * @return {String} currentText Current text after set
    */
    ContentEditable.prototype.setText = function (text) {
        this.textdiv.innerHTML = text;
        // Set the new width based on the text width
        this.width = this.textdiv.scrollWidth +
                            GTE.CONSTANTS.CONTENT_EDITABLE_FOREIGN_EXTRA_WIDTH;
        this.myforeign.setAttribute("width", this.width);
        if (this.growingOfText === GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT) {
            // Calculate how much has the foreign grown
            this.x -= (this.width - this.previousWidth);
            // Translate the foreign object that amount to the left
            this.translate();
        }
        this.previousWidth = this.width;

        return this.getText();
    };

    /**
    * Sets contentEditable's colour
    * @param {Colour} colour Colour to be set
    */
    ContentEditable.prototype.setColour = function (colour) {
        this.textdiv.style.color = colour;
    };

    /**
    * Translates contentEditable
    * @param {Number} x X position
    * @param {Number} y Y position
    */
    ContentEditable.prototype.translate = function (x, y) {
        this.x = x || this.x;
        this.y = y || this.y;
        this.myforeign.setAttributeNS(null, "transform", "translate(" + this.x + " " + this.y + ")");
    };

    /**
    * Changes text colour
    * @param {Colour} colour Hex code of the colour to be set
    * @return {ContentEditable} this Returns this instance
    */
    ContentEditable.prototype.colour = function (colour) {
        this.textdiv.style.color = colour;
        this.colour = colour;
        return this;
    };

    if (parentModule === undefined) {
        parentModule = {};
    }
    // Add class to parent module
    parentModule.ContentEditable = ContentEditable;

    return parentModule;
}(GTE.UI.Widgets)); // Add to GTE.UI sub-module
