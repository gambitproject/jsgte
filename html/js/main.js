(function () {
    "use strict";
    // Get global canvas and store it in GAMBIT
    // GAMBIT is initialized by the library
    GAMBIT.canvas = SVG('canvas').size("100%", "100%").attr({'style': 'background: #fff'});
    GAMBIT.tools = new GAMBIT.UI.Tools();

    document.getElementById("button-new").addEventListener("click", function(){
        GAMBIT.tools.newTree();
        return false;
    });

    document.getElementById("button-add").addEventListener("click", function(){
        GAMBIT.tools.switchMode(GAMBIT.MODES.ADD);
        return false;
    });

    document.getElementById("button-remove").addEventListener("click", function(){
        GAMBIT.tools.switchMode(GAMBIT.MODES.DELETE);
        return false;
    });

    // // Create a tree and draw it
    // var root = new GAMBIT.TREE.Node(null,"padre");
    // GAMBIT.tree = new GAMBIT.TREE.Tree(root);
    // // var node = GAMBIT.tree.addChildNodeTo(root);
    // // var node1 = GAMBIT.tree.addChildNodeTo(root);

    // // var node2 = GAMBIT.tree.addChildNodeTo(node1);
    // // var node3 = GAMBIT.tree.addChildNodeTo(node1);
    // // var node4 = GAMBIT.tree.addChildNodeTo(node3);
    // // var node5 = GAMBIT.tree.addChildNodeTo(node3);

    // GAMBIT.tree.updatePositions();
    // // Create a node and draw it
    // GAMBIT.tree.draw();

}());
