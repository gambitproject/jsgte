GAMBIT.UI = (function (parentModule) {
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
        var root = new GAMBIT.TREE.Node(null);
        GAMBIT.tree = new GAMBIT.TREE.Tree(root);
        GAMBIT.tree.updatePositions();
        // Create a node and draw it
        GAMBIT.tree.draw();
    };

    /**
    * Function that swithes mode to the one specified by the button pressed
    * @param {Button} button Button pressed that will activate mode
    */
    Tools.prototype.switchMode = function(button){
        var modeToSwitch = button.getAttribute('mode');
        // Change the class of the button to active
        if (modeToSwitch === 'add') {
            GAMBIT.MODE_ADD = true;
            document.getElementById("button-remove").className =
                document.getElementById("button-remove").className.replace(/\bactive\b/,'');
        } else {
            GAMBIT.MODE_ADD = false;
            document.getElementById("button-add").className =
                document.getElementById("button-add").className.replace(/\bactive\b/,'');
        }
        button.className += " " + "active";
    };

    // Add class to parent module
    parentModule.Tools = Tools;

    return parentModule;
}(GAMBIT.UI)); // Add to GAMBIT.UI sub-module
