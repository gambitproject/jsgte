GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new xml Exporter
    * @class
    */
    function XmlExporter() {
        this.tree = "";
    };

    /**
    * Exports the tree to xml format
    */
    XmlExporter.prototype.exportTree = function() {
        this.exportGTE();
    };

    /**
    * Exports the GTE section of the xml tree
    */
    XmlExporter.prototype.exportGTE = function() {
        this.startProperty("gte", {version : "0.1"}, 0);
        this.exportDisplayProperties();
        this.exportPlayers();
        this.exportExtensiveForm();
        this.endProperty("gte", 0);
    };

    /**
    *  Function that adds properties in
    *  xml format.
    *  @param {property_name} Name of the property to be exported
    *  @param {parameters} Parameters to be associated with the property
    *  @param {tab} The amount of tab space to be left in the beginning.
    */
    XmlExporter.prototype.startProperty = function(property_name, parameters, tab) {
        var append = this.assignTab(tab);
        append += "<"+property_name;
        for(var parameter in parameters) {
            if(parameters[parameter] != undefined) {
                append += (" "+parameter);
                append += "=\"";
                append += parameters[parameter];
                append += "\"";
            }
        }
        append += ">\n";
        this.tree += append;
    };

    /**
    * Function that adds an ending tag
    * to a particular property
    * @param {property_name} Name of the proprety to be exported
    * @param {tab} The amount of tab space associated with the closing tag
    */
    XmlExporter.prototype.endProperty = function(property_name, tab) {
        var append = this.assignTab(tab);
        append += "</"+property_name+">\n";
        this.tree += append;
    };

    /**
    * Function that adds material between the
    * starting and ending tag
    * @param {property_name} The content of the body to be added
    * @param {tab} The amount of tab space to be left in the beginning
    */
    XmlExporter.prototype.addBody = function(property_name, tab) {
        var append = this.assignTab(tab);
        append += property_name+"\n";
        this.tree += append;
    };

    /**
    * Function that assigns tab space
    * to the beginning of a tag
    */
    XmlExporter.prototype.assignTab = function(tab) {
        var string = "";
        for(var i = 0; i<tab; i++) {
            string = string + "\t";
        }
        return string;
    };

    /**
    * Function that exports the properties inside
    * the display tag of the xml tree
    */
    XmlExporter.prototype.exportDisplayProperties = function(tab_space) {
        this.startProperty("display", {}, 1);
        for(var i = 1; i<GTE.tree.players.length; i++) {
            this.startProperty("color", {player : i}, 2);
            this.addBody(GTE.tree.players[i].colour, 3);
            this.endProperty("color", 2);
        }
        this.startProperty("font", {}, 2);
        this.addBody("Times", 3);
        this.endProperty("font", 2);

        this.startProperty("strokeWidth", {}, 2);
        this.addBody(GTE.STORAGE.settingsLineThickness, 3);
        this.endProperty("strokeWidth", 2);

        this.startProperty("nodeDiameter", {}, 2);
        this.addBody(GTE.STORAGE.settingsCircleSize, 3);
        this.endProperty("nodeDiameter", 2);

        this.startProperty("isetDiameter", {}, 2);
        this.addBody(GTE.STORAGE.settingsLineThickness, 3);
        this.endProperty("isetDiameter", 2);

        this.startProperty("levelDistance", {}, 2);
        this.addBody(GTE.STORAGE.settingsDistLevels, 3);
        this.endProperty("levelDistance", 2);

        this.endProperty("display",1);
    };

    /**
    * Function that exports players inside the
    * player tag of the xml tree
    */
    XmlExporter.prototype.exportPlayers = function() {
        this.startProperty("players", {}, 1);
        for(var i = 1; i<GTE.tree.players.length;i++) {
            this.startProperty("player", {playerId : i}, 2);
            this.addBody(GTE.tree.players[i].name, 3);
            this.endProperty("player", 2);
        }
        this.endProperty("players",1);
    };

    /**
    * Function that exports the properties
    * inside the extensiveForm tag
    */
    XmlExporter.prototype.exportExtensiveForm= function() {
        this.startProperty("extensiveForm", {}, 1);
        this.exportNodes();
        this.endProperty("extensiveForm",1);
    };

    /**
    * Function that exports the nodes
    * in the final xml tree
    */
    XmlExporter.prototype.exportNodes = function() {
        if(GTE.tree.root.player == null) {
            this.exportNode(GTE.tree.root, {}, 2);
        } else {
            this.exportNode(GTE.tree.root, {player: GTE.tree.root.player.name}, 2);
        }
    };

    /**
    * Funciton that adds payoff tags
    * to outcomes in the final xml tree
    */
    XmlExporter.prototype.assignPayoff = function(player, payoff, tab) {
        this.startProperty("payoff", {player : player.name,}, tab);
        this.addBody(payoff.value, tab+1);
        this.endProperty("payoff", tab);
    }

    /**
    * Function that exports node tags
    * recursively to the xml tree
    */
    XmlExporter.prototype.exportNode = function(node, parameters, tab) {
        if(node.children.length == 0 ) {
            // export as an outcome
            this.startProperty("outcome", parameters, tab);
            if(GTE.tools.isetToolsRan) {
                // assign payoffs
                for(var i=1; i<GTE.tree.players.length;i++) {
                    var index = GTE.tree.players[i].payoffs.map(function(el) {
                          return el.leaf;
                    }).indexOf(node);
                    this.assignPayoff(GTE.tree.players[i], GTE.tree.players[i].payoffs[index], tab+1);    
                }
            }
            this.endProperty("outcome", tab);
        } else {
            //exprot nodes
            this.startProperty("node", parameters, tab);
            for(var i = 0; i<node.children.length; i++) {
                if(GTE.tools.isetToolsRan) {
                    if(node.children[i].player == null) {
                        if((node.iset.moves[i]).__proto__.constructor.name == "ChanceMove") {
                            this.exportNode(node.children[i], {prob : node.iset.moves[i].name, iset : GTE.tree.isets.indexOf(node.children[i].iset)}, tab+1);
                        } else {
                            this.exportNode(node.children[i], {move : node.iset.moves[i].name, iset : GTE.tree.isets.indexOf(node.children[i].iset)}, tab+1);
                        }
                    } else {
                        if((node.iset.moves[i]).__proto__.constructor.name == "ChanceMove") {
                            this.exportNode(node.children[i], {player : node.children[i].player.name, prob : node.iset.moves[i].name, iset : GTE.tree.isets.indexOf(node.children[i].iset)}, tab+1);
                        } else {
                            this.exportNode(node.children[i], {player : node.children[i].player.name, move : node.iset.moves[i].name, iset : GTE.tree.isets.indexOf(node.children[i].iset)}, tab+1);
                        }
                    }

                } else {
                    if(node.children[i].player == null) {
                        this.exportNode(node.children[i], {}, tab+1);
                    } else {
                        this.exportNode(node.children[i], {player : node.children[i].player.name}, tab+1);
                    }
                }
            }
            this.endProperty("node", tab);
        }
    };

    /**
    * Funciton that returns the tree
    * in xml format
    */
    XmlExporter.prototype.toString = function() {
        return "Tree in xml :\n"+this.tree;
    };

    // Add class to parent module
    parentModule.XmlExporter = XmlExporter;
    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
