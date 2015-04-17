(function () {
    "use strict";
    // Get global canvas and store it in GAMBIT
    // GAMBIT is initialized by the library
    GAMBIT.canvas = SVG('canvas').size(300, 300);

    // Create a tree and draw it
    var root = new GAMBIT.TREE.Node(null);
    var tree = new GAMBIT.TREE.Tree(root);
    
    var node = new GAMBIT.TREE.Node(root);
    var node1 = new GAMBIT.TREE.Node(root);

    // Create a node and draw it
    tree.draw();
    
}());