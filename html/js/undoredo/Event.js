GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Event.
    * @class
    */
    function Event(unit, mode, type) {
        this.unit = unit;
        this.mode = mode;
        this.type = type;
        this.coordinates = this.findCoordinates(unit);
    }


    Event.prototype.redo = function() {
        var curMode = GTE.MODE;
        GTE.MODE  = this.mode;
        var node = this.getNode();
        switch (this.type) {
            case GTE.REDO.NODE:
                node.onClick();
                break;
            case GTE.REDO.ISET:
                node.iset.onClick();
                break;
            case GTE.REDO.MULTIACTIONLINE:
                this.getMultiactionLine(node).onClick();
            break;
        }


        GTE.MODE = curMode;
    };

    Event.prototype.findCoordinates = function(node) {
        var coordinates = [];
        while(node.parent != null) {
            coordinates.push(node.parent.children.indexOf(node));
            node = node.parent;
        }
        return coordinates.reverse();
    }

    Event.prototype.getNode = function() {
        var node = GTE.tree.root;
        for(var i = 0; i < this.coordinates.length; i++) {
            node = node.children[this.coordinates[i]];
        }
        return node;
    }

    Event.prototype.getMultiactionLine = function(node) {
        for(var i = 0; i<GTE.tree.multiActionLines.length; i++) {
            if(GTE.tree.multiActionLines[i].nodesInLine.indexOf(node) != -1) {
                return GTE.tree.multiActionLines[i];
            }
        }
        throw "Exception : Multiaction line not found";
    }
    // Add class to parent module
    parentModule.Event = Event;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module