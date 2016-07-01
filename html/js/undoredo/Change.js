GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Change.
    * @class
    * @param {node} Represents the node that was affected by this change.
    */
    function Change(node, mode, from, to) {
        this.node = node;
        this.mode = mode;
        this.from = from || null;
        this.to = to || null;
    }

    Change.prototype.undo = function() {
        switch (this.mode) {
            case GTE.MODES.ADD:
                this.node.delete();
                GTE.tree.positionsUpdated = false;
                GTE.tree.draw();
                break;
            case GTE.MODES.DELETE:
                this.node.player = this.from.player;
                this.node.parent = this.from.parent;
                this.node.reachedBy = this.from.reachedBy;
                if(this.node.parent != null) {
                    this.node.parent.children.splice(this.from.index, 0, this.node);
                }
                GTE.tree.positionsUpdated = false;
                GTE.tree.draw();
                break;
            case GTE.MODES.MERGE:

                break;
            case GTE.MODES.DISSOLVE:

                break;
            case GTE.MODES.PLAYER_ASSIGNMENT:
                if(this.from) {
                    this.node.assignPlayer(this.from);
                } else {
                    this.node.deassignPlayer();
                }
                GTE.tree.draw();
                break;
            default:
                break;
        }
    };

    // Add class to parent module
    parentModule.Change = Change;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module