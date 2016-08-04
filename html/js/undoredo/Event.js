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
        if(this.mode != GTE.UNDO.INITIALIZEISETS && this.mode != GTE.UNDO.BUTTONSWITCH)
            this.coordinates = this.findCoordinates(unit);
        if(this.mode == GTE.MODES.PLAYER_ASSIGNMENT) {
            this.player = GTE.tools.activePlayer;
        }
    }


    Event.prototype.redo = function() {
        if(this.mode == GTE.UNDO.INITIALIZEISETS) {
            GTE.tools.switchMode(GTE.MODES.MERGE);
            return;
        }
        var curMode = GTE.MODE;
        var pl = GTE.tools.activePlayer;
        GTE.tools.activePlayer = this.player;
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
            case GTE.UNDO.BUTTONSWITCH:
                this.unit.click();
        }
        GTE.tools.activePlayer = pl;
        GTE.MODE = curMode;
        GTE.tools.switchMode(GTE.MODE);
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