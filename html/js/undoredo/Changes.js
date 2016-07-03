GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Changes Object.
    * @class
    * @param {type} Represents the type of the changes.
    */
    function Changes(mode) {
        this.queue = [];
    }

    Changes.prototype.undo= function() {
        for (var i = 0; i<this.queue.length; i++) {
            this.queue[i].undo();
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
                    var firstSelected = GTE.tree.selected.pop();
                    // There are two selected nodes. Merge
                    if (this !== firstSelected) {
                        GTE.tree.merge(firstSelected, this);
                    }
                    GTE.tree.draw();
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


    // Add class to parent module
    parentModule.Changes = Changes;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
