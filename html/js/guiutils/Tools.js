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
        var rootIset = new GTE.TREE.ISet();
        var root = new GTE.TREE.Node(null, null, rootIset);
        GTE.tree = new GTE.TREE.Tree(root);
        GTE.tree.isets.push(rootIset);
        GTE.tree.addChildISetTo(rootIset);
        GTE.tree.updatePositions();
        // Create a node and draw it
        GTE.tree.draw();
    };

    /**
    * Function that switches mode to the one specified by the button pressed
    * @param {Button} button Button pressed that will activate mode
    */
    Tools.prototype.switchMode = function(modeToSwitch){
        // Remove active class from current active button
        var activeButton = document.getElementsByClassName("active button")[0];
        activeButton.className =
            activeButton.className.replace(/\bactive\b/,'');

        // Change the class of the button to active
        var buttonToSwitch = "";
        switch (modeToSwitch) {
            case GTE.MODES.ADD:
                buttonToSwitch = "button-add";
                break;
            case GTE.MODES.DELETE:
                buttonToSwitch = "button-remove";
                break;
            case GTE.MODES.MERGE:
                buttonToSwitch = "button-merge";
                break;
            case GTE.MODES.DISSOLVE:
                buttonToSwitch = "button-dissolve";
                break;
            default:

        }
        document.getElementById(buttonToSwitch).className += " " + "active";

        GTE.MODE = modeToSwitch;
    };

    // Add class to parent module
    parentModule.Tools = Tools;

    return parentModule;
}(GTE.UI)); // Add to GTE.UI sub-module
