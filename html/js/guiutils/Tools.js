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
    
    // Add class to parent module
    parentModule.Tools = Tools;

    return parentModule;
}(GAMBIT.UI)); // Add to GAMBIT.UI sub-module