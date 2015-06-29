GTE.UI = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Tools object.
    * @class
    */
    function Tools() {
    }

    /**
    * Function called when New button is pressed.
    * It creates a new Tree and draws it
    */
    Tools.prototype.newTree = function() {
        var root = new GTE.TREE.Node(null);
        var child1 = new GTE.TREE.Node(root);
        var child2 = new GTE.TREE.Node(root);
        GTE.tree = new GTE.TREE.Tree(root);
        GTE.tree.updatePositions();
        // Create a node and draw it
        GTE.tree.draw();
    };

    /**
    * Function that switches mode to the one specified by the button pressed
    * @param {Button} button Button pressed that will activate mode
    */
    Tools.prototype.switchMode = function(modeToSwitch){
        // Change the class of the button to active
        GTE.MODE = modeToSwitch;
        if (modeToSwitch === GTE.MODES.ADD) {
            document.getElementById("button-remove").className =
                document.getElementById("button-remove").className.replace(/\bactive\b/,'');
            document.getElementById("button-add").className += " " + "active";
        } else {
            if (modeToSwitch === GTE.MODES.DELETE) {
                document.getElementById("button-add").className =
                    document.getElementById("button-add").className.replace(/\bactive\b/,'');
                document.getElementById("button-remove").className += " " + "active";
            }
        }
    };

    // Add class to parent module
    parentModule.Tools = Tools;

    return parentModule;
}(GTE.UI)); // Add to GTE.UI sub-module
