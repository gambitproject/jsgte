GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Change.
    * @class
    * @param {node} Represents the node that was affected by this change.
    */
    function Change(node, from, to) {
        var node = node || null;
        var from = from || null;
        var to = to || null;
        var mode = mode || null;
    }

    Change.prototype.undo = function() {
        switch (this.mode) {
            case GTE.MODES.ADD:

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
    parentModule.Change = Change;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module