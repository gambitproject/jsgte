(function () {
    "use strict";
    // Get global canvas and store it in GTE
    // GTE is initialized by the library
    GTE.canvas = SVG('canvas').size("100%", "100%").attr({'style': 'background: #fff'});
    GTE.tools = new GTE.UI.Tools();

    document.getElementById("button-new").addEventListener("click", function(){
        GTE.tools.newTree();
        return false;
    });

    document.getElementById("button-add").addEventListener("click", function(){
        GTE.tools.switchMode(GTE.MODES.ADD);
        return false;
    });

    document.getElementById("button-remove").addEventListener("click", function(){
        GTE.tools.switchMode(GTE.MODES.DELETE);
        return false;
    });

    // // Create a tree and draw it
    // var root = new GTE.TREE.Node(null,"padre");
    // GTE.tree = new GTE.TREE.Tree(root);
    // // var node = GTE.tree.addChildNodeTo(root);
    // // var node1 = GTE.tree.addChildNodeTo(root);

    // // var node2 = GTE.tree.addChildNodeTo(node1);
    // // var node3 = GTE.tree.addChildNodeTo(node1);
    // // var node4 = GTE.tree.addChildNodeTo(node3);
    // // var node5 = GTE.tree.addChildNodeTo(node3);

    // GTE.tree.updatePositions();
    // // Create a node and draw it
    // GTE.tree.draw();

}());
