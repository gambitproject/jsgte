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
        this.endProperty("gte", 0);
    };

    XmlExporter.prototype.startProperty = function(property_name, parameters, tab, body) {
        var append = this.assignTab(tab);
        append += "<"+property_name;
        for(var parameter in parameters) {
            append += (" "+parameter);
            append += "=\"";
            append += parameters[parameter];
            append += "\"";
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

    XmlExporter.prototype.toString = function() {
        console.log(this.tree);
    };

    // Add class to parent module
    parentModule.XmlExporter = XmlExporter;
    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
