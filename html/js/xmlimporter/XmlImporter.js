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

    /**
    * Function that parses xml data to
    * Json using third party software
    */
    XmlImporter.prototype.parseXmlToJson = function() {
        this.json = X2J.parseXml(this.xml);
    };

    /**
    * Main function that loads the tree
    */
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
        this.assignChancePlayers(tree.extensiveForm[0].node[0], root);
        if (GTE.tools.ableToSwitchToISetEditingMode()) {
            GTE.tree.initializeISets();
            this.isetToolsRan = true;
            var listOfIsets = this.getListOfIsets(tree.extensiveForm[0].node[0], root, {});
            this.mergeIsets(listOfIsets);
            this.assignMoves(tree.extensiveForm[0].node[0], root);
            this.assignPayoffs(tree.extensiveForm[0].node[0], root);
        }
        GTE.tree.draw();
        GTE.tools.switchMode(GTE.MODES.ADD);
    };

    /**
    * Builds the sub-tree for the variable @node
    */
    XmlImporter.prototype.createRecursiveTree = function(node, father) {
        var index = GTE.tree.players.map(function(el) {
                          return el.name;
                        }).indexOf(node.jAttr.player);
        var currentNode = GTE.tree.addChildNodeTo(father, GTE.tree.players[index]);
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
        var index = GTE.tree.players.map(function(el) {
                  return el.name;
                }).indexOf(node.jAttr.player);
        root.assignPlayer(GTE.tree.players[index]);
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
    * Function to assign Chance Players to Nodes recursively
    */
    XmlImporter.prototype.assignRecursiveChancePlayers = function(nodejs, node) {
        if(this.isChanceNode(nodejs)) {
            node.assignPlayer(GTE.tree.players[0]);
        }
        for( var i = 0 ; i < nodejs.jIndex.length ; i++) {
            if(nodejs.jIndex[i][0] == "node") {
                this.assignRecursiveChancePlayers(nodejs.node[nodejs.jIndex[i][1]], node.children[i]);
            }
        }
    };

    /**
    * Function to assign Chance Players to Nodes
    * @param {node} the node to which the chance
    * player is to be assigned in json
    * @param {root} Reference to the node to which
    * chancePlayer is to be assigned
    */
    XmlImporter.prototype.assignChancePlayers = function(node, root) {
        if(this.isChanceNode(node)) {
            root.assignPlayer(GTE.tree.players[0]);
        }
        //  var root = new GTE.TREE.Node(null, node.jAttr.player);
        for( var i = 0 ; i < node.jIndex.length ; i++) {
            if(node.jIndex[i][0] == "node") {
                this.assignRecursiveChancePlayers(node.node[node.jIndex[i][1]], root.children[i]);
            }
        }
    };

    /**
    * Function that checks if a given node
    * is has chancePlayer assigned to it
    * @param {node} node in json format
    */
    XmlImporter.prototype.isChanceNode = function(node) {
        for( var i = 0 ; i < node.jIndex.length ; i++) {
            if(node.jIndex[i][0] == "node") {
                if(node.node[node.jIndex[i][1]].jAttr.prob != undefined)
                    return true;
            }
            if(node.jIndex[i][0] == "outcome") {
                if(node.outcome[node.jIndex[i][1]].jAttr.prob != undefined)
                    return true;
            }
        }
        return false;
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
    XmlImporter.prototype.getListOfIsets = function(nodejs, node, list) {
        if(nodejs.jAttr.iset != undefined) {
            if(list[nodejs.jAttr.iset] == undefined){
                list[nodejs.jAttr.iset] = [];
            }
            list[nodejs.jAttr.iset].push(node);
        }
        if(nodejs.jIndex != undefined) {
            for( var i = 0 ; i < nodejs.jIndex.length ; i++) {
                if(nodejs.jIndex[i][0] == "node") {
                    list = this.getListOfIsets(nodejs.node[nodejs.jIndex[i][1]], node.children[i], list);
                }
            }
        }
        return list;
    };

    /**
    * Function that merges isets according
    * to the loaded tree
    * @param {listOfIsets} Object containing a list
    * of nodes with similar isets
    */
    XmlImporter.prototype.mergeIsets = function (listOfIsets) {
        for (var index in listOfIsets) {
            for(var i = 1; i<listOfIsets[index].length; i++) {
                listOfIsets[index][i].changeISet(listOfIsets[index][0].iset);
                GTE.tree.draw();
            }
        }
    };

    /**
    * Function that assigns moves to nodes
    * according to the data returned by their
    * father node
    * @param {nodejs} Node in json format
    * @param {node} Reference to the node
    */
    XmlImporter.prototype.assignMoves = function (nodejs, node) {
        for( var i = 0 ; i < nodejs.jIndex.length ; i++) {
            if(nodejs.jIndex[i][0] == "node") {
                if(nodejs.node[nodejs.jIndex[i][1]].jAttr.prob != undefined) {
                    node.iset.moves[i].changeName(nodejs.node[nodejs.jIndex[i][1]].jAttr.prob);
                } else {
                    node.iset.moves[i].changeText(nodejs.node[nodejs.jIndex[i][1]].jAttr.move);
                }
                this.assignMoves(nodejs.node[nodejs.jIndex[i][1]], node.children[i]);
            }
            if(nodejs.jIndex[i][0] == "outcome") {
                if(nodejs.outcome[nodejs.jIndex[i][1]].jAttr.prob != undefined ) {
                    node.iset.moves[i].changeName(nodejs.outcome[nodejs.jIndex[i][1]].jAttr.prob);
                } else  {
                    node.iset.moves[i].changeText(nodejs.outcome[nodejs.jIndex[i][1]].jAttr.move);
                }
            }
        }
    };

    /**
    * Function that assigns payoffs to the
    * given node
    * @param {nodejs} Node in json format
    * @param {node} Reference to the node
    */
    XmlImporter.prototype.assignPayoffs = function (nodejs, node) {
        if(nodejs.jIndex != undefined) {
            for( var i = 0 ; i < nodejs.jIndex.length ; i++) {
                if(nodejs.jIndex[i][0] == "node") {
                    this.assignPayoffs(nodejs.node[nodejs.jIndex[i][1]], node.children[i]);
                }
                if(nodejs.jIndex[i][0] == "outcome") {
                    var outcome = nodejs.outcome[nodejs.jIndex[i][1]];
                    for(var j = 0; j<outcome.payoff.length;j++) {
                        var index1 = GTE.tree.players.map(function(el) {
                          return el.name;
                        }).indexOf(outcome.payoff[j].jAttr.player);
                        var index = GTE.tree.players[index1].payoffs.map(function(el) {
                          return el.leaf;
                        }).indexOf(node.children[i]);
                        if(index != -1) {
                            GTE.tree.players[index1].payoffs[index].setValue(outcome.payoff[j].jValue);
                            GTE.tree.players[index1].payoffs[index].changeText(outcome.payoff[j].jValue);
                        }
                    }
                }
            }
        }
    };

    // Add class to parent module
    parentModule.XmlImporter = XmlImporter;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
