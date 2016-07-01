GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Changes Object.
    * @class
    * @param {type} Represents the type of the changes.
    */
    function Changes(mode) {
        var change = [];
    }

    Changes.prototype.undo= function() {
        for (var i = 0; i<this.changes.length; i++) {
            this.changes[i].undo();
        }
    };
    // Add class to parent module
    parentModule.Changes = Changes;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
