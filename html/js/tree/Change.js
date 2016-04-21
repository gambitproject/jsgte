GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new instance of change Class.
    * @class
    * @param {mode} Represents the mode of the Change.
    * 0 : Addition of nodes
    * 1 : Deletion of nodes
    * 2 : Player Assignment
    */
    function Change(mode) {
        this.mode = mode;
        this.nodes = [];
    }

    /**
    * Calls the corresponding function to revert to previous state
    * according to the mode of the change.
    */
    Change.prototype.undo = function () {
            if(this.mode === GTE.MODES.ADD)
                this.deleteNodes();
            if(this.mode === GTE.MODES.DELETE)
                this.addNodes();
            if(this.mode === GTE.MODES.PLAYER_ASSIGNMENT)
                this.assignPlayer();
    };

    /**
    * Deletes the nodes that were added in the previous move
    */
    Change.prototype.deleteNodes = function() {
        for(var i = 0 ; i < this.nodes.length; i++) {
            this.nodes[i].delete();
        }
        GTE.tree.draw();
    };

    /**
    * Adds the nodes that were deleted in the previous move
    */
    Change.prototype.addNodes = function() {
        for(var i = 0; i < this.nodes.length; i++) { 
            this.nodes[i].node.add(this.nodes[i].player,this.nodes[i].parent,this.nodes[i].iset,this.nodes[i].reachedBy);
        }
        GTE.tree.draw();
    };

    /**
    * Assigns players to their values before the previous move
    */
    Change.prototype.assignPlayer = function() {
        for(var i = 0;i < this.nodes.length; i++) {
            if(this.nodes[i].oldPlayer != null) {
                this.nodes[i].node.assignPlayer(this.nodes[i].oldPlayer);
            }
            else {
                this.nodes[i].node.deassignPlayer();
            }
        }
        GTE.tree.draw();
    };

    // Add class to parent module
    parentModule.Change = Change;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
