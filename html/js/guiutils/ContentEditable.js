GTE.UI.Widgets = (function (parentModule) {
    "use strict";

    /**
    * Creates a new ContentEditable object.
    * @class
    */
    function ContentEditable(x, y, growingOfText, text) {
        var myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        var textdivContainer = document.createElement("div");
        var textdiv = document.createElement("div");
        var textnode = document.createTextNode(text);
        textdivContainer.appendChild(textdiv);
        textdivContainer.className = "content-editable-container";
        textdiv.appendChild(textnode);
        textdiv.className = "content-editable";
        if (growingOfText === -1) { textdiv.className += " growToLeft";}
        textdiv.setAttribute("contenteditable", "true");
        textdiv.setAttribute("width", "auto");

        // myforeign.setAttribute("width", "300px");
        myforeign.setAttribute("height", "22px");
        myforeign.classList.add("foreign"); //to make div fit text
        textdiv.classList.add("inside-foreign"); //to make div fit text
        if (growingOfText === -1) {
            // As text grows to the left, the text contained will
            // be drawn at a distance as big as the size of the inside-foreign.
            // This size is defined in the css and CONTENT_EDITABLE_OFFSET_LEFT
            // is used to move the text the same distance to the left plus a small
            // margin of 1 pixel so it doesn't collide with the line
            x -= GTE.CONSTANTS.CONTENT_EDITABLE_OFFSET_LEFT;
        } else {
            x -= GTE.CONSTANTS.CONTENT_EDITABLE_OFFSET_RIGHT;
        }
        myforeign.setAttributeNS(null, "transform", "translate(" + x + " " + y + ")");
        document.getElementsByTagName('svg')[0].appendChild(myforeign);
        myforeign.appendChild(textdivContainer);

        // Apply some extra width so that the editing flashy line is shown in
        // firefox. If foreign width is the same as the textdiv width, firefox
        // will render the flashy line outside the visible area. Making the
        // foreign a little bit bigger does the trick
        var newWidth = textdiv.scrollWidth + GTE.CONSTANTS.CONTENT_EDITABLE_FOREIGN_EXTRA_WIDTH;
        myforeign.setAttribute("width", newWidth);
        var previousWidth = newWidth;
        textdiv.addEventListener('input', function(e) {
            newWidth = textdiv.scrollWidth + GTE.CONSTANTS.CONTENT_EDITABLE_FOREIGN_EXTRA_WIDTH;
            myforeign.setAttribute("width", newWidth);
            if (growingOfText === -1) {
                x -= newWidth - previousWidth;
                myforeign.setAttributeNS(null, "transform", "translate(" + x + " " + y + ")");
            }
            previousWidth = newWidth;
        });

        textdiv.addEventListener('keypress', function(e) {
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
                return false;
            }
        });
    }

    if (parentModule === undefined) {
        parentModule = {};
    }
    // Add class to parent module
    parentModule.ContentEditable = ContentEditable;

    return parentModule;
}(GTE.UI.Widgets)); // Add to GTE.UI sub-module
