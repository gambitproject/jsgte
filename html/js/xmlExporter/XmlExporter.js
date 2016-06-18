GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new xml Exporter
    * @class
    */
    function XmlExporter() {
        this.tree = "";
    };

    XmlExporter.prototype.exportTree = function() {
        this.exportGTE();
    };

    XmlExporter.prototype.exportGTE = function() {
        this.startProperty("gte", {version : "0.1"}, 0);
        this.exportDisplayProperties();
        this.exportPlayers();
        this.exportExtensiveForm();
        this.endProperty("gte", 0);
    };

    XmlExporter.prototype.startProperty = function(property_name, parameters, tab, body) {
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

    XmlExporter.prototype.endProperty = function(property_name, tab) {
        var append = this.assignTab(tab);
        append += "</"+property_name+">\n";
        this.tree += append;
    };

    XmlExporter.prototype.addBody = function(property_name, tab) {
        var append = this.assignTab(tab);
        append += property_name+"\n";
        this.tree += append;
    };


    XmlExporter.prototype.assignTab = function(tab) {
        var string = "";
        for(var i = 0; i<tab; i++) {
            string = string + "\t";
        }
        return string;
    };

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

    XmlExporter.prototype.exportPlayers = function() {
        this.startProperty("players", {}, 1);
        for(var i = 1; i<GTE.tree.players.length;i++) {
            this.startProperty("player", {playerId : i}, 2);
            this.addBody(GTE.tree.players[i].name, 3);
            this.endProperty("player", 2);
        }
        this.endProperty("players",1);
    };

    XmlExporter.prototype.exportExtensiveForm= function() {
        this.startProperty("extensiveForm", {}, 1);
        this.exportNodes();
        this.endProperty("extensiveForm",1);
    };

    XmlExporter.prototype.exportNodes = function() {
        if(GTE.tree.root.player == null) {
            this.exportNode(GTE.tree.root, {}, 2);
        } else {
            this.exportNode(GTE.tree.root, {player: GTE.tree.root.player.name}, 2);
        }
    };

    XmlExporter.prototype.exportNode = function(node, parameters, tab) {
        if(node.children.length == 0 ) {
            // export as an outcome
            this.startProperty("outcome", parameters, tab);
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

    XmlExporter.prototype.toString = function() {
        console.log(this.tree);
    };

    // Add class to parent module
    parentModule.XmlExporter = XmlExporter;
    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
