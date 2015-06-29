GTE.UI.Widgets = (function (parentModule) {
    "use strict";

    /**
    * Creates a new ContentEditable object.
    * @class
    */
    function ContentEditable(x, y) {
        var myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        var textdiv = document.createElement("div");
        var textnode = document.createTextNode("Click to edit");
        textdiv.appendChild(textnode);
        textdiv.setAttribute("contentEditable", "true");
        textdiv.setAttribute("width", "auto");

        myforeign.setAttribute("width", "100%");
        myforeign.setAttribute("height", "100%");
        myforeign.classList.add("foreign"); //to make div fit text
        textdiv.classList.add("insideforeign"); //to make div fit text
        myforeign.setAttributeNS(null, "transform", "translate(" + x + " " + y + ")");
        document.getElementsByTagName('svg')[0].appendChild(myforeign);
        myforeign.appendChild(textdiv);

        textdiv.addEventListener('keydown', function(e) {
            if(e.keyCode == 13)
            {
                e.preventDefault();
                this.blur();
            }
        }, false);
    }

    if (parentModule === undefined) {
        parentModule = {};
    }
    // Add class to parent module
    parentModule.ContentEditable = ContentEditable;

    return parentModule;
}(GTE.UI.Widgets)); // Add to GTE.UI sub-module