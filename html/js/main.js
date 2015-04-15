(function () {
    "use strict";
    // Get global canvas and store it in GAMBIT
    // GAMBIT is initialized by the library
    GAMBIT.canvas = SVG('canvas').size(300, 300);

    // Create a tree and draw it
    var tree = new GAMBIT.TREE.Tree(null);
    // Create a node and draw it
    var node = new GAMBIT.TREE.Node(false, null);
    node.draw();
    
}());