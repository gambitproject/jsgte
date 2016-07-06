GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Changes Object.
    * @class
    * @param {type} Represents the type of the changes.
    */
    function Changes(mode, select ) {
        this.queue = [];
        this.select = select || null;
    }

    Changes.prototype.undo= function() {
        while(this.queue.length != 0) {
            this.queue.pop().undo();
        }
        GTE.tree.draw();
        if(this.select) {
            this.iset.select();
        }
    };

    Changes.prototype.addChange= function(mode, node, iset) {
        switch (mode) {
            case GTE.MODES.ADD:
                var change = new GTE.TREE.Change(node, GTE.MODES.ADD);
                this.queue.push(change);
                break;
            case GTE.MODES.DELETE:
                var newNode = new GTE.TREE.Node();
                newNode.player = node.player;
                newNode.parent = node.parent;
                newNode.reachedBy = node.reachedBy;
                if(node.parent != null) {
                    newNode.index = node.parent.children.indexOf(node);
                }
                var change = new GTE.TREE.Change(node, GTE.MODES.DELETE, newNode);
                this.queue.push(change)
                break;
            case GTE.MODES.MERGE:
                if (GTE.tree.selected.length > 0 ) {
                    var selectedIset = GTE.tree.selected[0];
                    var nodesInA = selectedIset.getNodes();
                    var change = new GTE.TREE.Change(selectedIset, GTE.UNDO.POPISET);
                    change.index = GTE.tree.isets.indexOf(selectedIset);
                    this.queue.push(change);
                    for (var i = 0; i < nodesInA.length; i++) {
                        var change = new GTE.TREE.Change(nodesInA[i], GTE.MODES.MERGE, selectedIset);
                        change.from = selectedIset;
                        this.queue.push(change);
                    }
                } else {
                    if (iset.shape !== null) {
                        var change =  new GTE.TREE.Change(iset, GTE.MODES.MERGE);
                        change.selected = true;
                        this.queue.push(change);
                    }
                    var nodes = iset.getNodes();
                    for (var i = 0; i < nodes.length; i++) {
                        var change =  new GTE.TREE.Change(nodes[i], GTE.MODES.MERGE);
                        change.selected = true;
                        this.queue.push(change);
                    }
                    this.queue.push(new GTE.TREE.Change(iset, GTE.UNDO.POPSELECTEDQUEUE))
                }
                break;
            case GTE.MODES.DISSOLVE:

                break;
            case GTE.MODES.PLAYER_ASSIGNMENT:
                var change = new GTE.TREE.Change(node, GTE.MODES.PLAYER_ASSIGNMENT, node.player, null);
                this.queue.push(change);
                break;
            default:
                break;
        }
    };

    Changes.prototype.pushChildrenDeleted = function(node) {
        for(var i = 0; i<node.children.length; i++) {
            this.addChange(GTE.MODES.DELETE, node.children[i]);
            this.pushChildrenDeleted(node.children[i]);
        }
    };

    Changes.prototype.pushSingletonChange = function(mode, node, from) {
        this.queue.push(new GTE.TREE.Change(node, mode, from));
    };

    Changes.prototype.pushMultiactionMerge = function(iset, mergedIset) {
        var selectedIset = iset;
        var nodesInA = selectedIset.getNodes();
        var change = new GTE.TREE.Change(selectedIset, GTE.UNDO.POPISET);
        change.index = GTE.tree.isets.indexOf(selectedIset);
        this.queue.push(change);
        for (var i = 0; i < nodesInA.length; i++) {
            var change = new GTE.TREE.Change(nodesInA[i], GTE.MODES.MERGE, selectedIset);
            change.from = selectedIset;
            this.queue.push(change);
        }
    }
    // Add class to parent module
    parentModule.Changes = Changes;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
