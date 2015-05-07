GAMBIT.UI = (function (parentModule) {
    "use strict";
    // UI tools constructor
    function Tools() {
    }

    Tools.prototype.new = function() {
        var root = new GAMBIT.TREE.Node(null);
        GAMBIT.tree = new GAMBIT.TREE.Tree(root);
        GAMBIT.tree.updatePositions();
        // Create a node and draw it
        GAMBIT.tree.draw();
    };

    Tools.prototype.switchMode = function(button, modeToSwitch){
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