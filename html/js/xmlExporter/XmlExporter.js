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
        this.endProperty("gte", 0);
    };

    XmlExporter.prototype.startProperty = function(property_name, parameters, tab) {
        var append = this.assignTab(tab);
        append += "<"+property_name+" ";
        for(var parameter in parameters) {
            append += parameter;
            append += "=\"";
            append += parameters[parameter];
            append += "\"";
            append += " ";
        }
        append += ">\n";
        this.tree += append;
    };

    XmlExporter.prototype.endProperty = function(property_name, tab) {
        var append = this.assignTab(tab);
        append += "<"+property_name+">\n";
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

    };

    XmlExporter.prototype.toString = function() {
        console.log(this.tree);
    };

    // Add class to parent module
    parentModule.XmlExporter = XmlExporter;
    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
