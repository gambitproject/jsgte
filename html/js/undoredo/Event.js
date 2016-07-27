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


    Event.prototype.execute = function() {
        var curMode = GTE.MODE;
        GTE.MODE  = this.mode;
        this.unit.onClick();
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
    // Add class to parent module
    parentModule.Event = Event;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module