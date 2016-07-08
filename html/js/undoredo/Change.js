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
                this.node.deleted = false;
                if(this.node.parent !== null) {
                    this.node.parent.children.splice(this.from.index, 0, this.node);
                }
                GTE.tree.positionsUpdated = false;
                break;
            case GTE.MODES.MERGE:
                if(this.selected) {
                    if (this.node.shape !== null) {
                        this.node.shape.toggleClass('selected');
                    }
                } else {
                    this.node.changeISet(this.from);
                }
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
            case GTE.UNDO.POPSELECTEDQUEUE:
                GTE.tree.selected.pop();
                break;
            case GTE.UNDO.INITIALIZEISETS:
                GTE.tree.deinitializeISets();
                break;
            case GTE.UNDO.POPISET:
                if(GTE.tree.isets.indexOf(this.node) == -1)
                    GTE.tree.isets.splice(this.index, 0, this.node);
                break;
            case GTE.UNDO.ASSIGNMOVES:
                this.node.reassignMoves();
                break;
            case GTE.UNDO.POPMOVES:
                if(this.node.moves.indexOf(this.move) == -1) {
                    this.node.moves.splice(this.index, 0, this.move);
                }
                break;
            case GTE.UNDO.ASSIGNISET:
               this.from.addNode(this.node);
                break;
            default:
                break;
        }
    };

    // Add class to parent module
    parentModule.Change = Change;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module