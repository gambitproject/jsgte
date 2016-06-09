GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new XmlImporter.
     * @class
     * @param {xml} : Data in xml format
     */
    function XmlImporter(xml) {
        this.xml = xml;
        this.json = null;
    }

    XmlImporter.prototype.parseXmlToJson = function() {
        this.json = X2J.parseXml(this.xml);
    };

    XmlImporter.prototype.loadTree = function() {
        var tree = this.json[0].gte[0];
        var display = this.json[0].gte[0].display[0];
        GTE.tools.resetPlayers(1);
        GTE.tools.activePlayer = -1;
        GTE.tools.isetToolsRan = false;
        var root = new GTE.TREE.Node(null);
        GTE.tree = new GTE.TREE.Tree(root);
        GTE.tools.addChancePlayer();
        GTE.tools.setPlayers(display.color, tree.players[0].player);
        GTE.tools.setDisplayProperties(display);
        this.createTree(tree.extensiveForm[0].node[0], root);
        root.assignPlayer(GTE.tree.players[tree.extensiveForm[0].node[0].jAttr.player]);
        //GTE.tools.switchMode(GTE.MODES.MERGE);
        this.setIsets(tree.extensiveForm[0].node[0], root);
        GTE.tree.draw();
        var listOfIsets = this.getListOfIsets(tree.extensiveForm[0].node[0], root);
        this.mergeIsets(tree.extensiveForm[0].node[0], root, listOfIsets);
        GTE.tools.switchMode(GTE.MODES.ADD);
    };

    /**
    * Builds the sub-tree for the variable @node
    */
    XmlImporter.prototype.createRecursiveTree = function(node, father) {
        var currentNode = GTE.tree.addChildNodeTo( father, GTE.tree.players[node.jAttr.player] );
        for( var i = 0 ; i < node.jIndex.length ; i++) {
            if(node.jIndex[i][0] == "node") {
                this.createRecursiveTree(node.node[node.jIndex[i][1]], currentNode);
            }
            if(node.jIndex[i][0] == "outcome") {
                GTE.tree.addChildNodeTo(currentNode, GTE.tree.players[node.outcome[node.jIndex[i][1]].jAttr.player]);
            }
        }
    };

    /**
    * Function to create nodes of the laoded tree
    */
    XmlImporter.prototype.createTree = function(node, root) {
        //  var root = new GTE.TREE.Node(null, node.jAttr.player);
        for( var i = 0 ; i < node.jIndex.length ; i++) {
            if(node.jIndex[i][0] == "node") {
                this.createRecursiveTree(node.node[node.jIndex[i][1]], root);
            }
            if(node.jIndex[i][0] == "outcome") {
                GTE.tree.addChildNodeTo(root, GTE.tree.players[node.outcome[node.jIndex[i][1]].jAttr.player]);
            }
        }
        return root;
    };

    /**
    * Function to create nodes of the laoded tree
    */
    XmlImporter.prototype.setIsets = function(nodejs, node) {
        GTE.tree.createSingletonISet(node);
        if(nodejs.jIndex != undefined) {
            for( var i = 0 ; i < nodejs.jIndex.length ; i++) {
                if(nodejs.jIndex[i][0] == "node") {
                    this.setIsets(nodejs.node[nodejs.jIndex[i][1]], node.children[i]);
                }
                if(nodejs.jIndex[i][0] == "outcome") {
                    this.setIsets(nodejs.outcome[nodejs.jIndex[i][1]], node.children[i]);
                }
            }
        }
    };

    /**
    * Function that returns a list of isets
    */
    XmlImporter.prototype.getListOfIsets = function(nodejs, node) {
        var list = [node.iset];
        if(nodejs.jIndex != undefined) {
            for( var i = 0 ; i < nodejs.jIndex.length ; i++) {
                if(nodejs.jIndex[i][0] == "node") {
                    list = list.concat(this.getListOfIsets(nodejs.node[nodejs.jIndex[i][1]], node.children[i]));
                }
                if(nodejs.jIndex[i][0] == "outcome") {
                    list = list.concat((this.getListOfIsets(nodejs.outcome[nodejs.jIndex[i][1]], node.children[i])));
                }
            }
        }
        return list;
    };

    XmlImporter.prototype.mergeIsets = function (nodejs, node, listOfIsets) {
        if(node.iset != listOfIsets[nodejs.jAttr.iset] && nodejs.jAttr.iset != undefined){
            var currentIset = node.iset;
            node.changeISet(listOfIsets[nodejs.jAttr.iset]);
            listOfIsets.splice(listOfIsets.indexOf(currentIset), 1);
            GTE.tree.draw();
        }
        if(nodejs.jIndex != undefined) {
            for( var i = 0 ; i < nodejs.jIndex.length ; i++) {
                if(nodejs.jIndex[i][0] == "node") {
                    this.mergeIsets(nodejs.node[nodejs.jIndex[i][1]], node.children[i], listOfIsets);
                }
                if(nodejs.jIndex[i][0] == "outcome") {
                //    this.mergeIsets(nodejs.outcome[nodejs.jIndex[i][1]], node.children[i]);
                }
            }
        }
    };

    // Add class to parent module
    parentModule.XmlImporter = XmlImporter;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
