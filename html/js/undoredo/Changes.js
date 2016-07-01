GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Changes Object.
    * @class
    * @param {type} Represents the type of the changes.
    */
    function Changes(mode) {
        var queue = [];
    }

    Changes.prototype.undo= function() {
        for (var i = 0; i<this.queue.length; i++) {
            this.queue[i].undo();
        }   
    };

    Changes.prototype.addChange= function(mode, node) {
        switch (mode) {
            case GTE.MODES.ADD:
                var change = new GTE.TREE.Change(node, GTE.MODES.ADD);
                this.queue.push(change);
                break;
            case GTE.MODES.DELETE:

                break;
            case GTE.MODES.MERGE:

                break;
            case GTE.MODES.DISSOLVE:

                break;
            case GTE.MODES.PLAYER_ASSIGNMENT:

                break;
            default:
                break;
        }
    };

    // Add class to parent module
    parentModule.Changes = Changes;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
