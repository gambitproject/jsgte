GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new instance of change Class.
    * @class
    * @param {Node}   parent Parent node. If null, this is root.
    * @param {Player} player Node's player
    */
    function Change(mode) {
        this.mode = mode;
        this.nodes = [];
    }

    Change.prototype.undo = function () {
            if(this.mode==0)
                this.deleteNodes();
            if(this.mode==1)
                this.addNodes();
            if(this.mode==2)
                this.assignPlayer();
    };

    Change.prototype.deleteNodes = function() {
        for(var i=0;i<this.nodes.length;i++)
            this.nodes[i].delete();
        GTE.tree.draw();
    };

    Change.prototype.addNodes = function() {
        for(var i=0;i<this.nodes.length;i++) 
            this.nodes[i].node.add(this.nodes[i].player,this.nodes[i].parent,this.nodes[i].iset,this.nodes[i].reachedBy);
        GTE.tree.draw();
    };

    Change.prototype.assignPlayer = function() {
        for(var i=0;i<this.nodes.length;i++) {
            if(this.nodes[i].oldPlayer != null)
                this.nodes[i].node.assignPlayer(this.nodes[i].oldPlayer);
            else
                this.nodes[i].node.deassignPlayer();
        }
        GTE.tree.draw();
    };

    // Add class to parent module
    parentModule.Change = Change;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
