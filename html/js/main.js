(function () {
    "use strict";
    // Get global canvas and store it in GAMBIT
    // GAMBIT is initialized by the library
    GAMBIT.canvas = SVG('canvas').size(300, 300);

    // Create a tree and draw it
    var root = new GAMBIT.TREE.Node(null,"padre");
    var tree = new GAMBIT.TREE.Tree(root);
    
    var node = new GAMBIT.TREE.Node(root, "node");
    var node1 = new GAMBIT.TREE.Node(root, "node1");
    var node2 = new GAMBIT.TREE.Node(node1, "node2");
    var node3 = new GAMBIT.TREE.Node(node1, "node3");
    var node4 = new GAMBIT.TREE.Node(node3, "node4");
    var node5 = new GAMBIT.TREE.Node(node3, "node5");

    console.log(tree.numberLeaves());

    tree.updatePositions();
    // Create a node and draw it
    tree.draw();
    
}());