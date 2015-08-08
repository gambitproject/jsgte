GTE.UI.Widgets = (function (parentModule) {
    "use strict";

    /**
    * Creates a new ContentEditable object.
    * @class
    */
    function ContentEditable(x, y, growingOfText, text) {
        this.myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        var textdivContainer = document.createElement("div");
        this.textdiv = document.createElement("div");
        this.textnode = document.createTextNode(text);
        this.textdiv.style.color = this.colour;
        textdivContainer.appendChild(this.textdiv);
        textdivContainer.className = "content-editable-container";
        this.textdiv.appendChild(this.textnode);

        this.textdiv.className = "content-editable";
        if (growingOfText === GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT) { this.textdiv.className += " growToLeft";}
        this.textdiv.setAttribute("contenteditable", "true");
        this.textdiv.setAttribute("width", "auto");

        // this.myforeign.setAttribute("width", "300px");
        this.myforeign.setAttribute("height", "22px");
        this.myforeign.classList.add("foreign"); //to make div fit text
        this.textdiv.classList.add("inside-foreign"); //to make div fit text
        if (growingOfText === GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT) {
            // As text grows to the left, the text contained will
            // be drawn at a distance as big as the size of the inside-foreign.
            // This size is defined in the css and CONTENT_EDITABLE_OFFSET_LEFT
            // is used to move the text the same distance to the left plus a small
            // margin of 1 pixel so it doesn't collide with the line
            x -= GTE.CONSTANTS.CONTENT_EDITABLE_OFFSET_LEFT;
        } else {
            x -= GTE.CONSTANTS.CONTENT_EDITABLE_OFFSET_RIGHT;
        }
        this.myforeign.setAttributeNS(null, "transform", "translate(" + x + " " + y + ")");
        document.getElementsByTagName('svg')[0].appendChild(this.myforeign);
        this.myforeign.appendChild(textdivContainer);

        // Apply some extra width so that the editing flashy line is shown in
        // firefox. If foreign width is the same as the this.textdiv width, firefox
        // will render the flashy line outside the visible area. Making the
        // foreign a little bit bigger does the trick
        var newWidth = this.textdiv.scrollWidth + GTE.CONSTANTS.CONTENT_EDITABLE_FOREIGN_EXTRA_WIDTH;
        this.myforeign.setAttribute("width", newWidth);
        var previousWidth = newWidth;
        var thisContentEditable = this;
        this.textdiv.addEventListener('input', function(e) {
            newWidth = thisContentEditable.textdiv.scrollWidth + GTE.CONSTANTS.CONTENT_EDITABLE_FOREIGN_EXTRA_WIDTH;
            thisContentEditable.myforeign.setAttribute("width", newWidth);
            if (growingOfText === GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT) {
                x -= newWidth - previousWidth;
                thisContentEditable.myforeign.setAttributeNS(null, "transform", "translate(" + x + " " + y + ")");
            }
            previousWidth = newWidth;
        });
        this.textdiv.addEventListener('keydown', function(e) {
            if(e.which == 9) {
                if (thisContentEditable.functionOnSave !== null){
                    thisContentEditable.functionOnSave();
                }
            }
        });
        this.textdiv.addEventListener('keypress', function(e) {
            var max = 30;
            // TODO #21
            // Check for max number of chars
            if(e.which != 8 && this.innerHTML.length > max) {
               e.preventDefault();
            }
            if(e.which == 13) {
                e.preventDefault();
                this.blur();
                window.getSelection().removeAllRanges();
                if (thisContentEditable.functionOnSave !== null){
                    thisContentEditable.functionOnSave();
                }
                return false;
            }
        });
        return this;
    }

    ContentEditable.prototype.show = function () {
        this.myforeign.style.display = "block";
    };

    ContentEditable.prototype.hide = function () {
        this.myforeign.style.display = "none";
    };

    ContentEditable.prototype.visible = function () {
        if (this.myforeign.style.display === "none") {
            return false;
        } else {
            return true;
        }
    };

    ContentEditable.prototype.onSave = function (fun) {
        this.functionOnSave = fun;
        return this;
    };

    ContentEditable.prototype.getText = function () {
        return this.textnode.data;
    };

    ContentEditable.prototype.setText = function (text) {
        this.textnode.data = text;
        return this.textnode.data;
    };

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
