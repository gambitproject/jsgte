GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Changes Object.
    * @class
    * @param {type} Represents the type of the changes.
    */
    function Changes(unit, select, mode) {
        this.queue = [];
        this.select = select || null;
        this.toggleQueue = null;
    }

    Changes.prototype.undo = function() {
        var changes = new GTE.TREE.Changes();
        for(var i = this.queue.length-1; i>=0; i--) {
            this.queue[i].convertChangeToRedo(changes);
        }
        GTE.REDOQUEUE.push(changes);
        for(var i = this.queue.length-1; i>=0; i--) {
            this.queue[i].execute();
        }
        GTE.tree.draw();
        if(this.select) {
            this.iset.select();
        } else if (GTE.tree.selected.length > 0) {
            var iset = GTE.tree.selected[0];
            if (iset.shape !== null) {
                iset.shape.toggleClass('selected');
            }
            var nodes = iset.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].select();
            }
        }
    };

    Changes.prototype.redo = function() {
        var changes = new GTE.TREE.Changes();
        for(var i = this.queue.length-1; i>=0; i--) {
            this.queue[i].convertChangeToRedo(changes);
        }
        GTE.UNDOQUEUE.push(changes);
        for(var i = this.queue.length-1; i>=0; i--) {
            this.queue[i].execute();
        }
        GTE.tree.draw();
        if(this.select) {
            this.iset.select();
        } else if (GTE.tree.selected.length > 0) {
            var iset = GTE.tree.selected[0];
            if (iset.shape !== null) {
                iset.shape.toggleClass('selected');
            }
            var nodes = iset.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].select();
            }
        }
    };

    Changes.prototype.addChange = function(mode, node, iset) {
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
                if(node.iset !== null) {
                    newNode.iset = node.iset;
                }
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
                var change = new GTE.TREE.Change(node, GTE.MODES.PLAYER_ASSIGNMENT, node.player, GTE.tree.getActivePlayer());
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

    Changes.prototype.pushSingleNodeWithRemovedIset = function(node) {
        var change = new GTE.TREE.Change(node, GTE.MODES.MERGE, node.iset);
        change.from = node.iset;
        this.queue.push(change);
    }

    Changes.prototype.pushRemovedIset = function(iset) {
        var change = new GTE.TREE.Change(iset, GTE.UNDO.POPISET);
        change.index = GTE.tree.isets.indexOf(iset);
        this.queue.push(change);
    }

    Changes.prototype.assignChangesOnDeletingIset = function(iset) {
        var children = iset.getChildrenNodes();
        for(var i = 0; i<children.length; i++) {
            this.assignIsetOnDeletingIsetToNode(children[i]);
        }
        for(var i = 0; i<children.length; i++) {
            this.assignChangesOnDeletingIsetToNode(children[i]);
        }
        var nodes = iset.getNodes();
        for(var i = 0; i<nodes.length; i++) {
            this.addChange(GTE.MODES.PLAYER_ASSIGNMENT, nodes[i]);
        }
        this.assignMovesOnDeletingIset(iset);
        for(var i = 0; i<GTE.tree.isets.length; i++) {
            this.pushRemovedIset(GTE.tree.isets[i]);
        }
    }

    Changes.prototype.assignChangesOnDeletingIsetToNode = function(node) {
        for(var i = 0; i<node.children.length; i++) {
            this.assignChangesOnDeletingIsetToNode(node.children[i]);
        }
        this.addChange(GTE.MODES.DELETE, node);
    }

    Changes.prototype.assignIsetOnDeletingIsetToNode = function(node) {
        for(var i = 0; i<node.children.length; i++) {
            this.assignIsetOnDeletingIsetToNode(node.children[i]);
        }
        this.queue.push(new GTE.TREE.Change(node, GTE.UNDO.ASSIGNISET, node.iset));
    }

    Changes.prototype.assignMovesOnDeletingIset = function(iset) {
        var children = iset.getChildrenNodes();
        for(var i = 0; i<children.length; i++) {
            this.assignMovesOnDeletingIset(children[i].iset);
        }
        for(var i = iset.moves.length-1; i>=0 ; i--) {
            var change = new GTE.TREE.Change(iset, GTE.UNDO.POPMOVES);
            change.index = i;
            change.move = iset.moves[i];
            this.queue.push(change);
        }
    }

    Changes.prototype.assignSingletonIsetDeletion = function(iset) {
        this.queue.push(new GTE.TREE.Change(iset.firstNode, GTE.UNDO.ASSIGNISET, iset.firstNode.iset));
        this.pushRemovedIset(iset);
        this.assignMovesOnDeletingIset(iset.firstNode.parent.iset);
        this.addChange(GTE.MODES.PLAYER_ASSIGNMENT, iset.firstNode.parent);
        this.addChange(GTE.MODES.DELETE, iset.firstNode);
    }

    Changes.prototype.pushChangesBeforeDissolving = function(iset) {
        var nodes = iset.getNodes();
        if(nodes.length <= 1)
            return false;
        for(var i = 0; i<nodes.length; i++) {
            this.queue.push(new GTE.TREE.Change(nodes[i], GTE.UNDO.ASSIGNISET, iset, true));
        }
        this.assignMovesOnDeletingIset(iset);
        this.pushRemovedIset(iset);
    }

    Changes.prototype.pushChangesAfterAddingIsets = function(iset) {
        this.queue.push(new GTE.TREE.Change(iset, GTE.UNDO.ADDISET));
    }

    Changes.prototype.pushChangesAfterAddingIsetsToArray = function(isets) {
        for(var i = 0; i<isets.length; i++) {
            this.pushChangesAfterAddingIsets(isets[i]);
        }
    }

    Changes.prototype.pushToQueue = function() {
        GTE.UNDOQUEUE.push(this);
    }

    Changes.prototype.endSetOfChanges = function() {
        this.pushToQueue();
    }
    // Add class to parent module
    parentModule.Changes = Changes;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
